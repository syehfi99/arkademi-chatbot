import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SquarePen, Sun, Moon } from "lucide-react";
import ChatHistory from "@/components/chat/chat-history";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";

interface SidebarProps {
  handleNewSession: () => void;
  historyChat: any[];
  activeSession: (session: string) => void;
}

const Sidebar = ({
  handleNewSession,
  historyChat,
  activeSession,
}: SidebarProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  return (
    <div className="w-64 p-4 bg-gray-100 dark:bg-black hidden md:flex flex-col">
      <div className="h-[90%]">
        <Button variant="ghost" className="w-full" onClick={handleNewSession}>
          <SquarePen className="mr-2" /> Start new chat
        </Button>
        <Separator className="my-4" />
        {historyChat.length == 0 ? (
          <p className="text-center text-sm text-gray-500">No Chat History</p>
        ) : (
          <ScrollArea className="h-5/6 rounded-md">
            <ChatHistory
              historyChat={historyChat}
              activeSession={activeSession}
            />
          </ScrollArea>
        )}
      </div>
      <div>
        <Separator className="my-4" />
        {resolvedTheme == "dark" ? (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("light")}
          >
            <Sun className="absolute h-[1.2rem] w-[1.2rem]" />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme("dark")}
          >
            <Moon className="absolute h-[1.2rem] w-[1.2rem]" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
