"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useQueryState } from "nuqs";
import { Plus, AlertTriangle, RefreshCw } from "lucide-react";
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
  TicketClient,
  TicketStatus,
  TicketAttachment,
} from "../types/tickets.types";
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
  CreateTicketPayload,
} from "@/lib/api/tickets";
import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/lib/api/departments";
import { fetchStaff } from "@/lib/api/staff";
import { fetchFirms } from "@/lib/api/firms";
import { mapDepartmentFromApi } from "@/lib/api/mappers";
import {
  mapTicketsResponse,
  mapDepartmentsResponse,
  mapTicketFromApi,
  saveLocalTicketAttachments,
} from "@/lib/api/mappers";
import { readStats, unwrapData, unwrapList } from "@/lib/api/helpers";

export function TicketsView() {
  const { t, isEn, direction } = useLanguage();

  // Navigation & View Mode driven by URL query param ?tab=tickets or ?tab=departments
  const [tabParam] = useQueryState("tab", { defaultValue: "tickets" });
  const activeTab: TicketTabType = tabParam === "departments" ? "departments" : "tickets";
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [selectedTicketForDetails, setSelectedTicketForDetails] = useState<Ticket | null>(null);

  // Data state
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [departments, setDepartments] = useState<TicketDepartment[]>([]);
  const [assignees, setAssignees] = useState<TicketAssignee[]>([]);
  const [clients, setClients] = useState<TicketClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [apiTicketStats, setApiTicketStats] = useState<{
    open?: number;
    in_progress?: number;
    pending?: number;
    closed?: number;
  } | null>(null);

  // Filter state for tickets
  const [filterStatus, setFilterStatus] = useState<TicketFilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [forceEmptyState, setForceEmptyState] = useState(false);

  // Modals state
  const [assigneeModalTicket, setAssigneeModalTicket] = useState<Ticket | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [statusModalTicket, setStatusModalTicket] = useState<Ticket | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<TicketDepartment | null>(null);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [ticketsPayload, deptsPayload, statsPayload, staffPayload, firmsPayload] =
        await Promise.all([
          fetchTickets({
            status: filterStatus === "all" ? undefined : filterStatus,
            search: searchQuery.trim() || undefined,
          }),
          fetchDepartments().catch(() => null),
          fetchTicketsStats().catch(() => null),
          fetchStaff().catch(() => null),
          fetchFirms({ per_page: 100 }).catch(() => null),
        ]);

      const mappedTickets = mapTicketsResponse(ticketsPayload);
      setTickets(mappedTickets);

      if (deptsPayload) {
        const mappedDepts = mapDepartmentsResponse(deptsPayload);
        if (mappedDepts.length > 0) setDepartments(mappedDepts);
      }

      if (statsPayload) {
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
      }

      if (staffPayload) {
        const staffList = unwrapList<Record<string, unknown>>(staffPayload);
        if (staffList.length > 0) {
          const mappedStaff: TicketAssignee[] = staffList.map((s, idx) => {
            const name = String(s.name || s.username || `موظف ${idx + 1}`);
            return {
              id: String(s.id || idx + 1),
              name,
              initials: name.trim().slice(0, 2) || "م",
              role: String(s.role_name || s.role || "أخصائي دعم فني"),
              department: String(s.department_name || s.department || "الدعم الفني"),
              activeTicketsCount: Number(s.active_tickets_count || s.active_tickets || 0),
              isAvailable: s.status === "active" || s.is_active === true,
            };
          });
          setAssignees(mappedStaff);
        }
      }

      if (firmsPayload) {
        const firmsList = unwrapList<Record<string, unknown>>(firmsPayload);
        if (firmsList.length > 0) {
          const mappedClients: TicketClient[] = firmsList.map((f, idx) => ({
            id: String(f.id || idx + 1),
            name: String(f.owner_name || f.owner || f.name || "المسؤول"),
            firm: String(f.name || f.firm_name || "مكتب محاماة"),
            email: String(f.email || "support@client.com"),
            phone: String(f.phone || "+966 50 000 0000"),
            crNumber: String(f.tax_number || f.license_number || f.cr_number || "—"),
          }));
          setClients(mappedClients);
        }
      }
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setError(
        isEn
          ? "Failed to load support tickets. Please verify your connection."
          : "تعذر استرجاع تذاكر الدعم الفني. يرجى التحقق من الاتصال وإعادة المحاولة."
      );
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus, searchQuery, isEn]);

  useEffect(() => {
    let cancelled = false;
    loadData().then(() => {
      if (cancelled) return;
    });
    return () => {
      cancelled = true;
    };
  }, [loadData]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: tickets.length,
      open: apiTicketStats?.open ?? tickets.filter((t) => t.status === "open").length,
      in_progress: apiTicketStats?.in_progress ?? tickets.filter((t) => t.status === "in_progress").length,
      closed: apiTicketStats?.closed ?? tickets.filter((t) => t.status === "closed").length,
      pending: apiTicketStats?.pending ?? tickets.filter((t) => t.status === "pending").length,
    };
  }, [tickets, apiTicketStats]);

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
  const handleSaveNewTicket = async (
    payload: CreateTicketPayload,
    assigneeId?: string,
    attachments?: TicketAttachment[]
  ): Promise<boolean> => {
    try {
      const response = await createTicket(payload);
      const raw = (unwrapData<Record<string, unknown>>(response) || response) as Record<string, unknown>;
      const createdTicketId = raw?.id ? String(raw.id) : null;

      if (createdTicketId && attachments && attachments.length > 0) {
        saveLocalTicketAttachments(createdTicketId, attachments);
      }

      if (createdTicketId && assigneeId) {
        try {
          await assignTicket(createdTicketId, { staff_id: Number(assigneeId) });
        } catch {
          // Keep main create successful
        }
      }

      toast.success(
        t(
          "تم إنشاء التذكرة وإدراجها في قائمة المتابعة بنجاح",
          "Ticket created and added to tracking list successfully"
        )
      );

      setIsCreatingTicket(false);
      await loadData();
      return true;
    } catch (err: unknown) {
      const errObj = err as { status?: number; body?: unknown };
      if (errObj.status === 422) {
        toast.error(
          isEn
            ? "Validation error. Please check the fields."
            : "خطأ في التحقق من البيانات. يرجى مراجعة الحقول."
        );
        throw err;
      }
      toast.error(
        isEn
          ? "Failed to create ticket. Please try again."
          : "تعذر إنشاء التذكرة. يرجى المحاولة مرة أخرى."
      );
      return false;
    }
  };

  const handleConfirmChangeAssignee = async (newAssignee: TicketAssignee, reason: string): Promise<boolean> => {
    if (!assigneeModalTicket) return false;
    setIsAssigning(true);

    try {
      await assignTicket(assigneeModalTicket.id, {
        staff_id: Number(newAssignee.id),
        reason: reason.trim() || undefined,
      });

      toast.success(
        isEn
          ? `Ticket assigned to "${newAssignee.name}" successfully`
          : `تم إسناد التذكرة إلى "${newAssignee.name}" بنجاح`
      );

      setAssigneeModalTicket(null);
      await loadData();

      if (selectedTicketForDetails?.id === assigneeModalTicket.id) {
        const detail = await fetchTicketById(assigneeModalTicket.id);
        const raw = (unwrapData<Record<string, unknown>>(detail) || detail) as Record<string, unknown>;
        if (raw?.id || raw?.ticket_number) {
          setSelectedTicketForDetails(mapTicketFromApi(raw));
        }
      }
      return true;
    } catch {
      toast.error(
        isEn
          ? "Failed to reassign ticket. Please try again."
          : "تعذر إعادة إسناد التذكرة. يرجى المحاولة مرة أخرى."
      );
      return false;
    } finally {
      setIsAssigning(false);
    }
  };

  const handleConfirmChangeStatus = async (newStatus: TicketStatus, _notes: string): Promise<boolean> => {
    if (!statusModalTicket) return false;
    setIsUpdatingStatus(true);

    const statusLabels: Record<TicketStatus, string> = {
      open: t("مفتوحة", "Open"),
      in_progress: t("جاري العمل عليها", "In Progress"),
      pending: t("معلقة", "Pending"),
      closed: t("مغلقة", "Closed"),
    };

    try {
      await updateTicketStatus(statusModalTicket.id, { status: newStatus });

      toast.success(
        isEn
          ? `Ticket status updated to "${statusLabels[newStatus]}"`
          : `تم تحديث حالة التذكرة إلى "${statusLabels[newStatus]}"`
      );

      setStatusModalTicket(null);
      await loadData();

      if (selectedTicketForDetails?.id === statusModalTicket.id) {
        const detail = await fetchTicketById(statusModalTicket.id);
        const raw = (unwrapData<Record<string, unknown>>(detail) || detail) as Record<string, unknown>;
        if (raw?.id || raw?.ticket_number) {
          setSelectedTicketForDetails(mapTicketFromApi(raw));
        }
      }
      return true;
    } catch {
      toast.error(
        isEn
          ? "Failed to update ticket status. Please try again."
          : "تعذر تحديث حالة التذكرة. يرجى المحاولة مرة أخرى."
      );
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCloseTicketSuccess = async (ticketId: string): Promise<boolean> => {
    try {
      await closeTicket(ticketId);

      toast.success(
        t(
          "تم إغلاق التذكرة بنجاح وتوثيق حل المشكلة",
          "Ticket closed and resolution recorded successfully"
        )
      );

      await loadData();

      if (selectedTicketForDetails?.id === ticketId) {
        const detail = await fetchTicketById(ticketId);
        const raw = (unwrapData<Record<string, unknown>>(detail) || detail) as Record<string, unknown>;
        if (raw?.id || raw?.ticket_number) {
          setSelectedTicketForDetails(mapTicketFromApi(raw));
        }
      }
      return true;
    } catch {
      toast.error(
        isEn
          ? "Failed to close ticket. Please try again."
          : "تعذر إغلاق التذكرة. يرجى المحاولة مرة أخرى."
      );
      return false;
    }
  };

  const handleSendMessage = async (ticketId: string, content: string, isInternalNote?: boolean): Promise<boolean> => {
    try {
      await replyTicket(ticketId, {
        message: content,
        is_internal_note: isInternalNote,
        notify_client_sms_email: !isInternalNote,
      });

      const detail = await fetchTicketById(ticketId);
      const raw = (unwrapData<Record<string, unknown>>(detail) || detail) as Record<string, unknown>;
      if (raw?.id || raw?.ticket_number) {
        setSelectedTicketForDetails(mapTicketFromApi(raw));
      }
      return true;
    } catch {
      toast.error(
        isEn
          ? "Failed to send message. Please try again."
          : "تعذر إرسال الرد. يرجى المحاولة مرة أخرى."
      );
      return false;
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
        const raw = (unwrapData<Record<string, unknown>>(detail) || detail) as Record<string, unknown>;
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
      await loadData();
      setIsAddDeptModalOpen(false);
      toast.success(
        isEn
          ? `Department "${newDept.name}" added successfully`
          : `تمت إضافة قسم "${newDept.name}" بنجاح`
      );
    } catch {
      toast.error(isEn ? "Failed to save department" : "تعذر حفظ القسم");
    }
  };

  const handleConfirmDeleteDepartment = async (deptId: string) => {
    const targetDept = departments.find((d) => d.id === deptId);
    try {
      await deleteDepartment(deptId);
      setDepartments((prev) => prev.filter((d) => d.id !== deptId));
      setDeptToDelete(null);
      toast.success(
        isEn
          ? `Department "${targetDept?.name || ""}" deleted successfully`
          : `تم حذف القسم "${targetDept?.name || ""}" بنجاح`
      );
      await loadData();
    } catch {
      toast.error(isEn ? "Failed to delete department" : "تعذر حذف القسم");
    }
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
                clients={clients}
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
            ) : error && tickets.length === 0 ? (
              /* ERROR STATE with retry button */
              <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[32px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c] flex flex-col items-center justify-center text-center gap-[16px]">
                <div className="size-[48px] rounded-full bg-[#ffdad6] dark:bg-[#381616] flex items-center justify-center text-[#ba1a1a] dark:text-[#f87171]">
                  <AlertTriangle className="size-[24px]" />
                </div>
                <div className="flex flex-col gap-[4px] max-w-[420px]">
                  <h3 className="text-[#1b1c1a] dark:text-[#fdfbf7] font-bold text-[18px]">
                    {t("حدث خطأ أثناء تحميل التذاكر", "Error Loading Tickets")}
                  </h3>
                  <p className="text-[#514537] dark:text-[#cdc5bd] text-[13px] leading-[22px]">
                    {error}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => loadData()}
                  className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[8px] px-[20px] py-[9px] rounded-[4px] font-semibold text-[13px] transition-all cursor-pointer shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                >
                  <RefreshCw className="size-[14px]" />
                  <span>{t("إعادة المحاولة", "Retry")}</span>
                </button>
              </div>
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
                  openCount={counts.open}
                  inProgressCount={counts.in_progress}
                  pendingCount={counts.pending}
                  closedCount={counts.closed}
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
                        // Keep list ticket
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
          isSubmitting={isAssigning}
          onClose={() => setAssigneeModalTicket(null)}
          onConfirm={handleConfirmChangeAssignee}
        />
      )}

      {/* MODAL 2: Change Status Modal */}
      {statusModalTicket && (
        <ChangeStatusModal
          ticket={statusModalTicket}
          isSubmitting={isUpdatingStatus}
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
