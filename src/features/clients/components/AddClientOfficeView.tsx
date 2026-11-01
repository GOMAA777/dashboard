"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  User,
  Building2,
  Scale,
  Mail,
  Phone,
  PhoneCall,
  MapPin,
  Hash,
  RefreshCw,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle2,
  Info,
  Check,
  Hourglass,
  FileCheck,
  UploadCloud,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice } from "../types/client.types";
import { useLanguage } from "@/lib/i18n";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { fetchPlans } from "@/lib/api/plans";
import { unwrapList } from "@/lib/api/helpers";
import { normalizeLogoUrl } from "@/lib/api/mappers";

export interface OfficeFormData {
  id?: string;
  name: string;
  owner: string;
  licenseNumber: string;
  email: string;
  phone: string;
  landline?: string;
  address?: string;
  taxNumber?: string;
  city: string;
  plan: string;
  planId?: number;
  planType?: string;
  billingCycle?: string;
  autoRenew?: boolean;
  password?: string;
  logoFile?: File | null;
  logoUrl?: string;
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
  const { t } = useLanguage();
  const isEditMode = Boolean(officeToEdit);

  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<"paid" | "trial">(
    officeToEdit?.plan.includes("تجربة") ||
      officeToEdit?.subscriptionStatus.type === "trial"
      ? "trial"
      : "paid"
  );

  // Form states: EMPTY for new office, populated only when editing
  const [ownerName, setOwnerName] = useState(officeToEdit ? officeToEdit.owner : "");
  const [firmName, setFirmName] = useState(officeToEdit ? officeToEdit.name : "");
  const [licenseNumber, setLicenseNumber] = useState(
    officeToEdit ? officeToEdit.licenseNumber.replace("ترخيص عدلي: ", "") : ""
  );
  const [taxNumber, setTaxNumber] = useState(officeToEdit?.taxNumber || "");
  const [email, setEmail] = useState(officeToEdit ? officeToEdit.email : "");
  const [phone, setPhone] = useState(
    officeToEdit ? officeToEdit.phone.replace("+966 ", "").replace("+966", "") : ""
  );
  const [landline, setLandline] = useState(officeToEdit?.landline || "");
  const [address, setAddress] = useState(officeToEdit?.address || "");
  const [city, setCity] = useState(
    officeToEdit
      ? officeToEdit.city.includes("المملكة العربية السعودية")
        ? officeToEdit.city
        : `المملكة العربية السعودية - ${officeToEdit.city}`
      : ""
  );
  const [autoRenew, setAutoRenew] = useState(officeToEdit?.autoRenew !== false);
  const [password, setPassword] = useState(officeToEdit ? "••••••••••••" : "");
  const [selectedPlanId, setSelectedPlanId] = useState<number>(officeToEdit?.planId || 1);
  const [packageTier, setPackageTier] = useState(
    officeToEdit?.plan || "باقة التميز العدلي"
  );
  const [billingCycle, setBillingCycle] = useState(
    officeToEdit?.billingCycle?.includes("شهر")
      ? "اشتراك شهري عادي"
      : "اشتراك سنوي (موصى به - خصم شهرين مجاناً)"
  );
  const [availablePlans, setAvailablePlans] = useState<
    Array<{ id: number; name: string; monthlyPrice: string; yearlyPrice: string }>
  >([]);

  // Fetch real plans from server
  useEffect(() => {
    let cancelled = false;
    fetchPlans()
      .then((res) => {
        if (cancelled) return;
        const list = unwrapList<any>(res);
        if (list.length > 0) {
          const mapped = list.map((p) => ({
            id: Number(p.id),
            name: String(p.name),
            monthlyPrice: String(p.monthly_price || "0.00"),
            yearlyPrice: String(p.yearly_price || "0.00"),
          }));
          setAvailablePlans(mapped);
          if (!officeToEdit) {
            setSelectedPlanId(mapped[0].id);
            setPackageTier(mapped[0].name);
          }
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [officeToEdit]);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    normalizeLogoUrl(officeToEdit?.logo) || null
  );
  const [isDragging, setIsDragging] = useState(false);

  // Dynamic Password Strength Calculation
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "أدخل كلمة المرور لاحتساب القوة", color: "text-[#837565] dark:text-[#a89f91]" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, text: "ضعيفة (تحتاج 8 خانات ورموز)", color: "text-[#dc2626]" };
    if (score === 2) return { score: 2, text: "متوسطة المقبولية", color: "text-[#d97706]" };
    return { score: 3, text: "قوية ومطابقة للمعايير", color: "text-[#059669] dark:text-[#10b981]" };
  };

  const pwdStrength = calculatePasswordStrength(password);

  // File Upload Handlers
  const processLogoFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم الملف يتجاوز الحد الأقصى المسموح به (2 ميجابايت)");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالح (PNG, JPG, SVG)");
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
      toast.success(`تم إرفاق الشعار "${file.name}" بنجاح.`);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processLogoFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processLogoFile(file);
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("تمت إزالة الشعار المرفق.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim()) {
      toast.error("يرجى إدخال اسم صاحب المكتب");
      return;
    }
    if (!firmName.trim()) {
      toast.error("يرجى إدخال اسم المكتب أو الشركة المهنية");
      return;
    }
    if (!email.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني الرسمي للمكتب");
      return;
    }
    if (!phone.trim()) {
      toast.error("يرجى إدخال رقم الهاتف / الجوال للتواصل");
      return;
    }
    if (!isEditMode && !password.trim()) {
      toast.error("يرجى تعيين كلمة المرور الأولية للحساب");
      return;
    }

    const selectedPlan = availablePlans.find((p) => p.id === selectedPlanId);
    const cleanPlanName =
      selectedPlanType === "trial"
        ? "تجربة مجانية"
        : selectedPlan?.name || packageTier || "باقة التميز العدلي";

    const cleanCity = city ? city.replace("المملكة العربية السعودية - ", "").trim() : "الرياض";
    const resolvedLogoFile = logoFile || fileInputRef.current?.files?.[0] || null;

    onSuccess(
      {
        id: officeToEdit?.id,
        name: firmName,
        owner: ownerName,
        licenseNumber: licenseNumber
          ? licenseNumber.startsWith("ترخيص عدلي: ")
            ? licenseNumber
            : `ترخيص عدلي: ${licenseNumber}`
          : "قيد المراجعة والتحقق",
        email,
        phone: phone.startsWith("+966") ? phone : `+966 ${phone}`,
        landline: landline.trim() || undefined,
        address: address.trim() || (cleanCity ? `المملكة العربية السعودية - ${cleanCity}` : undefined),
        taxNumber: taxNumber.trim() || undefined,
        city: cleanCity,
        plan: cleanPlanName,
        planId: selectedPlanType === "trial" ? undefined : selectedPlanId,
        planType: selectedPlanType,
        billingCycle,
        autoRenew,
        password: password.trim() && password !== "••••••••••••" ? password : undefined,
        logoFile: resolvedLogoFile,
        logoUrl: logoPreview || undefined,
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
      className="w-full flex flex-col gap-6 font-['Cairo',sans-serif]"
      data-node-id="1:1427"
    >
      {/* Top Action & Title Header */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        {/* Right: Title & Subtitle */}
        <div className="flex flex-col items-start text-start">
          <h1 className="text-[24px] sm:text-[26px] leading-[34px] sm:leading-[36px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
            {isEditMode ? t("تعديل بيانات المكتب", "Edit Law Office Details") : t("إضافة مكتب جديد", "Add New Law Office")}
          </h1>
          <p className="text-[#514537] dark:text-[#cdc5bd] text-[13px] leading-[20px] font-normal mt-1">
            {isEditMode
              ? t(
                  "قم بتحديث وتعديل بيانات المنشأة القانونية ووسائل التواصل والاشتراكات المعتمدة لمنصة الجودي.",
                  "Update law firm details, contact information, and active subscriptions."
                )
              : t(
                  "أضف مكتب محاماة جديدًا إلى المنصة وحدد نوع اشتراكه وبيانات الدخول المعتمدة بدقة وموثوقية عالية.",
                  "Add a new law firm to the platform, configure subscription plan, and set up access credentials."
                )}
          </p>
        </div>

        {/* Left: العودة Button */}
        <button
          type="button"
          onClick={onBack}
          className="bg-white dark:bg-[#2d1f16] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] border border-[#eae8e4] dark:border-[#4d3627] text-[#1b1c1a] dark:text-[#fdfbf7] px-4 py-2 rounded-[4px] text-[14px] font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowRight className="size-[15px] stroke-[2.5] rtl:rotate-0 rotate-180" />
          <span>{t("العودة", "Back")}</span>
        </button>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 md:p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-6 sm:gap-8 w-full">
        {/* ======================================================== */}
        {/* SECTION 1: بيانات المكتب والمنشأة القانونية */}
        {/* ======================================================== */}
        <div className="flex flex-col gap-[16px] w-full" data-node-id="1:1433">
          {/* Section Header Bar: Circle & Title on Right, Step Badge on Left */}
          <div className="bg-[#f5f3ef]/80 dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#453022] rounded-[4px] px-[20px] py-[10px] flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="bg-[#9c6402] dark:bg-[#c29547] text-[#fff3e9] dark:text-[#1c140f] font-bold text-[13px] size-[28px] rounded-full flex items-center justify-center shrink-0 shadow-xs">
                ١
              </div>
              <div className="flex flex-col text-start">
                <h2 className="text-[17px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[24px]">
                  بيانات المكتب والمنشأة القانونية
                </h2>
                <p className="text-[12px] text-[#514537] dark:text-[#d5cec5] leading-[18px]">
                  المعلومات الأساسية للترخيص والمنشأة ووسائل التواصل المعتمدة للربط القضائي
                </p>
              </div>
            </div>

            <span className="bg-[#eae8e4] dark:bg-[#2c1e15] text-[#514537] dark:text-[#f0e6dc] border border-[#ded5c6] dark:border-[#523b2c] text-[10px] font-bold px-[8px] py-[3px] rounded-[2px]">
              الخطوة الأساسية
            </span>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] pt-[4px]">
            {/* 1. اسم صاحب المكتب */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                اسم صاحب المكتب <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/50 focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none transition-colors"
                  placeholder="أدخل الاسم الكامل لصاحب المكتب أو المحامي المسؤول (مثال: د. عبد العزيز بن فهد العجلان)"
                />
                <User className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                المحامي المسؤول المعتمد بموجب توكيل المنصة.
              </span>
            </div>

            {/* 2. اسم المكتب أو الشركة المهنية */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                اسم المكتب أو الشركة المهنية <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/50 focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none transition-colors"
                  placeholder="أدخل الاسم التجاري المعتمد للمكتب أو الشركة (مثال: شركة العجلان للمحاماة)"
                />
                <Building2 className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                الاسم التجاري أو المسجل في قائمة الشركات المهنية.
              </span>
            </div>

            {/* 3. رقم الترخيص العدلي */}
            <div className="flex flex-col gap-[6px] text-start">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  رقم الترخيص العدلي
                </label>
                <span className="bg-[#eae8e4] dark:bg-[#2c1e15] text-[#514537] dark:text-[#f0e6dc] border border-[#ded5c6] dark:border-[#523b2c] text-[10px] font-bold px-[6px] py-[2px] rounded-[2px]">
                  اختياري
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/50 focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none transition-colors"
                  placeholder="أدخل رقم الترخيص الصادر من وزارة العدل (مثال: 38/412)"
                />
                <Scale className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                صادر من وزارة العدل السعودية أو الهيئة السعودية للمحامين.
              </span>
            </div>

            {/* 4. الرقم الضريبي للمنشأة (ZATCA) */}
            <div className="flex flex-col gap-[6px] text-start">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  الرقم الضريبي للمنشأة (ZATCA)
                </label>
                <span className="bg-[#eae8e4] dark:bg-[#2c1e15] text-[#514537] dark:text-[#f0e6dc] border border-[#ded5c6] dark:border-[#523b2c] text-[10px] font-bold px-[6px] py-[2px] rounded-[2px]">
                  15 رقماً
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={15}
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/50 focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none direction-ltr text-start font-mono transition-colors"
                  placeholder="301298457200003"
                />
                <Hash className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                الرقم الضريبي المعتمد بهيئة الزكاة والضريبة والجمارك للفوترة الإلكترونية.
              </span>
            </div>

            {/* 5. البريد الإلكتروني الرسمي */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                البريد الإلكتروني الرسمي للمكتب <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/50 focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none direction-ltr text-start transition-colors"
                  placeholder="info@lawfirm.sa"
                />
                <Mail className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                سيتم إرسال بيانات الدخول ورمز التفعيل إليه آلياً.
              </span>
            </div>

            {/* 6. رقم الجوال / الهاتف للتواصل */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                رقم الجوال / الهاتف للتواصل <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="flex items-center gap-[8px]">
                <div className="bg-[#eae8e4] dark:bg-[#2c1e15] border border-[#ded5c6] dark:border-[#523b2c] h-[44px] px-[12px] rounded-[6px] flex items-center justify-center text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] shrink-0">
                  +966 🇸🇦
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/50 focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none direction-ltr text-start transition-colors"
                    placeholder="50 123 4567"
                  />
                  <Phone className="size-[14px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                يُستخدم لتأكيد العمليات الحساسة وإشعارات الجلسات العاجلة.
              </span>
            </div>

            {/* 7. الهاتف المكتبي الثابت */}
            <div className="flex flex-col gap-[6px] text-start">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  الهاتف المكتبي المباشر (الثابت)
                </label>
                <span className="bg-[#eae8e4] dark:bg-[#2c1e15] text-[#514537] dark:text-[#f0e6dc] border border-[#ded5c6] dark:border-[#523b2c] text-[10px] font-bold px-[6px] py-[2px] rounded-[2px]">
                  اختياري
                </span>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  value={landline}
                  onChange={(e) => setLandline(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/50 focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none direction-ltr text-start transition-colors"
                  placeholder="011 482 9900"
                />
                <PhoneCall className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                خط الاستقبال والسنترال الرئيسي للمنشأة.
              </span>
            </div>

            {/* 8. المدينة / المقر الرئيسي */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                المدينة / المقر الرئيسي <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <DashboardSelect
                aria-label="المدينة / المقر الرئيسي"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="اختر المدينة / المقر الرئيسي للمكتب..."
                className="h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] border-[#eae8e4] dark:border-[#422e20]"
              >
                <option value="" disabled>اختر المدينة / المقر الرئيسي للمكتب...</option>
                <option value="المملكة العربية السعودية - الرياض">المملكة العربية السعودية - الرياض</option>
                <option value="المملكة العربية السعودية - جدة">المملكة العربية السعودية - جدة</option>
                <option value="المملكة العربية السعودية - الدمام">المملكة العربية السعودية - الدمام</option>
                <option value="المملكة العربية السعودية - الخبر">المملكة العربية السعودية - الخبر</option>
                <option value="المملكة العربية السعودية - مكة المكرمة">المملكة العربية السعودية - مكة المكرمة</option>
                <option value="المملكة العربية السعودية - المدينة المنورة">المملكة العربية السعودية - المدينة المنورة</option>
                <option value="المملكة العربية السعودية - الأحساء">المملكة العربية السعودية - الأحساء</option>
                <option value="المملكة العربية السعودية - أبها">المملكة العربية السعودية - أبها</option>
                <option value="المملكة العربية السعودية - تبوك">المملكة العربية السعودية - تبوك</option>
              </DashboardSelect>
              <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                منطقة الاختصاص المكاني للمحاكم الابتدائية.
              </span>
            </div>

            {/* 9. العنوان الوطني / التفصيلي (Full Width) */}
            <div className="flex flex-col gap-[6px] text-start md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  العنوان الوطني / مقر المكتب الرئيسي
                </label>
                <span className="bg-[#eae8e4] dark:bg-[#2c1e15] text-[#514537] dark:text-[#f0e6dc] border border-[#ded5c6] dark:border-[#523b2c] text-[10px] font-bold px-[6px] py-[2px] rounded-[2px]">
                  موصى به
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/50 focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none transition-colors"
                  placeholder="طريق الملك فهد، حي الصحافة، برج النخبة - الطابق 14"
                />
                <MapPin className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                العنوان المسجل في بوابة الهيئة السعودية للمحامين وإشعارات التبليغ القضائي.
              </span>
            </div>
          </div>

          {/* Identity / Logo Upload Area (FULLY FUNCTIONAL FILE INPUT & DRAG/DROP) */}
          <div className="flex flex-col gap-[8px] pt-[8px] text-start">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                شعار المنشأة / الهوية القانونية
              </label>
              <span className="bg-[#eae8e4] dark:bg-[#281c15] text-[#514537] dark:text-[#cdc5bd] border border-[#ded5c6] dark:border-[#38271c] text-[10px] font-bold px-[6px] py-[2px] rounded-[2px]">
                اختياري
              </span>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-[8px] p-[18px] sm:p-[20px] flex items-center justify-between gap-[16px] border border-dashed transition-all cursor-pointer ${
                isDragging
                  ? "bg-[#ffddb6]/20 dark:bg-[rgba(226,157,56,0.18)] border-[#9c6402] dark:border-[#e29d38]"
                  : "bg-[#f5f3ef] dark:bg-[#160e0a] border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/60 dark:hover:border-[#e29d38]/60"
              }`}
            >
              {logoPreview ? (
                /* Uploaded Logo Preview */
                <div className="flex items-center gap-[14px] w-full">
                  <div className="size-[56px] rounded-[6px] bg-white dark:bg-[#2c1e15] border border-[#eae8e4] dark:border-[#523b2c] p-1 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="شعار المنشأة"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col text-start min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                        {logoFile ? logoFile.name : "تم رفع شعار المنشأة"}
                      </span>
                      <span className="bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border border-[#c8e6c9] dark:border-emerald-500/40 text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        جاهز
                      </span>
                    </div>
                    <span className="text-[11px] text-[#514537] dark:text-[#d5cec5] mt-0.5">
                      {logoFile ? `${(logoFile.size / 1024).toFixed(1)} KB` : "انقر لتغيير الشعار أو سحب صورة جديدة"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-2 rounded-[4px] hover:bg-[#fef2f2] dark:hover:bg-[#341616] text-[#dc2626] dark:text-[#f87171] transition-colors cursor-pointer shrink-0"
                    title="حذف الشعار"
                  >
                    <Trash2 className="size-[16px]" />
                  </button>
                </div>
              ) : (
                /* Empty Upload Prompt */
                <>
                  <div className="flex items-center gap-[12px]">
                    <div className="size-[54px] bg-white dark:bg-[#2c1e15] border border-[#eae8e4] dark:border-[#523b2c] rounded-[6px] shadow-sm flex items-center justify-center text-[#9c6402] dark:text-[#e29d38] shrink-0">
                      <UploadCloud className="size-[24px]" />
                    </div>
                    <div className="flex-1 flex flex-col text-start">
                      <div className="flex items-center gap-[8px]">
                        <span className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                          اسحب الشعار وأفلته هنا
                        </span>
                        <span className="text-[12px] text-[#514537] dark:text-[#d5cec5]">أو</span>
                        <span className="text-[13px] font-bold text-[#9c6402] dark:text-[#e29d38] underline">
                          تصفح الملفات
                        </span>
                      </div>
                      <span className="text-[11px] text-[#514537] dark:text-[#d5cec5] mt-[2px]">
                        الملفات المدعومة: PNG, SVG, JPG بحد أقصى 2 ميجابايت (يفضل خلفية شفافة أبعاد 400x400).
                      </span>
                    </div>
                  </div>

                  <span className="bg-[#eae8e4] dark:bg-[#2c1e15] text-[#514537] dark:text-[#f0e6dc] border border-[#ded5c6] dark:border-[#523b2c] text-[10px] font-bold px-[10px] py-[4px] rounded-[2px] shrink-0">
                    2 MB كحد أقصى
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: بيانات الحساب والاشتراك السحابي */}
        {/* ======================================================== */}
        <div className="flex flex-col gap-[16px] w-full pt-[8px]" data-node-id="1:1543">
          {/* Section Header Bar */}
          <div className="bg-[#f5f3ef]/80 dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#453022] rounded-[4px] px-[20px] py-[10px] flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="bg-[#9c6402] dark:bg-[#c29547] text-[#fff3e9] dark:text-[#1c140f] font-bold text-[13px] size-[28px] rounded-full flex items-center justify-center shrink-0 shadow-xs">
                ٢
              </div>
              <div className="flex flex-col text-start">
                <h2 className="text-[17px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[24px]">
                  بيانات الحساب والاشتراك السحابي
                </h2>
                <p className="text-[12px] text-[#514537] dark:text-[#d5cec5] leading-[18px]">
                  إعدادات المصادقة والدخول ونوع الباقة المفعلة للمكتب وصلاحيات الأعضاء
                </p>
              </div>
            </div>

            <span className="bg-[#eae8e4] dark:bg-[#2c1e15] text-[#514537] dark:text-[#f0e6dc] border border-[#ded5c6] dark:border-[#523b2c] text-[10px] font-bold px-[8px] py-[3px] rounded-[2px]">
              الوصول والأمان
            </span>
          </div>

          {/* Initial Password Field */}
          <div className="flex flex-col gap-[6px] text-start">
            <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              كلمة المرور الأولية للحساب <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required={!isEditMode}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/50 focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38] rounded-[6px] ps-[40px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none direction-ltr text-start font-mono transition-colors"
                placeholder="أدخل كلمة مرور قوية (8 خانات على الأقل تتضمن رموزاً وأرقاماً)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute start-[12px] top-1/2 -translate-y-1/2 text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] p-1 cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="size-[15px]" /> : <Eye className="size-[15px]" />}
              </button>
            </div>

            {/* Password strength indicator */}
            <div className="flex items-center gap-[8px] pt-[2px]">
              <span className={`text-[10px] font-semibold ${pwdStrength.color}`}>
                {pwdStrength.text}
              </span>
              <div className="flex-1 h-[5px] bg-[#eae8e4] dark:bg-[#2c1e15] rounded-full overflow-hidden flex gap-[4px]">
                <div
                  className={`flex-1 rounded-full transition-colors ${
                    pwdStrength.score >= 1
                      ? pwdStrength.score === 1
                        ? "bg-[#dc2626]"
                        : pwdStrength.score === 2
                        ? "bg-[#d97706]"
                        : "bg-[#059669] dark:bg-[#10b981]"
                      : "bg-[#eae8e4] dark:bg-[#2c1e15]"
                  }`}
                />
                <div
                  className={`flex-1 rounded-full transition-colors ${
                    pwdStrength.score >= 2
                      ? pwdStrength.score === 2
                        ? "bg-[#d97706]"
                        : "bg-[#059669] dark:bg-[#10b981]"
                      : "bg-[#eae8e4] dark:bg-[#2c1e15]"
                  }`}
                />
                <div
                  className={`flex-1 rounded-full transition-colors ${
                    pwdStrength.score >= 3
                      ? "bg-[#059669] dark:bg-[#10b981]"
                      : "bg-[#eae8e4] dark:bg-[#2c1e15]"
                  }`}
                />
              </div>
            </div>
            <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
              يجب أن تحتوي على 8 خانات على الأقل تتضمن أحرفاً كبيرة وصغيرة وأرقاماً ورموزاً.
            </span>
          </div>

          {/* Subscription Plan Radio Cards */}
          <div className="flex flex-col gap-[8px] pt-[8px] text-start">
            <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              نوع وخطة الاشتراك <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              {/* Card 1: باقة مدفوعة (Selected) */}
              <div
                onClick={() => setSelectedPlanType("paid")}
                className={`rounded-[8px] p-[16px] flex flex-col gap-[8px] cursor-pointer transition-all border ${
                  selectedPlanType === "paid"
                    ? "bg-[#f5f3ef] dark:bg-[#261911] border-[#9c6402] dark:border-[#c29547] ring-1 ring-[#9c6402] dark:ring-[#c29547] shadow-sm"
                    : "bg-[#f5f3ef] dark:bg-[#160e0a] border-[#eae8e4] dark:border-[#422e20] opacity-80"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-[8px]">
                    <div
                      className={`size-[20px] rounded-full flex items-center justify-center shrink-0 ${
                        selectedPlanType === "paid"
                          ? "bg-[#9c6402] dark:bg-[#c29547] text-white dark:text-[#1c140f]"
                          : "border border-[#837565] dark:border-[#a89f91]"
                      }`}
                    >
                      {selectedPlanType === "paid" && <Check className="size-[12px] stroke-[3]" />}
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[22px]">
                        باقة مدفوعة
                      </span>
                      <span className="text-[11px] text-[#514537] dark:text-[#d5cec5] leading-[16px]">
                        تفعيل فوري لكافة مزايا النظام وسندات القبض
                      </span>
                    </div>
                  </div>

                  <span className="bg-[#9c6402]/15 dark:bg-[#e29d38]/20 text-[#9c6402] dark:text-[#e29d38] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                    فوري
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] rounded-[4px] px-[10px] py-[6px] flex items-center justify-between text-[11px] font-bold text-[#514537] dark:text-[#d5cec5]">
                  <span>وصول كامل لربط ناجز والقضايا غير المحدودة</span>
                  <FileCheck className="size-[14px] text-[#9c6402] dark:text-[#e29d38]" />
                </div>
              </div>

              {/* Card 2: تجربة مجانية */}
              <div
                onClick={() => setSelectedPlanType("trial")}
                className={`rounded-[8px] p-[16px] flex flex-col gap-[8px] cursor-pointer transition-all border ${
                  selectedPlanType === "trial"
                    ? "bg-[#f5f3ef] dark:bg-[#261911] border-[#9c6402] dark:border-[#c29547] ring-1 ring-[#9c6402] dark:ring-[#c29547] shadow-sm"
                    : "bg-[#f5f3ef] dark:bg-[#160e0a] border-[#eae8e4] dark:border-[#422e20] opacity-80"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-[8px]">
                    <div
                      className={`size-[20px] rounded-full flex items-center justify-center shrink-0 ${
                        selectedPlanType === "trial"
                          ? "bg-[#9c6402] dark:bg-[#c29547] text-white dark:text-[#1c140f]"
                          : "border border-[#837565] dark:border-[#a89f91]"
                      }`}
                    >
                      {selectedPlanType === "trial" && <Check className="size-[12px] stroke-[3]" />}
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[22px]">
                        تجربة مجانية
                      </span>
                      <span className="text-[11px] text-[#514537] dark:text-[#d5cec5] leading-[16px]">
                        فترة استكشافية للمكتب لإجراء الاختبارات التشغيلية
                      </span>
                    </div>
                  </div>

                  <span className="bg-[#eae8e4] dark:bg-[#2c1e15] text-[#514537] dark:text-[#f0e6dc] border border-[#ded5c6] dark:border-[#523b2c] text-[10px] font-semibold px-[8px] py-[2px] rounded-[2px]">
                    ١٤ يوماً
                  </span>
                </div>

                <div className="bg-white/80 dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] rounded-[4px] px-[10px] py-[6px] flex items-center justify-between text-[11px] font-bold text-[#514537] dark:text-[#d5cec5]">
                  <span>إمكانية إضافة حتى 3 محامين و 25 قضية</span>
                  <Hourglass className="size-[13px] text-[#837565] dark:text-[#a89f91]" />
                </div>
              </div>
            </div>
          </div>

          {/* Tier & Billing Configuration Details */}
          <div className="bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] rounded-[8px] p-[20px] flex flex-col gap-[16px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              {/* الباقة المعتمدة (CUSTOM LUXURY DROPDOWN MENU) */}
              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  الباقة المعتمدة
                </label>
                <DashboardSelect
                  aria-label="الباقة المعتمدة"
                  value={String(selectedPlanId)}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedPlanId(id);
                    const found = availablePlans.find((p) => p.id === id);
                    if (found) setPackageTier(found.name);
                  }}
                  className="h-[44px] bg-white dark:bg-[#1f150f] border-[#eae8e4] dark:border-[#422e20]"
                >
                  {availablePlans.length > 0 ? (
                    availablePlans.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.name} ({Number(p.monthlyPrice).toLocaleString("ar-SA")} ر.س / شهرياً - {Number(p.yearlyPrice).toLocaleString("ar-SA")} ر.س / سنوياً)
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">باقة التميز العدلي ( 2,222 ر.س / شهرياً )</option>
                      <option value="2">الباقة الاحترافية ( 750 ر.س / شهرياً )</option>
                      <option value="3">الباقة الأساسية ( 350 ر.س / شهرياً )</option>
                    </>
                  )}
                </DashboardSelect>
                <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                  تشمل حتى 15 مستخدم، ونظام الفوترة الإلكترونية المرتبط بهيئة الزكاة.
                </span>
              </div>

              {/* دورة الفوترة والتحصيل (CUSTOM LUXURY DROPDOWN MENU) */}
              <div className="flex flex-col gap-[6px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  دورة الفوترة والتحصيل
                </label>
                <DashboardSelect
                  aria-label="دورة الفوترة والتحصيل"
                  value={billingCycle}
                  onChange={(e) => setBillingCycle(e.target.value)}
                  className="h-[44px] bg-white dark:bg-[#1f150f] border-[#eae8e4] dark:border-[#422e20]"
                >
                  <option value="اشتراك سنوي (موصى به - خصم شهرين مجاناً)">
                    اشتراك سنوي (موصى به - خصم شهرين مجاناً)
                  </option>
                  <option value="اشتراك نصف سنوي">اشتراك نصف سنوي</option>
                  <option value="اشتراك شهري عادي">اشتراك شهري عادي</option>
                </DashboardSelect>
                <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                  يتم احتساب الفاتورة الأولى بعد التأكيد وإصدار السجل الضريبي.
                </span>
              </div>

              {/* التجديد التلقائي للاشتراك */}
              <div className="flex items-center justify-between p-[14px] bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] rounded-[6px] md:col-span-2">
                <div className="flex items-center gap-[10px]">
                  <div className="size-[32px] rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] flex items-center justify-center text-[#9c6402] dark:text-[#e29d38]">
                    <RefreshCw className="size-[15px]" />
                  </div>
                  <div className="flex flex-col text-start">
                    <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("تفعيل التجديد التلقائي للاشتراك", "Enable Auto-Renewal")}
                    </span>
                    <span className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                      {t("تجديد الاشتراك آلياً عبر البطاقة المسجلة عند نهاية فترة الاشتراك لتجنب إيقاف الخدمات", "Automatically renew using registered card to avoid service suspension")}
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#eae8e4] peer-focus:outline-none rounded-full peer dark:bg-[#38271c] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#9c6402] dark:peer-checked:bg-[#c29547]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* System Feedback & Notification Banner */}
        <div className="bg-[#f5f3ef] dark:bg-[#1a120d] border border-[#eae8e4] dark:border-[#453022] rounded-[8px] p-[16px] flex items-start gap-[12px]">
          <div className="flex-1 flex flex-col text-start">
            <span className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEditMode ? "تحديث سجل المنشأة:" : "إشعار التشغيل الآلي للمكتب:"}
            </span>
            <p className="text-[12px] text-[#514537] dark:text-[#d5cec5] leading-[20px] mt-[2px]">
              {isEditMode
                ? "سيتم تطبيق التعديلات وتحديث بيانات المنشأة القانونية ووسائل التواصل المعتمدة في سجلات منصة الجودي فوراً."
                : "سيتم إرسال بريد ترحيبي رسمي فورياً إلى صاحب المكتب يحتوي على رابط تعيين وتأكيد كلمة المرور، وبيانات الخادم المخصص، مع دليل التشغيل الأولي المعتمد لمنصة الجودي."}
            </p>
          </div>
          <Info className="size-[20px] text-[#9c6402] dark:text-[#e29d38] shrink-0 mt-[2px]" />
        </div>

        {/* Action Footer */}
        <div className="pt-[16px] border-t border-[#f0eeea] dark:border-[#453022] flex flex-col sm:flex-row items-center justify-between gap-[16px]">
          {/* Note */}
          <div className="flex items-center gap-[8px] text-[12px] text-[#514537] dark:text-[#d5cec5]">
            <CheckCircle2 className="size-[15px] text-[#9c6402] dark:text-[#e29d38]" />
            <span>{t("جميع الحقول المميزة بعلامة (*) إلزامية للامتثال النظامي", "All fields marked with (*) are required for compliance")}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={onBack}
              className="bg-[#f0eeea] dark:bg-[#2c1e15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#eae8e4] dark:border-[#523b2c] px-[24px] py-[10px] rounded-[4px] text-[14px] font-semibold transition-colors cursor-pointer"
            >
              {t("إلغاء", "Cancel")}
            </button>
            <button
              type="submit"
              className="bg-[#9c6402] hover:bg-[#855402] dark:bg-[#c29547] dark:hover:bg-[#b0833b] text-white dark:text-[#1c140f] px-[32px] py-[10px] rounded-[4px] text-[14px] font-semibold shadow-sm transition-colors cursor-pointer flex items-center gap-[8px]"
            >
              <span>{isEditMode ? t("حفظ التعديلات", "Save Changes") : t("إضافة المكتب", "Add Office")}</span>
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
