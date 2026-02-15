"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ChatButton from "./ChatButton";

const ChatWindow = dynamic(() => import("./ChatWindow"), {
  ssr: false,
});

export default function FlowBoardChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom "open-chatbot" events from other components
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  // Lock body scroll when chat is open on mobile
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <ChatWindow onClose={() => setIsOpen(false)} />
      )}
      <div className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 ${isOpen ? "hidden sm:block" : "block"}`}>
        <ChatButton onClick={() => setIsOpen(!isOpen)} isOpen={isOpen} />
      </div>
    </>
  );
}
