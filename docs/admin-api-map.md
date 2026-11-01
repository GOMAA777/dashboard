# Super Admin API Map

Source of truth: Postman collection **SaaS Super Admin Management API (منصة الجودي)**  
Collection ID: `50014550-9c31e88e-4fa7-4646-9e4b-0682ac23b57d`  
Cached export saved at `docs/postman-super-admin-collection.json` (live Postman MCP still returns Invalid API Key after `mcp_auth`).  
Lawyer collection `50014550-62b8c9a7-67d7-4f6d-8104-6e46c4e41342` was **not** available via MCP or workspace export.

## Connection

| Item | Value |
|------|-------|
| Collection base_url | `http://127.0.0.1:8000/api` |
| Production / .env | `https://law.elmoroj.com/api` |
| Auth | `Authorization: Bearer <admin_token>` |
| Login (live-verified, **not in collection**) | `POST /login` body `{ "login", "password", "role" }` — accepted roles include `admin`, `owner`, `lawyer` |

## Endpoint → screen status

| # | Method | Path | Auth | Request body | Response | Purpose | UI screen / button | Status |
|---|--------|------|------|--------------|----------|---------|--------------------|--------|
| 1 | GET | `/admin/dashboard` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | إحصائيات المنصة، الإيرادات، توزيع الباقات، أحدث المكاتب، وملخص الدعم الفني | DashboardHomeView / الرئيسية | wired |
| 2 | GET | `/admin/firms/stats` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. إحصائيات المكاتب (KPIs) | ClientKpiMetrics | wired |
| 3 | GET | `/admin/firms` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 02. قائمة مكاتب المحاماة (مع الفلترة والبحث) | ClientKpiMetrics | wired |
| 4 | POST | `/admin/firms` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 03. إضافة مكتب محاماة جديد (Step 1 + Step 2) | ClientKpiMetrics | wired |
| 5 | GET | `/admin/firms/{{firm_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 04. عرض الملف الكامل للمكتب وتفاصيل الاستهلاك | ClientKpiMetrics | wired |
| 6 | PUT | `/admin/firms/{{firm_id}}` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 05. تحديث بيانات مكتب محاماة | ClientKpiMetrics | wired |
| 7 | PATCH | `/admin/firms/{{firm_id}}/status` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 06. تعطيل مؤقت / تفعيل حساب المكتب | ClientKpiMetrics | wired |
| 8 | POST | `/admin/firms/{{firm_id}}/notes` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 07. إضافة ملاحظة داخلية خاصة بفريق العمل على المكتب | ClientKpiMetrics | wired |
| 9 | DELETE | `/admin/firms/{{firm_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 08. حذف المكتب نهائياً من المنظومة | ClientKpiMetrics | wired |
| 10 | GET | `/admin/plans/stats` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. إحصائيات الباقات والـ MRR | PlansView / CreatePlanView | wired |
| 11 | GET | `/admin/plans` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 02. استعراض كافة الباقات والأسعار | PlansView / CreatePlanView | wired |
| 12 | POST | `/admin/plans` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 03. إنشاء باقة اشتراك جديدة (4 خطوات فيجما) | PlansView / CreatePlanView | wired |
| 13 | GET | `/admin/plans/{{plan_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 04. تفاصيل الباقة المحددة | PlansView / CreatePlanView | wired |
| 14 | PUT | `/admin/plans/{{plan_id}}` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 05. تعديل بيانات الباقة والأسعار | PlansView / CreatePlanView | wired |
| 15 | PATCH | `/admin/plans/{{plan_id}}/status` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 06. تغيير حالة الباقة (تفعيل / تعطيل الباقة) | PlansView / CreatePlanView | wired |
| 16 | GET | `/admin/plans/{{plan_id}}/subscribers` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 07. استعراض المكاتب المشتركة في هذه الباقة | PlansView / CreatePlanView | wired |
| 17 | DELETE | `/admin/plans/{{plan_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 08. حذف الباقة (مع فحص منع الحذف إذا وجد مشتركون) | PlansView / CreatePlanView | wired |
| 18 | GET | `/admin/subscriptions/stats` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. إحصائيات الاشتراكات والتجديدات القريبة | SubscriptionManagementView | wired |
| 19 | GET | `/admin/subscriptions` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 02. قائمة الاشتراكات (الكل / نشطة / قيد الانتظار / منتهية) | SubscriptionManagementView | wired |
| 20 | GET | `/admin/subscriptions/{{subscription_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 03. عرض تفاصيل الاشتراك (نشط / قيد الانتظار / مرفوض / ملغي) | SubscriptionManagementView | wired |
| 21 | POST | `/admin/subscriptions/{{subscription_id}}/approve` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 04. الموافقة وتفعيل طلب الاشتراك قيد الانتظار | SubscriptionManagementView | wired |
| 22 | POST | `/admin/subscriptions/{{subscription_id}}/reject` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 05. رفض طلب الاشتراك مع تسجيل السبب | SubscriptionManagementView | wired |
| 23 | POST | `/admin/subscriptions/{{subscription_id}}/renew` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 06. تجديد اشتراك المكتب وإصدار فاتورة إلكترونية | SubscriptionManagementView | wired |
| 24 | POST | `/admin/subscriptions/{{subscription_id}}/upgrade` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 07. ترقية اشتراك المكتب لباقة أعلى | SubscriptionManagementView | wired |
| 25 | POST | `/admin/subscriptions/{{subscription_id}}/cancel` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 08. إلغاء اشتراك المكتب وإيقاف التجديد التلقائي | SubscriptionManagementView | wired |
| 26 | PATCH | `/admin/subscriptions/{{subscription_id}}/status` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 09. تغيير حالة الاشتراك يدوياً | SubscriptionManagementView | wired |
| 27 | GET | `/admin/staff/stats` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. إحصائيات طاقم العمل وتواجد اليوم | StaffManagementView | wired |
| 28 | GET | `/admin/staff` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 02. قائمة الموظفين والمشرفين | StaffManagementView | wired |
| 29 | POST | `/admin/staff` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 03. إضافة موظف جديد لطاقم الإدارة | StaffManagementView | wired |
| 30 | GET | `/admin/staff/{{staff_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 04. تفاصيل الموظف والصلاحيات والتذاكر المسندة | StaffManagementView | wired |
| 31 | PUT | `/admin/staff/{{staff_id}}` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 05. تحديث بيانات الموظف | StaffManagementView | wired |
| 32 | PATCH | `/admin/staff/{{staff_id}}/status` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 06. إيقاف / تفعيل حساب الموظف | StaffManagementView | wired |
| 33 | POST | `/admin/staff/{{staff_id}}/reset-password` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 07. إعادة تعيين كلمة المرور للموظف | StaffManagementView | wired |
| 34 | POST | `/admin/staff/{{staff_id}}/impersonate` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 08. الدخول كالموظف (Impersonate Token) | StaffManagementView | wired |
| 35 | DELETE | `/admin/staff/{{staff_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 09. حذف حساب الموظف | StaffManagementView | wired |
| 36 | GET | `/admin/roles/stats` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. إحصائيات الأدوار ومصفوفة الصلاحيات | RolesManagementView | wired |
| 37 | GET | `/admin/roles/permissions` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 02. دليل وصلاحيات النظام المتاحة بالكامل | RolesManagementView | wired |
| 38 | GET | `/admin/roles` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 03. قائمة الأدوار الوظيفية | RolesManagementView | wired |
| 39 | POST | `/admin/roles` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 04. إضافة دور وظيفي جديد | RolesManagementView | wired |
| 40 | GET | `/admin/roles/{{role_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 05. عرض بيانات وصلاحيات الدور | RolesManagementView | wired |
| 41 | PUT | `/admin/roles/{{role_id}}` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 06. تعديل الصلاحيات الممنوحة للدور | RolesManagementView | wired |
| 42 | POST | `/admin/roles/{{role_id}}/reassign-staff` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 07. إعادة تعيين الموظفين لدور آخر تمهيداً لحذف الدور | RolesManagementView | wired |
| 43 | DELETE | `/admin/roles/{{role_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 08. حذف الدور الوظيفي (مع حماية الأدوار المحمية وارتباط الموظفين) | RolesManagementView | wired |
| 44 | GET | `/admin/departments` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. قائمة الأقسام | TicketsView تبويب الأقسام | wired |
| 45 | POST | `/admin/departments` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 02. إضافة قسم جديد | TicketsView تبويب الأقسام | wired |
| 46 | GET | `/admin/departments/1` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 03. عرض تفاصيل القسم | TicketsView تبويب الأقسام | wired |
| 47 | PUT | `/admin/departments/1` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 04. تحديث بيانات القسم | TicketsView تبويب الأقسام | wired |
| 48 | DELETE | `/admin/departments/1` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 05. حذف القسم | TicketsView تبويب الأقسام | wired |
| 49 | GET | `/admin/tickets/stats` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. إحصائيات تذاكر الدعم ونسب الرضا | TicketsView | wired |
| 50 | GET | `/admin/tickets` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 02. استعراض قائمة التذاكر (فلترة بالأولوية والحالة) | TicketsView | wired |
| 51 | POST | `/admin/tickets` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 03. إنشاء تذكرة دعم فني جديدة | TicketsView | wired |
| 52 | GET | `/admin/tickets/{{ticket_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 04. تفاصيل التذكرة وسجل المحادثة والملاحظات الداخلية | TicketsView | wired |
| 53 | POST | `/admin/tickets/{{ticket_id}}/reply` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 05. كتابة رد موجه للعميل أو ملاحظة داخلية خاصة | TicketsView | wired |
| 54 | POST | `/admin/tickets/{{ticket_id}}/reply` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 06. إضافة ملاحظة داخلية خاصة بالفريق التقني فقط | TicketsView | wired |
| 55 | POST | `/admin/tickets/{{ticket_id}}/assign` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 07. إسناد التذكرة لموظف دعم مختص | TicketsView | wired |
| 56 | PATCH | `/admin/tickets/{{ticket_id}}/status` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 08. تغيير حالة التذكرة (مفتوحة / جاري / معلقة / مغلقة) | TicketsView | wired |
| 57 | POST | `/admin/tickets/{{ticket_id}}/close` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 09. إغلاق التذكرة بنجاح واعتماد المعالجة | TicketsView | wired |
| 58 | GET | `/admin/payment-gateways` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. استعراض بوابات الدفع ومعايير التشفير والزكاة | PaymentGatewaysPage | wired |
| 59 | GET | `/admin/payment-gateways/stripe` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 02. تفاصيل إعدادات بوابة محددة (مثل Stripe) | PaymentGatewaysPage | wired |
| 60 | PUT | `/admin/payment-gateways/stripe` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 03. تعديل مفاتيح وإعدادات بوابة الدفع | PaymentGatewaysPage | wired |
| 61 | PATCH | `/admin/payment-gateways/stripe/status` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 04. تعطيل / تفعيل بوابة دفع | PaymentGatewaysPage | wired |
| 62 | POST | `/admin/payment-gateways/stripe/test` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 05. فحص حالة الاتصال ببوابة الدفع (Ping Test) | PaymentGatewaysPage | wired |
| 63 | GET | `/admin/invoices` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 06. قائمة فواتير الاشتراكات المركزية للمنصة | InvoicesView | wired |
| 64 | GET | `/admin/invoices/1` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 07. تفاصيل الفاتورة الإلكترونية ومطابقة ZATCA QR | InvoicesView | wired |
| 65 | GET | `/admin/announcements` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. قائمة الإعلانات والإشعارات المركزية | NotificationsManagementView | wired |
| 66 | POST | `/admin/announcements` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 02. إرسال إشعار مركزي جديد للمكاتب | NotificationsManagementView | wired |
| 67 | GET | `/admin/announcements/1` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 03. عرض تفاصيل إشعار محدد | NotificationsManagementView | wired |
| 68 | DELETE | `/admin/announcements/1` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 04. حذف إشعار | NotificationsManagementView | wired |
| 69 | GET | `/admin/settings/general` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. استعراض الإعدادات العامة للمنصة | GeneralSettingsView | wired |
| 70 | POST | `/admin/settings/general` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 02. تحديث الإعدادات العامة والهوية البصرية والروابط | GeneralSettingsView | wired |
| 71 | GET | `/admin/settings/server-info` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | فحص file_uploads, memory_limit, max_execution_time, allow_url_fopen ومقارنتها مع التوصيات | GeneralSettingsView | wired |
| 72 | GET | `/admin/settings/system-update` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 04. استعلام حالة تحديث النظام المركزية | GeneralSettingsView | wired |
| 73 | POST | `/admin/settings/system-update` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 05. بدء ترقية وتحديث نواة النظام (v4.4.0 إلى v4.5.0) | GeneralSettingsView | wired |
| 74 | GET | `/admin/audit-logs` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 06. سجل العمليات والإجراءات والتدقيق (Audit Logs) | ProfileView / سجل العمليات | wired |
| 75 | GET | `/admin/currencies` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. قائمة العملات وأسعار الصرف | CurrencySettingsView | wired |
| 76 | POST | `/admin/currencies` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 02. إضافة عملة جديدة | CurrencySettingsView | wired |
| 77 | POST | `/admin/currencies/{{currency_id}}/default` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 03. تعيين عملة كافتراضية للنظام | CurrencySettingsView | wired |
| 78 | DELETE | `/admin/currencies/{{currency_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 04. حذف عملة | CurrencySettingsView | wired |
| 79 | GET | `/admin/languages` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 05. قائمة اللغات والاتجاهات | LanguageSettingsView | wired |
| 80 | POST | `/admin/languages` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 06. إضافة لغة جديدة | LanguageSettingsView | wired |
| 81 | POST | `/admin/languages/{{language_id}}/default` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 07. تعيين لغة كافتراضية للنظام | LanguageSettingsView | wired |
| 82 | DELETE | `/admin/languages/{{language_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 08. حذف لغة | LanguageSettingsView | wired |
| 83 | GET | `/admin/website/theme` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 01. خيارات مظهر الموقع والخطوط والشعارات | WebsiteSettingsView | wired |
| 84 | POST | `/admin/website/theme` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 02. تحديث خيارات مظهر الموقع | WebsiteSettingsView | wired |
| 85 | GET | `/admin/website/seo` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 03. إعدادات محركات البحث ووسوم المشاركة (SEO & OG) | WebsiteSettingsView | wired |
| 86 | POST | `/admin/website/seo` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 04. تحديث إعدادات محركات البحث وSEO | WebsiteSettingsView | wired |
| 87 | GET | `/admin/website/hero` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 05. استعلام بيانات قسم الهيرو (Hero Section) | WebsiteSettingsView | wired |
| 88 | POST | `/admin/website/hero` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 06. تحديث قسم الهيرو | WebsiteSettingsView | wired |
| 89 | GET | `/admin/website/sections/features` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 07. استعراض عناصر قسم المميزات (Features) | WebsiteSettingsView | wired |
| 90 | POST | `/admin/website/sections/features` | Bearer admin_token | `JSON` (see bodies section) | Laravel envelope `{status,message,data}` | 08. إضافة عنصر جديد في قسم المميزات | WebsiteSettingsView | wired |
| 91 | PATCH | `/admin/website/items/1/toggle` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 09. تفعيل / تعطيل عنصر في الموقع | WebsiteSettingsView | wired |
| 92 | DELETE | `/admin/website/items/1` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | 10. حذف عنصر من الموقع | WebsiteSettingsView | wired |
| 93 | POST | `/admin/utility/login-as-firm/{{firm_id}}` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | يقوم بإنشاء جلسة دخول فورية باسم رئيس المكتب لمعاينة لوحة تحكم المكتب والتأكد من سير العمل. | دخول المكتب (impersonation) → تبويب المحامي | wired |
| 94 | POST | `/admin/utility/end-preview` | Bearer admin_token | — | Laravel envelope `{status,message,data}` | إنهاء وضع المعاينة والعودة الكاملة للوحة الإدارة العليا. | دخول المكتب (impersonation) → تبويب المحامي | wired |

## Wiring status summary (this Super Admin app)

| Area | Collection endpoints | UI | Status |
|------|----------------------|----|--------|
| Dashboard | GET `/admin/dashboard` + stats fan-out | `DashboardHomeView` | wired |
| Firms | list/stats/CRUD/status/notes/delete | `ClientManagementView` / details / modals | wired |
| Firm enter | POST `login-as-firm` | دخول → confirm → lawyer tab | wired (live verified) |
| Firm end preview | POST `end-preview` | Lawyer banner / exit (lawyer app) | API live; lawyer UI **blocked** (app not in workspace) |
| Plans | full set | `PlansView` / create / details | wired (hybrid fallback) |
| Subscriptions | full set | `SubscriptionManagementView` | wired (hybrid) |
| Staff | full set + staff impersonate | `StaffManagementView` | wired (hybrid) |
| Roles | full set | `RolesManagementView` | wired (hybrid) |
| Departments | full set | Tickets departments tab | wired (hybrid) |
| Tickets | full set | `TicketsView` | wired (hybrid) |
| Payment gateways + invoices | full set | PaymentGateways / Invoices | wired (hybrid) |
| Announcements | full set | Notifications | wired (hybrid) |
| Settings / currencies / languages / audit / server / update | full set | Settings / Utility / Profile audit | wired (hybrid); mail endpoints used in UI but **not in Postman collection** |
| Website CMS | theme/seo/hero/features/toggle/delete | Website settings tabs | partial — several marketing tabs still local |
| Impersonation logs | GET `/admin/impersonation-logs` | `/impersonation-logs` سجل الدخول | UI wired; **API 404 until backend ships** |

## Extra contracts used by this dashboard (not in original collection)

| Method | Path | Purpose | UI | Status |
|--------|------|---------|----|--------|
| POST | `/login` | Super Admin / office login | LoginForm | wired (fixed from `/admin/login`) |
| GET | `/admin/impersonation-logs` | سجل الدخول impersonation | صفحة سجل الدخول | **spec / pending backend** |
| POST | `/auth/impersonate/consume` | Optional one-time consume (lawyer) | Lawyer `/impersonate` | **spec** — live `login-as-firm` already returns a session token |
| POST | `/auth/impersonate/exit` | Exit impersonation from lawyer | Lawyer banner | **spec** — live uses `/admin/utility/end-preview` |

## Live-verified impersonation response

`POST /admin/utility/login-as-firm/{firm_id}` returns:

```json
{
  "status": true,
  "message": "تم بدء جلسة المعاينة بنجاح لمكتب: …",
  "data": {
    "token": "<sanctum-token>",
    "user": { "id": 0, "company_id": 0, "full_name": "…", "email": "…", "role": "owner" },
    "firm": { "id": 0, "name": "…" },
    "preview_banner": { "active": true, "message": "أنت الآن في وضع المعاينة المباشرة لمكتب: …" }
  }
}
```

## Request bodies (from Postman)

### POST /admin/firms

**03. إضافة مكتب محاماة جديد (Step 1 + Step 2)**

```json
{
    "owner_name": "د. خالد بن عبد العزيز العجلان",
    "name": "شركة العجلان وشركاؤه للمحاماة والاستشارات القانونية",
    "license_number": "38\/412",
    "email": "contact1793455841@alajlan-law.sa",
    "phone": "+966501234567",
    "landline": "0114829900",
    "city": "الرياض",
    "address": "طريق الملك فهد، حي الصحافة، برج النخبة - الطابق 14",
    "password": "AlJudy#Law2025",
    "plan_type": "paid",
    "plan_id": 1,
    "billing_cycle": "yearly"
}

 //plan_type --------- ENUM('trial','basic','professional','enterprise','paid')
```

### PUT /admin/firms/{{firm_id}}

**05. تحديث بيانات مكتب محاماة**

```json
{
    "name": "شركة العجلان الدولية للمحاماة",
    "phone": "+966501239876",
    "city": "الرياض",
    "tax_number": "301298457200003"
}
```

### PATCH /admin/firms/{{firm_id}}/status

**06. تعطيل مؤقت / تفعيل حساب المكتب**

```json
{
    "status": "suspended",
    "reason": "بناءً على طلب صاحب الحساب للتطوير"
}
```

### POST /admin/firms/{{firm_id}}/notes

**07. إضافة ملاحظة داخلية خاصة بفريق العمل على المكتب**

```json
{
    "note": "تم التواصل هاتفياً مع رئيس المكتب وتم الاتفاق على ترقية الباقة مع بداية الشهر القادم."
}
```

### POST /admin/plans

**03. إنشاء باقة اشتراك جديدة (4 خطوات فيجما)**

```json
{
    "name": "باقة التميز العدلي",
    "description": "مخصصة للمكاتب والشركات المهنية القانونية التي تتطلب تكاملاً فورياً مع بوابة ناجز وإدارة الفروع.",
    "badge": "فئة التميز الذهبية",
    "badge_color": "#d97706",
    "type": "paid",
    "monthly_price": 549,
    "yearly_price": 5290,
    "yearly_discount_percent": 19,
    "max_lawyers": 8,
    "max_cases": 350,
    "max_power_of_attorney": 10,
    "max_clients": 2000,
    "max_assistants": 15,
    "storage_limit_gb": 50,
    "support_level": "دعم فني واستجابة بأولوية قصوى (VIP SLA)",
    "features": [
        "مدير حساب قانوني معتمد شخصي",
        "تقارير الذكاء القضائي ومؤشرات الأداء المالي (KPIs)",
        "فوترة إلكترونية متوافقة كلياً (ZATCA Phase 2)",
        "ربط تكاملي فوري مع بوابة ناجز ومساند"
    ],
    "is_popular": true,
    "status": "active"
}
```

### PUT /admin/plans/{{plan_id}}

**05. تعديل بيانات الباقة والأسعار**

```json
{
    "monthly_price": 599,
    "storage_limit_gb": 60
}
```

### PATCH /admin/plans/{{plan_id}}/status

**06. تغيير حالة الباقة (تفعيل / تعطيل الباقة)**

```json
{
    "status": "disabled"
}
```

### POST /admin/subscriptions/{{subscription_id}}/reject

**05. رفض طلب الاشتراك مع تسجيل السبب**

```json
{
    "reason": "عدم تطابق السجل التجاري مع وثيقة ترخيص المحاماة الصادرة من وزارة العدل، مع وجود تعارض في الرقم الضريبي للمنشأة."
}
```

### POST /admin/subscriptions/{{subscription_id}}/renew

**06. تجديد اشتراك المكتب وإصدار فاتورة إلكترونية**

```json
{
    "period": "year",
    "payment_method": "mada"
}
```

### POST /admin/subscriptions/{{subscription_id}}/upgrade

**07. ترقية اشتراك المكتب لباقة أعلى**

```json
{
    "new_plan_id": 3,
    "billing_cycle": "yearly"
}
```

### POST /admin/subscriptions/{{subscription_id}}/cancel

**08. إلغاء اشتراك المكتب وإيقاف التجديد التلقائي**

```json
{
    "reason": "تم إلغاء التجديد التلقائي بناءً على طلب المنشأة كتابياً."
}
```

### PATCH /admin/subscriptions/{{subscription_id}}/status

**09. تغيير حالة الاشتراك يدوياً**

```json
{
    "status": "suspended"
}
```

### POST /admin/staff

**03. إضافة موظف جديد لطاقم الإدارة**

```json
{
    "name": "راكان بن كمال الحارثي",
    "emp_code": "EMP-130",
    "email": "r.alharbi1793455841@aljudy.sa",
    "phone": "+966571120049",
    "password": "StaffPass@2025",
    "department_id": 6,
    "role_id": 3,
    "status": "active"
}
```

### PUT /admin/staff/{{staff_id}}

**05. تحديث بيانات الموظف**

```json
{
    "phone": "+966571129999",
    "department_id": 6
}
```

### PATCH /admin/staff/{{staff_id}}/status

**06. إيقاف / تفعيل حساب الموظف**

```json
{
    "status": "suspended"
}
```

### POST /admin/staff/{{staff_id}}/reset-password

**07. إعادة تعيين كلمة المرور للموظف**

```json
{
    "password": "NewSecretPass@2025"
}
```

### POST /admin/roles

**04. إضافة دور وظيفي جديد**

```json
{
    "name": "مشرف عمليات الفروع والمناطق",
    "slug": "branch-operations-supervisor",
    "description": "متابعة فتح فروع مكاتب المحاماة في مختلف مناطق المملكة والتدقيق الجغرافي.",
    "permissions": [
        "dashboard.view",
        "firms.view",
        "firms.edit",
        "tickets.view"
    ]
}
```

### PUT /admin/roles/{{role_id}}

**06. تعديل الصلاحيات الممنوحة للدور**

```json
{
    "name": "مشرف عمليات الفروع الإقليمية",
    "permissions": [
        "dashboard.view",
        "firms.view",
        "firms.edit",
        "firms.status_change",
        "tickets.view",
        "tickets.reply"
    ]
}
```

### POST /admin/roles/{{role_id}}/reassign-staff

**07. إعادة تعيين الموظفين لدور آخر تمهيداً لحذف الدور**

```json
{
    "target_role_id": 2
}
```

### POST /admin/departments

**02. إضافة قسم جديد**

```json
{
    "name": "قسم الوساطة والتحكيم التجاري الدولي",
    "code": "DEP-07",
    "description": "إدارة ملفات وهيئات التحكيم والنزاعات المالية الكبرى.",
    "status": "active"
}
```

### PUT /admin/departments/1

**04. تحديث بيانات القسم**

```json
{
    "name": "قسم قضايا العمل والنزاعات العمالية المحدث"
}
```

### POST /admin/tickets

**03. إنشاء تذكرة دعم فني جديدة**

```json
{
    "company_id": 1,
    "subject": "تعذر مزامنة صك حكم قضائي من بوابة ناجز التابعة لوزارة العدل",
    "description": "توقف استرجاع الجلسات والبيانات الصادرة من محكمة الاستئناف التجارية بالرياض عند الساعة 10:00 ص.",
    "department_id": 6,
    "priority": "urgent",
    "channel": "portal"
}
```

### POST /admin/tickets/{{ticket_id}}/reply

**05. كتابة رد موجه للعميل أو ملاحظة داخلية خاصة**

```json
{
    "message": "تم التواصل مع فريق الربط التقني بوزارة العدل وتم تحديث مفاتيح الـ SSL وباتت المزامنة تعمل بنجاح الآن.",
    "is_internal_note": false,
    "notify_client_sms_email": true
}
```

### POST /admin/tickets/{{ticket_id}}/reply

**06. إضافة ملاحظة داخلية خاصة بالفريق التقني فقط**

```json
{
    "message": "ملاحظة خاصة: الخلل كان بسبب انتهاء التوكن المؤقت لبوابة ناجز، قمنا بتجديد الاتصال يدوياً.",
    "is_internal_note": true
}
```

### POST /admin/tickets/{{ticket_id}}/assign

**07. إسناد التذكرة لموظف دعم مختص**

```json
{
    "staff_id": 2,
    "reason": "اختصاص تكامل واجهات ناجز"
}
```

### PATCH /admin/tickets/{{ticket_id}}/status

**08. تغيير حالة التذكرة (مفتوحة / جاري / معلقة / مغلقة)**

```json
{
    "status": "in_progress"
}
```

### PUT /admin/payment-gateways/stripe

**03. تعديل مفاتيح وإعدادات بوابة الدفع**

```json
{
    "mode": "live",
    "is_recurring_supported": true,
    "supported_currencies": [
        "SAR",
        "USD",
        "AED"
    ],
    "config": {
        "publishable_key": "pk_live_aljudy_demo_2025",
        "apple_pay": true,
        "mada": true
    }
}
```

### PATCH /admin/payment-gateways/stripe/status

**04. تعطيل / تفعيل بوابة دفع**

```json
{
    "status": "active"
}
```

### POST /admin/announcements

**02. إرسال إشعار مركزي جديد للمكاتب**

```json
{
    "title": "تحديث هام: إضافة خيار التحقق الثنائي (2FA) عبر نفاذ الوطني لكافة المحامين",
    "content": "نود إحاطة جميع مكاتب المحاماة بأنه تم تفعيل الدخول الموحد الآمن عبر نفاذ لتعزيز سرية بيانات القضايا.",
    "target_audience": "all",
    "action_url": "https:\/\/aljudy.sa\/updates\/nafaz-2fa",
    "action_label": "طريقة التفعيل",
    "status": "sent"
}
```

### POST /admin/settings/general

**02. تحديث الإعدادات العامة والهوية البصرية والروابط**

```json
{
    "system_title": "منصة الجودي لإدارة الشؤون القانونية والمحاماة",
    "company_name": "مجموعة الجودي للأنظمة والحلول التقنية",
    "slogan": "المنظومة السحابية المتكاملة لتمكين المحامين وإدارة الدعاوى والتوثيق",
    "phone": "+966 11 456 7890",
    "email": "support@aljudy.sa",
    "license_code": "JDY-2024-ENT-8849-SA-AUTH",
    "timezone": "Asia\/Riyadh",
    "default_currency": "SAR",
    "primary_color": "#9C6402",
    "api_docs_url": "https:\/\/developer.aljudy.sa\/v2\/docs",
    "whatsapp_guide_url": "https:\/\/aljudy.sa\/guides\/integrations\/whatsapp",
    "telegram_guide_url": "https:\/\/aljudy.sa\/guides\/integrations\/telegram"
}
```

### POST /admin/currencies

**02. إضافة عملة جديدة**

```json
{
    "name": "الريال القطري",
    "code": "QAR",
    "symbol": "ر.ق",
    "exchange_rate": 3.64,
    "status": "active"
}
```

### POST /admin/languages

**06. إضافة لغة جديدة**

```json
{
    "name": "Türkçe",
    "code": "tr",
    "direction": "ltr",
    "status": "active"
}
```

### POST /admin/website/theme

**02. تحديث خيارات مظهر الموقع**

```json
{
    "headline_font": "Jost",
    "body_font": "Poppins",
    "theme": "Modern (عصري)",
    "disable_landing_page": false,
    "language_switcher": true
}
```

### POST /admin/website/seo

**04. تحديث إعدادات محركات البحث وSEO**

```json
{
    "language": "ar",
    "author_name": "منصة الجودي للأنظمة القانونية | Al Judy Legal SaaS",
    "meta_title": "الجودي | المنظومة السحابية الرائدة لإدارة مكاتب المحاماة والشركات القانونية",
    "meta_keywords": "محاماة, إدارة مكاتب المحاماة, استشارات قانونية, قضايا, نظام الجودي, عقود ذكية",
    "meta_description": "نظام الجودي السحابي هو الحل التقني الأكثر تطوراً للمحامين والشركات القانونية في المملكة العربية السعودية والخليج.",
    "og_title": "منصة الجودي | النظام الرقمي الأذكى لإدارة مكاتب المحاماة",
    "og_description": "انضم إلى نخبة مكاتب المحاماة الرائدة في إدارة القضايا والعملاء والعقود عبر منصة سحابية واحدة بمعايير أمان بنكية."
}
```

### POST /admin/website/hero

**06. تحديث قسم الهيرو**

```json
{
    "title": "التسويق الفوري وإدارة العمليات القانونية لعملك",
    "subtitle": "تمتع بتواصل مباشر وسريع مع موكليك، وأدر كافة الدعاوى والجلسات والتوثيق بأعلى معايير الحوكمة.",
    "description": "حل سحابي مخصص للمحامين والشركات المهنية القانونية.",
    "action_button": true,
    "action_button_label": "ابدأ تجربتك المجانية (14 يوماً)",
    "action_button_url": "\/register"
}
```

### POST /admin/website/sections/features

**08. إضافة عنصر جديد في قسم المميزات**

```json
{
    "title": "أرشفة ذكية مشفرة للمستندات",
    "subtitle": "حماية بنكية وحفظ فوري لصكوك الأحكام",
    "description": "نظام أرشفة قانوني متكامل يتيح البحث النصي الفوري داخل مذكرات الدعوى ومسودات العقود.",
    "type": "CloudArchive",
    "sort_order": 1,
    "is_active": true
}
```

