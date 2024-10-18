import { auth } from "@/lib/firebaseConf";
import { saveChatHistory } from "@/lib/saveChatHistory";
import { google } from "@ai-sdk/google";
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, StreamData } from "ai";
import { v4 as uuidv4 } from "uuid";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {messages, sessionId, userId, model} = await req.json();

  const data = new StreamData();
  // data.append({ test: 'value' });
  // console.log("user", user);

  const result = await streamText({
    model: model == "gemini-1.5-flash" ? google("gemini-1.5-flash") : openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
    onFinish: async ({ text }) => {
      await saveChatHistory(
        [...messages, { role: "assistant", content: text }],
        userId,
        sessionId,
        model
      );
      data.close();
    },
  });

  return result.toDataStreamResponse({ data });
}
