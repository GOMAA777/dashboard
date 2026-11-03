const session = {
  token: "verify-handoff-token",
  id: 186,
  name: "مالك المكتب",
  email: "owner@example.com",
  phone: "0500000000",
  role: "owner",
  roleId: "admin",
  assignedRole: "المستشار العام",
  company_id: 29,
  company_name: "مكتب الدوسري",
  status: "نشط",
  permissions: { all: true },
  impersonated_by: 1,
  firm_name: "مكتب الدوسري",
};
const json = JSON.stringify(session);
const bytes = Buffer.from(json, "utf8");
const b64 = bytes
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");
console.log(b64);
