import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function ImageGenerationApi(prompt: string) {
  if (prompt == "") {
    return ["Prompt is empty!"];
  }
  const image = await openai.images.generate({
    model: "dall-e-2",
    prompt: prompt,
    n: 3,
  });
  console.log("image.data", image.data);

  return image.data;
}

export default ImageGenerationApi;
