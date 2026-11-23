import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import {
  metadata,
  stats,
  modules,
  newApis,
  hardcodedDataGaps,
  requiredModifications,
  backendQuestions
} from "./handoff-data.mjs";

console.log("=== Generating API Handoff Documentation ===");

// Helper to escape HTML
function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// -------------------------------------------------------------
// 1. GENERATE MARKDOWN
// -------------------------------------------------------------
let md = `# وثيقة تسليم واجهات برمجة التطبيقات (API Handoff Specification)
**المشروع:** ${metadata.projectName}  
**الإصدار:** ${metadata.version} | **تاريخ التوثيق:** ${metadata.lastUpdated}  
**بيئة الإنتاج (Production):** \`${metadata.productionBaseUrl}\`  
**بيئة التطوير / المجموعة المحلية:** \`${metadata.localBaseUrl}\`  
**طريقة المصادقة:** \`${metadata.authHeader}\`  

---

## فهرس المحتويات (Table of Contents)
1. [ملخص عام وإحصائيات المنظومة](#1-ملخص-عام-وإحصائيات-المنظومة)
2. [دليل نقاط النهاية التفصيلي حسب الموديول](#2-دليل-نقاط-النهاية-التفصيلي-حسب-الموديول)
${modules.map((m, idx) => `   - [${m.name}](#${m.id})`).join("\n")}
3. [واجهات برمجة جديدة مطلوبة من الباك اند (New APIs Required)](#3-واجهات-برمجة-جديدة-مطلوبة-من-الباك-اند)
   - [حصر البيانات الثابتة (Mock / Hardcoded Data) في الواجهة](#حصر-البيانات-الثابتة-mock--hardcoded-data-في-الواجهة)
4. [تعديلات وتحسينات مطلوبة على نقاط موجودة](#4-تعديلات-وتحسينات-مطلوبة-على-نقاط-موجودة)
5. [استفسارات وأسئلة تقنية لفريق الباك اند](#5-استفسارات-وأسئلة-تقنية-لفريق-الباك-اند)
6. [ملحق: جدول شامل ومختصر لجميع الـ Endpoints](#6-ملحق-جدول-شامل-ومختصر-لجميع-الـ-endpoints)

---

## 1. ملخص عام وإحصائيات المنظومة

هذه الوثيقة هي المصدر الفعلي والحصري المعتمد لتوثيق كافة نقاط النهاية (Endpoints) لـ **لوحة الإدارة العليا (SaaS Super Admin)** ومسار المعاينة الإشرافية لمكاتب المحاماة (Impersonation). كُتبت هذه الوثيقة بناءً على الفحص الشامل والدقيق للكود الفعلي للمشروع (Services, API Client, Types, Stores, Component Actions)، ومطابقتها مع مجموعة Postman المعتمدة وسجلات الإنتاج الحية دون أي تخمين أو افتراض.

### معلومات الربط والاتصال الأساسية
- **اسم المنظومة:** ${metadata.projectName}
- **عنوان الخادم المباشر (Production Base URL):** \`${metadata.productionBaseUrl}\`
- **عنوان الخادم المحلي (Local / Postman Base URL):** \`${metadata.localBaseUrl}\`
- **آلية المصادقة وحماية المسارات:** \`${metadata.authHeader}\` (Laravel Sanctum Bearer Token).
- **مغلف الاستجابة الموحد (Standard Laravel API Envelope):**
\`\`\`json
{
  "status": true,
  "message": "رسالة وصفية للعملية باللغة العربية",
  "data": { ... },
  "meta": { ... }
}
\`\`\`

### جدول الإحصاءات العامة للنقاط البرمجية
| المؤشر | العدد | النسبة المئوية | الوصف والتفاصيل |
| :--- | :---: | :---: | :--- |
| **إجمالي الـ Endpoints الموثقة** | **${stats.total}** | **100%** | كافة نقاط النظام التي تم فحصها وتوثيقها بالكامل |
| **✅ مربوط ومختبر في الواجهة (Wired)** | **${stats.wired}** | **${((stats.wired / stats.total) * 100).toFixed(1)}%** | مربوط بالكامل بالـ UI ومختبر بالبيانات الحقيقية والمحاكاة |
| **🟡 موجود في الـ API / يحتاج تدعيم (Partial)** | **${stats.partial}** | **${((stats.partial / stats.total) * 100).toFixed(1)}%** | موجود أو معتمد بالواجهة مع الاعتماد على بدائل مؤقتة |
| **🔴 جديد مطلوب من الباك اند (Missing)** | **${stats.missing}** | **${((stats.missing / stats.total) * 100).toFixed(1)}%** | شاشات موجودة بالواجهة تحتاج توفير Endpoints مخصصة |

---

## 2. دليل نقاط النهاية التفصيلي حسب الموديول
`;

// Append each module and its endpoints in markdown
modules.forEach((mod) => {
  md += `\n<a id="${mod.id}"></a>\n### ${mod.name}\n${mod.description}\n\n`;

  mod.endpoints.forEach((ep) => {
    md += `#### [${ep.id}] \`${ep.method}\` ${ep.path}\n`;
    md += `- **الغرض والوصف:** ${ep.purpose}\n`;
    md += `- **الحالة في الواجهة:** ${ep.statusLabel}\n`;
    md += `- **الشاشة / الكومبوننت:** \`${ep.screen}\` (${ep.component})\n`;
    md += `- **دالة الاستدعاء في الكود:** \`${ep.serviceCall}\`\n\n`;

    // Request Headers
    md += `**ترويسات الطلب (Headers):**\n`;
    ep.request.headers.forEach((h) => {
      md += `- \`${h}\`\n`;
    });
    md += `\n`;

    // Request Params
    if (ep.request.params.length > 0) {
      md += `**معاملات الرابط (URL Query / Path Params):**\n\n`;
      md += `| اسم المعامل | النوع | إجباري؟ | الوصف وقواعد الفليديشن |\n`;
      md += `| :--- | :---: | :---: | :--- |\n`;
      ep.request.params.forEach((p) => {
        md += `| \`${p.field}\` | \`${p.type}\` | ${p.required ? "نعم (إجباري)" : "لا (اختياري)"} | ${p.validation} |\n`;
      });
      md += `\n`;
    }

    // Request Body
    if (ep.request.body.length > 0) {
      md += `**جسم الطلب (Request Body - JSON):**\n\n`;
      md += `| اسم الحقل | النوع | إجباري؟ | الوصف وقواعد التحقق والفليديشن |\n`;
      md += `| :--- | :---: | :---: | :--- |\n`;
      ep.request.body.forEach((b) => {
        md += `| \`${b.field}\` | \`${b.type}\` | ${b.required ? "نعم (إجباري)" : "لا (اختياري)"} | ${b.validation} |\n`;
      });
      md += `\n`;
    }

    // Response JSON
    md += `**شكل الاستجابة الحقيقية (Real JSON Response Example):**\n`;
    md += `\`\`\`json\n${JSON.stringify(ep.response.example, null, 2)}\n\`\`\`\n\n`;

    // Used fields
    md += `**الحقول المستخدمة فعلياً في الواجهة:**\n`;
    ep.response.usedFields.forEach((f) => {
      md += `- \`${f}\`\n`;
    });
    md += `\n`;

    // Notes
    if (ep.notes) {
      md += `> **ملاحظات تقنية وأخطاء متوقعة:** ${ep.notes}\n\n`;
    }

    md += `---\n\n`;
  });
});

// -------------------------------------------------------------
// 3. NEW APIS SECTION
// -------------------------------------------------------------
md += `## 3. واجهات برمجة جديدة مطلوبة من الباك اند (New APIs Required)

الواجهات التالية تمثل شاشات ومتطلبات فعلية مبرمجة في الواجهة الأمامية، ولكنها تفتقر إلى Endpoints مخصصة من جهة الباك اند، أو تعتمد حالياً على حلول مؤقتة مثل التخزين المحلي (localStorage).

`;

newApis.forEach((api, idx) => {
  md += `### 3.${idx + 1} ${api.title}\n`;
  md += `- **الغرض الأساسي:** ${api.purpose}\n`;
  md += `- **الشاشة المحتاجة:** \`${api.screen}\`\n`;
  md += `- **الأولوية:** **${api.priority}**\n\n`;

  md += `**النقاط المقترحة:**\n`;
  md += `| Method | Path | الغرض |\n| :---: | :--- | :--- |\n`;
  api.endpoints.forEach((e) => {
    md += `| \`${e.method}\` | \`${e.path}\` | ${e.description} |\n`;
  });
  md += `\n`;

  md += `**جسم الطلب المتوقع (Payload):**\n\`\`\`json\n${JSON.stringify(api.requestPayload, null, 2)}\n\`\`\`\n\n`;
  md += `**شكل الاستجابة المطلوب (Response):**\n\`\`\`json\n${JSON.stringify(api.responsePayload, null, 2)}\n\`\`\`\n\n`;
  md += `> **ملاحظة فنية:** ${api.notes}\n\n---\n\n`;
});

// Hardcoded Data Table
md += `### حصر البيانات الثابتة (Mock / Hardcoded Data) في الواجهة

الجدول التالي يحصر الأجزاء التي تضطر الواجهة حالياً لعرض بيانات أولية أو تخزينها محلياً لعدم توفر API:

| الصفحة / القسم | الكومبوننت | المصدر المؤقت الحالي | الـ API المطلوب من الباك اند | الأثر في النظام |
| :--- | :--- | :--- | :--- | :--- |
`;

hardcodedDataGaps.forEach((g) => {
  md += `| ${g.page} | \`${g.component}\` | ${g.currentSource} | \`${g.neededApi}\` | ${g.impact} |\n`;
});

md += `\n---\n\n`;

// -------------------------------------------------------------
// 4. MODIFICATIONS REQUIRED
// -------------------------------------------------------------
md += `## 4. تعديلات وتحسينات مطلوبة على نقاط موجودة

تعديلات جوهرية على مستوى سلوك الـ Backend لضمان استقرار الاتصال ومنع الأخطاء في واجهة المستخدم:

`;

requiredModifications.forEach((mod, idx) => {
  md += `### 4.${idx + 1} ${mod.title}\n`;
  md += `- **السلوك الحالي:** ${mod.currentBehavior}\n`;
  md += `- **التعديل المطلوب:** ${mod.requiredChange}\n\n`;
  md += `**الشكل القياسي الموصى به:**\n\`\`\`json\n${mod.recommendedShape}\n\`\`\`\n\n---\n\n`;
});

// -------------------------------------------------------------
// 5. BACKEND QUESTIONS
// -------------------------------------------------------------
md += `## 5. استفسارات وأسئلة تقنية لفريق الباك اند (Technical Questions)

يرجى من فريق الباك اند تزويدنا بالإجابة التقنية المعتمدة للنقاط التالية:

`;

backendQuestions.forEach((q) => {
  md += `### س${q.num}: ${q.topic}\n`;
  md += `**السؤال:** ${q.question}\n\n`;
  md += `*الإجابة المقترحة / المتوقعة من فريق الواجهة:* نأمل توفير تأكيد رسمي لتوثيقها في العقد البرمجي.\n\n---\n\n`;
});

// -------------------------------------------------------------
// 6. MASTER SUMMARY TABLE
// -------------------------------------------------------------
md += `## 6. ملحق: جدول شامل ومختصر لجميع الـ Endpoints

جدول مرجعي سريع (Cheat Sheet) يضم كافة الـ Endpoints الموثقة في هذا المشروع:

| # | Method | Path | الحالة | الشاشة والكومبوننت في الواجهة |
| :---: | :---: | :--- | :---: | :--- |
`;

let rowNum = 1;
modules.forEach((mod) => {
  mod.endpoints.forEach((ep) => {
    const statusIcon =
      ep.status === "wired" ? "🟢 مربوط" : ep.status === "partial" ? "🟡 جزئي" : "🔴 مطلوب";
    md += `| ${rowNum++} | \`${ep.method}\` | \`${ep.path}\` | ${statusIcon} | ${ep.screen} | \n`;
  });
});

newApis.forEach((api) => {
  api.endpoints.forEach((ep) => {
    md += `| ${rowNum++} | \`${ep.method}\` | \`${ep.path}\` | 🔴 مطلوب جديد | ${api.screen} | \n`;
  });
});

md += `\n\n---\n*تم إنشاء هذا التوثيق آلياً من قراءة الكود المصدري لمنصة الجودي SaaS Super Admin.*\n`;

// Write Markdown files
fs.writeFileSync(path.resolve("docs/api-handoff.md"), md, "utf8");
fs.writeFileSync(path.resolve("dashboard/docs/api-handoff.md"), md, "utf8");
console.log("✔ Markdown files written successfully:");
console.log("  - docs/api-handoff.md");
console.log("  - dashboard/docs/api-handoff.md");


// -------------------------------------------------------------
// 2. GENERATE RICH HTML FOR HIGH-FIDELITY PDF PRINTING
// -------------------------------------------------------------
console.log("Generating printable HTML...");

let html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>وثيقة تسليم واجهات برمجة التطبيقات - منصة الجودي</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4 portrait;
      margin: 15mm 15mm 20mm 15mm;
      @bottom-right {
        content: "صفحة " counter(page) " من " counter(pages);
        font-family: 'Cairo', sans-serif;
        font-size: 9pt;
        color: #64748b;
      }
      @bottom-left {
        content: "منصة الجودي | SaaS Super Admin API Handoff";
        font-family: 'Cairo', sans-serif;
        font-size: 9pt;
        color: #64748b;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Cairo', sans-serif;
      font-size: 10pt;
      line-height: 1.6;
      color: #1e293b;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }

    .cover-page {
      text-align: center;
      padding: 40px 20px;
      page-break-after: always;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
      margin-bottom: 20px;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
    }

    .cover-subtitle {
      font-size: 15pt;
      font-weight: 600;
      color: #9c6402;
      margin-bottom: 30px;
    }

    .badge-bar {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin: 20px 0;
    }

    .meta-box {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 16px;
      text-align: right;
      max-width: 600px;
      margin: 30px auto;
      font-size: 10pt;
    }

    .meta-box table {
      width: 100%;
      border-collapse: collapse;
    }

    .meta-box td {
      padding: 6px 10px;
      border-bottom: 1px solid #e2e8f0;
    }

    .meta-box td:first-child {
      font-weight: 700;
      color: #475569;
      width: 35%;
    }

    h2 {
      font-size: 15pt;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #9c6402;
      padding-bottom: 6px;
      margin-top: 30px;
      margin-bottom: 15px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 12pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    .endpoint-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #ffffff;
      padding: 14px 18px;
      margin-bottom: 18px;
      page-break-inside: avoid;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .endpoint-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }

    .method-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9pt;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .method-GET { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .method-POST { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .method-PUT { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .method-PATCH { background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa; }
    .method-DELETE { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

    .path-text {
      font-family: 'JetBrains Mono', monospace;
      direction: ltr;
      text-align: left;
      font-size: 10pt;
      font-weight: 600;
      color: #0f172a;
      margin: 0 10px;
    }

    .status-badge {
      font-size: 8.5pt;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
    }

    .status-wired { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .status-partial { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
    .status-missing { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }

    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }

    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      text-align: right;
    }

    table.data-table th {
      background: #f8fafc;
      font-weight: 700;
      color: #334155;
    }

    pre.code-block {
      background: #0f172a;
      color: #f8fafc;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      direction: ltr;
      text-align: left;
      padding: 10px 14px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 8px 0;
      line-height: 1.45;
      page-break-inside: avoid;
    }

    .notes-box {
      background: #eff6ff;
      border-right: 4px solid #3b82f6;
      padding: 8px 12px;
      margin-top: 8px;
      border-radius: 0 4px 4px 0;
      font-size: 8.5pt;
      color: #1e3a8a;
    }

    .page-break {
      page-break-before: always;
    }

    ul.clean-list {
      margin: 4px 0;
      padding-right: 18px;
    }

    ul.clean-list li {
      margin-bottom: 3px;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div style="font-size: 13pt; font-weight: 700; color: #475569; margin-bottom: 10px;">المملكة العربية السعودية • منصة الجودي السحابية</div>
    <div class="cover-title">${esc(metadata.projectName)}</div>
    <div class="cover-subtitle">وثيقة تسليم واجهات برمجة التطبيقات الرسمية (Backend API Handoff)</div>
    
    <div class="meta-box">
      <table>
        <tr>
          <td>إصدار النظام</td>
          <td>${esc(metadata.version)}</td>
        </tr>
        <tr>
          <td>تاريخ الاعتماد والتوثيق</td>
          <td>${esc(metadata.lastUpdated)}</td>
        </tr>
        <tr>
          <td>عنوان خادم الإنتاج (Production)</td>
          <td dir="ltr" style="text-align: right; font-family: monospace;">${esc(metadata.productionBaseUrl)}</td>
        </tr>
        <tr>
          <td>عنوان الخادم المحلي (Local / Postman)</td>
          <td dir="ltr" style="text-align: right; font-family: monospace;">${esc(metadata.localBaseUrl)}</td>
        </tr>
        <tr>
          <td>آلية التحقق وحماية المسارات</td>
          <td dir="ltr" style="text-align: right; font-family: monospace;">${esc(metadata.authHeader)}</td>
        </tr>
        <tr>
          <td>إجمالي الـ Endpoints الموثقة</td>
          <td><strong>${stats.total} نقطة برمجية</strong> (مفحوصة بالكامل)</td>
        </tr>
        <tr>
          <td>نسبة الربط والاكتمال بالواجهة</td>
          <td><strong>${((stats.wired / stats.total) * 100).toFixed(1)}%</strong> (${stats.wired} مربوطة ومختبرة)</td>
        </tr>
      </table>
    </div>

    <div style="margin-top: 40px; font-size: 9pt; color: #64748b;">
      تم استخراج وتدقيق هذا التوثيق من الكود المصدري الفعلي للواجهة الأمامية ومطابقته مع مجموعة Postman وخادم الإنتاج.<br>
      جميع الحقوق محفوظة لمنصة الجودي لإدارة مكاتب وشركات المحاماة © 2026
    </div>
  </div>

  <!-- SECTION 1: EXECUTIVE SUMMARY -->
  <h2>1. ملخص عام وإحصائيات المنظومة</h2>
  <p>
    تهدف هذه الوثيقة إلى وضع عقد برمجي وتوثيقي كامل ومفصل لجميع الـ API Endpoints الخاصة بـ <strong>لوحة الإدارة العليا (Super Admin Dashboard)</strong> لمنصة الجودي. تم حصر كافة الـ Endpoints من ملفات الكود الفعلي (Services, API Client, Types, Components)، وتوثيق كل نقطة بالحقول الحقيقية وقواعد التحقق وأمثلة الاستجابة.
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th>المؤشر الإحصائي</th>
        <th style="text-align: center;">العدد</th>
        <th style="text-align: center;">النسبة</th>
        <th>الوصف والحالة</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>إجمالي الـ Endpoints الموثقة</strong></td>
        <td style="text-align: center;"><strong>${stats.total}</strong></td>
        <td style="text-align: center;"><strong>100%</strong></td>
        <td>كافة مسارات لوحة الإدارة العليا والمعاينة الإشرافية</td>
      </tr>
      <tr>
        <td><span class="status-badge status-wired">🟢 مربوط ومختبر في الواجهة</span></td>
        <td style="text-align: center;">${stats.wired}</td>
        <td style="text-align: center;">${((stats.wired / stats.total) * 100).toFixed(1)}%</td>
        <td>مربوط بشكل كامل وتعمل عملياته في الشاشات الحية</td>
      </tr>
      <tr>
        <td><span class="status-badge status-partial">🟡 موجود ويحتاج اعتماد</span></td>
        <td style="text-align: center;">${stats.partial}</td>
        <td style="text-align: center;">${((stats.partial / stats.total) * 100).toFixed(1)}%</td>
        <td>موجود بالواجهة مع استخدام بديل مؤقت (مثل fallback audit-logs)</td>
      </tr>
      <tr>
        <td><span class="status-badge status-missing">🔴 جديد مطلوب من الباك اند</span></td>
        <td style="text-align: center;">${stats.missing}</td>
        <td style="text-align: center;">${((stats.missing / stats.total) * 100).toFixed(1)}%</td>
        <td>شاشات بالواجهة مكتملة التصميم وتنتظر بناء المسارات في الباك اند</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 2: ENDPOINTS BY MODULE -->
  <div class="page-break"></div>
  <h2>2. تفاصيل الـ Endpoints حسب الموديول</h2>
`;

modules.forEach((mod) => {
  html += `<h3>${esc(mod.name)}</h3>`;
  html += `<p style="color: #475569; font-size: 9pt; margin-bottom: 12px;">${esc(mod.description)}</p>`;

  mod.endpoints.forEach((ep) => {
    const statusClass =
      ep.status === "wired" ? "status-wired" : ep.status === "partial" ? "status-partial" : "status-missing";

    html += `
    <div class="endpoint-card">
      <div class="endpoint-header">
        <div>
          <span class="method-badge method-${esc(ep.method)}">${esc(ep.method)}</span>
          <span class="path-text">${esc(ep.path)}</span>
        </div>
        <span class="status-badge ${statusClass}">${esc(ep.statusLabel)}</span>
      </div>

      <div style="font-size: 8.5pt; margin-bottom: 8px;">
        <strong>الغرض:</strong> ${esc(ep.purpose)}<br>
        <strong>الشاشة:</strong> <code>${esc(ep.screen)}</code> &nbsp;|&nbsp; 
        <strong>دالة الكود:</strong> <code>${esc(ep.serviceCall)}</code>
      </div>
    `;

    // Params table
    if (ep.request.params.length > 0) {
      html += `
      <div style="font-size: 8pt; font-weight: 700; margin-top: 6px;">معاملات الرابط (URL Query / Path Params):</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>اسم المعامل</th>
            <th>النوع</th>
            <th>إجباري؟</th>
            <th>قواعد التحقق والفليديشن</th>
          </tr>
        </thead>
        <tbody>
          ${ep.request.params
            .map(
              (p) => `
            <tr>
              <td><code>${esc(p.field)}</code></td>
              <td><code>${esc(p.type)}</code></td>
              <td>${p.required ? "نعم" : "اختياري"}</td>
              <td>${esc(p.validation)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      `;
    }

    // Body table
    if (ep.request.body.length > 0) {
      html += `
      <div style="font-size: 8pt; font-weight: 700; margin-top: 6px;">حقول جسم الطلب (Request Body):</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>اسم الحقل</th>
            <th>النوع</th>
            <th>إجباري؟</th>
            <th>قواعد التحقق والفليديشن</th>
          </tr>
        </thead>
        <tbody>
          ${ep.request.body
            .map(
              (b) => `
            <tr>
              <td><code>${esc(b.field)}</code></td>
              <td><code>${esc(b.type)}</code></td>
              <td>${b.required ? "نعم" : "اختياري"}</td>
              <td>${esc(b.validation)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      `;
    }

    // Response preview
    html += `
      <div style="font-size: 8pt; font-weight: 700; margin-top: 6px;">مثال الاستجابة (Real JSON Response):</div>
      <pre class="code-block">${esc(JSON.stringify(ep.response.example, null, 2))}</pre>

      <div style="font-size: 8pt; margin-top: 4px;">
        <strong>الحقول المستخدمة بالواجهة:</strong>
        <span style="color: #0369a1;">${ep.response.usedFields.map((f) => `<code>${esc(f)}</code>`).join(" • ")}</span>
      </div>
    `;

    if (ep.notes) {
      html += `<div class="notes-box"><strong>ملاحظة تقنية:</strong> ${esc(ep.notes)}</div>`;
    }

    html += `</div>`;
  });
});

// SECTION 3: NEW APIS
html += `
  <div class="page-break"></div>
  <h2>3. واجهات برمجة جديدة مطلوبة من الباك اند (New APIs)</h2>
  <p style="color: #475569; font-size: 9pt;">
    الواجهات التالية تمثل وظائف قائمة بالفعل في شاشات الواجهة، ولكنها تتطلب توفير Endpoints متوافقة من جانب خادم الباك اند:
  </p>
`;

newApis.forEach((api, idx) => {
  html += `
  <div class="endpoint-card">
    <div style="font-size: 11pt; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
      3.${idx + 1} ${esc(api.title)} &nbsp;<span class="status-badge status-missing">الأولوية: ${esc(api.priority)}</span>
    </div>
    <div style="font-size: 9pt; margin-bottom: 8px;">
      <strong>الغرض:</strong> ${esc(api.purpose)}<br>
      <strong>الشاشة:</strong> <code>${esc(api.screen)}</code>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Method</th>
          <th>المسار المقترح (Path)</th>
          <th>الوصف</th>
        </tr>
      </thead>
      <tbody>
        ${api.endpoints
          .map(
            (e) => `
          <tr>
            <td><span class="method-badge method-${esc(e.method)}">${esc(e.method)}</span></td>
            <td dir="ltr" style="text-align: right;"><code>${esc(e.path)}</code></td>
            <td>${esc(e.description)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div style="font-size: 8pt; font-weight: 700; margin-top: 6px;">جسم الطلب المتوقع (Request Payload):</div>
    <pre class="code-block">${esc(JSON.stringify(api.requestPayload, null, 2))}</pre>

    <div style="font-size: 8pt; font-weight: 700; margin-top: 6px;">الاستجابة المطلوبة (Expected Response):</div>
    <pre class="code-block">${esc(JSON.stringify(api.responsePayload, null, 2))}</pre>

    <div class="notes-box"><strong>ملاحظة:</strong> ${esc(api.notes)}</div>
  </div>
  `;
});

// Hardcoded Gaps Table
html += `
  <h3>حصر البيانات الثابتة (Mock Data) المطلوب تحويلها لـ APIs</h3>
  <table class="data-table">
    <thead>
      <tr>
        <th>الصفحة / القسم</th>
        <th>الكومبوننت</th>
        <th>المصدر الحالي</th>
        <th>الـ API المطلوب</th>
        <th>الأثر في المنظومة</th>
      </tr>
    </thead>
    <tbody>
      ${hardcodedDataGaps
        .map(
          (g) => `
        <tr>
          <td>${esc(g.page)}</td>
          <td><code>${esc(g.component)}</code></td>
          <td>${esc(g.currentSource)}</td>
          <td dir="ltr" style="text-align: right;"><code>${esc(g.neededApi)}</code></td>
          <td>${esc(g.impact)}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
`;

// SECTION 4: MODIFICATIONS
html += `
  <div class="page-break"></div>
  <h2>4. تعديلات وتحسينات مطلوبة على نقاط موجودة</h2>
`;

requiredModifications.forEach((mod, idx) => {
  html += `
  <div class="endpoint-card">
    <div style="font-size: 10.5pt; font-weight: 700; color: #1e293b; margin-bottom: 6px;">
      4.${idx + 1} ${esc(mod.title)}
    </div>
    <div style="font-size: 8.5pt; margin-bottom: 6px;">
      <strong>السلوك الحالي:</strong> ${esc(mod.currentBehavior)}<br>
      <strong>التعديل المطلوب:</strong> ${esc(mod.requiredChange)}
    </div>
    <pre class="code-block">${esc(mod.recommendedShape)}</pre>
  </div>
  `;
});

// SECTION 5: QUESTIONS
html += `
  <div class="page-break"></div>
  <h2>5. استفسارات وأسئلة تقنية لفريق الباك اند</h2>
`;

backendQuestions.forEach((q) => {
  html += `
  <div class="endpoint-card">
    <div style="font-size: 10pt; font-weight: 700; color: #0f172a; margin-bottom: 4px;">
      س${q.num}: ${esc(q.topic)}
    </div>
    <div style="font-size: 9pt; color: #334155;">
      <strong>السؤال:</strong> ${esc(q.question)}
    </div>
  </div>
  `;
});

// SECTION 6: SUMMARY TABLE
html += `
  <div class="page-break"></div>
  <h2>6. ملحق: جدول شامل ومختصر لجميع الـ Endpoints</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 30px; text-align: center;">#</th>
        <th style="width: 65px; text-align: center;">Method</th>
        <th>المسار (Path)</th>
        <th style="width: 100px; text-align: center;">الحالة</th>
        <th>الشاشة والكومبوننت في الواجهة</th>
      </tr>
    </thead>
    <tbody>
`;

let rowCounter = 1;
modules.forEach((mod) => {
  mod.endpoints.forEach((ep) => {
    const statusClass =
      ep.status === "wired" ? "status-wired" : ep.status === "partial" ? "status-partial" : "status-missing";
    const statusText =
      ep.status === "wired" ? "🟢 مربوط" : ep.status === "partial" ? "🟡 جزئي" : "🔴 مطلوب";

    html += `
      <tr>
        <td style="text-align: center;">${rowCounter++}</td>
        <td style="text-align: center;"><span class="method-badge method-${esc(ep.method)}">${esc(ep.method)}</span></td>
        <td dir="ltr" style="text-align: right; font-family: monospace; font-size: 8pt;">${esc(ep.path)}</td>
        <td style="text-align: center;"><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td style="font-size: 8pt;">${esc(ep.screen)}</td>
      </tr>
    `;
  });
});

newApis.forEach((api) => {
  api.endpoints.forEach((ep) => {
    html += `
      <tr>
        <td style="text-align: center;">${rowCounter++}</td>
        <td style="text-align: center;"><span class="method-badge method-${esc(ep.method)}">${esc(ep.method)}</span></td>
        <td dir="ltr" style="text-align: right; font-family: monospace; font-size: 8pt;">${esc(ep.path)}</td>
        <td style="text-align: center;"><span class="status-badge status-missing">🔴 مطلوب جديد</span></td>
        <td style="font-size: 8pt;">${esc(api.screen)}</td>
      </tr>
    `;
  });
});

html += `
    </tbody>
  </table>

</body>
</html>
`;

const tempHtmlPath = path.resolve("docs/api-handoff.html");
fs.writeFileSync(tempHtmlPath, html, "utf8");
console.log("✔ Temporary print HTML generated at docs/api-handoff.html");

// -------------------------------------------------------------
// 3. CONVERT HTML TO PDF VIA CHROME HEADLESS
// -------------------------------------------------------------
console.log("Rendering PDF with Google Chrome Headless...");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const targetPdf1 = path.resolve("docs/api-handoff.pdf");
const targetPdf2 = path.resolve("dashboard/docs/api-handoff.pdf");

try {
  execFileSync(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${targetPdf1}`,
    tempHtmlPath
  ]);
  console.log("✔ PDF generated at docs/api-handoff.pdf");

  // Copy to dashboard/docs/api-handoff.pdf
  fs.copyFileSync(targetPdf1, targetPdf2);
  console.log("✔ PDF copied to dashboard/docs/api-handoff.pdf");

  // Also keep dashboard/docs/api-handoff.html for reference
  fs.copyFileSync(tempHtmlPath, path.resolve("dashboard/docs/api-handoff.html"));

} catch (err) {
  console.error("Error generating PDF via Chrome:", err);
  process.exit(1);
}

// Check final file sizes
const statMd = fs.statSync(targetPdf1);
console.log(`🎉 Process Complete! PDF File size: ${(statMd.size / 1024).toFixed(1)} KB`);
