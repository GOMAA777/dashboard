"use client";

import { apiRequest } from "./http";

export async function fetchStaffStats() {
  return apiRequest("/admin/staff/stats", { method: "GET" });
}

export async function fetchStaff() {
  return apiRequest("/admin/staff", { method: "GET" });
}

export async function createStaff(body: Record<string, unknown>) {
  return apiRequest("/admin/staff", { method: "POST", body });
}

export async function fetchStaffById(staffId: string | number) {
  return apiRequest(`/admin/staff/${staffId}`, { method: "GET" });
}

export async function updateStaff(staffId: string | number, body: Record<string, unknown>) {
  return apiRequest(`/admin/staff/${staffId}`, { method: "PUT", body });
}

export async function updateStaffStatus(staffId: string | number, status: string) {
  return apiRequest(`/admin/staff/${staffId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function resetStaffPassword(staffId: string | number, password: string) {
  return apiRequest(`/admin/staff/${staffId}/reset-password`, {
    method: "POST",
    body: { password },
  });
}

export async function impersonateStaff(staffId: string | number) {
  return apiRequest(`/admin/staff/${staffId}/impersonate`, { method: "POST" });
}

export async function deleteStaff(staffId: string | number) {
  return apiRequest(`/admin/staff/${staffId}`, { method: "DELETE" });
}
