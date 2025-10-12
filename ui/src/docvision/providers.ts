import type { ExtractedUnit, Provider } from "./types";

export type ProviderConfig = {
  name: Provider;
  label: string;
  needsApiKey: boolean;
  envKey: string;
};

export const PROVIDERS: Record<Provider, ProviderConfig> = {
  openai: { name: "openai", label: "OpenAI", needsApiKey: true, envKey: "OPENAI_API_KEY" },
  gemini: { name: "gemini", label: "Google Gemini", needsApiKey: true, envKey: "GEMINI_API_KEY" },
  grok: { name: "grok", label: "xAI Grok", needsApiKey: true, envKey: "XAI_API_KEY" },
  qwen: { name: "qwen", label: "Alibaba Qwen", needsApiKey: true, envKey: "DASHSCOPE_API_KEY" },
};

type ProviderCall = (apiKey: string, prompt: string, units: ExtractedUnit[]) => Promise<string>;

export const providerHandlers: Record<Provider, ProviderCall> = {
  openai: async (apiKey, prompt, units) => {
    const model = "gpt-4o-mini";
    const content: any[] = [{ type: "text", text: prompt }];
    for (const unit of units) {
      if (unit.images?.[0]?.dataUrl) {
        content.push({ type: "input_image", image_url: unit.images[0].dataUrl });
      }
    }
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content }],
        temperature: 0.2,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content || "";
  },
  gemini: async (apiKey, prompt, units) => {
    const parts: any[] = [{ text: prompt }];
    for (const unit of units) {
      const dataUrl = unit.images?.[0]?.dataUrl;
      if (!dataUrl) continue;
      const [meta, base64] = dataUrl.split(",");
      const mimeType = meta.split(":")[1].split(";")[0];
      parts.push({ inlineData: { data: base64, mimeType } });
    }
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts }] }),
      }
    );
    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.map((part: any) => part.text).join("") || "";
  },
  grok: async (apiKey, prompt, units) => {
    const imageMarkdown = units
      .filter((unit) => unit.images?.[0]?.dataUrl)
      .map((unit) => `![${unit.id}](${unit.images[0].dataUrl})`)
      .join("\n\n");
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-2-1212",
        temperature: 0.2,
        messages: [{ role: "user", content: `${prompt}\n\n${imageMarkdown}` }],
      }),
    });
    if (!res.ok) throw new Error(`xAI API error: ${res.status}`);
    const json = await res.json();
    return json.choices?.[0]?.message?.content || "";
  },
  qwen: async (apiKey, prompt, units) => {
    const messages: any[] = [{ role: "user", content: [{ text: prompt }] }];
    const first = messages[0].content;
    for (const unit of units) {
      if (unit.images?.[0]?.dataUrl) {
        first.push({ image: unit.images[0].dataUrl });
      }
    }
    const res = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model: "qwen-vl-plus", input: { messages } }),
      }
    );
    if (!res.ok) throw new Error(`DashScope API error: ${res.status}`);
    const json = await res.json();
    return (
      json.output?.text ||
      json.output?.choices?.[0]?.message?.content ||
      JSON.stringify(json.output || json)
    );
  },
};
