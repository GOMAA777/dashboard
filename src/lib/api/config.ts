/** Browser-safe API config (static export cannot use server-only env). */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "https://law.elmoroj.com/api"
).replace(/\/$/, "");

/** Optional company scope used by dashboard endpoints in Postman. */
export const API_COMPANY_ID =
  process.env.NEXT_PUBLIC_API_COMPANY_ID || "96";

/**
 * Company that hosts staff login users. `POST /users` rejects rows without a
 * company, so every طاقم العمل account gets its `/login` user here.
 */
export const STAFF_LOGIN_COMPANY_ID = Number(
  process.env.NEXT_PUBLIC_STAFF_LOGIN_COMPANY_ID || 0
);

/** Lawyer office app base (no trailing slash). Handoff redirects to `{url}/`. */
export const LAWYER_APP_URL = (
  process.env.NEXT_PUBLIC_LAWYER_APP_URL || "https://law.elmoroj.com/lawyer"
).replace(/\/$/, "");

export const SUPER_ADMIN_APP_URL = (
  process.env.NEXT_PUBLIC_SUPER_ADMIN_APP_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://tibyanii.com/dashboard"
).replace(/\/$/, "");

/**
 * Real API authentication is strictly enforced by default.
 */
export const AUTH_BYPASS =
  (process.env.NEXT_PUBLIC_AUTH_BYPASS ?? "false").toLowerCase() === "true";
