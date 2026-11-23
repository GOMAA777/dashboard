const API = "https://law.elmoroj.com/api";
const h = { Accept: "application/json", "Content-Type": "application/json" };
async function call(method, path, body) {
  const res = await fetch(API + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const j = await res.json().catch(() => ({}));
  return { status: res.status, j };
}
const stamp = Date.now();
const created = await call("POST", "/admin/roles", {
  name: `دور اختبار ${stamp}`,
  slug: `probe-role-${stamp}`,
  description: "دور اختبار ربط الصلاحيات",
  permissions: ["dashboard.view", "staff.view", "roles.view"],
});
console.log("CREATE", created.status, JSON.stringify(created.j).slice(0, 300));
const id = created.j?.data?.id || created.j?.id;
if (!id) process.exit(0);
const updated = await call("PUT", `/admin/roles/${id}`, {
  name: `دور اختبار محدّث ${stamp}`,
  permissions: ["dashboard.view", "staff.view", "roles.view", "firms.view"],
});
console.log("UPDATE", updated.status, JSON.stringify(updated.j).slice(0, 250));
const detail = await call("GET", `/admin/roles/${id}`);
console.log("DETAIL perms", detail.status, (detail.j?.data?.permissions || detail.j?.permissions || []).join(","));
const del = await call("DELETE", `/admin/roles/${id}`);
console.log("DELETE", del.status, JSON.stringify(del.j).slice(0, 200));
