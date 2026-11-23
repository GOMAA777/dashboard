import fs from "fs";

const p = "src/features/plans/components/PlansView.tsx";
let c = fs.readFileSync(p, "utf8");

if (!c.includes("const { hasPermission } = usePermissions()")) {
  c = c.replace(
    "const { t, isEn } = useLanguage();\n",
    "const { t, isEn } = useLanguage();\n  const { hasPermission } = usePermissions();\n"
  );
}

c = c.replace(
  'onCreatePlan={() => navigateToView("create")}',
  'onCreatePlan={hasPermission("plans.create") ? () => navigateToView("create") : undefined}'
);

c = c.replace(
  `onEdit={handleEditPlan}
                      onViewDetails={handleViewPlanDetails}
                      onViewSubscribers={handleViewSubscribedFirms}
                      onToggleActive={handleOpenDeactivateDialog}
                      onDelete={handleOpenDeleteDialog}`,
  `onEdit={hasPermission("plans.edit") ? handleEditPlan : undefined}
                      onViewDetails={handleViewPlanDetails}
                      onViewSubscribers={handleViewSubscribedFirms}
                      onToggleActive={
                        hasPermission("plans.status_change") || hasPermission("plans.edit")
                          ? handleOpenDeactivateDialog
                          : undefined
                      }
                      onDelete={hasPermission("plans.delete") ? handleOpenDeleteDialog : undefined}`
);

fs.writeFileSync(p, c);
console.log("patched", {
  hook: c.includes("const { hasPermission } = usePermissions()"),
  create: c.includes('hasPermission("plans.create")'),
  delete: c.includes('hasPermission("plans.delete")'),
});
