import { Employee, AuditLogEntry, StaffKpis, EmployeeRole } from "../types/staff.types";

export const staffRoles: EmployeeRole[] = [
  {
    id: "super_admin",
    name: "مشرف نظام عام",
    category: "الإدارة العليا",
    badgeClass: "bg-[#ffeed9] dark:bg-[#2d1f16] text-[#7b4e00] dark:text-[#f3c27e] border-[#fcd8b0] dark:border-[#e29d38]/40",
    iconType: "shield",
  },
  {
    id: "tech_support_1",
    name: "أخصائي دعم فني أول",
    category: "الدعم الفني والعمليات",
    badgeClass: "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-[#e6e2dc] dark:border-[#38271c]",
    iconType: "headset",
  },
  {
    id: "auditor",
    name: "مدقق حسابات وضريبة",
    category: "المالية والفوترة",
    badgeClass: "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-[#e6e2dc] dark:border-[#38271c]",
    iconType: "calculator",
  },
  {
    id: "account_mgr",
    name: "مدير حسابات المكاتب القانونية",
    category: "إدارة علاقات العملاء",
    badgeClass: "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-[#e6e2dc] dark:border-[#38271c]",
    iconType: "briefcase",
  },
  {
    id: "sales_rep",
    name: "مسؤول مبيعات باقات",
    category: "المبيعات والتسويق",
    badgeClass: "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-[#e6e2dc] dark:border-[#38271c]",
    iconType: "cart",
  },
  {
    id: "cloud_engineer",
    name: "مهندس بنية أمنية وسحابية",
    category: "هندسة البرمجيات",
    badgeClass: "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-[#e6e2dc] dark:border-[#38271c]",
    iconType: "cloud",
  },
  {
    id: "compliance_advisor",
    name: "مستشار التزام قانوني",
    category: "الامتثال والحوكمة",
    badgeClass: "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-[#e6e2dc] dark:border-[#38271c]",
    iconType: "scales",
  },
  {
    id: "integration_specialist",
    name: "أخصائي تجهيز وتكامل",
    category: "الدعم الميداني والتقني",
    badgeClass: "bg-[#f5f3ef] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border-[#e6e2dc] dark:border-[#38271c]",
    iconType: "monitor",
  },
];

export const initialStaffMembers: Employee[] = [];

export const initialStaffKpis: StaffKpis = {
  totalStaff: 0,
  totalDepartments: 0,
  activeStaff: 0,
  activePercentage: 0,
  suspendedStaff: 0,
  suspendedReason: "",
  loggedToday: 0,
  lastSessionMinutesAgo: 0,
};

export const sampleSaraAuditLogs: AuditLogEntry[] = [];
