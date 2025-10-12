import React, { useCallback, useMemo, useRef, useState } from "react";
import { extractFromPDF } from "./pdf";
import { extractFromPPTX } from "./pptx";
import { runOCR } from "./ocr";
import { buildPrompt } from "./prompt";
import { LS_KEYS, useLocalStorage } from "./storage";
import { providerHandlers, PROVIDERS } from "./providers";
import type { ExtractedUnit, Level, Provider } from "./types";

type ApiKeys = Record<string, string>;

type ActivityEntry = {
  id: string;
  message: string;
  ts: number;
};

function useActivityLog() {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const push = useCallback((message: string) => {
    setEntries((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, message, ts: Date.now() },
    ]);
  }, []);
  const clear = useCallback(() => setEntries([]), []);
  const text = useMemo(
    () => entries.map((entry) => new Date(entry.ts).toLocaleTimeString() + " | " + entry.message).join("\n"),
    [entries]
  );
  return { entries, push, clear, text } as const;
}

function describeFile(file: File) {
  const size = file.size / (1024 * 1024);
  return `${file.name} (${size.toFixed(1)} MB)`;
}

export default function DocVisionApp() {
  const [provider, setProvider] = useLocalStorage<Provider>(LS_KEYS.provider, "openai");
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKeys>(LS_KEYS.apiKeys, {} as ApiKeys);
  const [files, setFiles] = useState<File[]>([]);
  const [units, setUnits] = useState<ExtractedUnit[]>([]);
  const [insights, setInsights] = useState("");
  const [goal, setGoal] = useState("Extract insights from uploaded docs.");
  const [ask, setAsk] = useState("Summarize trends, KPIs, and table values with citations.");
  const [level, setLevel] = useState<Level>("overview");
  const [modelExtras, setModelExtras] = useState("");
  const [useOCR, setUseOCR] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const { text: logText, push: pushLog, clear: clearLog } = useActivityLog();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const providerOptions = useMemo(() => Object.values(PROVIDERS), []);
  const providerConfig = PROVIDERS[provider];
  const unitCount = units.length;

  const onPutKey = useCallback((envKey: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [envKey]: value }));
  }, [setApiKeys]);

  const onFilesChosen = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const accepted = Array.from(fileList).filter((file) => /\.(pdf|pptx)$/i.test(file.name));
    if (!accepted.length) {
      pushLog("No supported files selected. Please choose PDF or PPTX.");
      return;
    }
    pushLog(`Added ${accepted.length} file(s).`);
    setFiles((prev) => [...prev, ...accepted]);
  }, [pushLog]);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    onFilesChosen(event.dataTransfer.files);
  }, [onFilesChosen]);

  const onPick = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFilesChosen(event.target.files);
    if (event.target.files) {
      event.target.value = "";
    }
  }, [onFilesChosen]);

  const removeFile = useCallback((name: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
  }, []);

  const resetAll = useCallback(() => {
    setFiles([]);
    setUnits([]);
    setInsights("");
    setProgress(null);
    clearLog();
  }, [clearLog]);

  const processFiles = useCallback(async () => {
    if (!files.length) {
      pushLog("Add PDF or PPTX files first.");
      return;
    }

    setBusy(true);
    setProgress("Preparing files...");
    setInsights("");
    setUnits([]);
    clearLog();

    try {
      const results = await Promise.allSettled(
        files.map(async (file, index) => {
          pushLog(`(${index + 1}/${files.length}) Parsing ${describeFile(file)}...`);
          const ext = file.name.split(".").pop()?.toLowerCase();
          if (ext === "pdf") {
            return await extractFromPDF(file);
          }
          if (ext === "pptx") {
            return await extractFromPPTX(file);
          }
          pushLog(`Skipping unsupported file ${file.name}.`);
          return [] as ExtractedUnit[];
        })
      );

      const parsedUnits = results.flatMap((result, index) => {
        if (result.status === "fulfilled") return result.value;
        pushLog(`Failed to parse ${files[index].name}: ${result.reason}`);
        return [] as ExtractedUnit[];
      });

      pushLog(`Parsed ${parsedUnits.length} unit(s).`);
      setUnits(parsedUnits);

      if (useOCR) {
        let updatedCount = 0;
        for (const unit of parsedUnits) {
          if ((unit.text?.trim().length || 0) < 80 && unit.images?.length) {
            setProgress(`Running OCR on ${unit.id}...`);
            pushLog(`Running OCR for ${unit.id}.`);
            const ocrText = await runOCR(unit.images);
            unit.text = `${unit.text || ""}\n\n(ocr) ${ocrText}`;
            updatedCount += 1;
          }
        }
        if (updatedCount) pushLog(`OCR enriched ${updatedCount} unit(s).`);
      }

      pushLog("Extraction complete.");
    } catch (error: any) {
      console.error(error);
      pushLog(`Extraction error: ${error.message || error}`);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [files, useOCR, pushLog, clearLog]);

  const runLLM = useCallback(async () => {
    if (!units.length) {
      pushLog("No parsed units yet. Extract documents first.");
      return;
    }

    const handler = providerHandlers[provider];
    const cfg = providerConfig;
    const apiKey = apiKeys[cfg.envKey];
    if (cfg.needsApiKey && !apiKey) {
      pushLog(`Missing ${cfg.label} API key.`);
      return;
    }

    setBusy(true);
    setProgress(`Calling ${cfg.label} ...`);
    setInsights("");

    try {
      const prompt = buildPrompt(units, { goal, level, ask, modelExtras });
      pushLog(`Calling ${cfg.label} with ${units.length} unit(s).`);
      const output = await handler(apiKey || "", prompt, units);
      setInsights(output);
      pushLog("LLM call complete.");
    } catch (error: any) {
      console.error(error);
      pushLog(`LLM error: ${error.message || error}`);
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [provider, providerConfig, apiKeys, units, goal, level, ask, modelExtras, pushLog]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-2xl font-semibold">DocVision • PDF/PPTX → LLM Insights</h1>
          <div className="flex items-center gap-2">
            <select
              className="rounded-xl border px-3 py-2"
              value={provider}
              onChange={(event) => setProvider(event.target.value as Provider)}
            >
              {providerOptions.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={runLLM}
              disabled={busy || !unitCount}
              className="rounded-xl bg-slate-900 px-4 py-2 text-white disabled:opacity-40"
            >
              Run LLM
            </button>
          </div>
        </div>
        {progress && (
          <div className="border-t bg-slate-900/90">
            <div className="mx-auto max-w-6xl px-4 py-2 text-xs font-medium text-white">
              {progress}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-3">
        <section className="space-y-4 md:col-span-1">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">1) API Keys</h2>
              <button
                type="button"
                onClick={resetAll}
                className="text-xs font-medium text-slate-500 underline-offset-2 hover:underline"
              >
                Reset
              </button>
            </div>
            <p className="mb-3 text-sm text-slate-600">Stored locally in your browser only.</p>
            {providerOptions.map((option) => (
              <div key={option.envKey} className="mb-2">
                <label className="text-sm font-medium">{option.label}</label>
                <input
                  type="password"
                  placeholder={option.envKey}
                  value={apiKeys[option.envKey] || ""}
                  onChange={(event) => onPutKey(option.envKey, event.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">2) Upload</h2>
            <div
              onDrop={onDrop}
              onDragOver={(event) => event.preventDefault()}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  fileInputRef.current?.click();
                }
              }}
              className="mb-2 grid place-items-center gap-2 rounded-xl border-2 border-dashed p-6 text-center focus:outline-none focus-visible:ring focus-visible:ring-slate-400"
            >
              <p className="text-sm text-slate-600">Drag & drop PDF or PPTX here</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border px-3 py-1 text-sm"
                type="button"
              >
                Choose files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.pptx"
                multiple
                onChange={onPick}
                className="hidden"
              />
            </div>
            {files.length > 0 && (
              <ul className="ml-5 list-disc text-sm text-slate-700">
                {files.map((file) => (
                  <li key={file.name} className="flex items-center justify-between gap-3 py-1">
                    <span>{describeFile(file)}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useOCR}
                  onChange={(event) => setUseOCR(event.target.checked)}
                />
                Use OCR for charts/tables
              </label>
              <button
                onClick={processFiles}
                disabled={busy || files.length === 0}
                className="rounded-xl border bg-white px-3 py-2 text-sm shadow disabled:opacity-40"
              >
                Extract
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">3) Request</h2>
            <label className="text-sm font-medium">Goal / context</label>
            <textarea
              className="mt-1 w-full rounded-xl border px-3 py-2"
              rows={3}
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Depth</label>
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value as Level)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  <option value="overview">Overview</option>
                  <option value="deep-dive">Deep Dive</option>
                  <option value="exec-summary">Exec Summary</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Custom hints (optional)</label>
                <input
                  value={modelExtras}
                  onChange={(event) => setModelExtras(event.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                  placeholder="e.g., extract all CAGR figures"
                />
              </div>
            </div>
            <label className="mt-3 block text-sm font-medium">Specific ask</label>
            <textarea
              className="mt-1 w-full rounded-xl border px-3 py-2"
              rows={3}
              value={ask}
              onChange={(event) => setAsk(event.target.value)}
            />
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Activity</h2>
            <pre className="max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border bg-slate-50 p-3 text-xs">
              {logText || "No activity yet."}
            </pre>
          </div>
        </section>

        <section className="space-y-4 md:col-span-1">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Parsed Units ({unitCount})</h2>
            {!unitCount ? (
              <p className="text-sm text-slate-600">Nothing yet. Extract first.</p>
            ) : (
              <ul className="max-h-[65vh] space-y-3 overflow-auto pr-2">
                {units.map((unit) => (
                  <li key={unit.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {unit.kind === "pdf-page" ? "PDF Page" : "PPTX Slide"} #{unit.index}
                      </div>
                      <div className="text-xs text-slate-500">{unit.sourceName}</div>
                    </div>
                    <div className="mt-2 grid grid-cols-6 gap-3">
                      <div className="col-span-2">
                        {unit.thumb ? (
                          <img
                            src={unit.thumb}
                            alt={unit.images[0]?.label || "Thumbnail"}
                            className="h-28 w-full rounded-lg border object-cover"
                          />
                        ) : (
                          <div className="grid h-28 place-items-center rounded-lg border text-xs text-slate-500">
                            No preview
                          </div>
                        )}
                      </div>
                      <div className="col-span-4">
                        <pre className="max-h-28 overflow-auto whitespace-pre-wrap text-xs text-slate-700">
                          {(unit.text || "").slice(0, 800)}
                        </pre>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="space-y-4 md:col-span-1">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">LLM Output</h2>
            {!insights ? (
              <p className="text-sm text-slate-600">
                Run the LLM to produce insights. Expected format is JSON with sections (highlights, key_metrics,
                tables, risks, opportunities, actions).
              </p>
            ) : (
              <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap text-xs leading-relaxed">{insights}</pre>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Tips</h2>
            <ul className="ml-5 list-disc space-y-2 text-sm text-slate-700">
              <li>If CORS blocks provider calls, proxy via your backend. Keep provider API keys server-side in production.</li>
              <li>For higher PDF fidelity (tables), add PDF table detectors (tabula/camelot) on the server and merge results back.</li>
              <li>Tune temperature to 0.0–0.3 for analytical tasks and set stricter JSON schemas with function calling where supported.</li>
              <li>Attach only representative images to stay within multimodal token limits; stream remaining pages on demand.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-center text-xs text-slate-500">
        Built for rapid analysis. © {new Date().getFullYear()} DocVision.
      </footer>
    </div>
  );
}
