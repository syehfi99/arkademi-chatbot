import React, { useState } from "react";

type HistoryItem = {
  sessionId: string;
  createdAt: string;
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

const getDateCategory = (createdAt: any): string => {
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

  return (
    <div className="max-w-[192px]">
      {Object.keys(categorizedChats).map(
        (category) =>
          categorizedChats[category].length > 0 && (
            <div key={category}>
              <h2 className="text-base font-bold my-4">{category}</h2>
              <ul>
                {categorizedChats[category].map((data, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer  p-2 rounded-xl truncate text-sm ${
                      activeSessionId === data.sessionId
                        ? "bg-slate-700"
                        : "hover:bg-slate-500 hover:bg-opacity-30"
                    }`}
                    onClick={() => handleSessionClick(data.sessionId)}
                  >
                    {data.history[0].content}
                  </li>
                ))}
              </ul>
            </div>
          )
      )}
    </div>
  );
};

export default ChatHistory;
