"use client";
import ImageGenerateComp from "@/components/image-generate/image-generate";
import ChatbotLayout from "@/components/layout/ChatbotLayout";
import { useChatFunctions, useChatHistory } from "@/hooks/useChatFunctions";
import { useEffect, useState } from "react";

export default function ImageGenerate() {
  const [user, setUser] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { historyChat } = useChatHistory(user);
  const [messages, setMessages] = useState([]); // State for messages if needed
  const [model, setModel] = useState("gpt-4o"); // Default model

  const { handleNewSession, activeSession } = useChatFunctions(
    setMessages,
    setModel,
    historyChat
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userID");
      const userEmail = localStorage.getItem("userEmail");
      setUser(userId || "");
      setUserEmail(userEmail || "");
    }
  }, []);
  return (
    <ChatbotLayout
      userEmail={userEmail}
      historyChat={historyChat}
      handleNewSession={handleNewSession}
      activeSession={activeSession}
    >
      <ImageGenerateComp />
    </ChatbotLayout>
  );
}
