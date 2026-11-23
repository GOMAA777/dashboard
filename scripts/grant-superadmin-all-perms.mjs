const API = "https://law.elmoroj.com/api";
const h = { Accept: "application/json", "Content-Type": "application/json" };

const permsRes = await fetch(API + "/admin/roles/permissions", { headers: h });
const permsJson = await permsRes.json();
const catalog = permsJson.data || {};
const allKeys = Object.values(catalog).flat().filter((x) => typeof x === "string");
console.log("catalog count", allKeys.length);

const rolesRes = await fetch(API + "/admin/roles", { headers: h });
const rolesJson = await rolesRes.json();
const superRole = (rolesJson.data || []).find(
  (r) => r.slug === "super-admin" || r.name === "Super Admin" || r.id === 1
);
console.log("super role", superRole && { id: superRole.id, name: superRole.name, before: (superRole.permissions || []).length });
if (!superRole) process.exit(1);

const updated = await fetch(API + `/admin/roles/${superRole.id}`, {
  method: "PUT",
  headers: h,
  body: JSON.stringify({
    name: superRole.name,
    slug: superRole.slug,
    description: superRole.description || "صلاحيات كاملة على كل أقسام المنصة",
    permissions: allKeys,
  }),
});
const updatedJson = await updated.json();
console.log("UPDATE", updated.status, "perms", (updatedJson.data?.permissions || []).length);
