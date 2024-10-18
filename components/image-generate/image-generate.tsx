"use client";
import { FC, useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SendIcon } from "lucide-react";
import ImageGenerationApi from "@/lib/imageGeneration";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

const ImageGenerate: FC<IImageGenerate> = ({}) => {
  const [input, setInput] = useState("");
  const [urlImage, setUrlImage] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const dummy = useRef<any>(null);
  useEffect(() => {
    dummy?.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSendMessage = async () => {
    setUrlImage([]);
    setLoading(true);
    const resp = await ImageGenerationApi(input);
    setInput("");
    if (resp) {
      setUrlImage(resp);
      setLoading(false);
    }
  };
  return (
    <>
      <ScrollArea className="flex-1 mb-4 p-4 mx-auto w-full max-w-[48rem]">
        {loading && <Skeleton className="w-full h-[256px] rounded-lg" />}
        {urlImage.length > 0 &&
          urlImage.map((data: any) => (
            <Image src={data.url} alt="" width={640} height={640} />
          ))}

        <div ref={dummy}></div>
      </ScrollArea>
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 mr-2"
        />
        <Button onClick={handleSendMessage}>
          <SendIcon className="w-4 h-4 mr-2" />
          Send
        </Button>
      </div>
    </>
  );
};

interface IImageGenerate {}

export default ImageGenerate;
