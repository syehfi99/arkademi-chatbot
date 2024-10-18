import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    <div className="w-64 p-4 bg-gray-100 dark:bg-black hidden md:flex flex-col justify-between h-full">
      <div>
        <Button variant="ghost" className="w-full" onClick={handleNewSession}>
          <SquarePen className="mr-2" /> Start new chat
        </Button>
        <Separator className="my-4" />
        {historyChat.length == 0 ? (
          <p className="text-center text-sm text-gray-500">No Chat History</p>
        ) : (
          <ScrollArea className="h-full rounded-md p-4">
            <ChatHistory
              historyChat={historyChat}
              activeSession={activeSession}
            />
          </ScrollArea>
        )}
      </div>
      {/* <div className="w-full">
        <Separator className="my-4" />
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Tools</AccordionTrigger>
            <AccordionContent>
              <Button
                variant={"ghost"}
                className="w-full"
                onClick={() => router.push("/image-generation")}
              >
                Image Generation
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div> */}
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
