const API = "https://law.elmoroj.com/api";
const h = { Accept: "application/json", "Content-Type": "application/json" };
async function get(path) {
  const res = await fetch(API + path, { headers: h });
  const j = await res.json();
  return j;
}
const perms = await get("/admin/roles/permissions");
const data = perms.data || {};
console.log("keys:", Object.keys(data));
for (const [k, v] of Object.entries(data)) {
  console.log(k, Array.isArray(v) ? v.join(",") : typeof v);
}
const roles = await get("/admin/roles");
for (const r of roles.data || []) {
  console.log("ROLE", r.id, r.name, "staff?", r.staff_count, "perms", (r.permissions||[]).length, (r.permissions||[]).slice(0,5));
}
