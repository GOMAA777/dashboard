"use client";

import { API_BASE_URL } from "./config";
import { clearAuthSession, getAccessToken, redirectToLogin } from "@/lib/auth-client";

export class ApiError extends Error {
  status: number;
  body: unknown;
  raw?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.raw = body;
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

  // Live Super Admin login often has no API token — only attach Authorization
  // when a real token exists. Never treat a bare 401 (no bearer sent) as logout.
  let sentBearer = false;
  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      sentBearer = true;
    }
  }

  // Auth is Bearer-token based (localStorage). Only include cookies on
  // same-origin calls. Cross-origin + credentials:"include" fails when the
  // API returns Access-Control-Allow-Origin: * (browser blocks the response).
  let credentialsMode: RequestCredentials = "omit";
  try {
    const apiOrigin = new URL(API_BASE_URL).origin;
    const pageOrigin =
      typeof window !== "undefined" ? window.location.origin : "";
    credentialsMode = pageOrigin && apiOrigin === pageOrigin ? "include" : "omit";
  } catch {
    credentialsMode = "omit";
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      cache: "no-store",
      credentials: credentialsMode,
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
      rawMessage.toLowerCase().includes("cors") ||
      networkErr instanceof TypeError
        ? "تعذر الاتصال بخادم الـ API (تحقق من الشبكة، أو أن السيرفر يسمح بالوصول من هذا النطاق)."
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
    // Only force logout when the server rejected an actual bearer token.
    // Token-less sessions must stay until the user clicks logout.
    if (response.status === 401 && auth && sentBearer) {
      clearAuthSession();
      redirectToLogin();
    }

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
