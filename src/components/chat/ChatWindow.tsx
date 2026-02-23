"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, ExternalLink, MessageCircle, Image as ImageIcon, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaces } from "@/context/WorkspaceContext";
import ChatBubble from "./ChatBubble";

interface MessageContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface Message {
  role: "user" | "assistant";
  content: string | MessageContentPart[];
}

interface ChatWindowProps {
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  "What should I work on today?",
  "Create a new project",
  "Show me risky deadlines",
  "Summarize my week",
];

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaces();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingImages, setPendingImages] = useState<string[]>([]); // base64 data URLs
  const [isDragOver, setIsDragOver] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, pendingImages]);

  /**
   * Compress an image file using canvas — resizes to max 1024px and encodes
   * as JPEG @ 75% quality. Keeps payloads well under OpenRouter's 4.5MB limit.
   */
  const compressImage = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new window.Image();
        img.onerror = reject;
        img.onload = () => {
          const MAX = 1024;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width > height) {
              height = Math.round((height * MAX) / width);
              width = MAX;
            } else {
              width = Math.round((width * MAX) / height);
              height = MAX;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Canvas not supported"));
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });

  /** Process dropped or pasted image files */
  const handleImageFiles = useCallback(async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;
    const dataUrls = await Promise.all(imageFiles.map(compressImage));
    setPendingImages((prev): string[] => [...prev, ...dataUrls]);
  }, []);

  /** Drag-and-drop handlers */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        await handleImageFiles(e.dataTransfer.files);
      }
    },
    [handleImageFiles]
  );

  /** Paste handler — capture images from clipboard */
  const handlePaste = useCallback(
    async (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData.items).filter((i) =>
        i.type.startsWith("image/")
      );
      if (items.length === 0) return;
      const files = items.map((i) => i.getAsFile()).filter(Boolean) as File[];
      await handleImageFiles(files);
    },
    [handleImageFiles]
  );

  const removePendingImage = (index: number) => {
    setPendingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (text: string) => {
    const hasContent = text.trim() || pendingImages.length > 0;
    if (!hasContent) return;

    // Build multimodal content if images are attached
    let userContent: string | MessageContentPart[];
    if (pendingImages.length > 0) {
      const parts: MessageContentPart[] = [];
      // Add images first
      for (const dataUrl of pendingImages) {
        parts.push({ type: "image_url", image_url: { url: dataUrl } });
      }
      // Add text (or a default prompt if none provided)
      parts.push({
        type: "text",
        text: text.trim() || "Please analyze this image and extract all tasks, action items, or requirements you can find. Create tasks for each one.",
      });
      userContent = parts;
    } else {
      userContent = text.trim();
    }

    const userMsg: Message = { role: "user", content: userContent };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPendingImages([]);
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: {
            page: window.location.pathname,
            workspaceId: activeWorkspace?.id,
            workspaceName: activeWorkspace?.name,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Chat Error Context:", errorData);
        throw new Error(errorData.details || "Stream failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      let assistantContent = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        assistantContent += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantContent;
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Apologies, my neural link is flickering. Please try again soon.",
        },
      ]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("refresh-tasks"));
      }, 500);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-[420px] h-dvh sm:h-[600px] bg-cream sm:bg-cream/90 sm:glass-panel flex flex-col overflow-hidden z-100 sm:border border-t border-soft-blue/20 sm:rounded-xl sm:shadow-xl transition-all ${
          isDragOver ? "ring-2 ring-soft-blue ring-inset bg-soft-blue/5" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drop overlay */}
        {isDragOver && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-soft-blue/10 backdrop-blur-sm pointer-events-none rounded-xl">
            <ImageIcon className="w-10 h-10 text-soft-blue mb-3" />
            <p className="font-syne font-bold text-sage-deep text-sm">Drop image to analyze</p>
            <p className="text-xs text-sage-deep/50 mt-1">FlowBoard AI will extract tasks automatically</p>
          </div>
        )}

        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-soft-blue/5 blur-[50px] -z-10 rounded-full hidden sm:block" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-light-green/5 blur-[50px] -z-10 rounded-full hidden sm:block" />

        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-sage-deep/15" />
        </div>

        {/* Header */}
        <div className="shrink-0 px-5 sm:px-6 py-4 sm:py-5 border-b border-border-soft flex items-center justify-between bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-syne font-bold text-sage-deep text-base sm:text-lg tracking-tight">FlowBoard AI</h3>
              <div className="w-2 h-2 rounded-full bg-light-green" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-sage-deep/40">
              Your Intelligent Workspace Assistant
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-soft-blue/10 rounded-full border border-soft-blue/20"
              title="Drop images or paste screenshots"
            >
              <ImageIcon className="w-3 h-3 text-soft-blue" />
              <span className="text-[9px] font-mono text-soft-blue uppercase tracking-widest">Vision</span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 sm:w-auto sm:h-auto sm:p-2 flex items-center justify-center hover:bg-soft-blue/10 rounded-full transition-colors text-sage-deep/60"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-5 sm:space-y-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16  bg-surface-tinted flex items-center justify-center border border-soft-blue/10">
                <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-soft-blue" />
              </div>
              <div className="space-y-2">
                <h4 className="font-syne font-bold text-sage-deep text-sm sm:text-base">Strategic Guidance Starts Here</h4>
                <p className="text-sm text-sage-deep/60 max-w-[260px] sm:max-w-[240px]">
                  Ask me anything, or drop a screenshot to auto-extract tasks.
                </p>
              </div>

              {/* Vision hint card */}
              <div className="flex items-start gap-3 w-full bg-soft-blue/5 border border-soft-blue/15 rounded-xl p-3.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-soft-blue/15 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4 text-soft-blue" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sage-deep">Vision Analysis</p>
                  <p className="text-[11px] text-sage-deep/55 mt-0.5 leading-relaxed">
                    Drop a screenshot, whiteboard, or mockup — AI will read it and create tasks automatically.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 w-full">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-left px-4 py-3.5 sm:py-3 text-sm text-sage-deep/80 bg-white/60 border border-border-soft rounded-xl hover:border-soft-blue/40 hover:bg-soft-blue/5 transition-all group min-h-[44px] active:scale-[0.98]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className="space-y-2">
                  <ChatBubble role={msg.role} content={msg.content} />
                  {msg.role === "assistant" && typeof msg.content === "string" && msg.content.includes("Task synchronized") && (
                    <div className="flex justify-start pl-4 pb-2">
                      <button
                        onClick={() => router.push("/dashboard/tasks")}
                        className="flex items-center gap-2 px-4 py-2.5 bg-light-green text-sage-deep text-[10px] font-bold uppercase tracking-wider rounded-full shadow-soft hover:bg-light-green/90 transition-all border border-dark-green/10 min-h-[44px] cursor-pointer hover:scale-105"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Live Task List
                      </button>
                    </div>
                  )}
                  {msg.role === "assistant" &&
                    typeof msg.content === "string" &&
                    msg.content.toLowerCase().includes("project") &&
                    !msg.content.includes("Task synchronized") && (
                      <div className="flex justify-start pl-4 pb-2">
                        <button
                          onClick={() => router.push("/dashboard")}
                          className="flex items-center gap-2 px-4 py-2.5 bg-soft-blue text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-soft hover:bg-soft-blue/90 transition-all min-h-[44px] cursor-pointer hover:scale-105"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open Project Workspace
                        </button>
                      </div>
                    )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-cream-warm border border-border-soft px-4 py-3  rounded-tl-none">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-soft-blue opacity-50 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-soft-blue opacity-50 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-soft-blue opacity-50 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pending Image Previews */}
        {pendingImages.length > 0 && (
          <div className="shrink-0 px-4 pt-3 flex gap-2 flex-wrap bg-white/60 border-t border-border-soft">
            {pendingImages.map((src, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Pending ${i}`}
                  className="w-14 h-14 object-cover rounded-lg border border-soft-blue/30"
                />
                <button
                  onClick={() => removePendingImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-sage-deep text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="text-[10px] font-mono text-sage-deep/40 self-center ml-1">
              {pendingImages.length} image{pendingImages.length > 1 ? "s" : ""} ready · AI will analyze
            </div>
          </div>
        )}

        {/* Footer Input */}
        <div className="shrink-0 p-4 sm:p-4 bg-white/60 backdrop-blur-md border-t border-border-soft pb-[max(env(safe-area-inset-bottom),16px)] sm:pb-4">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e) => {
                if (e.target.files) {
                  await handleImageFiles(e.target.files);
                  e.target.value = "";
                }
              }}
            />

            {/* Attach image button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border border-border-soft bg-surface-sunken hover:bg-soft-blue/10 hover:border-soft-blue/30 transition-colors text-sage-deep/50 hover:text-soft-blue"
              aria-label="Attach image"
              title="Attach image (or drag & drop / paste)"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              onPaste={handlePaste}
              placeholder={pendingImages.length > 0 ? "Add a note, or send to analyze…" : "Ask FlowBoard AI…"}
              className="flex-1 bg-surface-sunken border border-border-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-soft-blue/20 text-sage-deep min-h-[44px]"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isTyping}
              className="w-11 h-11 sm:w-auto sm:h-auto shrink-0 sm:p-3 bg-sage-deep text-cream rounded-xl hover:bg-sage-deep-dark transition-colors shadow-sm flex items-center justify-center disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 text-[10px] font-mono text-sage-deep/40 hover:text-sage-deep transition-colors uppercase tracking-widest min-h-[44px] cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              Open Dashboard
            </button>
            <span className="text-[9px] sm:text-[10px] font-mono text-sage-deep/20 hidden sm:block">
              DROP IMAGE · PASTE · CTRL+/
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
