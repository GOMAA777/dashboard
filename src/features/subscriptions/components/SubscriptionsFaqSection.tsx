"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function SubscriptionsFaqSection() {
  const { t } = useLanguage();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    faq1: true, // First open by default
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqs: FaqItem[] = [
    {
      id: "faq1",
      question: t("ما هي خطة الاشتراك الأنسب لمكتبي أو نشاطي القانوني؟", "Which subscription plan is best for my office or legal practice?"),
      answer: t(
        "إذا كنت محامياً مستقلاً وتبدأ نشاطك يمكنك البدء بالباقة المجانية. أما إذا كان لديك فريق عمل ومساعدين وقضايا نشطة مستمرة فإن باقة المحترف هي الأكثر طلباً، وللشركات الكبرى ذات الفروع المتعددة توفر باقة المؤسسات سعة مفتوحة ودعماً مخصصاً.",
        "If you are a solo practitioner just starting, you can start with the Free tier. If you have a team and continuous active cases, Pro is most popular. For large multi-branch firms, Enterprise provides open quotas and dedicated support."
      ),
    },
    {
      id: "faq2",
      question: t("هل يمكنني ترقية أو تخفيض باقتي في أي وقت؟", "Can I upgrade or downgrade my plan anytime?"),
      answer: t(
        "نعم بكل تأكيد. يمكنك ترقية باقتك فوراً بنقرة واحدة من لوحة التحكم، وسيتم احتساب الأيام المتبقية والمبلغ المدفوع كخصم تلقائي على الباقة الجديدة دون أي هدر.",
        "Yes, absolutely. Upgrade anytime with one click; remaining days and paid amounts are prorated automatically."
      ),
    },
    {
      id: "faq3",
      question: t("ما هي طرق الدفع المعتمدة؟", "What payment methods are supported?"),
      answer: t(
        "نقبل كافة وسائل الدفع الإلكتروني المعتمدة: بطاقات مدى، فيزا، ماستركارد، وApple Pay، بالإضافة إلى خيار التحويل البنكي المباشر لاشتراكات الشركات السنوية.",
        "We accept all approved electronic payment methods: Mada, Visa, Mastercard, Apple Pay, plus direct wire transfer for annual enterprise plans."
      ),
    },
    {
      id: "faq4",
      question: t("هل بيانات القضايا والمستندات سرية ومشفرة؟", "Are case data and documents confidential and encrypted?"),
      answer: t(
        "السرية القانونية هي خطنا الأحمر. جميع ملفات القضايا ومستندات الموكلين مشفرة بتشفير مصرفي متقدم (AES-256) عبر خوادم سحابية محمية داخل المملكة، ولا يمكن لأي طرف ثالث الاطلاع عليها.",
        "Legal confidentiality is paramount. All case files and documents are encrypted with banking-grade AES-256 on secure Saudi-hosted cloud servers."
      ),
    },
    {
      id: "faq5",
      question: t("هل يتم إصدار فواتير ضريبية إلكترونية معتمدة؟", "Are official electronic tax invoices issued?"),
      answer: t(
        "نعم، فور إتمام السداد يصدر النظام فاتورة ضريبية إلكترونية رسمية متوافقة كلياً مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA) جاهزة للتحميل والتوثيق المالي لمكتبك.",
        "Yes, immediately upon payment the system generates a ZATCA-compliant electronic tax invoice ready for download."
      ),
    },
    {
      id: "faq6",
      question: t("ماذا يحدث لبياناتي إذا انتهت فترة الاشتراك ولم أجدد؟", "What happens to my data if my subscription expires and I don't renew?"),
      answer: t(
        "تظل كافة بياناتك وملفاتك وقضاياك محفوظة بأمان تام في وضع القراءة، ولن يتم حذف أو تقييد الوصول لبياناتك السابقة أبداً، وتستعيد كامل الصلاحيات فور التجديد.",
        "All your data and files remain safe in read-only mode; your files are never deleted and full access restores upon renewal."
      ),
    },
    {
      id: "faq7",
      question: t("هل يوجد حد أقصى لحجم المستندات المرفوعة؟", "Is there a maximum size for uploaded documents?"),
      answer: t(
        "تختلف السعة السحابية باختلاف الباقة: تبدأ من 1 جيجابايت للباقة المجانية، وتصل إلى 25 جيجابايت لباقة المحترف، وسعة غير محدودة لباقة المؤسسات، مع دعم رفع ملفات PDF وصور ومستندات بمختلف الأحجام.",
        "Cloud storage varies by plan: from 1 GB for Free, up to 25 GB for Pro, and unlimited for Enterprise, supporting PDF, images, and office documents."
      ),
    },
    {
      id: "faq8",
      question: t("كيف يمكنني إلغاء الاشتراك أو إيقاف التجديد التلقائي؟", "How can I cancel or pause automatic renewal?"),
      answer: t(
        "يمكنك في أي لحظة تعطيل التجديد التلقائي بضغطة زر واحدة من إعدادات الفوترة بحسابك، دون أي أسئلة أو شروط جزائية، وسيظل حسابك نشطاً حتى نهاية الفترة المدفوعة.",
        "You can disable auto-renewal anytime with one click in your billing settings without penalties; account stays active until end of paid term."
      ),
    },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 mb-20 relative z-10">
      {/* Decorative Section Divider Dot */}
      <div className="flex items-center justify-center gap-1.5 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c29547]/40" />
        <span className="w-2 h-2 rounded-full bg-[#c29547]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#c29547]/40" />
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-[11px] font-extrabold text-[#c29547] dark:text-[#d4a759] tracking-wider uppercase block mb-1">
          F . A . Q
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1917] dark:text-[#fdfbf7] mb-2 tracking-tight">
          {t("الأسئلة الشائعة حول الاشتراكات", "Frequently Asked Questions")}
        </h2>
        <p className="text-xs sm:text-sm text-[#7d7367] dark:text-[#9e968a]">
          {t("إجابات واضحة ومباشرة على كل ما يتعلق بالباقات، الدفع، والأمان", "Clear, direct answers regarding plans, billing, and security")}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = Boolean(openIds[faq.id]);

          return (
            <div
              key={faq.id}
              className={cn(
                "rounded-2xl border transition-all overflow-hidden",
                isOpen
                  ? "bg-white dark:bg-[#1a120d] border-[#c29547]/50 dark:border-[#d4a759]/50 shadow-xs"
                  : "bg-white/80 dark:bg-[#1a120d]/80 border-[#ded5c6]/70 dark:border-[#38271c] hover:border-[#c29547]/40"
              )}
            >
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                className="w-full py-4 px-5 sm:px-6 flex items-center justify-between gap-4 text-start cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm font-bold text-[#1c1917] dark:text-[#fdfbf7] group-hover:text-[#c29547] dark:group-hover:text-[#d4a759] transition-colors leading-relaxed">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 border",
                    isOpen
                      ? "bg-[#faf5eb] dark:bg-[#281c15] border-[#eeddbb] dark:border-[#4d3a1f] text-[#c29547] dark:text-[#d4a759] rotate-180"
                      : "bg-[#faf8f4] dark:bg-[#281c15] border-[#e2d8c9] dark:border-[#332b21] text-[#8c8279] dark:text-[#9e968a]"
                  )}
                >
                  {isOpen ? (
                    <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-4 pt-1 border-t border-[#f2ede4] dark:border-[#38271c] text-start">
                  <p className="text-xs text-[#696155] dark:text-[#a8a195] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
