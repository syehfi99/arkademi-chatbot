"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Trash } from "lucide-react";

interface AudioRecorderProps {
  onAudioRecorded: (url: string | null) => void;
  blobAudio: (blob: Blob | null) => void;
  isBlob: Blob | null | undefined;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioRecorded,
  blobAudio,
  isBlob,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    onAudioRecorded(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        onAudioRecorded(url);
        chunksRef.current = [];
        blobAudio(blob);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop the media stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
  };

  const deleteAudio = () => {
    onAudioRecorded(null);
    blobAudio(null);
  };

  return (
    <>
      <div className="w-full md:w-max">
        {isBlob ? (
          <Button
            className="bg-red-500 hover:bg-red-600 w-full md:w-max"
            onClick={deleteAudio}
            asChild
          >
            <Trash className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-full md:w-max ${
              isRecording ? "bg-red-500 hover:bg-red-600" : ""
            }`}
          >
            {isRecording ? (
              <>
                <Square className="h-4 w-4" />
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </>
  );
};

export default AudioRecorder;
