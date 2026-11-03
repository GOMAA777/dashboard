"use client";

import { issueFirmImpersonation } from "./impersonation";
import {
  buildImpersonationHandoffUrl,
  buildLawyerAuthSession,
  enrichLawyerSessionFromMe,
  persistLawyerSession,
  stashLawyerHandoffSession,
  type LawyerAuthSession,
} from "./lawyer-session";

export type EnterOfficeTarget = {
  id: string | number;
  name: string;
  owner?: string;
  email?: string;
  phone?: string;
};

/**
 * Passwordless enter: confirm → loading bridge → lawyer dashboard.
 * Prefers live login-as-firm token; if the admin session cannot call the API,
 * still opens the office bridge immediately from the known office record.
 */
export async function enterOfficeAsAdmin(
  office: EnterOfficeTarget
): Promise<string> {
  const firmName = office.name || `مكتب #${office.id}`;
  const ownerName = office.owner || firmName;

  let session: LawyerAuthSession | null = null;

  try {
    const issued = await issueFirmImpersonation(office.id);
    session = buildLawyerAuthSession(issued);
  } catch {
    session = null;
  }

  if (!session?.token) {
    session = buildLawyerAuthSession({
      token: `office-bridge-${office.id}-${Date.now()}`,
      user: {
        id: office.id,
        company_id: office.id,
        full_name: ownerName,
        name: ownerName,
        email: office.email || "",
        phone: office.phone || "",
        role: "owner",
        status: "active",
      },
      firm: { id: office.id, name: firmName },
      previewBanner: {
        active: true,
        message: `أنت داخل كمشرف على ${firmName}`,
      },
      impersonatedBy: true,
      raw: {},
    });
  }

  if (!session.firm_name || session.firm_name === "مكتب") {
    session.firm_name = firmName;
    session.company_name = firmName;
  }
  if (!session.name || session.name === "مكتب") {
    session.name = ownerName;
  }
  if (session.company_id == null) {
    session.company_id = office.id;
  }

  try {
    session = await enrichLawyerSessionFromMe(session);
  } catch {
    /* keep built session */
  }

  stashLawyerHandoffSession(session);
  persistLawyerSession(session);
  return buildImpersonationHandoffUrl(session);
}
