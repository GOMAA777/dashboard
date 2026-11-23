"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchStaff,
  fetchStaffStats,
  fetchStaffById,
} from "@/lib/api/staff";
import {
  fetchRoles,
  fetchRolesStats,
  fetchRoleById,
  fetchSystemPermissions,
} from "@/lib/api/roles";
import { fetchDepartments, fetchDepartmentById } from "@/lib/api/departments";
import { InvalidationGraph } from "@/lib/query-keys";


export const STAFF_QUERY_KEYS = {
  all: ["staff"] as const,
  list: () => [...STAFF_QUERY_KEYS.all, "list"] as const,
  stats: () => [...STAFF_QUERY_KEYS.all, "stats"] as const,
  detail: (id: string | number) => [...STAFF_QUERY_KEYS.all, "detail", String(id)] as const,
};

export const ROLES_QUERY_KEYS = {
  all: ["roles"] as const,
  list: () => [...ROLES_QUERY_KEYS.all, "list"] as const,
  stats: () => [...ROLES_QUERY_KEYS.all, "stats"] as const,
  detail: (id: string | number) => [...ROLES_QUERY_KEYS.all, "detail", String(id)] as const,
  permissions: () => [...ROLES_QUERY_KEYS.all, "permissions"] as const,
};

export const DEPARTMENTS_QUERY_KEYS = {
  all: ["departments"] as const,
  list: () => ["departments", "list"] as const,
  detail: (id: string | number) => ["departments", "detail", String(id)] as const,
};

export function useStaffQuery() {
  return useQuery({
    queryKey: STAFF_QUERY_KEYS.list(),
    queryFn: () => fetchStaff(),
  });
}

export function useStaffStatsQuery() {
  return useQuery({
    queryKey: STAFF_QUERY_KEYS.stats(),
    queryFn: () => fetchStaffStats(),
  });
}

export function useStaffDetailQuery(staffId: string | number | null | undefined) {
  return useQuery({
    queryKey: STAFF_QUERY_KEYS.detail(staffId || ""),
    queryFn: () => fetchStaffById(staffId!),
    enabled: Boolean(staffId),
  });
}

export function useRolesQuery() {
  return useQuery({
    queryKey: ROLES_QUERY_KEYS.list(),
    queryFn: () => fetchRoles(),
  });
}

export function useRolesStatsQuery() {
  return useQuery({
    queryKey: ROLES_QUERY_KEYS.stats(),
    queryFn: () => fetchRolesStats(),
  });
}

export function useRoleDetailQuery(roleId: string | number | null | undefined) {
  return useQuery({
    queryKey: ROLES_QUERY_KEYS.detail(roleId || ""),
    queryFn: () => fetchRoleById(roleId!),
    enabled: Boolean(roleId),
  });
}

export function useSystemPermissionsQuery() {
  return useQuery({
    queryKey: ROLES_QUERY_KEYS.permissions(),
    queryFn: () => fetchSystemPermissions(),
  });
}

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: DEPARTMENTS_QUERY_KEYS.list(),
    queryFn: () => fetchDepartments(),
  });
}

export function useDepartmentDetailQuery(id: string | number | null | undefined) {
  return useQuery({
    queryKey: DEPARTMENTS_QUERY_KEYS.detail(id || ""),
    queryFn: () => fetchDepartmentById(id!),
    enabled: Boolean(id),
  });
}

export function invalidateStaffQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return InvalidationGraph.onStaffMutation(queryClient);
}

export function invalidateRolesQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return InvalidationGraph.onRoleMutation(queryClient);
}

export function prefetchStaffQuery(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: STAFF_QUERY_KEYS.list(),
      queryFn: () => fetchStaff(),
    }),
    queryClient.prefetchQuery({
      queryKey: STAFF_QUERY_KEYS.stats(),
      queryFn: () => fetchStaffStats(),
    }),
    queryClient.prefetchQuery({
      queryKey: ROLES_QUERY_KEYS.list(),
      queryFn: () => fetchRoles(),
    }),
    queryClient.prefetchQuery({
      queryKey: DEPARTMENTS_QUERY_KEYS.list(),
      queryFn: () => fetchDepartments(),
    }),
  ]);
}
