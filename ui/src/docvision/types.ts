export type Provider = "openai" | "gemini" | "grok" | "qwen";
export type Level = "overview" | "deep-dive" | "exec-summary";

export type ExtractedImage = {
  dataUrl: string;
  width: number;
  height: number;
  label?: string;
};

export type ExtractedUnit = {
  id: string;
  kind: "pdf-page" | "pptx-slide";
  index: number;
  text: string;
  images: ExtractedImage[];
  thumb?: string;
  sourceName: string;
};

export type InsightRequest = {
  goal: string;
  level: Level;
  ask: string;
  modelExtras?: string;
};
