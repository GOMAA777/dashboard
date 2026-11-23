"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser } from "@/lib/auth-client";
import type { AdminUser } from "@/lib/api/types";
import { fetchStaff, fetchStaffById } from "@/lib/api/staff";
import { fetchRoleById } from "@/lib/api/roles";
import { mapStaffResponse, mapStaffFromApi } from "@/lib/api/mappers";
import { unwrapData, asString } from "@/lib/api/helpers";
import type { Employee } from "@/features/staff/types/staff.types";
import {
  useDepartmentsQuery,
  useRolesQuery,
} from "@/features/staff/hooks/useStaffQuery";

export const PROFILE_QUERY_KEYS = {
  all: ["profile"] as const,
  staffMatch: (email: string) => [...PROFILE_QUERY_KEYS.all, "staff-match", email] as const,
  detail: (id: string) => [...PROFILE_QUERY_KEYS.all, "detail", id] as const,
  role: (id: string) => [...PROFILE_QUERY_KEYS.all, "role", id] as const,
};

function normalizeEmail(value: unknown): string {
  return String(value || "").trim().toLowerCase();
}

export function useProfileStaffQuery() {
  const user = getAuthUser<AdminUser>();
  const email = normalizeEmail(user?.email);

  const listQuery = useQuery({
    queryKey: PROFILE_QUERY_KEYS.staffMatch(email || "anonymous"),
    queryFn: () => fetchStaff(),
    enabled: Boolean(email),
  });

  const matched = useMemo(() => {
    if (!listQuery.data || !email) return null;
    const rows = mapStaffResponse(listQuery.data);
    return (
      rows.find((row) => normalizeEmail(row.email) === email) ||
      rows.find((row) => String(row.id) === String(user?.id)) ||
      null
    );
  }, [listQuery.data, email, user?.id]);

  const detailQuery = useQuery({
    queryKey: PROFILE_QUERY_KEYS.detail(matched?.id || ""),
    queryFn: async () => {
      const response = await fetchStaffById(matched!.id);
      const raw = unwrapData<Record<string, unknown>>(response) || (response as Record<string, unknown>);
      return mapStaffFromApi(raw);
    },
    enabled: Boolean(matched?.id),
  });

  const employee: Employee | null = detailQuery.data || matched;

  const roleId = employee?.roleId ? String(employee.roleId) : employee?.role?.id || "";
  const roleQuery = useQuery({
    queryKey: PROFILE_QUERY_KEYS.role(roleId),
    queryFn: () => fetchRoleById(roleId),
    enabled: Boolean(roleId),
  });

  const permissions = useMemo(() => {
    const raw = unwrapData<Record<string, unknown>>(roleQuery.data) || {};
    const list = Array.isArray(raw.permissions) ? raw.permissions : [];
    return list
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const row = item as Record<string, unknown>;
          return asString(row.name || row.label || row.slug || row.id);
        }
        return "";
      })
      .filter(Boolean);
  }, [roleQuery.data]);

  const rolesQuery = useRolesQuery();
  const departmentsQuery = useDepartmentsQuery();

  const isLoading =
    listQuery.isLoading ||
    (Boolean(matched?.id) && detailQuery.isLoading) ||
    (Boolean(roleId) && roleQuery.isLoading);

  const error =
    listQuery.error ||
    detailQuery.error ||
    roleQuery.error ||
    rolesQuery.error ||
    departmentsQuery.error;

  return {
    user,
    employee,
    permissions,
    roleName: asString(
      (unwrapData<Record<string, unknown>>(roleQuery.data) || {}).name ||
        employee?.role?.name,
      "—"
    ),
    rolesQuery,
    departmentsQuery,
    isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch: async () => {
      await Promise.all([
        listQuery.refetch(),
        detailQuery.refetch(),
        roleQuery.refetch(),
        rolesQuery.refetch(),
        departmentsQuery.refetch(),
      ]);
    },
  };
}

export function invalidateProfileQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEYS.all });
}
