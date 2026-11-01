/** Browser-safe API config (static export cannot use server-only env). */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

/** Optional company scope used by dashboard endpoints in Postman. */
export const API_COMPANY_ID =
  process.env.NEXT_PUBLIC_API_COMPANY_ID || "2";

/** Lawyer office app base (no trailing slash). Handoff redirects to `{url}/`. */
export const LAWYER_APP_URL = (
  process.env.NEXT_PUBLIC_LAWYER_APP_URL || "https://law.elmoroj.com/lawyer"
).replace(/\/$/, "");

export const SUPER_ADMIN_APP_URL = (
  process.env.NEXT_PUBLIC_SUPER_ADMIN_APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://law.elmoroj.com/dashboard"
).replace(/\/$/, "");
