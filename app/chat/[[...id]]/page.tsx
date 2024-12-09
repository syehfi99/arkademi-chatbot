"use client";
import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "ai/react";
import { File } from "lucide-react";
import MultimodelText from "@/components/chat/multimodel-text";
import { useChatFunctions, useChatHistory } from "@/hooks/useChatFunctions";
import ChatbotLayout from "@/components/layout/ChatbotLayout";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TextInputChat from "@/components/ui/text-input-chat";
import Image from "next/image";

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

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSendMessage = async (e: any) => {
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
              handleSubmit(e, files ? { experimental_attachments: files } : {});
              setFiles(undefined);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }
          } else if (secondSegment !== "") {
            console.log('segments', secondSegment);
            handleSubmit(e, files ? { experimental_attachments: files } : {});
            setFiles(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
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

      const checkHistoryChat = setInterval(() => {
        if (
          historyChat &&
          Array.isArray(historyChat) &&
          historyChat.length > 0
        ) {
          clearInterval(checkHistoryChat);
          const sessionData = historyChat.find(
            (chat) => chat.sessionId === currentSessionId
          );

          if (sessionData) {
            setMessages(sessionData.history || []);
            setModel(sessionData.model || "gpt-4o");
          } else {
            handleNewSession();
          }
        }
      }, 500);

      return () => clearInterval(checkHistoryChat);
    }
  }, [historyChat]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const [fileUrls, setFileUrls] = useState<string[]>([]);

  useEffect(() => {
    if (files) {
      const urls = Array.from(files).map((file) => URL.createObjectURL(file));
      setFileUrls(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
        setFileUrls([]);
      };
    }
  }, [files]);

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
                <div
                  className={`flex items-start ${
                    message?.experimental_attachments ? "flex-col gap-2" : ""
                  }`}
                >
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
                  <div>
                    {message?.experimental_attachments?.map(
                      (attachment, index) => (
                        <div key={`${message.id}-${index}`}>
                          {attachment?.contentType?.startsWith("image/") ? (
                            <Image
                              key={`${message.id}-${index}`}
                              src={attachment.url}
                              width={350}
                              height={350}
                              alt={attachment.name ?? `attachment-${index}`}
                            />
                          ) : (
                            <div className="flex items-center gap-1 w-max p-2 rounded-lg">
                              <File width={15} key={index} />
                              <p key={index}>{attachment.name}</p>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={dummy}></div>
      </ScrollArea>
      <div>
        {fileUrls.map((url, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            {files?.[index]?.type.startsWith("image/") ? (
              <Image
                src={url}
                width={250}
                height={250}
                alt={files[index].name ?? `attachment-${index}`}
              />
            ) : (
              <div className="flex items-center gap-1 border-2 w-max p-2 rounded-lg">
                <File />
                <p>{files?.[index].name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <TextInputChat
        audioBlob={audioBlob}
        audioUrl={audioUrl}
        handleInputChange={handleInputChange}
        handleSendMessage={(e: any) => handleSendMessage(e)}
        input={input}
        setAudioBlob={setAudioBlob}
        setAudioUrl={setAudioUrl}
        isAudio
        fileInputRef={fileInputRef}
        setFiles={(e: any) => setFiles(e)}
        model={model}
      />
    </ChatbotLayout>
  );
}
