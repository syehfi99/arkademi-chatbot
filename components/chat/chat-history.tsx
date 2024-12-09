import { db } from "@/lib/firebaseConf";
import { deleteDoc, doc } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

type HistoryItem = {
  sessionId: string;
  createdAt: { seconds: number; nanoseconds: number };
  history: { content: string }[];
};

type Props = {
  historyChat: HistoryItem[];
  activeSession: (sessionId: string) => void;
};

const convertFirestoreTimestampToDate = (createdAt: {
  seconds: number;
  nanoseconds: number;
}): Date => {
  return new Date(createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000);
};

const getDateCategory = (createdAt: {
  seconds: number;
  nanoseconds: number;
}): string => {
  const today = new Date();
  const createdDate = convertFirestoreTimestampToDate(createdAt);

  const diffTime = today.getTime() - createdDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Last 7 Days";
  if (diffDays <= 30) return "Last 30 Days";
  return "Older";
};

const ChatHistory: React.FC<Props> = ({ historyChat, activeSession }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  const categorizedChats: { [key: string]: HistoryItem[] } = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    "Last 30 Days": [],
    Older: [],
  };

  historyChat?.forEach((data) => {
    const category = getDateCategory(data.createdAt);
    categorizedChats[category].push(data);
  });

  const handleSessionClick = (sessionId: string) => {
    setActiveSessionId(sessionId);
    activeSession(sessionId);
  };

  const handleDelete = async () => {
    if (deleteSessionId) {
      try {
        await deleteDoc(doc(db, "chats", deleteSessionId));
        setDeleteSessionId(null); // Reset after deletion
        setIsOpen(false);
        // Add any additional logic to update the UI
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  return (
    <div className="max-w-[220px]">
      {Object.keys(categorizedChats).map(
        (category) =>
          categorizedChats[category].length > 0 && (
            <div key={category}>
              <h2 className="text-base font-bold my-4">{category}</h2>
              <ul>
                {categorizedChats[category].map((data, index) => (
                  <li
                    key={index}
                    className={`group relative flex items-center justify-between cursor-pointer p-2 rounded-xl truncate text-sm ${
                      activeSessionId === data.sessionId
                        ? "bg-slate-700"
                        : "hover:bg-slate-500 hover:bg-opacity-30"
                    }`}
                    onClick={() => handleSessionClick(data.sessionId)}
                  >
                    <span className="truncate">{data.history[0].content}</span>
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteSessionId(data.sessionId);
                        setIsOpen(true);
                      }}
                    >
                      <Trash2 className="text-gray-400 hover:text-red-600 cursor-pointer ml-2" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
      )}

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete{" "}
              <b>
                {
                  historyChat.find((item) => item.sessionId === deleteSessionId)
                    ?.history[0].content
                }
              </b>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteSessionId(null);
                setIsOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatHistory;
