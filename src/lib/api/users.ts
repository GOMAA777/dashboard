"use client";

import { apiRequest } from "./http";

export interface ApiUserItem {
  id: number;
  company_id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches users assigned to a specific law firm / company.
 * Endpoint: GET /api/users?company_id={company_id}
 */
export async function fetchUsersByCompany(
  companyId: string | number
): Promise<ApiUserItem[]> {
  try {
    const numericId = typeof companyId === "string" ? companyId.replace(/^firm-/, "") : companyId;
    const response = await apiRequest<{ status?: boolean; data?: ApiUserItem[] }>(
      `/users?company_id=${numericId}`,
      { method: "GET" }
    );
    if (Array.isArray(response?.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response as ApiUserItem[];
    }
    return [];
  } catch (err) {
    console.warn("fetchUsersByCompany error:", err);
    return [];
  }
}

/**
 * Updates a user's password directly via the users endpoint.
 * This ensures the password is single-hashed properly and matches login credentials.
 * Endpoint: PUT /api/users/{id}
 */
export async function updateUserPassword(
  userId: string | number,
  companyId: string | number,
  newPassword: string
): Promise<boolean> {
  const numericCompanyId =
    typeof companyId === "string" ? companyId.replace(/^firm-/, "") : companyId;
  const res = await apiRequest<{ status?: boolean; message?: string }>(
    `/users/${userId}`,
    {
      method: "PUT",
      body: {
        company_id: Number(numericCompanyId),
        password: newPassword,
      },
    }
  );
  return Boolean(res?.status !== false);
}

/**
 * Sets the office owner's login password via `PUT /users/{id}`.
 * `POST/PUT /admin/firms` store a password that never verifies on `/login`.
 */
export async function syncFirmOwnerPassword(
  firmId: string | number,
  password: string
): Promise<{ success: boolean; userId?: number; error?: string }> {
  const failure = "تعذر حفظ كلمة مرور دخول المكتب على الخادم، أعد تعيينها من «إعادة تعيين كلمة المرور»";
  try {
    const users = await fetchUsersByCompany(firmId);
    const owner = users.find((u) => u.role === "owner");
    if (!owner) {
      return { success: false, error: "لم يتم العثور على حساب مالك المكتب على الخادم" };
    }
    const ok = await updateUserPassword(owner.id, firmId, password);
    return ok ? { success: true, userId: owner.id } : { success: false, error: failure };
  } catch {
    return { success: false, error: failure };
  }
}

/**
 * Uploads company branding (logo file and color) directly to /api/companies/{id}.
 * Uses FormData with _method=PUT to guarantee file persistence on Laravel server.
 */
export async function uploadCompanyBranding(
  companyId: string | number,
  options: {
    logoFile?: File | null;
    color?: string;
    secondaryColor?: string;
    name?: string;
  }
): Promise<{ logo?: string | null; color?: string | null }> {
  const numericId = typeof companyId === "string" ? companyId.replace(/^firm-/, "") : companyId;
  
  if (!options.logoFile && !options.color) {
    return {};
  }

  try {
    const fd = new FormData();
    fd.append("_method", "PUT");
    if (options.logoFile) {
      fd.append("logo", options.logoFile, options.logoFile.name || "logo.png");
    }
    if (options.color) {
      fd.append("color", options.color);
    }
    if (options.secondaryColor) {
      fd.append("secondary_color", options.secondaryColor);
    }
    if (options.name) {
      fd.append("name", options.name);
    }

    const res = await apiRequest<{
      status?: boolean;
      data?: { logo?: string; color?: string; [key: string]: unknown };
    }>(`/companies/${numericId}`, {
      method: "POST",
      body: fd,
    });

    return {
      logo: res?.data?.logo || null,
      color: res?.data?.color || null,
    };
  } catch (err) {
    console.warn("uploadCompanyBranding failed:", err);
    return {};
  }
}
