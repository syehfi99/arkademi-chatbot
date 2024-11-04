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
import { Textarea } from "@/components/ui/textarea";
import TextInputChat from "@/components/ui/text-input-chat";

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
      formData.append("audio", audioBlob, `record_${user}.webm`);
      const response = await fetch(
        `https://9557-36-80-249-78.ngrok-free.app/api/upload-audio`,
        {
          method: "POST",
          body: formData,
        }
      );

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
                      message.role === "user"
                        ? "whitespace-pre-wrap text-justify"
                        : "prose dark:prose-invert"
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
      <TextInputChat
        audioBlob={audioBlob}
        audioUrl={audioUrl}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        input={input}
        setAudioBlob={setAudioBlob}
        setAudioUrl={setAudioUrl}
        isAudio
      />
      {/* <div className="flex md:flex-row flex-col items-end">
        {audioUrl == null ? (
          <Textarea
            ref={textareaRef}
            className="flex-1 mr-0 mb-2 md:mb-0 md:mr-2 min-h-[30px]"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
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

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-max">
          <div className="w-full md:w-max">
            <AudioRecorder
              onAudioRecorded={setAudioUrl}
              blobAudio={setAudioBlob}
              isBlob={audioBlob}
            />
          </div>
          <Button onClick={handleSendMessage} className="w-full md:w-max">
            <SendIcon className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div> */}
    </ChatbotLayout>
  );
}
