"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRoles,
  fetchRolesStats,
  fetchRoleById,
  fetchSystemPermissions,
} from "@/lib/api/roles";
import { fetchDepartments } from "@/lib/api/departments";
import { InvalidationGraph } from "@/lib/query-keys";

export {
  useStaffQuery,
  useStaffStatsQuery,
  useStaffDetailQuery,
  useDepartmentsQuery,
} from "@/features/staff/hooks/useStaffQuery";

export const ROLES_QUERY_KEYS = {
  all: ["roles"] as const,
  list: () => [...ROLES_QUERY_KEYS.all, "list"] as const,
  stats: () => [...ROLES_QUERY_KEYS.all, "stats"] as const,
  permissions: () => [...ROLES_QUERY_KEYS.all, "permissions"] as const,
  details: () => [...ROLES_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) => [...ROLES_QUERY_KEYS.details(), String(id)] as const,
};

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

export function useSystemPermissionsQuery() {
  return useQuery({
    queryKey: ROLES_QUERY_KEYS.permissions(),
    queryFn: () => fetchSystemPermissions(),
  });
}

export function useRoleDetailQuery(id: string | number | null | undefined) {
  return useQuery({
    queryKey: ROLES_QUERY_KEYS.detail(id || ""),
    queryFn: () => fetchRoleById(id!),
    enabled: Boolean(id),
  });
}

export function invalidateRolesQueries(queryClient: ReturnType<typeof useQueryClient>) {
  return InvalidationGraph.onRoleMutation(queryClient);
}
