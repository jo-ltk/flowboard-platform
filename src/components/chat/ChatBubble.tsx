"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface MessageContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string | MessageContentPart[];
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";

  const renderContent = () => {
    if (typeof content === "string") {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    return (
      <div className="space-y-2">
        {content.map((part, i) => {
          if (part.type === "image_url" && part.image_url?.url) {
            return (
              <div key={i} className="rounded-none overflow-hidden border border-[#DDE5E1] max-w-[260px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={part.image_url.url}
                  alt="Uploaded image"
                  className="w-full h-auto object-cover"
                />
              </div>
            );
          }
          if (part.type === "text" && part.text) {
            return <p key={i} className="whitespace-pre-wrap">{part.text}</p>;
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[85%] px-6 py-4 text-sm leading-relaxed rounded-none border ${
          isUser
            ? "bg-[#8CBA41] text-white border-[#8CBA41]"
            : "bg-white border-[#DDE5E1] text-[#2F3A35]"
        }`}
      >
        {renderContent()}
      </div>
    </motion.div>

  );
}
