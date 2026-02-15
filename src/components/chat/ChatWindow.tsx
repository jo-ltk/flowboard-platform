"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, X, ExternalLink, MessageCircle, ChevronDown } from "lucide-react";
import ChatBubble from "./ChatBubble";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  "What should I work on today?",
  "Create a new project",
  "Show me risky deadlines",
  "Summarize my week"
];

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          context: { page: "homepage" }
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
        { role: "assistant", content: "Apologies, my neural link is flickering. Please try again soon." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Mobile: Full-screen bottom sheet | Desktop: Floating panel */}
      <div
        className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full sm:w-[420px] h-dvh sm:h-[600px] bg-cream sm:bg-cream/90 sm:glass-panel flex flex-col overflow-hidden z-100 sm:border border-t border-soft-blue/20 sm:rounded-xl sm:shadow-xl"
      >
        {/* Background Glow — hidden on mobile for perf */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-soft-blue/5 blur-[50px] -z-10 rounded-full hidden sm:block" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-light-green/5 blur-[50px] -z-10 rounded-full hidden sm:block" />

        {/* Mobile bottom-sheet drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-deep-blue/15" />
        </div>

        {/* Header */}
        <div className="shrink-0 px-5 sm:px-6 py-4 sm:py-5 border-b border-border-soft flex items-center justify-between bg-white/40 backdrop-blur-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-syne font-bold text-deep-blue text-base sm:text-lg tracking-tight">FlowBoard AI</h3>
              <div className="w-2 h-2 rounded-full bg-light-green" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-deep-blue/40">Your Intelligent Workspace Assistant</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 sm:w-auto sm:h-auto sm:p-2 flex items-center justify-center hover:bg-soft-blue/10 rounded-full transition-colors text-deep-blue/60"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-5 sm:space-y-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-tinted flex items-center justify-center border border-soft-blue/10">
                <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-soft-blue" />
              </div>
              <div className="space-y-2">
                <h4 className="font-syne font-bold text-deep-blue text-sm sm:text-base">Strategic Guidance Starts Here</h4>
                <p className="text-sm text-deep-blue/60 max-w-[260px] sm:max-w-[240px]">Ask me anything about your projects or workflow architecture.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-2 w-full mt-4">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-left px-4 py-3.5 sm:py-3 text-sm text-deep-blue/80 bg-white/60 border border-border-soft rounded-xl hover:border-soft-blue/40 hover:bg-soft-blue/5 transition-all group min-h-[44px] active:scale-[0.98]"
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
                  {msg.role === "assistant" && (msg.content.toLowerCase().includes("project") || msg.content.toLowerCase().includes("create")) && (
                    <div className="flex justify-start pl-4 pb-2">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-light-green text-deep-blue text-[10px] font-bold uppercase tracking-wider rounded-full shadow-soft hover:bg-light-green-dark transition-colors border border-light-green-dark/30 min-h-[44px]">
                        <ExternalLink className="w-3 h-3" />
                        Open Project Workspace
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-cream-warm border border-border-soft px-4 py-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-soft-blue opacity-50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-soft-blue opacity-50" />
                      <div className="w-1.5 h-1.5 rounded-full bg-soft-blue opacity-50" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Input — safe area padding for mobile notch/bar */}
        <div className="shrink-0 p-4 sm:p-4 bg-white/60 backdrop-blur-md border-t border-border-soft pb-[max(env(safe-area-inset-bottom),16px)] sm:pb-4">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Ask FlowBoard AI..."
              className="flex-1 bg-surface-sunken border border-border-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-soft-blue/20 text-deep-blue min-h-[44px]"
            />
            <button
              onClick={() => handleSend(input)}
              className="w-11 h-11 sm:w-auto sm:h-auto shrink-0 sm:p-3 bg-deep-blue text-cream rounded-xl hover:bg-deep-blue-dark transition-colors shadow-sm flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between px-1">
            <button className="flex items-center gap-1.5 text-[10px] font-mono text-deep-blue/40 hover:text-deep-blue transition-colors uppercase tracking-widest min-h-[44px]">
              <ExternalLink className="w-3 h-3" />
              Open Dashboard
            </button>
            <span className="text-[9px] sm:text-[10px] font-mono text-deep-blue/20 hidden sm:block">CTRL + / TO FOCUS</span>
          </div>
        </div>
      </div>
    </>
  );
}
