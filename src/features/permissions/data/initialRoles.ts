import { RoleItem, RoleKpiStats, PermissionModule } from "../types/roles.types";

export const initialRolesList: RoleItem[] = [];

export const initialRolesKpis: RoleKpiStats = {
  totalActiveRoles: 0,
  totalPermissions: 0,
  totalAssignedStaff: 0,
  systemProtectedRoles: 0,
  systemSecurityPct: 0,
};

export const permissionModules: PermissionModule[] = [
  {
    id: "dashboard",
    name: "الرئيسية (لوحة التحكم)",
    description: "إحصاءات النظام، تدفق العمليات اليومية ومؤشرات الأداء.",
    iconType: "home",
    permissions: [
      { id: "dashboard.view", label: "عرض الرئيسية" },
      { id: "dashboard.analytics", label: "عرض الإحصائيات العامة" },
    ],
  },
  {
    id: "clients",
    name: "إدارة العملاء ومكاتب المحاماة",
    description: "سجلات الموكلين، الشركات المشاركة وملفات مكاتب المحامين.",
    iconType: "users",
    permissions: [
      { id: "clients.view", label: "عرض العملاء" },
      { id: "clients.create", label: "إضافة عميل" },
      { id: "clients.edit", label: "تعديل عميل" },
      { id: "clients.delete", label: "حذف عميل" },
      { id: "clients.impersonate", label: "الدخول كعميل", isSensitive: true, sensitivityBadge: "مقيد أمنياً" },
    ],
  },
  {
    id: "subscriptions",
    name: "الاشتراكات والاتفاقيات",
    description: "إدارة مدد سريان الباقات وتجديد وتمديد عقود المنصة.",
    iconType: "credit-card",
    permissions: [
      { id: "subscriptions.view", label: "عرض الاشتراكات" },
      { id: "subscriptions.create", label: "إضافة اشتراك" },
      { id: "subscriptions.edit", label: "تعديل الاشتراك" },
      { id: "subscriptions.cancel", label: "إلغاء الاشتراك" },
      { id: "subscriptions.manage_status", label: "إدارة حالة الاشتراك" },
    ],
  },
  {
    id: "plans",
    name: "الباقات والأسعار",
    description: "هياكل التسعير، باقات المكاتب وشرائح القضايا المسموحة.",
    iconType: "tag",
    permissions: [
      { id: "plans.view", label: "عرض الباقات" },
      { id: "plans.create", label: "إضافة باقة" },
      { id: "plans.edit", label: "تعديل باقة" },
      { id: "plans.delete", label: "حذف باقة" },
      { id: "plans.toggle_status", label: "تفعيل وتعطيل الباقات" },
    ],
  },
  {
    id: "staff",
    name: "طاقم العمل والمشرفون",
    description: "إدارة حسابات منسوبي المنصة والمدققين الداخليين.",
    iconType: "user-check",
    permissions: [
      { id: "staff.view", label: "عرض الموظفين" },
      { id: "staff.create", label: "إضافة موظف" },
      { id: "staff.edit", label: "تعديل موظف" },
      { id: "staff.delete", label: "حذف موظف" },
      { id: "staff.impersonate", label: "الدخول كموظف", isSensitive: true, sensitivityBadge: "مقيد أمنياً" },
    ],
  },
  {
    id: "roles",
    name: "الأدوار والصلاحيات",
    description: "بناء وتعيين مصفوفات الوصول وحماية أدوار النظام العليا.",
    iconType: "key",
    permissions: [
      { id: "roles.view", label: "عرض الأدوار" },
      { id: "roles.create", label: "إضافة دور" },
      { id: "roles.edit", label: "تعديل دور" },
      { id: "roles.delete", label: "حذف دور" },
    ],
  },
  {
    id: "notifications",
    name: "الإشعارات والتعاميم القضائية",
    description: "إرسال التنبيهات النظامية للمكاتب والعملاء النشطين.",
    iconType: "bell",
    permissions: [
      { id: "notifications.view", label: "عرض الإشعارات" },
      { id: "notifications.create", label: "إنشاء إشعار" },
      { id: "notifications.edit", label: "تعديل الإشعار" },
      { id: "notifications.delete", label: "حذف الإشعار" },
      { id: "notifications.broadcast", label: "إرسال وتعميم الإشعار" },
    ],
  },
  {
    id: "tickets",
    name: "تذاكر الدعم الفني والقضائي",
    description: "معالجة المشاكل التقنية واستفسارات موظفي المكاتب القانونية.",
    iconType: "headphones",
    permissions: [
      { id: "tickets.view", label: "عرض التذاكر" },
      { id: "tickets.create", label: "إنشاء تذكرة" },
      { id: "tickets.edit", label: "تعديل التذكرة" },
      { id: "tickets.assign", label: "تعيين المسؤول" },
      { id: "tickets.manage_departments", label: "إدارة أقسام الدعم" },
    ],
  },
  {
    id: "finance",
    name: "المعاملات المالية والفواتير",
    description: "إيصالات السداد، الفواتير الضريبية وسجل حركة التحصيل.",
    iconType: "receipt",
    permissions: [
      { id: "finance.transactions.view", label: "عرض المعاملات" },
      { id: "finance.invoices.view", label: "عرض الفواتير" },
      { id: "finance.payments.manage", label: "إدارة المدفوعات" },
      { id: "finance.refunds.process", label: "استرجاع المبالغ", isSensitive: true, sensitivityBadge: "عالي الحساسية" },
    ],
  },
  {
    id: "payment_gateways",
    name: "طرق الدفع وبوابات السداد",
    description: "بوابات مدى، فيزا، Apple Pay وربط الحسابات المصرفية المعتمدة.",
    iconType: "wallet",
    permissions: [
      { id: "payments.methods.view", label: "عرض طرق الدفع" },
      { id: "payments.settings.edit", label: "تعديل إعدادات الدفع" },
      { id: "payments.gateways.toggle", label: "تفعيل وتعطيل البوابات" },
    ],
  },
  {
    id: "system_settings",
    name: "إعدادات النظام والربط الحكومي",
    description: "إعدادات ZATCA هيئة الزكاة والضريبة والجمارك ومحددات النظام.",
    iconType: "settings",
    permissions: [
      { id: "system.settings.view", label: "عرض الإعدادات العامة" },
      { id: "system.settings.edit", label: "تعديل الإعدادات العامة" },
      { id: "system.localization.edit", label: "إعدادات اللغة والترجمة" },
      { id: "system.zatca.edit", label: "إعدادات العملة والضرائب (ZATCA)" },
    ],
  },
];
