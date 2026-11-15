"use client";

import React from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function SubscriptionsCustomBanner() {
  const { t, isEn } = useLanguage();

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mb-14 relative z-10">
      <div className="rounded-3xl bg-white dark:bg-[#1a120d] p-5 sm:p-6 border border-[#ded5c6] dark:border-[#38271c] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-start hover:border-[#c29547]/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#faf5eb] dark:bg-[#281c15] border border-[#eeddbb] dark:border-[#4d3a1f] flex items-center justify-center text-[#c29547] dark:text-[#d4a759] shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#1c1917] dark:text-[#fdfbf7]">
              {t("هل تحتاج إلى باقة مخصصة لشركتك أو فروع متعددة؟", "Need a custom plan for your firm or multiple branches?")}
            </h2>
            <p className="text-xs text-[#7d7367] dark:text-[#9e968a] mt-0.5">
              {t(
                "فريق مستشارينا جاهز لتصميم خطة متكاملة توافق شروطك واحتياجاتك القانونية الخاصة بدقة.",
                "Our consultants are ready to tailor an integrated plan tailored precisely to your specific legal requirements."
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {}}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#c29547] dark:text-[#d4a759] hover:text-[#1c1917] dark:hover:text-[#f5f4f0] bg-[#faf5eb] dark:bg-[#281c15] hover:bg-[#eeddbb] dark:hover:bg-[#342a1e] border border-[#eeddbb] dark:border-[#4d3a1f] transition-all cursor-pointer shadow-2xs group"
        >
          <span>{t("تواصل مع مستشارينا الآن", "Contact Our Consultants Now")}</span>
          {!isEn ? (
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          ) : (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          )}
        </button>
      </div>
    </section>
  );
}
