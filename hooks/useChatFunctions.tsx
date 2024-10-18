import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebaseConf";
import { useRouter } from "next/navigation";

export const useChatHistory = (user: string) => {
  const [historyChat, setHistoryChat] = useState<any[]>([]);


  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      query(collection(db, "chats")),
      (querySnapshot) => {
        try {
          const chats = querySnapshot.docs.map((doc) => doc.data());
          const history = chats
            .filter((chat) => chat.userId === user)
            .map((data) => data);
          setHistoryChat(history);
        } catch (error) {
          console.error("Error fetching chat sessions:", error);
        }
      },
      (error) => {
        console.error("Error listening to chat updates:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { historyChat };
};

export const useChatFunctions = (
  setMessages: any,
  setModel: any,
  historyChat: any
) => {
  const router = useRouter();
  const handleNewSession = () => {
    const newUrl = `/chat`;
    const segments = window.location.pathname.split("/");
    if (segments[1] == "image-generation") {
      router.push(`/chat`)
    }
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl
    );
    setMessages([]); // Clear messages
    setModel("gpt-4o"); // Set default model
  };

  const activeSession = (session: any) => {
    const sessionData = historyChat.find(
      (data: any) => data.sessionId === session
    );
    const newUrl = `/chat/${session}`;
    const segments = window.location.pathname.split("/");
    if (segments[1] == "image-generation") {
      router.push(`/chat/${session}`)
      setMessages(sessionData.history || []);
    }
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl
    );
    setMessages(sessionData.history || []); // Set messages
    setModel(sessionData.model || "gpt-4o"); // Set model
  };

  return { handleNewSession, activeSession };
};
