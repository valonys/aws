import type { ExtractedUnit } from "./types";
import { canvasToDataURL, scaleCanvas } from "./rendering";

const PDF_WORKER_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.js";

export async function extractFromPDF(file: File): Promise<ExtractedUnit[]> {
  const pdfjs = await import("pdfjs-dist/build/pdf");
  (pdfjs as any).GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
  const { getDocument } = pdfjs as any;

  const pdf = await getDocument({ data: await file.arrayBuffer() }).promise;
  const units: ExtractedUnit[] = [];

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) continue;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;

    const pageImage = await canvasToDataURL(canvas, "image/png", 0.92);
    const thumb = await canvasToDataURL(scaleCanvas(canvas, 300));
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(" \n");

    units.push({
      id: `${file.name}#p${i}`,
      kind: "pdf-page",
      index: i,
      text,
      images: [
        {
          dataUrl: pageImage,
          width: canvas.width,
          height: canvas.height,
          label: `page ${i}`,
        },
      ],
      thumb,
      sourceName: file.name,
    });
  }

  return units;
}
