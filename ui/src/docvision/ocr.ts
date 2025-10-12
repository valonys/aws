import { createWorker } from "tesseract.js";
import type { ExtractedImage } from "./types";

export async function runOCR(images: ExtractedImage[]) {
  if (!images.length) return "";
  const worker = await createWorker();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");

  try {
    const chunks: string[] = [];
    for (const img of images) {
      const { data } = await worker.recognize(img.dataUrl);
      chunks.push(data.text);
    }
    return chunks.join("\n\n");
  } finally {
    await worker.terminate();
  }
}
