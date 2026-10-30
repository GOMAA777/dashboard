"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  User,
  Building2,
  Scale,
  Mail,
  Phone,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle2,
  Info,
  Check,
  Hourglass,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice } from "../types/client.types";

export interface OfficeFormData {
  id?: string;
  name: string;
  owner: string;
  licenseNumber: string;
  email: string;
  phone: string;
  city: string;
  plan: string;
  billingCycle?: string;
  password?: string;
}

interface AddClientOfficeViewProps {
  officeToEdit?: ClientOffice | null;
  onBack: () => void;
  onSuccess: (officeData: OfficeFormData, isEdit: boolean) => void;
}

export function AddClientOfficeView({
  officeToEdit,
  onBack,
  onSuccess,
}: AddClientOfficeViewProps) {
  const isEditMode = Boolean(officeToEdit);

  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<"paid" | "trial">(
    officeToEdit?.plan.includes("تجربة") ||
      officeToEdit?.subscriptionStatus.type === "trial"
      ? "trial"
      : "paid"
  );

  // Form states initialized from officeToEdit or default
  const [ownerName, setOwnerName] = useState(
    officeToEdit ? officeToEdit.owner : "د. عبد العزيز بن فهد العجلان"
  );
  const [firmName, setFirmName] = useState(
    officeToEdit
      ? officeToEdit.name
      : "شركة العجلان وشركاؤه للمحاماة والاستشارات"
  );
  const [licenseNumber, setLicenseNumber] = useState(
    officeToEdit
      ? officeToEdit.licenseNumber.replace("ترخيص عدلي: ", "")
      : "38/412"
  );
  const [email, setEmail] = useState(
    officeToEdit ? officeToEdit.email : "contact@alajlan-law.sa"
  );
  const [phone, setPhone] = useState(
    officeToEdit
      ? officeToEdit.phone.replace("+966 ", "").replace("+966", "")
      : "50 123 4567"
  );
  const [city, setCity] = useState(
    officeToEdit
      ? officeToEdit.city.includes("المملكة العربية السعودية")
        ? officeToEdit.city
        : `المملكة العربية السعودية - ${officeToEdit.city}`
      : "المملكة العربية السعودية - الرياض"
  );
  const [password, setPassword] = useState(
    officeToEdit ? "••••••••••••" : "AlJudy#Law2025"
  );
  const [packageTier, setPackageTier] = useState(
    officeToEdit
      ? officeToEdit.plan.includes("شركات")
        ? "باقة الشركات ( 1,450 ر.س / شهرياً)"
        : officeToEdit.plan.includes("أساسية")
        ? "الباقة الأساسية ( 350 ر.س / شهرياً)"
        : "الباقة الاحترافية ( 750 ر.س / شهرياً - الموصى بها)"
      : "الباقة الاحترافية ( 750 ر.س / شهرياً - الموصى بها)"
  );
  const [billingCycle, setBillingCycle] = useState(
    "اشتراك سنوي (موصى به - خصم شهرين مجاناً)"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !firmName || !email || !phone) {
      toast.error("يرجى ملء جميع الحقول الإلزامية");
      return;
    }

    const cleanPlanName =
      selectedPlanType === "trial"
        ? "تجربة مجانية"
        : packageTier.includes("الاحترافية")
        ? "الباقة الاحترافية"
        : packageTier.includes("الشركات")
        ? "باقة الشركات"
        : "الباقة الأساسية";

    const cleanCity = city.replace("المملكة العربية السعودية - ", "").trim() || "الرياض";

    onSuccess(
      {
        id: officeToEdit?.id,
        name: firmName,
        owner: ownerName,
        licenseNumber: licenseNumber.startsWith("ترخيص عدلي: ")
          ? licenseNumber
          : `ترخيص عدلي: ${licenseNumber}`,
        email,
        phone: phone.startsWith("+966") ? phone : `+966 ${phone}`,
        city: cleanCity,
        plan: cleanPlanName,
        billingCycle,
        password,
      },
      isEditMode
    );

    toast.success(
      isEditMode
        ? `تم حفظ تعديلات مكتب "${firmName}" بنجاح.`
        : `تمت إضافة مكتب "${firmName}" بنجاح وتفعيل الاشتراك.`
    );
  };

  return (
    <div
      className="w-full flex flex-col gap-[24px] font-['Cairo',sans-serif]"
      data-node-id="1:1427"
    >
      {/* Top Action & Title Header */}
      <div className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full">
        {/* Right: Title & Subtitle */}
        <div className="flex flex-col items-start text-start">
          <h1 className="text-[26px] leading-[36px] font-bold text-[#1b1c1a]">
            {isEditMode ? "تعديل بيانات المكتب" : "إضافة مكتب جديد"}
          </h1>
          <p className="text-[#514537] text-[13px] leading-[20px] font-normal mt-[4px]">
            {isEditMode
              ? "قم بتحديث وتعديل بيانات المنشأة القانونية ووسائل التواصل والاشتراكات المعتمدة لمنصة الجودي."
              : "أضف مكتب محاماة جديدًا إلى المنصة وحدد نوع اشتراكه وبيانات الدخول المعتمدة بدقة وموثوقية عالية."}
          </p>
        </div>

        {/* Left: العودة Button */}
        <button
          type="button"
          onClick={onBack}
          className="bg-white hover:bg-[#f5f3ef] border border-[#eae8e4] text-[#1b1c1a] px-[16px] py-[8px] rounded-[4px] text-[14px] font-semibold flex items-center gap-[8px] shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowRight className="size-[15px] stroke-[2.5]" />
          <span>العودة</span>
        </button>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[8px] p-[32px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] flex flex-col gap-[32px] w-full">
        {/* ======================================================== */}
        {/* SECTION 1: بيانات المكتب والمنشأة القانونية */}
        {/* ======================================================== */}
        <div className="flex flex-col gap-[16px] w-full" data-node-id="1:1433">
          {/* Section Header Bar */}
          <div className="bg-[#f5f3ef]/50 rounded-[4px] px-[20px] py-[10px] flex items-center justify-between">
            <span className="bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-[8px] py-[3px] rounded-[2px]">
              الخطوة الأساسية
            </span>

            <div className="flex items-center gap-[10px]">
              <div className="flex flex-col text-start">
                <h2 className="text-[17px] font-semibold text-[#1b1c1a] leading-[24px]">
                  بيانات المكتب والمنشأة القانونية
                </h2>
                <p className="text-[12px] text-[#514537] leading-[18px]">
                  المعلومات الأساسية للترخيص والمنشأة ووسائل التواصل المعتمدة للربط القضائي
                </p>
              </div>
              <div className="bg-[#9c6402] text-[#fff3e9] font-bold text-[13px] size-[28px] rounded-full flex items-center justify-center shrink-0">
                ١
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] pt-[4px]">
            {/* 1. اسم صاحب المكتب */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">
                اسم صاحب المكتب <span className="text-[#7b4e00] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] focus:outline-none"
                  placeholder="د. عبد العزيز بن فهد العجلان"
                />
                <User className="size-[15px] text-[#837565] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537]">
                المحامي المسؤول المعتمد بموجب توكيل المنصة.
              </span>
            </div>

            {/* 2. اسم المكتب أو الشركة المهنية */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">
                اسم المكتب أو الشركة المهنية <span className="text-[#7b4e00] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] focus:outline-none"
                  placeholder="شركة العجلان وشركاؤه للمحاماة والاستشارات"
                />
                <Building2 className="size-[15px] text-[#837565] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537]">
                الاسم التجاري أو المسجل في قائمة الشركات المهنية.
              </span>
            </div>

            {/* 3. رقم الترخيص العدلي */}
            <div className="flex flex-col gap-[6px] text-start">
              <div className="flex items-center justify-between">
                <span className="bg-[#f0eeea] text-[#514537] text-[10px] font-bold px-[6px] py-[2px] rounded-[2px]">
                  اختياري
                </span>
                <label className="text-[13px] font-semibold text-[#1b1c1a]">
                  رقم الترخيص العدلي
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] focus:outline-none"
                  placeholder="مثال: 38/412"
                />
                <Scale className="size-[15px] text-[#837565] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537]">
                صادر من وزارة العدل السعودية أو الهيئة السعودية للمحامين.
              </span>
            </div>

            {/* 4. البريد الإلكتروني الرسمي */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">
                البريد الإلكتروني الرسمي للمكتب <span className="text-[#7b4e00] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] focus:outline-none direction-ltr text-start"
                  placeholder="contact@alajlan-law.sa"
                />
                <Mail className="size-[15px] text-[#837565] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537]">
                سيتم إرسال بيانات الدخول ورمز التفعيل إليه آلياً.
              </span>
            </div>

            {/* 5. رقم الجوال / الهاتف للتواصل */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">
                رقم الجوال / الهاتف للتواصل <span className="text-[#7b4e00] font-bold">*</span>
              </label>
              <div className="flex items-center gap-[8px]">
                <div className="bg-[#eae8e4] h-[44px] px-[12px] rounded-[4px] flex items-center justify-center text-[12px] font-semibold text-[#1b1c1a] shrink-0">
                  +966 🇸🇦
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-[44px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] focus:outline-none direction-ltr text-start"
                    placeholder="50 123 4567"
                  />
                  <Phone className="size-[14px] text-[#837565] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <span className="text-[11px] text-[#514537]">
                يُستخدم لتأكيد العمليات الحساسة وإشعارات الجلسات العاجلة.
              </span>
            </div>

            {/* 6. المدينة / المقر الرئيسي */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a]">
                المدينة / المقر الرئيسي <span className="text-[#7b4e00] font-bold">*</span>
              </label>
              <div className="relative">
                <select
                  aria-label="المدينة / المقر الرئيسي"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="appearance-none w-full h-[44px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] focus:outline-none cursor-pointer"
                >
                  <option value="المملكة العربية السعودية - الرياض">المملكة العربية السعودية - الرياض</option>
                  <option value="المملكة العربية السعودية - جدة">المملكة العربية السعودية - جدة</option>
                  <option value="المملكة العربية السعودية - الدمام">المملكة العربية السعودية - الدمام</option>
                  <option value="المملكة العربية السعودية - الخبر">المملكة العربية السعودية - الخبر</option>
                  <option value="المملكة العربية السعودية - مكة المكرمة">المملكة العربية السعودية - مكة المكرمة</option>
                  <option value="المملكة العربية السعودية - المدينة المنورة">المملكة العربية السعودية - المدينة المنورة</option>
                </select>
                <ChevronDown className="size-[14px] text-[#514537] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Identity / Logo Upload Area */}
          <div className="flex flex-col gap-[8px] pt-[8px] text-start">
            <div className="flex items-center justify-between">
              <span className="bg-[#f0eeea] text-[#514537] text-[10px] font-bold px-[6px] py-[2px] rounded-[2px]">
                اختياري
              </span>
              <label className="text-[13px] font-semibold text-[#1b1c1a]">
                شعار المنشأة / الهوية القانونية
              </label>
            </div>

            <div className="bg-[#f5f3ef] rounded-[8px] p-[20px] flex items-center justify-between gap-[16px]">
              <span className="bg-[#eae8e4] text-[#514537] text-[10px] font-bold px-[10px] py-[4px] rounded-[2px] shrink-0">
                2 MB كحد أقصى
              </span>

              <div className="flex-1 flex flex-col items-center sm:items-start text-start">
                <div className="flex items-center gap-[8px]">
                  <span className="text-[13px] font-semibold text-[#1b1c1a]">
                    اسحب الشعار وأفلته هنا
                  </span>
                  <span className="text-[12px] text-[#514537]">أو</span>
                  <button
                    type="button"
                    className="text-[13px] font-bold text-[#7b4e00] hover:underline cursor-pointer"
                  >
                    تصفح الملفات
                  </button>
                </div>
                <span className="text-[11px] text-[#514537] mt-[2px]">
                  الملفات المدعومة: PNG, SVG, JPG بحد أقصى 2 ميجابايت (يفضل خلفية شفافة أبعاد 400x400).
                </span>
              </div>

              <div className="size-[54px] bg-white rounded-[4px] shadow-sm flex items-center justify-center text-[#9c6402] shrink-0">
                <Scale className="size-[24px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: بيانات الحساب والاشتراك السحابي */}
        {/* ======================================================== */}
        <div className="flex flex-col gap-[16px] w-full pt-[8px]" data-node-id="1:1543">
          {/* Section Header Bar */}
          <div className="bg-[#f5f3ef]/50 rounded-[4px] px-[20px] py-[10px] flex items-center justify-between">
            <div className="flex items-center gap-[10px] ms-auto">
              <div className="flex flex-col text-start">
                <h2 className="text-[17px] font-semibold text-[#1b1c1a] leading-[24px]">
                  بيانات الحساب والاشتراك السحابي
                </h2>
                <p className="text-[12px] text-[#514537] leading-[18px]">
                  إعدادات المصادقة والدخول ونوع الباقة المفعلة للمكتب وصلاحيات الأعضاء
                </p>
              </div>
              <div className="bg-[#9c6402] text-[#fff3e9] font-bold text-[13px] size-[28px] rounded-full flex items-center justify-center shrink-0">
                ٢
              </div>
            </div>
          </div>

          {/* Initial Password Field */}
          <div className="flex flex-col gap-[6px] text-start">
            <label className="text-[13px] font-semibold text-[#1b1c1a]">
              كلمة المرور الأولية للحساب <span className="text-[#7b4e00] font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[44px] bg-[#f5f3ef] border border-transparent focus:border-[#9c6402] rounded-[4px] ps-[40px] pe-[14px] text-[14px] text-[#1b1c1a] focus:outline-none direction-ltr text-start font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute start-[12px] top-1/2 -translate-y-1/2 text-[#514537] hover:text-[#1b1c1a] p-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-[15px]" /> : <Eye className="size-[15px]" />}
              </button>
            </div>

            {/* Password strength indicator */}
            <div className="flex items-center gap-[8px] pt-[2px]">
              <span className="text-[10px] font-semibold text-[#9c6402]">قوية ومطابقة</span>
              <div className="flex-1 h-[5px] bg-[#eae8e4] rounded-full overflow-hidden flex gap-[4px]">
                <div className="flex-1 bg-[#9c6402] rounded-full" />
                <div className="flex-1 bg-[#9c6402] rounded-full" />
                <div className="flex-1 bg-[#9c6402] rounded-full" />
              </div>
            </div>
            <span className="text-[11px] text-[#514537]">
              يجب أن تحتوي على 8 خانات على الأقل تتضمن أحرفاً كبيرة وصغيرة وأرقاماً ورموزاً.
            </span>
          </div>

          {/* Subscription Plan Radio Cards */}
          <div className="flex flex-col gap-[8px] pt-[8px] text-start">
            <label className="text-[13px] font-semibold text-[#1b1c1a]">
              نوع وخطة الاشتراك <span className="text-[#7b4e00] font-bold">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              {/* Card 1: باقة مدفوعة (Selected) */}
              <div
                onClick={() => setSelectedPlanType("paid")}
                className={`bg-[#f5f3ef] rounded-[8px] p-[16px] flex flex-col gap-[8px] cursor-pointer transition-all border ${
                  selectedPlanType === "paid"
                    ? "border-[#9c6402] ring-1 ring-[#9c6402] shadow-sm"
                    : "border-transparent opacity-80"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="bg-[#9c6402]/15 text-[#9c6402] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                    فوري
                  </span>

                  <div className="flex items-center gap-[8px]">
                    <div className="flex flex-col text-start">
                      <span className="text-[16px] font-bold text-[#1b1c1a] leading-[22px]">
                        باقة مدفوعة
                      </span>
                      <span className="text-[11px] text-[#514537] leading-[16px]">
                        تفعيل فوري لكافة مزايا النظام وسندات القبض
                      </span>
                    </div>

                    <div
                      className={`size-[20px] rounded-full flex items-center justify-center shrink-0 ${
                        selectedPlanType === "paid"
                          ? "bg-[#9c6402] text-white"
                          : "border border-[#837565]"
                      }`}
                    >
                      {selectedPlanType === "paid" && <Check className="size-[12px] stroke-[3]" />}
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-[4px] px-[10px] py-[6px] flex items-center justify-between text-[11px] font-bold text-[#514537]">
                  <FileCheck className="size-[14px] text-[#9c6402]" />
                  <span>وصول كامل لربط ناجز والقضايا غير المحدودة</span>
                </div>
              </div>

              {/* Card 2: تجربة مجانية */}
              <div
                onClick={() => setSelectedPlanType("trial")}
                className={`bg-[#f5f3ef] rounded-[8px] p-[16px] flex flex-col gap-[8px] cursor-pointer transition-all border ${
                  selectedPlanType === "trial"
                    ? "border-[#9c6402] ring-1 ring-[#9c6402] shadow-sm"
                    : "border-transparent opacity-80"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="bg-[#e4e2de] text-[#514537] text-[10px] font-semibold px-[8px] py-[2px] rounded-[2px]">
                    ١٤ يوماً
                  </span>

                  <div className="flex items-center gap-[8px]">
                    <div className="flex flex-col text-start">
                      <span className="text-[16px] font-bold text-[#1b1c1a] leading-[22px]">
                        تجربة مجانية
                      </span>
                      <span className="text-[11px] text-[#514537] leading-[16px]">
                        فترة استكشافية للمكتب لإجراء الاختبارات التشغيلية
                      </span>
                    </div>

                    <div
                      className={`size-[20px] rounded-full flex items-center justify-center shrink-0 ${
                        selectedPlanType === "trial"
                          ? "bg-[#9c6402] text-white"
                          : "border border-[#837565]"
                      }`}
                    >
                      {selectedPlanType === "trial" && <Check className="size-[12px] stroke-[3]" />}
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 rounded-[4px] px-[10px] py-[6px] flex items-center justify-between text-[11px] font-bold text-[#514537]">
                  <Hourglass className="size-[13px] text-[#837565]" />
                  <span>إمكانية إضافة حتى 3 محامين و 25 قضية</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tier & Billing Configuration Details */}
          <div className="bg-[#f5f3ef] rounded-[8px] p-[20px] flex flex-col gap-[16px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              {/* الباقة المعتمدة */}
              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a]">
                  الباقة المعتمدة
                </label>
                <div className="relative">
                  <select
                    aria-label="الباقة المعتمدة"
                    value={packageTier}
                    onChange={(e) => setPackageTier(e.target.value)}
                    className="appearance-none w-full h-[44px] bg-white border border-[#eae8e4] rounded-[4px] ps-[38px] pe-[14px] text-[13px] text-[#1b1c1a] focus:outline-none cursor-pointer"
                  >
                    <option value="الباقة الاحترافية ( 750 ر.س / شهرياً - الموصى بها)">
                      الباقة الاحترافية ( 750 ر.س / شهرياً - الموصى بها)
                    </option>
                    <option value="باقة الشركات ( 1,450 ر.س / شهرياً)">
                      باقة الشركات ( 1,450 ر.س / شهرياً)
                    </option>
                    <option value="الباقة الأساسية ( 350 ر.س / شهرياً)">
                      الباقة الأساسية ( 350 ر.س / شهرياً)
                    </option>
                  </select>
                  <ChevronDown className="size-[14px] text-[#514537] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[11px] text-[#514537]">
                  تشمل حتى 15 مستخدم، ونظام الفوترة الإلكترونية المرتبط بهيئة الزكاة.
                </span>
              </div>

              {/* دورة الفوترة والتحصيل */}
              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a]">
                  دورة الفوترة والتحصيل
                </label>
                <div className="relative">
                  <select
                    aria-label="دورة الفوترة والتحصيل"
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                    className="appearance-none w-full h-[44px] bg-white border border-[#eae8e4] rounded-[4px] ps-[38px] pe-[14px] text-[13px] text-[#1b1c1a] focus:outline-none cursor-pointer"
                  >
                    <option value="اشتراك سنوي (موصى به - خصم شهرين مجاناً)">
                      اشتراك سنوي (موصى به - خصم شهرين مجاناً)
                    </option>
                    <option value="اشتراك نصف سنوي">اشتراك نصف سنوي</option>
                    <option value="اشتراك شهري عادي">اشتراك شهري عادي</option>
                  </select>
                  <ChevronDown className="size-[14px] text-[#514537] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className="text-[11px] text-[#514537]">
                  يتم احتساب الفاتورة الأولى بعد التأكيد وإصدار السجل الضريبي.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Feedback & Notification Banner */}
        <div className="bg-[#f5f3ef] rounded-[8px] p-[16px] flex items-start gap-[12px]">
          <div className="flex-1 flex flex-col text-start">
            <span className="text-[13px] font-semibold text-[#1b1c1a]">
              {isEditMode ? "تحديث سجل المنشأة:" : "إشعار التشغيل الآلي للمكتب:"}
            </span>
            <p className="text-[12px] text-[#514537] leading-[20px] mt-[2px]">
              {isEditMode
                ? "سيتم تطبيق التعديلات وتحديث بيانات المنشأة القانونية ووسائل التواصل المعتمدة في سجلات منصة الجودي فوراً."
                : "سيتم إرسال بريد ترحيبي رسمي فورياً إلى صاحب المكتب يحتوي على رابط تعيين وتأكيد كلمة المرور، وبيانات الخادم المخصص، مع دليل التشغيل الأولي المعتمد لمنصة الجودي."}
            </p>
          </div>
          <Info className="size-[20px] text-[#9c6402] shrink-0 mt-[2px]" />
        </div>

        {/* Action Footer */}
        <div className="pt-[16px] border-t border-[#f0eeea] flex flex-col sm:flex-row items-center justify-between gap-[16px]">
          {/* Note */}
          <div className="flex items-center gap-[8px] text-[12px] text-[#514537]">
            <CheckCircle2 className="size-[15px] text-[#9c6402]" />
            <span>جميع الحقول المميزة بعلامة (*) إلزامية للامتثال النظامي</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={onBack}
              className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#1b1c1a] px-[24px] py-[10px] rounded-[4px] text-[14px] font-semibold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-[#9c6402] hover:bg-[#855402] text-white px-[32px] py-[10px] rounded-[4px] text-[14px] font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-[8px]"
            >
              <span>{isEditMode ? "حفظ التعديلات" : "إضافة المكتب"}</span>
              {isEditMode ? (
                <CheckCircle2 className="size-[15px]" />
              ) : (
                <Building2 className="size-[15px]" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
