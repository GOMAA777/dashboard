/**
 * Central Query Keys and Cross-Resource Invalidation Map
 * --------------------------------------------------------
 * All TanStack Query keys across the application are centralized here
 * with precise filter, pagination, and ID segments to support fine-grained
 * caching, SWR, and declarative invalidation graphs.
 */

import type { QueryClient } from "@tanstack/react-query";

export type PaginationAndFilterParams = Record<string, any>;

export const QUERY_KEYS = {
  // 1. Dashboard
  dashboard: {
    all: ["dashboard"] as const,
    home: () => [...QUERY_KEYS.dashboard.all, "home"] as const,
    stats: () => [...QUERY_KEYS.dashboard.all, "stats"] as const,
    charts: () => [...QUERY_KEYS.dashboard.all, "charts"] as const,
  },

  // 2. Law Firms / Clients
  firms: {
    all: ["firms"] as const,
    lists: () => [...QUERY_KEYS.firms.all, "list"] as const,
    list: (params?: PaginationAndFilterParams) =>
      [...QUERY_KEYS.firms.lists(), params ?? {}] as const,
    details: () => [...QUERY_KEYS.firms.all, "detail"] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.firms.details(), String(id)] as const,
    stats: () => [...QUERY_KEYS.firms.all, "stats"] as const,
  },

  // 3. Plans
  plans: {
    all: ["plans"] as const,
    lists: () => [...QUERY_KEYS.plans.all, "list"] as const,
    list: () => [...QUERY_KEYS.plans.lists()] as const,
    details: () => [...QUERY_KEYS.plans.all, "detail"] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.plans.details(), String(id)] as const,
    stats: () => [...QUERY_KEYS.plans.all, "stats"] as const,
    subscribers: (id?: string | number) =>
      [...QUERY_KEYS.plans.all, "subscribers", String(id ?? "all")] as const,
  },

  // 4. Subscriptions
  subscriptions: {
    all: ["subscriptions"] as const,
    lists: () => [...QUERY_KEYS.subscriptions.all, "list"] as const,
    list: (params?: PaginationAndFilterParams) =>
      [...QUERY_KEYS.subscriptions.lists(), params ?? {}] as const,
    details: () => [...QUERY_KEYS.subscriptions.all, "detail"] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.subscriptions.details(), String(id)] as const,
    stats: () => [...QUERY_KEYS.subscriptions.all, "stats"] as const,
    limits: (id: string | number) =>
      [...QUERY_KEYS.subscriptions.all, "limits", String(id)] as const,
  },

  // 5. Staff
  staff: {
    all: ["staff"] as const,
    lists: () => [...QUERY_KEYS.staff.all, "list"] as const,
    list: (params?: PaginationAndFilterParams) =>
      [...QUERY_KEYS.staff.lists(), params ?? {}] as const,
    details: () => [...QUERY_KEYS.staff.all, "detail"] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.staff.details(), String(id)] as const,
    stats: () => [...QUERY_KEYS.staff.all, "stats"] as const,
  },

  // 6. Roles & Permissions
  roles: {
    all: ["roles"] as const,
    lists: () => [...QUERY_KEYS.roles.all, "list"] as const,
    list: () => [...QUERY_KEYS.roles.lists()] as const,
    details: () => [...QUERY_KEYS.roles.all, "detail"] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.roles.details(), String(id)] as const,
    stats: () => [...QUERY_KEYS.roles.all, "stats"] as const,
    permissions: () => [...QUERY_KEYS.roles.all, "permissions"] as const,
  },

  // 7. Support Tickets
  tickets: {
    all: ["tickets"] as const,
    lists: () => [...QUERY_KEYS.tickets.all, "list"] as const,
    list: (params?: PaginationAndFilterParams) =>
      [...QUERY_KEYS.tickets.lists(), params ?? {}] as const,
    details: () => [...QUERY_KEYS.tickets.all, "detail"] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.tickets.details(), String(id)] as const,
    stats: (params?: { company_id?: number | string }) =>
      [...QUERY_KEYS.tickets.all, "stats", params ?? {}] as const,
    departments: () => [...QUERY_KEYS.tickets.all, "departments"] as const,
    departmentDetail: (id: string | number) =>
      [...QUERY_KEYS.tickets.all, "departments", String(id)] as const,
  },

  // 8. Notifications & Announcements
  announcements: {
    all: ["announcements"] as const,
    lists: () => [...QUERY_KEYS.announcements.all, "list"] as const,
    list: (params?: PaginationAndFilterParams) =>
      [...QUERY_KEYS.announcements.lists(), params ?? {}] as const,
    details: () => [...QUERY_KEYS.announcements.all, "detail"] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.announcements.details(), String(id)] as const,
    stats: () => [...QUERY_KEYS.announcements.all, "stats"] as const,
  },

  // 9. Invoices
  invoices: {
    all: ["invoices"] as const,
    lists: () => [...QUERY_KEYS.invoices.all, "list"] as const,
    list: (params?: PaginationAndFilterParams) =>
      [...QUERY_KEYS.invoices.lists(), params ?? {}] as const,
    details: () => [...QUERY_KEYS.invoices.all, "detail"] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.invoices.details(), String(id)] as const,
  },

  // 10. Payment Gateways
  paymentGateways: {
    all: ["payment-gateways"] as const,
    list: () => [...QUERY_KEYS.paymentGateways.all, "list"] as const,
    details: () => [...QUERY_KEYS.paymentGateways.all, "detail"] as const,
    detail: (code: string) =>
      [...QUERY_KEYS.paymentGateways.details(), code] as const,
  },

  // 11. Settings
  settings: {
    all: ["settings"] as const,
    general: () => [...QUERY_KEYS.settings.all, "general"] as const,
    mail: () => [...QUERY_KEYS.settings.all, "mail"] as const,
    currencies: () => [...QUERY_KEYS.settings.all, "currencies"] as const,
    languages: () => [...QUERY_KEYS.settings.all, "languages"] as const,
  },

  // 12. Profile & Audit Logs
  profile: {
    all: ["profile"] as const,
    auditLogs: () => [...QUERY_KEYS.profile.all, "audit-logs"] as const,
  },

  // 13. Utility
  utility: {
    all: ["utility"] as const,
    serverInfo: () => [...QUERY_KEYS.utility.all, "server-info"] as const,
    systemUpdate: () => [...QUERY_KEYS.utility.all, "system-update"] as const,
  },

  // 14. Impersonation Logs
  impersonationLogs: {
    all: ["impersonation-logs"] as const,
    list: (params?: PaginationAndFilterParams) =>
      [...QUERY_KEYS.impersonationLogs.all, "list", params ?? {}] as const,
  },

  // 15. Website Settings
  website: {
    all: ["website-settings"] as const,
    theme: () => [...QUERY_KEYS.website.all, "theme"] as const,
    seo: () => [...QUERY_KEYS.website.all, "seo"] as const,
    hero: () => [...QUERY_KEYS.website.all, "hero"] as const,
    features: () => [...QUERY_KEYS.website.all, "features"] as const,
  },
} as const;

/**
 * Cross-Resource Invalidation Helpers
 * -----------------------------------
 * Automatically propagates invalidations to dependent caches so that when an
 * action happens in one module (e.g., adding an office or updating a subscription),
 * all related summary cards, metrics, and dependent listings refresh silently.
 */
export const InvalidationGraph = {
  // When a Firm/Office is created, updated, or removed:
  onFirmMutation: (queryClient: QueryClient) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.firms.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans.all }),
    ]),

  // When a Subscription is created, renewed, upgraded, or cancelled:
  onSubscriptionMutation: (queryClient: QueryClient) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.firms.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans.all }),
    ]),

  // When a Plan is created, edited, deactivated, or deleted:
  onPlanMutation: (queryClient: QueryClient) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.firms.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions.all }),
    ]),

  // When a Staff member is added, edited, or status toggled:
  onStaffMutation: (queryClient: QueryClient) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staff.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles.all }),
    ]),

  // When a Role is created, updated, or deleted:
  onRoleMutation: (queryClient: QueryClient) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.staff.all }),
    ]),

  // When a Ticket is opened, updated, assigned, or closed:
  onTicketMutation: (queryClient: QueryClient) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all }),
      queryClient.invalidateQueries({ queryKey: ["departments"] }),
    ]),

  // When an Announcement is sent, drafted, or deleted:
  onAnnouncementMutation: (queryClient: QueryClient) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.announcements.all }),
    ]),

  // When an Invoice is created, payment recorded, or cancelled:
  onInvoiceMutation: (queryClient: QueryClient) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.invoices.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.all }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.subscriptions.all }),
    ]),

  // When a Payment Gateway is toggled or updated:
  onPaymentGatewayMutation: (queryClient: QueryClient) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.paymentGateways.all }),
    ]),

  // When Settings are updated:
  onSettingsMutation: (
    queryClient: QueryClient,
    section?: "general" | "mail" | "currencies" | "languages"
  ) => {
    if (section && section in QUERY_KEYS.settings) {
      return queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.settings[section](),
      });
    }
    return queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.settings.all,
    });
  },

  // When Website settings are updated:
  onWebsiteMutation: (
    queryClient: QueryClient,
    section?: "theme" | "seo" | "hero" | "features"
  ) => {
    if (section && section in QUERY_KEYS.website) {
      return queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.website[section](),
      });
    }
    return queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.website.all,
    });
  },
};
