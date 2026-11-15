import "server-only";
import { env } from "@/env";

/**
 * Server-only base API client.
 * All backend API interactions must go through services in src/services/.
 */
export async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = env.API_BASE_URL.replace(/\/$/, "");
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (env.API_SECRET_KEY) {
    headers.set("Authorization", `Bearer ${env.API_SECRET_KEY}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error [${response.status}]: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}
