"use client";
import { FC, useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ArrowRight, SendIcon, X } from "lucide-react";
import ImageGenerationApi from "@/lib/imageGeneration";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import TextInputChat from "../ui/text-input-chat";

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
    setInput("");
    const resp = await ImageGenerationApi(input);
    if (resp) {
      setUrlImage(resp);
      setLoading(false);
    }
  };

  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(urlImage.length).fill(true)
  );

  useEffect(() => {
    if (urlImage && urlImage.length) {
      setLoadingStates(Array(urlImage.length).fill(true));
    }
  }, [urlImage]);

  const handleImageLoad = (index: number) => {
    setLoadingStates((prev) => {
      const newLoadingStates = [...prev];
      newLoadingStates[index] = false;
      return newLoadingStates;
    });
  };
  return (
    <>
      <ScrollArea className="flex-1 mb-4 p-4 mx-auto w-full max-w-[48rem]">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array(4)
              .fill(4)
              .map(() => (
                <Skeleton className="w-full h-[256px] rounded-lg" />
              ))}
          </div>
        ) : (
          <>
            {urlImage.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {urlImage.length > 0 &&
                    urlImage.map((data: any, index: number) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden"
                      >
                        {loadingStates[index] && (
                          <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
                        )}
                        <Image
                          src={data.url}
                          alt=""
                          width={640}
                          height={640}
                          onLoad={() => handleImageLoad(index)}
                          className={`transition-opacity duration-500 rounded-lg ${
                            loadingStates[index] ? "opacity-0" : "opacity-100"
                          }`}
                        />
                      </div>
                    ))}
                </div>

                <div ref={dummy}></div>
              </>
            ) : (
              <>
                <Card>
                  <CardContent className="p-4">
                    <Tabs defaultValue="image-gen" className="w-full">
                      <TabsList className="grid w-full grid-cols-1">
                        <TabsTrigger value="image-gen">
                          Image Generation
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="image-gen">
                        <h3 className="text-lg font-semibold mb-3">
                          Image Generation
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-200">
                          Unleash the magic of AI with Image Generation.
                          Instantly transform your words into stunning,
                          mesmerizing visuals. Embark on a creative
                          odyssey—experience the power of imagination in every
                          pixel.
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-200 my-6">
                          You can start a conversation from the message box
                          below or try the following examples:
                        </p>
                        {models.map((data, index) => (
                          <ul className="w-max">
                            {data.examples.map((example, idx) => (
                              <li
                                key={idx}
                                onClick={() => setInput(example.prompt)}
                                className="hover:underline hover:cursor-pointer my-3"
                              >
                                <div className="flex">
                                  <ArrowRight className="mr-2" />{" "}
                                  {example.prompt}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </ScrollArea>
      <TextInputChat
        handleInputChange={(e: any) => setInput(e.target.value)}
        handleSendMessage={handleSendMessage}
        input={input}
      />

      {/* <div className="flex items-center">
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
      </div> */}
    </>
  );
};

interface IImageGenerate {}

const models = [
  {
    examples: [
      { prompt: "Generate a fantasy dragon perched on a cliff." },
      { prompt: "Create a serene Japanese Zen garden scene." },
      { prompt: "Visualize a bustling cyberpunk street at night." },
    ],
  },
];

export default ImageGenerate;
