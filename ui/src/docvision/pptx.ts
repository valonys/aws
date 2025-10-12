import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import type { ExtractedUnit } from "./types";

type Relationship = {
  "@_Id": string;
  "@_Type": string;
  "@_Target": string;
};

type RelationshipDocument = {
  Relationships?: {
    Relationship?: Relationship | Relationship[];
  };
};

export async function extractFromPPTX(file: File): Promise<ExtractedUnit[]> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const units: ExtractedUnit[] = [];
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

  async function toBlobUrl(path: string) {
    const entry = zip.file(path);
    if (!entry) return undefined;
    const blob = new Blob([await entry.async("arraybuffer")]);
    return URL.createObjectURL(blob);
  }

  let idx = 1;
  while (zip.file(`ppt/slides/slide${idx}.xml`)) {
    const slideXml = await zip.file(`ppt/slides/slide${idx}.xml`)!.async("string");
    const relsPath = `ppt/slides/_rels/slide${idx}.xml.rels`;
    const relsXml = zip.file(relsPath) ? await zip.file(relsPath)!.async("string") : undefined;

    const slide = parser.parse(slideXml);
    const rels = relsXml ? (parser.parse(relsXml) as RelationshipDocument) : undefined;

    const texts: string[] = [];
    const walk = (node: any) => {
      if (!node || typeof node !== "object") return;
      for (const [key, value] of Object.entries(node)) {
        if (key.endsWith(":t") || key === "a:t") {
          if (typeof value === "string") texts.push(value);
        } else if (typeof value === "object") {
          walk(value);
        }
      }
    };
    walk(slide);

    const images = [] as ExtractedUnit["images"];
    if (rels?.Relationships?.Relationship) {
      const relationships = Array.isArray(rels.Relationships.Relationship)
        ? rels.Relationships.Relationship
        : [rels.Relationships.Relationship];
      for (const rel of relationships) {
        if (rel["@_Type"]?.includes("image")) {
          const normalized = rel["@_Target"].replace(/^[.\\/]+/, "");
          const path = `ppt/${normalized}`;
          const url = await toBlobUrl(path);
          if (url) {
            images.push({
              dataUrl: url,
              width: 0,
              height: 0,
              label: `slide ${idx} image`,
            });
          }
        }
      }
    }

    units.push({
      id: `${file.name}#s${idx}`,
      kind: "pptx-slide",
      index: idx,
      text: texts.join(" \n"),
      images,
      thumb: images[0]?.dataUrl,
      sourceName: file.name,
    });

    idx += 1;
  }

  return units;
}
