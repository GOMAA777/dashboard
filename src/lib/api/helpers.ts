"use client";

/** Extract array payloads from common Laravel/API envelope shapes. */
export function unwrapList<T = Record<string, unknown>>(payload: unknown): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as T[];
  if (typeof payload !== "object") return [];

  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj.data)) return obj.data as T[];
  if (Array.isArray(obj.items)) return obj.items as T[];
  if (Array.isArray(obj.results)) return obj.results as T[];

  const nested = obj.data;
  if (nested && typeof nested === "object") {
    const n = nested as Record<string, unknown>;
    if (Array.isArray(n.data)) return n.data as T[];
    if (Array.isArray(n.items)) return n.items as T[];
  }

  return [];
}

export function unwrapData<T = Record<string, unknown>>(payload: unknown): T | null {
  if (!payload || typeof payload !== "object") return (payload as T) ?? null;
  const obj = payload as Record<string, unknown>;
  if ("data" in obj && obj.data !== undefined) return obj.data as T;
  return payload as T;
}

export function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function asString(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

export function asBoolean(value: unknown, fallback = false): boolean {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "true" || s === "1" || s === "yes" || s === "on") return true;
    if (s === "false" || s === "0" || s === "no" || s === "off") return false;
  }
  return fallback;
}

/** Read numeric stats from common API envelope shapes. */
export function readStats(
  payload: unknown,
  keys: string[],
  fallback = 0
): number {
  const data = (unwrapData<Record<string, unknown>>(payload) ||
    {}) as Record<string, unknown>;
  const stats = (data.stats || data.kpis || data) as Record<string, unknown>;
  for (const key of keys) {
    if (stats[key] !== undefined && stats[key] !== null) {
      return asNumber(stats[key], fallback);
    }
    if (data[key] !== undefined && data[key] !== null) {
      return asNumber(data[key], fallback);
    }
  }
  return fallback;
}
