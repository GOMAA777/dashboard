import fs from "fs";

// PlanCard: make onEdit optional and hide buttons when missing
{
  const p = "src/features/plans/components/PlanCard.tsx";
  let c = fs.readFileSync(p, "utf8");
  c = c.replace(
    "onEdit: (plan: PricingPlanItem) => void;",
    "onEdit?: (plan: PricingPlanItem) => void;"
  );
  c = c.replace(
    `          <button
            type="button"
            onClick={() => onToggleActive && onToggleActive(plan)}
            className={\`px-2 py-1 rounded-[4px] text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1 shadow-2xs \${
              plan.isActive
                ? "bg-[#fffbeb] dark:bg-[#2c2014] hover:bg-[#fef3c7] dark:hover:bg-[#3d2c1c] text-[#9c6402] dark:text-[#e29d38] border-[#fde68a] dark:border-[#523b24]"
                : "bg-[#e8f5e9] dark:bg-[#132c1c] hover:bg-[#c8e6c9] dark:hover:bg-[#1b4329] text-[#1b7340] dark:text-[#6ee7b7] border-[#c8e6c9] dark:border-emerald-500/40"
            }\`}`,
    `          {onToggleActive ? (
          <button
            type="button"
            onClick={() => onToggleActive(plan)}
            className={\`px-2 py-1 rounded-[4px] text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1 shadow-2xs \${
              plan.isActive
                ? "bg-[#fffbeb] dark:bg-[#2c2014] hover:bg-[#fef3c7] dark:hover:bg-[#3d2c1c] text-[#9c6402] dark:text-[#e29d38] border-[#fde68a] dark:border-[#523b24]"
                : "bg-[#e8f5e9] dark:bg-[#132c1c] hover:bg-[#c8e6c9] dark:hover:bg-[#1b4329] text-[#1b7340] dark:text-[#6ee7b7] border-[#c8e6c9] dark:border-emerald-500/40"
            }\`}`
  );
  // This file's toggle/delete already guard with && — just wrap edit button
  c = c.replace(
    `        <button
          type="button"
          onClick={() => onEdit(plan)}
          className={\`flex-1 py-2 px-2 rounded-[4px] text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs \${
            plan.isPopular
              ? "bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#c88528] text-white dark:text-[#1c140f]"
              : "bg-[#1b1c1a] dark:bg-[#281c15] hover:bg-[#333] dark:hover:bg-[#38271c] text-white dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c]"
          }\`}`,
    `        {onEdit ? (
        <button
          type="button"
          onClick={() => onEdit(plan)}
          className={\`flex-1 py-2 px-2 rounded-[4px] text-[11px] font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs \${
            plan.isPopular
              ? "bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#c88528] text-white dark:text-[#1c140f]"
              : "bg-[#1b1c1a] dark:bg-[#281c15] hover:bg-[#333] dark:hover:bg-[#38271c] text-white dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c]"
          }\`}`
  );
  fs.writeFileSync(p, c);
  console.log("PlanCard onEdit optional");
}

// TicketsEmptyState
{
  const p = "src/features/tickets/components/TicketsEmptyState.tsx";
  let c = fs.readFileSync(p, "utf8");
  c = c.replace("onCreateTicket: () => void;", "onCreateTicket?: () => void;");
  c = c.replace(
    `        <button
          type="button"
          onClick={onCreateTicket}
          className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[8px] px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
          data-node-id="1:16132"
        >
          <Plus className="size-[16px]" />
          <span>{t("إنشاء تذكرة جديدة", "Create New Ticket")}</span>
        </button>`,
    `        {onCreateTicket ? (
        <button
          type="button"
          onClick={onCreateTicket}
          className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[8px] px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
          data-node-id="1:16132"
        >
          <Plus className="size-[16px]" />
          <span>{t("إنشاء تذكرة جديدة", "Create New Ticket")}</span>
        </button>
        ) : null}`
  );
  fs.writeFileSync(p, c);
  console.log("TicketsEmptyState optional create");
}

// TicketsTable
{
  const p = "src/features/tickets/components/TicketsTable.tsx";
  let c = fs.readFileSync(p, "utf8");
  c = c.replace(
    "onChangeAssignee: (ticket: Ticket) => void;\n  onChangeStatus: (ticket: Ticket) => void;",
    "onChangeAssignee?: (ticket: Ticket) => void;\n  onChangeStatus?: (ticket: Ticket) => void;"
  );
  c = c.replace(
    `                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuTicketId(null);
                                onChangeAssignee(ticket);
                              }}
                              className="w-full flex items-center gap-[8px] px-[12px] py-[8px] text-[12px] text-[#1b1c1a] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
                            >
                              <UserCheck className="size-[13px] text-[#514537]" />
                              <span>{t("تغيير الموظف المسؤول", "Change Assignee")}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuTicketId(null);
                                onChangeStatus(ticket);
                              }}
                              className="w-full flex items-center gap-[8px] px-[12px] py-[8px] text-[12px] text-[#1b1c1a] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
                            >
                              <RefreshCw className="size-[13px] text-[#514537]" />
                              <span>{t("تغيير حالة التذكرة", "Change Status")}</span>
                            </button>`,
    `                            {onChangeAssignee ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuTicketId(null);
                                onChangeAssignee(ticket);
                              }}
                              className="w-full flex items-center gap-[8px] px-[12px] py-[8px] text-[12px] text-[#1b1c1a] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
                            >
                              <UserCheck className="size-[13px] text-[#514537]" />
                              <span>{t("تغيير الموظف المسؤول", "Change Assignee")}</span>
                            </button>
                            ) : null}
                            {onChangeStatus ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuTicketId(null);
                                onChangeStatus(ticket);
                              }}
                              className="w-full flex items-center gap-[8px] px-[12px] py-[8px] text-[12px] text-[#1b1c1a] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
                            >
                              <RefreshCw className="size-[13px] text-[#514537]" />
                              <span>{t("تغيير حالة التذكرة", "Change Status")}</span>
                            </button>
                            ) : null}`
  );
  fs.writeFileSync(p, c);
  console.log("TicketsTable optional actions");
}

// DepartmentsSection
{
  const p = "src/features/tickets/components/DepartmentsSection.tsx";
  let c = fs.readFileSync(p, "utf8");
  c = c.replace(
    "onOpenAddModal: () => void;\n  onOpenDeleteModal: (dept: TicketDepartment) => void;",
    "onOpenAddModal?: () => void;\n  onOpenDeleteModal?: (dept: TicketDepartment) => void;"
  );
  c = c.replace(
    `                          <button
                            type="button"
                            onClick={() => onOpenDeleteModal(dept)}
                            title={t("حذف القسم", "Delete Department")}
                            className="size-[28px] rounded-[4px] hover:bg-[#ffdad6]/60 dark:hover:bg-[#381616] flex items-center justify-center text-[#514537] dark:text-[#cdc5bd] hover:text-[#ba1a1a] dark:hover:text-[#f87171] transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-[14px]" />
                          </button>`,
    `                          {onOpenDeleteModal ? (
                          <button
                            type="button"
                            onClick={() => onOpenDeleteModal(dept)}
                            title={t("حذف القسم", "Delete Department")}
                            className="size-[28px] rounded-[4px] hover:bg-[#ffdad6]/60 dark:hover:bg-[#381616] flex items-center justify-center text-[#514537] dark:text-[#cdc5bd] hover:text-[#ba1a1a] dark:hover:text-[#f87171] transition-colors cursor-pointer"
                          >
                            <Trash2 className="size-[14px]" />
                          </button>
                          ) : null}`
  );
  fs.writeFileSync(p, c);
  console.log("DepartmentsSection optional delete");
}
