"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSubscriptionSchema, CreateSubscriptionInput } from "../schemas/subscription.schemas";
import { X, Building2 } from "lucide-react";
import { toast } from "sonner";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (data: CreateSubscriptionInput) => void;
}

export function AddSubscriptionModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: AddSubscriptionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSubscriptionInput>({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      planName: "الباقة الذهبية",
      billingCycle: "سنوية",
      paymentMethod: "mada",
      city: "الرياض",
    },
  });

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<CreateSubscriptionInput> = async (values) => {
    try {
      onSubmitSuccess(values);
      toast.success("تم تسجيل طلب الاشتراك بنجاح");
      reset();
      onClose();
    } catch {
      toast.error("حدث خطأ أثناء حفظ الاشتراك");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-[#1e1c1a] rounded-[12px] shadow-2xl border border-[#f0eeea] dark:border-[#2f2a24] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 font-['Cairo']"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#f0eeea] dark:border-[#2f2a24] bg-[#faf9f7] dark:bg-[#25221e]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-[8px] bg-[#9c6402]/10 text-[#9c6402] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                إضافة اشتراك جديد
              </h2>
              <p className="text-[12px] text-[#514537] dark:text-[#a89f91]">
                تسجيل مكتب محاماة وتعيين باقة الاشتراك ودورة الفوترة
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#837565] hover:bg-[#eae8e4] dark:hover:bg-[#38332c] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Firm Name */}
            <div>
              <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                اسم مكتب المحاماة *
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("firmName")}
                  placeholder="شركة التميمي ومشاركوه للمحاماة"
                  className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
                />
              </div>
              {errors.firmName && (
                <span className="text-[11px] text-[#dc2626] mt-1 block">
                  {errors.firmName.message}
                </span>
              )}
            </div>

            {/* License Number */}
            <div>
              <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                رقم ترخيص وزارة العدل *
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("licenseNumber")}
                  placeholder="104/39"
                  className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
                />
              </div>
              {errors.licenseNumber && (
                <span className="text-[11px] text-[#dc2626] mt-1 block">
                  {errors.licenseNumber.message}
                </span>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                المدينة *
              </label>
              <input
                type="text"
                {...register("city")}
                placeholder="الرياض"
                className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
              />
              {errors.city && (
                <span className="text-[11px] text-[#dc2626] mt-1 block">
                  {errors.city.message}
                </span>
              )}
            </div>

            {/* Owner/Director Name */}
            <div>
              <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                اسم المدير المسؤول *
              </label>
              <input
                type="text"
                {...register("ownerName")}
                placeholder="د. عبد الرحمن آل ناصر"
                className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
              />
              {errors.ownerName && (
                <span className="text-[11px] text-[#dc2626] mt-1 block">
                  {errors.ownerName.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                البريد الإلكتروني المعتمد *
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="info@lawfirm.sa"
                className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
              />
              {errors.email && (
                <span className="text-[11px] text-[#dc2626] mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                رقم الهاتف الموثق *
              </label>
              <input
                type="text"
                {...register("phone")}
                placeholder="+966 50 123 4567"
                className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
              />
              {errors.phone && (
                <span className="text-[11px] text-[#dc2626] mt-1 block">
                  {errors.phone.message}
                </span>
              )}
            </div>

            {/* Plan Name */}
            <div>
              <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                نوع الباقة *
              </label>
              <select
                {...register("planName")}
                className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none cursor-pointer"
              >
                <option value="الباقة المخصصة">الباقة المخصصة (Custom - 24,500 ر.س)</option>
                <option value="الباقة الذهبية">الباقة الذهبية (12,000 ر.س)</option>
                <option value="الباقة الفضية">الباقة الفضية (9,200 ر.س)</option>
                <option value="الباقة الأساسية">الباقة الأساسية (5,400 ر.س)</option>
              </select>
            </div>

            {/* Billing Cycle */}
            <div>
              <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                دورة الفوترة *
              </label>
              <select
                {...register("billingCycle")}
                className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none cursor-pointer"
              >
                <option value="سنوية">سنوية (توفير 15%)</option>
                <option value="شهرية">شهرية</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                وسيلة الدفع *
              </label>
              <select
                {...register("paymentMethod")}
                className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none cursor-pointer"
              >
                <option value="mada">بطاقة مدى البنكية</option>
                <option value="visa">VISA / Mastercard</option>
                <option value="sadad">نظام سداد للمدفوعات</option>
                <option value="transfer">تحويل بنكي مباشر</option>
              </select>
            </div>

            {/* Tax Number */}
            <div>
              <label className="block text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] mb-1">
                الرقم الضريبي للمكتب (ZATCA)
              </label>
              <input
                type="text"
                {...register("taxNumber")}
                placeholder="301298457200003"
                className="w-full h-10 px-3 bg-[#f5f3ef] dark:bg-[#2c2621] rounded-[6px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] border-none focus:ring-1 focus:ring-[#9c6402] focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#f0eeea] dark:border-[#2f2a24]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[6px] text-[13px] font-semibold text-[#514537] dark:text-[#a89f91] hover:bg-[#f0eeea] dark:hover:bg-[#2c2621] transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#9c6402] hover:bg-[#825200] text-white px-5 py-2 rounded-[6px] text-[13px] font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              إنشاء وتفعيل الاشتراك
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
