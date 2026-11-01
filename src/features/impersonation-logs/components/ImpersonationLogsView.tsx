"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  RotateCcw,
} from "lucide-react";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { UnifiedFilterBar } from "@/components/shared/UnifiedFilterBar";
import { fetchFirms } from "@/lib/api/firms";
import {
  fetchImpersonationLogs,
  type ImpersonationLog,
} from "@/lib/api/impersonation";

const PAGE_SIZE = 10;

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function ImpersonationLogsView() {
  const [logs, setLogs] = useState<ImpersonationLog[]>([]);
  const [offices, setOffices] = useState<Array<{ label: string; value: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [officeId, setOfficeId] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchFirms({ status: "all", page: 1, per_page: 100 })
      .then(({ items }) => {
        if (cancelled) return;
        setOffices(
          items.map((firm) => ({
            value: String(firm.id),
            label: firm.name || `مكتب #${firm.id}`,
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setOffices([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchImpersonationLogs({
      firm_id: officeId === "all" ? undefined : officeId,
      from: dateFrom || undefined,
      to: dateTo || undefined,
      page,
      per_page: PAGE_SIZE,
    })
      .then((result) => {
        if (cancelled) return;
        setLogs(result.items);
        setTotal(result.total);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLogs([]);
        setTotal(0);
        setError(
          err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : "تعذر تحميل سجل الدخول إلى المكاتب."
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [officeId, dateFrom, dateTo, page, retryKey]);

  const visibleLogs = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("ar");
    if (!query) return logs;
    return logs.filter((log) =>
      [
        log.admin_name,
        log.company_name,
        log.firm_name,
        log.ip,
        log.admin_id,
        log.company_id,
        log.firm_id,
      ].some((value) => String(value ?? "").toLocaleLowerCase("ar").includes(query))
    );
  }, [logs, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasActiveFilters =
    Boolean(searchQuery || dateFrom || dateTo) || officeId !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setOfficeId("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <div
      dir="rtl"
      className="flex h-screen h-dvh overflow-hidden bg-background text-foreground transition-colors duration-200 font-['Cairo',sans-serif]"
    >
      <DashboardSidebar activeNav="impersonation-logs" />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <DashboardTopNavbar
          customBreadcrumbs={[{ label: "سجل الدخول إلى المكاتب" }]}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden w-full p-4 sm:p-6 lg:p-8 max-w-[1360px] mx-auto space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            {isLoading && logs.length === 0 && !error ? (
              <DashboardPageSkeleton cardsCount={0} tableRowsCount={6} />
            ) : (
              <>
                <section className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 border border-[#f0eeea] dark:border-[#38271c] shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-[8px] bg-[#fff6e8] dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#e29d38] flex items-center justify-center">
                      <ClipboardList className="size-5" />
                    </div>
                    <div>
                      <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        سجل الدخول إلى المكاتب
                      </h1>
                      <p className="mt-1 text-[13px] text-[#737067] dark:text-[#a89f91]">
                        متابعة جلسات دخول مشرفي النظام إلى حسابات مكاتب المحاماة.
                      </p>
                    </div>
                  </div>
                </section>

                <UnifiedFilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  searchPlaceholder="ابحث باسم المشرف أو المكتب أو عنوان IP..."
                  primaryFilterValue={officeId}
                  onPrimaryFilterChange={(value) => {
                    setOfficeId(value);
                    setPage(1);
                  }}
                  primaryFilterMode="select"
                  primaryFilterOptions={[
                    { label: "جميع المكاتب", value: "all" },
                    ...offices,
                  ]}
                  hasActiveFilters={hasActiveFilters}
                  onReset={resetFilters}
                  drawerTitle="تصفية سجل الدخول"
                  drawerDescription="حدد الفترة الزمنية لجلسات دخول المشرفين."
                  drawerContent={
                    <div className="space-y-4 text-start">
                      <div>
                        <label className="text-[12px] font-bold text-[#514537] dark:text-[#a89f91] block mb-1.5">
                          من تاريخ
                        </label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(event) => {
                            setDateFrom(event.target.value);
                            setPage(1);
                          }}
                          className="w-full bg-[#f5f3ef] dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] px-3 py-2 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
                        />
                      </div>
                      <div>
                        <label className="text-[12px] font-bold text-[#514537] dark:text-[#a89f91] block mb-1.5">
                          إلى تاريخ
                        </label>
                        <input
                          type="date"
                          value={dateTo}
                          min={dateFrom || undefined}
                          onChange={(event) => {
                            setDateTo(event.target.value);
                            setPage(1);
                          }}
                          className="w-full bg-[#f5f3ef] dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] px-3 py-2 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:ring-1 focus:ring-[#9c6402]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="w-full h-10 rounded-[6px] bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-[#eae8e4] dark:hover:bg-[#38271c] transition-colors"
                      >
                        <RotateCcw className="size-4" />
                        إعادة ضبط الفلتر
                      </button>
                    </div>
                  }
                />

                {error ? (
                  <section
                    role="alert"
                    className="bg-white dark:bg-[#221812] rounded-[8px] border border-red-200 dark:border-red-900/50 p-10 text-center"
                  >
                    <AlertCircle className="size-10 text-red-600 dark:text-red-400 mx-auto mb-3" />
                    <h2 className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      تعذر تحميل سجل الدخول
                    </h2>
                    <p className="mt-2 text-[13px] text-[#737067] dark:text-[#a89f91]">
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={() => setRetryKey((value) => value + 1)}
                      className="mt-5 px-4 py-2 rounded-[6px] bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] text-[13px] font-bold"
                    >
                      إعادة المحاولة
                    </button>
                  </section>
                ) : (
                  <section className="bg-white dark:bg-[#221812] rounded-[8px] border border-[#eae8e4] dark:border-[#38271c] shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto scrollbar-thin">
                      <table className="w-full text-start text-[13px]">
                        <thead>
                          <tr className="bg-[#faf8f5] dark:bg-[#1c140f] border-b border-[#eae8e4] dark:border-[#38271c] text-[#737067] dark:text-[#a89f91]">
                            {["المشرف", "المكتب", "وقت الدخول", "وقت الرجوع", "IP"].map(
                              (heading) => (
                                <th
                                  key={heading}
                                  className="py-3.5 px-4 text-start font-bold whitespace-nowrap"
                                >
                                  {heading}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0eeea] dark:divide-[#38271c]">
                          {visibleLogs.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="py-14 px-4 text-center text-[#737067] dark:text-[#a89f91]"
                              >
                                لا توجد سجلات دخول مطابقة.
                              </td>
                            </tr>
                          ) : (
                            visibleLogs.map((log) => (
                              <tr
                                key={log.id}
                                className="hover:bg-[#faf8f5] dark:hover:bg-[#281c15]/60 transition-colors"
                              >
                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                                    {log.admin_name || `مشرف #${log.admin_id ?? "—"}`}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                                  {log.company_name ||
                                    log.firm_name ||
                                    `مكتب #${log.company_id ?? log.firm_id ?? "—"}`}
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[12px]">
                                  {formatDateTime(log.started_at)}
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[12px]">
                                  {log.ended_at ? (
                                    formatDateTime(log.ended_at)
                                  ) : (
                                    <span className="inline-flex rounded-full bg-[#e8f5e9] dark:bg-[#132c1c] text-[#15803d] dark:text-[#6ee7b7] px-2 py-1 font-bold font-['Cairo',sans-serif] text-[11px]">
                                      جلسة مستمرة
                                    </span>
                                  )}
                                </td>
                                <td
                                  dir="ltr"
                                  className="py-3.5 px-4 text-start font-mono text-[12px]"
                                >
                                  {log.ip || "—"}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {total > 0 && (
                      <div className="p-4 bg-[#faf8f5] dark:bg-[#1c140f] border-t border-[#eae8e4] dark:border-[#38271c] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#737067] dark:text-[#a89f91]">
                        <span>
                          عرض {(page - 1) * PAGE_SIZE + 1} إلى{" "}
                          {Math.min(page * PAGE_SIZE, total)} من أصل {total} سجل
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => setPage((value) => Math.max(1, value - 1))}
                            className="h-8 px-3 rounded-[4px] border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] disabled:opacity-40 flex items-center gap-1 font-bold"
                          >
                            <ChevronRight className="size-4" />
                            السابق
                          </button>
                          <span className="size-8 rounded-[4px] bg-[#9c6402] dark:bg-[#e29d38] text-white dark:text-[#1c140f] font-bold flex items-center justify-center">
                            {page}
                          </span>
                          <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() =>
                              setPage((value) => Math.min(totalPages, value + 1))
                            }
                            className="h-8 px-3 rounded-[4px] border border-[#e2ded7] dark:border-[#38271c] bg-white dark:bg-[#221812] disabled:opacity-40 flex items-center gap-1 font-bold"
                          >
                            التالي
                            <ChevronLeft className="size-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                )}
              </>
            )}
          </DashboardPageTransition>
        </main>
      </div>
    </div>
  );
}
