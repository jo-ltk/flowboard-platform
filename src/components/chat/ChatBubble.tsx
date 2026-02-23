"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface MessageContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string | MessageContentPart[];
}

// Parse content for links and render them appropriately
const parseContentWithLinks = (text: string) => {
  // Regex to match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const linkText = match[1];
    const linkUrl = match[2];
    
    // Check if it's a task link - render as button
    if (linkUrl.includes('/dashboard/tasks')) {
      parts.push(
        <Link 
          key={match.index}
          href={linkUrl}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#8CBA41] text-white text-sm font-medium rounded-md hover:bg-[#7AB835] transition-colors mt-2 no-underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          {linkText}
        </Link>
      );
    } else {
      // Regular link
      parts.push(
        <a 
          key={match.index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {linkText}
        </a>
      );
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts;
};

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === "user";

  const renderContent = () => {
    if (typeof content === "string") {
      return <div className="whitespace-pre-wrap">{parseContentWithLinks(content)}</div>;
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
