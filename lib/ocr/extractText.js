import { createWorker } from "tesseract.js";

export async function extractTextFromImageBuffer(imageBuffer) {
  const worker = await createWorker("eng");
  const { data } = await worker.recognize(imageBuffer);
  await worker.terminate();

  return data.text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}
