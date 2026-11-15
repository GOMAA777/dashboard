import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  ClientOfficeDetailsView,
  NOTES_PER_PAGE,
  paginateNotes,
  getVisibleNotePages,
} from "./ClientOfficeDetailsView";
import { ClientOffice, OfficeInternalNote } from "../types/client.types";
import { mapFirmToClientOffice, saveLocalCustomAutoRenew } from "@/lib/api/mappers";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: { children: React.ReactNode; href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/api/firms", () => ({
  fetchFirmById: vi.fn(() => Promise.resolve({ internal_notes: [] })),
  addFirmNote: vi.fn((_firmId: string, note: string) =>
    Promise.resolve({
      data: {
        id: 999,
        author_name: "م. عبد العزيز بن فهد",
        author_role: "مشرف النظام",
        note,
        created_at: "2026-11-11T14:00:00Z",
      },
    })
  ),
}));

function buildNotes(count: number): OfficeInternalNote[] {
  return Array.from({ length: count }, (_, idx) => ({
    id: idx + 1,
    authorName: "م. عبد العزيز بن فهد",
    authorRole: "مشرف النظام",
    note: `ملاحظة رقم ${idx + 1}`,
    createdAt: "2026-11-11T13:51:00Z",
  }));
}

function buildOffice(notes: OfficeInternalNote[], id = "office-116"): ClientOffice {
  return {
    id,
    initial: "ف",
    initialBg: "bg-[#fff9ee]",
    initialText: "text-[#9c6402]",
    name: "مكتب فهد",
    licenseNumber: "456",
    city: "الرياض",
    owner: "فهد",
    email: "fahd@example.com",
    phone: "+966500000000",
    plan: "الباقة الاحترافية",
    planType: "paid",
    planBadgeClass: "",
    registrationDate: "2026-01-01",
    internalNotes: notes,
    accountStatus: {
      label: "نشط",
      type: "active",
      bgClass: "",
      textClass: "",
      dotClass: "",
    },
    subscriptionStatus: {
      label: "اشتراك نشط",
      type: "active",
      bgClass: "",
      textClass: "",
    },
  };
}

describe("Notes Card Pagination (max 5 notes)", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    localStorage.clear();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  it("caps NOTES_PER_PAGE at 5 and enforces max 5 items even if larger perPage is passed", () => {
    expect(NOTES_PER_PAGE).toBe(5);
    const items = buildNotes(12);
    const page1 = paginateNotes(items, 1, 20);
    expect(page1.items).toHaveLength(5);
    expect(page1.totalPages).toBe(3);
    expect(page1.startItem).toBe(1);
    expect(page1.endItem).toBe(5);

    const page3 = paginateNotes(items, 3);
    expect(page3.items).toHaveLength(2);
    expect(page3.startItem).toBe(11);
    expect(page3.endItem).toBe(12);

    const clamped = paginateNotes(items, 99);
    expect(clamped.currentPage).toBe(3);
  });

  it("builds visible page numbers with ellipsis cleanly for many pages", () => {
    expect(getVisibleNotePages(1, 2)).toEqual([1, 2]);
    expect(getVisibleNotePages(1, 8)).toEqual([1, 2, "ellipsis-end", 8]);
    expect(getVisibleNotePages(4, 8)).toEqual([
      1,
      "ellipsis-start",
      3,
      4,
      5,
      "ellipsis-end",
      8,
    ]);
    expect(getVisibleNotePages(8, 8)).toEqual([1, "ellipsis-start", 7, 8]);
  });

  it("renders at most 5 notes per page and switches pages smoothly when > 5 notes exist", async () => {
    const office = buildOffice(buildNotes(9));

    await act(async () => {
      root.render(
        <ClientOfficeDetailsView
          office={office}
          onBack={() => {}}
          onEdit={() => {}}
        />
      );
    });

    const list = container.querySelector('ul[aria-label="قائمة الملاحظات الإدارية"]');
    expect(list).not.toBeNull();
    expect(list!.querySelectorAll("li")).toHaveLength(5);
    expect(container.textContent).toContain("ملاحظة رقم 1");
    expect(container.textContent).toContain("ملاحظة رقم 5");
    expect(container.textContent).not.toContain("ملاحظة رقم 6");

    const nav = container.querySelector('nav[aria-label="صفحات الملاحظات"]');
    expect(nav).not.toBeNull();
    expect(container.textContent).toContain("1–5");

    // Navigate to page 2
    const page2Btn = container.querySelector('button[aria-label="صفحة 2"]') as HTMLButtonElement;
    expect(page2Btn).not.toBeNull();

    await act(async () => {
      page2Btn.click();
    });

    expect(list!.querySelectorAll("li")).toHaveLength(4);
    expect(container.textContent).toContain("ملاحظة رقم 6");
    expect(container.textContent).toContain("ملاحظة رقم 9");
    expect(container.textContent).not.toContain("ملاحظة رقم 1");
    expect(container.textContent).toContain("6–9");
    expect(page2Btn.getAttribute("aria-current")).toBe("page");
  });

  it("omits pagination footer when notes <= 5 and shows empty state when 0", async () => {
    const office3 = buildOffice(buildNotes(3), "office-3");
    await act(async () => {
      root.render(
        <ClientOfficeDetailsView
          office={office3}
          onBack={() => {}}
          onEdit={() => {}}
        />
      );
    });
    expect(container.querySelectorAll('ul[aria-label="قائمة الملاحظات الإدارية"] li')).toHaveLength(3);
    expect(container.querySelector('nav[aria-label="صفحات الملاحظات"]')).toBeNull();

    const office0 = buildOffice([], "office-0");
    await act(async () => {
      root.render(
        <ClientOfficeDetailsView
          office={office0}
          onBack={() => {}}
          onEdit={() => {}}
        />
      );
    });
    expect(container.textContent).toContain("لا توجد ملاحظات إدارية مضافة بعد");
    expect(container.querySelector('nav[aria-label="صفحات الملاحظات"]')).toBeNull();
  });

  it("maps and displays subscription data cleanly from firm 96 API payload", async () => {
    // Simulate stale local auto-renew=false from an older edit
    saveLocalCustomAutoRenew("96", false);

    const apiPayload = {
      firm: {
        id: 96,
        name: "مكتب المحامي أوفيس ألفا",
        owner_name: "أحمد المحامي",
        license_number: "34654545456",
        email: "office96@example.com",
        phone: "+966 0501234567",
        city: "الرياض",
        subscription_plan: "trial",
        plan_id: 15,
        billing_cycle: "monthly",
        auto_renew: true,
        used_storage_gb: "0.00",
        subscription_start: "2026-11-08T00:00:00.000000Z",
        subscription_end: "2026-11-22T00:00:00.000000Z",
        status: "active",
        created_at: "2026-11-08T09:23:10.000000Z",
        effective_max_lawyers: 19,
        effective_storage_limit_gb: 46,
        effective_max_cases: 87,
        effective_max_clients: 64,
        plan: {
          id: 15,
          name: "Adipisci fugit labo",
          badge: "باقة مخصصة",
          badge_color: "#d97706",
          type: "paid",
          monthly_price: "13.00",
          yearly_price: "76.00",
          yearly_discount_percent: 51,
          max_lawyers: 19,
          max_cases: 87,
          max_power_of_attorney: 27,
          max_clients: 64,
          max_assistants: 40,
          storage_limit_gb: 46,
          support_level: "دعم فني ذو أولوية للمكتب",
          features: [
            "الربط التلقائي المباشر مع منصة ناجز ووزارة العدل",
            "الفوترة الإلكترونية المتوافقة مع هيئة الزكاة والضريبة (ZATCA Phase 2)",
          ],
        },
        active_subscription: {
          id: 65,
          subscription_code: "SUB-2026-8096",
          company_id: 96,
          plan_id: 15,
          billing_cycle: "monthly",
          amount: "13.00",
          payment_method: "mada",
          auto_renew: true,
          start_date: "2026-11-08T00:00:00.000000Z",
          renewal_date: "2026-11-22T00:00:00.000000Z",
          status: "active",
        },
      },
      resource_usage: {
        lawyers_used: 2,
        lawyers_limit: 19,
        lawyers_percent: 11,
        storage_used_gb: "0.00",
        storage_limit_gb: 46,
        storage_percent: 0,
        active_cases: 142,
        max_cases_limit: 87,
      },
      internal_notes: buildNotes(10),
    };

    const mapped = mapFirmToClientOffice(apiPayload);
    expect(mapped.subscriptionStatus.type).toBe("active");
    expect(mapped.autoRenew).toBe(true);
    expect(mapped.plan).toBe("Adipisci fugit labo");
    expect(mapped.resourceUsage?.maxCasesLimit).toBe(87);

    await act(async () => {
      root.render(
        <ClientOfficeDetailsView
          office={mapped}
          onBack={() => {}}
          onEdit={() => {}}
        />
      );
    });

    const text = container.textContent || "";
    expect(text).toContain(mapped.subscriptionStatus.label);
    expect(mapped.subscriptionStatus.label).toBe("نشط");
    expect(text).toContain("تجديد تلقائي");
    expect(text).not.toContain("تجديد يدوي");
    expect(text).toContain("SUB-2026-8096");
    expect(text).toContain("باقة مخصصة");
    expect(text).toContain("Adipisci fugit labo");
    expect(text).toContain("مدى");
    expect(text).toContain("السنوي (51% خصم)");
    expect(text).toContain("2 / 19 (11%)");
    expect(text).toContain("0.00 / 46 GB (0%)");
    expect(text).toContain("142 / 87 (163%)");
    expect(text).toContain("مزايا الباقة (2)");
    // Notes paginated to 5 max per page
    expect(container.querySelectorAll('ul[aria-label="قائمة الملاحظات الإدارية"] li')).toHaveLength(5);
  });
});
