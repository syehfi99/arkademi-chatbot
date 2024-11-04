import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { NavMenu } from "./nav-menu";
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

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  userEmail: string;
  logout: () => void;
  SidebarComponent: any;
}

const Navbar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  userEmail,
  logout,
  SidebarComponent,
}: NavbarProps) => (
  <nav className="shadow-md p-4 flex justify-between items-center">
    <div className="flex items-center">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SidebarComponent />
        </SheetContent>
      </Sheet>
      <h1 className="text-xl font-bold ml-2">Arkademi Intelligence</h1>
      <div className="ml-4 hidden md:block">
        <NavMenu />
      </div>
    </div>
    <div className="hidden md:block">
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
  </nav>
);

export default Navbar;
