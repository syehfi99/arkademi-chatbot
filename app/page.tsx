"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "./logo.png";
import TextReveal from "@/components/TextReveal";
import AnimatedText from "@/components/AnimatedText";
import { useTheme } from "next-themes";
import { ArrowRight, Moon, Sun } from "lucide-react";
import ModalMotion from "@/components/ModalMotion";
import LoginComponent from "@/components/login/login-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterCard from "@/components/register/register-card";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const userId = localStorage.getItem("userID");
  //     setUser(userId || "");
  //   }
  // }, []);
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <>
      <ModalMotion isOpen={isModalOpen} onClose={closeModal}>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Login</TabsTrigger>
            <TabsTrigger value="password">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <LoginComponent />
          </TabsContent>
          <TabsContent value="password">
            <RegisterCard />
          </TabsContent>
        </Tabs>
      </ModalMotion>
      <div className="flex min-h-screen">
        <div className="flex-[3] bg-zinc-100 dark:bg-zinc-900 p-6 flex flex-col gap-6 justify-center">
          <div className="space-y-6 w-full relative">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-[200px] w-[200px] rounded-full bg-white absolute"
            />
            <AnimatedText />
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-md mx-auto w-full h-full flex">
            <div className="absolute top-4 right-4">
              <Image
                src={Logo}
                alt="Logo"
                width={48}
                height={48}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="space-y-6 pt-20 my-auto">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut",
                  }}
                >
                  <h1 className="text-4xl font-bold">
                    Get unlimited access to ChatGPT
                  </h1>
                </motion.div>
                <div className="space-y-2 text-zinc-400">
                  <TextReveal />
                </div>
                <Button onClick={openModal} className="w-full" size="lg">
                  Continue
                  <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.2,
                      ease: "easeInOut",
                      repeat: Infinity,
                    }}
                  >
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.div>
                </Button>
              </div>
            </div>
            <div className="absolute bottom-4 right-4">
              <div className="inline-flex items-center">
                <div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
