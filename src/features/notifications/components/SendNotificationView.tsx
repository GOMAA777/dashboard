"use client";

import React, { useState } from "react";
import Image from "next/image";
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

interface SendNotificationViewProps {
  onBack: () => void;
  onSubmitSend: (values: SendNotificationFormValues) => void;
  onSaveDraft: (values: SendNotificationFormValues) => void;
  initialData?: NotificationItem | null;
}

const mockLawFirms = [
  { id: "firm-1", name: "شركة الشامخ للمحاماة والاستشارات القانونية - الرياض", activeLicenses: 12 },
  { id: "firm-2", name: "مكتب المستشار عبد العزيز التميمي وشركاؤه - جدة", activeLicenses: 8 },
  { id: "firm-3", name: "مجموعة دار العدالة الدولية للمحاماة - الخبر", activeLicenses: 15 },
  { id: "firm-4", name: "مكتب المحامي فهد القحطاني للترافع والتحكيم - الرياض", activeLicenses: 5 },
];

export function SendNotificationView({
  onBack,
  onSubmitSend,
  onSaveDraft,
  initialData,
}: SendNotificationViewProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SendNotificationFormValues>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      title:
        initialData?.title ||
        "تحديث أمني إلزامي: ترقية معايير المصادقة الثنائية (2FA)",
      description:
        initialData?.description ||
        "نحيطكم علماً بأنه سيتم تفعيل متطلبات التحقق الثنائي عبر النفاذ الوطني الموحد لجميع مستخدمي مكاتب المحاماة بدءاً من يوم الأحد القادم. يرجى توجيه فريق العمل لاستكمال التفعيل لضمان استمرارية الربط العدلي وسرعة إنجاز القضايا دون انقطاع.",
      actionUrl:
        initialData?.actionUrl || "https://aljudy.sa/law-firm/security-settings",
      audienceType: initialData?.audienceType || "all",
      specificFirmId: "",
      imageUrl:
        initialData?.imageUrl || "/figma/placeholder-banner.png",
      imageFileName: initialData?.imageFileName || "security_update_banner.png",
      imageFileSize: initialData?.imageFileSize || "480 KB",
      imageDimensions: initialData?.imageDimensions || "800 × 450 بكسل",
      categoryBadge: initialData?.categoryBadge || "الأمان والامتثال العدلي",
      actionButtonText: initialData?.actionButtonText || "تحديث إعدادات الأمان الآن",
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
    toast.info("تمت إزالة الصورة المرفقة");
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
    toast.success("تم تحديث صورة الإشعار");
  };

  const onFormSubmit = (data: SendNotificationFormValues) => {
    onSubmitSend(data);
  };

  const handleDraftClick = () => {
    const current = watch();
    onSaveDraft({ ...current, isDraft: true });
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Main Identity & Command Banner (Figma 1:13242) */}
      <div
        className="bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex items-center justify-between"
        data-node-id="1:13242"
      >
        <div>
          <h1
            className="text-[26px] sm:text-[28px] font-bold text-[#1b1c1a] leading-[38px]"
            data-node-id="1:13256"
          >
            إرسال إشعار جديد
          </h1>
          <p
            className="text-[14px] text-[#514537] mt-1 max-w-[640px] leading-[22.75px]"
            data-node-id="1:13254"
          >
            أضف عنوان الإشعار وتفاصيله وحدد المستلمين ورابط الإجراء قبل الإرسال للبث عبر قنوات المنصة المعتمدة.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="bg-white hover:bg-[#f5f3ef] text-[#1b1c1a] border border-[#e6e2dc] px-4 py-2 rounded-[4px] font-semibold text-[14px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0 cursor-pointer"
          data-node-id="1:13245"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          <span>العودة</span>
        </button>
      </div>

      {/* Main Dual Layout: Form on Right (in RTL), Preview on Left */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Right Column (xl:col-span-7 in RTL order) → The Form */}
        <div
          className="xl:col-span-7 bg-white rounded-[8px] p-6 border border-[#e6e2dc] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] space-y-6"
          data-node-id="1:13323"
        >
          {/* SECTION 1: Notification Content */}
          <section className="space-y-4" data-node-id="1:13324">
            <div className="flex items-center justify-between">
              <h2
                className="text-[18px] font-bold text-[#1b1c1a] leading-[26px]"
                data-node-id="1:13329"
              >
                محتوى الإشعار وتفاصيله
              </h2>
            </div>

            {/* Title Field */}
            <div className="space-y-1.5" data-node-id="1:13330">
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#1b1c1a]">
                <span>عنوان الإشعار</span>
                <span className="text-[#ba1a1a] font-bold">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="تحديث أمني إلزامي: ترقية معايير المصادقة الثنائية (2FA)"
                className="w-full bg-[#f5f3ef]/50 border border-[#e6e2dc] rounded-[4px] px-3.5 py-2.5 text-[14px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] focus:ring-1 focus:ring-[#9c6402] transition-colors"
                data-node-id="1:13337"
              />
              {errors.title ? (
                <p className="text-[12px] text-[#ba1a1a] font-medium">{errors.title.message}</p>
              ) : (
                <p className="text-[12px] text-[#514537] leading-[18px]" data-node-id="1:13342">
                  عنوان مختصر وواضح يوضح موضوع الإجراء القانوني أو التقني المطلوب بدقة.
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-1.5" data-node-id="1:13343">
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#1b1c1a]">
                <span>وصف الإشعار</span>
                <span className="text-[#ba1a1a] font-bold">*</span>
              </label>
              <textarea
                rows={5}
                {...register("description")}
                placeholder="نحيطكم علماً بأنه سيتم تفعيل متطلبات التحقق الثنائي عبر النفاذ الوطني الموحد..."
                className="w-full bg-[#f5f3ef]/50 border border-[#e6e2dc] rounded-[4px] px-3.5 py-2.5 text-[14px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] focus:ring-1 focus:ring-[#9c6402] transition-colors leading-[22px]"
                data-node-id="1:13350"
              />
              {errors.description ? (
                <p className="text-[12px] text-[#ba1a1a] font-medium">
                  {errors.description.message}
                </p>
              ) : (
                <p className="text-[12px] text-[#514537] leading-[18px]" data-node-id="1:13355">
                  سيتم إرسال هذا النص في جسم الرسالة البريدية والتنبيه المباشر.
                </p>
              )}
            </div>
          </section>

          <hr className="border-[#eae8e4]" data-node-id="1:13356" />

          {/* SECTION 2: Notification Image Upload */}
          <section className="space-y-4" data-node-id="1:13357">
            <div className="flex items-center gap-2" data-node-id="1:13358">
              <h2 className="text-[18px] font-bold text-[#1b1c1a]" data-node-id="1:13362">
                صورة الإشعار
              </h2>
              <span
                className="bg-[#f0eeea] text-[#837565] text-[10px] font-bold px-2 py-0.5 rounded-[2px]"
                data-node-id="1:13360"
              >
                اختياري
              </span>
            </div>

            {/* Uploaded Card or Dropzone */}
            {hasImage ? (
              <div
                className="bg-[#f5f3ef] rounded-[8px] p-4 border border-[#e6e2dc]/60 space-y-3"
                data-node-id="1:13363"
              >
                <div className="flex items-center justify-between">
                  {/* Actions: Replace / Delete */}
                  <div className="flex items-center gap-2" data-node-id="1:13378">
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] px-3 py-1.5 rounded-[4px] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="حذف الصورة"
                    >
                      <Trash2 className="size-3.5" />
                      <span>حذف</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handlePresetImageSelect(
                          "/figma/placeholder-banner.png",
                          "announcement_banner.png",
                          "120 KB",
                          "800 × 450 بكسل"
                        )
                      }
                      className="bg-white hover:bg-[#faf9f7] text-[#1b1c1a] border border-[#e6e2dc] px-3 py-1.5 rounded-[4px] text-[12px] font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                      title="استبدال الصورة"
                    >
                      <RotateCw className="size-3.5" />
                      <span>استبدال</span>
                    </button>
                  </div>

                  {/* Image info & preview */}
                  <div className="flex items-center gap-3" data-node-id="1:13365">
                    <div className="text-start">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[#1b1c1a] text-[14px] font-bold max-w-[240px] truncate">
                          {formValues.imageFileName || "security_update_banner.png"}
                        </span>
                        <span
                          className="bg-[#d1fae5] text-[#065f46] text-[10px] font-bold px-2 py-0.5 rounded-[2px] flex items-center gap-1 shrink-0"
                          data-node-id="1:13368"
                        >
                          <span className="size-1.5 rounded-full bg-[#059669]" />
                          <span>تم الرفع بنجاح</span>
                        </span>
                      </div>
                      <p
                        className="text-[#514537] text-[12px] mt-0.5"
                        data-node-id="1:13375"
                      >
                        {formValues.imageFileSize || "480 KB"} • أبعاد:{" "}
                        {formValues.imageDimensions || "800 × 450 بكسل"}
                      </p>
                    </div>

                    <div
                      className="bg-[#f0eeea] border border-[#d6c4b1]/40 rounded-[4px] w-[63px] h-[52px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] overflow-hidden shrink-0 relative flex items-center justify-center"
                      data-node-id="1:13376"
                    >
                      <Image
                        src={formValues.imageUrl || "/figma/placeholder-banner.png"}
                        alt="Preview"
                        width={63}
                        height={52}
                        className="object-cover size-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Supported Specifications Label */}
                <div
                  className="pt-2 border-t border-[#e6e2dc]/50 flex items-center justify-end gap-2 text-[#514537] text-[10px] font-bold"
                  data-node-id="1:13385"
                >
                  <p data-node-id="1:13387">
                    الصيغ المدعومة: PNG, JPG, WebP بحجم أقصى 2 ميجابايت (الأبعاد الموصى بها: 800 × 450 بكسل)
                  </p>
                  <ImageIcon className="size-3 text-[#837565]" />
                </div>
              </div>
            ) : (
              <div className="bg-[#f5f3ef]/60 border-2 border-dashed border-[#ded5c6] rounded-[8px] p-6 text-center space-y-3">
                <div className="size-10 rounded-full bg-white flex items-center justify-center mx-auto text-[#9c6402] shadow-sm">
                  <Upload className="size-5" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#1b1c1a]">
                    اسحب الصورة وأفلتها هنا، أو اضغط للاختيار
                  </p>
                  <p className="text-[12px] text-[#514537] mt-1">
                    PNG, JPG, WebP حتى 2 ميجابايت (الموصى به 800 × 450 بكسل)
                  </p>
                </div>
                <div className="flex justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetImageSelect(
                        "/figma/placeholder-banner.png",
                        "security_update_banner.png",
                        "480 KB",
                        "800 × 450 بكسل"
                      )
                    }
                    className="text-[12px] bg-white border border-[#e6e2dc] text-[#9c6402] hover:bg-[#faf9f7] px-3 py-1.5 rounded-[4px] font-semibold transition-colors cursor-pointer"
                  >
                    استخدام بنر الأمان السيبراني الافتراضي
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handlePresetImageSelect(
                        "/figma/placeholder-banner.png",
                        "legal_compliance_banner.png",
                        "510 KB",
                        "800 × 450 بكسل"
                      )
                    }
                    className="text-[12px] bg-white border border-[#e6e2dc] text-[#514537] hover:bg-[#faf9f7] px-3 py-1.5 rounded-[4px] font-semibold transition-colors cursor-pointer"
                  >
                    استخدام بنر الامتثال القانوني
                  </button>
                </div>
              </div>
            )}
          </section>

          <hr className="border-[#eae8e4]" data-node-id="1:13390" />

          {/* SECTION 3: Action Destination URL */}
          <section className="space-y-4" data-node-id="1:13391">
            <h2 className="text-[18px] font-bold text-[#1b1c1a]" data-node-id="1:13394">
              رابط الإجراء المباشر
            </h2>

            <div className="space-y-1.5" data-node-id="1:13395">
              <label className="text-[14px] font-semibold text-[#1b1c1a]">
                Action For (رابط الإجراء)
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  {...register("actionUrl")}
                  placeholder="https://aljudy.sa/law-firm/security-settings"
                  className="w-full bg-[#f5f3ef]/50 border border-[#e6e2dc] rounded-[4px] pl-3.5 pr-9 py-2.5 text-[14px] text-[#1b1c1a] font-mono placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] focus:ring-1 focus:ring-[#9c6402] transition-colors"
                  data-node-id="1:13401"
                />
                <LinkIcon className="size-4 text-[#837565] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.actionUrl ? (
                <p className="text-[12px] text-[#ba1a1a] font-medium">
                  {errors.actionUrl.message}
                </p>
              ) : (
                <p className="text-[12px] text-[#514537] leading-[18px]" data-node-id="1:13408">
                  أدخل الرابط الذي سيتم فتحه عند ضغط المستلم على الإشعار مباشرة
                </p>
              )}
            </div>
          </section>

          <hr className="border-[#eae8e4]" data-node-id="1:13409" />

          {/* SECTION 4: Recipients & Audience Targeting */}
          <section className="space-y-4" data-node-id="1:13410">
            <div className="flex items-center justify-between" data-node-id="1:13411">
              <span
                className="text-[#ba1a1a] text-[10px] font-semibold"
                data-node-id="1:13413"
              >
                اختيار إلزامي *
              </span>
              <h2 className="text-[18px] font-bold text-[#1b1c1a]" data-node-id="1:13416">
                المستلمون والجمهور المستهدف
              </h2>
            </div>

            <div className="space-y-3" data-node-id="1:13417">
              {/* Option 1: All law firms (Checked by default) */}
              <div
                onClick={() => handleAudienceChange("all")}
                className={`p-4 rounded-[8px] flex items-start gap-4 cursor-pointer transition-all border ${
                  formValues.audienceType === "all"
                    ? "bg-[#f5f3ef] border-[#7b4e00]/30 shadow-sm"
                    : "bg-white border-[#e6e2dc] hover:bg-[#faf9f7]"
                }`}
                data-node-id="1:13418"
              >
                <div className="flex-1 space-y-1" data-node-id="1:13419">
                  <div className="flex items-center justify-end gap-2" data-node-id="1:13420">
                    <span
                      className="bg-[rgba(123,78,0,0.1)] text-[#7b4e00] text-[10px] font-bold px-2.5 py-0.5 rounded-[2px]"
                      data-node-id="1:13424"
                    >
                      سيتم الإرسال إلى 842 مكتب محاماة معتمد نشط
                    </span>
                    <h3
                      className="text-[18px] font-bold text-[#1b1c1a]"
                      data-node-id="1:13422"
                    >
                      جميع مكاتب المحاماة المشتركة
                    </h3>
                  </div>
                  <p
                    className="text-[12px] text-[#514537] leading-[18px] text-start"
                    data-node-id="1:13426"
                  >
                    بث تعميم رسمي لكافة المحامين، الشركاء، والإداريين ذوي الصلاحية عبر لوحات تحكم المكاتب الرسمية.
                  </p>
                </div>

                <div className="mt-1" data-node-id="1:13427">
                  <div
                    className={`size-4 rounded-full border flex items-center justify-center transition-colors ${
                      formValues.audienceType === "all"
                        ? "border-[#7b4e00] bg-white"
                        : "border-[#767676] bg-white"
                    }`}
                  >
                    {formValues.audienceType === "all" && (
                      <div className="size-2 rounded-full bg-[#7b4e00]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Option 2: Specific Law Firm (Unchecked) */}
              <div
                onClick={() => handleAudienceChange("specific")}
                className={`p-4 rounded-[8px] flex items-start gap-4 cursor-pointer transition-all border ${
                  formValues.audienceType === "specific"
                    ? "bg-[#f5f3ef] border-[#7b4e00]/30 shadow-sm"
                    : "bg-white border-[#e6e2dc] hover:bg-[#faf9f7]"
                }`}
                data-node-id="1:13430"
              >
                <div className="flex-1 space-y-1" data-node-id="1:13431">
                  <div className="flex items-center justify-end gap-2" data-node-id="1:13432">
                    <span
                      className="bg-[#f0eeea] text-[#837565] text-[10px] font-bold px-2 py-0.5 rounded-[2px]"
                      data-node-id="1:13434"
                    >
                      توجيه إشعار خاص
                    </span>
                    <h3
                      className="text-[18px] font-semibold text-[#1b1c1a]"
                      data-node-id="1:13436"
                    >
                      مكتب محدد بعينه
                    </h3>
                  </div>
                  <p
                    className="text-[12px] text-[#514537] leading-[18px] text-start"
                    data-node-id="1:13438"
                  >
                    تخصيص الإشعار لفرع أو مكتب معين لمعالجة تنبيه انفرادي أو متابعة تعاقدية.
                  </p>

                  {/* Firm Selector when Specific is active */}
                  {formValues.audienceType === "specific" && (
                    <div className="pt-2 animate-in fade-in duration-150">
                      <select
                        {...register("specificFirmId")}
                        className="w-full bg-white border border-[#e6e2dc] rounded-[4px] px-3 py-2 text-[13px] text-[#1b1c1a] focus:outline-none focus:border-[#9c6402]"
                      >
                        <option value="">اختر مكتب المحاماة المستهدف...</option>
                        {mockLawFirms.map((firm) => (
                          <option key={firm.id} value={firm.id}>
                            {firm.name} ({firm.activeLicenses} تراخيص نشطة)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="mt-1" data-node-id="1:13439">
                  <div
                    className={`size-4 rounded-full border flex items-center justify-center transition-colors ${
                      formValues.audienceType === "specific"
                        ? "border-[#7b4e00] bg-white"
                        : "border-[#767676] bg-white"
                    }`}
                  >
                    {formValues.audienceType === "specific" && (
                      <div className="size-2 rounded-full bg-[#7b4e00]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Left Column (xl:col-span-5 in RTL order) → Dynamic Live Preview */}
        <div
          className="xl:col-span-5 space-y-4"
          data-node-id="1:13258"
        >
          {/* Live Preview Card (Figma 1:13259) */}
          <div
            className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] space-y-3"
            data-node-id="1:13259"
          >
            <div className="flex items-center justify-between" data-node-id="1:13260">
              <span
                className="bg-[#f0eeea] text-[#514537] text-[10px] font-bold px-2 py-0.5 rounded-[2px]"
                data-node-id="1:13261"
              >
                محاكاة لوحة وتطبيق المستلم
              </span>
              <div className="flex items-center gap-2" data-node-id="1:13263">
                <Eye className="size-4 text-[#9c6402]" />
                <span
                  className="text-[18px] font-semibold text-[#1b1c1a]"
                  data-node-id="1:13265"
                >
                  معاينة البث المباشر
                </span>
              </div>
            </div>

            {/* Notification Card Mockup in Client Dashboard (Figma 1:13268) */}
            <div
              className="bg-[#f5f3ef] rounded-[4px] p-4 space-y-3 border border-[#eae8e4]"
              data-node-id="1:13268"
            >
              {/* Header inside mockup */}
              <div className="flex items-start justify-between" data-node-id="1:13269">
                <span
                  className="size-2 rounded-full bg-[#7b4e00] mt-1 shrink-0"
                  data-node-id="1:13271"
                />
                <div className="flex items-center gap-2 text-start">
                  <div>
                    <h4
                      className="text-[12px] font-bold text-[#1b1c1a]"
                      data-node-id="1:13275"
                    >
                      منصة الجودي القانونية
                    </h4>
                    <p
                      className="text-[10px] font-bold text-[#837565]"
                      data-node-id="1:13277"
                    >
                      الآن • تنبيه موجه فوري
                    </p>
                  </div>
                  <div
                    className="bg-[#9c6402] size-7 rounded-[6px] flex items-center justify-center text-white shrink-0"
                    data-node-id="1:13278"
                  >
                    <Shield className="size-3.5 fill-white" />
                  </div>
                </div>
              </div>

              {/* Preview Thumbnail */}
              {hasImage && formValues.imageUrl && (
                <div
                  className="relative h-[145px] rounded-[4px] overflow-hidden shadow-inner border border-[#e4e2de]"
                  data-node-id="1:13281"
                >
                  <Image
                    src={formValues.imageUrl}
                    alt="Preview banner"
                    fill
                    className="object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5"
                    data-node-id="1:13283"
                  >
                    <span
                      className="bg-black/40 backdrop-blur-[4px] text-[#fff3e9] text-[10px] font-bold px-2 py-0.5 rounded-[2px]"
                      data-node-id="1:13284"
                    >
                      {formValues.categoryBadge || "الأمان والامتثال العدلي"}
                    </span>
                  </div>
                </div>
              )}

              {/* Preview Title & Content */}
              <div className="space-y-1 text-start" data-node-id="1:13286">
                <h4
                  className="text-[16px] sm:text-[18px] font-bold text-[#1b1c1a] leading-[24px]"
                  data-node-id="1:13288"
                >
                  {formValues.title || "عنوان الإشعار الافتراضي"}
                </h4>
                <p
                  className="text-[12px] text-[#514537] leading-[19.5px] line-clamp-3"
                  data-node-id="1:13290"
                >
                  {formValues.description || "نص الإشعار التوجيهي والملاحظات..."}
                </p>
              </div>

              {/* Action Button Preview */}
              <a
                href={formValues.actionUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7b4e00] hover:bg-[#643f00] text-white text-[12px] font-semibold py-2 px-3 rounded-[4px] w-full flex items-center justify-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
                data-node-id="1:13293"
              >
                <ExternalLink className="size-3.5" />
                <span>{formValues.actionButtonText || "تحديث إعدادات الأمان الآن"}</span>
              </a>
            </div>

            {/* Preview Info Footnote */}
            <div
              className="flex items-center gap-2 text-start text-[#514537] text-[10px] font-bold pt-1"
              data-node-id="1:13298"
            >
              <Info className="size-3.5 text-[#837565] shrink-0" />
              <p data-node-id="1:13300">
                يظهر الإشعار في التنبيهات المنبثقة وشريط الإشعارات العلوي للعملاء فور الاعتماد.
              </p>
            </div>
          </div>

          {/* System Target Matrix Summary Card (Figma 1:13303) */}
          <div
            className="bg-white rounded-[8px] p-4 border border-[#e6e2dc] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] space-y-3"
            data-node-id="1:13303"
          >
            <h3
              className="text-[14px] font-bold text-[#1b1c1a] text-start"
              data-node-id="1:13305"
            >
              ملخص التوزيع والجاهزية
            </h3>

            <div className="space-y-2" data-node-id="1:13306">
              {/* Row 1: Target Law Firms */}
              <div
                className="bg-[#f5f3ef] rounded-[4px] p-2.5 flex items-center justify-between"
                data-node-id="1:13307"
              >
                <span
                  className="text-[#7b4e00] text-[12px] font-bold"
                  data-node-id="1:13309"
                >
                  {formValues.audienceType === "all" ? "842 مكتب نشط" : "1 مكتب محدد"}
                </span>
                <div className="flex items-center gap-2 text-[#1b1c1a] text-[12px] font-medium">
                  <Building2 className="size-4 text-[#7b4e00]" />
                  <span data-node-id="1:13312">المكاتب المستهدفة</span>
                </div>
              </div>

              {/* Row 2: Expected Delivery Time */}
              <div
                className="bg-[#f5f3ef] rounded-[4px] p-2.5 flex items-center justify-between"
                data-node-id="1:13315"
              >
                <span
                  className="text-[#047857] text-[12px] font-bold"
                  data-node-id="1:13317"
                >
                  فوري (&lt; 2.4 ثانية)
                </span>
                <div className="flex items-center gap-2 text-[#1b1c1a] text-[12px] font-medium">
                  <Timer className="size-4 text-[#047857]" />
                  <span data-node-id="1:13320">زمن التسليم المتوقع</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING STICKY ACTION BAR (Figma 1:13441) */}
      <DashboardStickyActionBar>
        <div className="flex items-center gap-2 text-[12px] text-[#514537] dark:text-[#cdc5bd]">
          <Info className="size-[15px] text-[#9c6402] shrink-0" />
          <span>سيتم تدقيق محتوى الإشعار والتوزيع اللحظي للمستلمين فور الإرسال.</span>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#f0eeea] hover:bg-[#e4e2de] dark:bg-[#2c2017] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] text-[14px] font-semibold px-6 py-2.5 rounded-[6px] transition-colors cursor-pointer"
            data-node-id="1:13451"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleDraftClick}
            className="bg-[#f0eeea] hover:bg-[#e4e2de] dark:bg-[#2c2017] dark:hover:bg-[#382a1f] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#3d2a1d] text-[14px] font-semibold px-6 py-2.5 rounded-[6px] transition-colors cursor-pointer"
            data-node-id="1:13449"
          >
            حفظ كمسودة
          </button>
          <button
            type="button"
            onClick={handleSubmit(onFormSubmit)}
            className="bg-[#9c6402] hover:bg-[#855402] text-white text-[14px] font-semibold px-8 py-2.5 rounded-[6px] flex items-center gap-2 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors cursor-pointer"
            data-node-id="1:13444"
          >
            <Check className="size-4" />
            <span>ارسال الاشعار</span>
          </button>
        </div>
      </DashboardStickyActionBar>
    </div>
  );
}
