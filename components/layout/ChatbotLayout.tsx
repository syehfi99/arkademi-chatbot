"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../chat/navbar";
import Sidebar from "../chat/sidebar";
import { ChatbotLayoutProps } from "@/types/ChatLayoutProps";

const ChatbotLayout: React.FC<ChatbotLayoutProps> = ({
  children,
  userEmail = "",
  historyChat = [],
  handleNewSession = () => {},
  activeSession = () => {},
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userID");
      localStorage.removeItem("userEmail");
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userEmail={userEmail}
        logout={logout}
        SidebarComponent={() => (
          <Sidebar
            handleNewSession={handleNewSession}
            historyChat={historyChat}
            activeSession={activeSession}
          />
        )}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          handleNewSession={handleNewSession}
          historyChat={historyChat}
          activeSession={activeSession}
        />
        {/* Chat area - children passed here */}
        <div className="flex-1 flex flex-col p-4">{children}</div>
      </div>
    </div>
  );
};

export default ChatbotLayout;
