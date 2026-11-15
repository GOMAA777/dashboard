"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, Award, Scale } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function SubscriptionsPageFooter() {
  const { t } = useLanguage();

  return (
    <footer className="w-full max-w-6xl mx-auto px-4 pt-12 pb-8 border-t border-[#ded5c6]/70 dark:border-[#38271c] text-start relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Col 1: Brand Info */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#faf5eb] dark:bg-[#281c15] border border-[#eeddbb] dark:border-[#382b18] p-1 flex items-center justify-center">
              <Scale className="w-5 h-5 text-[#c29547] dark:text-[#d4a759]" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-[#c29547] dark:text-[#d4a759] block">
                {t("منصة الجودي", "Al-Joudi Platform")}
              </span>
              <span className="text-[10px] text-[#8c8279] dark:text-[#9e968a] block">
                {t("إدارة مكاتب وشركات المحاماة", "Law Firm Management Platform")}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#736a5e] dark:text-[#9e968a] leading-relaxed">
            {t(
              "المنصة السحابية الأولى المتخصصة في أتمتة وإدارة أعمال مكاتب المحاماة، القضايا، الجلسات، والموكلين بأعلى معايير الأمان والخصوصية.",
              "The premier cloud platform dedicated to automating and managing law firm operations, cases, court hearings, and clients with the highest standards of security and privacy."
            )}
          </p>
        </div>

        {/* Col 2: Plans & Features */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-[#1c1917] dark:text-[#fdfbf7] block">
            {t("باقات المنصة", "Platform Plans")}
          </span>
          <ul className="space-y-2 text-xs text-[#736a5e] dark:text-[#9e968a]">
            <li>{t("باقة المحامي المستقل (مجاناً)", "Solo Lawyer Plan (Free)")}</li>
            <li>{t("باقة المحترف للمكاتب المتوسطة", "Pro Plan for Growing Firms")}</li>
            <li>{t("باقة المؤسسات والشركات الكبرى", "Enterprise Plan for Large Firms")}</li>
            <li>{t("اتفاقيات الفروع والشركاء", "Branch & Partner Agreements")}</li>
          </ul>
        </div>

        {/* Col 3: Trust & Compliance */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-[#1c1917] dark:text-[#fdfbf7] block">
            {t("الأمان والامتثال", "Security & Compliance")}
          </span>
          <ul className="space-y-2 text-xs text-[#736a5e] dark:text-[#9e968a]">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c29547]" />
              <span>{t("تشفير مصرفي للبيانات (AES-256)", "Bank-Grade Data Encryption (AES-256)")}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#c29547]" />
              <span>{t("فواتير معتمدة من هيئة الزكاة (ZATCA)", "ZATCA-Approved Tax Invoices")}</span>
            </li>
            <li>{t("خوادم سحابية محلية آمنة", "Secure Local Cloud Servers")}</li>
            <li>{t("سياسة الخصوصية وسرية الموكلين", "Privacy Policy & Client Confidentiality")}</li>
          </ul>
        </div>

        {/* Col 4: Contact & Support */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-[#1c1917] dark:text-[#fdfbf7] block">
            {t("الدعم الفني والمبيعات", "Support & Sales")}
          </span>
          <ul className="space-y-2 text-xs text-[#736a5e] dark:text-[#9e968a]">
            <li className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#c29547]" />
              <span>support@aljoudylaw.com</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#c29547]" />
              <span dir="ltr">+966 800 123 4567</span>
            </li>
            <li>{t("دعم فوري على مدار الساعة للمشتركين", "24/7 Dedicated Support for Subscribers")}</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#ded5c6]/50 dark:border-[#38271c] text-[11px] text-[#8c8279] dark:text-[#8e8680]">
        <span>{t("© 2005-2026 منصة الجودي لإدارة مكاتب وشركات المحاماة. جميع الحقوق محفوظة.", "© 2005-2026 Al-Joudi Law Firm Management Platform. All rights reserved.")}</span>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-[#c29547] transition-colors">{t("شروط الاستخدام", "Terms of Use")}</Link>
          <Link href="#" className="hover:text-[#c29547] transition-colors">{t("سياسة الخصوصية", "Privacy Policy")}</Link>
          <Link href="#" className="hover:text-[#c29547] transition-colors">{t("مستوى الخدمة SLA", "SLA Agreement")}</Link>
        </div>
      </div>
    </footer>
  );
}
