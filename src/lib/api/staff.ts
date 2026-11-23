"use client";

import { apiRequest, ApiError } from "./http";
import { STAFF_LOGIN_COMPANY_ID } from "./config";

/** POST /admin/staff — Postman folder 05. Staff & Team body contract */
export type CreateStaffBody = {
  name: string;
  emp_code: string;
  email: string;
  phone: string;
  password: string;
  department_id: number;
  role_id: number;
  status: "active" | "suspended";
};

/** Fields of a staff row that the matching `/login` user mirrors. */
type StaffLoginFields = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  status?: string;
};

type LoginUser = { id: number; email?: string };

/**
 * `/admin/staff` stores staff without a `/login` account, so each staff row is
 * mirrored to a `role: admin` user via `/users` (the only route whose password
 * verifies on `/login`). Those users live under `STAFF_LOGIN_COMPANY_ID`.
 */
function loginCompanyId(): number {
  if (!STAFF_LOGIN_COMPANY_ID) {
    throw new ApiError(
      "لم يتم ضبط NEXT_PUBLIC_STAFF_LOGIN_COMPANY_ID، لا يمكن إنشاء حساب دخول للموظف",
      500
    );
  }
  return STAFF_LOGIN_COMPANY_ID;
}

function toLoginStatus(status?: string): "active" | "inactive" | undefined {
  if (!status) return undefined;
  return status === "suspended" ? "inactive" : "active";
}

function readRecord(response: unknown): Record<string, unknown> {
  if (!response || typeof response !== "object") return {};
  const data = (response as { data?: unknown }).data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return response as Record<string, unknown>;
}

function readStaffLoginFields(response: unknown): StaffLoginFields {
  const row = readRecord(response);
  return {
    name: typeof row.name === "string" ? row.name : undefined,
    email: typeof row.email === "string" ? row.email : undefined,
    phone: typeof row.phone === "string" ? row.phone : undefined,
    status: typeof row.status === "string" ? row.status : undefined,
  };
}

function loginSyncError(err: unknown): ApiError {
  const detail = err instanceof Error && err.message ? `: ${err.message}` : "";
  return new ApiError(
    `تم حفظ بيانات الموظف لكن تعذر تحديث حساب الدخول${detail}`,
    err instanceof ApiError ? err.status : 500,
    err instanceof ApiError ? err.body : undefined
  );
}

async function findLoginUser(email?: string): Promise<LoginUser | null> {
  const target = email?.trim().toLowerCase();
  if (!target) return null;
  const response = await apiRequest<{ data?: LoginUser[] } | LoginUser[]>("/users", {
    method: "GET",
    query: { company_id: loginCompanyId() },
  });
  const rows = Array.isArray(response) ? response : response?.data;
  if (!Array.isArray(rows)) return null;
  return rows.find((u) => String(u.email || "").trim().toLowerCase() === target) ?? null;
}

/** Updates the staff member's login user, or creates it when a password is known. */
async function saveLoginUser(fields: StaffLoginFields, previousEmail?: string) {
  const companyId = loginCompanyId();
  const existing = await findLoginUser(previousEmail || fields.email);
  const status = toLoginStatus(fields.status);

  if (existing) {
    const body: Record<string, unknown> = { company_id: companyId };
    if (fields.name) body.full_name = fields.name;
    if (fields.email) body.email = fields.email;
    if (fields.phone) body.phone = fields.phone;
    if (fields.password) body.password = fields.password;
    if (status) body.status = status;
    await apiRequest(`/users/${existing.id}`, { method: "PUT", body });
    return;
  }

  if (!fields.password || !fields.email) return;
  await apiRequest("/users", {
    method: "POST",
    body: {
      company_id: companyId,
      full_name: fields.name || fields.email,
      email: fields.email,
      phone: fields.phone,
      password: fields.password,
      role: "admin",
      status: status ?? "active",
    },
  });
}

async function deleteLoginUser(email?: string) {
  const existing = await findLoginUser(email);
  if (existing) {
    await apiRequest(`/users/${existing.id}`, { method: "DELETE" });
  }
}

export async function fetchStaffStats() {
  return apiRequest("/admin/staff/stats", { method: "GET" });
}

export async function fetchStaff() {
  return apiRequest("/admin/staff", {
    method: "GET",
    query: { page: 1, per_page: 100 },
  });
}

export async function createStaff(body: CreateStaffBody) {
  const response = await apiRequest("/admin/staff", { method: "POST", body });
  try {
    await saveLoginUser(body);
  } catch (err) {
    const staffId = readRecord(response).id;
    if (staffId !== undefined) {
      await apiRequest(`/admin/staff/${staffId}`, { method: "DELETE" }).catch(() => undefined);
    }
    const detail = err instanceof Error && err.message ? `: ${err.message}` : "";
    throw new ApiError(
      `تعذر إنشاء حساب الدخول للموظف${detail}`,
      err instanceof ApiError ? err.status : 500,
      err instanceof ApiError ? err.body : undefined
    );
  }
  return response;
}

export async function fetchStaffById(staffId: string | number) {
  return apiRequest(`/admin/staff/${staffId}`, { method: "GET" });
}

export async function updateStaff(staffId: string | number, body: Record<string, unknown>) {
  const previous = readStaffLoginFields(await fetchStaffById(staffId));
  const response = await apiRequest(`/admin/staff/${staffId}`, { method: "PUT", body });
  try {
    await saveLoginUser(
      {
        name: typeof body.name === "string" ? body.name : previous.name,
        email: typeof body.email === "string" ? body.email : previous.email,
        phone: typeof body.phone === "string" ? body.phone : previous.phone,
        password: typeof body.password === "string" ? body.password : undefined,
        status: typeof body.status === "string" ? body.status : undefined,
      },
      previous.email
    );
  } catch (err) {
    throw loginSyncError(err);
  }
  return response;
}

export async function updateStaffStatus(staffId: string | number, status: string) {
  const response = await apiRequest(`/admin/staff/${staffId}/status`, {
    method: "PATCH",
    body: { status },
  });
  try {
    const staff = readStaffLoginFields(await fetchStaffById(staffId));
    await saveLoginUser({ email: staff.email, status });
  } catch (err) {
    throw loginSyncError(err);
  }
  return response;
}

export async function resetStaffPassword(staffId: string | number, password: string) {
  const response = await apiRequest(`/admin/staff/${staffId}/reset-password`, {
    method: "POST",
    body: { password },
  });
  try {
    const staff = readStaffLoginFields(await fetchStaffById(staffId));
    await saveLoginUser({ ...staff, password });
  } catch (err) {
    throw loginSyncError(err);
  }
  return response;
}

export async function impersonateStaff(staffId: string | number) {
  return apiRequest(`/admin/staff/${staffId}/impersonate`, { method: "POST" });
}

export async function deleteStaff(staffId: string | number) {
  const staff = readStaffLoginFields(await fetchStaffById(staffId));
  const response = await apiRequest(`/admin/staff/${staffId}`, { method: "DELETE" });
  try {
    await deleteLoginUser(staff.email);
  } catch (err) {
    throw loginSyncError(err);
  }
  return response;
}
