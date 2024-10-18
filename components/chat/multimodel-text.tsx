import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";

const MultimodelText: FC<IMultimodelText> = ({ setModel, setInput, model }) => {
  return (
    <>
      <Card>
        <CardContent className="p-4">
          <Tabs
            defaultValue="gpt-4o"
            onValueChange={(e) => setModel(e)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              {models.map((data, index) => (
                <TabsTrigger key={index} value={data.value}>
                  {data.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {models
              .filter((data) => data.value === model)
              .map((data, index) => (
                <TabsContent key={index} value={data.value}>
                  <h3 className="text-lg font-semibold mb-3">{data.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    {data.desc}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-200 my-6">
                    You can start a conversation from the message box below or
                    try the following examples:
                  </p>
                  <ul className="w-max">
                    {data.examples.map((example, idx) => (
                      <li
                        key={idx}
                        onClick={() => setInput(example.prompt)}
                        className="hover:underline hover:cursor-pointer my-3"
                      >
                        <div className="flex">
                          <ArrowRight className="mr-2" /> {example.prompt}
                        </div>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              ))}
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
};

interface IMultimodelText {
  setModel: any;
  setInput: any;
  model: any;
}

const models = [
  {
    title: "GPT-4",
    desc: "GPT-4, OpenAI's most advanced AI model to date, excels in tasks that require advanced reasoning, complex instruction interpretation, and enhanced creativity. While it operates slightly slower than the ChatGPT model, it delivers superior outputs for tasks demanding higher reasoning skills.",
    value: "gpt-4o",
    examples: [
      { prompt: "Describe a futuristic cityscape at night." },
      { prompt: "Explain the benefits of renewable energy." },
      { prompt: "How does quantum computing differ from classical computing?" },
    ],
  },
  {
    title: "Google Gemini",
    desc: "Gemini, Google's most advanced AI, is designed for a wide range of tasks, including handling text, images, audio, and code. It excels in reasoning and understanding multimedia content, presenting a robust alternative to GPT-4o for multimodal tasks.",
    value: "gemini-1.5-flash",
    examples: [
      { prompt: "Generate a summary of the latest climate change report." },
      { prompt: "Analyze the sentiment of a given text passage." },
      { prompt: "Create an image description for a sunny beach." },
    ],
  },
];

export default MultimodelText;
