"use client";

import React from "react";
import { useQueryState } from "nuqs";
import { RolesManagementView } from "./RolesManagementView";
import { StaffManagementView } from "@/features/staff/components/StaffManagementView";

export function PermissionsPageSwitcher() {
  const [tab] = useQueryState("tab", { defaultValue: "roles" });

  if (tab === "staff") {
    return <StaffManagementView />;
  }

  return <RolesManagementView />;
}
