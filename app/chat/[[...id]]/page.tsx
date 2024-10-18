"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "ai/react";
import { SendIcon } from "lucide-react";
import MultimodelText from "@/components/chat/multimodel-text";
import { useChatFunctions, useChatHistory } from "@/hooks/useChatFunctions";
import ChatbotLayout from "@/components/layout/ChatbotLayout";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AudioRecorder from "@/components/chat/audio-recorder";

export default function ChatbotUI() {
  const [secondSegment, setSecondSegment] = useState("");
  const [user, setUser] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    setInput,
    append,
  } = useChat({
    body: { sessionId: secondSegment, userId: user, model: model },
  });

  const { historyChat } = useChatHistory(user);
  const { handleNewSession, activeSession } = useChatFunctions(
    setMessages,
    setModel,
    historyChat
  );
  const dummy = useRef<any>(null);

  useEffect(() => {
    dummy?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userID");
      const userEmail = localStorage.getItem("userEmail");
      setUser(userId || "");
      setUserEmail(userEmail || "");
    }
  }, []);

  const handleSendMessage = async () => {
    if (audioBlob !== null) {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      const response = await fetch("http://127.0.0.1:5000/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result) {
        // setInput(result.transcription);
        if (secondSegment === "") {
          const newUrl = `/chat/${uuidv4()}`;
          window.history.replaceState(
            { ...window.history.state, as: newUrl, url: newUrl },
            "",
            newUrl
          );
          const segments = window.location.pathname.split("/");
          if (segments.length > 2) {
            setSecondSegment(segments[2]);
            setTimeout(() => {
              append({
                role: "user",
                content: result.transcription,
              });
              setAudioBlob(null);
              setAudioUrl(null);
            }, 1000);
          }
        } else if (secondSegment !== "") {
          append({
            role: "user",
            content: result.transcription,
          });
          setAudioBlob(null);
          setAudioUrl(null);
        }
      }
    } else {
      if (input.trim() !== "") {
        if (model !== "") {
          if (secondSegment === "") {
            const newUrl = `/chat/${uuidv4()}`;
            window.history.replaceState(
              { ...window.history.state, as: newUrl, url: newUrl },
              "",
              newUrl
            );
            const segments = window.location.pathname.split("/");
            if (segments.length > 2) {
              setSecondSegment(segments[2]);
              handleSubmit();
            }
          } else if (secondSegment !== "") {
            handleSubmit();
          }
        }
      }
    }
  };

  useEffect(() => {
    const segments = window.location.pathname.split("/");
    if (segments.length > 2) {
      const currentSessionId = segments[2];
      setSecondSegment(currentSessionId);

      if (currentSessionId) {
        const sessionData = historyChat.find(
          (chat) => chat.sessionId === currentSessionId
        );

        if (sessionData) {
          setMessages(sessionData.history || []);
          setModel(sessionData.model || "gpt-4o");
        } else {
          console.error(
            "No chat session found for the sessionId:",
            currentSessionId
          );
        }
      }
    }
  }, [historyChat]);

  return (
    <ChatbotLayout
      userEmail={userEmail}
      historyChat={historyChat}
      handleNewSession={handleNewSession}
      activeSession={activeSession}
    >
      <ScrollArea className="flex-1 mb-4 p-4 mx-auto w-full max-w-[48rem]">
        {messages.length === 0 ? (
          <MultimodelText
            setModel={setModel}
            setInput={setInput}
            model={model}
          />
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "text-gray-800"
                }`}
              >
                <div className="flex items-start">
                  {message.role !== "user" && (
                    <Avatar className="mr-4">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                  )}
                  <ReactMarkdown
                    className={`${
                      message.role === "user" ? "" : "prose dark:prose-invert"
                    }`}
                    children={message.content}
                  />
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={dummy}></div>
      </ScrollArea>
      <div className="flex items-center">
        {audioUrl == null ? (
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 mr-2"
          />
        ) : (
          <>
            {audioUrl && (
              <audio controls src={audioUrl} className="w-full h-9">
                Your browser does not support the audio element.
              </audio>
            )}
          </>
        )}

        <div className="mx-2">
          <AudioRecorder
            onAudioRecorded={setAudioUrl}
            blobAudio={setAudioBlob}
            isBlob={audioBlob}
          />
        </div>
        <Button onClick={handleSendMessage}>
          <SendIcon className="w-4 h-4 mr-2" />
          Send
        </Button>
      </div>
    </ChatbotLayout>
  );
}
