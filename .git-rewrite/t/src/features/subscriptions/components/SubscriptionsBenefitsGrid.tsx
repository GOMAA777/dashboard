"use client";

import React from "react";
import { ShieldCheck, TrendingUp, Unlock, AlertCircle, FileText } from "lucide-react";

export function SubscriptionsBenefitsGrid() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-16 relative z-10">
      {/* Decorative Section Divider Dot */}
      <div className="flex items-center justify-center gap-1.5 mb-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c29547]/40" />
        <span className="w-2 h-2 rounded-full bg-[#c29547]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#c29547]/40" />
      </div>

      {/* Row 1: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card 1 */}
        <div className="rounded-3xl bg-white dark:bg-[#1a1816] p-6 border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs text-start hover:border-[#c29547]/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#faf5eb] dark:bg-[#251f17] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] mb-4">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-[#1c1917] dark:text-[#f5f4f0] mb-2">
            مرونة كاملة في الترقية مع نمو أعمالك
          </h3>
          <p className="text-xs text-[#70675c] dark:text-[#9e968a] leading-relaxed">
            يمكنك الانتقال بين الباقات في أي وقت وسنقوم باحتساب الفارق الزمني والمالي تلقائياً وبكل شفافية دون أي انقطاع في خدماتك.
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-3xl bg-white dark:bg-[#1a1816] p-6 border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs text-start hover:border-[#c29547]/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#faf5eb] dark:bg-[#251f17] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] mb-4">
            <Unlock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-[#1c1917] dark:text-[#f5f4f0] mb-2">
            بدون عقود ملزمة أو رسوم خفية
          </h3>
          <p className="text-xs text-[#70675c] dark:text-[#9e968a] leading-relaxed">
            أنت حر تماماً في إلغاء أو تجميد اشتراكك متى شئت دون شروط جزائية أو تكاليف غير معلنة، فالثقة هي أساس تعاملنا.
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-3xl bg-white dark:bg-[#1a1816] p-6 border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs text-start hover:border-[#c29547]/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#faf5eb] dark:bg-[#251f17] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-[#1c1917] dark:text-[#f5f4f0] mb-2">
            سرية وتشفير مصرفي لملفات القضايا
          </h3>
          <p className="text-xs text-[#70675c] dark:text-[#9e968a] leading-relaxed">
            تشفير شامل لبيانات ومستندات الموكلين بأعلى معايير الأمن السيبراني المعتمدة لضمان سرية وأمان العمل القانوني.
          </p>
        </div>
      </div>

      {/* Row 2: 2 Wider Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 4 */}
        <div className="rounded-3xl bg-white dark:bg-[#1a1816] p-6 border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs text-start hover:border-[#c29547]/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#faf5eb] dark:bg-[#251f17] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] mb-4">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-[#1c1917] dark:text-[#f5f4f0] mb-2">
            ماذا يحدث عند الاقتراب من حد الاستخدام؟
          </h3>
          <p className="text-xs text-[#70675c] dark:text-[#9e968a] leading-relaxed">
            نرسل إليك تنبيهاً ذكياً مسبقاً دون إيقاف أعمالك أو تعطيل وصولك للقضايا، مع إمكانية الترقية السلسة بضغطة زر واحدة لتفادي أي توقف.
          </p>
        </div>

        {/* Card 5 */}
        <div className="rounded-3xl bg-white dark:bg-[#1a1816] p-6 border border-[#ded5c6] dark:border-[#2f2a24] shadow-xs text-start hover:border-[#c29547]/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#faf5eb] dark:bg-[#251f17] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-extrabold text-[#1c1917] dark:text-[#f5f4f0] mb-2">
            فواتير ضريبية إلكترونية معتمدة
          </h3>
          <p className="text-xs text-[#70675c] dark:text-[#9e968a] leading-relaxed">
            إصدار فوري لفواتير الاشتراك الضريبية المتوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك مع إرسالها تلقائياً لبريدك الإلكتروني.
          </p>
        </div>
      </div>
    </section>
  );
}
