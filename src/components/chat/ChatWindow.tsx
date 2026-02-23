"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, ExternalLink, MessageCircle, Image as ImageIcon, Paperclip, ArrowRight } from "lucide-react";
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
        className={`fixed inset-0 sm:inset-auto sm:bottom-28 sm:right-6 w-full sm:w-[380px] h-dvh sm:h-[520px] bg-white flex flex-col overflow-hidden z-100 border-l sm:border border-[#DDE5E1] rounded-none transition-all ${
          isDragOver ? "ring-2 ring-[#8CBA41] ring-inset bg-[#f8faf9]" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drop overlay */}
        {isDragOver && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm pointer-events-none rounded-none">
            <ImageIcon className="w-12 h-12 text-[#8CBA41] mb-4" />
            <p className="font-bold text-[#2F3A35] text-sm uppercase tracking-widest">Release to Analyze</p>
            <p className="text-[10px] text-[#8CBA41] mt-2 uppercase tracking-widest font-bold">Cognitive Vision Mode</p>
          </div>
        )}

        {/* Header - Architectural Style */}
        <div className="shrink-0 px-5 py-4 border-b border-[#DDE5E1] flex items-center justify-between bg-white">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#2F3A35] text-base tracking-tighter uppercase">FlowBoard AI</h3>
              <div className="w-1.5 h-1.5 bg-[#8CBA41]" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#8A9E96] mt-0.5">
              Intelligent Workspace Assist
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:bg-[#f8faf9] border border-transparent hover:border-[#DDE5E1] rounded-none transition-all text-[#2F3A35]"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 py-6 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-start space-y-8">
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-[#8CBA41] uppercase tracking-[0.4em]">Strategic Engine</span>
                <h4 className="text-2xl font-bold text-[#2F3A35] leading-none tracking-tighter">Your Intelligence <br /> starts here.</h4>
                <p className="text-[13px] text-[#5C6B64] font-light max-w-[240px] leading-relaxed">
                  Ask anything, or drop a whiteboard to auto-orchestrate.
                </p>
              </div>

              {/* Suggested Tasks - Grid Layout */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-1.5 w-full">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-left px-4 py-3 text-[12px] font-medium text-[#2F3A35] bg-white border border-[#DDE5E1] rounded-none hover:bg-[#2F3A35] hover:text-white transition-all group active:scale-[0.98] flex items-center justify-between"
                    >
                      {prompt}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Vision hint card - Architectural */}
              <div className="border-l-4 border-[#8CBA41] bg-[#f8faf9] p-4 rounded-none">
                <p className="text-[11px] text-[#5C6B64] font-light leading-relaxed">
                  Drop a mockup. AI will interpret the vision and generate structured tasks instantly.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className="space-y-3">
                  <ChatBubble role={msg.role} content={msg.content} />
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#f8faf9] border border-[#DDE5E1] px-6 py-4 rounded-none">
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 bg-[#8CBA41] animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-[#8CBA41] animate-pulse" style={{ animationDelay: "200ms" }} />
                      <div className="w-1.5 h-1.5 bg-[#8CBA41] animate-pulse" style={{ animationDelay: "400ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pending Image Previews - Sharp */}
        {pendingImages.length > 0 && (
          <div className="shrink-0 px-6 pt-4 pb-2 flex gap-3 flex-wrap bg-white border-t border-[#DDE5E1]">
            {pendingImages.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`Pending ${i}`}
                  className="w-16 h-16 object-cover rounded-none border border-[#DDE5E1]"
                />
                <button
                  onClick={() => removePendingImage(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-[#2F3A35] text-white rounded-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <div className="text-[10px] font-bold text-[#8CBA41] uppercase tracking-widest self-center ml-2">
              {pendingImages.length} Image Asset{pendingImages.length > 1 ? "s" : ""} Stage for Processing
            </div>
          </div>
        )}

        {/* Footer Input - Structured Design */}
        <div className="shrink-0 p-6 bg-white border-t border-[#DDE5E1]">
          <div className="flex items-center gap-3 mb-4">
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
              className="w-14 h-14 shrink-0 flex items-center justify-center border border-[#DDE5E1] bg-[#f8faf9] hover:bg-[#2F3A35] hover:text-white transition-all text-[#2F3A35]"
              aria-label="Attach image"
              title="Attach image (or drag & drop / paste)"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
                onPaste={handlePaste}
                placeholder={pendingImages.length > 0 ? "Add intent..." : "Analyze workspace..."}
                className="w-full bg-[#f8faf9] border border-[#DDE5E1] px-6 py-4 text-sm rounded-none focus:outline-none focus:border-[#8CBA41] text-[#2F3A35] h-14"
              />
            </div>
            
            <button
              onClick={() => handleSend(input)}
              disabled={isTyping}
              className="w-14 h-14 shrink-0 bg-[#2F3A35] text-white rounded-none hover:bg-black transition-all flex items-center justify-center disabled:opacity-30"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-[10px] font-bold text-[#8A9E96] hover:text-[#2F3A35] transition-all uppercase tracking-widest"
            >
              <ExternalLink className="w-3 h-3" />
              Access Control Panel
            </button>
            <span className="text-[10px] font-bold text-[#DDE5E1] uppercase tracking-widest hidden sm:block">
              Multimodal Ready
            </span>
          </div>
        </div>
      </div>
    </>

  );
}
