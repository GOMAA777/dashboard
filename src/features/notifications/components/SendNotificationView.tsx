"use client";

import React, { useState } from "react";
import Image from "next/image";
import placeholderBannerImg from "../../../../public/figma/placeholder-banner.png";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Check,
  RotateCw,
  Trash2,
  ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  Info,
  Building2,
  Timer,
  Shield,
  Upload,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  sendNotificationSchema,
  SendNotificationFormValues,
} from "../schemas/notifications.schemas";
import { NotificationItem } from "../types/notifications.types";
import { useLanguage } from "@/lib/i18n";

interface SendNotificationViewProps {
  onBack: () => void;
  onSubmitSend: (values: SendNotificationFormValues) => void;
  onSaveDraft: (values: SendNotificationFormValues) => void;
  initialData?: NotificationItem | null;
}

export function SendNotificationView({
  onBack,
  onSubmitSend,
  onSaveDraft,
  initialData,
}: SendNotificationViewProps) {
  const { direction, isEn } = useLanguage();

  const mockLawFirms: Array<{ id: string; name: string; activeLicenses: number }> = [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SendNotificationFormValues>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      actionUrl: initialData?.actionUrl || "",
      audienceType: initialData?.audienceType || "all",
      specificFirmId: "",
      imageUrl: initialData?.imageUrl || "",
      imageFileName: initialData?.imageFileName || "",
      imageFileSize: initialData?.imageFileSize || "",
      imageDimensions: initialData?.imageDimensions || "",
      categoryBadge: initialData?.categoryBadge || "",
      actionButtonText: initialData?.actionButtonText || "",
      isDraft: false,
    },
  });

  const formValues = watch();
  const [hasImage, setHasImage] = useState(Boolean(formValues.imageUrl));

  const handleAudienceChange = (type: "all" | "specific") => {
    setValue("audienceType", type);
  };

  const handleRemoveImage = () => {
    setValue("imageUrl", "");
    setValue("imageFileName", "");
    setValue("imageFileSize", "");
    setValue("imageDimensions", "");
    setHasImage(false);
    toast.info(isEn ? "Attached image removed" : "تمت إزالة الصورة المرفقة");
  };

  const handlePresetImageSelect = (
    url: string,
    filename: string,
    size: string,
    dimensions: string
  ) => {
    setValue("imageUrl", url);
    setValue("imageFileName", filename);
    setValue("imageFileSize", size);
    setValue("imageDimensions", dimensions);
    setHasImage(true);
    toast.success(
      isEn ? "Notification image updated" : "تم تحديث صورة الإشعار"
    );
  };

  const onFormSubmit = (data: SendNotificationFormValues) => {
    onSubmitSend(data);
  };

  const handleDraftClick = () => {
    const current = watch();
    onSaveDraft({ ...current, isDraft: true });
  };

  return (
    <div dir={direction} className="space-y-6 pb-2 sm:pb-3">
      {/* Main Identity & Command Banner */}
      <div
        className="bg-white dark:bg-[#221812] rounded-2xl p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
      >
        <div>
          <h1 className="text-[24px] sm:text-[26px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[36px]">
            {isEn ? "Send New Notification" : "إرسال إشعار جديد"}
          </h1>
          <p className="text-[14px] text-[#514537] dark:text-[#cdc5bd] mt-1 max-w-[640px] leading-[22.75px]">
            {isEn
              ? "Add notification title, details, select target recipients and action link before broadcasting."
              : "أضف عنوان الإشعار وتفاصيله وحدد المستلمين ورابط الإجراء قبل الإرسال للبث عبر قنوات المنصة المعتمدة."}
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="bg-white dark:bg-[#281c15] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#e6e2dc] dark:border-[#38271c] px-4 py-2 rounded-xl font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0 cursor-pointer"
        >
          {isEn ? (
            <ArrowLeft className="size-4" />
          ) : (
            <ArrowRight className="size-4" />
          )}
          <span>{isEn ? "Back" : "العودة"}</span>
        </button>
      </div>

      {/* Main Dual Layout: Form + Live Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Form Column */}
        <div
          className="xl:col-span-7 bg-white dark:bg-[#221812] rounded-2xl p-6 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] space-y-6 text-start"
        >
          {/* SECTION 1: Notification Content */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[26px]">
                {isEn ? "Notification Content & Details" : "محتوى الإشعار وتفاصيله"}
              </h2>
            </div>

            {/* Title Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                <span>{isEn ? "Notification Title" : "عنوان الإشعار"}</span>
                <span className="text-[#ba1a1a] font-bold">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder={
                  isEn
                    ? "Mandatory Security Update: 2FA Standards Upgrade"
                    : "تحديث أمني إلزامي: ترقية معايير المصادقة الثنائية (2FA)"
                }
                className="w-full bg-[#f5f3ef]/50 dark:bg-[#1a120d] border border-[#e6e2dc] dark:border-[#38271c] rounded-xl px-3.5 py-2.5 text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] transition-colors"
              />
              {errors.title ? (
                <p className="text-[12px] text-[#ba1a1a] font-medium">{errors.title.message}</p>
              ) : (
                <p className="text-[12px] text-[#514537] dark:text-[#8e8680] leading-[18px]">
                  {isEn
                    ? "A concise title accurately stating the required legal or technical action."
                    : "عنوان مختصر وواضح يوضح موضوع الإجراء القانوني أو التقني المطلوب بدقة."}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                <span>{isEn ? "Notification Description" : "وصف الإشعار"}</span>
                <span className="text-[#ba1a1a] font-bold">*</span>
              </label>
              <textarea
                rows={5}
                {...register("description")}
                placeholder={
                  isEn
                    ? "Please note that 2FA verification will be activated across all accounts starting Sunday..."
                    : "نحيطكم علماً بأنه سيتم تفعيل متطلبات التحقق الثنائي عبر النفاذ الوطني الموحد..."
                }
                className="w-full bg-[#f5f3ef]/50 dark:bg-[#1a120d] border border-[#e6e2dc] dark:border-[#38271c] rounded-xl px-3.5 py-2.5 text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] transition-colors leading-[22px]"
              />
              {errors.description ? (
                <p className="text-[12px] text-[#ba1a1a] font-medium">
                  {errors.description.message}
                </p>
              ) : (
                <p className="text-[12px] text-[#514537] dark:text-[#8e8680] leading-[18px]">
                  {isEn
                    ? "This text will be included in the email body and direct push alert."
                    : "سيتم إرسال هذا النص في جسم الرسالة البريدية والتنبيه المباشر."}
                </p>
              )}
            </div>
          </section>

          <hr className="border-[#eae8e4] dark:border-[#38271c]" />

          {/* SECTION 2: Notification Image Upload */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Notification Image" : "صورة الإشعار"}
              </h2>
              <span className="bg-[#f0eeea] dark:bg-[#1a120d] text-[#837565] dark:text-[#8e8680] text-[10px] font-bold px-2 py-0.5 rounded-[4px] border border-transparent dark:border-[#38271c]">
                {isEn ? "Optional" : "اختياري"}
              </span>
            </div>

            {/* Uploaded Card or Dropzone */}
            {hasImage ? (
              <div
                className="bg-[#f5f3ef] dark:bg-[#1a120d] rounded-xl p-4 border border-[#e6e2dc]/60 dark:border-[#38271c] space-y-3"
              >
                <div className="flex items-center justify-between">
                  {/* Actions: Replace / Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-[#ffdad6] dark:bg-rose-950/50 hover:bg-[#ffb4ab] dark:hover:bg-rose-900 text-[#ba1a1a] dark:text-rose-300 px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-transparent dark:border-rose-900"
                      title={isEn ? "Delete image" : "حذف الصورة"}
                    >
                      <Trash2 className="size-3.5" />
                      <span>{isEn ? "Delete" : "حذف"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handlePresetImageSelect(
                          placeholderBannerImg.src,
                          "announcement_banner.png",
                          isEn ? "120 KB" : "120 كيلوبايت",
                          isEn ? "800 × 450 px" : "800 × 450 بكسل"
                        )
                      }
                      className="bg-white dark:bg-[#281c15] hover:bg-[#faf9f7] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#e6e2dc] dark:border-[#38271c] px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      title={isEn ? "Replace image" : "استبدال الصورة"}
                    >
                      <RotateCw className="size-3.5" />
                      <span>{isEn ? "Replace" : "استبدال"}</span>
                    </button>
                  </div>

                  {/* Image info & preview */}
                  <div className="flex items-center gap-3">
                    <div className="text-start">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-bold max-w-[240px] truncate">
                          {formValues.imageFileName || "security_update_banner.png"}
                        </span>
                        <span className="bg-[#d1fae5] dark:bg-emerald-950/50 text-[#065f46] dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-[4px] flex items-center gap-1 shrink-0 border border-transparent dark:border-emerald-800">
                          <span className="size-1.5 rounded-full bg-[#059669]" />
                          <span>{isEn ? "Uploaded" : "تم الرفع بنجاح"}</span>
                        </span>
                      </div>
                      <p className="text-[#514537] dark:text-[#8e8680] text-[12px] mt-0.5 font-mono">
                        {formValues.imageFileSize || "480 KB"} •{" "}
                        {formValues.imageDimensions || (isEn ? "800 × 450 px" : "800 × 450 بكسل")}
                      </p>
                    </div>

                    <div className="bg-[#f0eeea] dark:bg-[#1a120d] border border-[#d6c4b1]/40 dark:border-[#38271c] rounded-lg w-[63px] h-[52px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden shrink-0 relative flex items-center justify-center">
                      <Image
                        src={formValues.imageUrl || placeholderBannerImg}
                        alt="Preview"
                        width={63}
                        height={52}
                        className="object-cover size-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Supported Specifications Label */}
                <div className="pt-2 border-t border-[#e6e2dc]/50 dark:border-[#38271c] flex items-center justify-end gap-2 text-[#514537] dark:text-[#8e8680] text-[10px] font-bold">
                  <p>
                    {isEn
                      ? "Supported formats: PNG, JPG, WebP up to 2MB (Recommended: 800 × 450 px)"
                      : "الصيغ المدعومة: PNG, JPG, WebP بحجم أقصى 2 ميجابايت (الأبعاد الموصى بها: 800 × 450 بكسل)"}
                  </p>
                  <ImageIcon className="size-3 text-[#837565] dark:text-[#8e8680]" />
                </div>
              </div>
            ) : (
              <div className="bg-[#f5f3ef]/60 dark:bg-[#1a120d] border-2 border-dashed border-[#ded5c6] dark:border-[#38271c] rounded-xl p-6 text-center space-y-3">
                <div className="size-10 rounded-full bg-white dark:bg-[#281c15] border border-transparent dark:border-[#38271c] flex items-center justify-center mx-auto text-[#9c6402] dark:text-[#e29d38] shadow-sm">
                  <Upload className="size-5" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isEn
                      ? "Drag and drop image here, or click to browse"
                      : "اسحب الصورة وأفلتها هنا، أو اضغط للاختيار"}
                  </p>
                  <p className="text-[12px] text-[#514537] dark:text-[#8e8680] mt-1">
                    {isEn
                      ? "PNG, JPG, WebP up to 2MB (Recommended 800 × 450 px)"
                      : "PNG, JPG, WebP حتى 2 ميجابايت (الموصى به 800 × 450 بكسل)"}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetImageSelect(
                        placeholderBannerImg.src,
                        "security_update_banner.png",
                        isEn ? "480 KB" : "480 كيلوبايت",
                        isEn ? "800 × 450 px" : "800 × 450 بكسل"
                      )
                    }
                    className="text-[12px] bg-white dark:bg-[#281c15] border border-[#e6e2dc] dark:border-[#38271c] text-[#9c6402] dark:text-[#e29d38] hover:bg-[#faf9f7] dark:hover:bg-[#38271c] px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    {isEn
                      ? "Use Default Cyber Security Banner"
                      : "استخدام بنر الأمان السيبراني الافتراضي"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetImageSelect(
                        placeholderBannerImg.src,
                        "legal_compliance_banner.png",
                        isEn ? "510 KB" : "510 كيلوبايت",
                        isEn ? "800 × 450 px" : "800 × 450 بكسل"
                      )
                    }
                    className="text-[12px] bg-white dark:bg-[#281c15] border border-[#e6e2dc] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:bg-[#faf9f7] dark:hover:bg-[#38271c] px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    {isEn
                      ? "Use Legal Compliance Banner"
                      : "استخدام بنر الامتثال القانوني"}
                  </button>
                </div>
              </div>
            )}
          </section>

          <hr className="border-[#eae8e4] dark:border-[#38271c]" />

          {/* SECTION 3: Action Destination URL */}
          <section className="space-y-4">
            <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEn ? "Direct Action Link" : "رابط الإجراء المباشر"}
            </h2>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Action Destination URL" : "Action For (رابط الإجراء)"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  {...register("actionUrl")}
                  placeholder="https://aljudy.sa/law-firm/security-settings"
                  className="w-full bg-[#f5f3ef]/50 dark:bg-[#1a120d] border border-[#e6e2dc] dark:border-[#38271c] rounded-xl px-3.5 py-2.5 text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] font-mono placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] transition-colors"
                />
                <LinkIcon className="size-4 text-[#837565] dark:text-[#8e8680] absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.actionUrl ? (
                <p className="text-[12px] text-[#ba1a1a] font-medium">
                  {errors.actionUrl.message}
                </p>
              ) : (
                <p className="text-[12px] text-[#514537] dark:text-[#8e8680] leading-[18px]">
                  {isEn
                    ? "Enter the destination URL that will open when recipient clicks the notification."
                    : "أدخل الرابط الذي سيتم فتحه عند ضغط المستلم على الإشعار مباشرة"}
                </p>
              )}
            </div>
          </section>

          <hr className="border-[#eae8e4] dark:border-[#38271c]" />

          {/* SECTION 4: Recipients & Audience Targeting */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Recipients & Target Audience" : "المستلمون والجمهور المستهدف"}
              </h2>
              <span className="text-[#ba1a1a] text-[10px] font-semibold">
                {isEn ? "Required Selection *" : "اختيار إلزامي *"}
              </span>
            </div>

            <div className="space-y-3">
              {/* Option 1: All law firms */}
              <div
                onClick={() => handleAudienceChange("all")}
                className={`p-4 rounded-xl flex items-start gap-4 cursor-pointer transition-all border ${
                  formValues.audienceType === "all"
                    ? "bg-[#f5f3ef] dark:bg-[#281c15] border-[#7b4e00]/30 dark:border-[#e29d38]/50 shadow-sm"
                    : "bg-white dark:bg-[#1a120d] border-[#e6e2dc] dark:border-[#38271c] hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/50"
                }`}
              >
                <div className="mt-1">
                  <div
                    className={`size-4 rounded-full border flex items-center justify-center transition-colors ${
                      formValues.audienceType === "all"
                        ? "border-[#7b4e00] dark:border-[#e29d38] bg-white dark:bg-[#1a120d]"
                        : "border-[#767676] dark:border-[#52443a] bg-white dark:bg-[#1a120d]"
                    }`}
                  >
                    {formValues.audienceType === "all" && (
                      <div className="size-2 rounded-full bg-[#7b4e00] dark:bg-[#e29d38]" />
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {isEn
                        ? "All Subscribed Law Firms"
                        : "جميع مكاتب المحاماة المشتركة"}
                    </h3>
                    <span className="bg-[#7b4e00]/10 dark:bg-[#e29d38]/15 text-[#7b4e00] dark:text-[#f3c27e] text-[10px] font-bold px-2.5 py-0.5 rounded-[4px] border border-transparent dark:border-[#4d3627]">
                      {isEn
                        ? "Will broadcast to 842 active certified law firms"
                        : "سيتم الإرسال إلى 842 مكتب محاماة معتمد نشط"}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px] text-start">
                    {isEn
                      ? "Official circular broadcast to all lawyers, partners, and administrators via client dashboards."
                      : "بث تعميم رسمي لكافة المحامين، الشركاء، والإداريين ذوي الصلاحية عبر لوحات تحكم المكاتب الرسمية."}
                  </p>
                </div>
              </div>

              {/* Option 2: Specific Law Firm */}
              <div
                onClick={() => handleAudienceChange("specific")}
                className={`p-4 rounded-xl flex items-start gap-4 cursor-pointer transition-all border ${
                  formValues.audienceType === "specific"
                    ? "bg-[#f5f3ef] dark:bg-[#281c15] border-[#7b4e00]/30 dark:border-[#e29d38]/50 shadow-sm"
                    : "bg-white dark:bg-[#1a120d] border-[#e6e2dc] dark:border-[#38271c] hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/50"
                }`}
              >
                <div className="mt-1">
                  <div
                    className={`size-4 rounded-full border flex items-center justify-center transition-colors ${
                      formValues.audienceType === "specific"
                        ? "border-[#7b4e00] dark:border-[#e29d38] bg-white dark:bg-[#1a120d]"
                        : "border-[#767676] dark:border-[#52443a] bg-white dark:bg-[#1a120d]"
                    }`}
                  >
                    {formValues.audienceType === "specific" && (
                      <div className="size-2 rounded-full bg-[#7b4e00] dark:bg-[#e29d38]" />
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[17px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {isEn ? "Specific Law Firm" : "مكتب محدد بعينه"}
                    </h3>
                    <span className="bg-[#f0eeea] dark:bg-[#1a120d] text-[#837565] dark:text-[#8e8680] text-[10px] font-bold px-2 py-0.5 rounded-[4px] border border-transparent dark:border-[#38271c]">
                      {isEn ? "Private Directed Notice" : "توجيه إشعار خاص"}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[18px] text-start">
                    {isEn
                      ? "Customize the notification to a particular branch or firm for bilateral follow-up."
                      : "تخصيص الإشعار لفرع أو مكتب معين لمعالجة تنبيه انفرادي أو متابعة تعاقدية."}
                  </p>

                  {/* Firm Selector when Specific is active */}
                  {formValues.audienceType === "specific" && (
                    <div className="pt-2 animate-in fade-in duration-150">
                      <select
                        {...register("specificFirmId")}
                        className="w-full bg-white dark:bg-[#281c15] border border-[#e6e2dc] dark:border-[#38271c] rounded-xl px-3 py-2 text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38]"
                      >
                        <option value="">
                          {isEn ? "Select target law firm..." : "اختر مكتب المحاماة المستهدف..."}
                        </option>
                        {mockLawFirms.map((firm) => (
                          <option key={firm.id} value={firm.id}>
                            {firm.name} (
                            {isEn
                              ? `${firm.activeLicenses} active licenses`
                              : `${firm.activeLicenses} تراخيص نشطة`}
                            )
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Live Preview Column */}
        <div className="xl:col-span-5 space-y-4">
          <div
            className="bg-white dark:bg-[#221812] rounded-2xl p-4 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="size-4 text-[#9c6402] dark:text-[#e29d38]" />
                <span className="text-[17px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {isEn ? "Live Broadcast Preview" : "معاينة البث المباشر"}
                </span>
              </div>
              <span className="bg-[#f0eeea] dark:bg-[#1a120d] text-[#514537] dark:text-[#cdc5bd] text-[10px] font-bold px-2 py-0.5 rounded-[4px] border border-transparent dark:border-[#38271c]">
                {isEn
                  ? "Recipient App Simulation"
                  : "محاكاة لوحة وتطبيق المستلم"}
              </span>
            </div>

            {/* Notification Card Mockup in Client Dashboard */}
            <div
              className="bg-[#f5f3ef] dark:bg-[#1a120d] rounded-xl p-4 space-y-3 border border-[#eae8e4] dark:border-[#38271c]"
            >
              {/* Header inside mockup */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-start">
                  <div className="bg-[#9c6402] dark:bg-[#e29d38] size-7 rounded-lg flex items-center justify-center text-white dark:text-[#1c140f] shrink-0">
                    <Shield className="size-3.5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {isEn ? "Aljoody Legal Platform" : "منصة الجودي القانونية"}
                    </h4>
                    <p className="text-[10px] font-bold text-[#837565] dark:text-[#8e8680]">
                      {isEn ? "Now • Direct Notice" : "الآن • تنبيه موجه فوري"}
                    </p>
                  </div>
                </div>
                <span className="size-2 rounded-full bg-[#7b4e00] dark:bg-[#e29d38] mt-1 shrink-0" />
              </div>

              {/* Preview Thumbnail */}
              {hasImage && formValues.imageUrl && (
                <div
                  className="relative h-[145px] rounded-lg overflow-hidden shadow-inner border border-[#e4e2de] dark:border-[#38271c]"
                >
                  <Image
                    src={formValues.imageUrl}
                    alt="Preview banner"
                    fill
                    className="object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5"
                  >
                    <span className="bg-black/50 backdrop-blur-[4px] text-[#fff3e9] text-[10px] font-bold px-2 py-0.5 rounded-[4px]">
                      {formValues.categoryBadge ||
                        (isEn
                          ? "Security & Compliance"
                          : "الأمان والامتثال العدلي")}
                    </span>
                  </div>
                </div>
              )}

              {/* Preview Title & Content */}
              <div className="space-y-1 text-start">
                <h4 className="text-[15px] sm:text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[24px]">
                  {formValues.title ||
                    (isEn
                      ? "Default Notification Title"
                      : "عنوان الإشعار الافتراضي")}
                </h4>
                <p className="text-[12px] text-[#514537] dark:text-[#cdc5bd] leading-[19.5px] line-clamp-3">
                  {formValues.description ||
                    (isEn
                      ? "Notification instructions and details..."
                      : "نص الإشعار التوجيهي والملاحظات...")}
                </p>
              </div>

              {/* Action Button Preview */}
              <a
                href={formValues.actionUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7b4e00] hover:bg-[#643f00] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] text-[12px] font-bold py-2 px-3 rounded-lg w-full flex items-center justify-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
              >
                <ExternalLink className="size-3.5" />
                <span>
                  {formValues.actionButtonText ||
                    (isEn
                      ? "Update Security Settings Now"
                      : "تحديث إعدادات الأمان الآن")}
                </span>
              </a>
            </div>

            {/* Preview Info Footnote */}
            <div className="flex items-center gap-2 text-start text-[#514537] dark:text-[#8e8680] text-[10px] font-bold pt-1">
              <Info className="size-3.5 text-[#837565] dark:text-[#8e8680] shrink-0" />
              <p>
                {isEn
                  ? "The notification appears in toast popups and top navbar alerts upon broadcast."
                  : "يظهر الإشعار في التنبيهات المنبثقة وشريط الإشعارات العلوي للعملاء فور الاعتماد."}
              </p>
            </div>
          </div>

          {/* System Target Matrix Summary Card */}
          <div
            className="bg-white dark:bg-[#221812] rounded-2xl p-4 border border-[#e6e2dc] dark:border-[#38271c] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] space-y-3"
          >
            <h3 className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] text-start">
              {isEn ? "Distribution & Readiness Summary" : "ملخص التوزيع والجاهزية"}
            </h3>

            <div className="space-y-2">
              {/* Row 1: Target Law Firms */}
              <div
                className="bg-[#f5f3ef] dark:bg-[#1a120d] rounded-lg p-2.5 flex items-center justify-between border border-transparent dark:border-[#38271c]"
              >
                <div className="flex items-center gap-2 text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-medium">
                  <Building2 className="size-4 text-[#7b4e00] dark:text-[#e29d38]" />
                  <span>{isEn ? "Target Firms" : "المكاتب المستهدفة"}</span>
                </div>
                <span className="text-[#7b4e00] dark:text-[#e29d38] text-[12px] font-bold font-mono">
                  {formValues.audienceType === "all"
                    ? isEn
                      ? "842 Active Firms"
                      : "842 مكتب نشط"
                    : isEn
                    ? "1 Specific Firm"
                    : "1 مكتب محدد"}
                </span>
              </div>

              {/* Row 2: Expected Delivery Time */}
              <div
                className="bg-[#f5f3ef] dark:bg-[#1a120d] rounded-lg p-2.5 flex items-center justify-between border border-transparent dark:border-[#38271c]"
              >
                <div className="flex items-center gap-2 text-[#1b1c1a] dark:text-[#fdfbf7] text-[12px] font-medium">
                  <Timer className="size-4 text-[#047857] dark:text-emerald-400" />
                  <span>{isEn ? "Expected Delivery Time" : "زمن التسليم المتوقع"}</span>
                </div>
                <span className="text-[#047857] dark:text-emerald-400 text-[12px] font-bold font-mono">
                  {isEn ? "Instant (< 2.4s)" : "فوري (< 2.4 ثانية)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING STICKY ACTION BAR */}
      <DashboardStickyActionBar>
        <div className="flex items-center gap-2 text-[12px] text-[#514537] dark:text-[#cdc5bd]">
          <Info className="size-[15px] text-[#9c6402] dark:text-[#e29d38] shrink-0" />
          <span>
            {isEn
              ? "Notification content will be audited and broadcast instantly to recipients."
              : "سيتم تدقيق محتوى الإشعار والتوزيع اللحظي للمستلمين فور الإرسال."}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#f0eeea] hover:bg-[#e4e2de] dark:bg-[#281c15] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c] text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            {isEn ? "Cancel" : "إلغاء"}
          </button>
          <button
            type="button"
            onClick={handleDraftClick}
            className="bg-[#f0eeea] hover:bg-[#e4e2de] dark:bg-[#281c15] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c] text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            {isEn ? "Save as Draft" : "حفظ كمسودة"}
          </button>
          <button
            type="button"
            onClick={handleSubmit(onFormSubmit)}
            className="bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#c28328] text-white dark:text-[#1c140f] text-[13px] font-bold px-7 py-2.5 rounded-xl flex items-center gap-2 shadow-sm shadow-[#9c6402]/20 dark:shadow-none transition-colors cursor-pointer"
          >
            <Check className="size-4" />
            <span>{isEn ? "Confirm & Send Notification" : "تأكيد وإرسال الإشعار"}</span>
          </button>
        </div>
      </DashboardStickyActionBar>
    </div>
  );
}
