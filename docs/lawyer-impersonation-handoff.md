# Lawyer app handoff (source not in Super Admin workspace)

Production: https://law.elmoroj.com/lawyer/login  
Lawyer Postman collection `50014550-62b8c9a7-67d7-4f6d-8104-6e46c4e41342` could not be re-fetched (Postman MCP Invalid API Key). Live lawyer login uses `POST /login` with office roles.

## Current Super Admin bridge (deployed from this repo)

Until lawyer ships `/impersonate`, Super Admin:

1. `POST /admin/utility/login-as-firm/{firm_id}` (existing collection endpoint)
2. Opens `${NEXT_PUBLIC_SUPER_ADMIN_APP_URL}/impersonate-handoff/?s=<base64url-session>&next=…`
3. Handoff page writes `sessionStorage["doussary_auth_session"]` + `localStorage["doussary_auth"]` (same keys the live lawyer SPA uses)
4. Strips query from history, redirects to `${NEXT_PUBLIC_LAWYER_APP_URL}/`

Same origin (`law.elmoroj.com`) → sessionStorage is available to `/lawyer/` after redirect in that tab.

## Target lawyer route (implement in lawyer codebase)

Base path `/lawyer`.

### 1) `GET /lawyer/impersonate?token=…`

```ts
// Pseudocode — match existing login session storage exactly
const token = searchParams.get("token");
history.replaceState({}, "", "/lawyer/impersonate"); // strip token immediately

try {
  // Preferred when backend ships it:
  // const session = await POST /api/auth/impersonate/consume { token }
  // Until then: token from login-as-firm is already a Sanctum session token
  storeSessionLikeNormalLogin({
    token,
    impersonated_by: true, // or value from consume response
    firm_name: /* from /me or consume */,
  });
  location.replace("/lawyer/"); // dashboard
} catch {
  location.replace("/lawyer/login?error=" + encodeURIComponent("رابط الدخول غير صالح أو منتهي الصلاحية"));
}
```

### 2) Sticky banner (only when `impersonated_by` / `preview_banner.active`)

Arabic copy:

> أنت داخل كمشرف على [اسم المكتب]

Button **رجوع لحسابي** → Confirm dialog → `POST /admin/utility/end-preview` (live) or `POST /auth/impersonate/exit` (preferred alias) → clear session → redirect to `NEXT_PUBLIC_SUPER_ADMIN_APP_URL`.

### 3) Env

```
NEXT_PUBLIC_SUPER_ADMIN_APP_URL=https://law.elmoroj.com/dashboard
NEXT_PUBLIC_API_BASE_URL=https://law.elmoroj.com/api
```

## Security

- Never log the token or passwords.
- Never put office passwords in the URL or UI.
- Company id must come from the server session, never a client override.
- HTTPS only in production.

Full contracts: `docs/impersonation-api-spec.md`
