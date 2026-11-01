"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useQueryState } from "nuqs";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import {
  Ticket,
  TicketTabType,
  TicketFilterStatus,
  TicketDepartment,
  TicketAssignee,
  TicketStatus,
} from "../types/tickets.types";
import {
  initialTickets,
  initialDepartments,
  availableAssignees,
  sampleClients,
} from "../data/tickets.data";
import { TicketsStatsCards } from "./TicketsStatsCards";
import { TicketsFilterBar } from "./TicketsFilterBar";
import { TicketsTable } from "./TicketsTable";
import { TicketsEmptyState } from "./TicketsEmptyState";
import { CreateTicketView } from "./CreateTicketView";
import { TicketDetailsModal } from "./TicketDetailsModal";
import { ChangeAssigneeModal } from "./ChangeAssigneeModal";
import { ChangeStatusModal } from "./ChangeStatusModal";
import { DepartmentsSection } from "./DepartmentsSection";
import { AddDepartmentModal } from "./AddDepartmentModal";
import { DeleteDepartmentModal } from "./DeleteDepartmentModal";
import { useLanguage } from "@/lib/i18n";
import {
  fetchTickets,
  fetchTicketsStats,
  fetchTicketById,
  createTicket,
  assignTicket,
  updateTicketStatus,
  closeTicket,
  replyTicket,
} from "@/lib/api/tickets";
import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/lib/api/departments";
import { mapDepartmentFromApi } from "@/lib/api/mappers";
import {
  mapTicketsResponse,
  mapDepartmentsResponse,
  mapTicketFromApi,
} from "@/lib/api/mappers";
import { readStats, unwrapData } from "@/lib/api/helpers";

export function TicketsView() {
  const { t, isEn, direction } = useLanguage();

  // Navigation & View Mode driven by URL query param ?tab=tickets or ?tab=departments
  const [tabParam] = useQueryState("tab", { defaultValue: "tickets" });
  const activeTab: TicketTabType = tabParam === "departments" ? "departments" : "tickets";
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [selectedTicketForDetails, setSelectedTicketForDetails] = useState<Ticket | null>(null);

  // Data state
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [departments, setDepartments] = useState<TicketDepartment[]>(initialDepartments);
  const [assignees] = useState<TicketAssignee[]>(availableAssignees);
  const [isLoading, setIsLoading] = useState(true);

  const [apiTicketStats, setApiTicketStats] = useState<{
    open?: number;
    in_progress?: number;
    pending?: number;
    closed?: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    Promise.all([
      fetchTickets({ page: 1 }),
      fetchDepartments(),
      fetchTicketsStats(),
    ])
      .then(([ticketsPayload, deptsPayload, statsPayload]) => {
        if (cancelled) return;
        const mappedTickets = mapTicketsResponse(ticketsPayload);
        const mappedDepts = mapDepartmentsResponse(deptsPayload);
        if (mappedTickets.length > 0) setTickets(mappedTickets);
        if (mappedDepts.length > 0) setDepartments(mappedDepts);
        setApiTicketStats({
          open: readStats(statsPayload, ["open", "open_tickets"], 0),
          in_progress: readStats(
            statsPayload,
            ["in_progress", "in_progress_tickets"],
            0
          ),
          pending: readStats(statsPayload, ["pending", "pending_tickets"], 0),
          closed: readStats(statsPayload, ["closed", "closed_tickets"], 0),
        });
      })
      .catch(() => {
        // Keep empty data if API unavailable.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter state for tickets
  const [filterStatus, setFilterStatus] = useState<TicketFilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [forceEmptyState, setForceEmptyState] = useState(false);

  // Modals state
  const [assigneeModalTicket, setAssigneeModalTicket] = useState<Ticket | null>(null);
  const [statusModalTicket, setStatusModalTicket] = useState<Ticket | null>(null);
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<TicketDepartment | null>(null);

  // Counts
  const counts = useMemo(() => {
    return {
      all: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      in_progress: tickets.filter((t) => t.status === "in_progress").length,
      closed: tickets.filter((t) => t.status === "closed").length,
      pending: tickets.filter((t) => t.status === "pending").length,
    };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    if (forceEmptyState) return [];

    return tickets.filter((ticket) => {
      // Status filter
      if (filterStatus === "open" && ticket.status !== "open") return false;
      if (filterStatus === "in_progress" && ticket.status !== "in_progress") return false;
      if (filterStatus === "closed" && ticket.status !== "closed") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNum = ticket.ticketNumber.toLowerCase().includes(q);
        const matchesTitle = ticket.title.toLowerCase().includes(q);
        const matchesClient = ticket.client.firm.toLowerCase().includes(q) || ticket.client.name.toLowerCase().includes(q);
        const matchesDept = ticket.department.name.toLowerCase().includes(q);
        const matchesAssignee = ticket.assignee.name.toLowerCase().includes(q);
        return matchesNum || matchesTitle || matchesClient || matchesDept || matchesAssignee;
      }

      return true;
    });
  }, [tickets, filterStatus, searchQuery, forceEmptyState]);

  // Handlers: Tickets
  const handleSaveNewTicket = async (newTicket: Ticket) => {
    try {
      await createTicket({
        title: newTicket.title,
        description: newTicket.description,
        client_id: newTicket.client.id,
        department_id: newTicket.department.id,
        priority: newTicket.priority,
        category: newTicket.category,
      });
    } catch {
      // Keep local create.
    }
    setTickets((prev) => [newTicket, ...prev]);
    setIsCreatingTicket(false);
    toast.success(t("تم إنشاء التذكرة وإدراجها في قائمة المتابعة بنجاح", "Ticket created and added to tracking list successfully"));
  };

  const handleConfirmChangeAssignee = async (newAssignee: TicketAssignee, reason: string) => {
    if (!assigneeModalTicket) return;

    try {
      await assignTicket(assigneeModalTicket.id, newAssignee.id, reason);
    } catch {
      // Keep local assign.
    }

    setTickets((prev) =>
      prev.map((t) =>
        t.id === assigneeModalTicket.id
          ? {
              ...t,
              assignee: newAssignee,
              updatedAt: isEn ? "Just now" : "الآن",
              auditEvents: [
                {
                  id: `aud-${Date.now()}`,
                  action: isEn ? `Ticket reassigned to: ${newAssignee.name}` : `تم إعادة إسناد التذكرة إلى: ${newAssignee.name}`,
                  performer: isEn ? "System Admin" : "مشرف النظام",
                  timestamp: isEn ? "Just now" : "الآن",
                  details: reason || undefined,
                },
                ...t.auditEvents,
              ],
            }
          : t
      )
    );

    // Update details modal if open
    if (selectedTicketForDetails?.id === assigneeModalTicket.id) {
      setSelectedTicketForDetails((prev) =>
        prev
          ? {
              ...prev,
              assignee: newAssignee,
              updatedAt: isEn ? "Just now" : "الآن",
            }
          : null
      );
    }

    setAssigneeModalTicket(null);
    toast.success(
      isEn
        ? `Ticket assigned to "${newAssignee.name}" successfully`
        : `تم إسناد التذكرة إلى "${newAssignee.name}" بنجاح`
    );
  };

  const handleConfirmChangeStatus = async (newStatus: TicketStatus, notes: string) => {
    if (!statusModalTicket) return;

    const statusLabels: Record<TicketStatus, string> = {
      open: t("مفتوحة", "Open"),
      in_progress: t("جاري العمل عليها", "In Progress"),
      pending: t("معلقة", "Pending"),
      closed: t("مغلقة", "Closed"),
    };

    try {
      await updateTicketStatus(statusModalTicket.id, newStatus);
    } catch {
      // Keep local status update.
    }

    setTickets((prev) =>
      prev.map((t) =>
        t.id === statusModalTicket.id
          ? {
              ...t,
              status: newStatus,
              updatedAt: isEn ? "Just now" : "الآن",
              auditEvents: [
                {
                  id: `aud-${Date.now()}`,
                  action: isEn ? `Status updated to: ${statusLabels[newStatus]}` : `تحديث الحالة إلى: ${statusLabels[newStatus]}`,
                  performer: isEn ? "System Admin" : "مشرف النظام",
                  timestamp: isEn ? "Just now" : "الآن",
                  details: notes || undefined,
                },
                ...t.auditEvents,
              ],
            }
          : t
      )
    );

    // Update details modal if open
    if (selectedTicketForDetails?.id === statusModalTicket.id) {
      setSelectedTicketForDetails((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              updatedAt: isEn ? "Just now" : "الآن",
            }
          : null
      );
    }

    setStatusModalTicket(null);
    toast.success(
      isEn
        ? `Ticket status updated to "${statusLabels[newStatus]}"`
        : `تم تحديث حالة التذكرة إلى "${statusLabels[newStatus]}"`
    );
  };

  const handleCloseTicketSuccess = async (ticketId: string) => {
    try {
      await closeTicket(ticketId);
    } catch {
      // Keep local close.
    }
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: "closed",
              updatedAt: isEn ? "Just now" : "الآن",
              auditEvents: [
                {
                  id: `aud-${Date.now()}`,
                  action: isEn ? "Ticket closed and resolution verified" : "تم إغلاق التذكرة بنجاح واعتماد حل البلاغ",
                  performer: isEn ? "System Admin" : "مشرف النظام",
                  timestamp: isEn ? "Just now" : "الآن",
                },
                ...t.auditEvents,
              ],
            }
          : t
      )
    );

    if (selectedTicketForDetails?.id === ticketId) {
      setSelectedTicketForDetails((prev) =>
        prev
          ? {
              ...prev,
              status: "closed",
              updatedAt: isEn ? "Just now" : "الآن",
            }
          : null
      );
    }

    toast.success(t("تم إغلاق التذكرة بنجاح وتوثيق حل المشكلة", "Ticket closed and resolution recorded successfully"));
  };

  const handleSendMessage = async (ticketId: string, content: string) => {
    try {
      await replyTicket(ticketId, { message: content, notify_client_sms_email: true });
    } catch {
      // Keep local reply.
    }
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderName: isEn ? "Eng. Abdulaziz bin Fahd" : "م. عبد العزيز بن فهد",
      senderRole: isEn ? "System Administrator" : "مشرف النظام العام",
      senderInitials: isEn ? "AF" : "ع ف",
      isStaff: true,
      timestamp: isEn ? "Just now" : "الآن",
      content,
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              updatedAt: isEn ? "Just now" : "الآن",
            }
          : t
      )
    );

    if (selectedTicketForDetails?.id === ticketId) {
      setSelectedTicketForDetails((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, newMsg],
              updatedAt: isEn ? "Just now" : "الآن",
            }
          : null
      );
    }
  };

  // Handlers: Departments
  const handleSaveDepartment = async (newDept: TicketDepartment) => {
    const exists = departments.some((d) => d.id === newDept.id);
    try {
      if (exists) {
        await updateDepartment(newDept.id, {
          name: newDept.name,
          code: newDept.code,
          description: newDept.description,
          status: newDept.status,
        });
        const detail = await fetchDepartmentById(newDept.id);
        const raw = (unwrapData<Record<string, unknown>>(detail) ||
          detail) as Record<string, unknown>;
        if (raw?.id || raw?.name) {
          const mapped = mapDepartmentFromApi(raw);
          setDepartments((prev) =>
            prev.map((d) => (d.id === mapped.id ? mapped : d))
          );
          setIsAddDeptModalOpen(false);
          toast.success(
            isEn
              ? `Department "${newDept.name}" updated successfully`
              : `تم تحديث قسم "${newDept.name}" بنجاح`
          );
          return;
        }
      } else {
        await createDepartment({
          name: newDept.name,
          code: newDept.code,
          description: newDept.description,
          status: newDept.status,
        });
      }
    } catch {
      // Keep local create/update.
    }
    setDepartments((prev) =>
      exists ? prev.map((d) => (d.id === newDept.id ? newDept : d)) : [...prev, newDept]
    );
    setIsAddDeptModalOpen(false);
    toast.success(
      isEn
        ? `Department "${newDept.name}" added successfully`
        : `تمت إضافة قسم "${newDept.name}" بنجاح`
    );
  };

  const handleConfirmDeleteDepartment = async (deptId: string) => {
    const targetDept = departments.find((d) => d.id === deptId);
    try {
      await deleteDepartment(deptId);
    } catch {
      // Keep local delete.
    }
    setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    setDeptToDelete(null);
    toast.success(
      isEn
        ? `Department "${targetDept?.name || ""}" deleted successfully`
        : `تم حذف القسم "${targetDept?.name || ""}" بنجاح`
    );
  };

  const breadcrumbs = selectedTicketForDetails
    ? [
        { label: t("تذاكر الدعم الفني", "Support Tickets"), href: "/tickets" },
        {
          label: isEn
            ? `Ticket ${selectedTicketForDetails.ticketNumber || selectedTicketForDetails.id}`
            : `تذكرة ${selectedTicketForDetails.ticketNumber || selectedTicketForDetails.id}`,
        },
      ]
    : isCreatingTicket
    ? [
        { label: t("تذاكر الدعم الفني", "Support Tickets"), href: "/tickets" },
        { label: t("إنشاء تذكرة جديدة", "Create New Ticket") },
      ]
    : undefined;

  return (
    <div dir={direction} className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 antialiased select-none">
      {/* Sidebar with activeNav="support" and activeSubNav={activeTab} */}
      <DashboardSidebar activeNav="support" activeSubNav={activeTab} />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar customBreadcrumbs={breadcrumbs} />

        {/* Main Content Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-[16px] sm:p-[24px] md:p-[32px] max-w-[1400px] w-full mx-auto flex flex-col gap-[20px] scrollbar-thin">
          <DashboardPageTransition>
          {/* VIEW 1: Ticket Details View */}
          {selectedTicketForDetails ? (
            <TicketDetailsModal
              ticket={selectedTicketForDetails}
              onBack={() => setSelectedTicketForDetails(null)}
              onOpenAssigneeModal={() => setAssigneeModalTicket(selectedTicketForDetails)}
              onOpenStatusModal={() => setStatusModalTicket(selectedTicketForDetails)}
              onCloseTicketSuccess={() => handleCloseTicketSuccess(selectedTicketForDetails.id)}
              onSendMessage={handleSendMessage}
            />
          ) : isCreatingTicket ? (
            /* VIEW 2: Create Ticket View */
            <CreateTicketView
              departments={departments}
              assignees={assignees}
              clients={sampleClients}
              onBack={() => setIsCreatingTicket(false)}
              onSaveTicket={handleSaveNewTicket}
            />
          ) : activeTab === "departments" ? (
            /* VIEW 3: Departments Section */
            <DepartmentsSection
              departments={departments}
              onOpenAddModal={() => setIsAddDeptModalOpen(true)}
              onOpenDeleteModal={(dept) => setDeptToDelete(dept)}
              onEditDept={(dept) => toast.info(isEn ? `Edit department: ${dept.name}` : `تعديل القسم: ${dept.name}`)}
            />
          ) : isLoading && tickets.length === 0 ? (
            <DashboardPageSkeleton />
          ) : (
            /* VIEW 4: Main Tickets Directory */
            <div className="flex flex-col gap-[24px] w-full">
              {/* Main Identity & Command Banner */}
              <div
                className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]"
                data-node-id="1:14409"
              >
                <div className="flex flex-col gap-[4px] text-start">
                  <h1 className="text-[#1b1c1a] dark:text-[#fdfbf7] font-bold text-[24px] sm:text-[28px] leading-[38px]">
                    {t("تذاكر الدعم الفني", "Support Tickets")}
                  </h1>
                  <p className="text-[#514537] dark:text-[#cdc5bd] text-[13px] sm:text-[14px] leading-[22px]">
                    {t(
                      "متابعة وإدارة طلبات واستفسارات العملاء وأوامر العمل بالمنصة",
                      "Track and manage client inquiries and platform work orders"
                    )}
                  </p>
                </div>

                {/* Primary Action Button: Create Ticket */}
                <button
                  type="button"
                  onClick={() => setIsCreatingTicket(true)}
                  className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[8px] px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all shrink-0 cursor-pointer"
                  data-node-id="1:14412"
                >
                  <Plus className="size-[16px]" />
                  <span>{t("إنشاء تذكرة جديدة", "Create New Ticket")}</span>
                </button>
              </div>

              {/* Statistical Metric Cards */}
              <TicketsStatsCards
                openCount={apiTicketStats?.open ?? counts.open}
                inProgressCount={apiTicketStats?.in_progress ?? counts.in_progress}
                pendingCount={apiTicketStats?.pending ?? counts.pending}
                closedCount={apiTicketStats?.closed ?? counts.closed}
                isEmpty={forceEmptyState}
              />

              {/* Search & Filter Bar */}
              <TicketsFilterBar
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                counts={counts}
                isEmptyToggle={forceEmptyState}
                onToggleEmptyState={() => setForceEmptyState(!forceEmptyState)}
              />

              {/* Data Table OR Empty State Canvas */}
              {filteredTickets.length === 0 ? (
                <TicketsEmptyState
                  onCreateTicket={() => {
                    setForceEmptyState(false);
                    setIsCreatingTicket(true);
                  }}
                  onResetFilter={() => {
                    setForceEmptyState(false);
                    setFilterStatus("all");
                    setSearchQuery("");
                  }}
                  isFiltered={searchQuery.trim().length > 0 || filterStatus !== "all"}
                />
              ) : (
                <TicketsTable
                  tickets={filteredTickets}
                  onViewDetails={async (ticket) => {
                    setSelectedTicketForDetails(ticket);
                    try {
                      const payload = await fetchTicketById(ticket.id);
                      const raw = (unwrapData<Record<string, unknown>>(payload) ||
                        payload) as Record<string, unknown>;
                      if (raw?.id || raw?.ticket_number) {
                        setSelectedTicketForDetails(mapTicketFromApi(raw));
                      }
                    } catch {
                      // Keep list ticket.
                    }
                  }}
                  onChangeAssignee={(ticket) => setAssigneeModalTicket(ticket)}
                  onChangeStatus={(ticket) => setStatusModalTicket(ticket)}
                />
              )}
            </div>
          )}
          </DashboardPageTransition>
        </main>
      </div>

      {/* MODAL 1: Change Assignee Modal */}
      {assigneeModalTicket && (
        <ChangeAssigneeModal
          ticket={assigneeModalTicket}
          assignees={assignees}
          onClose={() => setAssigneeModalTicket(null)}
          onConfirm={handleConfirmChangeAssignee}
        />
      )}

      {/* MODAL 2: Change Status Modal */}
      {statusModalTicket && (
        <ChangeStatusModal
          ticket={statusModalTicket}
          onClose={() => setStatusModalTicket(null)}
          onConfirm={handleConfirmChangeStatus}
        />
      )}

      {/* MODAL 3: Add Department Modal */}
      {isAddDeptModalOpen && (
        <AddDepartmentModal
          onClose={() => setIsAddDeptModalOpen(false)}
          onSave={handleSaveDepartment}
        />
      )}

      {/* MODAL 4: Delete Department Confirmation Modal */}
      {deptToDelete && (
        <DeleteDepartmentModal
          department={deptToDelete}
          onClose={() => setDeptToDelete(null)}
          onConfirm={handleConfirmDeleteDepartment}
        />
      )}
    </div>
  );
}