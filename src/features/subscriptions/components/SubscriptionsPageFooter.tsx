"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Phone, Award, Scale } from "lucide-react";

export function SubscriptionsPageFooter() {
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
                منصة الجودي
              </span>
              <span className="text-[10px] text-[#8c8279] dark:text-[#9e968a] block">
                إدارة مكاتب وشركات المحاماة
              </span>
            </div>
          </div>
          <p className="text-xs text-[#736a5e] dark:text-[#9e968a] leading-relaxed">
            المنصة السحابية الأولى المتخصصة في أتمتة وإدارة أعمال مكاتب المحاماة، القضايا، الجلسات، والموكلين بأعلى معايير الأمان والخصوصية.
          </p>
        </div>

        {/* Col 2: Plans & Features */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-[#1c1917] dark:text-[#fdfbf7] block">
            باقات المنصة
          </span>
          <ul className="space-y-2 text-xs text-[#736a5e] dark:text-[#9e968a]">
            <li>باقة المحامي المستقل (مجاناً)</li>
            <li>باقة المحترف للمكاتب المتوسطة</li>
            <li>باقة المؤسسات والشركات الكبرى</li>
            <li>اتفاقيات الفروع والشركاء</li>
          </ul>
        </div>

        {/* Col 3: Trust & Compliance */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-[#1c1917] dark:text-[#fdfbf7] block">
            الأمان والامتثال
          </span>
          <ul className="space-y-2 text-xs text-[#736a5e] dark:text-[#9e968a]">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c29547]" />
              <span>تشفير مصرفي للبيانات (AES-256)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#c29547]" />
              <span>فواتير معتمدة من هيئة الزكاة (ZATCA)</span>
            </li>
            <li>خوادم سحابية محلية آمنة</li>
            <li>سياسة الخصوصية وسرية الموكلين</li>
          </ul>
        </div>

        {/* Col 4: Contact & Support */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-[#1c1917] dark:text-[#fdfbf7] block">
            الدعم الفني والمبيعات
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
            <li>دعم فوري على مدار الساعة للمشتركين</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#ded5c6]/50 dark:border-[#38271c] text-[11px] text-[#8c8279] dark:text-[#8e8680]">
        <span>© 2005-2026 منصة الجودي لإدارة مكاتب وشركات المحاماة. جميع الحقوق محفوظة.</span>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-[#c29547] transition-colors">شروط الاستخدام</Link>
          <Link href="#" className="hover:text-[#c29547] transition-colors">سياسة الخصوصية</Link>
          <Link href="#" className="hover:text-[#c29547] transition-colors">مستوى الخدمة SLA</Link>
        </div>
      </div>
    </footer>
  );
}
