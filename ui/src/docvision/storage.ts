import { useEffect, useState } from "react";

export const LS_KEYS = {
  provider: "docvision.provider",
  apiKeys: "docvision.api_keys",
} as const;

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function useLocalStorage<T extends JsonValue>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch (err) {
      console.warn(`[docvision] Failed to read localStorage key ${key}`, err);
      return initial;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[docvision] Failed to persist localStorage key ${key}`, err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
