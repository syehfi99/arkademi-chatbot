import OpenAI from "openai";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

async function ImageGenerationApi(prompt: string) {
  if (prompt == "") {
    return ["Prompt is empty!"];
  }
  const image = await openai.images.generate({
    model: "dall-e-2",
    prompt: prompt,
    n: 4,
  });
  console.log("image.data", image.data);

  return image.data;
}

export default ImageGenerationApi;
