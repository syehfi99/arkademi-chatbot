import { FC, useEffect, useRef, useState } from "react";
import { Textarea } from "./textarea";
import AudioRecorder from "../chat/audio-recorder";
import { Button } from "./button";
import { PaperclipIcon, SendIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TextInputChat: FC<ITextInputChat> = ({
  input,
  handleSendMessage,
  handleInputChange,
  audioBlob,
  audioUrl,
  setAudioUrl,
  setAudioBlob,
  isAudio = false,
  fileInputRef,
  setFiles,
  model,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "36px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleFileChange = (e: any) => {
    const selectedFiles = e.target.files;
    const maxFileSize = 1 * 1024 * 1024;

    if (selectedFiles) {
      // Filter files that are less than or equal to 1 MB
      const validFiles = Array.from(selectedFiles).filter(
        (file: any) => file.size <= maxFileSize
      );

      // Update state if there are valid files
      if (validFiles.length > 0) {
        setFiles(new DataTransfer().files); // Creating a new empty FileList

        const dataTransfer = new DataTransfer();
        validFiles.forEach((file: any) => dataTransfer.items.add(file)); // Add valid files to DataTransfer
        setFiles(dataTransfer.files);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Each file must be 1 MB or smaller.",
        });
        setFiles(undefined);
      }
    }
  };
  return (
    <>
      <div className="flex md:flex-row flex-col items-end">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 mr-2"
          onClick={() => {
            document.getElementById("file-upload")?.click();
          }}
        >
          <PaperclipIcon className="w-5 h-5" />
          <span className="sr-only">Attach file</span>
        </Button>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={(e) => {
            e.preventDefault()
            handleFileChange(e);
          }}
          multiple
          ref={fileInputRef}
          accept={
            model === "gpt-4o"
              ? "image/jpeg, image/jpg, image/png"
              : "image/jpeg, image/jpg, image/png, application/pdf"
          }
        />
        {audioUrl == null ? (
          <Textarea
            ref={textareaRef}
            className="flex-1 mr-0 mb-2 md:mb-0 md:mr-2 min-h-[30px] overflow-hidden"
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
          {isAudio && (
            <div className="w-full md:w-max">
              <AudioRecorder
                onAudioRecorded={setAudioUrl}
                blobAudio={setAudioBlob}
                isBlob={audioBlob}
              />
            </div>
          )}
          <Button
            onClick={(e) => {
              handleSendMessage(e);
            }}
            className="w-full md:w-max"
          >
            <SendIcon className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </>
  );
};

interface ITextInputChat {
  input: string;
  handleSendMessage: any;
  audioUrl?: any;
  handleInputChange: any;
  setAudioUrl?: any;
  audioBlob?: Blob | null | undefined;
  setAudioBlob?: any;
  isAudio?: boolean;
  setFiles?: any;
  fileInputRef?: any;
  model?: string;
}

export default TextInputChat;
