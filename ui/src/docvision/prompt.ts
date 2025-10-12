import type { ExtractedUnit, InsightRequest } from "./types";

const MAX_TEXT = 3000;

export function buildPrompt(units: ExtractedUnit[], req: InsightRequest) {
  const header =
    "You are a senior analyst. You will receive parsed content (text + images) from PDFs/PPTX.\n" +
    `Your task: produce ${req.level} insights tied to page/slide citations. Create structured JSON sections:\n\n` +
    '{"highlights": [ {"point": string, "evidence": string, "source": {"file": string, "pageOrSlide": number}} ],\n"key_metrics": [ {"name": string, "value": string, "unit": string|null, "source": {...}} ],\n"tables": [ {"title": string, "columns": string[], "rows": string[][], "source": {...}} ],\n"risks": string[], "opportunities": string[], "actions": string[] }\n\n' +
    `Goal/context: ${req.goal}\nSpecific ask: ${req.ask}\n` +
    (req.modelExtras ? `Model hints: ${req.modelExtras}\n` : "") +
    "Use OCR in attached images if text is missing. If a chart is present, infer axes, units, and trends. Indicate uncertainty explicitly.";

  const body = units
    .map((unit) => {
      return (
        "\n\n=== SOURCE UNIT ===\n" +
        `id: ${unit.id}\n` +
        `kind: ${unit.kind}\n` +
        `index: ${unit.index}\n` +
        `file: ${unit.sourceName}\n` +
        `text:\n${(unit.text || "").slice(0, MAX_TEXT)}`
      );
    })
    .join("\n");

  return `${header}\n${body}`;
}
