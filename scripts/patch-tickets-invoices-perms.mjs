import fs from "fs";

function patchTickets() {
  const p = "src/features/tickets/components/TicketsView.tsx";
  let c = fs.readFileSync(p, "utf8");
  if (!c.includes('from "@/lib/permissions"')) {
    c = c.replace(
      'import { useLanguage } from "@/lib/i18n";',
      'import { useLanguage } from "@/lib/i18n";\nimport { usePermissions } from "@/lib/permissions";'
    );
  }
  if (!c.includes("const { hasPermission } = usePermissions()")) {
    c = c.replace(
      "const { t, isEn, direction } = useLanguage();",
      "const { t, isEn, direction } = useLanguage();\n  const { hasPermission } = usePermissions();"
    );
  }

  c = c.replace(
    `{/* Primary Action Button: Create Ticket */}
                  <button
                    type="button"
                    onClick={() => setIsCreatingTicket(true)}
                    className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[8px] px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all shrink-0 cursor-pointer"
                    data-node-id="1:14412"
                  >
                    <Plus className="size-[16px]" />
                    <span>{t("إنشاء تذكرة جديدة", "Create New Ticket")}</span>
                  </button>`,
    `{hasPermission("tickets.create") ? (
                  <button
                    type="button"
                    onClick={() => setIsCreatingTicket(true)}
                    className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[8px] px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all shrink-0 cursor-pointer"
                    data-node-id="1:14412"
                  >
                    <Plus className="size-[16px]" />
                    <span>{t("إنشاء تذكرة جديدة", "Create New Ticket")}</span>
                  </button>
                  ) : null}`
  );

  c = c.replace(
    `<TicketsEmptyState
                    onCreateTicket={() => {
                      setIsCreatingTicket(true);
                    }}`,
    `<TicketsEmptyState
                    onCreateTicket={
                      hasPermission("tickets.create")
                        ? () => {
                            setIsCreatingTicket(true);
                          }
                        : undefined
                    }`
  );

  c = c.replace(
    `onChangeAssignee={(ticket) => setAssigneeModalTicket(ticket)}
                    onChangeStatus={(ticket) => setStatusModalTicket(ticket)}`,
    `onChangeAssignee={
                      hasPermission("tickets.assign")
                        ? (ticket) => setAssigneeModalTicket(ticket)
                        : undefined
                    }
                    onChangeStatus={
                      hasPermission("tickets.status_change")
                        ? (ticket) => setStatusModalTicket(ticket)
                        : undefined
                    }`
  );

  c = c.replace(
    `onOpenDeleteModal={(dept) => setDeptToDelete(dept)}`,
    `onOpenDeleteModal={
                  hasPermission("departments.delete")
                    ? (dept) => setDeptToDelete(dept)
                    : undefined
                }`
  );

  fs.writeFileSync(p, c);
  console.log("tickets", {
    hook: c.includes("const { hasPermission } = usePermissions()"),
    create: c.includes('hasPermission("tickets.create")'),
  });
}

function patchInvoices() {
  const p = "src/features/invoices/components/InvoicesView.tsx";
  let c = fs.readFileSync(p, "utf8");
  if (!c.includes('from "@/lib/permissions"')) {
    c = c.replace(
      'import { useLanguage } from "@/lib/i18n";',
      'import { useLanguage } from "@/lib/i18n";\nimport { usePermissions } from "@/lib/permissions";'
    );
  }
  if (!c.includes("const { hasPermission } = usePermissions()")) {
    c = c.replace(
      "const { isEn, direction, t } = useLanguage();",
      "const { isEn, direction, t } = useLanguage();\n  const { hasPermission } = usePermissions();"
    );
  }

  c = c.replace(
    `<InvoicesManagementHeader
                onCreateInvoice={() => setIsCreateModalOpen(true)}
                onExportReport={handleExportReport}
              />`,
    `<InvoicesManagementHeader
                onCreateInvoice={
                  hasPermission("invoices.view") && hasPermission("gateways.manage")
                    ? () => setIsCreateModalOpen(true)
                    : hasPermission("invoices.view")
                      ? () => setIsCreateModalOpen(true)
                      : undefined
                }
                onExportReport={hasPermission("invoices.export") ? handleExportReport : undefined}
              />`
  );

  // Simpler create gate: invoices don't have invoices.create in API — use invoices.view for create button visibility only if they can view; actually no create key. Keep create visible only for users with invoices.view AND (gateways.manage OR invoices.export)? 
  // Better: show create when invoices.view (same as before for admins). There's no invoices.create in API catalog.
  c = c.replace(
    `onCreateInvoice={
                  hasPermission("invoices.view") && hasPermission("gateways.manage")
                    ? () => setIsCreateModalOpen(true)
                    : hasPermission("invoices.view")
                      ? () => setIsCreateModalOpen(true)
                      : undefined
                }`,
    `onCreateInvoice={hasPermission("invoices.view") ? () => setIsCreateModalOpen(true) : undefined}`
  );

  fs.writeFileSync(p, c);
  console.log("invoices", {
    hook: c.includes("const { hasPermission } = usePermissions()"),
    export: c.includes('hasPermission("invoices.export")'),
  });
}

patchTickets();
patchInvoices();
