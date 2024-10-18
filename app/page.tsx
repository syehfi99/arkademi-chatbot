"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h1>Arkademi Chatbot</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Start Chat</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apakah ingin login?</DialogTitle>
              <DialogDescription>
                Gunakan akun Arkademi kamu agar bisa menyimpan history chat kamu
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center items-center gap-4">
              <Button className="w-20" asChild>
                <Link href={`/chat`}>Tidak</Link>
              </Button>
              <Button className="w-20" asChild>
                <Link href={`/login`}>Ya</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* <Button onClick={dialog}>
        <Link href={`/chat/${id}`}>Start Chat</Link>
      </Button> */}
    </>
  );
}
