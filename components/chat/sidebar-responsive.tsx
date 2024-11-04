import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SquarePen, Sun, Moon } from "lucide-react";
import ChatHistory from "@/components/chat/chat-history";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface SidebarProps {
  handleNewSession: () => void;
  historyChat: any[];
  activeSession: (session: string) => void;
  logout: () => void;
  userEmail: string;
}

const SidebarResponsive = ({
  handleNewSession,
  historyChat,
  activeSession,
  logout,
  userEmail,
}: SidebarProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between ">
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
      <div>
        {userEmail ? (
          <AlertDialog>
            <AlertDialogTrigger>{userEmail}</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Keluar?</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda ingin keluar?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Tidak</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>Ya</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <>
            <Button variant="ghost" className="mr-2">
              <Link href={"/login"}>Login</Link>
            </Button>
            <Button asChild>
              <Link href={"/login"}>Sign Up</Link>
            </Button>
          </>
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

export default SidebarResponsive;
