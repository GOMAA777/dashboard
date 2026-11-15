"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function SubscriptionsFaqSection() {
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
      question: "ما هي خطة الاشتراك الأنسب لمكتبي أو نشاطي القانوني؟",
      answer:
        "إذا كنت محامياً مستقلاً وتبدأ نشاطك يمكنك البدء بالباقة المجانية. أما إذا كان لديك فريق عمل ومساعدين وقضايا نشطة مستمرة فإن باقة المحترف هي الأكثر طلباً، وللشركات الكبرى ذات الفروع المتعددة توفر باقة المؤسسات سعة مفتوحة ودعماً مخصصاً.",
    },
    {
      id: "faq2",
      question: "هل يمكنني ترقية أو تخفيض باقتي في أي وقت؟",
      answer:
        "نعم بكل تأكيد. يمكنك ترقية باقتك فوراً بنقرة واحدة من لوحة التحكم، وسيتم احتساب الأيام المتبقية والمبلغ المدفوع كخصم تلقائي على الباقة الجديدة دون أي هدر.",
    },
    {
      id: "faq3",
      question: "ما هي طرق الدفع المعتمدة؟",
      answer:
        "نقبل كافة وسائل الدفع الإلكتروني المعتمدة: بطاقات مدى، فيزا، ماستركارد، وApple Pay، بالإضافة إلى خيار التحويل البنكي المباشر لاشتراكات الشركات السنوية.",
    },
    {
      id: "faq4",
      question: "هل بيانات القضايا والمستندات سرية ومشفرة؟",
      answer:
        "السرية القانونية هي خطنا الأحمر. جميع ملفات القضايا ومستندات الموكلين مشفرة بتشفير مصرفي متقدم (AES-256) عبر خوادم سحابية محمية داخل المملكة، ولا يمكن لأي طرف ثالث الاطلاع عليها.",
    },
    {
      id: "faq5",
      question: "هل يتم إصدار فواتير ضريبية إلكترونية معتمدة؟",
      answer:
        "نعم، فور إتمام السداد يصدر النظام فاتورة ضريبية إلكترونية رسمية متوافقة كلياً مع متطلبات هيئة الزكاة والضريبة والجمارك (ZATCA) جاهزة للتحميل والتوثيق المالي لمكتبك.",
    },
    {
      id: "faq6",
      question: "ماذا يحدث لبياناتي إذا انتهت فترة الاشتراك ولم أجدد؟",
      answer:
        "تظل كافة بياناتك وملفاتك وقضاياك محفوظة بأمان تام في وضع القراءة، ولن يتم حذف أو تقييد الوصول لبياناتك السابقة أبداً، وتستعيد كامل الصلاحيات فور التجديد.",
    },
    {
      id: "faq7",
      question: "هل يوجد حد أقصى لحجم المستندات المرفوعة؟",
      answer:
        "تختلف السعة السحابية باختلاف الباقة: تبدأ من 1 جيجابايت للباقة المجانية، وتصل إلى 25 جيجابايت لباقة المحترف، وسعة غير محدودة لباقة المؤسسات، مع دعم رفع ملفات PDF وصور ومستندات بمختلف الأحجام.",
    },
    {
      id: "faq8",
      question: "كيف يمكنني إلغاء الاشتراك أو إيقاف التجديد التلقائي؟",
      answer:
        "يمكنك في أي لحظة تعطيل التجديد التلقائي بضغطة زر واحدة من إعدادات الفوترة بحسابك، دون أي أسئلة أو شروط جزائية، وسيظل حسابك نشطاً حتى نهاية الفترة المدفوعة.",
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
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1c1917] dark:text-[#f5f4f0] mb-2 tracking-tight">
          الأسئلة الشائعة حول الاشتراكات
        </h2>
        <p className="text-xs sm:text-sm text-[#7d7367] dark:text-[#9e968a]">
          إجابات واضحة ومباشرة على كل ما يتعلق بالباقات، الدفع، والأمان
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
                  ? "bg-white dark:bg-[#1a1816] border-[#c29547]/50 dark:border-[#d4a759]/50 shadow-xs"
                  : "bg-white/80 dark:bg-[#1a1816]/80 border-[#ded5c6]/70 dark:border-[#2f2a24] hover:border-[#c29547]/40"
              )}
            >
              <button
                type="button"
                onClick={() => toggleItem(faq.id)}
                className="w-full py-4 px-5 sm:px-6 flex items-center justify-between gap-4 text-start cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm font-bold text-[#1c1917] dark:text-[#f5f4f0] group-hover:text-[#c29547] dark:group-hover:text-[#d4a759] transition-colors leading-relaxed">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 border",
                    isOpen
                      ? "bg-[#faf5eb] dark:bg-[#251f17] border-[#eeddbb] dark:border-[#4d3a1f] text-[#c29547] dark:text-[#d4a759] rotate-180"
                      : "bg-[#faf8f4] dark:bg-[#201d1a] border-[#e2d8c9] dark:border-[#332b21] text-[#8c8279] dark:text-[#9e968a]"
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
                <div className="px-5 sm:px-6 pb-4 pt-1 border-t border-[#f2ede4] dark:border-[#251f18] text-start">
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
