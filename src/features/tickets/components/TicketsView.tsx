"use client";

import React, { useState, useMemo } from "react";
import { Plus, Ticket as TicketIcon, Building2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
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

export function TicketsView() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<TicketTabType>("tickets");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [selectedTicketForDetails, setSelectedTicketForDetails] = useState<Ticket | null>(null);

  // Data state
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [departments, setDepartments] = useState<TicketDepartment[]>(initialDepartments);
  const [assignees] = useState<TicketAssignee[]>(availableAssignees);

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
  const handleSaveNewTicket = (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setIsCreatingTicket(false);
    toast.success("تم إنشاء التذكرة وإدراجها في قائمة المتابعة بنجاح");
  };

  const handleConfirmChangeAssignee = (newAssignee: TicketAssignee, reason: string) => {
    if (!assigneeModalTicket) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === assigneeModalTicket.id
          ? {
              ...t,
              assignee: newAssignee,
              updatedAt: "الآن",
              auditEvents: [
                {
                  id: `aud-${Date.now()}`,
                  action: `تم إعادة إسناد التذكرة إلى: ${newAssignee.name}`,
                  performer: "مشرف النظام",
                  timestamp: "الآن",
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
              updatedAt: "الآن",
            }
          : null
      );
    }

    setAssigneeModalTicket(null);
    toast.success(`تم إسناد التذكرة إلى "${newAssignee.name}" بنجاح`);
  };

  const handleConfirmChangeStatus = (newStatus: TicketStatus, notes: string) => {
    if (!statusModalTicket) return;

    const statusLabels: Record<TicketStatus, string> = {
      open: "مفتوحة",
      in_progress: "جاري العمل عليها",
      pending: "معلقة",
      closed: "مغلقة",
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === statusModalTicket.id
          ? {
              ...t,
              status: newStatus,
              updatedAt: "الآن",
              auditEvents: [
                {
                  id: `aud-${Date.now()}`,
                  action: `تحديث الحالة إلى: ${statusLabels[newStatus]}`,
                  performer: "مشرف النظام",
                  timestamp: "الآن",
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
              updatedAt: "الآن",
            }
          : null
      );
    }

    setStatusModalTicket(null);
    toast.success(`تم تحديث حالة التذكرة إلى "${statusLabels[newStatus]}"`);
  };

  const handleCloseTicketSuccess = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: "closed",
              updatedAt: "الآن",
              auditEvents: [
                {
                  id: `aud-${Date.now()}`,
                  action: "تم إغلاق التذكرة بنجاح واعتماد حل البلاغ",
                  performer: "مشرف النظام",
                  timestamp: "الآن",
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
              updatedAt: "الآن",
            }
          : null
      );
    }

    toast.success("تم إغلاق التذكرة بنجاح وتوثيق حل المشكلة");
  };

  const handleSendMessage = (ticketId: string, content: string) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderName: "م. عبد العزيز بن فهد",
      senderRole: "مشرف النظام العام",
      senderInitials: "ع ف",
      isStaff: true,
      timestamp: "الآن",
      content,
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              updatedAt: "الآن",
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
              updatedAt: "الآن",
            }
          : null
      );
    }
  };

  // Handlers: Departments
  const handleSaveDepartment = (newDept: TicketDepartment) => {
    setDepartments((prev) => [...prev, newDept]);
    setIsAddDeptModalOpen(false);
    toast.success(`تمت إضافة قسم "${newDept.name}" بنجاح`);
  };

  const handleConfirmDeleteDepartment = (deptId: string) => {
    const targetDept = departments.find((d) => d.id === deptId);
    setDepartments((prev) => prev.filter((d) => d.id !== deptId));
    setDeptToDelete(null);
    toast.success(`تم حذف القسم "${targetDept?.name || ""}" بنجاح`);
  };

  return (
    <div className="flex min-h-screen bg-[#f5f3ef] text-[#1c140f] antialiased select-none" dir="rtl">
      {/* Sidebar with activeNav="support" */}
      <DashboardSidebar activeNav="support" />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <DashboardTopNavbar />

        {/* Main Content Container */}
        <main className="flex-1 p-[24px] sm:p-[32px] max-w-[1400px] w-full mx-auto flex flex-col gap-[24px]">
          {/* Top Sub-Navigation Tabs: تذاكر الدعم الفني vs الأقسام */}
          {!isCreatingTicket && !selectedTicketForDetails && (
            <div className="flex items-center gap-[8px] bg-white rounded-[8px] p-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("tickets")}
                className={`flex items-center gap-[8px] px-[18px] py-[8px] rounded-[6px] text-[13px] font-semibold transition-all cursor-pointer ${
                  activeTab === "tickets"
                    ? "bg-[#9c6402] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                    : "text-[#514537] hover:text-[#1b1c1a] hover:bg-[#f5f3ef]"
                }`}
              >
                <TicketIcon className="size-[15px]" />
                <span>تذاكر الدعم الفني</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("departments")}
                className={`flex items-center gap-[8px] px-[18px] py-[8px] rounded-[6px] text-[13px] font-semibold transition-all cursor-pointer ${
                  activeTab === "departments"
                    ? "bg-[#9c6402] text-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                    : "text-[#514537] hover:text-[#1b1c1a] hover:bg-[#f5f3ef]"
                }`}
              >
                <Building2 className="size-[15px]" />
                <span>الأقسام</span>
              </button>
            </div>
          )}

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
              onEditDept={(dept) => toast.info(`تعديل القسم: ${dept.name}`)}
            />
          ) : (
            /* VIEW 4: Main Tickets Directory */
            <div className="flex flex-col gap-[24px] w-full">
              {/* Main Identity & Command Banner */}
              <div
                className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]"
                data-node-id="1:14409"
              >
                <div className="flex flex-col gap-[4px] text-right">
                  <h1 className="text-[#1b1c1a] font-bold text-[24px] sm:text-[28px] leading-[38px]">
                    تذاكر الدعم الفني
                  </h1>
                  <p className="text-[#514537] text-[13px] sm:text-[14px] leading-[22px]">
                    متابعة وإدارة طلبات واستفسارات العملاء وأوامر العمل بالمنصة
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
                  <span>إنشاء تذكرة جديدة</span>
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
                  onViewDetails={(ticket) => setSelectedTicketForDetails(ticket)}
                  onChangeAssignee={(ticket) => setAssigneeModalTicket(ticket)}
                  onChangeStatus={(ticket) => setStatusModalTicket(ticket)}
                />
              )}
            </div>
          )}
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
