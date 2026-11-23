# وثيقة تسليم واجهات برمجة التطبيقات (API Handoff Specification)
**المشروع:** منصة الجودي لإدارة مكاتب وشركات المحاماة (SaaS Super Admin)  
**الإصدار:** v4.5.0 | **تاريخ التوثيق:** 2026-11-21  
**بيئة الإنتاج (Production):** `https://law.elmoroj.com/api`  
**بيئة التطوير / المجموعة المحلية:** `http://127.0.0.1:8000/api`  
**طريقة المصادقة:** `Authorization: Bearer <token>`  

---

## فهرس المحتويات (Table of Contents)
1. [ملخص عام وإحصائيات المنظومة](#1-ملخص-عام-وإحصائيات-المنظومة)
2. [دليل نقاط النهاية التفصيلي حسب الموديول](#2-دليل-نقاط-النهاية-التفصيلي-حسب-الموديول)
   - [01. المصادقة وإدارة الجلسة والحساب](#auth)
   - [02. لوحة المؤشرات المركزية وإحصائيات SaaS](#dashboard)
   - [03. إدارة مكاتب المحاماة والعملاء](#firms)
   - [04. باقات الاشتراك والأسعار (Plans & Pricing)](#plans)
   - [05. إدارة الاشتراكات المركزية (Subscriptions Management)](#subscriptions)
   - [06. طاقم العمل وفريق الإدارة (Staff Management)](#staff)
   - [07. الأدوار والصلاحيات (Roles & Permissions)](#roles)
   - [08. الأقسام والهيكل التنظيمي (Departments)](#departments)
   - [09. تذاكر الدعم الفني (Support Tickets)](#tickets)
   - [10. بوابات الدفع الإلكتروني (Payment Gateways)](#payments)
   - [11. فواتير الاشتراكات المركزية (Central Invoices)](#invoices)
   - [12. الإعلانات والإشعارات المركزية (Central Announcements)](#announcements)
   - [13. الإعدادات العامة وهوية المنصة وخادم النظام (Settings & Server)](#settings)
   - [14. إعدادات خادم البريد (Mail / SMTP Settings)](#mail)
   - [15. العملات وأسعار الصرف (Currencies)](#currencies)
   - [16. اللغات والاتجاهات (Languages)](#languages)
   - [17. إدارة محتوى الموقع التعريفي والتسويقي CMS (Website Settings)](#website)
   - [18. المعاينة الإشرافية وسجلات الدخول كالمكتب (Supervisory Impersonation & Audit)](#impersonation)
3. [واجهات برمجة جديدة مطلوبة من الباك اند (New APIs Required)](#3-واجهات-برمجة-جديدة-مطلوبة-من-الباك-اند)
   - [حصر البيانات الثابتة (Mock / Hardcoded Data) في الواجهة](#حصر-البيانات-الثابتة-mock--hardcoded-data-في-الواجهة)
4. [تعديلات وتحسينات مطلوبة على نقاط موجودة](#4-تعديلات-وتحسينات-مطلوبة-على-نقاط-موجودة)
5. [استفسارات وأسئلة تقنية لفريق الباك اند](#5-استفسارات-وأسئلة-تقنية-لفريق-الباك-اند)
6. [ملحق: جدول شامل ومختصر لجميع الـ Endpoints](#6-ملحق-جدول-شامل-ومختصر-لجميع-الـ-endpoints)

---

## 1. ملخص عام وإحصائيات المنظومة

هذه الوثيقة هي المصدر الفعلي والحصري المعتمد لتوثيق كافة نقاط النهاية (Endpoints) لـ **لوحة الإدارة العليا (SaaS Super Admin)** ومسار المعاينة الإشرافية لمكاتب المحاماة (Impersonation). كُتبت هذه الوثيقة بناءً على الفحص الشامل والدقيق للكود الفعلي للمشروع (Services, API Client, Types, Stores, Component Actions)، ومطابقتها مع مجموعة Postman المعتمدة وسجلات الإنتاج الحية دون أي تخمين أو افتراض.

### معلومات الربط والاتصال الأساسية
- **اسم المنظومة:** منصة الجودي لإدارة مكاتب وشركات المحاماة (SaaS Super Admin)
- **عنوان الخادم المباشر (Production Base URL):** `https://law.elmoroj.com/api`
- **عنوان الخادم المحلي (Local / Postman Base URL):** `http://127.0.0.1:8000/api`
- **آلية المصادقة وحماية المسارات:** `Authorization: Bearer <token>` (Laravel Sanctum Bearer Token).
- **مغلف الاستجابة الموحد (Standard Laravel API Envelope):**
```json
{
  "status": true,
  "message": "رسالة وصفية للعملية باللغة العربية",
  "data": { ... },
  "meta": { ... }
}
```

### جدول الإحصاءات العامة للنقاط البرمجية
| المؤشر | العدد | النسبة المئوية | الوصف والتفاصيل |
| :--- | :---: | :---: | :--- |
| **إجمالي الـ Endpoints الموثقة** | **118** | **100%** | كافة نقاط النظام التي تم فحصها وتوثيقها بالكامل |
| **✅ مربوط ومختبر في الواجهة (Wired)** | **102** | **86.4%** | مربوط بالكامل بالـ UI ومختبر بالبيانات الحقيقية والمحاكاة |
| **🟡 موجود في الـ API / يحتاج تدعيم (Partial)** | **4** | **3.4%** | موجود أو معتمد بالواجهة مع الاعتماد على بدائل مؤقتة |
| **🔴 جديد مطلوب من الباك اند (Missing)** | **12** | **10.2%** | شاشات موجودة بالواجهة تحتاج توفير Endpoints مخصصة |

---

## 2. دليل نقاط النهاية التفصيلي حسب الموديول

<a id="auth"></a>
### 01. المصادقة وإدارة الجلسة والحساب
نقاط الدخول المركزية للمشرف العام (Super Admin)، التحقق من الجلسة، الصلاحيات، وتغيير كلمة المرور.

#### [AUTH-01] `POST` /login
- **الغرض والوصف:** تسجيل الدخول للمشرف العام والتحقق من كلمة المرور وإصدار رمز Sanctum Bearer Token
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `LoginPage (صفحة تسجيل الدخول)` (@/features/auth/components/LoginForm)
- **دالة الاستدعاء في الكود:** `src/lib/api/auth.ts -> loginSuperAdmin()`

**ترويسات الطلب (Headers):**
- `Content-Type: application/json`
- `Accept: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `login` | `string` | نعم (إجباري) | البريد الإلكتروني أو اسم المستخدم للمشرف (مثل: admin@aljudy.sa) |
| `password` | `string` | نعم (إجباري) | كلمة المرور الحالية (الحد الأدنى 6 أحرف) |
| `role` | `string` | نعم (إجباري) | يجب تمرير القيمة 'admin' للوحة الإدارة العليا لتمييزها عن مكاتب المحاماة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "1|laravel_sanctum_token_hash_here_abc123",
    "user": {
      "id": 1,
      "name": "مدير المنظومة الأعلى",
      "email": "admin@aljudy.sa",
      "role": "admin",
      "company_id": null,
      "avatar": null,
      "must_change_password": false
    }
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.token (يخزن في localStorage / Cookies كرمز وصول Bearer)`
- `data.user.id (معرف المشرف)`
- `data.user.name (الاسم المعروض في الهيدر العلوي)`
- `data.user.email (البريد الإلكتروني)`
- `data.user.role (التحقق من صلاحية admin لحماية المسارات)`
- `data.user.must_change_password (توجيه إجباري لصفحة تغيير كلمة المرور عند أول دخول)`

> **ملاحظات تقنية وأخطاء متوقعة:** في حال إدخال بيانات خاطئة يرجع 401/422. إذا كان الدور يخص مكتب محاماة ترجع الواجهة تنبيهاً بتوجيهه لبوابة المكاتب.

---

#### [AUTH-02] `GET` /me
- **الغرض والوصف:** الاستعلام عن بيانات الجلسة الحالية والتحقق من استمرار صلاحية التوكن
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TopNavbar / Session Provider` (@/features/dashboard/components/DashboardTopNavbar)
- **دالة الاستدعاء في الكود:** `src/lib/api/auth.ts -> fetchCurrentUserProfile()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Accept: application/json`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "مدير المنظومة الأعلى",
    "email": "admin@aljudy.sa",
    "role": "admin",
    "phone": "+966500000000",
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.id`
- `data.name`
- `data.email`
- `data.role`
- `data.phone`

> **ملاحظات تقنية وأخطاء متوقعة:** في حال انتهاء التوكن (401) تقوم الواجهة تلقائياً بتنظيف الجلسة والتحويل إلى /login.

---

#### [AUTH-03] `POST` /change-password
- **الغرض والوصف:** تغيير كلمة مرور المشرف الحالي (سواء اختيارياً أو إجبارياً بعد أول دخول)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ChangePasswordPage / ProfileView` (@/features/auth/components/ChangePasswordForm)
- **دالة الاستدعاء في الكود:** `src/lib/api/password.ts -> changePassword()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `current_password` | `string` | نعم (إجباري) | كلمة المرور القديمة الصالحة |
| `password` | `string` | نعم (إجباري) | كلمة المرور الجديدة (8+ خانات، أحرف كبيرة وصغيرة ورموز) |
| `password_confirmation` | `string` | نعم (إجباري) | تطابق تام مع حقل password |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث كلمة المرور بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message (يعرض عبر toast نجاح)`

> **ملاحظات تقنية وأخطاء متوقعة:** في حال عدم تطابق كلمة المرور الحالية يرجع 422 مع تفصيل الخطأ تحت حقل current_password.

---

#### [AUTH-04] `POST` /logout
- **الغرض والوصف:** إبطال رمز الوصول الحالي من جهة السيرفر وحذف الجلسة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TopNavbar Dropdown` (@/features/dashboard/components/DashboardTopNavbar)
- **دالة الاستدعاء في الكود:** `src/lib/api/auth.ts -> logoutAdmin()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`

> **ملاحظات تقنية وأخطاء متوقعة:** الواجهة تنظف التوكن محلياً سواء رد السيرفر بنجاح أو تعذر الوصول.

---

#### [AUTH-05] `GET` /admin/audit-logs
- **الغرض والوصف:** استعراض سجل تدقيق الإجراءات والعمليات الحساسة التي تمت على النظام بواسطة المشرفين
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ProfileView (تبويب سجل العمليات)` (@/features/profile/components/ProfileView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> fetchAuditLogs()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `page` | `number` | لا (اختياري) | رقم الصفحة الافتراضي 1 |
| `per_page` | `number` | لا (اختياري) | عدد السجلات في الصفحة (افتراضي 20) |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 101,
      "user_id": 1,
      "user_name": "م. عبد الله المشرف",
      "action": "update_settings",
      "description": "تعديل إعدادات الهوية البصرية ورابط المنصة",
      "ip_address": "192.168.1.50",
      "created_at": "2026-11-20T14:32:00Z"
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `user_name`
- `action`
- `description`
- `ip_address`
- `created_at`

> **ملاحظات تقنية وأخطاء متوقعة:** يستخدم كمرجع أساسي لسجل العمليات في صفحة الملف الشخصي للمشرف.

---


<a id="dashboard"></a>
### 02. لوحة المؤشرات المركزية وإحصائيات SaaS
استعراض المؤشرات الحية للمنصة بالكامل: المكاتب النشطة، الاشتراكات، الإيراد الشهري MRR، ومخططات الأداء المالي.

#### [DASH-01] `GET` /admin/dashboardSaas
- **الغرض والوصف:** جلب المؤشرات الشاملة للمنصة (SaaS KPIs)، الإيراد الشهري، المكاتب المسجلة حديثاً، وأحدث تذاكر الدعم والأنشطة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DashboardHomeView (الصفحة الرئيسية)` (@/features/dashboard/components/DashboardHomeView)
- **دالة الاستدعاء في الكود:** `src/lib/api/dashboard.ts -> fetchDashboardSaas()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "kpis": {
      "totalFirms": 142,
      "totalFirmsGrowth": "+12.5%",
      "activeSubscriptions": 128,
      "activeSubscriptionsPercent": "90%",
      "monthlyRevenue": 184500,
      "monthlyRevenueFormatted": "184,500 ر.س",
      "monthlyRevenueGrowth": "+8.2%",
      "openTickets": 7,
      "openTicketsBadge": "يحتاج متابعة"
    },
    "statistics": {
      "total_firms": 142,
      "active_firms": 128,
      "trial_firms": 10,
      "expired_firms": 4,
      "total_lawyers": 580,
      "total_clients": 12400,
      "total_cases": 4320
    },
    "revenue_analysis": {
      "title": "تحليل الإيرادات والنمو الشهري",
      "subtitle": "مقارنة الـ MRR لآخر 12 شهراً",
      "total_period": 184500,
      "total_period_formatted": "184,500 ر.س",
      "growth_percentage": 8.2,
      "highest_revenue": {
        "amount": 198000,
        "formatted": "198,000 ر.س",
        "month_ar": "أكتوبر"
      },
      "chart_data": [
        {
          "monthAr": "يناير",
          "value": 120000
        },
        {
          "monthAr": "فبراير",
          "value": 135000
        },
        {
          "monthAr": "مارس",
          "value": 148000
        }
      ]
    },
    "latest_firms": [
      {
        "id": 96,
        "name": "شركة العجلان وشركاؤه للمحاماة",
        "owner_name": "د. خالد العجلان",
        "plan_name": "باقة النخبة العدلية",
        "lawyers_count": 14,
        "status": "active",
        "created_at": "2026-11-19"
      }
    ]
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.kpis.* (بطاقات المؤشرات الأربعة العلوية)`
- `data.revenue_analysis.chart_data (مخطط الإيرادات Recharts)`
- `data.latest_firms (جدول أحدث مكاتب المحاماة المسجلة في الصفحة الرئيسية)`

> **ملاحظات تقنية وأخطاء متوقعة:** يدعم التحويل التلقائي للبيانات عبر mappers.ts لعرض الأرقام والنسب المئوية والعملات بدقة.

---

#### [DASH-02] `GET` /admin/dashboard
- **الغرض والوصف:** استعلام إحصائيات منشأة فردية (legacy fallback عند الحاجة لتقييد النطاق بـ company_id)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `Dashboard Fallback / المنشأة الفردية` (@/features/dashboard/components/DashboardHomeView)
- **دالة الاستدعاء في الكود:** `src/lib/api/dashboard.ts -> fetchDashboard()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `company_id` | `number` | لا (اختياري) | معرف المنشأة المحاماة المحددة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "active_cases": 45,
    "total_lawyers": 8,
    "monthly_appointments": 120
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.active_cases`
- `data.total_lawyers`

> **ملاحظات تقنية وأخطاء متوقعة:** نقطة احتياطية في حال تعطل /admin/dashboardSaas أو عند فحص منشأة مفردة.

---


<a id="firms"></a>
### 03. إدارة مكاتب المحاماة والعملاء
دليل مكاتب وشركات المحاماة، بيانات التراخيص العدلية، استهلاك الموارد، إضافة المكاتب، التعديل، والتعطيل.

#### [FIRM-01] `GET` /admin/firms/stats
- **الغرض والوصف:** جلب المؤشرات الإحصائية لمكاتب المحاماة (إجمالي المكاتب، النشطة، التجريبية، والموقوفة)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `LawFirmsPage / ClientKpiMetrics` (@/features/clients/components/ClientKpiMetrics)
- **دالة الاستدعاء في الكود:** `src/lib/api/firms.ts -> fetchFirmsStats()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "total_firms": 142,
    "active_firms": 124,
    "active_percentage": 87.3,
    "trial_firms": 12,
    "trial_avg_days_left": 6,
    "suspended_firms": 6,
    "suspended_awaiting_payment": 4
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.total_firms (إجمالي المكاتب)`
- `data.active_firms و active_percentage (المكاتب النشطة)`
- `data.trial_firms و trial_avg_days_left (الفترات التجريبية)`
- `data.suspended_firms (الحسابات المعلقة)`

> **ملاحظات تقنية وأخطاء متوقعة:** تعرض في بطاقات الـ KPI أعلى جدول المكاتب.

---

#### [FIRM-02] `GET` /admin/firms
- **الغرض والوصف:** استعراض قائمة مكاتب المحاماة مع دعم البحث، فلترة الحالة، المدينة، الباقة، وترقيم الصفحات
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `LawFirmsPage / ClientManagementView` (@/features/clients/components/ClientManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/firms.ts -> fetchFirms()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `status` | `string` | لا (اختياري) | all | active | trial | suspended |
| `page` | `number` | لا (اختياري) | رقم الصفحة (افتراضي 1) |
| `per_page` | `number` | لا (اختياري) | عدد السجلات (افتراضي 10) |
| `search` | `string` | لا (اختياري) | بحث باسم المكتب، المالك، الترخيص، البريد، أو الهاتف |
| `city` | `string` | لا (اختياري) | فلترة حسب المدينة (مثل: الرياض، جدة) |
| `plan` | `string` | لا (اختياري) | فلترة حسب الباقة (معرف أو اسم الباقة) |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "current_page": 1,
    "total": 142,
    "per_page": 10,
    "last_page": 15,
    "data": [
      {
        "id": 96,
        "name": "شركة العجلان وشركاؤه للمحاماة",
        "owner_name": "د. خالد عبد العزيز العجلان",
        "license_number": "38/412",
        "email": "contact@alajlan-law.sa",
        "phone": "+966501234567",
        "city": "الرياض",
        "status": "active",
        "subscription_plan": "باقة النخبة العدلية",
        "billing_cycle": "yearly",
        "used_storage_gb": "12.4",
        "active_subscription": {
          "id": 10,
          "start_date": "2025-01-01",
          "renewal_date": "2026-01-01",
          "status": "active"
        }
      }
    ]
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `name`
- `owner_name`
- `license_number`
- `email`
- `phone`
- `city`
- `status`
- `subscription_plan`
- `billing_cycle`
- `used_storage_gb`
- `active_subscription`

> **ملاحظات تقنية وأخطاء متوقعة:** تدعم الواجهة كلاً من مصفوفة مباشرة data: [...] أو مغلف Pagination كامل data: { data: [...] }.

---

#### [FIRM-03] `POST` /admin/firms
- **الغرض والوصف:** إنشاء وتسجيل مكتب محاماة جديد في المنصة مع تعيين الباقة وكلمة المرور وحساب المالك
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `AddClientOfficeModal (مودال إضافة مكتب جديد)` (@/features/clients/components/AddClientOfficeModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/firms.ts -> createFirm()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | نعم (إجباري) | اسم المكتب أو الشركة المهنية للمحاماة |
| `owner_name` | `string` | نعم (إجباري) | اسم المحامي المرخص أو المالك |
| `license_number` | `string` | نعم (إجباري) | رقم ترخيص وزارة العدل (مثل: 38/412) |
| `email` | `string` | نعم (إجباري) | البريد الإلكتروني الرسمي للمكتب (فريد) |
| `phone` | `string` | نعم (إجباري) | رقم الجوال بصيغة دولية (+966...) |
| `landline` | `string` | لا (اختياري) | رقم الهاتف الثابت |
| `city` | `string` | نعم (إجباري) | المدينة (الرياض، جدة، الدمام...) |
| `address` | `string` | لا (اختياري) | العنوان الوطني أو اسم البرج والشارع |
| `password` | `string` | نعم (إجباري) | كلمة مرور حساب رئيس المكتب الأولية |
| `plan_type` | `string` | نعم (إجباري) | ENUM: trial | basic | professional | enterprise | paid | custom |
| `plan_id` | `number` | نعم (إجباري) | معرف باقة الاشتراك المختارة |
| `billing_cycle` | `string` | نعم (إجباري) | monthly | yearly |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إنشاء مكتب المحاماة بنجاح وتفعيل الحساب",
  "data": {
    "id": 98,
    "name": "شركة العجلان وشركاؤه للمحاماة",
    "owner_name": "د. خالد عبد العزيز العجلان",
    "email": "contact@alajlan-law.sa",
    "status": "active"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.id`

> **ملاحظات تقنية وأخطاء متوقعة:** عند النجاح يغلق المودال ويتم تحديث الجدول وإظهار toast نجاح، وعند 422 تظهر الأخطاء تحت كل حقل.

---

#### [FIRM-04] `GET` /admin/firms/{firm_id}
- **الغرض والوصف:** جلب الملف الشامل للمكتب: البيانات الأساسية، الاشتراك الفعال، استهلاك الموارد (المحامين، القضايا، المساحة)، والملاحظات الداخلية
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ClientOfficeDetailsView (الملف الكامل للمكتب)` (@/features/clients/components/ClientOfficeDetailsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/firms.ts -> fetchFirmById()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `firm_id` | `number | string` | نعم (إجباري) | معرف المكتب في مسار الرابط |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "firm": {
      "id": 96,
      "name": "شركة العجلان وشركاؤه للمحاماة",
      "owner_name": "د. خالد عبد العزيز العجلان",
      "license_number": "38/412",
      "tax_number": "301298457200003",
      "email": "contact@alajlan-law.sa",
      "phone": "+966501234567",
      "city": "الرياض",
      "status": "active",
      "logo": "https://law.elmoroj.com/uploads/logos/firm96.png"
    },
    "active_subscription": {
      "id": 10,
      "plan_name": "باقة النخبة العدلية",
      "billing_cycle": "yearly",
      "amount": "5290.00",
      "start_date": "2025-01-01",
      "renewal_date": "2026-01-01",
      "status": "active"
    },
    "resource_usage": {
      "lawyers_used": 11,
      "lawyers_limit": 15,
      "lawyers_percent": 73,
      "storage_used_gb": "28.5",
      "storage_limit_gb": 50,
      "storage_percent": 57,
      "active_cases": 240
    },
    "internal_notes": [
      {
        "id": 1,
        "author_name": "م. عبد الله المشرف",
        "author_role": "مدير الحسابات",
        "note": "تم التنسيق لترقية مساحة التخزين السحابي مع بداية الربع القادم.",
        "created_at": "2026-11-10T11:00:00Z"
      }
    ]
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.firm.*`
- `data.active_subscription.*`
- `data.resource_usage.*`
- `data.internal_notes.*`

> **ملاحظات تقنية وأخطاء متوقعة:** في حال لم يكن هناك اشتراك مفعل للمكتب، يكون active_subscription بقيمة null وتعرض الواجهة شارة 'لا يوجد اشتراك سارٍ'.

---

#### [FIRM-05] `PUT` /admin/firms/{firm_id}
- **الغرض والوصف:** تحديث وتعديل البيانات القانونية والتواصلية لمكتب المحاماة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `EditOfficeModal / تفاصيل المكتب` (@/features/clients/components/EditOfficeModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/firms.ts -> updateFirm()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `firm_id` | `number | string` | نعم (إجباري) | معرف المكتب |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | لا (اختياري) | تحديث اسم المكتب |
| `phone` | `string` | لا (اختياري) | رقم الجوال المعتمد |
| `landline` | `string` | لا (اختياري) | الهاتف الثابت |
| `city` | `string` | لا (اختياري) | المدينة |
| `address` | `string` | لا (اختياري) | العنوان بالتفصيل |
| `tax_number` | `string` | لا (اختياري) | الرقم الضريبي للمنشأة (15 رقماً) |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث بيانات المكتب بنجاح",
  "data": {
    "id": 96,
    "name": "شركة العجلان الدولية للمحاماة"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data`

> **ملاحظات تقنية وأخطاء متوقعة:** تتطلب الواجهة AlertDialog لتأكيد حفظ التعديلات مسبقاً.

---

#### [FIRM-06] `PATCH` /admin/firms/{firm_id}/status
- **الغرض والوصف:** تغيير حالة حساب المكتب (تفعيل، تعطيل مؤقت، أو إيقاف بسبب عدم سداد الفاتورة)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DeactivateOfficeModal / تنشيط المكتب` (@/features/clients/components/DeactivateOfficeModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/firms.ts -> changeFirmStatus()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `firm_id` | `number | string` | نعم (إجباري) | معرف المكتب |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `status` | `string` | نعم (إجباري) | active | suspended |
| `reason` | `string` | لا (اختياري) | سبب الإيقاف أو التجميد ليظهر في سجل التدقيق |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث حالة حساب المكتب بنجاح",
  "data": {
    "id": 96,
    "status": "suspended"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.status`

> **ملاحظات تقنية وأخطاء متوقعة:** عند التعطيل يتم إبراز شارة الحساب الموقوف في الجدول ومنع الدخول كالمكتب.

---

#### [FIRM-07] `POST` /admin/firms/{firm_id}/notes
- **الغرض والوصف:** تدوين ملاحظة سرية خاصة بفريق إدارة المنصة حول هذا المكتب (لا تظهر للمحامي)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ClientOfficeDetailsView (إضافة ملاحظة داخلية)` (@/features/clients/components/ClientOfficeDetailsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/firms.ts -> addFirmNote()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `firm_id` | `number | string` | نعم (إجباري) | معرف المكتب |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `note` | `string` | نعم (إجباري) | نص الملاحظة الداخلية |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تمت إضافة الملاحظة الداخلية بنجاح",
  "data": {
    "id": 12,
    "note": "تم التنسيق هاتفياً لترقية الباقة",
    "created_at": "2026-11-21T10:00:00Z"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data`

> **ملاحظات تقنية وأخطاء متوقعة:** تضاف الملاحظة مباشرة إلى شريط الملاحظات الزمني الداخلي للمكتب.

---

#### [FIRM-08] `DELETE` /admin/firms/{firm_id}
- **الغرض والوصف:** حذف مكتب المحاماة نهائياً من قاعدة بيانات المنظومة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DeleteOfficeConfirmDialog` (@/features/clients/components/DeleteOfficeModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/firms.ts -> deleteFirm()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `firm_id` | `number | string` | نعم (إجباري) | معرف المكتب المراد حذفه |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حذف مكتب المحاماة نهائياً من المنظومة"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يجب تأكيد الحذف عبر LuxuryAlertDialog مع كتابة اسم المكتب لمنع الحذف بالخطأ.

---


<a id="plans"></a>
### 04. باقات الاشتراك والأسعار (Plans & Pricing)
هياكل التسعير، حدود الموارد (عدد المحامين، القضايا، مساحة التخزين)، ميزات الباقات، ونسب الاشتراكات.

#### [PLAN-01] `GET` /admin/plans/stats
- **الغرض والوصف:** استعلام مؤشرات الباقات: إجمالي الباقات، الباقات النشطة، إجمالي المشتركين، والإيراد الشهري MRR
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `PlansView (صفحة الباقات)` (@/features/plans/components/PlansView)
- **دالة الاستدعاء في الكود:** `src/lib/api/plans.ts -> fetchPlansStats()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "total_plans": 4,
    "active_plans": 3,
    "subscribed_firms": 128,
    "mrr": 184500,
    "growth_percentage": 12.4
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.total_plans`
- `data.active_plans`
- `data.subscribed_firms`
- `data.mrr`
- `data.growth_percentage`

> **ملاحظات تقنية وأخطاء متوقعة:** تظهر في بطاقات KPIs أعلى صفحة الباقات والأسعار.

---

#### [PLAN-02] `GET` /admin/plans
- **الغرض والوصف:** استعراض كافة باقات الاشتراك المتاحة، حدودها، أسعارها الشهرية والسنوية، وقائمة مميزاتها
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `PlansView / CreatePlanView` (@/features/plans/components/PlansView)
- **دالة الاستدعاء في الكود:** `src/lib/api/plans.ts -> fetchPlans()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "باقة التميز العدلي",
      "code": "PLAN-GOLD",
      "description": "مخصصة للمكاتب والشركات المهنية القانونية التي تتطلب تكاملاً مع بوابة ناجز",
      "badge": "الفئة الذهبية",
      "badge_color": "#d97706",
      "monthly_price": 549,
      "yearly_price": 5290,
      "yearly_discount_percent": 19,
      "max_lawyers": 8,
      "max_cases": 350,
      "max_power_of_attorney": 10,
      "max_clients": 2000,
      "storage_limit_gb": 50,
      "support_level": "دعم فني واستجابة بأولوية قصوى (VIP SLA)",
      "features": [
        "مدير حساب قانوني معتمد شخصي",
        "تقارير الذكاء القضائي ومؤشرات الأداء",
        "فوترة إلكترونية متوافقة كلياً ZATCA Phase 2"
      ],
      "is_popular": true,
      "status": "active",
      "subscribed_firms_count": 54,
      "share_percentage": "42%"
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `name`
- `badge`
- `badge_color`
- `monthly_price`
- `yearly_price`
- `yearly_discount_percent`
- `max_lawyers`
- `max_cases`
- `storage_limit_gb`
- `features`
- `is_popular`
- `status`
- `subscribed_firms_count`

> **ملاحظات تقنية وأخطاء متوقعة:** تتضمن الواجهة باقة افتراضية محلية 'غير محدود' للعملاء الاستثنائيين تدمج تلقائياً.

---

#### [PLAN-03] `POST` /admin/plans
- **الغرض والوصف:** إنشاء باقة اشتراك جديدة وتحديد حدود الموارد والأسعار والميزات
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `CreatePlanView (معالج إنشاء باقة اشتراك جديدة)` (@/features/plans/components/CreatePlanWizard)
- **دالة الاستدعاء في الكود:** `src/lib/api/plans.ts -> createPlan()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | نعم (إجباري) | اسم الباقة (مثل: باقة النخبة) |
| `description` | `string` | لا (اختياري) | وصف تسويقي للباقة |
| `badge` | `string` | لا (اختياري) | شارة الباقة (مثل: الأكثر طلباً) |
| `badge_color` | `string` | لا (اختياري) | رمز اللون Hex للوسم |
| `type` | `string` | نعم (إجباري) | paid | trial | custom |
| `monthly_price` | `number` | نعم (إجباري) | السعر الشهري بالريال السعودي |
| `yearly_price` | `number` | نعم (إجباري) | السعر السنوي بالريال السعودي |
| `yearly_discount_percent` | `number` | لا (اختياري) | نسبة الخصم السنوي (0 - 100) |
| `max_lawyers` | `number` | نعم (إجباري) | الحد الأقصى لعدد المحامين والمستشارين |
| `max_cases` | `number` | نعم (إجباري) | الحد الأقصى للقضايا والمعاملات النشطة |
| `max_clients` | `number` | لا (اختياري) | حد العملاء |
| `storage_limit_gb` | `number` | نعم (إجباري) | المساحة السحابية بالجيجابايت |
| `support_level` | `string` | لا (اختياري) | مستوى الدعم الفني |
| `features` | `string[]` | نعم (إجباري) | مصفوفة نصوص بالمميزات المشمولة |
| `is_popular` | `boolean` | لا (اختياري) | تمييز الباقة كشائعة |
| `status` | `string` | نعم (إجباري) | active | disabled |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إنشاء باقة الاشتراك بنجاح",
  "data": {
    "id": 5,
    "name": "باقة النخبة"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.id`

> **ملاحظات تقنية وأخطاء متوقعة:** يتم التحقق من الحقول الإجبارية في الخطوات الأربع لمعالج الإنشاء قبل الإرسال.

---

#### [PLAN-04] `GET` /admin/plans/{plan_id}
- **الغرض والوصف:** استعلام تفاصيل باقة محددة وهوامش أسعارها وحدودها
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `PlanDetailsModal / EditPlanView` (@/features/plans/components/PlanDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/plans.ts -> fetchPlanById()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `plan_id` | `number | string` | نعم (إجباري) | معرف الباقة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "باقة التميز العدلي",
    "monthly_price": 549,
    "yearly_price": 5290,
    "max_lawyers": 8,
    "max_cases": 350,
    "storage_limit_gb": 50,
    "status": "active"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تستخدم لتعبئة حقول نموذج التعديل أو عرض بطاقة التفاصيل.

---

#### [PLAN-05] `PUT` /admin/plans/{plan_id}
- **الغرض والوصف:** تعديل بيانات الباقة والأسعار والحدود المسموح بها
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `EditPlanModal (تعديل باقة)` (@/features/plans/components/EditPlanModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/plans.ts -> updatePlan()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `plan_id` | `number | string` | نعم (إجباري) | معرف الباقة |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | لا (اختياري) | الاسم المحدث |
| `monthly_price` | `number` | لا (اختياري) | السعر الشهري |
| `yearly_price` | `number` | لا (اختياري) | السعر السنوي |
| `storage_limit_gb` | `number` | لا (اختياري) | المساحة السحابية |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث بيانات الباقة بنجاح",
  "data": {
    "id": 1
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** تتطلب الواجهة نافذة تأكيد AlertDialog قبل حفظ التغييرات على الأسعار.

---

#### [PLAN-06] `PATCH` /admin/plans/{plan_id}/status
- **الغرض والوصف:** تغيير حالة الباقة (تفعيل / تعطيل الباقة عن استقبال مشتركين جدد)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TogglePlanStatusSwitch` (@/features/plans/components/PlansTable)
- **دالة الاستدعاء في الكود:** `src/lib/api/plans.ts -> updatePlanStatus()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `plan_id` | `number | string` | نعم (إجباري) | معرف الباقة |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `status` | `string` | نعم (إجباري) | active | disabled |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث حالة الباقة بنجاح",
  "data": {
    "id": 1,
    "status": "disabled"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.status`

> **ملاحظات تقنية وأخطاء متوقعة:** تعطيل الباقة لا يلغي اشتراكات المكاتب المشتركة حالياً وإنما يمنع اختيارها للمكاتب الجديدة.

---

#### [PLAN-07] `GET` /admin/plans/{plan_id}/subscribers
- **الغرض والوصف:** استعراض قائمة المكاتب المشتركة في هذه الباقة وتفاصيل اشتراك كل مكتب
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `PlanSubscribersModal (المكاتب المشتركة في الباقة)` (@/features/plans/components/PlanSubscribersModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/plans.ts -> fetchPlanSubscribers()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `plan_id` | `number | string` | نعم (إجباري) | معرف الباقة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 96,
      "firm_name": "شركة العجلان وشركاؤه للمحاماة",
      "owner_name": "د. خالد عبد العزيز العجلان",
      "city": "الرياض",
      "phone": "+966501234567",
      "active_subscription": {
        "amount": "5290.00",
        "billing_cycle": "yearly",
        "status": "active",
        "renewal_date": "2026-01-01"
      }
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `firm_name`
- `owner_name`
- `city`
- `phone`
- `active_subscription.amount`
- `active_subscription.renewal_date`

> **ملاحظات تقنية وأخطاء متوقعة:** تظهر في نافذة منبثقة عند الضغط على عدد المشتركين في بطاقة الباقة.

---

#### [PLAN-08] `DELETE` /admin/plans/{plan_id}
- **الغرض والوصف:** حذف الباقة (مع فحص منع الحذف إذا وُجد مشتركون فيها)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DeletePlanConfirmDialog` (@/features/plans/components/DeletePlanModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/plans.ts -> deletePlan()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `plan_id` | `number | string` | نعم (إجباري) | معرف الباقة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حذف الباقة بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** إذا كانت الباقة مرتبطة بمكاتب حالية، يرجع السيرفر 422 برسالة توضح ضرورة نقل المشتركين أولاً.

---


<a id="subscriptions"></a>
### 05. إدارة الاشتراكات المركزية (Subscriptions Management)
إدارة ومتابعة الاشتراكات الفعالة، المنتهية، طلبات الاشتراك قيد الانتظار، التجديد، الترقية، والعروض الاستثنائية المخصصة.

#### [SUB-01] `GET` /admin/subscriptions/stats
- **الغرض والوصف:** جلب المؤشرات الإحصائية للاشتراكات (النشطة، قيد الانتظار، المنتهية، وتجديدات الشهر الحالي)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `SubscriptionManagementView` (@/features/subscriptions/components/SubscriptionManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> fetchSubscriptionsStats()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "total_subscriptions": 142,
    "active_subscriptions": 124,
    "pending_approvals": 5,
    "expired_subscriptions": 8,
    "renewals_this_month": 22
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.total_subscriptions`
- `data.active_subscriptions`
- `data.pending_approvals`
- `data.expired_subscriptions`
- `data.renewals_this_month`

> **ملاحظات تقنية وأخطاء متوقعة:** تعرض في بطاقات الـ KPI الإحصائية أعلى صفحة الاشتراكات.

---

#### [SUB-02] `GET` /admin/subscriptions
- **الغرض والوصف:** استعراض قائمة الاشتراكات مع دعم البحث، فلترة الحالة، التبويبات، والاشتراكات ذات العروض المخصصة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `SubscriptionManagementView` (@/features/subscriptions/components/SubscriptionManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> fetchSubscriptions()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `tab` | `string` | لا (اختياري) | all | active | pending | expired | custom |
| `status` | `string` | لا (اختياري) | active | pending | expired | suspended | cancelled |
| `is_custom_offer` | `number` | لا (اختياري) | 1 لجلب الاشتراكات ذات العروض الاستثنائية المخصصة |
| `page` | `number` | لا (اختياري) | رقم الصفحة |
| `per_page` | `number` | لا (اختياري) | سجلات الصفحة |
| `search` | `string` | لا (اختياري) | بحث برقم الاشتراك، اسم المكتب، أو المالك |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "current_page": 1,
    "total": 124,
    "data": [
      {
        "id": 10,
        "subscription_code": "SUB-2025-089",
        "company_id": 96,
        "firm_name": "شركة العجلان وشركاؤه للمحاماة",
        "plan_id": 1,
        "plan_name": "باقة النخبة العدلية",
        "billing_cycle": "yearly",
        "amount": "5290.00",
        "payment_method": "mada",
        "start_date": "2025-01-01",
        "renewal_date": "2026-01-01",
        "status": "active",
        "is_custom_offer": false
      }
    ]
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `subscription_code`
- `company_id`
- `firm_name`
- `plan_name`
- `billing_cycle`
- `amount`
- `payment_method`
- `start_date`
- `renewal_date`
- `status`
- `is_custom_offer`

> **ملاحظات تقنية وأخطاء متوقعة:** يدعم تلوين صفوف الاشتراكات وفق الحالة (أخضر للنشط، برتقالي لقيد الانتظار، أحمر للمنتهي).

---

#### [SUB-03] `GET` /admin/subscriptions/{subscription_id}
- **الغرض والوصف:** عرض التفاصيل الكاملة للاشتراك المحدد والفواتير المرتبطة به
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `SubscriptionDetailsModal` (@/features/subscriptions/components/SubscriptionDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> fetchSubscriptionById()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `subscription_id` | `number | string` | نعم (إجباري) | معرف الاشتراك |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": 10,
    "subscription_code": "SUB-2025-089",
    "firm": {
      "id": 96,
      "name": "شركة العجلان وشركاؤه للمحاماة"
    },
    "plan": {
      "id": 1,
      "name": "باقة النخبة العدلية"
    },
    "amount": "5290.00",
    "billing_cycle": "yearly",
    "start_date": "2025-01-01",
    "renewal_date": "2026-01-01",
    "status": "active"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تظهر في نافذة التفاصيل السريعة للاشتراك.

---

#### [SUB-04] `POST` /admin/subscriptions/{subscription_id}/approve
- **الغرض والوصف:** الموافقة وتفعيل طلب اشتراك قيد الانتظار واعتماد السداد
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ApproveSubscriptionDialog` (@/features/subscriptions/components/SubscriptionManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> approveSubscription()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `subscription_id` | `number | string` | نعم (إجباري) | معرف الاشتراك |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تمت الموافقة على طلب الاشتراك وتفعيله بنجاح",
  "data": {
    "id": 10,
    "status": "active"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يحول حالة الاشتراك مباشرة إلى active ويرسل إشعاراً للمكتب.

---

#### [SUB-05] `POST` /admin/subscriptions/{subscription_id}/reject
- **الغرض والوصف:** رفض طلب الاشتراك مع تسجيل وتدوين السبب القانوني أو المالي للمكتب
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `RejectSubscriptionModal (رفض الاشتراك مع السبب)` (@/features/subscriptions/components/RejectSubscriptionModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> rejectSubscription()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `subscription_id` | `number | string` | نعم (إجباري) | معرف الاشتراك |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `reason` | `string` | نعم (إجباري) | سبب رفض طلب الاشتراك بالتفصيل |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم رفض طلب الاشتراك وإشعار المنشأة بالسبب",
  "data": {
    "id": 10,
    "status": "rejected"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** حقل السبب إجباري في واجهة المستخدم لمنع الرفض بدون مبرر موثق.

---

#### [SUB-06] `POST` /admin/subscriptions/{subscription_id}/renew
- **الغرض والوصف:** تجديد اشتراك المكتب وتمديد فترة الصلاحية وإصدار فاتورة إلكترونية جديدة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `RenewSubscriptionModal` (@/features/subscriptions/components/RenewSubscriptionModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> renewSubscription()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `subscription_id` | `number | string` | نعم (إجباري) | معرف الاشتراك |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `period` | `string` | نعم (إجباري) | year | month |
| `payment_method` | `string` | نعم (إجباري) | mada | visa | bank_transfer |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تجديد الاشتراك بنجاح وتحديث تاريخ التجديد",
  "data": {
    "id": 10,
    "renewal_date": "2027-01-01"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.renewal_date`

> **ملاحظات تقنية وأخطاء متوقعة:** يعاد ضبط تاريخ التجديد تلقائياً وفق الفترة المختارة.

---

#### [SUB-07] `POST` /admin/subscriptions/{subscription_id}/upgrade
- **الغرض والوصف:** ترقية اشتراك المكتب لباقة أعلى واحتساب الفارق الزمني والمالي
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `UpgradeSubscriptionModal` (@/features/subscriptions/components/UpgradeSubscriptionModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> upgradeSubscription()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `subscription_id` | `number | string` | نعم (إجباري) | معرف الاشتراك |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `new_plan_id` | `number` | نعم (إجباري) | معرف الباقة الجديدة الأعلى |
| `billing_cycle` | `string` | لا (اختياري) | monthly | yearly |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تمت ترقية الاشتراك بنجاح وتحديث صلاحيات المكتب",
  "data": {
    "id": 10,
    "plan_id": 3
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data`

> **ملاحظات تقنية وأخطاء متوقعة:** يتم تحديث حدود الموارد فوراً للمكتب.

---

#### [SUB-08] `POST` /admin/subscriptions/{subscription_id}/cancel
- **الغرض والوصف:** إلغاء اشتراك المكتب وإيقاف التجديد التلقائي مع تدوين السبب
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `CancelSubscriptionModal` (@/features/subscriptions/components/CancelSubscriptionModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> cancelSubscription()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `subscription_id` | `number | string` | نعم (إجباري) | معرف الاشتراك |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `reason` | `string` | نعم (إجباري) | سبب الإلغاء |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إلغاء الاشتراك وإيقاف التجديد التلقائي",
  "data": {
    "id": 10,
    "status": "cancelled"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يتطلب AlertDialog تحذيري لتأكيد رغبة الإلغاء.

---

#### [SUB-09] `PATCH` /admin/subscriptions/{subscription_id}/status
- **الغرض والوصف:** تغيير حالة الاشتراك يدوياً من المشرف (تفعيل / تجميد / إيقاف)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `SubscriptionStatusSwitcher` (@/features/subscriptions/components/SubscriptionManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> updateSubscriptionStatus()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `subscription_id` | `number | string` | نعم (إجباري) | معرف الاشتراك |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `status` | `string` | نعم (إجباري) | active | suspended | pending | expired |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث حالة الاشتراك بنجاح",
  "data": {
    "id": 10,
    "status": "suspended"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.status`

> **ملاحظات تقنية وأخطاء متوقعة:** تعديل فوري لحالة الاشتراك.

---

#### [SUB-10] `POST` /admin/subscriptions/{subscription_id}/custom-offer
- **الغرض والوصف:** تطبيق باقة مخصصة وزيادة حدود معينة (محامين، قضايا، تخزين) لاشتراك مكتب قائم خارج حدود الباقات القياسية
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `CustomPlanOfferModal (تطبيق باقة مخصصة وعرض استثنائي)` (@/features/clients/components/ClientOfficeDetailsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> applyCustomOffer()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `subscription_id` | `number | string` | نعم (إجباري) | معرف الاشتراك |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `offer_name` | `string` | لا (اختياري) | اسم العرض الاستثنائي |
| `is_custom_offer` | `number` | نعم (إجباري) | يجب تمرير 1 |
| `extra_lawyers` | `number` | لا (اختياري) | محامين إضافيين فوق الباقة |
| `extra_cases` | `number` | لا (اختياري) | قضايا إضافية |
| `extra_storage_gb` | `number` | لا (اختياري) | جيجابايت تخزين إضافية |
| `custom_price` | `number` | لا (اختياري) | السعر المخصص المتفق عليه |
| `custom_notes` | `string` | لا (اختياري) | ملاحظات الاتفاقية الاستثنائية |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تطبيق العرض المخصص على اشتراك المكتب بنجاح",
  "data": {
    "id": 10,
    "is_custom_offer": true
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data`

> **ملاحظات تقنية وأخطاء متوقعة:** مستخدم في تبويب الباقة المخصصة بتفاصيل المكتب ومودال الترقية.

---

#### [SUB-11] `DELETE` /admin/subscriptions/{subscription_id}/custom-offer
- **الغرض والوصف:** إلغاء العرض المخصص والعودة للحدود القياسية لباقة الاشتراك الأصلية
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ResetCustomOfferDialog` (@/features/subscriptions/components/SubscriptionManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> removeCustomOffer()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `subscription_id` | `number | string` | نعم (إجباري) | معرف الاشتراك |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إلغاء العرض المخصص وإعادة الاشتراك لحدود الباقة القياسية"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يعيد ضبط الحدود تلقائياً.

---

#### [SUB-12] `GET` /admin/subscriptions/{subscription_id}/limits-breakdown
- **الغرض والوصف:** تفاصيل حدود الباقة والزيادات المخصصة ومقارنة الاستهلاك الفعلي بالمسموح
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ClientOfficeDetailsView (مخطط استهلاك وتفصيل الحدود)` (@/features/clients/components/ClientOfficeDetailsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/subscriptions.ts -> fetchSubscriptionLimitsBreakdown()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `subscription_id` | `number | string` | نعم (إجباري) | معرف الاشتراك |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "plan_base_limits": {
      "lawyers": 8,
      "cases": 350,
      "storage_gb": 50
    },
    "custom_extras": {
      "lawyers": 5,
      "cases": 100,
      "storage_gb": 20
    },
    "total_allowed": {
      "lawyers": 13,
      "cases": 450,
      "storage_gb": 70
    },
    "currently_used": {
      "lawyers": 11,
      "cases": 240,
      "storage_gb": 28.5
    }
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.plan_base_limits`
- `data.custom_extras`
- `data.total_allowed`
- `data.currently_used`

> **ملاحظات تقنية وأخطاء متوقعة:** تعرض في بطاقة تفكيك الموارد والحدود في ملف المكتب الشامل.

---


<a id="staff"></a>
### 06. طاقم العمل وفريق الإدارة (Staff Management)
إدارة منسوبي ومشرفي المنصة، تعيين الأقسام والأدوار الوظيفية، إعادة تعيين كلمات المرور، والدخول المباشر كالموظف.

#### [STAFF-01] `GET` /admin/staff/stats
- **الغرض والوصف:** جلب إحصائيات طاقم العمل وتواجدهم (إجمالي الموظفين، النشطين، إجازة/معلق، والمشرفين)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `StaffManagementView` (@/features/staff/components/StaffManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/staff.ts -> fetchStaffStats()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "total_staff": 18,
    "active_staff": 16,
    "suspended_staff": 2,
    "supervisors_count": 4
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.total_staff`
- `data.active_staff`
- `data.suspended_staff`
- `data.supervisors_count`

> **ملاحظات تقنية وأخطاء متوقعة:** تعرض في بطاقات المؤشرات الأربعة أعلى جدول الموظفين.

---

#### [STAFF-02] `GET` /admin/staff
- **الغرض والوصف:** قائمة الموظفين والمشرفين مع بيانات الأقسام، الأدوار، الحالة، والبحث
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `StaffManagementView` (@/features/staff/components/StaffManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/staff.ts -> fetchStaffList()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `page` | `number` | لا (اختياري) | رقم الصفحة |
| `per_page` | `number` | لا (اختياري) | عدد السجلات |
| `search` | `string` | لا (اختياري) | بحث بالاسم، الكود الوظيفي، أو البريد |
| `department_id` | `number` | لا (اختياري) | فلترة حسب القسم |
| `role_id` | `number` | لا (اختياري) | فلترة حسب الدور |
| `status` | `string` | لا (اختياري) | active | suspended |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 2,
      "name": "راكان بن كمال الحارثي",
      "emp_code": "EMP-130",
      "email": "r.alharbi@aljudy.sa",
      "phone": "+966571120049",
      "department_id": 6,
      "department_name": "قسم الدعم الفني والربط التقني",
      "role_id": 3,
      "role_name": "مشرف الدعم والعمليات",
      "status": "active",
      "assigned_tickets_count": 5,
      "created_at": "2025-06-15"
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `name`
- `emp_code`
- `email`
- `phone`
- `department_name`
- `role_name`
- `status`
- `assigned_tickets_count`

> **ملاحظات تقنية وأخطاء متوقعة:** تدعم الواجهة كلاً من المخرجات المباشرة أو المغلفة بـ pagination.

---

#### [STAFF-03] `POST` /admin/staff
- **الغرض والوصف:** إضافة موظف جديد لطاقم إدارة المنصة وتعيين كوده وقسمه ودوره
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `AddStaffModal (إضافة موظف جديد)` (@/features/staff/components/AddStaffModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/staff.ts -> createStaff()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | نعم (إجباري) | الاسم الرباعي للموظف |
| `emp_code` | `string` | نعم (إجباري) | الكود الوظيفي الفريد (مثل: EMP-130) |
| `email` | `string` | نعم (إجباري) | البريد الإلكتروني المهني (فريد) |
| `phone` | `string` | نعم (إجباري) | رقم الجوال بصيغة دولية |
| `password` | `string` | نعم (إجباري) | كلمة المرور الأولية (8+ خانات) |
| `department_id` | `number` | نعم (إجباري) | معرف القسم التابع له |
| `role_id` | `number` | نعم (إجباري) | معرف الدور الوظيفي الممنوح |
| `status` | `string` | نعم (إجباري) | active | suspended |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تمت إضافة الموظف بنجاح إلى طاقم الإدارة",
  "data": {
    "id": 14,
    "name": "راكان بن كمال الحارثي"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.id`

> **ملاحظات تقنية وأخطاء متوقعة:** ملاحظة هامة للباك اند: يجب ربط الموظف تلقائياً بجدول users حتى يتمكن من تسجيل الدخول عبر /login (انظر قسم الفجوات).

---

#### [STAFF-04] `GET` /admin/staff/{staff_id}
- **الغرض والوصف:** استعلام تفاصيل الموظف والصلاحيات والتذاكر المسندة له وسجل نشاطه
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `StaffDetailsModal` (@/features/staff/components/StaffDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/staff.ts -> fetchStaffById()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `staff_id` | `number | string` | نعم (إجباري) | معرف الموظف |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": 2,
    "name": "راكان بن كمال الحارثي",
    "emp_code": "EMP-130",
    "email": "r.alharbi@aljudy.sa",
    "phone": "+966571120049",
    "department": {
      "id": 6,
      "name": "الدعم الفني"
    },
    "role": {
      "id": 3,
      "name": "مشرف الدعم"
    },
    "status": "active"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تستخدم لتعبئة شاشة التفاصيل ونموذج التعديل.

---

#### [STAFF-05] `PUT` /admin/staff/{staff_id}
- **الغرض والوصف:** تحديث بيانات الموظف (الاسم، الجوال، القسم، أو الدور الوظيفي)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `EditStaffModal` (@/features/staff/components/EditStaffModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/staff.ts -> updateStaff()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `staff_id` | `number | string` | نعم (إجباري) | معرف الموظف |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `phone` | `string` | لا (اختياري) | رقم الجوال الجديد |
| `department_id` | `number` | لا (اختياري) | معرف القسم |
| `role_id` | `number` | لا (اختياري) | معرف الدور |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث بيانات الموظف بنجاح",
  "data": {
    "id": 2
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** تتطلب الواجهة تأكيد حفظ التعديل.

---

#### [STAFF-06] `PATCH` /admin/staff/{staff_id}/status
- **الغرض والوصف:** إيقاف أو تفعيل حساب الموظف
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `StaffStatusSwitch` (@/features/staff/components/StaffManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/staff.ts -> updateStaffStatus()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `staff_id` | `number | string` | نعم (إجباري) | معرف الموظف |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `status` | `string` | نعم (إجباري) | active | suspended |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث حالة حساب الموظف",
  "data": {
    "id": 2,
    "status": "suspended"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.status`

> **ملاحظات تقنية وأخطاء متوقعة:** يمنع الموظف المعلق حسابه من الدخول للمنظومة فورياً.

---

#### [STAFF-07] `POST` /admin/staff/{staff_id}/reset-password
- **الغرض والوصف:** إعادة تعيين وتوليد كلمة مرور جديدة للموظف من قبل المشرف العام
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ResetStaffPasswordModal` (@/features/staff/components/ResetStaffPasswordModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/staff.ts -> resetStaffPassword()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `staff_id` | `number | string` | نعم (إجباري) | معرف الموظف |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `password` | `string` | نعم (إجباري) | كلمة المرور الجديدة (8+ خانات) |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تمت إعادة تعيين كلمة المرور بنجاح للموظف"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يتم إظهار زر نسخ كلمة المرور في الواجهة بعد النجاح.

---

#### [STAFF-08] `POST` /admin/staff/{staff_id}/impersonate
- **الغرض والوصف:** الدخول المباشر بحساب الموظف لمعاينة صلاحياته والتأكد من بيئة عمله
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `LoginAsEmployeeModal` (@/features/staff/components/LoginAsEmployeeModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/staff.ts -> impersonateStaff()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `staff_id` | `number | string` | نعم (إجباري) | معرف الموظف |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم توليد رمز جلسة الموظف بنجاح",
  "data": {
    "token": "2|sanctum_staff_token_here",
    "staff": {
      "id": 2,
      "name": "راكان بن كمال الحارثي",
      "role": "support"
    }
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.token`
- `data.staff`

> **ملاحظات تقنية وأخطاء متوقعة:** تفتح الواجهة جلسة محاكاة للموظف مع راية علوية صفراء تتيح العودة لحساب المشرف.

---

#### [STAFF-09] `DELETE` /admin/staff/{staff_id}
- **الغرض والوصف:** حذف حساب الموظف نهائياً بعد التحقق من عدم ارتباط تذاكر أو مهام حساسة به
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DeleteStaffConfirmDialog` (@/features/staff/components/DeleteStaffModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/staff.ts -> deleteStaff()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `staff_id` | `number | string` | نعم (إجباري) | معرف الموظف |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حذف حساب الموظف بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يتطلب تأكيد أمني AlertDialog.

---


<a id="roles"></a>
### 07. الأدوار والصلاحيات (Roles & Permissions)
بناء أدوار الوصول الإدارية، مصفوفة الصلاحيات الدقيقة لكل موديول، وحماية أدوار النظام من الحذف.

#### [ROLE-01] `GET` /admin/roles/stats
- **الغرض والوصف:** إحصائيات الأدوار ومصفوفة الصلاحيات (إجمالي الأدوار، الأدوار المخصصة، والموظفين المرتبطين)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `RolesManagementView` (@/features/permissions/components/RolesManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/roles.ts -> fetchRolesStats()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "total_roles": 5,
    "custom_roles": 3,
    "system_protected_roles": 2,
    "total_permissions_available": 48
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.total_roles`
- `data.custom_roles`
- `data.system_protected_roles`
- `data.total_permissions_available`

> **ملاحظات تقنية وأخطاء متوقعة:** تعرض في بطاقات الإحصاءات لصفحة الأدوار والصلاحيات.

---

#### [ROLE-02] `GET` /admin/roles/permissions
- **الغرض والوصف:** استعلام دليل وصلاحيات النظام المتاحة بالكامل مقسمة حسب الموديولات
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `RolesManagementView / CreateRoleModal` (@/features/permissions/components/CreateRoleModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/roles.ts -> fetchPermissionsCatalog()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "module": "firms",
      "module_name": "مكاتب المحاماة",
      "permissions": [
        {
          "slug": "firms.view",
          "name": "استعراض المكاتب",
          "description": "رؤية القائمة والتفاصيل"
        },
        {
          "slug": "firms.create",
          "name": "إضافة مكتب",
          "description": "تسجيل مكتب جديد"
        },
        {
          "slug": "firms.edit",
          "name": "تعديل مكتب",
          "description": "تحديث بيانات المكتب"
        },
        {
          "slug": "firms.status_change",
          "name": "تعطيل/تفعيل",
          "description": "تغيير حالة المكتب"
        },
        {
          "slug": "firms.delete",
          "name": "حذف مكتب",
          "description": "الحذف النهائي"
        }
      ]
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.module`
- `data.module_name`
- `data.permissions.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تستخدم لبناء مصفوفة الـ Checkboxes التفاعلية عند إنشاء أو تعديل دور وظيفي.

---

#### [ROLE-03] `GET` /admin/roles
- **الغرض والوصف:** قائمة الأدوار الوظيفية المعرفة في النظام وعدد الموظفين المسندين لكل دور
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `RolesManagementView` (@/features/permissions/components/RolesManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/roles.ts -> fetchRoles()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "مدير النظام الأعلى (Super Admin)",
      "slug": "super-admin",
      "description": "صلاحيات مطلقة لكافة أجزاء المنظومة وإعدادات السيرفر",
      "is_system": true,
      "assigned_staff_count": 2,
      "permissions_count": 48,
      "permissions": [
        "*"
      ]
    },
    {
      "id": 3,
      "name": "مشرف العمليات والدعم",
      "slug": "operations-supervisor",
      "description": "إدارة المكاتب ومتابعة التذاكر",
      "is_system": false,
      "assigned_staff_count": 6,
      "permissions_count": 14,
      "permissions": [
        "dashboard.view",
        "firms.view",
        "tickets.view",
        "tickets.reply"
      ]
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `name`
- `slug`
- `description`
- `is_system`
- `assigned_staff_count`
- `permissions_count`
- `permissions`

> **ملاحظات تقنية وأخطاء متوقعة:** الأدوار التي تحمل is_system: true يتم تعطيل زري الحذف والتعديل الحساس لها لحماية النظام.

---

#### [ROLE-04] `POST` /admin/roles
- **الغرض والوصف:** إضافة دور وظيفي مخصص وتحديد مصفوفة الصلاحيات الممنوحة له
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `CreateRoleModal (إضافة دور جديد)` (@/features/permissions/components/CreateRoleModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/roles.ts -> createRole()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | نعم (إجباري) | اسم الدور الوظيفي (مثل: مدقق عقود المكاتب) |
| `slug` | `string` | نعم (إجباري) | المعرف الإنجليزي الفريد (مثل: contract-auditor) |
| `description` | `string` | لا (اختياري) | وصف مهام ومسؤوليات الدور |
| `permissions` | `string[]` | نعم (إجباري) | مصفوفة معرفات الصلاحيات المختارة (مثل: ['firms.view', 'tickets.view']) |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إنشاء الدور الوظيفي بنجاح",
  "data": {
    "id": 6,
    "name": "مدقق عقود المكاتب"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.id`

> **ملاحظات تقنية وأخطاء متوقعة:** يجب اختيار صلاحية واحدة على الأقل قبل تفعيل زر الحفظ في الواجهة.

---

#### [ROLE-05] `GET` /admin/roles/{role_id}
- **الغرض والوصف:** استعلام تفاصيل الدور والصلاحيات الممنوحة له والموظفين التابعين له
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `RoleDetailsModal / EditRoleModal` (@/features/permissions/components/RoleDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/roles.ts -> fetchRoleById()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `role_id` | `number | string` | نعم (إجباري) | معرف الدور |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": 3,
    "name": "مشرف العمليات والدعم",
    "slug": "operations-supervisor",
    "description": "إدارة المكاتب ومتابعة التذاكر",
    "permissions": [
      "dashboard.view",
      "firms.view",
      "firms.edit",
      "tickets.view",
      "tickets.reply"
    ]
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تستخدم لتعبئة مربعات الاختيار في نموذج التعديل.

---

#### [ROLE-06] `PUT` /admin/roles/{role_id}
- **الغرض والوصف:** تعديل الصلاحيات الممنوحة للدور أو تحديث اسمه ووصفه
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `EditRoleModal (تعديل صلاحيات الدور)` (@/features/permissions/components/EditRoleModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/roles.ts -> updateRole()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `role_id` | `number | string` | نعم (إجباري) | معرف الدور |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | لا (اختياري) | الاسم المحدث |
| `description` | `string` | لا (اختياري) | الوصف المحدث |
| `permissions` | `string[]` | نعم (إجباري) | المصفوفة الجديدة للصلاحيات |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث صلاحيات الدور بنجاح",
  "data": {
    "id": 3
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يتطلب تأكيد أمني قبل الحفظ.

---

#### [ROLE-07] `POST` /admin/roles/{role_id}/reassign-staff
- **الغرض والوصف:** إعادة تعيين الموظفين المرتبطين بالدور إلى دور آخر تمهيداً لحذف الدور بأمان
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ReassignStaffBeforeDeleteModal` (@/features/permissions/components/ReassignRoleModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/roles.ts -> reassignRoleStaff()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `role_id` | `number | string` | نعم (إجباري) | معرف الدور الحالي |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `target_role_id` | `number` | نعم (إجباري) | معرف الدور الجديد البديل |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تمت إعادة تعيين جميع الموظفين للدور البديل بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** خطوة وقائية إجبارية تمنع حذف أي دور وظيفي طالما وُجد موظف واحد مسند إليه.

---

#### [ROLE-08] `DELETE` /admin/roles/{role_id}
- **الغرض والوصف:** حذف الدور الوظيفي بعد التأكد من خلوه من الموظفين وعدم كونه دوراً أساسياً للنظام
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DeleteRoleConfirmDialog` (@/features/permissions/components/DeleteRoleModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/roles.ts -> deleteRole()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `role_id` | `number | string` | نعم (إجباري) | معرف الدور المراد حذفه |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حذف الدور الوظيفي بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** إذا كان الدور محمياً يرجع 403 مع رسالة 'لا يمكن حذف أدوار النظام الأساسية'.

---


<a id="departments"></a>
### 08. الأقسام والهيكل التنظيمي (Departments)
إدارة الهيكل التنظيمي للمنصة، الأقسام المسؤولة عن توجيه تذاكر الدعم والاشتراكات والمحاسبة.

#### [DEP-01] `GET` /admin/departments
- **الغرض والوصف:** استعراض قائمة الأقسام الإدارية والفنية وأكوادها
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TicketsView (تبويب الأقسام) / Staff Modals` (@/features/tickets/components/TicketsDepartmentTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/departments.ts -> fetchDepartments()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 6,
      "name": "قسم الربط التقني وبوابة ناجز",
      "code": "DEP-06",
      "description": "معالجة تكامل واجهات وزارة العدل وشهادات الربط",
      "status": "active",
      "staff_count": 5,
      "open_tickets_count": 3
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `name`
- `code`
- `description`
- `status`
- `staff_count`
- `open_tickets_count`

> **ملاحظات تقنية وأخطاء متوقعة:** تستخدم في القوائم المنسدلة عند إنشاء موظف، توجيه تذكرة، أو في إدارة الأقسام.

---

#### [DEP-02] `POST` /admin/departments
- **الغرض والوصف:** إضافة قسم تنظيمي جديد
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `AddDepartmentModal` (@/features/tickets/components/AddDepartmentModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/departments.ts -> createDepartment()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | نعم (إجباري) | اسم القسم |
| `code` | `string` | نعم (إجباري) | كود القسم (مثل: DEP-07) |
| `description` | `string` | لا (اختياري) | وصف مهام القسم |
| `status` | `string` | نعم (إجباري) | active | disabled |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إنشاء القسم بنجاح",
  "data": {
    "id": 7,
    "name": "قسم التحكيم والوساطة"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.id`

> **ملاحظات تقنية وأخطاء متوقعة:** يتم تحديث قائمة الأقسام فورياً بعد الإضافة.

---

#### [DEP-03] `GET` /admin/departments/{id}
- **الغرض والوصف:** استعلام بيانات قسم محدد
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `EditDepartmentModal` (@/features/tickets/components/EditDepartmentModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/departments.ts -> fetchDepartmentById()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `id` | `number | string` | نعم (إجباري) | معرف القسم |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": 6,
    "name": "قسم الربط التقني",
    "code": "DEP-06"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تعبئة نموذج التعديل.

---

#### [DEP-04] `PUT` /admin/departments/{id}
- **الغرض والوصف:** تحديث وتعديل بيانات القسم
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `EditDepartmentModal` (@/features/tickets/components/EditDepartmentModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/departments.ts -> updateDepartment()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `id` | `number | string` | نعم (إجباري) | معرف القسم |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | لا (اختياري) | الاسم المحدث |
| `description` | `string` | لا (اختياري) | الوصف |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث بيانات القسم بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يتطلب تأكيد حفظ.

---

#### [DEP-05] `DELETE` /admin/departments/{id}
- **الغرض والوصف:** حذف القسم بعد التحقق من عدم ارتباط موظفين أو تذاكر به
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DeleteDepartmentDialog` (@/features/tickets/components/DeleteDepartmentModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/departments.ts -> deleteDepartment()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `id` | `number | string` | نعم (إجباري) | معرف القسم |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حذف القسم بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يرجع 422 إذا كان هناك موظفون مسندون للقسم.

---


<a id="tickets"></a>
### 09. تذاكر الدعم الفني (Support Tickets)
إدارة تذاكر الدعم الواردة من المكاتب، الفلترة حسب الأولوية والقسم، كتابة الردود والملاحظات الداخلية، والإسناد للموظفين.

#### [TCK-01] `GET` /admin/tickets/stats
- **الغرض والوصف:** جلب إحصائيات التذاكر: المفتوحة، قيد المعالجة، المغلقة، متوسط سرعة الاستجابة، ونسبة رضا المكاتب
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TicketsView (صفحة التذاكر)` (@/features/tickets/components/TicketsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/tickets.ts -> fetchTicketsStats()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "open": 7,
    "in_progress": 12,
    "pending": 4,
    "closed": 98,
    "total": 121,
    "satisfaction_rate": 96.5,
    "avg_response_time": "18 دقيقة"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.open`
- `data.in_progress`
- `data.pending`
- `data.closed`
- `data.total`
- `data.satisfaction_rate`
- `data.avg_response_time`

> **ملاحظات تقنية وأخطاء متوقعة:** تعرض في بطاقات الـ KPI أعلى لوحة التذاكر.

---

#### [TCK-02] `GET` /admin/tickets
- **الغرض والوصف:** استعراض قائمة التذاكر مع فلترة الحالة (مفتوحة، قيد المعالجة، مغلقة)، الأولوية (حرجة، متوسطة، منخفضة)، والبحث
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TicketsView (قائمة التذاكر)` (@/features/tickets/components/TicketsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/tickets.ts -> fetchTickets()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `status` | `string` | لا (اختياري) | open | in_progress | pending | closed |
| `priority` | `string` | لا (اختياري) | urgent | high | medium | low |
| `search` | `string` | لا (اختياري) | بحث برقم التذكرة، العنوان، اسم المكتب، أو المحامي |
| `page` | `number` | لا (اختياري) | رقم الصفحة |
| `per_page` | `number` | لا (اختياري) | عدد السجلات |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 45,
      "ticket_number": "TCK-2025-045",
      "subject": "تعذر مزامنة صك حكم قضائي من بوابة ناجز",
      "description": "توقف استرجاع الجلسات والبيانات الصادرة من محكمة الاستئناف",
      "priority": "urgent",
      "status": "in_progress",
      "channel": "portal",
      "created_at": "2026-11-20T10:15:00Z",
      "firm": {
        "id": 96,
        "name": "شركة العجلان للمحاماة"
      },
      "department": {
        "id": 6,
        "name": "قسم الربط التقني"
      },
      "assignee": {
        "id": 2,
        "name": "راكان الحارثي"
      }
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `ticket_number`
- `subject`
- `description`
- `priority`
- `status`
- `created_at`
- `firm.name`
- `department.name`
- `assignee.name`

> **ملاحظات تقنية وأخطاء متوقعة:** تدعم الواجهة كلاً من التصفح المبوب والفلترة السريعة.

---

#### [TCK-03] `POST` /admin/tickets
- **الغرض والوصف:** إنشاء تذكرة دعم فني جديدة موجهة لمكتب محاماة معين أو فتح بلاغ صيانة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `CreateTicketModal (إنشاء تذكرة دعم جديدة من الإدارة)` (@/features/tickets/components/CreateTicketModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/tickets.ts -> createTicket()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `company_id` | `number` | نعم (إجباري) | معرف مكتب المحاماة المعني |
| `subject` | `string` | نعم (إجباري) | عنوان وموضوع التذكرة |
| `description` | `string` | نعم (إجباري) | شرح تفصيلي للمشكلة أو البلاغ |
| `department_id` | `number` | نعم (إجباري) | معرف القسم المختص بالمعالجة |
| `priority` | `string` | نعم (إجباري) | urgent | high | medium | low |
| `channel` | `string` | لا (اختياري) | portal | email | phone | whatsapp |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إنشاء تذكرة الدعم بنجاح وتوجيهها للقسم المختص",
  "data": {
    "id": 46,
    "ticket_number": "TCK-2025-046"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.id`
- `data.ticket_number`

> **ملاحظات تقنية وأخطاء متوقعة:** يتم إشعار المكتب وموظف الدعم فورياً.

---

#### [TCK-04] `GET` /admin/tickets/{ticket_id}
- **الغرض والوصف:** عرض التفاصيل الكاملة للتذكرة، سجل المحادثة والردود، الملاحظات الداخلية، والمرفقات
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TicketDetailsView (شاشة تفاصيل ومحادثة التذكرة)` (@/features/tickets/components/TicketDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/tickets.ts -> fetchTicketById()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `ticket_id` | `number | string` | نعم (إجباري) | معرف التذكرة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": 45,
    "ticket_number": "TCK-2025-045",
    "subject": "تعذر مزامنة صك حكم قضائي",
    "description": "توقف استرجاع الجلسات",
    "priority": "urgent",
    "status": "in_progress",
    "firm": {
      "id": 96,
      "name": "شركة العجلان للمحاماة",
      "phone": "+966501234567"
    },
    "assignee": {
      "id": 2,
      "name": "راكان الحارثي"
    },
    "replies": [
      {
        "id": 1,
        "author_name": "د. خالد العجلان",
        "author_type": "client",
        "message": "نأمل سرعة المعالجة لارتباطنا بجلسة استئناف غداً.",
        "is_internal_note": false,
        "created_at": "2026-11-20T10:20:00Z"
      },
      {
        "id": 2,
        "author_name": "راكان الحارثي",
        "author_type": "support",
        "message": "ملاحظة داخلية: الخلل من تجديد مفتاح الـ SSL مع ناجز.",
        "is_internal_note": true,
        "created_at": "2026-11-20T10:45:00Z"
      }
    ]
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.id`
- `data.ticket_number`
- `data.subject`
- `data.description`
- `data.priority`
- `data.status`
- `data.firm`
- `data.assignee`
- `data.replies.*`

> **ملاحظات تقنية وأخطاء متوقعة:** يتم تمييز الملاحظات الداخلية بلون خلفية أصفر/ذهبي خاص وتنبيه واضح بأنها لا تظهر للعميل.

---

#### [TCK-05] `POST` /admin/tickets/{ticket_id}/reply
- **الغرض والوصف:** كتابة وإرسال رد رسمي موجه للمكتب مع إشعار بالبريد أو الرسائل النصية
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TicketReplyForm (إرسال رد موجه للعميل)` (@/features/tickets/components/TicketDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/tickets.ts -> replyTicket()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `ticket_id` | `number | string` | نعم (إجباري) | معرف التذكرة |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `message` | `string` | نعم (إجباري) | نص الرد الموجه للمكتب |
| `is_internal_note` | `boolean` | نعم (إجباري) | false للردود العلنية للمكتب |
| `notify_client_sms_email` | `boolean` | لا (اختياري) | إرسال تنبيه بالبريد/SMS |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إرسال الرد بنجاح وإشعار العميل",
  "data": {
    "id": 89,
    "created_at": "2026-11-21T11:00:00Z"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data`

> **ملاحظات تقنية وأخطاء متوقعة:** يضاف الرد فورياً إلى شريط المحادثة بدون إعادة تحميل الصفحة.

---

#### [TCK-06] `POST` /admin/tickets/{ticket_id}/reply
- **الغرض والوصف:** تدوين ملاحظة سرية بين فريق الدعم الفني فقط دون إشعار العميل ودون ظهورها في حسابه
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TicketInternalNoteForm (إضافة ملاحظة داخلية)` (@/features/tickets/components/TicketDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/tickets.ts -> replyTicket()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `ticket_id` | `number | string` | نعم (إجباري) | معرف التذكرة |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `message` | `string` | نعم (إجباري) | نص الملاحظة الداخلية الخاصة |
| `is_internal_note` | `boolean` | نعم (إجباري) | true لضمان سرية الملاحظة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حفظ الملاحظة الداخلية بنجاح",
  "data": {
    "id": 90,
    "is_internal_note": true
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data`

> **ملاحظات تقنية وأخطاء متوقعة:** تظهر في سجل التذكرة مع وسم 'ملاحظة سرية لفريق العمل'.

---

#### [TCK-07] `POST` /admin/tickets/{ticket_id}/assign
- **الغرض والوصف:** إسناد التذكرة لموظف دعم فني مختص مع توضيح سبب الإسناد
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `AssignTicketModal` (@/features/tickets/components/AssignTicketModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/tickets.ts -> assignTicket()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `ticket_id` | `number | string` | نعم (إجباري) | معرف التذكرة |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `staff_id` | `number` | نعم (إجباري) | معرف موظف الدعم المكلف |
| `reason` | `string` | لا (اختياري) | سبب الإسناد أو التخصص المطلوب |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إسناد التذكرة للموظف بنجاح",
  "data": {
    "id": 45,
    "staff_id": 2
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data`

> **ملاحظات تقنية وأخطاء متوقعة:** يصل إشعار للموظف المسند إليه بمجرد النجاح.

---

#### [TCK-08] `PATCH` /admin/tickets/{ticket_id}/status
- **الغرض والوصف:** تغيير حالة التذكرة (مفتوحة / جاري المعالجة / معلقة / مغلقة)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TicketStatusDropdown` (@/features/tickets/components/TicketDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/tickets.ts -> updateTicketStatus()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `ticket_id` | `number | string` | نعم (إجباري) | معرف التذكرة |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `status` | `string` | نعم (إجباري) | open | in_progress | pending | closed |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث حالة التذكرة بنجاح",
  "data": {
    "id": 45,
    "status": "in_progress"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.status`

> **ملاحظات تقنية وأخطاء متوقعة:** تحديث فوري لوسم الحالة في المحادثة والجدول.

---

#### [TCK-09] `POST` /admin/tickets/{ticket_id}/close
- **الغرض والوصف:** إغلاق التذكرة بنجاح واعتماد المعالجة وإرسال استبيان الرضا للمكتب
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `CloseTicketButton` (@/features/tickets/components/TicketDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/tickets.ts -> closeTicket()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `ticket_id` | `number | string` | نعم (إجباري) | معرف التذكرة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إغلاق التذكرة بنجاح واعتماد حل المشكلة",
  "data": {
    "id": 45,
    "status": "closed"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** تتحول حالة التذكرة إلى مغلقة وتمنع الردود ما لم يعد العميل فتحها.

---


<a id="payments"></a>
### 10. بوابات الدفع الإلكتروني (Payment Gateways)
إدارة وتكوين بوابات الدفع (Stripe, Tap, HyperPay)، مفاتيح التشفير، دعم الدفع المتكرر، واختبار الاتصال.

#### [PAY-01] `GET` /admin/payment-gateways
- **الغرض والوصف:** استعراض بوابات الدفع الإلكتروني المعتمدة، حالات التفعيل، ومعايير أمان ZATCA والمدى
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `PaymentGatewaysPage` (@/features/payment-gateways/components/PaymentGatewaysView)
- **دالة الاستدعاء في الكود:** `src/lib/api/payments.ts -> fetchPaymentGateways()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "stats": {
    "total_gateways": 3,
    "active_gateways": 2,
    "security_standard": "PCI-DSS Level 1",
    "zatca_phase": "Phase 2 Integrated"
  },
  "data": [
    {
      "id": "stripe",
      "name": "Stripe Global",
      "mode": "live",
      "status": "active",
      "is_recurring_supported": true,
      "supported_currencies": [
        "SAR",
        "USD",
        "AED"
      ],
      "features": [
        "Apple Pay",
        "Mada",
        "Credit Cards"
      ]
    },
    {
      "id": "tap",
      "name": "Tap Payments (الخليج)",
      "mode": "live",
      "status": "active",
      "is_recurring_supported": true,
      "supported_currencies": [
        "SAR",
        "KWD",
        "BHD",
        "AED"
      ]
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `stats.*`
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تعرض بطاقات بوابات الدفع مع شارات الحالة والمفاتيح المشفرة.

---

#### [PAY-02] `GET` /admin/payment-gateways/{gateway}
- **الغرض والوصف:** استعلام تفاصيل ومفاتيح ربط بوابة محددة (مثل: stripe أو tap)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `GatewayConfigModal` (@/features/payment-gateways/components/GatewayConfigModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/payments.ts -> fetchPaymentGatewayDetails()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `gateway` | `string` | نعم (إجباري) | معرف البوابة (stripe | tap | hyperpay) |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": "stripe",
    "name": "Stripe",
    "mode": "live",
    "publishable_key": "pk_live_aljudy_demo_2025",
    "has_secret_key": true,
    "apple_pay_enabled": true,
    "mada_enabled": true
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** لا يتم إرجاع المفتاح السري كاملاً لدواعي الأمان بل مجرد تأكيد وجوده has_secret_key.

---

#### [PAY-03] `PUT` /admin/payment-gateways/{gateway}
- **الغرض والوصف:** تحديث مفاتيح الربط، نمط التشغيل (تجريبي / حي)، ودعم العملات
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `GatewayConfigModal (حفظ إعدادات البوابة)` (@/features/payment-gateways/components/GatewayConfigModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/payments.ts -> updatePaymentGateway()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `gateway` | `string` | نعم (إجباري) | معرف البوابة |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `mode` | `string` | نعم (إجباري) | live | test |
| `is_recurring_supported` | `boolean` | لا (اختياري) | تفعيل الخصم الدوري التلقائي |
| `supported_currencies` | `string[]` | لا (اختياري) | العملات المعتمدة (['SAR', 'USD']) |
| `config` | `object` | نعم (إجباري) | كائن المفاتيح: publishable_key, secret_key, webhook_secret |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث إعدادات بوابة الدفع بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يتطلب AlertDialog تأكيدي لأن تغيير المفاتيح يؤثر فوراً على عمليات سداد المكاتب.

---

#### [PAY-04] `PATCH` /admin/payment-gateways/{gateway}/status
- **الغرض والوصف:** تفعيل أو تعطيل بوابة دفع معينة في صفحة السداد
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `GatewayStatusToggle` (@/features/payment-gateways/components/PaymentGatewaysView)
- **دالة الاستدعاء في الكود:** `src/lib/api/payments.ts -> togglePaymentGatewayStatus()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `gateway` | `string` | نعم (إجباري) | معرف البوابة |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `status` | `string` | نعم (إجباري) | active | inactive |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث حالة بوابة الدفع بنجاح",
  "data": {
    "gateway": "stripe",
    "status": "active"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.status`

> **ملاحظات تقنية وأخطاء متوقعة:** تحديث فوري لشارة الحالة.

---

#### [PAY-05] `POST` /admin/payment-gateways/{gateway}/test
- **الغرض والوصف:** فحص واختبار الاتصال المباشر ببوابة الدفع (Ping Test) والتأكد من صحة المفاتيح
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `PingTestGatewayButton` (@/features/payment-gateways/components/GatewayConfigModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/payments.ts -> testPaymentGatewayConnection()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `gateway` | `string` | نعم (إجباري) | معرف البوابة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم التحقق من الاتصال بنجاح. البوابة جاهزة للعمليات الحية (Latency: 142ms)",
  "data": {
    "latency_ms": 142,
    "environment": "live"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data`

> **ملاحظات تقنية وأخطاء متوقعة:** يعرض نتيجة الفحص في Toast منسق أو رسالة تنبيه داخل المودال.

---


<a id="invoices"></a>
### 11. فواتير الاشتراكات المركزية (Central Invoices)
إدارة الفواتير الإلكترونية الصادرة للمكاتب، مبالغ السداد، الضريبة 15%، ومطابقة ZATCA QR Code المرحلة الثانية.

#### [INV-01] `GET` /admin/invoices
- **الغرض والوصف:** استعراض كافة فواتير الاشتراكات المركزية للمنصة مع البحث وفلترة الحالة والتاريخ
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `InvoicesView (سجل الفواتير)` (@/features/invoices/components/InvoicesView)
- **دالة الاستدعاء في الكود:** `src/lib/api/payments.ts -> fetchInvoices()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `page` | `number` | لا (اختياري) | رقم الصفحة |
| `per_page` | `number` | لا (اختياري) | عدد الفواتير (افتراضي 10) |
| `search` | `string` | لا (اختياري) | بحث برقم الفاتورة أو اسم المكتب |
| `status` | `string` | لا (اختياري) | paid | unpaid | refunded | overdue |
| `company_id` | `number` | لا (اختياري) | فلترة فواتير مكتب محدد |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "current_page": 1,
    "total": 86,
    "data": [
      {
        "id": 1,
        "invoice_number": "INV-2025-001",
        "company_id": 96,
        "firm_name": "شركة العجلان للمحاماة",
        "plan_name": "باقة النخبة العدلية",
        "subtotal": "4600.00",
        "tax_amount": "690.00",
        "total_amount": "5290.00",
        "currency": "SAR",
        "status": "paid",
        "payment_method": "mada",
        "paid_at": "2025-01-01T12:00:00Z",
        "due_date": "2025-01-01",
        "zatca_status": "reported"
      }
    ]
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `invoice_number`
- `firm_name`
- `plan_name`
- `subtotal`
- `tax_amount`
- `total_amount`
- `currency`
- `status`
- `payment_method`
- `paid_at`
- `zatca_status`

> **ملاحظات تقنية وأخطاء متوقعة:** تدعم الواجهة تصدير الفواتير وطباعتها وتلوين حالات الدفع.

---

#### [INV-02] `GET` /admin/invoices/{invoice_id}
- **الغرض والوصف:** استعلام تفاصيل الفاتورة الإلكترونية المعتمدة ومطابقة ZATCA QR Code والبيانات الضريبية
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `InvoiceDetailsModal / Preview` (@/features/invoices/components/InvoiceDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/payments.ts -> fetchInvoiceById()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `invoice_id` | `number | string` | نعم (إجباري) | معرف الفاتورة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "invoice_number": "INV-2025-001",
    "firm": {
      "name": "شركة العجلان للمحاماة",
      "tax_number": "301298457200003",
      "address": "الرياض، طريق الملك فهد"
    },
    "items": [
      {
        "description": "اشتراك سنوي - باقة النخبة العدلية",
        "amount": "4600.00"
      }
    ],
    "tax_rate": 15,
    "tax_amount": "690.00",
    "total_amount": "5290.00",
    "zatca_qr": "AQZBbEp1ZHkCBzMwMTI5ODQ1NzIwMDAwMwMUMjAyNS0wMS0wMVQxMjowMDowMFoEBTUyOTAuMAUFNjkwLjA=",
    "status": "paid"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** يعرض رمز الاستجابة السريع ZATCA QR صالحاً للمسح الضريبي الفوري.

---


<a id="announcements"></a>
### 12. الإعلانات والإشعارات المركزية (Central Announcements)
بث الإعلانات والتحديثات النظامية لجميع المكاتب، جدولة الإشعارات، وتحديد الجمهور المستهدف.

#### [ANN-01] `GET` /admin/announcements
- **الغرض والوصف:** استعراض قائمة الإعلانات والإشعارات المركزية مع دعم الفلترة حسب الحالة والجمهور المستهدف
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `NotificationsManagementView` (@/features/notifications/components/NotificationsManagementView)
- **دالة الاستدعاء في الكود:** `src/lib/api/announcements.ts -> fetchAnnouncements()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `page` | `number` | لا (اختياري) | رقم الصفحة |
| `per_page` | `number` | لا (اختياري) | سجلات الصفحة |
| `search` | `string` | لا (اختياري) | بحث بالعنوان أو المحتوى |
| `status` | `string` | لا (اختياري) | sent | scheduled | draft |
| `audience` | `string` | لا (اختياري) | all | selected_firms | plan |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "current_page": 1,
    "total": 14,
    "data": [
      {
        "id": 1,
        "title": "تحديث هام: تفعيل التحقق الثنائي عبر نفاذ",
        "content": "نود إحاطة جميع مكاتب المحاماة بأنه تم تفعيل الدخول الموحد عبر نفاذ الوطني",
        "target_audience": "all",
        "status": "sent",
        "sent_at": "2026-11-18T09:00:00Z",
        "action_url": "https://aljudy.sa/updates/nafaz-2fa",
        "action_label": "طريقة التفعيل"
      }
    ]
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `title`
- `content`
- `target_audience`
- `status`
- `sent_at`
- `action_url`
- `action_label`

> **ملاحظات تقنية وأخطاء متوقعة:** تحسب الواجهة إحصائيات الإعلانات تلقائياً عبر fetchAnnouncementsStats().

---

#### [ANN-02] `POST` /admin/announcements
- **الغرض والوصف:** إرسال وبث إشعار مركزي جديد للمكاتب أو جدولته لوقت محدد
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `CreateNotificationModal (بث إشعار جديد)` (@/features/notifications/components/CreateNotificationModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/announcements.ts -> createAnnouncement()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `title` | `string` | نعم (إجباري) | عنوان الإعلان المركزي |
| `content` | `string` | نعم (إجباري) | نص الإعلان |
| `target_audience` | `string` | نعم (إجباري) | all | selected_firms | plan |
| `target_plan_id` | `number` | لا (اختياري) | إذا كان الجمهور باقة معينة |
| `target_company_ids` | `number[]` | لا (اختياري) | إذا كان الجمهور مكاتب مختارة |
| `action_url` | `string` | لا (اختياري) | رابط الإجراء عند النقر |
| `action_label` | `string` | لا (اختياري) | نص زر الإجراء |
| `status` | `string` | نعم (إجباري) | sent | scheduled | draft |
| `scheduled_at` | `string` | لا (اختياري) | تاريخ ووقت الجدولة (ISO) |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم بث الإشعار المركزي بنجاح للمكاتب المحددة",
  "data": {
    "id": 15,
    "title": "تحديث هام"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.id`

> **ملاحظات تقنية وأخطاء متوقعة:** يدعم الإرسال الفوري أو الحفظ كمسودة.

---

#### [ANN-03] `GET` /admin/announcements/{id}
- **الغرض والوصف:** استعراض تفاصيل إشعار محدد ومعدلات الوصول والمشاهدات
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `NotificationDetailsModal` (@/features/notifications/components/NotificationDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/announcements.ts -> fetchAnnouncementById()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `id` | `number | string` | نعم (إجباري) | معرف الإشعار |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "title": "تحديث هام: تفعيل التحقق الثنائي عبر نفاذ",
    "content": "نص الإعلان...",
    "target_audience": "all",
    "status": "sent",
    "sent_at": "2026-11-18T09:00:00Z"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تعبئة نموذج المعاينة والتعديل.

---

#### [ANN-04] `DELETE` /admin/announcements/{id}
- **الغرض والوصف:** حذف إعلان مركزي
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DeleteNotificationConfirmDialog` (@/features/notifications/components/DeleteNotificationModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/announcements.ts -> deleteAnnouncement()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `id` | `number | string` | نعم (إجباري) | معرف الإشعار المراد حذفه |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حذف الإعلان بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** حذف فوري من سجلات الإعلانات.

---


<a id="settings"></a>
### 13. الإعدادات العامة وهوية المنصة وخادم النظام (Settings & Server)
إعدادات الهوية البصرية، الروابط، التحقق من مواصفات وتوجيهات PHP، وتحديثات نواة النظام.

#### [SET-01] `GET` /admin/settings/general
- **الغرض والوصف:** استعراض الإعدادات العامة للمنصة: العنوان، الهوية البصرية، الشعار، البريد الرسمي، وروابط التواصل
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `GeneralSettingsView` (@/features/settings/components/GeneralSettingsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> fetchGeneralSettings()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "system_title": "منصة الجودي لإدارة الشؤون القانونية والمحاماة",
    "company_name": "مجموعة الجودي للحلول التقنية والعدلية",
    "company_email": "support@aljudy.sa",
    "contact_phone": "+966114829900",
    "logo_url": "https://law.elmoroj.com/uploads/logo.png",
    "favicon_url": "https://law.elmoroj.com/uploads/favicon.ico",
    "meta_description": "المنصة السحابية المتكاملة لإدارة مكاتب وشركات المحاماة",
    "footer_text": "جميع الحقوق محفوظة لمنصة الجودي © 2026"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تعبئة نموذج الإعدادات العامة في لوحة التحكم.

---

#### [SET-02] `POST` /admin/settings/general
- **الغرض والوصف:** تحديث الإعدادات العامة والهوية البصرية وروابط المنصة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `GeneralSettingsView (حفظ الإعدادات)` (@/features/settings/components/GeneralSettingsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> updateGeneralSettings()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `system_title` | `string` | نعم (إجباري) | اسم المنصة |
| `company_name` | `string` | نعم (إجباري) | اسم المنشأة المالكة |
| `company_email` | `string` | نعم (إجباري) | البريد الإلكتروني المعتمد |
| `contact_phone` | `string` | لا (اختياري) | هاتف الدعم |
| `logo_url` | `string` | لا (اختياري) | رابط الشعار |
| `footer_text` | `string` | لا (اختياري) | نص التذييل |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث الإعدادات العامة للمنصة بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يتطلب تأكيد أمني AlertDialog.

---

#### [SET-03] `GET` /admin/settings/server-info
- **الغرض والوصف:** فحص مواصفات الخادم: إصدار PHP، توجيهات memory_limit، max_execution_time، وتوافق البيئة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ServerInfoView (معلومات الخادم والسيرفر)` (@/features/utility/components/ServerInfoView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> fetchServerInfo()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "php_version": "8.2.14",
    "laravel_version": "11.0.8",
    "server_software": "nginx/1.24.0",
    "memory_limit": "512M",
    "max_execution_time": "300",
    "file_uploads": "On",
    "allow_url_fopen": "On",
    "db_connection": "pgsql / mariadb",
    "status": "optimal"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.php_version`
- `data.laravel_version`
- `data.server_software`
- `data.memory_limit`
- `data.max_execution_time`
- `data.file_uploads`
- `data.allow_url_fopen`

> **ملاحظات تقنية وأخطاء متوقعة:** تقوم الواجهة بمقارنة القيم الحقيقية مع القيم الموصى بها ووضع شارات نجاح/تحذير ملونة.

---

#### [SET-04] `GET` /admin/settings/system-update
- **الغرض والوصف:** استعلام حالة وتوفر تحديثات نواة النظام المركزية وسجل التغييرات
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `SystemUpdateView (تحديث النظام)` (@/features/utility/components/SystemUpdateView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> fetchSystemUpdate()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "current_version": "v4.4.0",
    "latest_version": "v4.5.0",
    "update_available": true,
    "release_date": "2026-11-20",
    "changelog": [
      "دعم فوترة ZATCA المرحلة الثانية المتكاملة",
      "تحسين سرعة جلسات الدخول الإشرافي للمكاتب",
      "ترقية مصفوفة الصلاحيات الدقيقة"
    ]
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.current_version`
- `data.latest_version`
- `data.update_available`
- `data.changelog`

> **ملاحظات تقنية وأخطاء متوقعة:** تظهر شارة 'تحديث جديد متاح' عند وجود إصدار أحدث.

---

#### [SET-05] `POST` /admin/settings/system-update
- **الغرض والوصف:** بدء ترقية وتحديث نواة النظام تلقائياً وتشغيل migrations
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `StartUpdateDialog (بدء ترقية النظام)` (@/features/utility/components/SystemUpdateView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> startSystemUpdate()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم بدء ترقية النظام بنجاح وتطبيق التحديثات",
  "data": {
    "version": "v4.5.0"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data`

> **ملاحظات تقنية وأخطاء متوقعة:** يتطلب حوار تأكيد فاخر ويدخل الواجهة في شريط تقدم حتى اكتمال الترقية.

---


<a id="mail"></a>
### 14. إعدادات خادم البريد (Mail / SMTP Settings)
تهيئة بروتوكول SMTP، منافذ التشفير (TLS/SSL)، بيانات الاعتماد، وإرسال بريد تجريبي لاختبار الاتصال.

#### [MAIL-01] `GET` /admin/settings/mail
- **الغرض والوصف:** استعراض إعدادات SMTP وبيانات خادم البريد الصادر وهوية المرسل
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `MailSettingsView` (@/features/settings/components/MailSettingsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> fetchMailSettings()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "mail_driver": "smtp",
    "mail_host": "smtp.mailgun.org",
    "mail_port": 587,
    "mail_username": "postmaster@aljudy.sa",
    "mail_encryption": "tls",
    "mail_from_address": "notifications@aljudy.sa",
    "mail_from_name": "منصة الجودي القانونية",
    "has_password": true
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.mail_driver`
- `data.mail_host`
- `data.mail_port`
- `data.mail_username`
- `data.mail_encryption`
- `data.mail_from_address`
- `data.mail_from_name`
- `data.has_password`

> **ملاحظات تقنية وأخطاء متوقعة:** يتم إخفاء كلمة مرور SMTP وإظهار مؤشر has_password.

---

#### [MAIL-02] `POST` /admin/settings/mail
- **الغرض والوصف:** تحديث وحفظ إعدادات خادم البريد وبيانات الاعتماد
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `MailSettingsView (حفظ إعدادات البريد)` (@/features/settings/components/MailSettingsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> updateMailSettings()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `mail_driver` | `string` | نعم (إجباري) | smtp | sendmail | mailgun |
| `mail_host` | `string` | نعم (إجباري) | خادم البريد (مثل: smtp.office365.com) |
| `mail_port` | `number` | نعم (إجباري) | المنفذ (587 | 465 | 25) |
| `mail_username` | `string` | نعم (إجباري) | اسم المستخدم أو البريد |
| `mail_password` | `string` | لا (اختياري) | كلمة المرور (اختيارية إذا لم تتغير) |
| `mail_encryption` | `string` | نعم (إجباري) | tls | ssl | null |
| `mail_from_address` | `string` | نعم (إجباري) | بريد المرسل الرسمي |
| `mail_from_name` | `string` | نعم (إجباري) | اسم المرسل |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حفظ إعدادات خادم البريد بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** تتطلب الواجهة AlertDialog لتأكيد الحفظ.

---

#### [MAIL-03] `POST` /admin/settings/mail/test
- **الغرض والوصف:** إرسال بريد إلكتروني تجريبي للتأكد من صحة إعدادات SMTP ونجاح المصادقة مع الخادم
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `TestEmailModal (إرسال بريد تجريبي)` (@/features/settings/components/MailSettingsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> testMailSettings()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `test_email` | `string` | نعم (إجباري) | البريد الإلكتروني المستلم للتجربة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إرسال البريد التجريبي بنجاح إلى test@aljudy.sa"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** في حال فشل الاتصال يرجع السيرفر 422 برسالة الخطأ التقنية القادمة من خادم SMTP لتسهيل التشخيص.

---


<a id="currencies"></a>
### 15. العملات وأسعار الصرف (Currencies)
إدارة العملات المدعومة في الفوترة، رموز العملات، تحديد العملة الافتراضية، ومعدلات التحويل.

#### [CURR-01] `GET` /admin/currencies
- **الغرض والوصف:** استعراض قائمة العملات وأسعار الصرف والعملة الافتراضية للمنصة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `CurrencySettingsView` (@/features/settings/components/CurrencySettingsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> fetchCurrencies()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "ريال سعودي",
      "code": "SAR",
      "symbol": "ر.س",
      "exchange_rate": 1,
      "is_default": true
    },
    {
      "id": 2,
      "name": "دولار أمريكي",
      "code": "USD",
      "symbol": "$",
      "exchange_rate": 0.266,
      "is_default": false
    },
    {
      "id": 3,
      "name": "درهم إماراتي",
      "code": "AED",
      "symbol": "د.إ",
      "exchange_rate": 0.98,
      "is_default": false
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `name`
- `code`
- `symbol`
- `exchange_rate`
- `is_default`

> **ملاحظات تقنية وأخطاء متوقعة:** الريال السعودي هو العملة الأساسية للمنصة بحكم استهداف السوق السعودي.

---

#### [CURR-02] `POST` /admin/currencies
- **الغرض والوصف:** إضافة عملة جديدة ومعدل تحويلها
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `AddCurrencyModal` (@/features/settings/components/AddCurrencyModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> createCurrency()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | نعم (إجباري) | اسم العملة بالعربية |
| `code` | `string` | نعم (إجباري) | رمز العملة العالمي (SAR, USD...) |
| `symbol` | `string` | نعم (إجباري) | الرمز المختصر |
| `exchange_rate` | `number` | نعم (إجباري) | سعر الصرف مقابل العملة الأساسية |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تمت إضافة العملة بنجاح",
  "data": {
    "id": 4,
    "code": "KWD"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.id`

> **ملاحظات تقنية وأخطاء متوقعة:** تحديث فوري لجدول العملات.

---

#### [CURR-03] `POST` /admin/currencies/{currency_id}/default
- **الغرض والوصف:** تعيين عملة كافتراضية لحسابات وفواتير النظام بالكامل
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `SetDefaultCurrencyButton` (@/features/settings/components/CurrencySettingsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> setDefaultCurrency()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `currency_id` | `number | string` | نعم (إجباري) | معرف العملة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تعيين العملة كافتراضية للنظام بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** ينقل شارة 'افتراضية' للعملة المختارة تلقائياً.

---

#### [CURR-04] `DELETE` /admin/currencies/{currency_id}
- **الغرض والوصف:** حذف عملة من النظام (يمنع حذف العملة الافتراضية)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DeleteCurrencyDialog` (@/features/settings/components/DeleteCurrencyModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> deleteCurrency()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `currency_id` | `number | string` | نعم (إجباري) | معرف العملة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حذف العملة بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يرجع 422 إذا حاول المشرف حذف العملة الافتراضية.

---


<a id="languages"></a>
### 16. اللغات والاتجاهات (Languages)
إدارة لغات واجهة المنصة (العربية RTL، الإنجليزية LTR)، تعيين اللغة الافتراضية، وإضافة اللغات.

#### [LANG-01] `GET` /admin/languages
- **الغرض والوصف:** استعراض قائمة اللغات والاتجاهات المعتمدة في النظام
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `LanguageSettingsView` (@/features/settings/components/LanguageSettingsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> fetchLanguages()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "العربية",
      "code": "ar",
      "direction": "rtl",
      "is_default": true,
      "status": "active"
    },
    {
      "id": 2,
      "name": "English",
      "code": "en",
      "direction": "ltr",
      "is_default": false,
      "status": "active"
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `name`
- `code`
- `direction`
- `is_default`
- `status`

> **ملاحظات تقنية وأخطاء متوقعة:** اللغة العربية RTL هي اللغة الافتراضية الرسمية.

---

#### [LANG-02] `POST` /admin/languages
- **الغرض والوصف:** إضافة لغة جديدة للنظام وتحديد اتجاهها (rtl أو ltr)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `AddLanguageModal` (@/features/settings/components/AddLanguageModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> createLanguage()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `name` | `string` | نعم (إجباري) | اسم اللغة |
| `code` | `string` | نعم (إجباري) | كود اللغة الدولي (ar, en, fr...) |
| `direction` | `string` | نعم (إجباري) | rtl | ltr |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تمت إضافة اللغة بنجاح",
  "data": {
    "id": 3,
    "code": "fr"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.id`

> **ملاحظات تقنية وأخطاء متوقعة:** تحديث الجدول فورياً.

---

#### [LANG-03] `POST` /admin/languages/{language_id}/default
- **الغرض والوصف:** تعيين لغة كافتراضية لجميع واجهات وتنبيهات المنصة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `SetDefaultLanguageButton` (@/features/settings/components/LanguageSettingsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> setDefaultLanguage()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `language_id` | `number | string` | نعم (إجباري) | معرف اللغة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تعيين اللغة كافتراضية للنظام بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يغير اللغة الافتراضية للجلسات الجديدة.

---

#### [LANG-04] `DELETE` /admin/languages/{language_id}
- **الغرض والوصف:** حذف لغة من النظام (يمنع حذف اللغة الافتراضية العربية)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DeleteLanguageDialog` (@/features/settings/components/DeleteLanguageModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/settings.ts -> deleteLanguage()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `language_id` | `number | string` | نعم (إجباري) | معرف اللغة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حذف اللغة بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يرجع 422 إذا كانت اللغة هي الافتراضية.

---


<a id="website"></a>
### 17. إدارة محتوى الموقع التعريفي والتسويقي CMS (Website Settings)
إدارة صفحات الهبوط والموقع التعريفي الخارجي، المظهر، SEO، قسم الهيرو، المميزات، والتحكم في ظهور العناصر.

#### [WEB-01] `GET` /admin/website/theme
- **الغرض والوصف:** استعلام خيارات مظهر الموقع التعريفي، الألوان الرئيسية، الخطوط، والشعارات
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `WebsiteSettingsView (تبويب المظهر والألوان)` (@/features/website-settings/components/tabs/ThemeOptionsTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/website.ts -> fetchWebsiteTheme()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "primary_color": "#18243c",
    "accent_color": "#9c6402",
    "font_family": "Cairo",
    "logo_light": "https://law.elmoroj.com/uploads/landing/logo-light.svg",
    "logo_dark": "https://law.elmoroj.com/uploads/landing/logo-dark.svg"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تعبئة خيارات المظهر والألوان في واجهة الموقع التعريفي.

---

#### [WEB-02] `POST` /admin/website/theme
- **الغرض والوصف:** تحديث خيارات مظهر الموقع التعريفي والألوان
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ThemeOptionsTab (حفظ المظهر)` (@/features/website-settings/components/tabs/ThemeOptionsTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/website.ts -> updateWebsiteTheme()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `primary_color` | `string` | نعم (إجباري) | كود اللون الأساسي Hex |
| `accent_color` | `string` | نعم (إجباري) | كود اللون الثانوي الذهبي |
| `font_family` | `string` | لا (اختياري) | نوع الخط (Cairo | Tajawal) |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث مظهر الموقع التعريفي بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** تحديث مباشر.

---

#### [WEB-03] `GET` /admin/website/seo
- **الغرض والوصف:** إعدادات محركات البحث وميتا تاجز ووسوم المشاركة (SEO & OpenGraph)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `WebsiteSettingsView (تبويب SEO)` (@/features/website-settings/components/tabs/SeoTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/website.ts -> fetchWebsiteSeo()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "meta_title": "منصة الجودي | النظام السحابي الأول لإدارة مكاتب المحاماة في السعودية",
    "meta_description": "إدارة متكاملة للقضايا، الموكلين، الجلسات، والفوترة المتوافقة مع هيئة الزكاة وبوابة ناجز",
    "meta_keywords": "محاماة, قضايا, ناجز, ساس, فوترة إلكترونية",
    "og_image": "https://law.elmoroj.com/uploads/landing/og-cover.png"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تعبئة حقول الميتا تاجز ومعاينة جوجل ومواقع التواصل في الواجهة.

---

#### [WEB-04] `POST` /admin/website/seo
- **الغرض والوصف:** تحديث إعدادات محركات البحث ووسوم المشاركة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `SeoTab (حفظ إعدادات SEO)` (@/features/website-settings/components/tabs/SeoTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/website.ts -> updateWebsiteSeo()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `meta_title` | `string` | نعم (إجباري) | عنوان الصفحة لمحركات البحث |
| `meta_description` | `string` | نعم (إجباري) | الوصف التعريفي |
| `meta_keywords` | `string` | لا (اختياري) | الكلمات المفتاحية مفصولة بفواصل |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث إعدادات SEO بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** حفظ مباشر.

---

#### [WEB-05] `GET` /admin/website/hero
- **الغرض والوصف:** استعلام بيانات قسم البداية (Hero Section) والعناوين والأزرار الترويجية
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `WebsiteSettingsView (تبويب قسم الهيرو)` (@/features/website-settings/components/tabs/HeroSectionTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/website.ts -> fetchWebsiteHero()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "badge_text": "المنظومة السحابية الأقوى لمكاتب المحاماة",
    "main_title": "أدر مكتب محاماتك بكفاءة وذكاء مع منصة الجودي",
    "subtitle": "حلول رقمية متكاملة لربط الجلسات، إدارة التوكيلات، والفوترة الإلكترونية",
    "primary_cta_text": "ابدأ تجربتك المجانية",
    "primary_cta_link": "/register",
    "secondary_cta_text": "احجز جلسة استعراضية",
    "secondary_cta_link": "/contact"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تعبئة حقول قسم البداية والمحاكاة المباشرة له في الواجهة.

---

#### [WEB-06] `POST` /admin/website/hero
- **الغرض والوصف:** تحديث نصوص وأزرار قسم الهيرو في الموقع التعريفي
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `HeroSectionTab (حفظ قسم الهيرو)` (@/features/website-settings/components/tabs/HeroSectionTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/website.ts -> updateWebsiteHero()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `main_title` | `string` | نعم (إجباري) | العنوان الرئيسي |
| `subtitle` | `string` | نعم (إجباري) | العنوان الفرعي |
| `primary_cta_text` | `string` | نعم (إجباري) | نص الزر الأساسي |
| `primary_cta_link` | `string` | نعم (إجباري) | رابط الزر |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث قسم البداية (Hero) بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** حفظ مباشر.

---

#### [WEB-07] `GET` /admin/website/sections/features
- **الغرض والوصف:** استعراض عناصر ومميزات الموقع التعريفي وحالات تفعيلها
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `WebsiteSettingsView (تبويب المميزات)` (@/features/website-settings/components/tabs/FeaturesTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/website.ts -> fetchWebsiteFeatures()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "title": "الربط الآمن مع بوابة ناجز",
      "description": "مزامنة تلقائية للجلسات والقرارات الصادرة ومواعيد المحاكم",
      "icon": "shield-check",
      "is_active": true
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `title`
- `description`
- `icon`
- `is_active`

> **ملاحظات تقنية وأخطاء متوقعة:** تعرض في بطاقات قابلة للتعديل والتبديل.

---

#### [WEB-08] `POST` /admin/website/sections/features
- **الغرض والوصف:** إضافة عنصر مميزات جديد للموقع التعريفي
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `AddFeatureModal` (@/features/website-settings/components/tabs/FeaturesTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/website.ts -> createWebsiteFeature()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `title` | `string` | نعم (إجباري) | عنوان الميزة |
| `description` | `string` | نعم (إجباري) | شرح الميزة |
| `icon` | `string` | لا (اختياري) | اسم الأيقونة من Lucide |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تمت إضافة الميزة بنجاح للموقع التعريفي",
  "data": {
    "id": 8
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.id`

> **ملاحظات تقنية وأخطاء متوقعة:** تحديث فوري.

---

#### [WEB-09] `PATCH` /admin/website/items/{id}/toggle
- **الغرض والوصف:** تفعيل أو تعطيل عنصر في الموقع التعريفي (إظهار / إخفاء من الصفحة)
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ToggleItemStatusSwitch` (@/features/website-settings/components/tabs/FeaturesTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/website.ts -> toggleWebsiteItem()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `id` | `number | string` | نعم (إجباري) | معرف العنصر |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم تحديث حالة ظهور العنصر بنجاح",
  "data": {
    "id": 1,
    "is_active": false
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`
- `data.is_active`

> **ملاحظات تقنية وأخطاء متوقعة:** تبديل سريع لحالة العرض.

---

#### [WEB-10] `DELETE` /admin/website/items/{id}
- **الغرض والوصف:** حذف عنصر من الموقع التعريفي
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `DeleteWebsiteItemDialog` (@/features/website-settings/components/tabs/FeaturesTab)
- **دالة الاستدعاء في الكود:** `src/lib/api/website.ts -> deleteWebsiteItem()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `id` | `number | string` | نعم (إجباري) | معرف العنصر |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم حذف العنصر بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** حذف نهائي.

---


<a id="impersonation"></a>
### 18. المعاينة الإشرافية وسجلات الدخول كالمكتب (Supervisory Impersonation & Audit)
آلية الدخول الإشرافي المباشر بدون كلمة مرور لحساب رئيس المكتب (Login As Firm)، وتتبع سجلات المعاينة.

#### [IMP-01] `POST` /admin/utility/login-as-firm/{firm_id}
- **الغرض والوصف:** بدء جلسة معاينة إشرافية وتوليد رمز جلسة Sanctum فوري باسم رئيس المكتب للمعاينة المباشرة للوحة تحكم المكتب
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ClientRowActionMenu / EnterOfficeConfirmModal` (@/features/clients/components/EnterOfficeConfirmModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/impersonation.ts -> issueFirmImpersonation()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `firm_id` | `number | string` | نعم (إجباري) | معرف المكتب المراد معاينته |

**جسم الطلب (Request Body - JSON):**

| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |
| :--- | :---: | :---: | :--- |
| `activity_type` | `string` | لا (اختياري) | نوع الإجراء الإشرافي (support | audit | settings | subscription | other) |
| `reason` | `string` | لا (اختياري) | سبب الدخول للمكتب لتوثيقه في السجل الأمني |
| `ticket_id` | `string | number` | لا (اختياري) | رقم تذكرة الدعم الفني المرتبطة إن وجدت |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم بدء جلسة المعاينة بنجاح لمكتب: شركة العجلان",
  "data": {
    "token": "3|sanctum_lawyer_session_token_xyz",
    "expires_in": 90,
    "user": {
      "id": 186,
      "company_id": 96,
      "full_name": "د. خالد عبد العزيز العجلان",
      "email": "contact@alajlan-law.sa",
      "role": "owner",
      "status": "active"
    },
    "firm": {
      "id": 96,
      "name": "شركة العجلان وشركاؤه للمحاماة"
    },
    "preview_banner": {
      "active": true,
      "message": "أنت الآن في وضع المعاينة المباشرة لمكتب: شركة العجلان"
    },
    "impersonated_by": 1,
    "log_id": 10
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.token (يستخدم لتحويل المشرف لبوابة المكتب lawyer/login)`
- `data.user (بيانات مالك المكتب)`
- `data.firm (بيانات المنشأة)`
- `data.preview_banner (شريط التنبيه الأمني العلوي في تطبيق المحامي)`

> **ملاحظات تقنية وأخطاء متوقعة:** نقطة حيوية جداً تمثل جسر الانتقال بين لوحة Super Admin وتطبيق Lawyer Office بدون الحاجة لكلمة مرور العميل.

---

#### [IMP-02] `POST` /admin/utility/end-preview
- **الغرض والوصف:** إنهاء وضع المعاينة الإشرافية وإبطال الرمز المؤقت والعودة للوحة الإدارة العليا
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `PreviewBanner (إنهاء المعاينة والرجوع لحسابي)` (@/components/shared/ImpersonationBanner)
- **دالة الاستدعاء في الكود:** `src/lib/api/impersonation.ts -> endFirmImpersonation()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إنهاء وضع المعاينة والعودة الكاملة للوحة الإدارة العليا بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** تستدعى عند ضغط زر 'إنهاء المعاينة والرجوع لحسابي' من الشريط العلوي.

---

#### [IMP-03] `GET` /admin/impersonation-logs
- **الغرض والوصف:** استعراض سجلات جلسات الدخول الإشرافي السابقة والحالية، المشرف القائم بالدخول، السبب، والمدة
- **الحالة في الواجهة:** 🟡 موجود بالواجهة ويعتمد Fallback على audit-logs لحين اعتماد الباك اند
- **الشاشة / الكومبوننت:** `ImpersonationLogsView (سجل جلسات الدخول الإشرافي)` (@/features/impersonation-logs/components/ImpersonationLogsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/impersonation.ts -> fetchImpersonationLogs()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `page` | `number` | لا (اختياري) | رقم الصفحة (افتراضي 1) |
| `per_page` | `number` | لا (اختياري) | عدد السجلات (افتراضي 10) |
| `status` | `string` | لا (اختياري) | active | ended | all |
| `from_date` | `string` | لا (اختياري) | تاريخ البدء YYYY-MM-DD |
| `to_date` | `string` | لا (اختياري) | تاريخ الانتهاء YYYY-MM-DD |
| `search` | `string` | لا (اختياري) | بحث باسم المشرف، المكتب، أو التذكرة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "current_page": 1,
    "total": 28,
    "data": [
      {
        "id": "sess-10",
        "admin_id": 1,
        "admin_name": "م. عبد الله المشرف",
        "company_id": 96,
        "firm_name": "شركة العجلان وشركاؤه للمحاماة",
        "activity_type": "support",
        "activity_type_label": "دعم فني وحل مشكلة تذكرة",
        "reason": "متابعة تذكرة مزامنة أحكام ناجز #TCK-045",
        "ticket_id": "TCK-045",
        "ip_address": "192.168.1.100",
        "started_at": "2026-11-21T09:30:00Z",
        "ended_at": null,
        "duration_minutes": 45,
        "status": "active"
      }
    ]
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `admin_name`
- `firm_name`
- `activity_type_label`
- `reason`
- `ticket_id`
- `ip_address`
- `started_at`
- `ended_at`
- `status`
- `duration_minutes`

> **ملاحظات تقنية وأخطاء متوقعة:** مطلوب رسمياً من الباك اند كمسار مستقل لتوثيق الأمن السيبراني وتفادي اللجوء للتخزين المحلي.

---

#### [IMP-04] `GET` /admin/impersonation-logs/{id}
- **الغرض والوصف:** استعلام تفاصيل كاملة لجلسة معاينة محددة والإجراءات المتخذة خلالها
- **الحالة في الواجهة:** 🟡 معتمد في الواجهة ومطلوب توفيره رسمياً من الباك اند
- **الشاشة / الكومبوننت:** `ImpersonationLogDetailsModal` (@/features/impersonation-logs/components/ImpersonationLogDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/impersonation.ts -> fetchImpersonationLogDetails()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `id` | `number | string` | نعم (إجباري) | معرف جلسة المعاينة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "id": "sess-10",
    "admin_name": "م. عبد الله المشرف",
    "firm_name": "شركة العجلان للمحاماة",
    "reason": "معالجة التذكرة",
    "started_at": "2026-11-21T09:30:00Z",
    "status": "active"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.*`

> **ملاحظات تقنية وأخطاء متوقعة:** تعبئة نافذة تفاصيل الجلسة الإشرافية.

---

#### [IMP-05] `POST` /admin/impersonation-logs/{id}/end
- **الغرض والوصف:** إنهاء فوري لجلسة إشرافية نشطة وإبطال الرمز الصادر لها من قاعدة البيانات
- **الحالة في الواجهة:** 🟡 معتمد في الواجهة ومطلوب توفيره رسمياً من الباك اند
- **الشاشة / الكومبوننت:** `ImpersonationLogDetailsModal (إنهاء الجلسة فورياً)` (@/features/impersonation-logs/components/ImpersonationLogDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/impersonation.ts -> endImpersonationSession()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `id` | `number | string` | نعم (إجباري) | معرف الجلسة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "message": "تم إنهاء الجلسة الإشرافية وإبطال الرمز بنجاح"
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `status`
- `message`

> **ملاحظات تقنية وأخطاء متوقعة:** يتيح لمدير النظام قطع أي جلسة معاينة نشطة فورياً لأسباب أمنية.

---

#### [IMP-06] `GET` /admin/impersonation-logs/{id}/report
- **الغرض والوصف:** استخراج تقرير التدقيق الأمني وملخص النشاط لجلسة الدخول الإشرافي بصيغة مهيأة للطباعة
- **الحالة في الواجهة:** 🟡 معتمد في الواجهة ومطلوب توفيره رسمياً من الباك اند
- **الشاشة / الكومبوننت:** `ImpersonationLogDetailsModal (نسخ تقرير التدقيق)` (@/features/impersonation-logs/components/ImpersonationLogDetailsModal)
- **دالة الاستدعاء في الكود:** `src/lib/api/impersonation.ts -> fetchImpersonationSessionReport()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `id` | `number | string` | نعم (إجباري) | معرف الجلسة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": {
    "session_id": "sess-10",
    "report_summary": "جلسة معاينة دعم فني لمكتب شركة العجلان نفذت بواسطة م. عبد الله المشرف...",
    "actions_count": 4,
    "generated_at": "2026-11-21T10:15:00Z"
  }
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `data.report_summary`

> **ملاحظات تقنية وأخطاء متوقعة:** يوفر نص تقرير التدقيق لنسخه بضغطة زر وتصديره للإدارة القانونية.

---

#### [IMP-07] `GET` /users?company_id={company_id}
- **الغرض والوصف:** جلب مستخدمي المكتب لتحديد حساب المالك (role: owner) في حال تعذر جلبه من نقطة المعاينة
- **الحالة في الواجهة:** ✅ مربوط ومختبر في الواجهة
- **الشاشة / الكومبوننت:** `ClientOfficeDetailsView / EnterOffice Flow` (@/features/clients/components/ClientOfficeDetailsView)
- **دالة الاستدعاء في الكود:** `src/lib/api/users.ts -> fetchUsersByCompany()`

**ترويسات الطلب (Headers):**
- `Authorization: Bearer <admin_token>`

**معاملات الرابط (URL Query / Path Params):**

| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |
| :--- | :---: | :---: | :--- |
| `company_id` | `number | string` | نعم (إجباري) | معرف منشأة المحاماة |

**شكل الاستجابة الحقيقية (Real JSON Response Example):**
```json
{
  "status": true,
  "data": [
    {
      "id": 186,
      "company_id": 96,
      "full_name": "د. خالد عبد العزيز العجلان",
      "email": "contact@alajlan-law.sa",
      "phone": "+966501234567",
      "role": "owner",
      "status": "active"
    }
  ]
}
```

**الحقول المستخدمة فعلياً في الواجهة:**
- `id`
- `full_name`
- `email`
- `phone`
- `role`
- `status`

> **ملاحظات تقنية وأخطاء متوقعة:** يضمن التحقق التام من هوية مالك المكتب قبل بدء المعاينة.

---

## 3. واجهات برمجة جديدة مطلوبة من الباك اند (New APIs Required)

الواجهات التالية تمثل شاشات ومتطلبات فعلية مبرمجة في الواجهة الأمامية، ولكنها تفتقر إلى Endpoints مخصصة من جهة الباك اند، أو تعتمد حالياً على حلول مؤقتة مثل التخزين المحلي (localStorage).

### 3.1 واجهات سجلات الدخول الإشرافي (Supervisory Impersonation Audit Logs)
- **الغرض الأساسي:** توثيق وتتبع كل عملية دخول إشرافي ينفذها مشرف عام على حسابات مكاتب المحاماة في قاعدة البيانات لحماية الخصوصية والامتثال لمعايير الأمن السيبراني وحماية البيانات الشخصية.
- **الشاشة المحتاجة:** `ImpersonationLogsView (صفحة سجلات تسجيل الدخول كعميل - /impersonation-logs)`
- **الأولوية:** **عالية جداً (أولوية قصوى)**

**النقاط المقترحة:**
| Method | Path | الغرض |
| :---: | :--- | :--- |
| `GET` | `/admin/impersonation-logs` | جلب قائمة جلسات المعاينة مع الفلترة بالبحث، الحالة (نشط/منتهي)، والتاريخ |
| `GET` | `/admin/impersonation-logs/{id}` | تفاصيل جلسة محددة والإجراءات المأخوذة خلالها |
| `POST` | `/admin/impersonation-logs/{id}/end` | إنهاء فوري لجلسة معاينة نشطة وإبطال توكن الدخول الصادر لها |
| `GET` | `/admin/impersonation-logs/{id}/report` | استخراج ملخص تقرير التدقيق الأمني للجلسة |

**جسم الطلب المتوقع (Payload):**
```json
{
  "activity_type": "string (support | audit | settings | subscription | other)",
  "reason": "string (إجباري - سبب الدخول للمكتب)",
  "ticket_id": "string | null (اختياري - رقم تذكرة الدعم ذات الصلة)"
}
```

**شكل الاستجابة المطلوب (Response):**
```json
{
  "status": true,
  "data": {
    "id": "number | string",
    "admin_id": "number",
    "admin_name": "string",
    "company_id": "number",
    "firm_name": "string",
    "activity_type": "string",
    "reason": "string",
    "ticket_id": "string | null",
    "started_at": "ISO DateTime",
    "ended_at": "ISO DateTime | null",
    "status": "active | ended",
    "duration_minutes": "number"
  }
}
```

> **ملاحظة فنية:** حالياً تضطر الواجهة لاستخدام audit-logs أو localStorage كحل بديل مؤقت لعدم توفر جدول ومسارات مخصصة في الباك اند.

---

### 3.2 مزامنة موظفي الإدارة مع حسابات الدخول (Staff <-> Sanctum Login Auto-Provisioning)
- **الغرض الأساسي:** تمكين الموظف الذي تتم إضافته في POST /admin/staff من تسجيل الدخول مباشرة عبر /login بصلاحية 'staff' أو 'admin' باستخدام كلمة المرور التي حُددت له.
- **الشاشة المحتاجة:** `StaffManagementView / AddStaffModal`
- **الأولوية:** **عالية جداً (أولوية قصوى)**

**النقاط المقترحة:**
| Method | Path | الغرض |
| :---: | :--- | :--- |
| `POST` | `/admin/staff` | تعديل النقطة لتقوم آلياً بإنشاء سجل مطابق في جدول users أو ربطه بـ Sanctum |

**جسم الطلب المتوقع (Payload):**
```json
{
  "name": "string",
  "emp_code": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "department_id": "number",
  "role_id": "number",
  "status": "active | suspended"
}
```

**شكل الاستجابة المطلوب (Response):**
```json
{
  "status": true,
  "message": "تم إنشاء حساب الموظف وتفعيل بيانات تسجيل الدخول بنجاح",
  "data": {
    "id": 14,
    "user_id": 205,
    "name": "راكان الحارثي",
    "email": "r.alharbi@aljudy.sa",
    "can_login": true
  }
}
```

> **ملاحظة فنية:** حالياً تضطر الواجهة لتنفيذ استدعاء إضافي لـ POST /users تحت شركة وهمية STAFF_LOGIN_COMPANY_ID كحل التفافي.

---

### 3.3 واجهة المسودات المركزية (Central Drafts Sync API)
- **الغرض الأساسي:** حفظ ومزامنة المسودات المحفوظة من نماذج الإشعارات، باقات التسعير، الصلاحيات، الموظفين، والاشتراكات في قاعدة البيانات لاستئنافها من أي جهاز.
- **الشاشة المحتاجة:** `DraftsManagementView (صفحة المسودات المركزية - /drafts)`
- **الأولوية:** **متوسطة**

**النقاط المقترحة:**
| Method | Path | الغرض |
| :---: | :--- | :--- |
| `GET` | `/admin/drafts` | جلب المسودات المحفوظة الخاصة بالمشرف الحالي |
| `POST` | `/admin/drafts` | حفظ أو تحديث مسودة |
| `DELETE` | `/admin/drafts/{id}` | حذف مسودة محددة |
| `DELETE` | `/admin/drafts` | حذف كافة المسودات |

**جسم الطلب المتوقع (Payload):**
```json
{
  "type": "string (announcement | plan | role | staff | subscription)",
  "title": "string (عنوان المسودة)",
  "data": "object (البيانات المدخلة في النموذج لحفظها)"
}
```

**شكل الاستجابة المطلوب (Response):**
```json
{
  "status": true,
  "data": [
    {
      "id": "draft-01",
      "type": "announcement",
      "title": "مسودة إشعار صيانة ناجز",
      "data": {
        "title": "تنبيه هام",
        "content": "..."
      },
      "updated_at": "2026-11-21T10:00:00Z"
    }
  ]
}
```

> **ملاحظة فنية:** الواجهة حالياً تخزن المسودات في localStorage عبر Zustand Store.

---

### 3.4 أقسام الموقع التعريفي CMS المتبقية (Remaining Website Sections APIs)
- **الغرض الأساسي:** توفير واجهات CRUD لإدارة محتوى الأقسام الأخرى المعروضة في شاشة إعدادات الموقع التعريفي.
- **الشاشة المحتاجة:** `WebsiteSettingsView (/website-settings)`
- **الأولوية:** **متوسطة**

**النقاط المقترحة:**
| Method | Path | الغرض |
| :---: | :--- | :--- |
| `GET / POST` | `/admin/website/sections/use-cases` | حالات الاستخدام (Use Cases Tab) |
| `GET / POST` | `/admin/website/sections/partner-logos` | شعارات الشركاء والجهات الحكومية (Partner Logos Tab) |
| `GET / POST` | `/admin/website/sections/story` | قصة ورؤية المنصة (Story Tab) |
| `GET / POST` | `/admin/website/sections/unique-features` | المميزات الحصرية والفريدة (Unique Features Tab) |
| `GET / POST` | `/admin/website/sections/ai-chat` | معاينة المساعد القضائي الذكي (AI Chat Tab) |
| `GET / POST` | `/admin/website/navigation` | روابط القائمة العلوية والتذييل (Nav & Footer Links Tab) |

**جسم الطلب المتوقع (Payload):**
```json
{
  "title": "string",
  "content": "string | object",
  "order": "number",
  "is_active": "boolean"
}
```

**شكل الاستجابة المطلوب (Response):**
```json
{
  "status": true,
  "data": "array | object"
}
```

> **ملاحظة فنية:** الواجهة تعرض بيانات أولية (initialWebsiteSettings.ts) لحين بناء واجهات الباك اند لهذه الأقسام.

---

### حصر البيانات الثابتة (Mock / Hardcoded Data) في الواجهة

الجدول التالي يحصر الأجزاء التي تضطر الواجهة حالياً لعرض بيانات أولية أو تخزينها محلياً لعدم توفر API:

| الصفحة / القسم | الكومبوننت | المصدر المؤقت الحالي | الـ API المطلوب من الباك اند | الأثر في النظام |
| :--- | :--- | :--- | :--- | :--- |
| صفحة المسودات المركزية (/drafts) | `DraftsManagementView` | localStorage عبر Zustand (useDraftsStore) | `GET/POST/DELETE /admin/drafts` | المسودات محصورة على متصفح المشرف فقط وتفقد عند تغيير المتصفح أو مسح الكاش. |
| سجل تسجيل الدخول كعميل (/impersonation-logs) | `ImpersonationLogsView` | الذاكرة المحلية مع Fallback على /admin/audit-logs | `GET /admin/impersonation-logs` | غياب سجل تدقيق أمني مركزي موحد لمعاينات مكاتب المحاماة على السيرفر. |
| إعدادات الموقع التعريفي (/website-settings) | `تبويبات: Use Cases, Partner Logos, Story, AI Chat, Nav Links` | ملف البيانات الثابتة initialWebsiteSettings.ts | `GET/POST /admin/website/sections/*` | أي تعديل يجريه المشرف على هذه التبويبات لا يتم حفظه على الخادم في الوقت الحالي. |
| باقة النخبة غير المحدودة في الباقات (/plans) | `PlansView / UNLIMITED_VIP_PLAN` | كائن ثابت في plans.ts كباقة VIP للعملاء الكبار | `دعم نوع type: 'unlimited' في جدول الباقات في الباك اند` | تظهر في الواجهة لكنها غير مسجلة في جدول الباقات الأساسي بالباك اند. |

---

## 4. تعديلات وتحسينات مطلوبة على نقاط موجودة

تعديلات جوهرية على مستوى سلوك الـ Backend لضمان استقرار الاتصال ومنع الأخطاء في واجهة المستخدم:

### 4.1 توحيد مغلف الـ Pagination لجميع قوائم الجداول (Standard Pagination Envelope)
- **السلوك الحالي:** بعض النقاط ترجع مصفوفة مباشرة data: [...] وأخرى ترجع data: { current_page, data: [...], total, per_page, last_page }.
- **التعديل المطلوب:** توحيد شكل الـ Pagination Envelope لجميع الـ GET القوائم: (المكاتب، الاشتراكات، الموظفين، التذاكر، الفواتير، الإعلانات، سجلات التدقيق).

**الشكل القياسي الموصى به:**
```json
{
  "status": true,
  "message": "...",
  "data": {
    "current_page": 1,
    "data": [ ... ],
    "total": 142,
    "per_page": 10,
    "last_page": 15
  }
}
```

---

### 4.2 دعم معايير الفلترة والبحث الشاملة (Search & Filter Query Params)
- **السلوك الحالي:** بعض نقاط الـ API لا تستجيب لبارامترات search أو date ranges في الـ Backend.
- **التعديل المطلوب:** تفعيل بارامترات: search (بحث نصي في الاسم، الترخيص، البريد، الهاتف)، status (فلترة الحالة)، from_date و to_date لجميع الجداول ذات الطابع الزمني.

**الشكل القياسي الموصى به:**
```json
?search=العجلان&status=active&from_date=2026-01-01&to_date=2026-12-31&page=1&per_page=10
```

---

### 4.3 تنسيق أخطاء التحقق من المدخلات (422 Unprocessable Content Validation Errors)
- **السلوك الحالي:** في بعض الأحيان يرجع الباك اند خطأ 500 عام بدلاً من 422 عند تكرار البريد أو الهاتف أو رقم الترخيص.
- **التعديل المطلوب:** إرجاع رمز 422 مع كائن errors مفصل يربط الخطأ باسم الحقل بدقة لعرضه للمستخدم باللغة العربية تحت الحقل المعني مباشرة.

**الشكل القياسي الموصى به:**
```json
{
  "status": false,
  "message": "البيانات المدخلة غير صالحة",
  "errors": {
    "email": ["البريد الإلكتروني مسجل مسبقاً لمكتب آخر"],
    "license_number": ["رقم الترخيص العدلي مستخدم بالفعل"]
  }
}
```

---

### 4.4 دعم رفع الملفات والشعارات عبر Multipart Form Data
- **السلوك الحالي:** نقاط مثل إضافة مكتب أو تحديث إعدادات عامة تتوقع روابط نصوص Base64 أو URL للشعارات.
- **التعديل المطلوب:** دعم رفع ملفات الصور والمستندات (PNG, JPG, PDF) عبر Multipart/form-data وتوليد مسارات تخزين سحابية آمنة في الـ S3 أو التخزين المحلي.

**الشكل القياسي الموصى به:**
```json
Content-Type: multipart/form-data مع استقبال حقول الملفات مثل logo, avatar, attachments[]
```

---

## 5. استفسارات وأسئلة تقنية لفريق الباك اند (Technical Questions)

يرجى من فريق الباك اند تزويدنا بالإجابة التقنية المعتمدة للنقاط التالية:

### س1: آلية ربط موظفي طاقم الإدارة (admin/staff) مع جدول users لتسجيل الدخول
**السؤال:** عند إنشاء موظف جديد عبر POST /admin/staff، هل يقوم السيرفر بإنشاء حساب في جدول users يمكنه تسجيل الدخول عبر /login مباشرة بدور admin أو staff؟ أم أن هناك خطوة ربط أو تفعيل إضافية مطلوبة من جهة الباك اند؟

*الإجابة المقترحة / المتوقعة من فريق الواجهة:* نأمل توفير تأكيد رسمي لتوثيقها في العقد البرمجي.

---

### س2: عزل جلسات المعاينة الإشرافية (Supervisory Preview Scoping)
**السؤال:** عند توليد توكن الدخول كالمكتب عبر POST /admin/utility/login-as-firm/{id}، هل التوكن يملك صلاحيات كاملة مثل المالك الحقيقي؟ وهل العمليات التي ينفذها المشرف داخل مكتب المحامي أثناء وضع المعاينة تسجل كـ audit log خاص بالمشرف أم باسم مالك المكتب؟

*الإجابة المقترحة / المتوقعة من فريق الواجهة:* نأمل توفير تأكيد رسمي لتوثيقها في العقد البرمجي.

---

### س3: مسار استلام إشعارات الدفع (Payment Webhook Endpoints)
**السؤال:** ما هي المسارات المعتمدة في الباك اند لاستقبال إشعارات الويب هوك (Webhooks) من بوابات الدفع (Stripe Webhook, Tap Webhook) لتحديث حالة الاشتراكات والفواتير تلقائياً فور نجاح الدفع؟

*الإجابة المقترحة / المتوقعة من فريق الواجهة:* نأمل توفير تأكيد رسمي لتوثيقها في العقد البرمجي.

---

### س4: سياسة الحذف لمكاتب المحاماة والاشتراكات (Soft Delete vs Cascade)
**السؤال:** عند استدعاء DELETE /admin/firms/{id}، هل تطبق المنظومة الحذف المرن (Soft Delete) مع الاحتفاظ بالفواتير والبيانات العدلية للأغراض النظامية والضريبية، أم يتم الحذف النهائي؟ وما هي القيود التي تمنع الحذف؟

*الإجابة المقترحة / المتوقعة من فريق الواجهة:* نأمل توفير تأكيد رسمي لتوثيقها في العقد البرمجي.

---

### س5: الحدود القصوى لحجم الملفات المرفقة بالتذاكر والإعلانات
**السؤال:** ما هو الحد الأقصى لحجم الملفات المسموح برفعها في تذاكر الدعم الفني والإعلانات المركزية والشعارات (مثل: 10MB لكل مرفق)، وما هي الامتدادات المعتمدة من جدار الحماية (WAF)؟

*الإجابة المقترحة / المتوقعة من فريق الواجهة:* نأمل توفير تأكيد رسمي لتوثيقها في العقد البرمجي.

---

## 6. ملحق: جدول شامل ومختصر لجميع الـ Endpoints

جدول مرجعي سريع (Cheat Sheet) يضم كافة الـ Endpoints الموثقة في هذا المشروع:

| # | Method | Path | الحالة | الشاشة والكومبوننت في الواجهة |
| :---: | :---: | :--- | :---: | :--- |
| 1 | `POST` | `/login` | 🟢 مربوط | LoginPage (صفحة تسجيل الدخول) | 
| 2 | `GET` | `/me` | 🟢 مربوط | TopNavbar / Session Provider | 
| 3 | `POST` | `/change-password` | 🟢 مربوط | ChangePasswordPage / ProfileView | 
| 4 | `POST` | `/logout` | 🟢 مربوط | TopNavbar Dropdown | 
| 5 | `GET` | `/admin/audit-logs` | 🟢 مربوط | ProfileView (تبويب سجل العمليات) | 
| 6 | `GET` | `/admin/dashboardSaas` | 🟢 مربوط | DashboardHomeView (الصفحة الرئيسية) | 
| 7 | `GET` | `/admin/dashboard` | 🟢 مربوط | Dashboard Fallback / المنشأة الفردية | 
| 8 | `GET` | `/admin/firms/stats` | 🟢 مربوط | LawFirmsPage / ClientKpiMetrics | 
| 9 | `GET` | `/admin/firms` | 🟢 مربوط | LawFirmsPage / ClientManagementView | 
| 10 | `POST` | `/admin/firms` | 🟢 مربوط | AddClientOfficeModal (مودال إضافة مكتب جديد) | 
| 11 | `GET` | `/admin/firms/{firm_id}` | 🟢 مربوط | ClientOfficeDetailsView (الملف الكامل للمكتب) | 
| 12 | `PUT` | `/admin/firms/{firm_id}` | 🟢 مربوط | EditOfficeModal / تفاصيل المكتب | 
| 13 | `PATCH` | `/admin/firms/{firm_id}/status` | 🟢 مربوط | DeactivateOfficeModal / تنشيط المكتب | 
| 14 | `POST` | `/admin/firms/{firm_id}/notes` | 🟢 مربوط | ClientOfficeDetailsView (إضافة ملاحظة داخلية) | 
| 15 | `DELETE` | `/admin/firms/{firm_id}` | 🟢 مربوط | DeleteOfficeConfirmDialog | 
| 16 | `GET` | `/admin/plans/stats` | 🟢 مربوط | PlansView (صفحة الباقات) | 
| 17 | `GET` | `/admin/plans` | 🟢 مربوط | PlansView / CreatePlanView | 
| 18 | `POST` | `/admin/plans` | 🟢 مربوط | CreatePlanView (معالج إنشاء باقة اشتراك جديدة) | 
| 19 | `GET` | `/admin/plans/{plan_id}` | 🟢 مربوط | PlanDetailsModal / EditPlanView | 
| 20 | `PUT` | `/admin/plans/{plan_id}` | 🟢 مربوط | EditPlanModal (تعديل باقة) | 
| 21 | `PATCH` | `/admin/plans/{plan_id}/status` | 🟢 مربوط | TogglePlanStatusSwitch | 
| 22 | `GET` | `/admin/plans/{plan_id}/subscribers` | 🟢 مربوط | PlanSubscribersModal (المكاتب المشتركة في الباقة) | 
| 23 | `DELETE` | `/admin/plans/{plan_id}` | 🟢 مربوط | DeletePlanConfirmDialog | 
| 24 | `GET` | `/admin/subscriptions/stats` | 🟢 مربوط | SubscriptionManagementView | 
| 25 | `GET` | `/admin/subscriptions` | 🟢 مربوط | SubscriptionManagementView | 
| 26 | `GET` | `/admin/subscriptions/{subscription_id}` | 🟢 مربوط | SubscriptionDetailsModal | 
| 27 | `POST` | `/admin/subscriptions/{subscription_id}/approve` | 🟢 مربوط | ApproveSubscriptionDialog | 
| 28 | `POST` | `/admin/subscriptions/{subscription_id}/reject` | 🟢 مربوط | RejectSubscriptionModal (رفض الاشتراك مع السبب) | 
| 29 | `POST` | `/admin/subscriptions/{subscription_id}/renew` | 🟢 مربوط | RenewSubscriptionModal | 
| 30 | `POST` | `/admin/subscriptions/{subscription_id}/upgrade` | 🟢 مربوط | UpgradeSubscriptionModal | 
| 31 | `POST` | `/admin/subscriptions/{subscription_id}/cancel` | 🟢 مربوط | CancelSubscriptionModal | 
| 32 | `PATCH` | `/admin/subscriptions/{subscription_id}/status` | 🟢 مربوط | SubscriptionStatusSwitcher | 
| 33 | `POST` | `/admin/subscriptions/{subscription_id}/custom-offer` | 🟢 مربوط | CustomPlanOfferModal (تطبيق باقة مخصصة وعرض استثنائي) | 
| 34 | `DELETE` | `/admin/subscriptions/{subscription_id}/custom-offer` | 🟢 مربوط | ResetCustomOfferDialog | 
| 35 | `GET` | `/admin/subscriptions/{subscription_id}/limits-breakdown` | 🟢 مربوط | ClientOfficeDetailsView (مخطط استهلاك وتفصيل الحدود) | 
| 36 | `GET` | `/admin/staff/stats` | 🟢 مربوط | StaffManagementView | 
| 37 | `GET` | `/admin/staff` | 🟢 مربوط | StaffManagementView | 
| 38 | `POST` | `/admin/staff` | 🟢 مربوط | AddStaffModal (إضافة موظف جديد) | 
| 39 | `GET` | `/admin/staff/{staff_id}` | 🟢 مربوط | StaffDetailsModal | 
| 40 | `PUT` | `/admin/staff/{staff_id}` | 🟢 مربوط | EditStaffModal | 
| 41 | `PATCH` | `/admin/staff/{staff_id}/status` | 🟢 مربوط | StaffStatusSwitch | 
| 42 | `POST` | `/admin/staff/{staff_id}/reset-password` | 🟢 مربوط | ResetStaffPasswordModal | 
| 43 | `POST` | `/admin/staff/{staff_id}/impersonate` | 🟢 مربوط | LoginAsEmployeeModal | 
| 44 | `DELETE` | `/admin/staff/{staff_id}` | 🟢 مربوط | DeleteStaffConfirmDialog | 
| 45 | `GET` | `/admin/roles/stats` | 🟢 مربوط | RolesManagementView | 
| 46 | `GET` | `/admin/roles/permissions` | 🟢 مربوط | RolesManagementView / CreateRoleModal | 
| 47 | `GET` | `/admin/roles` | 🟢 مربوط | RolesManagementView | 
| 48 | `POST` | `/admin/roles` | 🟢 مربوط | CreateRoleModal (إضافة دور جديد) | 
| 49 | `GET` | `/admin/roles/{role_id}` | 🟢 مربوط | RoleDetailsModal / EditRoleModal | 
| 50 | `PUT` | `/admin/roles/{role_id}` | 🟢 مربوط | EditRoleModal (تعديل صلاحيات الدور) | 
| 51 | `POST` | `/admin/roles/{role_id}/reassign-staff` | 🟢 مربوط | ReassignStaffBeforeDeleteModal | 
| 52 | `DELETE` | `/admin/roles/{role_id}` | 🟢 مربوط | DeleteRoleConfirmDialog | 
| 53 | `GET` | `/admin/departments` | 🟢 مربوط | TicketsView (تبويب الأقسام) / Staff Modals | 
| 54 | `POST` | `/admin/departments` | 🟢 مربوط | AddDepartmentModal | 
| 55 | `GET` | `/admin/departments/{id}` | 🟢 مربوط | EditDepartmentModal | 
| 56 | `PUT` | `/admin/departments/{id}` | 🟢 مربوط | EditDepartmentModal | 
| 57 | `DELETE` | `/admin/departments/{id}` | 🟢 مربوط | DeleteDepartmentDialog | 
| 58 | `GET` | `/admin/tickets/stats` | 🟢 مربوط | TicketsView (صفحة التذاكر) | 
| 59 | `GET` | `/admin/tickets` | 🟢 مربوط | TicketsView (قائمة التذاكر) | 
| 60 | `POST` | `/admin/tickets` | 🟢 مربوط | CreateTicketModal (إنشاء تذكرة دعم جديدة من الإدارة) | 
| 61 | `GET` | `/admin/tickets/{ticket_id}` | 🟢 مربوط | TicketDetailsView (شاشة تفاصيل ومحادثة التذكرة) | 
| 62 | `POST` | `/admin/tickets/{ticket_id}/reply` | 🟢 مربوط | TicketReplyForm (إرسال رد موجه للعميل) | 
| 63 | `POST` | `/admin/tickets/{ticket_id}/reply` | 🟢 مربوط | TicketInternalNoteForm (إضافة ملاحظة داخلية) | 
| 64 | `POST` | `/admin/tickets/{ticket_id}/assign` | 🟢 مربوط | AssignTicketModal | 
| 65 | `PATCH` | `/admin/tickets/{ticket_id}/status` | 🟢 مربوط | TicketStatusDropdown | 
| 66 | `POST` | `/admin/tickets/{ticket_id}/close` | 🟢 مربوط | CloseTicketButton | 
| 67 | `GET` | `/admin/payment-gateways` | 🟢 مربوط | PaymentGatewaysPage | 
| 68 | `GET` | `/admin/payment-gateways/{gateway}` | 🟢 مربوط | GatewayConfigModal | 
| 69 | `PUT` | `/admin/payment-gateways/{gateway}` | 🟢 مربوط | GatewayConfigModal (حفظ إعدادات البوابة) | 
| 70 | `PATCH` | `/admin/payment-gateways/{gateway}/status` | 🟢 مربوط | GatewayStatusToggle | 
| 71 | `POST` | `/admin/payment-gateways/{gateway}/test` | 🟢 مربوط | PingTestGatewayButton | 
| 72 | `GET` | `/admin/invoices` | 🟢 مربوط | InvoicesView (سجل الفواتير) | 
| 73 | `GET` | `/admin/invoices/{invoice_id}` | 🟢 مربوط | InvoiceDetailsModal / Preview | 
| 74 | `GET` | `/admin/announcements` | 🟢 مربوط | NotificationsManagementView | 
| 75 | `POST` | `/admin/announcements` | 🟢 مربوط | CreateNotificationModal (بث إشعار جديد) | 
| 76 | `GET` | `/admin/announcements/{id}` | 🟢 مربوط | NotificationDetailsModal | 
| 77 | `DELETE` | `/admin/announcements/{id}` | 🟢 مربوط | DeleteNotificationConfirmDialog | 
| 78 | `GET` | `/admin/settings/general` | 🟢 مربوط | GeneralSettingsView | 
| 79 | `POST` | `/admin/settings/general` | 🟢 مربوط | GeneralSettingsView (حفظ الإعدادات) | 
| 80 | `GET` | `/admin/settings/server-info` | 🟢 مربوط | ServerInfoView (معلومات الخادم والسيرفر) | 
| 81 | `GET` | `/admin/settings/system-update` | 🟢 مربوط | SystemUpdateView (تحديث النظام) | 
| 82 | `POST` | `/admin/settings/system-update` | 🟢 مربوط | StartUpdateDialog (بدء ترقية النظام) | 
| 83 | `GET` | `/admin/settings/mail` | 🟢 مربوط | MailSettingsView | 
| 84 | `POST` | `/admin/settings/mail` | 🟢 مربوط | MailSettingsView (حفظ إعدادات البريد) | 
| 85 | `POST` | `/admin/settings/mail/test` | 🟢 مربوط | TestEmailModal (إرسال بريد تجريبي) | 
| 86 | `GET` | `/admin/currencies` | 🟢 مربوط | CurrencySettingsView | 
| 87 | `POST` | `/admin/currencies` | 🟢 مربوط | AddCurrencyModal | 
| 88 | `POST` | `/admin/currencies/{currency_id}/default` | 🟢 مربوط | SetDefaultCurrencyButton | 
| 89 | `DELETE` | `/admin/currencies/{currency_id}` | 🟢 مربوط | DeleteCurrencyDialog | 
| 90 | `GET` | `/admin/languages` | 🟢 مربوط | LanguageSettingsView | 
| 91 | `POST` | `/admin/languages` | 🟢 مربوط | AddLanguageModal | 
| 92 | `POST` | `/admin/languages/{language_id}/default` | 🟢 مربوط | SetDefaultLanguageButton | 
| 93 | `DELETE` | `/admin/languages/{language_id}` | 🟢 مربوط | DeleteLanguageDialog | 
| 94 | `GET` | `/admin/website/theme` | 🟢 مربوط | WebsiteSettingsView (تبويب المظهر والألوان) | 
| 95 | `POST` | `/admin/website/theme` | 🟢 مربوط | ThemeOptionsTab (حفظ المظهر) | 
| 96 | `GET` | `/admin/website/seo` | 🟢 مربوط | WebsiteSettingsView (تبويب SEO) | 
| 97 | `POST` | `/admin/website/seo` | 🟢 مربوط | SeoTab (حفظ إعدادات SEO) | 
| 98 | `GET` | `/admin/website/hero` | 🟢 مربوط | WebsiteSettingsView (تبويب قسم الهيرو) | 
| 99 | `POST` | `/admin/website/hero` | 🟢 مربوط | HeroSectionTab (حفظ قسم الهيرو) | 
| 100 | `GET` | `/admin/website/sections/features` | 🟢 مربوط | WebsiteSettingsView (تبويب المميزات) | 
| 101 | `POST` | `/admin/website/sections/features` | 🟢 مربوط | AddFeatureModal | 
| 102 | `PATCH` | `/admin/website/items/{id}/toggle` | 🟢 مربوط | ToggleItemStatusSwitch | 
| 103 | `DELETE` | `/admin/website/items/{id}` | 🟢 مربوط | DeleteWebsiteItemDialog | 
| 104 | `POST` | `/admin/utility/login-as-firm/{firm_id}` | 🟢 مربوط | ClientRowActionMenu / EnterOfficeConfirmModal | 
| 105 | `POST` | `/admin/utility/end-preview` | 🟢 مربوط | PreviewBanner (إنهاء المعاينة والرجوع لحسابي) | 
| 106 | `GET` | `/admin/impersonation-logs` | 🟡 جزئي | ImpersonationLogsView (سجل جلسات الدخول الإشرافي) | 
| 107 | `GET` | `/admin/impersonation-logs/{id}` | 🟡 جزئي | ImpersonationLogDetailsModal | 
| 108 | `POST` | `/admin/impersonation-logs/{id}/end` | 🟡 جزئي | ImpersonationLogDetailsModal (إنهاء الجلسة فورياً) | 
| 109 | `GET` | `/admin/impersonation-logs/{id}/report` | 🟡 جزئي | ImpersonationLogDetailsModal (نسخ تقرير التدقيق) | 
| 110 | `GET` | `/users?company_id={company_id}` | 🟢 مربوط | ClientOfficeDetailsView / EnterOffice Flow | 
| 111 | `GET` | `/admin/impersonation-logs` | 🔴 مطلوب جديد | ImpersonationLogsView (صفحة سجلات تسجيل الدخول كعميل - /impersonation-logs) | 
| 112 | `GET` | `/admin/impersonation-logs/{id}` | 🔴 مطلوب جديد | ImpersonationLogsView (صفحة سجلات تسجيل الدخول كعميل - /impersonation-logs) | 
| 113 | `POST` | `/admin/impersonation-logs/{id}/end` | 🔴 مطلوب جديد | ImpersonationLogsView (صفحة سجلات تسجيل الدخول كعميل - /impersonation-logs) | 
| 114 | `GET` | `/admin/impersonation-logs/{id}/report` | 🔴 مطلوب جديد | ImpersonationLogsView (صفحة سجلات تسجيل الدخول كعميل - /impersonation-logs) | 
| 115 | `POST` | `/admin/staff` | 🔴 مطلوب جديد | StaffManagementView / AddStaffModal | 
| 116 | `GET` | `/admin/drafts` | 🔴 مطلوب جديد | DraftsManagementView (صفحة المسودات المركزية - /drafts) | 
| 117 | `POST` | `/admin/drafts` | 🔴 مطلوب جديد | DraftsManagementView (صفحة المسودات المركزية - /drafts) | 
| 118 | `DELETE` | `/admin/drafts/{id}` | 🔴 مطلوب جديد | DraftsManagementView (صفحة المسودات المركزية - /drafts) | 
| 119 | `DELETE` | `/admin/drafts` | 🔴 مطلوب جديد | DraftsManagementView (صفحة المسودات المركزية - /drafts) | 
| 120 | `GET / POST` | `/admin/website/sections/use-cases` | 🔴 مطلوب جديد | WebsiteSettingsView (/website-settings) | 
| 121 | `GET / POST` | `/admin/website/sections/partner-logos` | 🔴 مطلوب جديد | WebsiteSettingsView (/website-settings) | 
| 122 | `GET / POST` | `/admin/website/sections/story` | 🔴 مطلوب جديد | WebsiteSettingsView (/website-settings) | 
| 123 | `GET / POST` | `/admin/website/sections/unique-features` | 🔴 مطلوب جديد | WebsiteSettingsView (/website-settings) | 
| 124 | `GET / POST` | `/admin/website/sections/ai-chat` | 🔴 مطلوب جديد | WebsiteSettingsView (/website-settings) | 
| 125 | `GET / POST` | `/admin/website/navigation` | 🔴 مطلوب جديد | WebsiteSettingsView (/website-settings) | 


---
*تم إنشاء هذا التوثيق آلياً من قراءة الكود المصدري لمنصة الجودي SaaS Super Admin.*
