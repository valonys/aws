export function canvasToDataURL(
  canvas: HTMLCanvasElement,
  type: string = "image/png",
  quality?: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to export canvas to blob"));
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error || new Error("Failed to read canvas blob"));
        reader.readAsDataURL(blob);
      },
      type,
      quality
    );
  });
}

export function scaleCanvas(
  source: HTMLImageElement | HTMLCanvasElement,
  maxWidth: number = 512
): HTMLCanvasElement {
  const width = (source as any).width as number;
  const height = (source as any).height as number;
  const scale = width > maxWidth ? maxWidth / width : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to acquire 2D context");
  ctx.drawImage(source as any, 0, 0, canvas.width, canvas.height);
  return canvas;
}
