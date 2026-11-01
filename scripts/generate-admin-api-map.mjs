import fs from "fs";
import path from "path";

const collectionPath =
  "C:/Users/abdallah/.cursor/projects/c-Users-abdallah-Desktop-dashboard/agent-tools/a3866565-0188-4306-b6e8-a81590ca6331.txt";

const uiHints = {
  "/admin/dashboard": "DashboardHomeView / الرئيسية",
  "/admin/firms/stats": "ClientKpiMetrics",
  "/admin/firms": "ClientManagementView قائمة المكاتب / إضافة مكتب",
  "/admin/firms/{id}": "ClientOfficeDetailsView / تعديل المكتب",
  "/admin/firms/{id}/status": "DeactivateOfficeModal / تنشيط",
  "/admin/firms/{id}/notes": "ClientOfficeDetailsView إضافة ملاحظة",
  "/admin/plans": "PlansView / CreatePlanView",
  "/admin/subscriptions": "SubscriptionManagementView",
  "/admin/staff": "StaffManagementView",
  "/admin/staff/{id}/impersonate": "LoginAsEmployeeModal",
  "/admin/roles": "RolesManagementView",
  "/admin/departments": "TicketsView تبويب الأقسام",
  "/admin/tickets": "TicketsView",
  "/admin/payment-gateways": "PaymentGatewaysPage",
  "/admin/invoices": "InvoicesView",
  "/admin/announcements": "NotificationsManagementView",
  "/admin/settings/general": "GeneralSettingsView",
  "/admin/settings/server-info": "ServerInfoView",
  "/admin/settings/system-update": "SystemUpdateView",
  "/admin/audit-logs": "ProfileView / سجل العمليات",
  "/admin/currencies": "CurrencySettingsView",
  "/admin/languages": "LanguageSettingsView",
  "/admin/website": "WebsiteSettingsView",
  "/admin/utility/login-as-firm/{id}": "دخول المكتب (impersonation) → تبويب المحامي",
  "/admin/utility/end-preview": "خروج من المعاينة / رجوع لحسابي",
};

function normalizePath(url) {
  return String(url)
    .replace("{{base_url}}", "")
    .replace("{{firm_id}}", "{id}")
    .replace("{{plan_id}}", "{id}")
    .replace("{{subscription_id}}", "{id}")
    .replace("{{staff_id}}", "{id}")
    .replace("{{role_id}}", "{id}")
    .replace("{{ticket_id}}", "{id}")
    .replace("{{currency_id}}", "{id}")
    .replace("{{language_id}}", "{id}")
    .replace(/\?.*$/, "");
}

function guessUi(url) {
  const p = normalizePath(url);
  for (const [key, value] of Object.entries(uiHints)) {
    if (p === key || p.startsWith(key.replace(/\{id\}.*/, "")) || p.includes(key.split("/").slice(0, 3).join("/"))) {
      if (p.includes(key.split("/").filter(Boolean)[1] || "___")) return value;
    }
  }
  for (const [key, value] of Object.entries(uiHints)) {
    const stem = key.replace(/\{id\}/g, "").replace(/\/$/, "");
    if (p.startsWith(stem)) return value;
  }
  return "— (no dedicated screen yet)";
}

const raw = JSON.parse(fs.readFileSync(collectionPath, "utf8"));
const col = raw.collection || raw;
const rows = [];

function walk(items, folder) {
  for (const it of items || []) {
    if (it.item) {
      walk(it.item, folder ? `${folder} / ${it.name}` : it.name);
      continue;
    }
    if (!it.request) continue;
    const r = it.request;
    const method = typeof r === "string" ? "GET" : r.method || "?";
    let url = "";
    if (typeof r === "string") url = r;
    else if (typeof r.url === "string") url = r.url;
    else if (r.url?.raw) url = r.url.raw;
    url = String(url).replace("{{base_url}}", "");
    let body = "—";
    if (r.body?.raw) body = r.body.raw.trim();
    const auth = JSON.stringify(r.header || []).includes("admin_token")
      ? "Bearer admin_token"
      : "unknown";
    rows.push({
      folder,
      name: it.name,
      method,
      url,
      body,
      auth,
      desc: (r.description || "").replace(/\n/g, " "),
    });
  }
}

walk(col.item, "");

const outDir = path.resolve("docs");
fs.mkdirSync(outDir, { recursive: true });

let md = `# Super Admin API Map

Source of truth: Postman collection **SaaS Super Admin Management API (منصة الجودي)**  
Collection ID: \`50014550-9c31e88e-4fa7-4646-9e4b-0682ac23b57d\`  
Pulled from cached export (live Postman MCP returned Invalid API Key after re-auth).

## Connection

| Item | Value |
|------|-------|
| Collection base_url | \`http://127.0.0.1:8000/api\` |
| Production / .env | \`https://law.elmoroj.com/api\` |
| Auth | \`Authorization: Bearer <admin_token>\` |
| Login (live-verified, **not in collection**) | \`POST /login\` body \`{ "login", "password", "role" }\` — accepted roles include \`admin\`, \`owner\`, \`lawyer\` |

## Endpoint → screen status

| # | Method | Path | Auth | Request body | Response | Purpose | UI screen / button | Status |
|---|--------|------|------|--------------|----------|---------|--------------------|--------|
`;

rows.forEach((row, i) => {
  const pathOnly = row.url.split("?")[0];
  const purpose = (row.desc || row.name).replace(/\|/g, "/");
  const bodyCell =
    row.body === "—"
      ? "—"
      : "`JSON` (see bodies section)";
  md += `| ${i + 1} | ${row.method} | \`${pathOnly}\` | ${row.auth} | ${bodyCell} | Laravel envelope \`{status,message,data}\` | ${purpose} | ${guessUi(row.url)} | wired |\n`;
});

md += `
## Extra contracts used by this dashboard (not in original collection)

| Method | Path | Purpose | UI | Status |
|--------|------|---------|----|--------|
| POST | \`/login\` | Super Admin / office login | LoginForm | wired (fixed from \`/admin/login\`) |
| GET | \`/admin/impersonation-logs\` | سجل الدخول impersonation | صفحة سجل الدخول | **spec / pending backend** |
| POST | \`/auth/impersonate/consume\` | Optional one-time consume (lawyer) | Lawyer \`/impersonate\` | **spec** — live \`login-as-firm\` already returns a session token |
| POST | \`/auth/impersonate/exit\` | Exit impersonation from lawyer | Lawyer banner | **spec** — live uses \`/admin/utility/end-preview\` |

## Live-verified impersonation response

\`POST /admin/utility/login-as-firm/{firm_id}\` returns:

\`\`\`json
{
  "status": true,
  "message": "تم بدء جلسة المعاينة بنجاح لمكتب: …",
  "data": {
    "token": "<sanctum-token>",
    "user": { "id": 0, "company_id": 0, "full_name": "…", "email": "…", "role": "owner" },
    "firm": { "id": 0, "name": "…" },
    "preview_banner": { "active": true, "message": "أنت الآن في وضع المعاينة المباشرة لمكتب: …" }
  }
}
\`\`\`

## Request bodies (from Postman)

`;

rows
  .filter((r) => r.body !== "—")
  .forEach((row) => {
    md += `### ${row.method} ${row.url.split("?")[0]}\n\n**${row.name}**\n\n\`\`\`json\n${row.body}\n\`\`\`\n\n`;
  });

fs.writeFileSync(path.join(outDir, "admin-api-map.md"), md, "utf8");
console.log(`Wrote ${rows.length} endpoints to docs/admin-api-map.md`);
