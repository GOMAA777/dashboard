"use client";

import {
  endFirmImpersonation,
  issueFirmImpersonation,
} from "./impersonation";

/** @deprecated Prefer issueFirmImpersonation — kept for existing imports. */
export async function loginAsFirm(firmId: string | number) {
  return issueFirmImpersonation(firmId);
}

export async function endFirmPreview() {
  return endFirmImpersonation();
}
