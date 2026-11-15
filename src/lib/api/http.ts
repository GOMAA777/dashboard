"use client";

import { API_BASE_URL } from "./config";
import { getAccessToken } from "@/lib/auth-client";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
  query?: Record<string, string | number | boolean | undefined | null>;
};

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalized}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, auth = true, query, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);
  headers.set("Accept", "application/json");

  const isFormData =
    typeof FormData !== "undefined" &&
    (body instanceof FormData ||
      (Boolean(body) &&
        typeof body === "object" &&
        (body as { constructor?: { name?: string } }).constructor?.name === "FormData" &&
        typeof (body as { append?: unknown }).append === "function"));

  if (isFormData) {
    headers.delete("Content-Type");
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      cache: "no-store",
      ...rest,
      headers,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  } catch (networkErr: unknown) {
    const rawMessage =
      networkErr instanceof Error ? networkErr.message : String(networkErr || "");
    const friendlyMessage =
      rawMessage.toLowerCase().includes("fetch") ||
      rawMessage.toLowerCase().includes("network") ||
      networkErr instanceof TypeError
        ? "تعذر الاتصال بخادم الـ API (يرجى التحقق من الشبكة أو اتصال الخادم)."
        : rawMessage || "خطأ غير متوقع في الاتصال بالخادم";
    throw new ApiError(friendlyMessage, 0, networkErr);
  }

  const text = await response.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }

  if (!response.ok) {
    // Never auto-clear the session on 401. One failing endpoint was logging
    // users out and trapping them on the login screen after every navigation.
    // Logout stays explicit (sidebar confirm only).

    const message =
      typeof parsed === "object" &&
      parsed !== null &&
      "message" in parsed &&
      typeof (parsed as { message: unknown }).message === "string"
        ? (parsed as { message: string }).message
        : `API error [${response.status}]`;

    throw new ApiError(message, response.status, parsed);
  }

  return parsed as T;
}
