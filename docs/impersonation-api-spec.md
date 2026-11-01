# Impersonation API Spec

Backend code is **not** in this workspace. Contracts below are the source of truth for frontend work.

## Decision: reuse existing Super Admin endpoint

Postman Super Admin collection already exposes firm impersonation:

| Method | Path | Auth |
|--------|------|------|
| `POST` | `/admin/utility/login-as-firm/{firm_id}` | Bearer admin_token |
| `POST` | `/admin/utility/end-preview` | Bearer admin_token (or impersonation token) |

Live production (`https://law.elmoroj.com/api`) returns a **normal Sanctum session token** for the office owner plus firm + preview banner.  
`POST /admin/companies/{id}/impersonate` is **not** implemented (404). Do **not** invent that route on the client.

Lawyer collection ID `50014550-62b8c9a7-67d7-4f6d-8104-6e46c4e41342` could not be re-fetched (Postman MCP Invalid API Key). Live lawyer login uses `POST /login` with roles shown on https://law.elmoroj.com/lawyer/login (`إدارة`, `موكل`, `محامي`, `محاسب`, `موظف`).

---

## A) Issue token (Super Admin) — **EXISTS**

### `POST /admin/utility/login-as-firm/{firm_id}`

**Auth:** Super Admin Bearer token (required in production; treat missing admin role as 403).

**Path params**

| Name | Type | Notes |
|------|------|-------|
| `firm_id` | number | Company / office id. Server resolves the office admin user. Never accept company id from a second client field. |

**Request body:** empty / `{}`

**Success `200`**

```json
{
  "status": true,
  "message": "تم بدء جلسة المعاينة بنجاح لمكتب: …",
  "data": {
    "token": "string",
    "expires_in": 90,
    "user": {
      "id": 186,
      "company_id": 29,
      "full_name": "string",
      "email": "string",
      "phone": "string",
      "role": "owner",
      "status": "active"
    },
    "firm": {
      "id": 29,
      "name": "string"
    },
    "preview_banner": {
      "active": true,
      "message": "أنت الآن في وضع المعاينة المباشرة لمكتب: …"
    },
    "impersonated_by": 1,
    "log_id": 10
  }
}
```

Notes:
- Live today returns `token`, `user`, `firm`, `preview_banner`. Fields `expires_in`, `impersonated_by`, `log_id` are **desired** for hardening; clients must tolerate absence.
- Never log `token` or passwords.
- Insert `impersonation_logs` row on issue (`started_at`, `admin_id`, `company_id`, `ip`, `user_agent`).

**Errors**

| Status | When |
|--------|------|
| 401 | Missing/invalid admin token |
| 403 | Caller is not super admin / cannot impersonate |
| 404 | Firm missing |
| 429 | Rate limited |

---

## B) Consume token (Lawyer app) — **recommended hardening**

Today the issued `token` is already a usable session token. Lawyer app may store it like a normal login.

### Preferred (future): `POST /auth/impersonate/consume`

```json
{ "token": "one-time-or-session-token" }
```

**Success `200`** — same shape as normal lawyer login session, plus:

```json
{
  "status": true,
  "data": {
    "token": "session-token",
    "user": { "id": 186, "company_id": 29, "full_name": "…", "role": "owner" },
    "company": { "id": 29, "name": "…" },
    "impersonated_by": 1
  }
}
```

**Errors:** `401` invalid / expired / used.

Until backend adds consume, lawyer `/impersonate` treats query `token` as the session token from (A), stores it, strips it from the URL, redirects to dashboard.

---

## C) Exit impersonation

### Live: `POST /admin/utility/end-preview`

**Success `200`**

```json
{ "status": true, "message": "تم إنهاء وضع المعاينة بنجاح والعودة." }
```

### Preferred alias: `POST /auth/impersonate/exit`

Same behavior for lawyer clients. Updates `impersonation_logs.ended_at`. Clears session.

---

## D) Impersonation logs (Super Admin)

### `GET /admin/impersonation-logs`

**Auth:** Super Admin only.

**Query**

| Param | Type | Notes |
|-------|------|-------|
| `company_id` / `firm_id` | number | optional office filter |
| `from` | ISO date | optional |
| `to` | ISO date | optional |
| `page` | number | default 1 |
| `per_page` | number | default 10 |

**Success `200`**

```json
{
  "status": true,
  "data": {
    "current_page": 1,
    "per_page": 10,
    "total": 1,
    "data": [
      {
        "id": 1,
        "admin_id": 1,
        "admin_name": "مشرف النظام",
        "company_id": 29,
        "company_name": "مكتب …",
        "started_at": "2026-11-01T12:00:00.000000Z",
        "ended_at": null,
        "ip": "1.2.3.4",
        "user_agent": "Mozilla/5.0 …"
      }
    ]
  }
}
```

### Table `impersonation_logs`

| Column | Type |
|--------|------|
| id | bigint PK |
| admin_id | bigint |
| company_id | bigint |
| started_at | timestamp |
| ended_at | timestamp nullable |
| ip | string nullable |
| user_agent | string nullable |

---

## E) Audit on impersonated mutations

Any create/update/delete performed while the session carries `impersonated_by` must persist that super-admin id on the audit/activity record. Company id always comes from the token/server session, never from a client-supplied override.

---

## F) Frontend handoff

### Target contract

1. Super Admin `دخول` → confirm → `POST /admin/utility/login-as-firm/{id}` → open  
   `${NEXT_PUBLIC_LAWYER_APP_URL}/impersonate?token=…` (`noopener`).
2. Lawyer `/lawyer/impersonate` stores session, removes token from URL, redirects dashboard.
3. Sticky banner when `impersonated_by` or `preview_banner.active`:  
   `أنت داخل كمشرف على [اسم المكتب]` + `رجوع لحسابي` (confirm) → exit → Super Admin URL.
4. Env: `NEXT_PUBLIC_LAWYER_APP_URL=https://law.elmoroj.com/lawyer`  
   `NEXT_PUBLIC_SUPER_ADMIN_APP_URL=https://law.elmoroj.com/dashboard`

### Production bridge (this Super Admin repo — lawyer source not on disk)

Live `/lawyer/impersonate` currently redirects to login (route missing). Until the lawyer app ships that route, Super Admin opens:

`${NEXT_PUBLIC_SUPER_ADMIN_APP_URL}/impersonate-handoff/?s=<base64url-session>&next=/lawyer/`

The handoff page writes `doussary_auth_session` / `doussary_auth` (same keys as the live lawyer SPA), strips the query, then redirects into `/lawyer/`. Same origin sharing makes this work without putting a bare token on the lawyer URL. `buildLawyerImpersonateUrl(token)` remains available for the target contract.

## Security

- HTTPS only in production.
- Never log tokens or passwords.
- Never reveal office passwords.
- Rate-limit issue endpoint; TTL 60–120s for one-time tokens once consume is implemented.
- Cannot target another super admin account.
