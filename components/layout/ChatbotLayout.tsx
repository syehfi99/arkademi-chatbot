"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../chat/navbar";
import Sidebar from "../chat/sidebar";
import { ChatbotLayoutProps } from "@/types/ChatLayoutProps";
import SidebarResponsive from "../chat/sidebar-responsive";
import { SidebarProvider } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";

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
      router.push("/");
    }
  };

  return (
    // <SidebarProvider>
    //   <AppSidebar
    //     historyChat={historyChat}
    //     activeSession={activeSession}
    //     handleNewSession={handleNewSession}
    //   />

    // </SidebarProvider>
    <div className="flex flex-col h-screen w-full">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userEmail={userEmail}
        logout={logout}
        SidebarComponent={() => (
          <>
            <SidebarResponsive
              handleNewSession={handleNewSession}
              historyChat={historyChat}
              activeSession={activeSession}
              userEmail={userEmail}
              logout={logout}
            />
          </>
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
