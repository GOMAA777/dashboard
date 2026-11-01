"use client";

import { apiRequest } from "./http";

export async function fetchRolesStats() {
  return apiRequest("/admin/roles/stats", { method: "GET" });
}

export async function fetchSystemPermissions() {
  return apiRequest("/admin/roles/permissions", { method: "GET" });
}

export async function fetchRoles() {
  return apiRequest("/admin/roles", { method: "GET" });
}

export async function createRole(body: Record<string, unknown>) {
  return apiRequest("/admin/roles", { method: "POST", body });
}

export async function fetchRoleById(roleId: string | number) {
  return apiRequest(`/admin/roles/${roleId}`, { method: "GET" });
}

export async function updateRole(roleId: string | number, body: Record<string, unknown>) {
  return apiRequest(`/admin/roles/${roleId}`, { method: "PUT", body });
}

export async function reassignRoleStaff(
  roleId: string | number,
  targetRoleId: string | number
) {
  return apiRequest(`/admin/roles/${roleId}/reassign-staff`, {
    method: "POST",
    body: { target_role_id: targetRoleId },
  });
}

export async function deleteRole(roleId: string | number) {
  return apiRequest(`/admin/roles/${roleId}`, { method: "DELETE" });
}
