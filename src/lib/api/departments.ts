"use client";

import { apiRequest } from "./http";

export async function fetchDepartments() {
  return apiRequest("/admin/departments", { method: "GET" });
}

export async function createDepartment(body: Record<string, unknown>) {
  return apiRequest("/admin/departments", { method: "POST", body });
}

export async function fetchDepartmentById(id: string | number) {
  return apiRequest(`/admin/departments/${id}`, { method: "GET" });
}

export async function updateDepartment(id: string | number, body: Record<string, unknown>) {
  return apiRequest(`/admin/departments/${id}`, { method: "PUT", body });
}

export async function deleteDepartment(id: string | number) {
  return apiRequest(`/admin/departments/${id}`, { method: "DELETE" });
}
