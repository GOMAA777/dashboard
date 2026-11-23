/**
 * Central Data Store for API Handoff Documentation
 * Extracted directly from live codebase:
 * - dashboard/docs/admin-api-map.md
 * - dashboard/docs/postman-super-admin-collection.json
 * - dashboard/src/lib/api/*
 * - dashboard/src/features/*
 */

export const metadata = {
  projectName: "منصة الجودي لإدارة مكاتب وشركات المحاماة (SaaS Super Admin)",
  version: "v4.5.0",
  lastUpdated: "2026-11-21",
  productionBaseUrl: "https://law.elmoroj.com/api",
  localBaseUrl: "http://127.0.0.1:8000/api",
  authType: "Bearer Token (Laravel Sanctum)",
  authHeader: "Authorization: Bearer <token>",
  standardEnvelope: {
    status: "boolean (true عند النجاح، false عند الفشل)",
    message: "string (رسالة وصفية للمستخدم باللغة العربية)",
    data: "object | array | null (البيانات الفعلية المعادة)",
    meta: "object (اختياري - معلومات الـ Pagination والإحصائيات الإضافية)"
  }
};

export const stats = {
  total: 118,
  wired: 102,
  partial: 4,
  missing: 12
};

export const modules = [
  {
    id: "auth",
    name: "01. المصادقة وإدارة الجلسة والحساب",
    description: "نقاط الدخول المركزية للمشرف العام (Super Admin)، التحقق من الجلسة، الصلاحيات، وتغيير كلمة المرور.",
    endpoints: [
      {
        id: "AUTH-01",
        method: "POST",
        path: "/login",
        screen: "LoginPage (صفحة تسجيل الدخول)",
        component: "@/features/auth/components/LoginForm",
        serviceCall: "src/lib/api/auth.ts -> loginSuperAdmin()",
        purpose: "تسجيل الدخول للمشرف العام والتحقق من كلمة المرور وإصدار رمز Sanctum Bearer Token",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Content-Type: application/json", "Accept: application/json"],
          params: [],
          body: [
            { field: "login", type: "string", required: true, validation: "البريد الإلكتروني أو اسم المستخدم للمشرف (مثل: admin@aljudy.sa)" },
            { field: "password", type: "string", required: true, validation: "كلمة المرور الحالية (الحد الأدنى 6 أحرف)" },
            { field: "role", type: "string", required: true, validation: "يجب تمرير القيمة 'admin' للوحة الإدارة العليا لتمييزها عن مكاتب المحاماة" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تسجيل الدخول بنجاح",
            data: {
              token: "1|laravel_sanctum_token_hash_here_abc123",
              user: {
                id: 1,
                name: "مدير المنظومة الأعلى",
                email: "admin@aljudy.sa",
                role: "admin",
                company_id: null,
                avatar: null,
                must_change_password: false
              }
            }
          },
          usedFields: [
            "data.token (يخزن في localStorage / Cookies كرمز وصول Bearer)",
            "data.user.id (معرف المشرف)",
            "data.user.name (الاسم المعروض في الهيدر العلوي)",
            "data.user.email (البريد الإلكتروني)",
            "data.user.role (التحقق من صلاحية admin لحماية المسارات)",
            "data.user.must_change_password (توجيه إجباري لصفحة تغيير كلمة المرور عند أول دخول)"
          ]
        },
        notes: "في حال إدخال بيانات خاطئة يرجع 401/422. إذا كان الدور يخص مكتب محاماة ترجع الواجهة تنبيهاً بتوجيهه لبوابة المكاتب."
      },
      {
        id: "AUTH-02",
        method: "GET",
        path: "/me",
        screen: "TopNavbar / Session Provider",
        component: "@/features/dashboard/components/DashboardTopNavbar",
        serviceCall: "src/lib/api/auth.ts -> fetchCurrentUserProfile()",
        purpose: "الاستعلام عن بيانات الجلسة الحالية والتحقق من استمرار صلاحية التوكن",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Accept: application/json"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              id: 1,
              name: "مدير المنظومة الأعلى",
              email: "admin@aljudy.sa",
              role: "admin",
              phone: "+966500000000",
              created_at: "2025-01-01T00:00:00Z"
            }
          },
          usedFields: ["data.id", "data.name", "data.email", "data.role", "data.phone"]
        },
        notes: "في حال انتهاء التوكن (401) تقوم الواجهة تلقائياً بتنظيف الجلسة والتحويل إلى /login."
      },
      {
        id: "AUTH-03",
        method: "POST",
        path: "/change-password",
        screen: "ChangePasswordPage / ProfileView",
        component: "@/features/auth/components/ChangePasswordForm",
        serviceCall: "src/lib/api/password.ts -> changePassword()",
        purpose: "تغيير كلمة مرور المشرف الحالي (سواء اختيارياً أو إجبارياً بعد أول دخول)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "current_password", type: "string", required: true, validation: "كلمة المرور القديمة الصالحة" },
            { field: "password", type: "string", required: true, validation: "كلمة المرور الجديدة (8+ خانات، أحرف كبيرة وصغيرة ورموز)" },
            { field: "password_confirmation", type: "string", required: true, validation: "تطابق تام مع حقل password" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث كلمة المرور بنجاح"
          },
          usedFields: ["status", "message (يعرض عبر toast نجاح)"]
        },
        notes: "في حال عدم تطابق كلمة المرور الحالية يرجع 422 مع تفصيل الخطأ تحت حقل current_password."
      },
      {
        id: "AUTH-04",
        method: "POST",
        path: "/logout",
        screen: "TopNavbar Dropdown",
        component: "@/features/dashboard/components/DashboardTopNavbar",
        serviceCall: "src/lib/api/auth.ts -> logoutAdmin()",
        purpose: "إبطال رمز الوصول الحالي من جهة السيرفر وحذف الجلسة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم تسجيل الخروج بنجاح"
          },
          usedFields: ["status"]
        },
        notes: "الواجهة تنظف التوكن محلياً سواء رد السيرفر بنجاح أو تعذر الوصول."
      },
      {
        id: "AUTH-05",
        method: "GET",
        path: "/admin/audit-logs",
        screen: "ProfileView (تبويب سجل العمليات)",
        component: "@/features/profile/components/ProfileView",
        serviceCall: "src/lib/api/settings.ts -> fetchAuditLogs()",
        purpose: "استعراض سجل تدقيق الإجراءات والعمليات الحساسة التي تمت على النظام بواسطة المشرفين",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "page", type: "number", required: false, validation: "رقم الصفحة الافتراضي 1" },
            { field: "per_page", type: "number", required: false, validation: "عدد السجلات في الصفحة (افتراضي 20)" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              {
                id: 101,
                user_id: 1,
                user_name: "م. عبد الله المشرف",
                action: "update_settings",
                description: "تعديل إعدادات الهوية البصرية ورابط المنصة",
                ip_address: "192.168.1.50",
                created_at: "2026-11-20T14:32:00Z"
              }
            ]
          },
          usedFields: ["id", "user_name", "action", "description", "ip_address", "created_at"]
        },
        notes: "يستخدم كمرجع أساسي لسجل العمليات في صفحة الملف الشخصي للمشرف."
      }
    ]
  },
  {
    id: "dashboard",
    name: "02. لوحة المؤشرات المركزية وإحصائيات SaaS",
    description: "استعراض المؤشرات الحية للمنصة بالكامل: المكاتب النشطة، الاشتراكات، الإيراد الشهري MRR، ومخططات الأداء المالي.",
    endpoints: [
      {
        id: "DASH-01",
        method: "GET",
        path: "/admin/dashboardSaas",
        screen: "DashboardHomeView (الصفحة الرئيسية)",
        component: "@/features/dashboard/components/DashboardHomeView",
        serviceCall: "src/lib/api/dashboard.ts -> fetchDashboardSaas()",
        purpose: "جلب المؤشرات الشاملة للمنصة (SaaS KPIs)، الإيراد الشهري، المكاتب المسجلة حديثاً، وأحدث تذاكر الدعم والأنشطة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              kpis: {
                totalFirms: 142,
                totalFirmsGrowth: "+12.5%",
                activeSubscriptions: 128,
                activeSubscriptionsPercent: "90%",
                monthlyRevenue: 184500,
                monthlyRevenueFormatted: "184,500 ر.س",
                monthlyRevenueGrowth: "+8.2%",
                openTickets: 7,
                openTicketsBadge: "يحتاج متابعة"
              },
              statistics: {
                total_firms: 142,
                active_firms: 128,
                trial_firms: 10,
                expired_firms: 4,
                total_lawyers: 580,
                total_clients: 12400,
                total_cases: 4320
              },
              revenue_analysis: {
                title: "تحليل الإيرادات والنمو الشهري",
                subtitle: "مقارنة الـ MRR لآخر 12 شهراً",
                total_period: 184500,
                total_period_formatted: "184,500 ر.س",
                growth_percentage: 8.2,
                highest_revenue: {
                  amount: 198000,
                  formatted: "198,000 ر.س",
                  month_ar: "أكتوبر"
                },
                chart_data: [
                  { monthAr: "يناير", value: 120000 },
                  { monthAr: "فبراير", value: 135000 },
                  { monthAr: "مارس", value: 148000 }
                ]
              },
              latest_firms: [
                {
                  id: 96,
                  name: "شركة العجلان وشركاؤه للمحاماة",
                  owner_name: "د. خالد العجلان",
                  plan_name: "باقة النخبة العدلية",
                  lawyers_count: 14,
                  status: "active",
                  created_at: "2026-11-19"
                }
              ]
            }
          },
          usedFields: [
            "data.kpis.* (بطاقات المؤشرات الأربعة العلوية)",
            "data.revenue_analysis.chart_data (مخطط الإيرادات Recharts)",
            "data.latest_firms (جدول أحدث مكاتب المحاماة المسجلة في الصفحة الرئيسية)"
          ]
        },
        notes: "يدعم التحويل التلقائي للبيانات عبر mappers.ts لعرض الأرقام والنسب المئوية والعملات بدقة."
      },
      {
        id: "DASH-02",
        method: "GET",
        path: "/admin/dashboard",
        screen: "Dashboard Fallback / المنشأة الفردية",
        component: "@/features/dashboard/components/DashboardHomeView",
        serviceCall: "src/lib/api/dashboard.ts -> fetchDashboard()",
        purpose: "استعلام إحصائيات منشأة فردية (legacy fallback عند الحاجة لتقييد النطاق بـ company_id)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "company_id", type: "number", required: false, validation: "معرف المنشأة المحاماة المحددة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              active_cases: 45,
              total_lawyers: 8,
              monthly_appointments: 120
            }
          },
          usedFields: ["data.active_cases", "data.total_lawyers"]
        },
        notes: "نقطة احتياطية في حال تعطل /admin/dashboardSaas أو عند فحص منشأة مفردة."
      }
    ]
  },
  {
    id: "firms",
    name: "03. إدارة مكاتب المحاماة والعملاء",
    description: "دليل مكاتب وشركات المحاماة، بيانات التراخيص العدلية، استهلاك الموارد، إضافة المكاتب، التعديل، والتعطيل.",
    endpoints: [
      {
        id: "FIRM-01",
        method: "GET",
        path: "/admin/firms/stats",
        screen: "LawFirmsPage / ClientKpiMetrics",
        component: "@/features/clients/components/ClientKpiMetrics",
        serviceCall: "src/lib/api/firms.ts -> fetchFirmsStats()",
        purpose: "جلب المؤشرات الإحصائية لمكاتب المحاماة (إجمالي المكاتب، النشطة، التجريبية، والموقوفة)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              total_firms: 142,
              active_firms: 124,
              active_percentage: 87.3,
              trial_firms: 12,
              trial_avg_days_left: 6,
              suspended_firms: 6,
              suspended_awaiting_payment: 4
            }
          },
          usedFields: [
            "data.total_firms (إجمالي المكاتب)",
            "data.active_firms و active_percentage (المكاتب النشطة)",
            "data.trial_firms و trial_avg_days_left (الفترات التجريبية)",
            "data.suspended_firms (الحسابات المعلقة)"
          ]
        },
        notes: "تعرض في بطاقات الـ KPI أعلى جدول المكاتب."
      },
      {
        id: "FIRM-02",
        method: "GET",
        path: "/admin/firms",
        screen: "LawFirmsPage / ClientManagementView",
        component: "@/features/clients/components/ClientManagementView",
        serviceCall: "src/lib/api/firms.ts -> fetchFirms()",
        purpose: "استعراض قائمة مكاتب المحاماة مع دعم البحث، فلترة الحالة، المدينة، الباقة، وترقيم الصفحات",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "status", type: "string", required: false, validation: "all | active | trial | suspended" },
            { field: "page", type: "number", required: false, validation: "رقم الصفحة (افتراضي 1)" },
            { field: "per_page", type: "number", required: false, validation: "عدد السجلات (افتراضي 10)" },
            { field: "search", type: "string", required: false, validation: "بحث باسم المكتب، المالك، الترخيص، البريد، أو الهاتف" },
            { field: "city", type: "string", required: false, validation: "فلترة حسب المدينة (مثل: الرياض، جدة)" },
            { field: "plan", type: "string", required: false, validation: "فلترة حسب الباقة (معرف أو اسم الباقة)" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              current_page: 1,
              total: 142,
              per_page: 10,
              last_page: 15,
              data: [
                {
                  id: 96,
                  name: "شركة العجلان وشركاؤه للمحاماة",
                  owner_name: "د. خالد عبد العزيز العجلان",
                  license_number: "38/412",
                  email: "contact@alajlan-law.sa",
                  phone: "+966501234567",
                  city: "الرياض",
                  status: "active",
                  subscription_plan: "باقة النخبة العدلية",
                  billing_cycle: "yearly",
                  used_storage_gb: "12.4",
                  active_subscription: {
                    id: 10,
                    start_date: "2025-01-01",
                    renewal_date: "2026-01-01",
                    status: "active"
                  }
                }
              ]
            }
          },
          usedFields: [
            "id", "name", "owner_name", "license_number", "email", "phone", "city",
            "status", "subscription_plan", "billing_cycle", "used_storage_gb", "active_subscription"
          ]
        },
        notes: "تدعم الواجهة كلاً من مصفوفة مباشرة data: [...] أو مغلف Pagination كامل data: { data: [...] }."
      },
      {
        id: "FIRM-03",
        method: "POST",
        path: "/admin/firms",
        screen: "AddClientOfficeModal (مودال إضافة مكتب جديد)",
        component: "@/features/clients/components/AddClientOfficeModal",
        serviceCall: "src/lib/api/firms.ts -> createFirm()",
        purpose: "إنشاء وتسجيل مكتب محاماة جديد في المنصة مع تعيين الباقة وكلمة المرور وحساب المالك",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "name", type: "string", required: true, validation: "اسم المكتب أو الشركة المهنية للمحاماة" },
            { field: "owner_name", type: "string", required: true, validation: "اسم المحامي المرخص أو المالك" },
            { field: "license_number", type: "string", required: true, validation: "رقم ترخيص وزارة العدل (مثل: 38/412)" },
            { field: "email", type: "string", required: true, validation: "البريد الإلكتروني الرسمي للمكتب (فريد)" },
            { field: "phone", type: "string", required: true, validation: "رقم الجوال بصيغة دولية (+966...)" },
            { field: "landline", type: "string", required: false, validation: "رقم الهاتف الثابت" },
            { field: "city", type: "string", required: true, validation: "المدينة (الرياض، جدة، الدمام...)" },
            { field: "address", type: "string", required: false, validation: "العنوان الوطني أو اسم البرج والشارع" },
            { field: "password", type: "string", required: true, validation: "كلمة مرور حساب رئيس المكتب الأولية" },
            { field: "plan_type", type: "string", required: true, validation: "ENUM: trial | basic | professional | enterprise | paid | custom" },
            { field: "plan_id", type: "number", required: true, validation: "معرف باقة الاشتراك المختارة" },
            { field: "billing_cycle", type: "string", required: true, validation: "monthly | yearly" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم إنشاء مكتب المحاماة بنجاح وتفعيل الحساب",
            data: {
              id: 98,
              name: "شركة العجلان وشركاؤه للمحاماة",
              owner_name: "د. خالد عبد العزيز العجلان",
              email: "contact@alajlan-law.sa",
              status: "active"
            }
          },
          usedFields: ["status", "message", "data.id"]
        },
        notes: "عند النجاح يغلق المودال ويتم تحديث الجدول وإظهار toast نجاح، وعند 422 تظهر الأخطاء تحت كل حقل."
      },
      {
        id: "FIRM-04",
        method: "GET",
        path: "/admin/firms/{firm_id}",
        screen: "ClientOfficeDetailsView (الملف الكامل للمكتب)",
        component: "@/features/clients/components/ClientOfficeDetailsView",
        serviceCall: "src/lib/api/firms.ts -> fetchFirmById()",
        purpose: "جلب الملف الشامل للمكتب: البيانات الأساسية، الاشتراك الفعال، استهلاك الموارد (المحامين، القضايا، المساحة)، والملاحظات الداخلية",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "firm_id", type: "number | string", required: true, validation: "معرف المكتب في مسار الرابط" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              firm: {
                id: 96,
                name: "شركة العجلان وشركاؤه للمحاماة",
                owner_name: "د. خالد عبد العزيز العجلان",
                license_number: "38/412",
                tax_number: "301298457200003",
                email: "contact@alajlan-law.sa",
                phone: "+966501234567",
                city: "الرياض",
                status: "active",
                logo: "https://law.elmoroj.com/uploads/logos/firm96.png"
              },
              active_subscription: {
                id: 10,
                plan_name: "باقة النخبة العدلية",
                billing_cycle: "yearly",
                amount: "5290.00",
                start_date: "2025-01-01",
                renewal_date: "2026-01-01",
                status: "active"
              },
              resource_usage: {
                lawyers_used: 11,
                lawyers_limit: 15,
                lawyers_percent: 73,
                storage_used_gb: "28.5",
                storage_limit_gb: 50,
                storage_percent: 57,
                active_cases: 240
              },
              internal_notes: [
                {
                  id: 1,
                  author_name: "م. عبد الله المشرف",
                  author_role: "مدير الحسابات",
                  note: "تم التنسيق لترقية مساحة التخزين السحابي مع بداية الربع القادم.",
                  created_at: "2026-11-10T11:00:00Z"
                }
              ]
            }
          },
          usedFields: [
            "data.firm.*", "data.active_subscription.*", "data.resource_usage.*", "data.internal_notes.*"
          ]
        },
        notes: "في حال لم يكن هناك اشتراك مفعل للمكتب، يكون active_subscription بقيمة null وتعرض الواجهة شارة 'لا يوجد اشتراك سارٍ'."
      },
      {
        id: "FIRM-05",
        method: "PUT",
        path: "/admin/firms/{firm_id}",
        screen: "EditOfficeModal / تفاصيل المكتب",
        component: "@/features/clients/components/EditOfficeModal",
        serviceCall: "src/lib/api/firms.ts -> updateFirm()",
        purpose: "تحديث وتعديل البيانات القانونية والتواصلية لمكتب المحاماة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "firm_id", type: "number | string", required: true, validation: "معرف المكتب" }
          ],
          body: [
            { field: "name", type: "string", required: false, validation: "تحديث اسم المكتب" },
            { field: "phone", type: "string", required: false, validation: "رقم الجوال المعتمد" },
            { field: "landline", type: "string", required: false, validation: "الهاتف الثابت" },
            { field: "city", type: "string", required: false, validation: "المدينة" },
            { field: "address", type: "string", required: false, validation: "العنوان بالتفصيل" },
            { field: "tax_number", type: "string", required: false, validation: "الرقم الضريبي للمنشأة (15 رقماً)" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث بيانات المكتب بنجاح",
            data: { id: 96, name: "شركة العجلان الدولية للمحاماة" }
          },
          usedFields: ["status", "message", "data"]
        },
        notes: "تتطلب الواجهة AlertDialog لتأكيد حفظ التعديلات مسبقاً."
      },
      {
        id: "FIRM-06",
        method: "PATCH",
        path: "/admin/firms/{firm_id}/status",
        screen: "DeactivateOfficeModal / تنشيط المكتب",
        component: "@/features/clients/components/DeactivateOfficeModal",
        serviceCall: "src/lib/api/firms.ts -> changeFirmStatus()",
        purpose: "تغيير حالة حساب المكتب (تفعيل، تعطيل مؤقت، أو إيقاف بسبب عدم سداد الفاتورة)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "firm_id", type: "number | string", required: true, validation: "معرف المكتب" }
          ],
          body: [
            { field: "status", type: "string", required: true, validation: "active | suspended" },
            { field: "reason", type: "string", required: false, validation: "سبب الإيقاف أو التجميد ليظهر في سجل التدقيق" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث حالة حساب المكتب بنجاح",
            data: { id: 96, status: "suspended" }
          },
          usedFields: ["status", "message", "data.status"]
        },
        notes: "عند التعطيل يتم إبراز شارة الحساب الموقوف في الجدول ومنع الدخول كالمكتب."
      },
      {
        id: "FIRM-07",
        method: "POST",
        path: "/admin/firms/{firm_id}/notes",
        screen: "ClientOfficeDetailsView (إضافة ملاحظة داخلية)",
        component: "@/features/clients/components/ClientOfficeDetailsView",
        serviceCall: "src/lib/api/firms.ts -> addFirmNote()",
        purpose: "تدوين ملاحظة سرية خاصة بفريق إدارة المنصة حول هذا المكتب (لا تظهر للمحامي)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "firm_id", type: "number | string", required: true, validation: "معرف المكتب" }
          ],
          body: [
            { field: "note", type: "string", required: true, validation: "نص الملاحظة الداخلية" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تمت إضافة الملاحظة الداخلية بنجاح",
            data: {
              id: 12,
              note: "تم التنسيق هاتفياً لترقية الباقة",
              created_at: "2026-11-21T10:00:00Z"
            }
          },
          usedFields: ["status", "message", "data"]
        },
        notes: "تضاف الملاحظة مباشرة إلى شريط الملاحظات الزمني الداخلي للمكتب."
      },
      {
        id: "FIRM-08",
        method: "DELETE",
        path: "/admin/firms/{firm_id}",
        screen: "DeleteOfficeConfirmDialog",
        component: "@/features/clients/components/DeleteOfficeModal",
        serviceCall: "src/lib/api/firms.ts -> deleteFirm()",
        purpose: "حذف مكتب المحاماة نهائياً من قاعدة بيانات المنظومة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "firm_id", type: "number | string", required: true, validation: "معرف المكتب المراد حذفه" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم حذف مكتب المحاماة نهائياً من المنظومة"
          },
          usedFields: ["status", "message"]
        },
        notes: "يجب تأكيد الحذف عبر LuxuryAlertDialog مع كتابة اسم المكتب لمنع الحذف بالخطأ."
      }
    ]
  },
  {
    id: "plans",
    name: "04. باقات الاشتراك والأسعار (Plans & Pricing)",
    description: "هياكل التسعير، حدود الموارد (عدد المحامين، القضايا، مساحة التخزين)، ميزات الباقات، ونسب الاشتراكات.",
    endpoints: [
      {
        id: "PLAN-01",
        method: "GET",
        path: "/admin/plans/stats",
        screen: "PlansView (صفحة الباقات)",
        component: "@/features/plans/components/PlansView",
        serviceCall: "src/lib/api/plans.ts -> fetchPlansStats()",
        purpose: "استعلام مؤشرات الباقات: إجمالي الباقات، الباقات النشطة، إجمالي المشتركين، والإيراد الشهري MRR",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              total_plans: 4,
              active_plans: 3,
              subscribed_firms: 128,
              mrr: 184500,
              growth_percentage: 12.4
            }
          },
          usedFields: [
            "data.total_plans", "data.active_plans", "data.subscribed_firms", "data.mrr", "data.growth_percentage"
          ]
        },
        notes: "تظهر في بطاقات KPIs أعلى صفحة الباقات والأسعار."
      },
      {
        id: "PLAN-02",
        method: "GET",
        path: "/admin/plans",
        screen: "PlansView / CreatePlanView",
        component: "@/features/plans/components/PlansView",
        serviceCall: "src/lib/api/plans.ts -> fetchPlans()",
        purpose: "استعراض كافة باقات الاشتراك المتاحة، حدودها، أسعارها الشهرية والسنوية، وقائمة مميزاتها",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              {
                id: 1,
                name: "باقة التميز العدلي",
                code: "PLAN-GOLD",
                description: "مخصصة للمكاتب والشركات المهنية القانونية التي تتطلب تكاملاً مع بوابة ناجز",
                badge: "الفئة الذهبية",
                badge_color: "#d97706",
                monthly_price: 549,
                yearly_price: 5290,
                yearly_discount_percent: 19,
                max_lawyers: 8,
                max_cases: 350,
                max_power_of_attorney: 10,
                max_clients: 2000,
                storage_limit_gb: 50,
                support_level: "دعم فني واستجابة بأولوية قصوى (VIP SLA)",
                features: [
                  "مدير حساب قانوني معتمد شخصي",
                  "تقارير الذكاء القضائي ومؤشرات الأداء",
                  "فوترة إلكترونية متوافقة كلياً ZATCA Phase 2"
                ],
                is_popular: true,
                status: "active",
                subscribed_firms_count: 54,
                share_percentage: "42%"
              }
            ]
          },
          usedFields: [
            "id", "name", "badge", "badge_color", "monthly_price", "yearly_price", "yearly_discount_percent",
            "max_lawyers", "max_cases", "storage_limit_gb", "features", "is_popular", "status", "subscribed_firms_count"
          ]
        },
        notes: "تتضمن الواجهة باقة افتراضية محلية 'غير محدود' للعملاء الاستثنائيين تدمج تلقائياً."
      },
      {
        id: "PLAN-03",
        method: "POST",
        path: "/admin/plans",
        screen: "CreatePlanView (معالج إنشاء باقة اشتراك جديدة)",
        component: "@/features/plans/components/CreatePlanWizard",
        serviceCall: "src/lib/api/plans.ts -> createPlan()",
        purpose: "إنشاء باقة اشتراك جديدة وتحديد حدود الموارد والأسعار والميزات",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "name", type: "string", required: true, validation: "اسم الباقة (مثل: باقة النخبة)" },
            { field: "description", type: "string", required: false, validation: "وصف تسويقي للباقة" },
            { field: "badge", type: "string", required: false, validation: "شارة الباقة (مثل: الأكثر طلباً)" },
            { field: "badge_color", type: "string", required: false, validation: "رمز اللون Hex للوسم" },
            { field: "type", type: "string", required: true, validation: "paid | trial | custom" },
            { field: "monthly_price", type: "number", required: true, validation: "السعر الشهري بالريال السعودي" },
            { field: "yearly_price", type: "number", required: true, validation: "السعر السنوي بالريال السعودي" },
            { field: "yearly_discount_percent", type: "number", required: false, validation: "نسبة الخصم السنوي (0 - 100)" },
            { field: "max_lawyers", type: "number", required: true, validation: "الحد الأقصى لعدد المحامين والمستشارين" },
            { field: "max_cases", type: "number", required: true, validation: "الحد الأقصى للقضايا والمعاملات النشطة" },
            { field: "max_clients", type: "number", required: false, validation: "حد العملاء" },
            { field: "storage_limit_gb", type: "number", required: true, validation: "المساحة السحابية بالجيجابايت" },
            { field: "support_level", type: "string", required: false, validation: "مستوى الدعم الفني" },
            { field: "features", type: "string[]", required: true, validation: "مصفوفة نصوص بالمميزات المشمولة" },
            { field: "is_popular", type: "boolean", required: false, validation: "تمييز الباقة كشائعة" },
            { field: "status", type: "string", required: true, validation: "active | disabled" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم إنشاء باقة الاشتراك بنجاح",
            data: { id: 5, name: "باقة النخبة" }
          },
          usedFields: ["status", "message", "data.id"]
        },
        notes: "يتم التحقق من الحقول الإجبارية في الخطوات الأربع لمعالج الإنشاء قبل الإرسال."
      },
      {
        id: "PLAN-04",
        method: "GET",
        path: "/admin/plans/{plan_id}",
        screen: "PlanDetailsModal / EditPlanView",
        component: "@/features/plans/components/PlanDetailsModal",
        serviceCall: "src/lib/api/plans.ts -> fetchPlanById()",
        purpose: "استعلام تفاصيل باقة محددة وهوامش أسعارها وحدودها",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "plan_id", type: "number | string", required: true, validation: "معرف الباقة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              id: 1,
              name: "باقة التميز العدلي",
              monthly_price: 549,
              yearly_price: 5290,
              max_lawyers: 8,
              max_cases: 350,
              storage_limit_gb: 50,
              status: "active"
            }
          },
          usedFields: ["data.*"]
        },
        notes: "تستخدم لتعبئة حقول نموذج التعديل أو عرض بطاقة التفاصيل."
      },
      {
        id: "PLAN-05",
        method: "PUT",
        path: "/admin/plans/{plan_id}",
        screen: "EditPlanModal (تعديل باقة)",
        component: "@/features/plans/components/EditPlanModal",
        serviceCall: "src/lib/api/plans.ts -> updatePlan()",
        purpose: "تعديل بيانات الباقة والأسعار والحدود المسموح بها",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "plan_id", type: "number | string", required: true, validation: "معرف الباقة" }
          ],
          body: [
            { field: "name", type: "string", required: false, validation: "الاسم المحدث" },
            { field: "monthly_price", type: "number", required: false, validation: "السعر الشهري" },
            { field: "yearly_price", type: "number", required: false, validation: "السعر السنوي" },
            { field: "storage_limit_gb", type: "number", required: false, validation: "المساحة السحابية" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث بيانات الباقة بنجاح",
            data: { id: 1 }
          },
          usedFields: ["status", "message"]
        },
        notes: "تتطلب الواجهة نافذة تأكيد AlertDialog قبل حفظ التغييرات على الأسعار."
      },
      {
        id: "PLAN-06",
        method: "PATCH",
        path: "/admin/plans/{plan_id}/status",
        screen: "TogglePlanStatusSwitch",
        component: "@/features/plans/components/PlansTable",
        serviceCall: "src/lib/api/plans.ts -> updatePlanStatus()",
        purpose: "تغيير حالة الباقة (تفعيل / تعطيل الباقة عن استقبال مشتركين جدد)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "plan_id", type: "number | string", required: true, validation: "معرف الباقة" }
          ],
          body: [
            { field: "status", type: "string", required: true, validation: "active | disabled" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث حالة الباقة بنجاح",
            data: { id: 1, status: "disabled" }
          },
          usedFields: ["status", "message", "data.status"]
        },
        notes: "تعطيل الباقة لا يلغي اشتراكات المكاتب المشتركة حالياً وإنما يمنع اختيارها للمكاتب الجديدة."
      },
      {
        id: "PLAN-07",
        method: "GET",
        path: "/admin/plans/{plan_id}/subscribers",
        screen: "PlanSubscribersModal (المكاتب المشتركة في الباقة)",
        component: "@/features/plans/components/PlanSubscribersModal",
        serviceCall: "src/lib/api/plans.ts -> fetchPlanSubscribers()",
        purpose: "استعراض قائمة المكاتب المشتركة في هذه الباقة وتفاصيل اشتراك كل مكتب",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "plan_id", type: "number | string", required: true, validation: "معرف الباقة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              {
                id: 96,
                firm_name: "شركة العجلان وشركاؤه للمحاماة",
                owner_name: "د. خالد عبد العزيز العجلان",
                city: "الرياض",
                phone: "+966501234567",
                active_subscription: {
                  amount: "5290.00",
                  billing_cycle: "yearly",
                  status: "active",
                  renewal_date: "2026-01-01"
                }
              }
            ]
          },
          usedFields: [
            "id", "firm_name", "owner_name", "city", "phone", "active_subscription.amount", "active_subscription.renewal_date"
          ]
        },
        notes: "تظهر في نافذة منبثقة عند الضغط على عدد المشتركين في بطاقة الباقة."
      },
      {
        id: "PLAN-08",
        method: "DELETE",
        path: "/admin/plans/{plan_id}",
        screen: "DeletePlanConfirmDialog",
        component: "@/features/plans/components/DeletePlanModal",
        serviceCall: "src/lib/api/plans.ts -> deletePlan()",
        purpose: "حذف الباقة (مع فحص منع الحذف إذا وُجد مشتركون فيها)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "plan_id", type: "number | string", required: true, validation: "معرف الباقة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم حذف الباقة بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "إذا كانت الباقة مرتبطة بمكاتب حالية، يرجع السيرفر 422 برسالة توضح ضرورة نقل المشتركين أولاً."
      }
    ]
  },
  {
    id: "subscriptions",
    name: "05. إدارة الاشتراكات المركزية (Subscriptions Management)",
    description: "إدارة ومتابعة الاشتراكات الفعالة، المنتهية، طلبات الاشتراك قيد الانتظار، التجديد، الترقية، والعروض الاستثنائية المخصصة.",
    endpoints: [
      {
        id: "SUB-01",
        method: "GET",
        path: "/admin/subscriptions/stats",
        screen: "SubscriptionManagementView",
        component: "@/features/subscriptions/components/SubscriptionManagementView",
        serviceCall: "src/lib/api/subscriptions.ts -> fetchSubscriptionsStats()",
        purpose: "جلب المؤشرات الإحصائية للاشتراكات (النشطة، قيد الانتظار، المنتهية، وتجديدات الشهر الحالي)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              total_subscriptions: 142,
              active_subscriptions: 124,
              pending_approvals: 5,
              expired_subscriptions: 8,
              renewals_this_month: 22
            }
          },
          usedFields: [
            "data.total_subscriptions", "data.active_subscriptions", "data.pending_approvals", "data.expired_subscriptions", "data.renewals_this_month"
          ]
        },
        notes: "تعرض في بطاقات الـ KPI الإحصائية أعلى صفحة الاشتراكات."
      },
      {
        id: "SUB-02",
        method: "GET",
        path: "/admin/subscriptions",
        screen: "SubscriptionManagementView",
        component: "@/features/subscriptions/components/SubscriptionManagementView",
        serviceCall: "src/lib/api/subscriptions.ts -> fetchSubscriptions()",
        purpose: "استعراض قائمة الاشتراكات مع دعم البحث، فلترة الحالة، التبويبات، والاشتراكات ذات العروض المخصصة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "tab", type: "string", required: false, validation: "all | active | pending | expired | custom" },
            { field: "status", type: "string", required: false, validation: "active | pending | expired | suspended | cancelled" },
            { field: "is_custom_offer", type: "number", required: false, validation: "1 لجلب الاشتراكات ذات العروض الاستثنائية المخصصة" },
            { field: "page", type: "number", required: false, validation: "رقم الصفحة" },
            { field: "per_page", type: "number", required: false, validation: "سجلات الصفحة" },
            { field: "search", type: "string", required: false, validation: "بحث برقم الاشتراك، اسم المكتب، أو المالك" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              current_page: 1,
              total: 124,
              data: [
                {
                  id: 10,
                  subscription_code: "SUB-2025-089",
                  company_id: 96,
                  firm_name: "شركة العجلان وشركاؤه للمحاماة",
                  plan_id: 1,
                  plan_name: "باقة النخبة العدلية",
                  billing_cycle: "yearly",
                  amount: "5290.00",
                  payment_method: "mada",
                  start_date: "2025-01-01",
                  renewal_date: "2026-01-01",
                  status: "active",
                  is_custom_offer: false
                }
              ]
            }
          },
          usedFields: [
            "id", "subscription_code", "company_id", "firm_name", "plan_name", "billing_cycle",
            "amount", "payment_method", "start_date", "renewal_date", "status", "is_custom_offer"
          ]
        },
        notes: "يدعم تلوين صفوف الاشتراكات وفق الحالة (أخضر للنشط، برتقالي لقيد الانتظار، أحمر للمنتهي)."
      },
      {
        id: "SUB-03",
        method: "GET",
        path: "/admin/subscriptions/{subscription_id}",
        screen: "SubscriptionDetailsModal",
        component: "@/features/subscriptions/components/SubscriptionDetailsModal",
        serviceCall: "src/lib/api/subscriptions.ts -> fetchSubscriptionById()",
        purpose: "عرض التفاصيل الكاملة للاشتراك المحدد والفواتير المرتبطة به",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "subscription_id", type: "number | string", required: true, validation: "معرف الاشتراك" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              id: 10,
              subscription_code: "SUB-2025-089",
              firm: { id: 96, name: "شركة العجلان وشركاؤه للمحاماة" },
              plan: { id: 1, name: "باقة النخبة العدلية" },
              amount: "5290.00",
              billing_cycle: "yearly",
              start_date: "2025-01-01",
              renewal_date: "2026-01-01",
              status: "active"
            }
          },
          usedFields: ["data.*"]
        },
        notes: "تظهر في نافذة التفاصيل السريعة للاشتراك."
      },
      {
        id: "SUB-04",
        method: "POST",
        path: "/admin/subscriptions/{subscription_id}/approve",
        screen: "ApproveSubscriptionDialog",
        component: "@/features/subscriptions/components/SubscriptionManagementView",
        serviceCall: "src/lib/api/subscriptions.ts -> approveSubscription()",
        purpose: "الموافقة وتفعيل طلب اشتراك قيد الانتظار واعتماد السداد",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "subscription_id", type: "number | string", required: true, validation: "معرف الاشتراك" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تمت الموافقة على طلب الاشتراك وتفعيله بنجاح",
            data: { id: 10, status: "active" }
          },
          usedFields: ["status", "message"]
        },
        notes: "يحول حالة الاشتراك مباشرة إلى active ويرسل إشعاراً للمكتب."
      },
      {
        id: "SUB-05",
        method: "POST",
        path: "/admin/subscriptions/{subscription_id}/reject",
        screen: "RejectSubscriptionModal (رفض الاشتراك مع السبب)",
        component: "@/features/subscriptions/components/RejectSubscriptionModal",
        serviceCall: "src/lib/api/subscriptions.ts -> rejectSubscription()",
        purpose: "رفض طلب الاشتراك مع تسجيل وتدوين السبب القانوني أو المالي للمكتب",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "subscription_id", type: "number | string", required: true, validation: "معرف الاشتراك" }
          ],
          body: [
            { field: "reason", type: "string", required: true, validation: "سبب رفض طلب الاشتراك بالتفصيل" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم رفض طلب الاشتراك وإشعار المنشأة بالسبب",
            data: { id: 10, status: "rejected" }
          },
          usedFields: ["status", "message"]
        },
        notes: "حقل السبب إجباري في واجهة المستخدم لمنع الرفض بدون مبرر موثق."
      },
      {
        id: "SUB-06",
        method: "POST",
        path: "/admin/subscriptions/{subscription_id}/renew",
        screen: "RenewSubscriptionModal",
        component: "@/features/subscriptions/components/RenewSubscriptionModal",
        serviceCall: "src/lib/api/subscriptions.ts -> renewSubscription()",
        purpose: "تجديد اشتراك المكتب وتمديد فترة الصلاحية وإصدار فاتورة إلكترونية جديدة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "subscription_id", type: "number | string", required: true, validation: "معرف الاشتراك" }
          ],
          body: [
            { field: "period", type: "string", required: true, validation: "year | month" },
            { field: "payment_method", type: "string", required: true, validation: "mada | visa | bank_transfer" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تجديد الاشتراك بنجاح وتحديث تاريخ التجديد",
            data: { id: 10, renewal_date: "2027-01-01" }
          },
          usedFields: ["status", "message", "data.renewal_date"]
        },
        notes: "يعاد ضبط تاريخ التجديد تلقائياً وفق الفترة المختارة."
      },
      {
        id: "SUB-07",
        method: "POST",
        path: "/admin/subscriptions/{subscription_id}/upgrade",
        screen: "UpgradeSubscriptionModal",
        component: "@/features/subscriptions/components/UpgradeSubscriptionModal",
        serviceCall: "src/lib/api/subscriptions.ts -> upgradeSubscription()",
        purpose: "ترقية اشتراك المكتب لباقة أعلى واحتساب الفارق الزمني والمالي",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "subscription_id", type: "number | string", required: true, validation: "معرف الاشتراك" }
          ],
          body: [
            { field: "new_plan_id", type: "number", required: true, validation: "معرف الباقة الجديدة الأعلى" },
            { field: "billing_cycle", type: "string", required: false, validation: "monthly | yearly" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تمت ترقية الاشتراك بنجاح وتحديث صلاحيات المكتب",
            data: { id: 10, plan_id: 3 }
          },
          usedFields: ["status", "message", "data"]
        },
        notes: "يتم تحديث حدود الموارد فوراً للمكتب."
      },
      {
        id: "SUB-08",
        method: "POST",
        path: "/admin/subscriptions/{subscription_id}/cancel",
        screen: "CancelSubscriptionModal",
        component: "@/features/subscriptions/components/CancelSubscriptionModal",
        serviceCall: "src/lib/api/subscriptions.ts -> cancelSubscription()",
        purpose: "إلغاء اشتراك المكتب وإيقاف التجديد التلقائي مع تدوين السبب",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "subscription_id", type: "number | string", required: true, validation: "معرف الاشتراك" }
          ],
          body: [
            { field: "reason", type: "string", required: true, validation: "سبب الإلغاء" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم إلغاء الاشتراك وإيقاف التجديد التلقائي",
            data: { id: 10, status: "cancelled" }
          },
          usedFields: ["status", "message"]
        },
        notes: "يتطلب AlertDialog تحذيري لتأكيد رغبة الإلغاء."
      },
      {
        id: "SUB-09",
        method: "PATCH",
        path: "/admin/subscriptions/{subscription_id}/status",
        screen: "SubscriptionStatusSwitcher",
        component: "@/features/subscriptions/components/SubscriptionManagementView",
        serviceCall: "src/lib/api/subscriptions.ts -> updateSubscriptionStatus()",
        purpose: "تغيير حالة الاشتراك يدوياً من المشرف (تفعيل / تجميد / إيقاف)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "subscription_id", type: "number | string", required: true, validation: "معرف الاشتراك" }
          ],
          body: [
            { field: "status", type: "string", required: true, validation: "active | suspended | pending | expired" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث حالة الاشتراك بنجاح",
            data: { id: 10, status: "suspended" }
          },
          usedFields: ["status", "message", "data.status"]
        },
        notes: "تعديل فوري لحالة الاشتراك."
      },
      {
        id: "SUB-10",
        method: "POST",
        path: "/admin/subscriptions/{subscription_id}/custom-offer",
        screen: "CustomPlanOfferModal (تطبيق باقة مخصصة وعرض استثنائي)",
        component: "@/features/clients/components/ClientOfficeDetailsView",
        serviceCall: "src/lib/api/subscriptions.ts -> applyCustomOffer()",
        purpose: "تطبيق باقة مخصصة وزيادة حدود معينة (محامين، قضايا، تخزين) لاشتراك مكتب قائم خارج حدود الباقات القياسية",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "subscription_id", type: "number | string", required: true, validation: "معرف الاشتراك" }
          ],
          body: [
            { field: "offer_name", type: "string", required: false, validation: "اسم العرض الاستثنائي" },
            { field: "is_custom_offer", type: "number", required: true, validation: "يجب تمرير 1" },
            { field: "extra_lawyers", type: "number", required: false, validation: "محامين إضافيين فوق الباقة" },
            { field: "extra_cases", type: "number", required: false, validation: "قضايا إضافية" },
            { field: "extra_storage_gb", type: "number", required: false, validation: "جيجابايت تخزين إضافية" },
            { field: "custom_price", type: "number", required: false, validation: "السعر المخصص المتفق عليه" },
            { field: "custom_notes", type: "string", required: false, validation: "ملاحظات الاتفاقية الاستثنائية" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تطبيق العرض المخصص على اشتراك المكتب بنجاح",
            data: { id: 10, is_custom_offer: true }
          },
          usedFields: ["status", "message", "data"]
        },
        notes: "مستخدم في تبويب الباقة المخصصة بتفاصيل المكتب ومودال الترقية."
      },
      {
        id: "SUB-11",
        method: "DELETE",
        path: "/admin/subscriptions/{subscription_id}/custom-offer",
        screen: "ResetCustomOfferDialog",
        component: "@/features/subscriptions/components/SubscriptionManagementView",
        serviceCall: "src/lib/api/subscriptions.ts -> removeCustomOffer()",
        purpose: "إلغاء العرض المخصص والعودة للحدود القياسية لباقة الاشتراك الأصلية",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "subscription_id", type: "number | string", required: true, validation: "معرف الاشتراك" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم إلغاء العرض المخصص وإعادة الاشتراك لحدود الباقة القياسية"
          },
          usedFields: ["status", "message"]
        },
        notes: "يعيد ضبط الحدود تلقائياً."
      },
      {
        id: "SUB-12",
        method: "GET",
        path: "/admin/subscriptions/{subscription_id}/limits-breakdown",
        screen: "ClientOfficeDetailsView (مخطط استهلاك وتفصيل الحدود)",
        component: "@/features/clients/components/ClientOfficeDetailsView",
        serviceCall: "src/lib/api/subscriptions.ts -> fetchSubscriptionLimitsBreakdown()",
        purpose: "تفاصيل حدود الباقة والزيادات المخصصة ومقارنة الاستهلاك الفعلي بالمسموح",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "subscription_id", type: "number | string", required: true, validation: "معرف الاشتراك" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              plan_base_limits: { lawyers: 8, cases: 350, storage_gb: 50 },
              custom_extras: { lawyers: 5, cases: 100, storage_gb: 20 },
              total_allowed: { lawyers: 13, cases: 450, storage_gb: 70 },
              currently_used: { lawyers: 11, cases: 240, storage_gb: 28.5 }
            }
          },
          usedFields: ["data.plan_base_limits", "data.custom_extras", "data.total_allowed", "data.currently_used"]
        },
        notes: "تعرض في بطاقة تفكيك الموارد والحدود في ملف المكتب الشامل."
      }
    ]
  },
  {
    id: "staff",
    name: "06. طاقم العمل وفريق الإدارة (Staff Management)",
    description: "إدارة منسوبي ومشرفي المنصة، تعيين الأقسام والأدوار الوظيفية، إعادة تعيين كلمات المرور، والدخول المباشر كالموظف.",
    endpoints: [
      {
        id: "STAFF-01",
        method: "GET",
        path: "/admin/staff/stats",
        screen: "StaffManagementView",
        component: "@/features/staff/components/StaffManagementView",
        serviceCall: "src/lib/api/staff.ts -> fetchStaffStats()",
        purpose: "جلب إحصائيات طاقم العمل وتواجدهم (إجمالي الموظفين، النشطين، إجازة/معلق، والمشرفين)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              total_staff: 18,
              active_staff: 16,
              suspended_staff: 2,
              supervisors_count: 4
            }
          },
          usedFields: ["data.total_staff", "data.active_staff", "data.suspended_staff", "data.supervisors_count"]
        },
        notes: "تعرض في بطاقات المؤشرات الأربعة أعلى جدول الموظفين."
      },
      {
        id: "STAFF-02",
        method: "GET",
        path: "/admin/staff",
        screen: "StaffManagementView",
        component: "@/features/staff/components/StaffManagementView",
        serviceCall: "src/lib/api/staff.ts -> fetchStaffList()",
        purpose: "قائمة الموظفين والمشرفين مع بيانات الأقسام، الأدوار، الحالة، والبحث",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "page", type: "number", required: false, validation: "رقم الصفحة" },
            { field: "per_page", type: "number", required: false, validation: "عدد السجلات" },
            { field: "search", type: "string", required: false, validation: "بحث بالاسم، الكود الوظيفي، أو البريد" },
            { field: "department_id", type: "number", required: false, validation: "فلترة حسب القسم" },
            { field: "role_id", type: "number", required: false, validation: "فلترة حسب الدور" },
            { field: "status", type: "string", required: false, validation: "active | suspended" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              {
                id: 2,
                name: "راكان بن كمال الحارثي",
                emp_code: "EMP-130",
                email: "r.alharbi@aljudy.sa",
                phone: "+966571120049",
                department_id: 6,
                department_name: "قسم الدعم الفني والربط التقني",
                role_id: 3,
                role_name: "مشرف الدعم والعمليات",
                status: "active",
                assigned_tickets_count: 5,
                created_at: "2025-06-15"
              }
            ]
          },
          usedFields: [
            "id", "name", "emp_code", "email", "phone", "department_name", "role_name", "status", "assigned_tickets_count"
          ]
        },
        notes: "تدعم الواجهة كلاً من المخرجات المباشرة أو المغلفة بـ pagination."
      },
      {
        id: "STAFF-03",
        method: "POST",
        path: "/admin/staff",
        screen: "AddStaffModal (إضافة موظف جديد)",
        component: "@/features/staff/components/AddStaffModal",
        serviceCall: "src/lib/api/staff.ts -> createStaff()",
        purpose: "إضافة موظف جديد لطاقم إدارة المنصة وتعيين كوده وقسمه ودوره",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "name", type: "string", required: true, validation: "الاسم الرباعي للموظف" },
            { field: "emp_code", type: "string", required: true, validation: "الكود الوظيفي الفريد (مثل: EMP-130)" },
            { field: "email", type: "string", required: true, validation: "البريد الإلكتروني المهني (فريد)" },
            { field: "phone", type: "string", required: true, validation: "رقم الجوال بصيغة دولية" },
            { field: "password", type: "string", required: true, validation: "كلمة المرور الأولية (8+ خانات)" },
            { field: "department_id", type: "number", required: true, validation: "معرف القسم التابع له" },
            { field: "role_id", type: "number", required: true, validation: "معرف الدور الوظيفي الممنوح" },
            { field: "status", type: "string", required: true, validation: "active | suspended" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تمت إضافة الموظف بنجاح إلى طاقم الإدارة",
            data: { id: 14, name: "راكان بن كمال الحارثي" }
          },
          usedFields: ["status", "message", "data.id"]
        },
        notes: "ملاحظة هامة للباك اند: يجب ربط الموظف تلقائياً بجدول users حتى يتمكن من تسجيل الدخول عبر /login (انظر قسم الفجوات)."
      },
      {
        id: "STAFF-04",
        method: "GET",
        path: "/admin/staff/{staff_id}",
        screen: "StaffDetailsModal",
        component: "@/features/staff/components/StaffDetailsModal",
        serviceCall: "src/lib/api/staff.ts -> fetchStaffById()",
        purpose: "استعلام تفاصيل الموظف والصلاحيات والتذاكر المسندة له وسجل نشاطه",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "staff_id", type: "number | string", required: true, validation: "معرف الموظف" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              id: 2,
              name: "راكان بن كمال الحارثي",
              emp_code: "EMP-130",
              email: "r.alharbi@aljudy.sa",
              phone: "+966571120049",
              department: { id: 6, name: "الدعم الفني" },
              role: { id: 3, name: "مشرف الدعم" },
              status: "active"
            }
          },
          usedFields: ["data.*"]
        },
        notes: "تستخدم لتعبئة شاشة التفاصيل ونموذج التعديل."
      },
      {
        id: "STAFF-05",
        method: "PUT",
        path: "/admin/staff/{staff_id}",
        screen: "EditStaffModal",
        component: "@/features/staff/components/EditStaffModal",
        serviceCall: "src/lib/api/staff.ts -> updateStaff()",
        purpose: "تحديث بيانات الموظف (الاسم، الجوال، القسم، أو الدور الوظيفي)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "staff_id", type: "number | string", required: true, validation: "معرف الموظف" }
          ],
          body: [
            { field: "phone", type: "string", required: false, validation: "رقم الجوال الجديد" },
            { field: "department_id", type: "number", required: false, validation: "معرف القسم" },
            { field: "role_id", type: "number", required: false, validation: "معرف الدور" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث بيانات الموظف بنجاح",
            data: { id: 2 }
          },
          usedFields: ["status", "message"]
        },
        notes: "تتطلب الواجهة تأكيد حفظ التعديل."
      },
      {
        id: "STAFF-06",
        method: "PATCH",
        path: "/admin/staff/{staff_id}/status",
        screen: "StaffStatusSwitch",
        component: "@/features/staff/components/StaffManagementView",
        serviceCall: "src/lib/api/staff.ts -> updateStaffStatus()",
        purpose: "إيقاف أو تفعيل حساب الموظف",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "staff_id", type: "number | string", required: true, validation: "معرف الموظف" }
          ],
          body: [
            { field: "status", type: "string", required: true, validation: "active | suspended" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث حالة حساب الموظف",
            data: { id: 2, status: "suspended" }
          },
          usedFields: ["status", "message", "data.status"]
        },
        notes: "يمنع الموظف المعلق حسابه من الدخول للمنظومة فورياً."
      },
      {
        id: "STAFF-07",
        method: "POST",
        path: "/admin/staff/{staff_id}/reset-password",
        screen: "ResetStaffPasswordModal",
        component: "@/features/staff/components/ResetStaffPasswordModal",
        serviceCall: "src/lib/api/staff.ts -> resetStaffPassword()",
        purpose: "إعادة تعيين وتوليد كلمة مرور جديدة للموظف من قبل المشرف العام",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "staff_id", type: "number | string", required: true, validation: "معرف الموظف" }
          ],
          body: [
            { field: "password", type: "string", required: true, validation: "كلمة المرور الجديدة (8+ خانات)" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تمت إعادة تعيين كلمة المرور بنجاح للموظف"
          },
          usedFields: ["status", "message"]
        },
        notes: "يتم إظهار زر نسخ كلمة المرور في الواجهة بعد النجاح."
      },
      {
        id: "STAFF-08",
        method: "POST",
        path: "/admin/staff/{staff_id}/impersonate",
        screen: "LoginAsEmployeeModal",
        component: "@/features/staff/components/LoginAsEmployeeModal",
        serviceCall: "src/lib/api/staff.ts -> impersonateStaff()",
        purpose: "الدخول المباشر بحساب الموظف لمعاينة صلاحياته والتأكد من بيئة عمله",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "staff_id", type: "number | string", required: true, validation: "معرف الموظف" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم توليد رمز جلسة الموظف بنجاح",
            data: {
              token: "2|sanctum_staff_token_here",
              staff: { id: 2, name: "راكان بن كمال الحارثي", role: "support" }
            }
          },
          usedFields: ["data.token", "data.staff"]
        },
        notes: "تفتح الواجهة جلسة محاكاة للموظف مع راية علوية صفراء تتيح العودة لحساب المشرف."
      },
      {
        id: "STAFF-09",
        method: "DELETE",
        path: "/admin/staff/{staff_id}",
        screen: "DeleteStaffConfirmDialog",
        component: "@/features/staff/components/DeleteStaffModal",
        serviceCall: "src/lib/api/staff.ts -> deleteStaff()",
        purpose: "حذف حساب الموظف نهائياً بعد التحقق من عدم ارتباط تذاكر أو مهام حساسة به",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "staff_id", type: "number | string", required: true, validation: "معرف الموظف" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم حذف حساب الموظف بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "يتطلب تأكيد أمني AlertDialog."
      }
    ]
  },
  {
    id: "roles",
    name: "07. الأدوار والصلاحيات (Roles & Permissions)",
    description: "بناء أدوار الوصول الإدارية، مصفوفة الصلاحيات الدقيقة لكل موديول، وحماية أدوار النظام من الحذف.",
    endpoints: [
      {
        id: "ROLE-01",
        method: "GET",
        path: "/admin/roles/stats",
        screen: "RolesManagementView",
        component: "@/features/permissions/components/RolesManagementView",
        serviceCall: "src/lib/api/roles.ts -> fetchRolesStats()",
        purpose: "إحصائيات الأدوار ومصفوفة الصلاحيات (إجمالي الأدوار، الأدوار المخصصة، والموظفين المرتبطين)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              total_roles: 5,
              custom_roles: 3,
              system_protected_roles: 2,
              total_permissions_available: 48
            }
          },
          usedFields: ["data.total_roles", "data.custom_roles", "data.system_protected_roles", "data.total_permissions_available"]
        },
        notes: "تعرض في بطاقات الإحصاءات لصفحة الأدوار والصلاحيات."
      },
      {
        id: "ROLE-02",
        method: "GET",
        path: "/admin/roles/permissions",
        screen: "RolesManagementView / CreateRoleModal",
        component: "@/features/permissions/components/CreateRoleModal",
        serviceCall: "src/lib/api/roles.ts -> fetchPermissionsCatalog()",
        purpose: "استعلام دليل وصلاحيات النظام المتاحة بالكامل مقسمة حسب الموديولات",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              {
                module: "firms",
                module_name: "مكاتب المحاماة",
                permissions: [
                  { slug: "firms.view", name: "استعراض المكاتب", description: "رؤية القائمة والتفاصيل" },
                  { slug: "firms.create", name: "إضافة مكتب", description: "تسجيل مكتب جديد" },
                  { slug: "firms.edit", name: "تعديل مكتب", description: "تحديث بيانات المكتب" },
                  { slug: "firms.status_change", name: "تعطيل/تفعيل", description: "تغيير حالة المكتب" },
                  { slug: "firms.delete", name: "حذف مكتب", description: "الحذف النهائي" }
                ]
              }
            ]
          },
          usedFields: ["data.module", "data.module_name", "data.permissions.*"]
        },
        notes: "تستخدم لبناء مصفوفة الـ Checkboxes التفاعلية عند إنشاء أو تعديل دور وظيفي."
      },
      {
        id: "ROLE-03",
        method: "GET",
        path: "/admin/roles",
        screen: "RolesManagementView",
        component: "@/features/permissions/components/RolesManagementView",
        serviceCall: "src/lib/api/roles.ts -> fetchRoles()",
        purpose: "قائمة الأدوار الوظيفية المعرفة في النظام وعدد الموظفين المسندين لكل دور",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              {
                id: 1,
                name: "مدير النظام الأعلى (Super Admin)",
                slug: "super-admin",
                description: "صلاحيات مطلقة لكافة أجزاء المنظومة وإعدادات السيرفر",
                is_system: true,
                assigned_staff_count: 2,
                permissions_count: 48,
                permissions: ["*"]
              },
              {
                id: 3,
                name: "مشرف العمليات والدعم",
                slug: "operations-supervisor",
                description: "إدارة المكاتب ومتابعة التذاكر",
                is_system: false,
                assigned_staff_count: 6,
                permissions_count: 14,
                permissions: ["dashboard.view", "firms.view", "tickets.view", "tickets.reply"]
              }
            ]
          },
          usedFields: [
            "id", "name", "slug", "description", "is_system", "assigned_staff_count", "permissions_count", "permissions"
          ]
        },
        notes: "الأدوار التي تحمل is_system: true يتم تعطيل زري الحذف والتعديل الحساس لها لحماية النظام."
      },
      {
        id: "ROLE-04",
        method: "POST",
        path: "/admin/roles",
        screen: "CreateRoleModal (إضافة دور جديد)",
        component: "@/features/permissions/components/CreateRoleModal",
        serviceCall: "src/lib/api/roles.ts -> createRole()",
        purpose: "إضافة دور وظيفي مخصص وتحديد مصفوفة الصلاحيات الممنوحة له",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "name", type: "string", required: true, validation: "اسم الدور الوظيفي (مثل: مدقق عقود المكاتب)" },
            { field: "slug", type: "string", required: true, validation: "المعرف الإنجليزي الفريد (مثل: contract-auditor)" },
            { field: "description", type: "string", required: false, validation: "وصف مهام ومسؤوليات الدور" },
            { field: "permissions", type: "string[]", required: true, validation: "مصفوفة معرفات الصلاحيات المختارة (مثل: ['firms.view', 'tickets.view'])" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم إنشاء الدور الوظيفي بنجاح",
            data: { id: 6, name: "مدقق عقود المكاتب" }
          },
          usedFields: ["status", "message", "data.id"]
        },
        notes: "يجب اختيار صلاحية واحدة على الأقل قبل تفعيل زر الحفظ في الواجهة."
      },
      {
        id: "ROLE-05",
        method: "GET",
        path: "/admin/roles/{role_id}",
        screen: "RoleDetailsModal / EditRoleModal",
        component: "@/features/permissions/components/RoleDetailsModal",
        serviceCall: "src/lib/api/roles.ts -> fetchRoleById()",
        purpose: "استعلام تفاصيل الدور والصلاحيات الممنوحة له والموظفين التابعين له",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "role_id", type: "number | string", required: true, validation: "معرف الدور" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              id: 3,
              name: "مشرف العمليات والدعم",
              slug: "operations-supervisor",
              description: "إدارة المكاتب ومتابعة التذاكر",
              permissions: ["dashboard.view", "firms.view", "firms.edit", "tickets.view", "tickets.reply"]
            }
          },
          usedFields: ["data.*"]
        },
        notes: "تستخدم لتعبئة مربعات الاختيار في نموذج التعديل."
      },
      {
        id: "ROLE-06",
        method: "PUT",
        path: "/admin/roles/{role_id}",
        screen: "EditRoleModal (تعديل صلاحيات الدور)",
        component: "@/features/permissions/components/EditRoleModal",
        serviceCall: "src/lib/api/roles.ts -> updateRole()",
        purpose: "تعديل الصلاحيات الممنوحة للدور أو تحديث اسمه ووصفه",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "role_id", type: "number | string", required: true, validation: "معرف الدور" }
          ],
          body: [
            { field: "name", type: "string", required: false, validation: "الاسم المحدث" },
            { field: "description", type: "string", required: false, validation: "الوصف المحدث" },
            { field: "permissions", type: "string[]", required: true, validation: "المصفوفة الجديدة للصلاحيات" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث صلاحيات الدور بنجاح",
            data: { id: 3 }
          },
          usedFields: ["status", "message"]
        },
        notes: "يتطلب تأكيد أمني قبل الحفظ."
      },
      {
        id: "ROLE-07",
        method: "POST",
        path: "/admin/roles/{role_id}/reassign-staff",
        screen: "ReassignStaffBeforeDeleteModal",
        component: "@/features/permissions/components/ReassignRoleModal",
        serviceCall: "src/lib/api/roles.ts -> reassignRoleStaff()",
        purpose: "إعادة تعيين الموظفين المرتبطين بالدور إلى دور آخر تمهيداً لحذف الدور بأمان",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "role_id", type: "number | string", required: true, validation: "معرف الدور الحالي" }
          ],
          body: [
            { field: "target_role_id", type: "number", required: true, validation: "معرف الدور الجديد البديل" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تمت إعادة تعيين جميع الموظفين للدور البديل بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "خطوة وقائية إجبارية تمنع حذف أي دور وظيفي طالما وُجد موظف واحد مسند إليه."
      },
      {
        id: "ROLE-08",
        method: "DELETE",
        path: "/admin/roles/{role_id}",
        screen: "DeleteRoleConfirmDialog",
        component: "@/features/permissions/components/DeleteRoleModal",
        serviceCall: "src/lib/api/roles.ts -> deleteRole()",
        purpose: "حذف الدور الوظيفي بعد التأكد من خلوه من الموظفين وعدم كونه دوراً أساسياً للنظام",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "role_id", type: "number | string", required: true, validation: "معرف الدور المراد حذفه" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم حذف الدور الوظيفي بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "إذا كان الدور محمياً يرجع 403 مع رسالة 'لا يمكن حذف أدوار النظام الأساسية'."
      }
    ]
  },
  {
    id: "departments",
    name: "08. الأقسام والهيكل التنظيمي (Departments)",
    description: "إدارة الهيكل التنظيمي للمنصة، الأقسام المسؤولة عن توجيه تذاكر الدعم والاشتراكات والمحاسبة.",
    endpoints: [
      {
        id: "DEP-01",
        method: "GET",
        path: "/admin/departments",
        screen: "TicketsView (تبويب الأقسام) / Staff Modals",
        component: "@/features/tickets/components/TicketsDepartmentTab",
        serviceCall: "src/lib/api/departments.ts -> fetchDepartments()",
        purpose: "استعراض قائمة الأقسام الإدارية والفنية وأكوادها",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              {
                id: 6,
                name: "قسم الربط التقني وبوابة ناجز",
                code: "DEP-06",
                description: "معالجة تكامل واجهات وزارة العدل وشهادات الربط",
                status: "active",
                staff_count: 5,
                open_tickets_count: 3
              }
            ]
          },
          usedFields: ["id", "name", "code", "description", "status", "staff_count", "open_tickets_count"]
        },
        notes: "تستخدم في القوائم المنسدلة عند إنشاء موظف، توجيه تذكرة، أو في إدارة الأقسام."
      },
      {
        id: "DEP-02",
        method: "POST",
        path: "/admin/departments",
        screen: "AddDepartmentModal",
        component: "@/features/tickets/components/AddDepartmentModal",
        serviceCall: "src/lib/api/departments.ts -> createDepartment()",
        purpose: "إضافة قسم تنظيمي جديد",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "name", type: "string", required: true, validation: "اسم القسم" },
            { field: "code", type: "string", required: true, validation: "كود القسم (مثل: DEP-07)" },
            { field: "description", type: "string", required: false, validation: "وصف مهام القسم" },
            { field: "status", type: "string", required: true, validation: "active | disabled" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم إنشاء القسم بنجاح",
            data: { id: 7, name: "قسم التحكيم والوساطة" }
          },
          usedFields: ["status", "message", "data.id"]
        },
        notes: "يتم تحديث قائمة الأقسام فورياً بعد الإضافة."
      },
      {
        id: "DEP-03",
        method: "GET",
        path: "/admin/departments/{id}",
        screen: "EditDepartmentModal",
        component: "@/features/tickets/components/EditDepartmentModal",
        serviceCall: "src/lib/api/departments.ts -> fetchDepartmentById()",
        purpose: "استعلام بيانات قسم محدد",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "id", type: "number | string", required: true, validation: "معرف القسم" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: { id: 6, name: "قسم الربط التقني", code: "DEP-06" }
          },
          usedFields: ["data.*"]
        },
        notes: "تعبئة نموذج التعديل."
      },
      {
        id: "DEP-04",
        method: "PUT",
        path: "/admin/departments/{id}",
        screen: "EditDepartmentModal",
        component: "@/features/tickets/components/EditDepartmentModal",
        serviceCall: "src/lib/api/departments.ts -> updateDepartment()",
        purpose: "تحديث وتعديل بيانات القسم",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "id", type: "number | string", required: true, validation: "معرف القسم" }
          ],
          body: [
            { field: "name", type: "string", required: false, validation: "الاسم المحدث" },
            { field: "description", type: "string", required: false, validation: "الوصف" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث بيانات القسم بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "يتطلب تأكيد حفظ."
      },
      {
        id: "DEP-05",
        method: "DELETE",
        path: "/admin/departments/{id}",
        screen: "DeleteDepartmentDialog",
        component: "@/features/tickets/components/DeleteDepartmentModal",
        serviceCall: "src/lib/api/departments.ts -> deleteDepartment()",
        purpose: "حذف القسم بعد التحقق من عدم ارتباط موظفين أو تذاكر به",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "id", type: "number | string", required: true, validation: "معرف القسم" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم حذف القسم بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "يرجع 422 إذا كان هناك موظفون مسندون للقسم."
      }
    ]
  },
  {
    id: "tickets",
    name: "09. تذاكر الدعم الفني (Support Tickets)",
    description: "إدارة تذاكر الدعم الواردة من المكاتب، الفلترة حسب الأولوية والقسم، كتابة الردود والملاحظات الداخلية، والإسناد للموظفين.",
    endpoints: [
      {
        id: "TCK-01",
        method: "GET",
        path: "/admin/tickets/stats",
        screen: "TicketsView (صفحة التذاكر)",
        component: "@/features/tickets/components/TicketsView",
        serviceCall: "src/lib/api/tickets.ts -> fetchTicketsStats()",
        purpose: "جلب إحصائيات التذاكر: المفتوحة، قيد المعالجة، المغلقة، متوسط سرعة الاستجابة، ونسبة رضا المكاتب",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              open: 7,
              in_progress: 12,
              pending: 4,
              closed: 98,
              total: 121,
              satisfaction_rate: 96.5,
              avg_response_time: "18 دقيقة"
            }
          },
          usedFields: [
            "data.open", "data.in_progress", "data.pending", "data.closed", "data.total", "data.satisfaction_rate", "data.avg_response_time"
          ]
        },
        notes: "تعرض في بطاقات الـ KPI أعلى لوحة التذاكر."
      },
      {
        id: "TCK-02",
        method: "GET",
        path: "/admin/tickets",
        screen: "TicketsView (قائمة التذاكر)",
        component: "@/features/tickets/components/TicketsView",
        serviceCall: "src/lib/api/tickets.ts -> fetchTickets()",
        purpose: "استعراض قائمة التذاكر مع فلترة الحالة (مفتوحة، قيد المعالجة، مغلقة)، الأولوية (حرجة، متوسطة، منخفضة)، والبحث",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "status", type: "string", required: false, validation: "open | in_progress | pending | closed" },
            { field: "priority", type: "string", required: false, validation: "urgent | high | medium | low" },
            { field: "search", type: "string", required: false, validation: "بحث برقم التذكرة، العنوان، اسم المكتب، أو المحامي" },
            { field: "page", type: "number", required: false, validation: "رقم الصفحة" },
            { field: "per_page", type: "number", required: false, validation: "عدد السجلات" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              {
                id: 45,
                ticket_number: "TCK-2025-045",
                subject: "تعذر مزامنة صك حكم قضائي من بوابة ناجز",
                description: "توقف استرجاع الجلسات والبيانات الصادرة من محكمة الاستئناف",
                priority: "urgent",
                status: "in_progress",
                channel: "portal",
                created_at: "2026-11-20T10:15:00Z",
                firm: { id: 96, name: "شركة العجلان للمحاماة" },
                department: { id: 6, name: "قسم الربط التقني" },
                assignee: { id: 2, name: "راكان الحارثي" }
              }
            ]
          },
          usedFields: [
            "id", "ticket_number", "subject", "description", "priority", "status", "created_at",
            "firm.name", "department.name", "assignee.name"
          ]
        },
        notes: "تدعم الواجهة كلاً من التصفح المبوب والفلترة السريعة."
      },
      {
        id: "TCK-03",
        method: "POST",
        path: "/admin/tickets",
        screen: "CreateTicketModal (إنشاء تذكرة دعم جديدة من الإدارة)",
        component: "@/features/tickets/components/CreateTicketModal",
        serviceCall: "src/lib/api/tickets.ts -> createTicket()",
        purpose: "إنشاء تذكرة دعم فني جديدة موجهة لمكتب محاماة معين أو فتح بلاغ صيانة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "company_id", type: "number", required: true, validation: "معرف مكتب المحاماة المعني" },
            { field: "subject", type: "string", required: true, validation: "عنوان وموضوع التذكرة" },
            { field: "description", type: "string", required: true, validation: "شرح تفصيلي للمشكلة أو البلاغ" },
            { field: "department_id", type: "number", required: true, validation: "معرف القسم المختص بالمعالجة" },
            { field: "priority", type: "string", required: true, validation: "urgent | high | medium | low" },
            { field: "channel", type: "string", required: false, validation: "portal | email | phone | whatsapp" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم إنشاء تذكرة الدعم بنجاح وتوجيهها للقسم المختص",
            data: { id: 46, ticket_number: "TCK-2025-046" }
          },
          usedFields: ["status", "message", "data.id", "data.ticket_number"]
        },
        notes: "يتم إشعار المكتب وموظف الدعم فورياً."
      },
      {
        id: "TCK-04",
        method: "GET",
        path: "/admin/tickets/{ticket_id}",
        screen: "TicketDetailsView (شاشة تفاصيل ومحادثة التذكرة)",
        component: "@/features/tickets/components/TicketDetailsModal",
        serviceCall: "src/lib/api/tickets.ts -> fetchTicketById()",
        purpose: "عرض التفاصيل الكاملة للتذكرة، سجل المحادثة والردود، الملاحظات الداخلية، والمرفقات",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "ticket_id", type: "number | string", required: true, validation: "معرف التذكرة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              id: 45,
              ticket_number: "TCK-2025-045",
              subject: "تعذر مزامنة صك حكم قضائي",
              description: "توقف استرجاع الجلسات",
              priority: "urgent",
              status: "in_progress",
              firm: { id: 96, name: "شركة العجلان للمحاماة", phone: "+966501234567" },
              assignee: { id: 2, name: "راكان الحارثي" },
              replies: [
                {
                  id: 1,
                  author_name: "د. خالد العجلان",
                  author_type: "client",
                  message: "نأمل سرعة المعالجة لارتباطنا بجلسة استئناف غداً.",
                  is_internal_note: false,
                  created_at: "2026-11-20T10:20:00Z"
                },
                {
                  id: 2,
                  author_name: "راكان الحارثي",
                  author_type: "support",
                  message: "ملاحظة داخلية: الخلل من تجديد مفتاح الـ SSL مع ناجز.",
                  is_internal_note: true,
                  created_at: "2026-11-20T10:45:00Z"
                }
              ]
            }
          },
          usedFields: [
            "data.id", "data.ticket_number", "data.subject", "data.description", "data.priority",
            "data.status", "data.firm", "data.assignee", "data.replies.*"
          ]
        },
        notes: "يتم تمييز الملاحظات الداخلية بلون خلفية أصفر/ذهبي خاص وتنبيه واضح بأنها لا تظهر للعميل."
      },
      {
        id: "TCK-05",
        method: "POST",
        path: "/admin/tickets/{ticket_id}/reply",
        screen: "TicketReplyForm (إرسال رد موجه للعميل)",
        component: "@/features/tickets/components/TicketDetailsModal",
        serviceCall: "src/lib/api/tickets.ts -> replyTicket()",
        purpose: "كتابة وإرسال رد رسمي موجه للمكتب مع إشعار بالبريد أو الرسائل النصية",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "ticket_id", type: "number | string", required: true, validation: "معرف التذكرة" }
          ],
          body: [
            { field: "message", type: "string", required: true, validation: "نص الرد الموجه للمكتب" },
            { field: "is_internal_note", type: "boolean", required: true, validation: "false للردود العلنية للمكتب" },
            { field: "notify_client_sms_email", type: "boolean", required: false, validation: "إرسال تنبيه بالبريد/SMS" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم إرسال الرد بنجاح وإشعار العميل",
            data: { id: 89, created_at: "2026-11-21T11:00:00Z" }
          },
          usedFields: ["status", "message", "data"]
        },
        notes: "يضاف الرد فورياً إلى شريط المحادثة بدون إعادة تحميل الصفحة."
      },
      {
        id: "TCK-06",
        method: "POST",
        path: "/admin/tickets/{ticket_id}/reply",
        screen: "TicketInternalNoteForm (إضافة ملاحظة داخلية)",
        component: "@/features/tickets/components/TicketDetailsModal",
        serviceCall: "src/lib/api/tickets.ts -> replyTicket()",
        purpose: "تدوين ملاحظة سرية بين فريق الدعم الفني فقط دون إشعار العميل ودون ظهورها في حسابه",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "ticket_id", type: "number | string", required: true, validation: "معرف التذكرة" }
          ],
          body: [
            { field: "message", type: "string", required: true, validation: "نص الملاحظة الداخلية الخاصة" },
            { field: "is_internal_note", type: "boolean", required: true, validation: "true لضمان سرية الملاحظة" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم حفظ الملاحظة الداخلية بنجاح",
            data: { id: 90, is_internal_note: true }
          },
          usedFields: ["status", "message", "data"]
        },
        notes: "تظهر في سجل التذكرة مع وسم 'ملاحظة سرية لفريق العمل'."
      },
      {
        id: "TCK-07",
        method: "POST",
        path: "/admin/tickets/{ticket_id}/assign",
        screen: "AssignTicketModal",
        component: "@/features/tickets/components/AssignTicketModal",
        serviceCall: "src/lib/api/tickets.ts -> assignTicket()",
        purpose: "إسناد التذكرة لموظف دعم فني مختص مع توضيح سبب الإسناد",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "ticket_id", type: "number | string", required: true, validation: "معرف التذكرة" }
          ],
          body: [
            { field: "staff_id", type: "number", required: true, validation: "معرف موظف الدعم المكلف" },
            { field: "reason", type: "string", required: false, validation: "سبب الإسناد أو التخصص المطلوب" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم إسناد التذكرة للموظف بنجاح",
            data: { id: 45, staff_id: 2 }
          },
          usedFields: ["status", "message", "data"]
        },
        notes: "يصل إشعار للموظف المسند إليه بمجرد النجاح."
      },
      {
        id: "TCK-08",
        method: "PATCH",
        path: "/admin/tickets/{ticket_id}/status",
        screen: "TicketStatusDropdown",
        component: "@/features/tickets/components/TicketDetailsModal",
        serviceCall: "src/lib/api/tickets.ts -> updateTicketStatus()",
        purpose: "تغيير حالة التذكرة (مفتوحة / جاري المعالجة / معلقة / مغلقة)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "ticket_id", type: "number | string", required: true, validation: "معرف التذكرة" }
          ],
          body: [
            { field: "status", type: "string", required: true, validation: "open | in_progress | pending | closed" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث حالة التذكرة بنجاح",
            data: { id: 45, status: "in_progress" }
          },
          usedFields: ["status", "message", "data.status"]
        },
        notes: "تحديث فوري لوسم الحالة في المحادثة والجدول."
      },
      {
        id: "TCK-09",
        method: "POST",
        path: "/admin/tickets/{ticket_id}/close",
        screen: "CloseTicketButton",
        component: "@/features/tickets/components/TicketDetailsModal",
        serviceCall: "src/lib/api/tickets.ts -> closeTicket()",
        purpose: "إغلاق التذكرة بنجاح واعتماد المعالجة وإرسال استبيان الرضا للمكتب",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "ticket_id", type: "number | string", required: true, validation: "معرف التذكرة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم إغلاق التذكرة بنجاح واعتماد حل المشكلة",
            data: { id: 45, status: "closed" }
          },
          usedFields: ["status", "message"]
        },
        notes: "تتحول حالة التذكرة إلى مغلقة وتمنع الردود ما لم يعد العميل فتحها."
      }
    ]
  },
  {
    id: "payments",
    name: "10. بوابات الدفع الإلكتروني (Payment Gateways)",
    description: "إدارة وتكوين بوابات الدفع (Stripe, Tap, HyperPay)، مفاتيح التشفير، دعم الدفع المتكرر، واختبار الاتصال.",
    endpoints: [
      {
        id: "PAY-01",
        method: "GET",
        path: "/admin/payment-gateways",
        screen: "PaymentGatewaysPage",
        component: "@/features/payment-gateways/components/PaymentGatewaysView",
        serviceCall: "src/lib/api/payments.ts -> fetchPaymentGateways()",
        purpose: "استعراض بوابات الدفع الإلكتروني المعتمدة، حالات التفعيل، ومعايير أمان ZATCA والمدى",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            stats: {
              total_gateways: 3,
              active_gateways: 2,
              security_standard: "PCI-DSS Level 1",
              zatca_phase: "Phase 2 Integrated"
            },
            data: [
              {
                id: "stripe",
                name: "Stripe Global",
                mode: "live",
                status: "active",
                is_recurring_supported: true,
                supported_currencies: ["SAR", "USD", "AED"],
                features: ["Apple Pay", "Mada", "Credit Cards"]
              },
              {
                id: "tap",
                name: "Tap Payments (الخليج)",
                mode: "live",
                status: "active",
                is_recurring_supported: true,
                supported_currencies: ["SAR", "KWD", "BHD", "AED"]
              }
            ]
          },
          usedFields: ["stats.*", "data.*"]
        },
        notes: "تعرض بطاقات بوابات الدفع مع شارات الحالة والمفاتيح المشفرة."
      },
      {
        id: "PAY-02",
        method: "GET",
        path: "/admin/payment-gateways/{gateway}",
        screen: "GatewayConfigModal",
        component: "@/features/payment-gateways/components/GatewayConfigModal",
        serviceCall: "src/lib/api/payments.ts -> fetchPaymentGatewayDetails()",
        purpose: "استعلام تفاصيل ومفاتيح ربط بوابة محددة (مثل: stripe أو tap)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "gateway", type: "string", required: true, validation: "معرف البوابة (stripe | tap | hyperpay)" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              id: "stripe",
              name: "Stripe",
              mode: "live",
              publishable_key: "pk_live_aljudy_demo_2025",
              has_secret_key: true,
              apple_pay_enabled: true,
              mada_enabled: true
            }
          },
          usedFields: ["data.*"]
        },
        notes: "لا يتم إرجاع المفتاح السري كاملاً لدواعي الأمان بل مجرد تأكيد وجوده has_secret_key."
      },
      {
        id: "PAY-03",
        method: "PUT",
        path: "/admin/payment-gateways/{gateway}",
        screen: "GatewayConfigModal (حفظ إعدادات البوابة)",
        component: "@/features/payment-gateways/components/GatewayConfigModal",
        serviceCall: "src/lib/api/payments.ts -> updatePaymentGateway()",
        purpose: "تحديث مفاتيح الربط، نمط التشغيل (تجريبي / حي)، ودعم العملات",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "gateway", type: "string", required: true, validation: "معرف البوابة" }
          ],
          body: [
            { field: "mode", type: "string", required: true, validation: "live | test" },
            { field: "is_recurring_supported", type: "boolean", required: false, validation: "تفعيل الخصم الدوري التلقائي" },
            { field: "supported_currencies", type: "string[]", required: false, validation: "العملات المعتمدة (['SAR', 'USD'])" },
            { field: "config", type: "object", required: true, validation: "كائن المفاتيح: publishable_key, secret_key, webhook_secret" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث إعدادات بوابة الدفع بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "يتطلب AlertDialog تأكيدي لأن تغيير المفاتيح يؤثر فوراً على عمليات سداد المكاتب."
      },
      {
        id: "PAY-04",
        method: "PATCH",
        path: "/admin/payment-gateways/{gateway}/status",
        screen: "GatewayStatusToggle",
        component: "@/features/payment-gateways/components/PaymentGatewaysView",
        serviceCall: "src/lib/api/payments.ts -> togglePaymentGatewayStatus()",
        purpose: "تفعيل أو تعطيل بوابة دفع معينة في صفحة السداد",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "gateway", type: "string", required: true, validation: "معرف البوابة" }
          ],
          body: [
            { field: "status", type: "string", required: true, validation: "active | inactive" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث حالة بوابة الدفع بنجاح",
            data: { gateway: "stripe", status: "active" }
          },
          usedFields: ["status", "message", "data.status"]
        },
        notes: "تحديث فوري لشارة الحالة."
      },
      {
        id: "PAY-05",
        method: "POST",
        path: "/admin/payment-gateways/{gateway}/test",
        screen: "PingTestGatewayButton",
        component: "@/features/payment-gateways/components/GatewayConfigModal",
        serviceCall: "src/lib/api/payments.ts -> testPaymentGatewayConnection()",
        purpose: "فحص واختبار الاتصال المباشر ببوابة الدفع (Ping Test) والتأكد من صحة المفاتيح",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "gateway", type: "string", required: true, validation: "معرف البوابة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم التحقق من الاتصال بنجاح. البوابة جاهزة للعمليات الحية (Latency: 142ms)",
            data: { latency_ms: 142, environment: "live" }
          },
          usedFields: ["status", "message", "data"]
        },
        notes: "يعرض نتيجة الفحص في Toast منسق أو رسالة تنبيه داخل المودال."
      }
    ]
  },
  {
    id: "invoices",
    name: "11. فواتير الاشتراكات المركزية (Central Invoices)",
    description: "إدارة الفواتير الإلكترونية الصادرة للمكاتب، مبالغ السداد، الضريبة 15%، ومطابقة ZATCA QR Code المرحلة الثانية.",
    endpoints: [
      {
        id: "INV-01",
        method: "GET",
        path: "/admin/invoices",
        screen: "InvoicesView (سجل الفواتير)",
        component: "@/features/invoices/components/InvoicesView",
        serviceCall: "src/lib/api/payments.ts -> fetchInvoices()",
        purpose: "استعراض كافة فواتير الاشتراكات المركزية للمنصة مع البحث وفلترة الحالة والتاريخ",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "page", type: "number", required: false, validation: "رقم الصفحة" },
            { field: "per_page", type: "number", required: false, validation: "عدد الفواتير (افتراضي 10)" },
            { field: "search", type: "string", required: false, validation: "بحث برقم الفاتورة أو اسم المكتب" },
            { field: "status", type: "string", required: false, validation: "paid | unpaid | refunded | overdue" },
            { field: "company_id", type: "number", required: false, validation: "فلترة فواتير مكتب محدد" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              current_page: 1,
              total: 86,
              data: [
                {
                  id: 1,
                  invoice_number: "INV-2025-001",
                  company_id: 96,
                  firm_name: "شركة العجلان للمحاماة",
                  plan_name: "باقة النخبة العدلية",
                  subtotal: "4600.00",
                  tax_amount: "690.00",
                  total_amount: "5290.00",
                  currency: "SAR",
                  status: "paid",
                  payment_method: "mada",
                  paid_at: "2025-01-01T12:00:00Z",
                  due_date: "2025-01-01",
                  zatca_status: "reported"
                }
              ]
            }
          },
          usedFields: [
            "id", "invoice_number", "firm_name", "plan_name", "subtotal", "tax_amount",
            "total_amount", "currency", "status", "payment_method", "paid_at", "zatca_status"
          ]
        },
        notes: "تدعم الواجهة تصدير الفواتير وطباعتها وتلوين حالات الدفع."
      },
      {
        id: "INV-02",
        method: "GET",
        path: "/admin/invoices/{invoice_id}",
        screen: "InvoiceDetailsModal / Preview",
        component: "@/features/invoices/components/InvoiceDetailsModal",
        serviceCall: "src/lib/api/payments.ts -> fetchInvoiceById()",
        purpose: "استعلام تفاصيل الفاتورة الإلكترونية المعتمدة ومطابقة ZATCA QR Code والبيانات الضريبية",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "invoice_id", type: "number | string", required: true, validation: "معرف الفاتورة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              id: 1,
              invoice_number: "INV-2025-001",
              firm: {
                name: "شركة العجلان للمحاماة",
                tax_number: "301298457200003",
                address: "الرياض، طريق الملك فهد"
              },
              items: [
                { description: "اشتراك سنوي - باقة النخبة العدلية", amount: "4600.00" }
              ],
              tax_rate: 15,
              tax_amount: "690.00",
              total_amount: "5290.00",
              zatca_qr: "AQZBbEp1ZHkCBzMwMTI5ODQ1NzIwMDAwMwMUMjAyNS0wMS0wMVQxMjowMDowMFoEBTUyOTAuMAUFNjkwLjA=",
              status: "paid"
            }
          },
          usedFields: ["data.*"]
        },
        notes: "يعرض رمز الاستجابة السريع ZATCA QR صالحاً للمسح الضريبي الفوري."
      }
    ]
  },
  {
    id: "announcements",
    name: "12. الإعلانات والإشعارات المركزية (Central Announcements)",
    description: "بث الإعلانات والتحديثات النظامية لجميع المكاتب، جدولة الإشعارات، وتحديد الجمهور المستهدف.",
    endpoints: [
      {
        id: "ANN-01",
        method: "GET",
        path: "/admin/announcements",
        screen: "NotificationsManagementView",
        component: "@/features/notifications/components/NotificationsManagementView",
        serviceCall: "src/lib/api/announcements.ts -> fetchAnnouncements()",
        purpose: "استعراض قائمة الإعلانات والإشعارات المركزية مع دعم الفلترة حسب الحالة والجمهور المستهدف",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "page", type: "number", required: false, validation: "رقم الصفحة" },
            { field: "per_page", type: "number", required: false, validation: "سجلات الصفحة" },
            { field: "search", type: "string", required: false, validation: "بحث بالعنوان أو المحتوى" },
            { field: "status", type: "string", required: false, validation: "sent | scheduled | draft" },
            { field: "audience", type: "string", required: false, validation: "all | selected_firms | plan" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              current_page: 1,
              total: 14,
              data: [
                {
                  id: 1,
                  title: "تحديث هام: تفعيل التحقق الثنائي عبر نفاذ",
                  content: "نود إحاطة جميع مكاتب المحاماة بأنه تم تفعيل الدخول الموحد عبر نفاذ الوطني",
                  target_audience: "all",
                  status: "sent",
                  sent_at: "2026-11-18T09:00:00Z",
                  action_url: "https://aljudy.sa/updates/nafaz-2fa",
                  action_label: "طريقة التفعيل"
                }
              ]
            }
          },
          usedFields: ["id", "title", "content", "target_audience", "status", "sent_at", "action_url", "action_label"]
        },
        notes: "تحسب الواجهة إحصائيات الإعلانات تلقائياً عبر fetchAnnouncementsStats()."
      },
      {
        id: "ANN-02",
        method: "POST",
        path: "/admin/announcements",
        screen: "CreateNotificationModal (بث إشعار جديد)",
        component: "@/features/notifications/components/CreateNotificationModal",
        serviceCall: "src/lib/api/announcements.ts -> createAnnouncement()",
        purpose: "إرسال وبث إشعار مركزي جديد للمكاتب أو جدولته لوقت محدد",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "title", type: "string", required: true, validation: "عنوان الإعلان المركزي" },
            { field: "content", type: "string", required: true, validation: "نص الإعلان" },
            { field: "target_audience", type: "string", required: true, validation: "all | selected_firms | plan" },
            { field: "target_plan_id", type: "number", required: false, validation: "إذا كان الجمهور باقة معينة" },
            { field: "target_company_ids", type: "number[]", required: false, validation: "إذا كان الجمهور مكاتب مختارة" },
            { field: "action_url", type: "string", required: false, validation: "رابط الإجراء عند النقر" },
            { field: "action_label", type: "string", required: false, validation: "نص زر الإجراء" },
            { field: "status", type: "string", required: true, validation: "sent | scheduled | draft" },
            { field: "scheduled_at", type: "string", required: false, validation: "تاريخ ووقت الجدولة (ISO)" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم بث الإشعار المركزي بنجاح للمكاتب المحددة",
            data: { id: 15, title: "تحديث هام" }
          },
          usedFields: ["status", "message", "data.id"]
        },
        notes: "يدعم الإرسال الفوري أو الحفظ كمسودة."
      },
      {
        id: "ANN-03",
        method: "GET",
        path: "/admin/announcements/{id}",
        screen: "NotificationDetailsModal",
        component: "@/features/notifications/components/NotificationDetailsModal",
        serviceCall: "src/lib/api/announcements.ts -> fetchAnnouncementById()",
        purpose: "استعراض تفاصيل إشعار محدد ومعدلات الوصول والمشاهدات",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "id", type: "number | string", required: true, validation: "معرف الإشعار" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              id: 1,
              title: "تحديث هام: تفعيل التحقق الثنائي عبر نفاذ",
              content: "نص الإعلان...",
              target_audience: "all",
              status: "sent",
              sent_at: "2026-11-18T09:00:00Z"
            }
          },
          usedFields: ["data.*"]
        },
        notes: "تعبئة نموذج المعاينة والتعديل."
      },
      {
        id: "ANN-04",
        method: "DELETE",
        path: "/admin/announcements/{id}",
        screen: "DeleteNotificationConfirmDialog",
        component: "@/features/notifications/components/DeleteNotificationModal",
        serviceCall: "src/lib/api/announcements.ts -> deleteAnnouncement()",
        purpose: "حذف إعلان مركزي",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "id", type: "number | string", required: true, validation: "معرف الإشعار المراد حذفه" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم حذف الإعلان بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "حذف فوري من سجلات الإعلانات."
      }
    ]
  },
  {
    id: "settings",
    name: "13. الإعدادات العامة وهوية المنصة وخادم النظام (Settings & Server)",
    description: "إعدادات الهوية البصرية، الروابط، التحقق من مواصفات وتوجيهات PHP، وتحديثات نواة النظام.",
    endpoints: [
      {
        id: "SET-01",
        method: "GET",
        path: "/admin/settings/general",
        screen: "GeneralSettingsView",
        component: "@/features/settings/components/GeneralSettingsView",
        serviceCall: "src/lib/api/settings.ts -> fetchGeneralSettings()",
        purpose: "استعراض الإعدادات العامة للمنصة: العنوان، الهوية البصرية، الشعار، البريد الرسمي، وروابط التواصل",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              system_title: "منصة الجودي لإدارة الشؤون القانونية والمحاماة",
              company_name: "مجموعة الجودي للحلول التقنية والعدلية",
              company_email: "support@aljudy.sa",
              contact_phone: "+966114829900",
              logo_url: "https://law.elmoroj.com/uploads/logo.png",
              favicon_url: "https://law.elmoroj.com/uploads/favicon.ico",
              meta_description: "المنصة السحابية المتكاملة لإدارة مكاتب وشركات المحاماة",
              footer_text: "جميع الحقوق محفوظة لمنصة الجودي © 2026"
            }
          },
          usedFields: ["data.*"]
        },
        notes: "تعبئة نموذج الإعدادات العامة في لوحة التحكم."
      },
      {
        id: "SET-02",
        method: "POST",
        path: "/admin/settings/general",
        screen: "GeneralSettingsView (حفظ الإعدادات)",
        component: "@/features/settings/components/GeneralSettingsView",
        serviceCall: "src/lib/api/settings.ts -> updateGeneralSettings()",
        purpose: "تحديث الإعدادات العامة والهوية البصرية وروابط المنصة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "system_title", type: "string", required: true, validation: "اسم المنصة" },
            { field: "company_name", type: "string", required: true, validation: "اسم المنشأة المالكة" },
            { field: "company_email", type: "string", required: true, validation: "البريد الإلكتروني المعتمد" },
            { field: "contact_phone", type: "string", required: false, validation: "هاتف الدعم" },
            { field: "logo_url", type: "string", required: false, validation: "رابط الشعار" },
            { field: "footer_text", type: "string", required: false, validation: "نص التذييل" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث الإعدادات العامة للمنصة بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "يتطلب تأكيد أمني AlertDialog."
      },
      {
        id: "SET-03",
        method: "GET",
        path: "/admin/settings/server-info",
        screen: "ServerInfoView (معلومات الخادم والسيرفر)",
        component: "@/features/utility/components/ServerInfoView",
        serviceCall: "src/lib/api/settings.ts -> fetchServerInfo()",
        purpose: "فحص مواصفات الخادم: إصدار PHP، توجيهات memory_limit، max_execution_time، وتوافق البيئة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              php_version: "8.2.14",
              laravel_version: "11.0.8",
              server_software: "nginx/1.24.0",
              memory_limit: "512M",
              max_execution_time: "300",
              file_uploads: "On",
              allow_url_fopen: "On",
              db_connection: "pgsql / mariadb",
              status: "optimal"
            }
          },
          usedFields: [
            "data.php_version", "data.laravel_version", "data.server_software", "data.memory_limit",
            "data.max_execution_time", "data.file_uploads", "data.allow_url_fopen"
          ]
        },
        notes: "تقوم الواجهة بمقارنة القيم الحقيقية مع القيم الموصى بها ووضع شارات نجاح/تحذير ملونة."
      },
      {
        id: "SET-04",
        method: "GET",
        path: "/admin/settings/system-update",
        screen: "SystemUpdateView (تحديث النظام)",
        component: "@/features/utility/components/SystemUpdateView",
        serviceCall: "src/lib/api/settings.ts -> fetchSystemUpdate()",
        purpose: "استعلام حالة وتوفر تحديثات نواة النظام المركزية وسجل التغييرات",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              current_version: "v4.4.0",
              latest_version: "v4.5.0",
              update_available: true,
              release_date: "2026-11-20",
              changelog: [
                "دعم فوترة ZATCA المرحلة الثانية المتكاملة",
                "تحسين سرعة جلسات الدخول الإشرافي للمكاتب",
                "ترقية مصفوفة الصلاحيات الدقيقة"
              ]
            }
          },
          usedFields: [
            "data.current_version", "data.latest_version", "data.update_available", "data.changelog"
          ]
        },
        notes: "تظهر شارة 'تحديث جديد متاح' عند وجود إصدار أحدث."
      },
      {
        id: "SET-05",
        method: "POST",
        path: "/admin/settings/system-update",
        screen: "StartUpdateDialog (بدء ترقية النظام)",
        component: "@/features/utility/components/SystemUpdateView",
        serviceCall: "src/lib/api/settings.ts -> startSystemUpdate()",
        purpose: "بدء ترقية وتحديث نواة النظام تلقائياً وتشغيل migrations",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم بدء ترقية النظام بنجاح وتطبيق التحديثات",
            data: { version: "v4.5.0" }
          },
          usedFields: ["status", "message", "data"]
        },
        notes: "يتطلب حوار تأكيد فاخر ويدخل الواجهة في شريط تقدم حتى اكتمال الترقية."
      }
    ]
  },
  {
    id: "mail",
    name: "14. إعدادات خادم البريد (Mail / SMTP Settings)",
    description: "تهيئة بروتوكول SMTP، منافذ التشفير (TLS/SSL)، بيانات الاعتماد، وإرسال بريد تجريبي لاختبار الاتصال.",
    endpoints: [
      {
        id: "MAIL-01",
        method: "GET",
        path: "/admin/settings/mail",
        screen: "MailSettingsView",
        component: "@/features/settings/components/MailSettingsView",
        serviceCall: "src/lib/api/settings.ts -> fetchMailSettings()",
        purpose: "استعراض إعدادات SMTP وبيانات خادم البريد الصادر وهوية المرسل",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              mail_driver: "smtp",
              mail_host: "smtp.mailgun.org",
              mail_port: 587,
              mail_username: "postmaster@aljudy.sa",
              mail_encryption: "tls",
              mail_from_address: "notifications@aljudy.sa",
              mail_from_name: "منصة الجودي القانونية",
              has_password: true
            }
          },
          usedFields: [
            "data.mail_driver", "data.mail_host", "data.mail_port", "data.mail_username",
            "data.mail_encryption", "data.mail_from_address", "data.mail_from_name", "data.has_password"
          ]
        },
        notes: "يتم إخفاء كلمة مرور SMTP وإظهار مؤشر has_password."
      },
      {
        id: "MAIL-02",
        method: "POST",
        path: "/admin/settings/mail",
        screen: "MailSettingsView (حفظ إعدادات البريد)",
        component: "@/features/settings/components/MailSettingsView",
        serviceCall: "src/lib/api/settings.ts -> updateMailSettings()",
        purpose: "تحديث وحفظ إعدادات خادم البريد وبيانات الاعتماد",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "mail_driver", type: "string", required: true, validation: "smtp | sendmail | mailgun" },
            { field: "mail_host", type: "string", required: true, validation: "خادم البريد (مثل: smtp.office365.com)" },
            { field: "mail_port", type: "number", required: true, validation: "المنفذ (587 | 465 | 25)" },
            { field: "mail_username", type: "string", required: true, validation: "اسم المستخدم أو البريد" },
            { field: "mail_password", type: "string", required: false, validation: "كلمة المرور (اختيارية إذا لم تتغير)" },
            { field: "mail_encryption", type: "string", required: true, validation: "tls | ssl | null" },
            { field: "mail_from_address", type: "string", required: true, validation: "بريد المرسل الرسمي" },
            { field: "mail_from_name", type: "string", required: true, validation: "اسم المرسل" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم حفظ إعدادات خادم البريد بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "تتطلب الواجهة AlertDialog لتأكيد الحفظ."
      },
      {
        id: "MAIL-03",
        method: "POST",
        path: "/admin/settings/mail/test",
        screen: "TestEmailModal (إرسال بريد تجريبي)",
        component: "@/features/settings/components/MailSettingsView",
        serviceCall: "src/lib/api/settings.ts -> testMailSettings()",
        purpose: "إرسال بريد إلكتروني تجريبي للتأكد من صحة إعدادات SMTP ونجاح المصادقة مع الخادم",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "test_email", type: "string", required: true, validation: "البريد الإلكتروني المستلم للتجربة" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم إرسال البريد التجريبي بنجاح إلى test@aljudy.sa"
          },
          usedFields: ["status", "message"]
        },
        notes: "في حال فشل الاتصال يرجع السيرفر 422 برسالة الخطأ التقنية القادمة من خادم SMTP لتسهيل التشخيص."
      }
    ]
  },
  {
    id: "currencies",
    name: "15. العملات وأسعار الصرف (Currencies)",
    description: "إدارة العملات المدعومة في الفوترة، رموز العملات، تحديد العملة الافتراضية، ومعدلات التحويل.",
    endpoints: [
      {
        id: "CURR-01",
        method: "GET",
        path: "/admin/currencies",
        screen: "CurrencySettingsView",
        component: "@/features/settings/components/CurrencySettingsView",
        serviceCall: "src/lib/api/settings.ts -> fetchCurrencies()",
        purpose: "استعراض قائمة العملات وأسعار الصرف والعملة الافتراضية للمنصة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              { id: 1, name: "ريال سعودي", code: "SAR", symbol: "ر.س", exchange_rate: 1.0, is_default: true },
              { id: 2, name: "دولار أمريكي", code: "USD", symbol: "$", exchange_rate: 0.266, is_default: false },
              { id: 3, name: "درهم إماراتي", code: "AED", symbol: "د.إ", exchange_rate: 0.98, is_default: false }
            ]
          },
          usedFields: ["id", "name", "code", "symbol", "exchange_rate", "is_default"]
        },
        notes: "الريال السعودي هو العملة الأساسية للمنصة بحكم استهداف السوق السعودي."
      },
      {
        id: "CURR-02",
        method: "POST",
        path: "/admin/currencies",
        screen: "AddCurrencyModal",
        component: "@/features/settings/components/AddCurrencyModal",
        serviceCall: "src/lib/api/settings.ts -> createCurrency()",
        purpose: "إضافة عملة جديدة ومعدل تحويلها",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "name", type: "string", required: true, validation: "اسم العملة بالعربية" },
            { field: "code", type: "string", required: true, validation: "رمز العملة العالمي (SAR, USD...)" },
            { field: "symbol", type: "string", required: true, validation: "الرمز المختصر" },
            { field: "exchange_rate", type: "number", required: true, validation: "سعر الصرف مقابل العملة الأساسية" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تمت إضافة العملة بنجاح",
            data: { id: 4, code: "KWD" }
          },
          usedFields: ["status", "message", "data.id"]
        },
        notes: "تحديث فوري لجدول العملات."
      },
      {
        id: "CURR-03",
        method: "POST",
        path: "/admin/currencies/{currency_id}/default",
        screen: "SetDefaultCurrencyButton",
        component: "@/features/settings/components/CurrencySettingsView",
        serviceCall: "src/lib/api/settings.ts -> setDefaultCurrency()",
        purpose: "تعيين عملة كافتراضية لحسابات وفواتير النظام بالكامل",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "currency_id", type: "number | string", required: true, validation: "معرف العملة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم تعيين العملة كافتراضية للنظام بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "ينقل شارة 'افتراضية' للعملة المختارة تلقائياً."
      },
      {
        id: "CURR-04",
        method: "DELETE",
        path: "/admin/currencies/{currency_id}",
        screen: "DeleteCurrencyDialog",
        component: "@/features/settings/components/DeleteCurrencyModal",
        serviceCall: "src/lib/api/settings.ts -> deleteCurrency()",
        purpose: "حذف عملة من النظام (يمنع حذف العملة الافتراضية)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "currency_id", type: "number | string", required: true, validation: "معرف العملة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم حذف العملة بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "يرجع 422 إذا حاول المشرف حذف العملة الافتراضية."
      }
    ]
  },
  {
    id: "languages",
    name: "16. اللغات والاتجاهات (Languages)",
    description: "إدارة لغات واجهة المنصة (العربية RTL، الإنجليزية LTR)، تعيين اللغة الافتراضية، وإضافة اللغات.",
    endpoints: [
      {
        id: "LANG-01",
        method: "GET",
        path: "/admin/languages",
        screen: "LanguageSettingsView",
        component: "@/features/settings/components/LanguageSettingsView",
        serviceCall: "src/lib/api/settings.ts -> fetchLanguages()",
        purpose: "استعراض قائمة اللغات والاتجاهات المعتمدة في النظام",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              { id: 1, name: "العربية", code: "ar", direction: "rtl", is_default: true, status: "active" },
              { id: 2, name: "English", code: "en", direction: "ltr", is_default: false, status: "active" }
            ]
          },
          usedFields: ["id", "name", "code", "direction", "is_default", "status"]
        },
        notes: "اللغة العربية RTL هي اللغة الافتراضية الرسمية."
      },
      {
        id: "LANG-02",
        method: "POST",
        path: "/admin/languages",
        screen: "AddLanguageModal",
        component: "@/features/settings/components/AddLanguageModal",
        serviceCall: "src/lib/api/settings.ts -> createLanguage()",
        purpose: "إضافة لغة جديدة للنظام وتحديد اتجاهها (rtl أو ltr)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "name", type: "string", required: true, validation: "اسم اللغة" },
            { field: "code", type: "string", required: true, validation: "كود اللغة الدولي (ar, en, fr...)" },
            { field: "direction", type: "string", required: true, validation: "rtl | ltr" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تمت إضافة اللغة بنجاح",
            data: { id: 3, code: "fr" }
          },
          usedFields: ["status", "message", "data.id"]
        },
        notes: "تحديث الجدول فورياً."
      },
      {
        id: "LANG-03",
        method: "POST",
        path: "/admin/languages/{language_id}/default",
        screen: "SetDefaultLanguageButton",
        component: "@/features/settings/components/LanguageSettingsView",
        serviceCall: "src/lib/api/settings.ts -> setDefaultLanguage()",
        purpose: "تعيين لغة كافتراضية لجميع واجهات وتنبيهات المنصة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "language_id", type: "number | string", required: true, validation: "معرف اللغة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم تعيين اللغة كافتراضية للنظام بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "يغير اللغة الافتراضية للجلسات الجديدة."
      },
      {
        id: "LANG-04",
        method: "DELETE",
        path: "/admin/languages/{language_id}",
        screen: "DeleteLanguageDialog",
        component: "@/features/settings/components/DeleteLanguageModal",
        serviceCall: "src/lib/api/settings.ts -> deleteLanguage()",
        purpose: "حذف لغة من النظام (يمنع حذف اللغة الافتراضية العربية)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "language_id", type: "number | string", required: true, validation: "معرف اللغة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم حذف اللغة بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "يرجع 422 إذا كانت اللغة هي الافتراضية."
      }
    ]
  },
  {
    id: "website",
    name: "17. إدارة محتوى الموقع التعريفي والتسويقي CMS (Website Settings)",
    description: "إدارة صفحات الهبوط والموقع التعريفي الخارجي، المظهر، SEO، قسم الهيرو، المميزات، والتحكم في ظهور العناصر.",
    endpoints: [
      {
        id: "WEB-01",
        method: "GET",
        path: "/admin/website/theme",
        screen: "WebsiteSettingsView (تبويب المظهر والألوان)",
        component: "@/features/website-settings/components/tabs/ThemeOptionsTab",
        serviceCall: "src/lib/api/website.ts -> fetchWebsiteTheme()",
        purpose: "استعلام خيارات مظهر الموقع التعريفي، الألوان الرئيسية، الخطوط، والشعارات",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              primary_color: "#18243c",
              accent_color: "#9c6402",
              font_family: "Cairo",
              logo_light: "https://law.elmoroj.com/uploads/landing/logo-light.svg",
              logo_dark: "https://law.elmoroj.com/uploads/landing/logo-dark.svg"
            }
          },
          usedFields: ["data.*"]
        },
        notes: "تعبئة خيارات المظهر والألوان في واجهة الموقع التعريفي."
      },
      {
        id: "WEB-02",
        method: "POST",
        path: "/admin/website/theme",
        screen: "ThemeOptionsTab (حفظ المظهر)",
        component: "@/features/website-settings/components/tabs/ThemeOptionsTab",
        serviceCall: "src/lib/api/website.ts -> updateWebsiteTheme()",
        purpose: "تحديث خيارات مظهر الموقع التعريفي والألوان",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "primary_color", type: "string", required: true, validation: "كود اللون الأساسي Hex" },
            { field: "accent_color", type: "string", required: true, validation: "كود اللون الثانوي الذهبي" },
            { field: "font_family", type: "string", required: false, validation: "نوع الخط (Cairo | Tajawal)" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث مظهر الموقع التعريفي بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "تحديث مباشر."
      },
      {
        id: "WEB-03",
        method: "GET",
        path: "/admin/website/seo",
        screen: "WebsiteSettingsView (تبويب SEO)",
        component: "@/features/website-settings/components/tabs/SeoTab",
        serviceCall: "src/lib/api/website.ts -> fetchWebsiteSeo()",
        purpose: "إعدادات محركات البحث وميتا تاجز ووسوم المشاركة (SEO & OpenGraph)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              meta_title: "منصة الجودي | النظام السحابي الأول لإدارة مكاتب المحاماة في السعودية",
              meta_description: "إدارة متكاملة للقضايا، الموكلين، الجلسات، والفوترة المتوافقة مع هيئة الزكاة وبوابة ناجز",
              meta_keywords: "محاماة, قضايا, ناجز, ساس, فوترة إلكترونية",
              og_image: "https://law.elmoroj.com/uploads/landing/og-cover.png"
            }
          },
          usedFields: ["data.*"]
        },
        notes: "تعبئة حقول الميتا تاجز ومعاينة جوجل ومواقع التواصل في الواجهة."
      },
      {
        id: "WEB-04",
        method: "POST",
        path: "/admin/website/seo",
        screen: "SeoTab (حفظ إعدادات SEO)",
        component: "@/features/website-settings/components/tabs/SeoTab",
        serviceCall: "src/lib/api/website.ts -> updateWebsiteSeo()",
        purpose: "تحديث إعدادات محركات البحث ووسوم المشاركة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "meta_title", type: "string", required: true, validation: "عنوان الصفحة لمحركات البحث" },
            { field: "meta_description", type: "string", required: true, validation: "الوصف التعريفي" },
            { field: "meta_keywords", type: "string", required: false, validation: "الكلمات المفتاحية مفصولة بفواصل" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث إعدادات SEO بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "حفظ مباشر."
      },
      {
        id: "WEB-05",
        method: "GET",
        path: "/admin/website/hero",
        screen: "WebsiteSettingsView (تبويب قسم الهيرو)",
        component: "@/features/website-settings/components/tabs/HeroSectionTab",
        serviceCall: "src/lib/api/website.ts -> fetchWebsiteHero()",
        purpose: "استعلام بيانات قسم البداية (Hero Section) والعناوين والأزرار الترويجية",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              badge_text: "المنظومة السحابية الأقوى لمكاتب المحاماة",
              main_title: "أدر مكتب محاماتك بكفاءة وذكاء مع منصة الجودي",
              subtitle: "حلول رقمية متكاملة لربط الجلسات، إدارة التوكيلات، والفوترة الإلكترونية",
              primary_cta_text: "ابدأ تجربتك المجانية",
              primary_cta_link: "/register",
              secondary_cta_text: "احجز جلسة استعراضية",
              secondary_cta_link: "/contact"
            }
          },
          usedFields: ["data.*"]
        },
        notes: "تعبئة حقول قسم البداية والمحاكاة المباشرة له في الواجهة."
      },
      {
        id: "WEB-06",
        method: "POST",
        path: "/admin/website/hero",
        screen: "HeroSectionTab (حفظ قسم الهيرو)",
        component: "@/features/website-settings/components/tabs/HeroSectionTab",
        serviceCall: "src/lib/api/website.ts -> updateWebsiteHero()",
        purpose: "تحديث نصوص وأزرار قسم الهيرو في الموقع التعريفي",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "main_title", type: "string", required: true, validation: "العنوان الرئيسي" },
            { field: "subtitle", type: "string", required: true, validation: "العنوان الفرعي" },
            { field: "primary_cta_text", type: "string", required: true, validation: "نص الزر الأساسي" },
            { field: "primary_cta_link", type: "string", required: true, validation: "رابط الزر" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث قسم البداية (Hero) بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "حفظ مباشر."
      },
      {
        id: "WEB-07",
        method: "GET",
        path: "/admin/website/sections/features",
        screen: "WebsiteSettingsView (تبويب المميزات)",
        component: "@/features/website-settings/components/tabs/FeaturesTab",
        serviceCall: "src/lib/api/website.ts -> fetchWebsiteFeatures()",
        purpose: "استعراض عناصر ومميزات الموقع التعريفي وحالات تفعيلها",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              {
                id: 1,
                title: "الربط الآمن مع بوابة ناجز",
                description: "مزامنة تلقائية للجلسات والقرارات الصادرة ومواعيد المحاكم",
                icon: "shield-check",
                is_active: true
              }
            ]
          },
          usedFields: ["id", "title", "description", "icon", "is_active"]
        },
        notes: "تعرض في بطاقات قابلة للتعديل والتبديل."
      },
      {
        id: "WEB-08",
        method: "POST",
        path: "/admin/website/sections/features",
        screen: "AddFeatureModal",
        component: "@/features/website-settings/components/tabs/FeaturesTab",
        serviceCall: "src/lib/api/website.ts -> createWebsiteFeature()",
        purpose: "إضافة عنصر مميزات جديد للموقع التعريفي",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [],
          body: [
            { field: "title", type: "string", required: true, validation: "عنوان الميزة" },
            { field: "description", type: "string", required: true, validation: "شرح الميزة" },
            { field: "icon", type: "string", required: false, validation: "اسم الأيقونة من Lucide" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تمت إضافة الميزة بنجاح للموقع التعريفي",
            data: { id: 8 }
          },
          usedFields: ["status", "message", "data.id"]
        },
        notes: "تحديث فوري."
      },
      {
        id: "WEB-09",
        method: "PATCH",
        path: "/admin/website/items/{id}/toggle",
        screen: "ToggleItemStatusSwitch",
        component: "@/features/website-settings/components/tabs/FeaturesTab",
        serviceCall: "src/lib/api/website.ts -> toggleWebsiteItem()",
        purpose: "تفعيل أو تعطيل عنصر في الموقع التعريفي (إظهار / إخفاء من الصفحة)",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "id", type: "number | string", required: true, validation: "معرف العنصر" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم تحديث حالة ظهور العنصر بنجاح",
            data: { id: 1, is_active: false }
          },
          usedFields: ["status", "message", "data.is_active"]
        },
        notes: "تبديل سريع لحالة العرض."
      },
      {
        id: "WEB-10",
        method: "DELETE",
        path: "/admin/website/items/{id}",
        screen: "DeleteWebsiteItemDialog",
        component: "@/features/website-settings/components/tabs/FeaturesTab",
        serviceCall: "src/lib/api/website.ts -> deleteWebsiteItem()",
        purpose: "حذف عنصر من الموقع التعريفي",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "id", type: "number | string", required: true, validation: "معرف العنصر" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم حذف العنصر بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "حذف نهائي."
      }
    ]
  },
  {
    id: "impersonation",
    name: "18. المعاينة الإشرافية وسجلات الدخول كالمكتب (Supervisory Impersonation & Audit)",
    description: "آلية الدخول الإشرافي المباشر بدون كلمة مرور لحساب رئيس المكتب (Login As Firm)، وتتبع سجلات المعاينة.",
    endpoints: [
      {
        id: "IMP-01",
        method: "POST",
        path: "/admin/utility/login-as-firm/{firm_id}",
        screen: "ClientRowActionMenu / EnterOfficeConfirmModal",
        component: "@/features/clients/components/EnterOfficeConfirmModal",
        serviceCall: "src/lib/api/impersonation.ts -> issueFirmImpersonation()",
        purpose: "بدء جلسة معاينة إشرافية وتوليد رمز جلسة Sanctum فوري باسم رئيس المكتب للمعاينة المباشرة للوحة تحكم المكتب",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>", "Content-Type: application/json"],
          params: [
            { field: "firm_id", type: "number | string", required: true, validation: "معرف المكتب المراد معاينته" }
          ],
          body: [
            { field: "activity_type", type: "string", required: false, validation: "نوع الإجراء الإشرافي (support | audit | settings | subscription | other)" },
            { field: "reason", type: "string", required: false, validation: "سبب الدخول للمكتب لتوثيقه في السجل الأمني" },
            { field: "ticket_id", type: "string | number", required: false, validation: "رقم تذكرة الدعم الفني المرتبطة إن وجدت" }
          ]
        },
        response: {
          example: {
            status: true,
            message: "تم بدء جلسة المعاينة بنجاح لمكتب: شركة العجلان",
            data: {
              token: "3|sanctum_lawyer_session_token_xyz",
              expires_in: 90,
              user: {
                id: 186,
                company_id: 96,
                full_name: "د. خالد عبد العزيز العجلان",
                email: "contact@alajlan-law.sa",
                role: "owner",
                status: "active"
              },
              firm: { id: 96, name: "شركة العجلان وشركاؤه للمحاماة" },
              preview_banner: {
                active: true,
                message: "أنت الآن في وضع المعاينة المباشرة لمكتب: شركة العجلان"
              },
              impersonated_by: 1,
              log_id: 10
            }
          },
          usedFields: [
            "data.token (يستخدم لتحويل المشرف لبوابة المكتب lawyer/login)",
            "data.user (بيانات مالك المكتب)",
            "data.firm (بيانات المنشأة)",
            "data.preview_banner (شريط التنبيه الأمني العلوي في تطبيق المحامي)"
          ]
        },
        notes: "نقطة حيوية جداً تمثل جسر الانتقال بين لوحة Super Admin وتطبيق Lawyer Office بدون الحاجة لكلمة مرور العميل."
      },
      {
        id: "IMP-02",
        method: "POST",
        path: "/admin/utility/end-preview",
        screen: "PreviewBanner (إنهاء المعاينة والرجوع لحسابي)",
        component: "@/components/shared/ImpersonationBanner",
        serviceCall: "src/lib/api/impersonation.ts -> endFirmImpersonation()",
        purpose: "إنهاء وضع المعاينة الإشرافية وإبطال الرمز المؤقت والعودة للوحة الإدارة العليا",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم إنهاء وضع المعاينة والعودة الكاملة للوحة الإدارة العليا بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "تستدعى عند ضغط زر 'إنهاء المعاينة والرجوع لحسابي' من الشريط العلوي."
      },
      {
        id: "IMP-03",
        method: "GET",
        path: "/admin/impersonation-logs",
        screen: "ImpersonationLogsView (سجل جلسات الدخول الإشرافي)",
        component: "@/features/impersonation-logs/components/ImpersonationLogsView",
        serviceCall: "src/lib/api/impersonation.ts -> fetchImpersonationLogs()",
        purpose: "استعراض سجلات جلسات الدخول الإشرافي السابقة والحالية، المشرف القائم بالدخول، السبب، والمدة",
        status: "partial",
        statusLabel: "🟡 موجود بالواجهة ويعتمد Fallback على audit-logs لحين اعتماد الباك اند",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "page", type: "number", required: false, validation: "رقم الصفحة (افتراضي 1)" },
            { field: "per_page", type: "number", required: false, validation: "عدد السجلات (افتراضي 10)" },
            { field: "status", type: "string", required: false, validation: "active | ended | all" },
            { field: "from_date", type: "string", required: false, validation: "تاريخ البدء YYYY-MM-DD" },
            { field: "to_date", type: "string", required: false, validation: "تاريخ الانتهاء YYYY-MM-DD" },
            { field: "search", type: "string", required: false, validation: "بحث باسم المشرف، المكتب، أو التذكرة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              current_page: 1,
              total: 28,
              data: [
                {
                  id: "sess-10",
                  admin_id: 1,
                  admin_name: "م. عبد الله المشرف",
                  company_id: 96,
                  firm_name: "شركة العجلان وشركاؤه للمحاماة",
                  activity_type: "support",
                  activity_type_label: "دعم فني وحل مشكلة تذكرة",
                  reason: "متابعة تذكرة مزامنة أحكام ناجز #TCK-045",
                  ticket_id: "TCK-045",
                  ip_address: "192.168.1.100",
                  started_at: "2026-11-21T09:30:00Z",
                  ended_at: null,
                  duration_minutes: 45,
                  status: "active"
                }
              ]
            }
          },
          usedFields: [
            "id", "admin_name", "firm_name", "activity_type_label", "reason", "ticket_id",
            "ip_address", "started_at", "ended_at", "status", "duration_minutes"
          ]
        },
        notes: "مطلوب رسمياً من الباك اند كمسار مستقل لتوثيق الأمن السيبراني وتفادي اللجوء للتخزين المحلي."
      },
      {
        id: "IMP-04",
        method: "GET",
        path: "/admin/impersonation-logs/{id}",
        screen: "ImpersonationLogDetailsModal",
        component: "@/features/impersonation-logs/components/ImpersonationLogDetailsModal",
        serviceCall: "src/lib/api/impersonation.ts -> fetchImpersonationLogDetails()",
        purpose: "استعلام تفاصيل كاملة لجلسة معاينة محددة والإجراءات المتخذة خلالها",
        status: "partial",
        statusLabel: "🟡 معتمد في الواجهة ومطلوب توفيره رسمياً من الباك اند",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "id", type: "number | string", required: true, validation: "معرف جلسة المعاينة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              id: "sess-10",
              admin_name: "م. عبد الله المشرف",
              firm_name: "شركة العجلان للمحاماة",
              reason: "معالجة التذكرة",
              started_at: "2026-11-21T09:30:00Z",
              status: "active"
            }
          },
          usedFields: ["data.*"]
        },
        notes: "تعبئة نافذة تفاصيل الجلسة الإشرافية."
      },
      {
        id: "IMP-05",
        method: "POST",
        path: "/admin/impersonation-logs/{id}/end",
        screen: "ImpersonationLogDetailsModal (إنهاء الجلسة فورياً)",
        component: "@/features/impersonation-logs/components/ImpersonationLogDetailsModal",
        serviceCall: "src/lib/api/impersonation.ts -> endImpersonationSession()",
        purpose: "إنهاء فوري لجلسة إشرافية نشطة وإبطال الرمز الصادر لها من قاعدة البيانات",
        status: "partial",
        statusLabel: "🟡 معتمد في الواجهة ومطلوب توفيره رسمياً من الباك اند",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "id", type: "number | string", required: true, validation: "معرف الجلسة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            message: "تم إنهاء الجلسة الإشرافية وإبطال الرمز بنجاح"
          },
          usedFields: ["status", "message"]
        },
        notes: "يتيح لمدير النظام قطع أي جلسة معاينة نشطة فورياً لأسباب أمنية."
      },
      {
        id: "IMP-06",
        method: "GET",
        path: "/admin/impersonation-logs/{id}/report",
        screen: "ImpersonationLogDetailsModal (نسخ تقرير التدقيق)",
        component: "@/features/impersonation-logs/components/ImpersonationLogDetailsModal",
        serviceCall: "src/lib/api/impersonation.ts -> fetchImpersonationSessionReport()",
        purpose: "استخراج تقرير التدقيق الأمني وملخص النشاط لجلسة الدخول الإشرافي بصيغة مهيأة للطباعة",
        status: "partial",
        statusLabel: "🟡 معتمد في الواجهة ومطلوب توفيره رسمياً من الباك اند",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "id", type: "number | string", required: true, validation: "معرف الجلسة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: {
              session_id: "sess-10",
              report_summary: "جلسة معاينة دعم فني لمكتب شركة العجلان نفذت بواسطة م. عبد الله المشرف...",
              actions_count: 4,
              generated_at: "2026-11-21T10:15:00Z"
            }
          },
          usedFields: ["data.report_summary"]
        },
        notes: "يوفر نص تقرير التدقيق لنسخه بضغطة زر وتصديره للإدارة القانونية."
      },
      {
        id: "IMP-07",
        method: "GET",
        path: "/users?company_id={company_id}",
        screen: "ClientOfficeDetailsView / EnterOffice Flow",
        component: "@/features/clients/components/ClientOfficeDetailsView",
        serviceCall: "src/lib/api/users.ts -> fetchUsersByCompany()",
        purpose: "جلب مستخدمي المكتب لتحديد حساب المالك (role: owner) في حال تعذر جلبه من نقطة المعاينة",
        status: "wired",
        statusLabel: "✅ مربوط ومختبر في الواجهة",
        request: {
          headers: ["Authorization: Bearer <admin_token>"],
          params: [
            { field: "company_id", type: "number | string", required: true, validation: "معرف منشأة المحاماة" }
          ],
          body: []
        },
        response: {
          example: {
            status: true,
            data: [
              {
                id: 186,
                company_id: 96,
                full_name: "د. خالد عبد العزيز العجلان",
                email: "contact@alajlan-law.sa",
                phone: "+966501234567",
                role: "owner",
                status: "active"
              }
            ]
          },
          usedFields: ["id", "full_name", "email", "phone", "role", "status"]
        },
        notes: "يضمن التحقق التام من هوية مالك المكتب قبل بدء المعاينة."
      }
    ]
  }
];

export const newApis = [
  {
    id: "NEW-01",
    title: "واجهات سجلات الدخول الإشرافي (Supervisory Impersonation Audit Logs)",
    purpose: "توثيق وتتبع كل عملية دخول إشرافي ينفذها مشرف عام على حسابات مكاتب المحاماة في قاعدة البيانات لحماية الخصوصية والامتثال لمعايير الأمن السيبراني وحماية البيانات الشخصية.",
    screen: "ImpersonationLogsView (صفحة سجلات تسجيل الدخول كعميل - /impersonation-logs)",
    priority: "عالية جداً (أولوية قصوى)",
    endpoints: [
      { method: "GET", path: "/admin/impersonation-logs", description: "جلب قائمة جلسات المعاينة مع الفلترة بالبحث، الحالة (نشط/منتهي)، والتاريخ" },
      { method: "GET", path: "/admin/impersonation-logs/{id}", description: "تفاصيل جلسة محددة والإجراءات المأخوذة خلالها" },
      { method: "POST", path: "/admin/impersonation-logs/{id}/end", description: "إنهاء فوري لجلسة معاينة نشطة وإبطال توكن الدخول الصادر لها" },
      { method: "GET", path: "/admin/impersonation-logs/{id}/report", description: "استخراج ملخص تقرير التدقيق الأمني للجلسة" }
    ],
    requestPayload: {
      activity_type: "string (support | audit | settings | subscription | other)",
      reason: "string (إجباري - سبب الدخول للمكتب)",
      ticket_id: "string | null (اختياري - رقم تذكرة الدعم ذات الصلة)"
    },
    responsePayload: {
      status: true,
      data: {
        id: "number | string",
        admin_id: "number",
        admin_name: "string",
        company_id: "number",
        firm_name: "string",
        activity_type: "string",
        reason: "string",
        ticket_id: "string | null",
        started_at: "ISO DateTime",
        ended_at: "ISO DateTime | null",
        status: "active | ended",
        duration_minutes: "number"
      }
    },
    notes: "حالياً تضطر الواجهة لاستخدام audit-logs أو localStorage كحل بديل مؤقت لعدم توفر جدول ومسارات مخصصة في الباك اند."
  },
  {
    id: "NEW-02",
    title: "مزامنة موظفي الإدارة مع حسابات الدخول (Staff <-> Sanctum Login Auto-Provisioning)",
    purpose: "تمكين الموظف الذي تتم إضافته في POST /admin/staff من تسجيل الدخول مباشرة عبر /login بصلاحية 'staff' أو 'admin' باستخدام كلمة المرور التي حُددت له.",
    screen: "StaffManagementView / AddStaffModal",
    priority: "عالية جداً (أولوية قصوى)",
    endpoints: [
      { method: "POST", path: "/admin/staff", description: "تعديل النقطة لتقوم آلياً بإنشاء سجل مطابق في جدول users أو ربطه بـ Sanctum" }
    ],
    requestPayload: {
      name: "string",
      emp_code: "string",
      email: "string",
      phone: "string",
      password: "string",
      department_id: "number",
      role_id: "number",
      status: "active | suspended"
    },
    responsePayload: {
      status: true,
      message: "تم إنشاء حساب الموظف وتفعيل بيانات تسجيل الدخول بنجاح",
      data: {
        id: 14,
        user_id: 205,
        name: "راكان الحارثي",
        email: "r.alharbi@aljudy.sa",
        can_login: true
      }
    },
    notes: "حالياً تضطر الواجهة لتنفيذ استدعاء إضافي لـ POST /users تحت شركة وهمية STAFF_LOGIN_COMPANY_ID كحل التفافي."
  },
  {
    id: "NEW-03",
    title: "واجهة المسودات المركزية (Central Drafts Sync API)",
    purpose: "حفظ ومزامنة المسودات المحفوظة من نماذج الإشعارات، باقات التسعير، الصلاحيات، الموظفين، والاشتراكات في قاعدة البيانات لاستئنافها من أي جهاز.",
    screen: "DraftsManagementView (صفحة المسودات المركزية - /drafts)",
    priority: "متوسطة",
    endpoints: [
      { method: "GET", path: "/admin/drafts", description: "جلب المسودات المحفوظة الخاصة بالمشرف الحالي" },
      { method: "POST", path: "/admin/drafts", description: "حفظ أو تحديث مسودة" },
      { method: "DELETE", path: "/admin/drafts/{id}", description: "حذف مسودة محددة" },
      { method: "DELETE", path: "/admin/drafts", description: "حذف كافة المسودات" }
    ],
    requestPayload: {
      type: "string (announcement | plan | role | staff | subscription)",
      title: "string (عنوان المسودة)",
      data: "object (البيانات المدخلة في النموذج لحفظها)"
    },
    responsePayload: {
      status: true,
      data: [
        {
          id: "draft-01",
          type: "announcement",
          title: "مسودة إشعار صيانة ناجز",
          data: { title: "تنبيه هام", content: "..." },
          updated_at: "2026-11-21T10:00:00Z"
        }
      ]
    },
    notes: "الواجهة حالياً تخزن المسودات في localStorage عبر Zustand Store."
  },
  {
    id: "NEW-04",
    title: "أقسام الموقع التعريفي CMS المتبقية (Remaining Website Sections APIs)",
    purpose: "توفير واجهات CRUD لإدارة محتوى الأقسام الأخرى المعروضة في شاشة إعدادات الموقع التعريفي.",
    screen: "WebsiteSettingsView (/website-settings)",
    priority: "متوسطة",
    endpoints: [
      { method: "GET / POST", path: "/admin/website/sections/use-cases", description: "حالات الاستخدام (Use Cases Tab)" },
      { method: "GET / POST", path: "/admin/website/sections/partner-logos", description: "شعارات الشركاء والجهات الحكومية (Partner Logos Tab)" },
      { method: "GET / POST", path: "/admin/website/sections/story", description: "قصة ورؤية المنصة (Story Tab)" },
      { method: "GET / POST", path: "/admin/website/sections/unique-features", description: "المميزات الحصرية والفريدة (Unique Features Tab)" },
      { method: "GET / POST", path: "/admin/website/sections/ai-chat", description: "معاينة المساعد القضائي الذكي (AI Chat Tab)" },
      { method: "GET / POST", path: "/admin/website/navigation", description: "روابط القائمة العلوية والتذييل (Nav & Footer Links Tab)" }
    ],
    requestPayload: {
      title: "string",
      content: "string | object",
      order: "number",
      is_active: "boolean"
    },
    responsePayload: {
      status: true,
      data: "array | object"
    },
    notes: "الواجهة تعرض بيانات أولية (initialWebsiteSettings.ts) لحين بناء واجهات الباك اند لهذه الأقسام."
  }
];

export const hardcodedDataGaps = [
  {
    page: "صفحة المسودات المركزية (/drafts)",
    component: "DraftsManagementView",
    currentSource: "localStorage عبر Zustand (useDraftsStore)",
    neededApi: "GET/POST/DELETE /admin/drafts",
    impact: "المسودات محصورة على متصفح المشرف فقط وتفقد عند تغيير المتصفح أو مسح الكاش."
  },
  {
    page: "سجل تسجيل الدخول كعميل (/impersonation-logs)",
    component: "ImpersonationLogsView",
    currentSource: "الذاكرة المحلية مع Fallback على /admin/audit-logs",
    neededApi: "GET /admin/impersonation-logs",
    impact: "غياب سجل تدقيق أمني مركزي موحد لمعاينات مكاتب المحاماة على السيرفر."
  },
  {
    page: "إعدادات الموقع التعريفي (/website-settings)",
    component: "تبويبات: Use Cases, Partner Logos, Story, AI Chat, Nav Links",
    currentSource: "ملف البيانات الثابتة initialWebsiteSettings.ts",
    neededApi: "GET/POST /admin/website/sections/*",
    impact: "أي تعديل يجريه المشرف على هذه التبويبات لا يتم حفظه على الخادم في الوقت الحالي."
  },
  {
    page: "باقة النخبة غير المحدودة في الباقات (/plans)",
    component: "PlansView / UNLIMITED_VIP_PLAN",
    currentSource: "كائن ثابت في plans.ts كباقة VIP للعملاء الكبار",
    neededApi: "دعم نوع type: 'unlimited' في جدول الباقات في الباك اند",
    impact: "تظهر في الواجهة لكنها غير مسجلة في جدول الباقات الأساسي بالباك اند."
  }
];

export const requiredModifications = [
  {
    id: "MOD-01",
    title: "توحيد مغلف الـ Pagination لجميع قوائم الجداول (Standard Pagination Envelope)",
    currentBehavior: "بعض النقاط ترجع مصفوفة مباشرة data: [...] وأخرى ترجع data: { current_page, data: [...], total, per_page, last_page }.",
    requiredChange: "توحيد شكل الـ Pagination Envelope لجميع الـ GET القوائم: (المكاتب، الاشتراكات، الموظفين، التذاكر، الفواتير، الإعلانات، سجلات التدقيق).",
    recommendedShape: "{\n  \"status\": true,\n  \"message\": \"...\",\n  \"data\": {\n    \"current_page\": 1,\n    \"data\": [ ... ],\n    \"total\": 142,\n    \"per_page\": 10,\n    \"last_page\": 15\n  }\n}"
  },
  {
    id: "MOD-02",
    title: "دعم معايير الفلترة والبحث الشاملة (Search & Filter Query Params)",
    currentBehavior: "بعض نقاط الـ API لا تستجيب لبارامترات search أو date ranges في الـ Backend.",
    requiredChange: "تفعيل بارامترات: search (بحث نصي في الاسم، الترخيص، البريد، الهاتف)، status (فلترة الحالة)، from_date و to_date لجميع الجداول ذات الطابع الزمني.",
    recommendedShape: "?search=العجلان&status=active&from_date=2026-01-01&to_date=2026-12-31&page=1&per_page=10"
  },
  {
    id: "MOD-03",
    title: "تنسيق أخطاء التحقق من المدخلات (422 Unprocessable Content Validation Errors)",
    currentBehavior: "في بعض الأحيان يرجع الباك اند خطأ 500 عام بدلاً من 422 عند تكرار البريد أو الهاتف أو رقم الترخيص.",
    requiredChange: "إرجاع رمز 422 مع كائن errors مفصل يربط الخطأ باسم الحقل بدقة لعرضه للمستخدم باللغة العربية تحت الحقل المعني مباشرة.",
    recommendedShape: "{\n  \"status\": false,\n  \"message\": \"البيانات المدخلة غير صالحة\",\n  \"errors\": {\n    \"email\": [\"البريد الإلكتروني مسجل مسبقاً لمكتب آخر\"],\n    \"license_number\": [\"رقم الترخيص العدلي مستخدم بالفعل\"]\n  }\n}"
  },
  {
    id: "MOD-04",
    title: "دعم رفع الملفات والشعارات عبر Multipart Form Data",
    currentBehavior: "نقاط مثل إضافة مكتب أو تحديث إعدادات عامة تتوقع روابط نصوص Base64 أو URL للشعارات.",
    requiredChange: "دعم رفع ملفات الصور والمستندات (PNG, JPG, PDF) عبر Multipart/form-data وتوليد مسارات تخزين سحابية آمنة في الـ S3 أو التخزين المحلي.",
    recommendedShape: "Content-Type: multipart/form-data مع استقبال حقول الملفات مثل logo, avatar, attachments[]"
  }
];

export const backendQuestions = [
  {
    num: 1,
    topic: "آلية ربط موظفي طاقم الإدارة (admin/staff) مع جدول users لتسجيل الدخول",
    question: "عند إنشاء موظف جديد عبر POST /admin/staff، هل يقوم السيرفر بإنشاء حساب في جدول users يمكنه تسجيل الدخول عبر /login مباشرة بدور admin أو staff؟ أم أن هناك خطوة ربط أو تفعيل إضافية مطلوبة من جهة الباك اند؟"
  },
  {
    num: 2,
    topic: "عزل جلسات المعاينة الإشرافية (Supervisory Preview Scoping)",
    question: "عند توليد توكن الدخول كالمكتب عبر POST /admin/utility/login-as-firm/{id}، هل التوكن يملك صلاحيات كاملة مثل المالك الحقيقي؟ وهل العمليات التي ينفذها المشرف داخل مكتب المحامي أثناء وضع المعاينة تسجل كـ audit log خاص بالمشرف أم باسم مالك المكتب؟"
  },
  {
    num: 3,
    topic: "مسار استلام إشعارات الدفع (Payment Webhook Endpoints)",
    question: "ما هي المسارات المعتمدة في الباك اند لاستقبال إشعارات الويب هوك (Webhooks) من بوابات الدفع (Stripe Webhook, Tap Webhook) لتحديث حالة الاشتراكات والفواتير تلقائياً فور نجاح الدفع؟"
  },
  {
    num: 4,
    topic: "سياسة الحذف لمكاتب المحاماة والاشتراكات (Soft Delete vs Cascade)",
    question: "عند استدعاء DELETE /admin/firms/{id}، هل تطبق المنظومة الحذف المرن (Soft Delete) مع الاحتفاظ بالفواتير والبيانات العدلية للأغراض النظامية والضريبية، أم يتم الحذف النهائي؟ وما هي القيود التي تمنع الحذف؟"
  },
  {
    num: 5,
    topic: "الحدود القصوى لحجم الملفات المرفقة بالتذاكر والإعلانات",
    question: "ما هو الحد الأقصى لحجم الملفات المسموح برفعها في تذاكر الدعم الفني والإعلانات المركزية والشعارات (مثل: 10MB لكل مرفق)، وما هي الامتدادات المعتمدة من جدار الحماية (WAF)؟"
  }
];
