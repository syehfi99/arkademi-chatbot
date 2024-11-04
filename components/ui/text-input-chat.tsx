import { FC, useEffect, useRef } from "react";
import { Textarea } from "./textarea";
import AudioRecorder from "../chat/audio-recorder";
import { Button } from "./button";
import { SendIcon } from "lucide-react";

const TextInputChat: FC<ITextInputChat> = ({
  input,
  handleSendMessage,
  handleInputChange,
  audioBlob,
  audioUrl,
  setAudioUrl,
  setAudioBlob,
  isAudio = false,
}) => {
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
    <>
      <div className="flex md:flex-row flex-col items-end">
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
          {isAudio && (
            <div className="w-full md:w-max">
              <AudioRecorder
                onAudioRecorded={setAudioUrl}
                blobAudio={setAudioBlob}
                isBlob={audioBlob}
              />
            </div>
          )}
          <Button onClick={handleSendMessage} className="w-full md:w-max">
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
}

export default TextInputChat;
