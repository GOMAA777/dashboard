"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Check,
  Hourglass,
  FileCheck,
  UploadCloud,
  Trash2,
  AlertCircle,
  XCircle,
  Search,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  BellRing,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ClientOffice } from "../types/client.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { fetchPlans, createPlan, updatePlan, getLocalCustomPlans, saveLocalCustomPlan } from "@/lib/api/plans";
import { unwrapList } from "@/lib/api/helpers";
import { normalizeLogoUrl, mapPlanFromApi, getLocalCustomAutoRenew, getLocalCustomThemeColor } from "@/lib/api/mappers";
import type { PricingPlanItem } from "@/features/plans/types/plan.types";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { OfficeColorPalettePicker } from "./OfficeColorPalettePicker";
import { DEFAULT_OFFICE_THEME_COLOR } from "../constants/office-colors";
import {
  officeSchema,
  OfficeFormValues,
  evaluateFieldRules,
  FieldValidationStatus,
} from "./office.schema";
import { RealTimeValidationBox } from "./RealTimeValidationBox";
import {
  SAUDI_CITIES,
  normalizeArabicDigits,
  getEmailDomainSuggestion,
} from "../constants/saudi-cities";

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
  planId?: number | string;
  planType?: string;
  billingCycle?: string;
  autoRenew?: boolean;
  planDetails?: any;
  password?: string;
  logoFile?: File | null;
  logoUrl?: string;
  themeColor?: string;
  status?: "active" | "inactive" | "suspended";
}

function resolveOfficeAccountStatus(
  office?: ClientOffice | null
): "active" | "inactive" {
  if (!office) return "active";
  const rawStatus = (office as unknown as { status?: string }).status;
  const accType = office.accountStatus?.type as string | undefined;
  const label = office.accountStatus?.label || "";
  const isInactive =
    accType === "suspended" ||
    accType === "inactive" ||
    label === "غير نشط" ||
    label.includes("معطل") ||
    rawStatus === "inactive" ||
    rawStatus === "suspended";
  if (isInactive) return "inactive";
  return "active";
}

interface AddClientOfficeViewProps {
  officeToEdit?: ClientOffice | null;
  onBack: () => void;
  onSuccess: (officeData: OfficeFormData, isEdit: boolean) => void | Promise<void>;
}

export function formatPhoneForInput(rawPhone?: string | null): string {
  if (!rawPhone) return "";
  let clean = rawPhone.replace(/\+966\s?/, "").replace(/\s+/g, "").trim();
  if (/^5\d{8}$/.test(clean)) {
    clean = `0${clean}`;
  }
  return clean;
}

export function formatLicenseForInput(rawLicense?: string | null): string {
  if (!rawLicense) return "";
  return rawLicense.replace(/^ترخيص عدلي\s*:\s*/, "").trim();
}

export function createThumbnail(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/webp", 0.85));
            return;
          }
        } catch {
          // fallback
        }
        resolve(src);
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

export function AddClientOfficeView({
  officeToEdit,
  onBack,
  onSuccess,
}: AddClientOfficeViewProps) {
  const { t, isEn } = useLanguage();
  const isEditMode = Boolean(officeToEdit);

  // Office Status: Active or Inactive only (نشط أو غير نشط فقط)
  const [officeStatus, setOfficeStatus] = useState<"active" | "inactive">(() =>
    resolveOfficeAccountStatus(officeToEdit)
  );

  useEffect(() => {
    setOfficeStatus(resolveOfficeAccountStatus(officeToEdit));
  }, [officeToEdit]);

  const [selectedThemeColor, setSelectedThemeColor] = useState<string>(() => {
    if (officeToEdit?.id) {
      const local = getLocalCustomThemeColor(officeToEdit.id);
      if (local) return local;
    }
    if (officeToEdit?.companyId) {
      const local = getLocalCustomThemeColor(officeToEdit.companyId);
      if (local) return local;
    }
    if (officeToEdit?.themeColor) return officeToEdit.themeColor;
    if (officeToEdit?.color) return officeToEdit.color;
    return DEFAULT_OFFICE_THEME_COLOR;
  });

  useEffect(() => {
    if (officeToEdit) {
      const color =
        (officeToEdit.id ? getLocalCustomThemeColor(officeToEdit.id) : undefined) ||
        (officeToEdit.companyId ? getLocalCustomThemeColor(officeToEdit.companyId) : undefined) ||
        officeToEdit.themeColor ||
        officeToEdit.color ||
        DEFAULT_OFFICE_THEME_COLOR;
      setSelectedThemeColor(color);
    }
  }, [officeToEdit]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState<number>(1);

  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<"paid" | "trial">(
    officeToEdit?.planType === "trial" ||
    officeToEdit?.subscriptionPlan === "trial" ||
    officeToEdit?.subscriptionStatus?.type === "trial" ||
    officeToEdit?.plan?.includes("تجرب")
      ? "trial"
      : "paid"
  );

  const [autoRenew, setAutoRenew] = useState(() => {
    if (!officeToEdit) return true;
    const local = officeToEdit.id ? getLocalCustomAutoRenew(officeToEdit.id) : undefined;
    if (local !== undefined) return local;
    return officeToEdit.autoRenew !== false;
  });
  const [selectedPlanId, setSelectedPlanId] = useState<number | string>(
    officeToEdit?.planId !== undefined ? officeToEdit.planId : ""
  );
  const [packageTier, setPackageTier] = useState(
    officeToEdit?.plan || ""
  );
  const [billingCycle, setBillingCycle] = useState(() => {
    const raw = officeToEdit?.billingCycle || "";
    if (raw.includes("سنو") || raw.includes("year") || raw.includes("annu")) {
      return "اشتراك سنوي (موصى به - خصم شهرين مجاناً)";
    }
    if (raw.includes("شهري") || raw.includes("month")) {
      return "اشتراك شهري عادي";
    }
    return "اشتراك سنوي (موصى به - خصم شهرين مجاناً)";
  });
  const [availablePlans, setAvailablePlans] = useState<
    Array<{ id: number | string; name: string; monthlyPrice: string; yearlyPrice: string }>
  >([]);

  const isTrial = selectedPlanType === "trial";

  const [isCustomPlan, setIsCustomPlan] = useState<boolean>(
    Boolean(officeToEdit?.plan?.includes("مخصصة") || officeToEdit?.planId === -1)
  );
  const [customPlanName, setCustomPlanName] = useState<string>(
    officeToEdit?.plan?.includes("مخصصة") ? officeToEdit.plan : ""
  );
  const [customPlanDescription, setCustomPlanDescription] = useState<string>("");
  const [customMonthlyPrice, setCustomMonthlyPrice] = useState<string>(
    officeToEdit?.planDetails?.monthlyPrice || "1500"
  );
  const [customYearlyPrice, setCustomYearlyPrice] = useState<string>(
    officeToEdit?.planDetails?.yearlyPrice || "15000"
  );
  const [customLawyersLimit, setCustomLawyersLimit] = useState<string>(
    String(officeToEdit?.planDetails?.maxLawyers || "10")
  );
  const [customCasesLimit, setCustomCasesLimit] = useState<string>(
    String(officeToEdit?.planDetails?.maxCases || "200")
  );
  const [customAgentsLimit, setCustomAgentsLimit] = useState<string>("5");
  const [customAssistantsLimit, setCustomAssistantsLimit] = useState<string>("5");
  const [customClientsLimit, setCustomClientsLimit] = useState<string>("1000");
  const [customStorageLimit, setCustomStorageLimit] = useState<string>(
    officeToEdit?.planDetails?.storageLimitGb ? String(officeToEdit.planDetails.storageLimitGb) : "50"
  );
  const [customSupportLevel, setCustomSupportLevel] = useState<string>("vip");
  const [customNajizIntegration, setCustomNajizIntegration] = useState<boolean>(true);
  const [customZatcaPhase2, setCustomZatcaPhase2] = useState<boolean>(true);
  const [customKpiReports, setCustomKpiReports] = useState<boolean>(true);
  const [customDedicatedManager, setCustomDedicatedManager] = useState<boolean>(true);
  const [customApiIntegration, setCustomApiIntegration] = useState<boolean>(false);
  const [customVipSupport, setCustomVipSupport] = useState<boolean>(true);
  const [customSaveToPlansTab, setCustomSaveToPlansTab] = useState<boolean>(true);

  // City Combobox state
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Focus tracking for the real-time Validation Box
  const [focusedField, setFocusedField] = useState<keyof OfficeFormValues | null>("ownerName");

  // Subtle shake state for the Validation Box
  const [isBoxShaking, setIsBoxShaking] = useState(false);
  const triggerShake = () => {
    setIsBoxShaking(true);
    setTimeout(() => setIsBoxShaking(false), 450);
  };

  // React Hook Form initialization with Zod resolver
  const defaultCityValue = useMemo(() => {
    if (!officeToEdit?.city) return "";
    const clean = officeToEdit.city.replace("المملكة العربية السعودية - ", "").trim();
    return SAUDI_CITIES.includes(clean) ? clean : "";
  }, [officeToEdit]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    setFocus,
    reset,
    formState: { errors, touchedFields, submitCount },
  } = useForm<OfficeFormValues>({
    resolver: zodResolver(officeSchema),
    mode: "onTouched",
    defaultValues: {
      ownerName: officeToEdit && officeToEdit.owner !== "—" ? officeToEdit.owner : "",
      firmName: officeToEdit ? officeToEdit.name : "",
      licenseNumber: formatLicenseForInput(officeToEdit?.licenseNumber),
      taxNumber: officeToEdit?.taxNumber || "",
      email: officeToEdit ? officeToEdit.email : "",
      phone: formatPhoneForInput(officeToEdit?.phone),
      landline: officeToEdit?.landline || "",
      city: defaultCityValue,
      address: officeToEdit?.address || "",
      password: officeToEdit ? "Secret123!" : "",
    },
  });

  // Sync form values whenever officeToEdit changes or loads asynchronously
  useEffect(() => {
    if (officeToEdit) {
      const cleanCity = officeToEdit.city
        ? officeToEdit.city.replace("المملكة العربية السعودية - ", "").trim()
        : "";
      const validCity = SAUDI_CITIES.includes(cleanCity) ? cleanCity : "";

      reset({
        ownerName: officeToEdit.owner && officeToEdit.owner !== "—" ? officeToEdit.owner : "",
        firmName: officeToEdit.name || "",
        licenseNumber: formatLicenseForInput(officeToEdit.licenseNumber),
        taxNumber: officeToEdit.taxNumber || "",
        email: officeToEdit.email || "",
        phone: formatPhoneForInput(officeToEdit.phone),
        landline: officeToEdit.landline || "",
        city: validCity,
        address: officeToEdit.address || "",
        password: officeToEdit.initialPassword || "Secret123!",
      });

      setSelectedPlanType(
        officeToEdit.planType === "trial" ||
        officeToEdit.subscriptionPlan === "trial" ||
        officeToEdit.subscriptionStatus?.type === "trial" ||
        officeToEdit.plan?.includes("تجرب")
          ? "trial"
          : "paid"
      );
      const localRenew = officeToEdit.id ? getLocalCustomAutoRenew(officeToEdit.id) : undefined;
      setAutoRenew(localRenew !== undefined ? localRenew : officeToEdit.autoRenew !== false);
      if (officeToEdit.planId && officeToEdit.planId !== -1) {
        setSelectedPlanId(officeToEdit.planId);
      }
      if (officeToEdit.plan) {
        setPackageTier(officeToEdit.plan);
      }
      const raw = officeToEdit.billingCycle || "";
      const isAnnual = raw.includes("سنو") || raw.includes("year") || raw.includes("annu");
      setBillingCycle(
        isAnnual
          ? "اشتراك سنوي (موصى به - خصم شهرين مجاناً)"
          : "اشتراك شهري عادي"
      );
      setOfficeStatus(resolveOfficeAccountStatus(officeToEdit));
      setLogoPreview(normalizeLogoUrl(officeToEdit.logo) || null);
    }
  }, [officeToEdit, reset]);

  const watchedValues = watch();

  // Email typo suggestion calculation
  const emailSuggestion = useMemo(() => {
    return getEmailDomainSuggestion(watchedValues.email || "");
  }, [watchedValues.email]);

  // Real-time evaluation of all 10 fields for the checklist box
  const fieldValidationStatuses: FieldValidationStatus[] = useMemo(() => {
    const fields: (keyof OfficeFormValues)[] = [
      "ownerName",
      "firmName",
      "licenseNumber",
      "taxNumber",
      "email",
      "phone",
      "landline",
      "city",
      "address",
      "password",
    ];
    return fields.map((f) => evaluateFieldRules(f, watchedValues[f] || ""));
  }, [watchedValues]);

  const validCount = useMemo(() => {
    return fieldValidationStatuses.filter((s) => s.isValid).length;
  }, [fieldValidationStatuses]);

  // Active field info for detailed display in validation box
  const activeStatus = useMemo(() => {
    return fieldValidationStatuses.find((s) => s.name === focusedField) || fieldValidationStatuses[0];
  }, [fieldValidationStatuses, focusedField]);

  // Shake trigger on input error in the currently focused field
  const prevFocusedErrorRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (activeStatus && activeStatus.isFilled && !activeStatus.isValid) {
      if (activeStatus.errorMessage && activeStatus.errorMessage !== prevFocusedErrorRef.current) {
        triggerShake();
      }
    }
    prevFocusedErrorRef.current = activeStatus?.errorMessage;
  }, [activeStatus?.errorMessage, activeStatus?.isValid, activeStatus?.isFilled]);

  // Close city dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real plans from server + local storage
  useEffect(() => {
    let cancelled = false;
    const localPlans = getLocalCustomPlans();

    fetchPlans()
      .then((res) => {
        if (cancelled) return;
        const list = unwrapList<any>(res);
        const serverMapped = list.map((p) => ({
          id: p.id,
          name: String(p.name),
          monthlyPrice: String(p.monthly_price || "0.00"),
          yearlyPrice: String(p.yearly_price || "0.00"),
        }));

        // Merge server plans and local custom plans without duplicate IDs/names
        const merged = [...serverMapped];
        localPlans.forEach((lp) => {
          if (!merged.some((m) => String(m.id) === String(lp.id) || m.name === lp.name)) {
            merged.push({
              id: lp.id,
              name: lp.name,
              monthlyPrice: String(lp.monthlyPrice || "0.00"),
              yearlyPrice: String(lp.annualPrice || "0.00"),
            });
          }
        });

        setAvailablePlans(merged);
        if (!officeToEdit) {
          if (merged.length > 0) {
            setSelectedPlanId((prev) => (prev === "custom" || prev === -1 || isCustomPlan ? "custom" : merged[0].id));
            setPackageTier((prev) => (prev === "باقة مخصصة" || isCustomPlan ? prev : merged[0].name));
          } else {
            // No plans exist in the system yet! Auto-activate custom plan
            setIsCustomPlan(true);
            setSelectedPlanId("custom");
            setPackageTier("باقة مخصصة");
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        if (localPlans.length > 0) {
          const mapped = localPlans.map((lp) => ({
            id: lp.id,
            name: lp.name,
            monthlyPrice: String(lp.monthlyPrice || "0.00"),
            yearlyPrice: String(lp.annualPrice || "0.00"),
          }));
          setAvailablePlans(mapped);
          if (!officeToEdit) {
            setSelectedPlanId((prev) => (prev === "custom" || prev === -1 || isCustomPlan ? "custom" : mapped[0].id));
            setPackageTier((prev) => (prev === "باقة مخصصة" || isCustomPlan ? prev : mapped[0].name));
          }
        } else {
          setAvailablePlans([]);
          if (!officeToEdit) {
            setIsCustomPlan(true);
            setSelectedPlanId("custom");
            setPackageTier("باقة مخصصة");
          }
        }
      });

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

  const processLogoFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الملف يتجاوز الحد الأقصى المسموح به (5 ميجابايت)");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صالح (PNG, JPG, WebP, SVG)");
      return;
    }
    setLogoFile(file);
    try {
      const thumb = await createThumbnail(file, 256);
      setLogoPreview(thumb);
      toast.success(`تم إرفاق الشعار "${file.name}" بنجاح.`);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
        toast.success(`تم إرفاق الشعار "${file.name}" بنجاح.`);
      };
      reader.readAsDataURL(file);
    }
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

  // Filtered Saudi cities for searchable Combobox
  const filteredCities = useMemo(() => {
    if (!citySearchTerm.trim()) return SAUDI_CITIES;
    return SAUDI_CITIES.filter((c) =>
      c.toLowerCase().includes(citySearchTerm.trim().toLowerCase())
    );
  }, [citySearchTerm]);

  // On Invalid Submit: Scroll smoothly to the first invalid field and focus it
  const onInvalid = (formErrors: typeof errors) => {
    const errorKeys = Object.keys(formErrors) as (keyof OfficeFormValues)[];
    if (errorKeys.length > 0) {
      const firstErrorField = errorKeys[0];
      setFocusedField(firstErrorField);
      triggerShake();

      // Find the element in DOM
      const element = document.querySelector(
        `[name="${firstErrorField}"], [data-field-name="${firstErrorField}"]`
      ) as HTMLElement | null;

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          element.focus();
        }, 200);
      }
    }

    toast.error(
      t(
        "يرجى إكمال البيانات لمواصلة التسجيل",
        "Please complete the data to continue registration"
      )
    );
  };

  // On Valid Submit: Format and persist data with dynamic progress tracking
  const onSubmit = async (data: OfficeFormValues) => {
    setIsSubmitting(true);
    setSubmitStage(1);

    const timer1 = setTimeout(() => setSubmitStage(2), 700);
    const timer2 = setTimeout(() => setSubmitStage(3), 1600);

    const isTrial = selectedPlanType === "trial";
    let cleanPlanName = packageTier;
    let finalPlanId: number | string | undefined = selectedPlanId;

    if (isTrial) {
      cleanPlanName = "تجربة مجانية";
      finalPlanId = undefined;
    } else if (isCustomPlan) {
      cleanPlanName = customPlanName.trim() || `باقة مخصصة - ${data.firmName || "المكتب"}`;

      const numMonthly = Number(customMonthlyPrice) || 0;
      const numYearly = Number(customYearlyPrice) || (numMonthly * 12);
      const numLawyers = customLawyersLimit === "unlimited" ? -1 : Number(customLawyersLimit) || 10;
      const numCases = customCasesLimit === "unlimited" ? -1 : Number(customCasesLimit) || 200;
      const numAgents = customAgentsLimit === "unlimited" ? -1 : Number(customAgentsLimit) || 5;
      const numAssistants = customAssistantsLimit === "unlimited" ? -1 : Number(customAssistantsLimit) || 5;
      const numClients = customClientsLimit === "unlimited" ? -1 : Number(customClientsLimit) || 1000;
      const numStorage = customStorageLimit === "unlimited" ? -1 : parseInt(customStorageLimit) || 50;

      const activeFeatures: string[] = [];
      if (customNajizIntegration) activeFeatures.push("الربط التلقائي المباشر مع منصة ناجز ووزارة العدل");
      if (customZatcaPhase2) activeFeatures.push("الفوترة الإلكترونية المتوافقة مع هيئة الزكاة والضريبة (ZATCA Phase 2)");
      if (customKpiReports) activeFeatures.push("تقارير مؤشرات الأداء والتحليلات القضائية (KPIs)");
      if (customDedicatedManager) activeFeatures.push("مدير حساب استشاري مخصص VIP");
      if (customApiIntegration) activeFeatures.push("تكامل واجهة البرمجة (Custom API Integration)");
      if (customVipSupport) activeFeatures.push("دعم مباشر ذو أولوية فائقة (VIP)");

      const calculatedDiscount =
        numMonthly > 0 && numYearly > 0
          ? Math.max(0, Math.round(((numMonthly * 12 - numYearly) / (numMonthly * 12)) * 100))
          : 0;

      const supportLevelLabel =
        customSupportLevel === "vip"
          ? "دعم مباشر ذو أولوية فائقة (VIP SLA)"
          : customSupportLevel === "priority"
          ? "دعم فني ذو أولوية للمكتب"
          : "دعم فني قياسي (خلال 24 ساعة)";

      const planPayload = {
        name: cleanPlanName,
        description:
          customPlanDescription.trim() ||
          `باقة مخصصة تم إعدادها لمكتب ${data.firmName || "المحاماة"} بمزايا وشروط حصرية.`,
        badge: "باقة مخصصة",
        badge_color: "#d97706",
        type: "paid",
        monthly_price: numMonthly,
        yearly_price: numYearly,
        yearly_discount_percent: calculatedDiscount,
        max_lawyers: numLawyers,
        max_cases: numCases,
        max_power_of_attorney: numAgents,
        max_assistants: numAssistants,
        max_clients: numClients,
        storage_limit_gb: numStorage,
        support_level: supportLevelLabel,
        features: activeFeatures,
        is_popular: false,
        status: "active",
      };

      // Check if there is an existing plan to update rather than creating a new one:
      const existingPlan =
        (selectedPlanId && selectedPlanId !== "custom" && selectedPlanId !== -1
          ? availablePlans.find((p) => String(p.id) === String(selectedPlanId))
          : null) ||
        (officeToEdit?.planId && officeToEdit.planId !== -1
          ? availablePlans.find((p) => String(p.id) === String(officeToEdit.planId))
          : null) ||
        availablePlans.find(
          (p) =>
            p.name === cleanPlanName ||
            p.name === customPlanName.trim() ||
            (officeToEdit?.plan && p.name === officeToEdit.plan)
        );

      const existingPlanId = existingPlan?.id ?? officeToEdit?.planId;
      const isUpdatingExistingPlan =
        existingPlanId !== undefined && existingPlanId !== null && existingPlanId !== -1 && existingPlanId !== "custom";

      const planIdToUse = isUpdatingExistingPlan ? String(existingPlanId) : `plan-cst-${Date.now()}`;

      let createdPricingPlanItem: PricingPlanItem = {
        id: planIdToUse,
        name: cleanPlanName,
        code: `CODE: PLAN-CST-${String(Date.now()).slice(-4)}`,
        description: planPayload.description,
        badge: "باقة مخصصة",
        badgeColor: "#d97706",
        type: "paid",
        monthlyPrice: numMonthly,
        annualPrice: numYearly,
        yearlyDiscountPercent: calculatedDiscount || undefined,
        annualNote: `تدفع سنوياً أو شهرياً بموجب فاتورة إلكترونية (${Math.round(numYearly / 12)} ر.س / شهرياً)`,
        subscribedFirmsCount: 1,
        sharePercentage: "100%",
        isActive: true,
        isPopular: false,
        limits: {
          lawyers: numLawyers === -1 ? "غير محدود: المحامين" : `${numLawyers} محامين ومستشارين`,
          cases: numCases === -1 ? "غير محدود: القضايا" : `${numCases} قضية نشطة`,
          agents: numAgents === -1 ? "غير محدود: الوكلاء" : `${numAgents} وكلاء شرعيين`,
          assistants: numAssistants === -1 ? "غير محدود: المساعدين" : `${numAssistants} مساعدين إداريين`,
          clients: numClients === -1 ? "غير محدود: العملاء" : `${numClients} عميل وموكل`,
          storage: numStorage === -1 ? "غير محدود: التخزين" : `${numStorage} GB مساحة تخزين سحابية`,
          support: supportLevelLabel,
        },
        features: [
          { id: "1", title: "الربط التلقائي المباشر مع منصة ناجز ووزارة العدل", isIncluded: customNajizIntegration },
          { id: "2", title: "الفوترة الإلكترونية المتوافقة مع هيئة الزكاة والضريبة (ZATCA Phase 2)", isIncluded: customZatcaPhase2 },
          { id: "3", title: "تقارير مؤشرات الأداء والتحليلات القضائية", isIncluded: customKpiReports },
          { id: "4", title: "مدير حساب استشاري مخصص", isIncluded: customDedicatedManager },
          { id: "5", title: "تكامل واجهة البرمجة (Custom API Integration)", isIncluded: customApiIntegration },
          { id: "6", title: "دعم مباشر ذو أولوية فائقة (VIP)", isIncluded: customVipSupport },
        ],
      };

      try {
        if (isUpdatingExistingPlan) {
          const apiRes = await updatePlan(existingPlanId, planPayload);
          finalPlanId = existingPlanId;
          const mapped = mapPlanFromApi(
            ((apiRes as { data?: Record<string, unknown> })?.data || apiRes) as Record<string, unknown>
          );
          if (mapped) {
            createdPricingPlanItem = { ...createdPricingPlanItem, ...mapped, id: String(existingPlanId) };
          }
        } else {
          const apiRes = await createPlan(planPayload);
          const mapped = mapPlanFromApi(
            ((apiRes as { data?: Record<string, unknown> })?.data || apiRes) as Record<string, unknown>
          );
          if (mapped?.id) {
            createdPricingPlanItem = { ...createdPricingPlanItem, ...mapped };
            finalPlanId = mapped.id;
          } else {
            finalPlanId = planIdToUse;
          }
        }
      } catch (err) {
        console.warn("Plan API sync fallback:", err);
        finalPlanId = planIdToUse;
      }

      // Always save to local storage with old ID/name cleanup so it syncs immediately without duplicates
      saveLocalCustomPlan(
        createdPricingPlanItem,
        existingPlanId,
        existingPlan?.name || officeToEdit?.plan
      );

      // Also update available plans in current view without duplicates
      setAvailablePlans((prev) => [
        {
          id: finalPlanId!,
          name: cleanPlanName,
          monthlyPrice: String(numMonthly),
          yearlyPrice: String(numYearly),
        },
        ...prev.filter(
          (p) =>
            String(p.id) !== String(finalPlanId) &&
            (!isUpdatingExistingPlan || String(p.id) !== String(existingPlanId)) &&
            p.name !== cleanPlanName &&
            (!existingPlan || p.name !== existingPlan.name)
        ),
      ]);
      setSelectedPlanId(finalPlanId!);
    } else {
      const selectedPlan = availablePlans.find((p) => String(p.id) === String(selectedPlanId));
      cleanPlanName = selectedPlan?.name || packageTier || "باقة مخصصة";
      finalPlanId = selectedPlan ? selectedPlan.id : (selectedPlanId || 1);
    }

    const customPlanDetailsObj = isCustomPlan && !isTrial ? {
      id: finalPlanId || -1,
      name: cleanPlanName,
      badge: "باقة مخصصة",
      badgeColor: "gold",
      type: "custom",
      monthlyPrice: customMonthlyPrice,
      yearlyPrice: customYearlyPrice,
      maxLawyers: customLawyersLimit === "unlimited" ? 999 : Number(customLawyersLimit) || 10,
      storageLimitGb: customStorageLimit === "unlimited" ? 999 : parseInt(customStorageLimit) || 50,
      maxCases: customCasesLimit === "unlimited" ? 9999 : Number(customCasesLimit) || 200,
      supportLevel: customSupportLevel === "vip" ? "دعم مباشر VIP" : customSupportLevel === "priority" ? "دعم ذو أولوية" : "دعم فني قياسي",
      features: [
        ...(customNajizIntegration ? ["ربط مباشر مع منصة ناجز ووزارة العدل"] : []),
        ...(customZatcaPhase2 ? ["الفوترة الإلكترونية ZATCA المرحلة 2"] : []),
        ...(customKpiReports ? ["تقارير مؤشرات الأداء والتحليلات القضائية"] : []),
        ...(customDedicatedManager ? ["مدير حساب استشاري مخصص VIP"] : []),
        ...(customApiIntegration ? ["تكامل API خاص لأنظمة ERP"] : []),
        ...(customVipSupport ? ["دعم فني فوري مخصص 24/7"] : []),
      ],
    } : undefined;

    const cleanCity = data.city ? data.city.replace("المملكة العربية السعودية - ", "").trim() : "الرياض";
    const resolvedLogoFile = logoFile || fileInputRef.current?.files?.[0] || null;

    try {
      await onSuccess(
        {
          id: officeToEdit?.id,
          name: data.firmName,
          owner: data.ownerName,
          licenseNumber: data.licenseNumber.startsWith("ترخيص عدلي: ")
            ? data.licenseNumber
            : `ترخيص عدلي: ${data.licenseNumber}`,
          email: data.email,
          phone: data.phone.startsWith("+966") ? data.phone : `+966 ${data.phone}`,
          landline: data.landline || undefined,
          address: data.address || `المملكة العربية السعودية - ${cleanCity}`,
          taxNumber: data.taxNumber || undefined,
          city: cleanCity,
          plan: cleanPlanName,
          planId: isTrial ? undefined : finalPlanId,
          planType: selectedPlanType,
          billingCycle: isTrial ? "فترة تجريبية" : billingCycle,
          autoRenew,
          planDetails: customPlanDetailsObj || officeToEdit?.planDetails,
          password: data.password && data.password !== "••••••••••••" ? data.password : undefined,
          logoFile: resolvedLogoFile,
          logoUrl: logoPreview || undefined,
          themeColor: selectedThemeColor || DEFAULT_OFFICE_THEME_COLOR,
          status: officeStatus,
        },
        isEditMode
      );
    } catch (err: unknown) {
      console.error("Save office error:", err);
      toast.error(t("حدث خطأ أثناء حفظ بيانات المنشأة، يرجى المحاولة مرة أخرى", "Failed to save office, please retry"));
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsSubmitting(false);
    }
  };

  // Smooth scroll and focus field from checklist click
  const handleFocusFieldFromBox = (fieldName: keyof OfficeFormValues) => {
    setFocusedField(fieldName);
    const el = document.querySelector(
      `[name="${fieldName}"], [data-field-name="${fieldName}"]`
    ) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  // Helper function to render error message and border class
  const getInputStateClass = (fieldName: keyof OfficeFormValues) => {
    const hasError = Boolean(errors[fieldName]);
    if (hasError) {
      return "border-[#dc2626] dark:border-[#ef4444] focus:border-[#dc2626] dark:focus:border-[#ef4444] focus:ring-1 focus:ring-[#dc2626] dark:focus:ring-[#ef4444]";
    }
    return "border-[#eae8e4] dark:border-[#422e20] hover:border-[#9c6402]/40 dark:hover:border-[#e29d38]/50 focus:border-[#9c6402] dark:focus:border-[#e29d38] focus:ring-1 focus:ring-[#9c6402] dark:focus:ring-[#e29d38]";
  };

  // =========================================================================
  // Keystroke & Input Blockers: Prevent forbidden characters from ever being typed
  // =========================================================================
  const isControlKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    return (
      e.ctrlKey ||
      e.metaKey ||
      e.altKey ||
      [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Enter",
        "Escape",
      ].includes(e.key)
    );
  };

  const blockDisallowedKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    isAllowedChar: (key: string) => boolean,
    maxLength?: number
  ) => {
    if (isControlKey(e)) return;

    // Block non-matching character immediately so it never appears in the input
    if (!isAllowedChar(e.key)) {
      e.preventDefault();
      return;
    }

    // Prevent typing beyond maxLength if no text is selected to be replaced
    if (maxLength) {
      const target = e.currentTarget;
      const hasSelection = (target.selectionEnd ?? 0) - (target.selectionStart ?? 0) > 0;
      if (!hasSelection && target.value.length >= maxLength) {
        e.preventDefault();
      }
    }
  };

  const handlePasteSanitized = (
    e: React.ClipboardEvent<HTMLInputElement>,
    fieldName: keyof OfficeFormValues,
    sanitizeFn: (raw: string) => string,
    maxLength?: number
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleaned = sanitizeFn(pastedText);
    const target = e.currentTarget;
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    let finalVal = target.value.slice(0, start) + cleaned + target.value.slice(end);
    if (maxLength && finalVal.length > maxLength) {
      finalVal = finalVal.slice(0, maxLength);
    }
    setValue(fieldName, finalVal, { shouldValidate: true, shouldTouch: true });
  };

  // Phone prefix validator: must start with 05 and digits only, max 10
  const validateNextPhoneValue = (nextVal: string): boolean => {
    if (!nextVal) return true;
    if (!/^\d*$/.test(nextVal)) return false;
    if (nextVal.length >= 1 && nextVal[0] !== "0") return false;
    if (nextVal.length >= 2 && nextVal[1] !== "5") return false;
    if (nextVal.length > 10) return false;
    return true;
  };

  const blockInvalidPhoneKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isControlKey(e)) return;
    const target = e.currentTarget;
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const normalizedKey = normalizeArabicDigits(e.key);

    // If key is not a digit, block immediately
    if (!/^\d$/.test(normalizedKey)) {
      e.preventDefault();
      return;
    }

    const nextVal = target.value.slice(0, start) + normalizedKey + target.value.slice(end);
    if (!validateNextPhoneValue(nextVal)) {
      e.preventDefault();
      return;
    }

    // If typing Arabic numeral, convert directly on keydown
    if (/[٠-٩]/.test(e.key)) {
      e.preventDefault();
      setValue("phone", nextVal, { shouldValidate: true, shouldTouch: true });
    }
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const raw = normalizeArabicDigits(e.clipboardData.getData("text")).replace(/\D/g, "");
    const target = e.currentTarget;
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const nextVal = target.value.slice(0, start) + raw + target.value.slice(end);
    if (validateNextPhoneValue(nextVal.slice(0, 10))) {
      setValue("phone", nextVal.slice(0, 10), { shouldValidate: true, shouldTouch: true });
    } else {
      toast.error("رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام");
    }
  };

  // Landline prefix validator: must start with 01[1,2,3,4,6,7] and digits only, max 10 (9 or 10 digits)
  const validateNextLandlineValue = (nextVal: string): boolean => {
    if (!nextVal) return true;
    if (!/^\d*$/.test(nextVal)) return false;
    if (nextVal.length >= 1 && nextVal[0] !== "0") return false;
    if (nextVal.length >= 2 && nextVal[1] !== "1") return false;
    if (nextVal.length >= 3 && !["1", "2", "3", "4", "6", "7"].includes(nextVal[2])) return false;
    if (nextVal.length > 10) return false;
    return true;
  };

  const blockInvalidLandlineKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isControlKey(e)) return;
    const target = e.currentTarget;
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const normalizedKey = normalizeArabicDigits(e.key);

    // If key is not a digit, block immediately
    if (!/^\d$/.test(normalizedKey)) {
      e.preventDefault();
      return;
    }

    const nextVal = target.value.slice(0, start) + normalizedKey + target.value.slice(end);
    if (!validateNextLandlineValue(nextVal)) {
      e.preventDefault();
      return;
    }

    // If typing Arabic numeral, convert directly on keydown
    if (/[٠-٩]/.test(e.key)) {
      e.preventDefault();
      setValue("landline", nextVal, { shouldValidate: true, shouldTouch: true });
    }
  };

  const handleLandlinePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const raw = normalizeArabicDigits(e.clipboardData.getData("text")).replace(/\D/g, "");
    const target = e.currentTarget;
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? target.value.length;
    const nextVal = target.value.slice(0, start) + raw + target.value.slice(end);
    if (validateNextLandlineValue(nextVal.slice(0, 10))) {
      setValue("landline", nextVal.slice(0, 10), { shouldValidate: true, shouldTouch: true });
    } else {
      toast.error("الهاتف المكتبي يجب أن يبدأ بـ 011 أو 012 أو 013 أو 014 أو 016 أو 017 ويتكون من 9 أو 10 أرقام");
    }
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
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="bg-white dark:bg-[#221812] rounded-[8px] p-5 sm:p-6 md:p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] flex flex-col gap-6 sm:gap-8 w-full"
      >
        {/* ======================================================== */}
        {/* SECTION 1: بيانات المكتب والمنشأة القانونية */}
        {/* ======================================================== */}
        <div className="flex flex-col gap-[16px] w-full" data-node-id="1:1433">
          {/* Section Header Bar */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-1">
            {/* 1. اسم صاحب المكتب */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                اسم صاحب المكتب <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={30}
                  {...register("ownerName", {
                    onChange: (e) => {
                      const clean = e.target.value.replace(/[^\u0621-\u064Aa-zA-Z ]/g, "").slice(0, 30);
                      setValue("ownerName", clean, { shouldValidate: true });
                    },
                  })}
                  onKeyDown={(e) =>
                    blockDisallowedKey(e, (k) => /^[\u0621-\u064Aa-zA-Z ]$/.test(k), 30)
                  }
                  onPaste={(e) =>
                    handlePasteSanitized(e, "ownerName", (t) => t.replace(/[^\u0621-\u064Aa-zA-Z ]/g, ""), 30)
                  }
                  onFocus={() => setFocusedField("ownerName")}
                  className={cn(
                    "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none transition-colors border",
                    getInputStateClass("ownerName")
                  )}
                  placeholder="أدخل الاسم الكامل لصاحب المكتب أو المحامي المسؤول (مثال: عبد العزيز فهد العجلان)"
                />
                <User className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.ownerName && (
                <p className="text-[12px] text-[#dc2626] dark:text-[#f87171] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="inline-block size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171]" />
                  {errors.ownerName.message}
                </p>
              )}
            </div>

            {/* 2. اسم المكتب أو الشركة المهنية */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                اسم المكتب أو الشركة المهنية <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={40}
                  {...register("firmName", {
                    onChange: (e) => {
                      const clean = e.target.value.replace(/[^\u0621-\u064Aa-zA-Z ]/g, "").slice(0, 40);
                      setValue("firmName", clean, { shouldValidate: true });
                    },
                  })}
                  onKeyDown={(e) =>
                    blockDisallowedKey(e, (k) => /^[\u0621-\u064Aa-zA-Z ]$/.test(k), 40)
                  }
                  onPaste={(e) =>
                    handlePasteSanitized(e, "firmName", (t) => t.replace(/[^\u0621-\u064Aa-zA-Z ]/g, ""), 40)
                  }
                  onFocus={() => setFocusedField("firmName")}
                  className={cn(
                    "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none transition-colors border",
                    getInputStateClass("firmName")
                  )}
                  placeholder="أدخل الاسم التجاري المعتمد للمكتب أو الشركة (مثال: شركة العجلان للمحاماة)"
                />
                <Building2 className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.firmName && (
                <p className="text-[12px] text-[#dc2626] dark:text-[#f87171] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="inline-block size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171]" />
                  {errors.firmName.message}
                </p>
              )}
            </div>

            {/* 3. رقم الترخيص العدلي */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                رقم الترخيص العدلي <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  maxLength={15}
                  style={{ textAlign: "right", direction: "ltr" }}
                  {...register("licenseNumber", {
                    onChange: (e) => {
                      const clean = normalizeArabicDigits(e.target.value)
                        .replace(/[^\d/]/g, "")
                        .slice(0, 15);
                      setValue("licenseNumber", clean, { shouldValidate: true });
                    },
                  })}
                  onKeyDown={(e) =>
                    blockDisallowedKey(e, (k) => /^[\d/٠-٩]$/.test(k), 15)
                  }
                  onPaste={(e) =>
                    handlePasteSanitized(
                      e,
                      "licenseNumber",
                      (t) => normalizeArabicDigits(t).replace(/[^\d/]/g, ""),
                      15
                    )
                  }
                  onFocus={() => setFocusedField("licenseNumber")}
                  className={cn(
                    "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] pr-[40px] pl-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none !text-right font-mono transition-colors border",
                    getInputStateClass("licenseNumber")
                  )}
                  placeholder="38/412"
                />
                <Scale className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.licenseNumber && (
                <p className="text-[12px] text-[#dc2626] dark:text-[#f87171] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="inline-block size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171]" />
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>

            {/* 4. الرقم الضريبي للمنشأة (ZATCA) */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                الرقم الضريبي للمنشأة (ZATCA) <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  maxLength={15}
                  inputMode="numeric"
                  style={{ textAlign: "right", direction: "ltr" }}
                  {...register("taxNumber", {
                    onChange: (e) => {
                      const clean = normalizeArabicDigits(e.target.value)
                        .replace(/\D/g, "")
                        .slice(0, 15);
                      setValue("taxNumber", clean, { shouldValidate: true });
                    },
                  })}
                  onKeyDown={(e) =>
                    blockDisallowedKey(e, (k) => /^[\d٠-٩]$/.test(k), 15)
                  }
                  onPaste={(e) =>
                    handlePasteSanitized(
                      e,
                      "taxNumber",
                      (t) => normalizeArabicDigits(t).replace(/\D/g, ""),
                      15
                    )
                  }
                  onFocus={() => setFocusedField("taxNumber")}
                  className={cn(
                    "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] pr-[40px] pl-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none !text-right font-mono transition-colors border",
                    getInputStateClass("taxNumber")
                  )}
                  placeholder="301298457200003"
                />
                <Hash className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.taxNumber && (
                <p className="text-[12px] text-[#dc2626] dark:text-[#f87171] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="inline-block size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171]" />
                  {errors.taxNumber.message}
                </p>
              )}
            </div>

            {/* 5. البريد الإلكتروني الرسمي */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                البريد الإلكتروني الرسمي للمكتب <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  maxLength={254}
                  {...register("email", {
                    onChange: (e) => {
                      const clean = e.target.value.replace(/\s/g, "").slice(0, 254);
                      setValue("email", clean, { shouldValidate: true });
                    },
                  })}
                  onKeyDown={(e) =>
                    blockDisallowedKey(e, (k) => k !== " ", 254)
                  }
                  onPaste={(e) =>
                    handlePasteSanitized(e, "email", (t) => t.replace(/\s/g, ""), 254)
                  }
                  onFocus={() => setFocusedField("email")}
                  className={cn(
                    "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none text-start transition-colors border font-sans",
                    getInputStateClass("email")
                  )}
                  placeholder="info@lawfirm.sa"
                />
                <Mail className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Email Typo Correction Suggestion */}
              {emailSuggestion && (
                <div className="mt-1 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-[4px] text-[12px] animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>
                      هل تقصد <strong className="font-mono dir-ltr inline-block underline">{emailSuggestion}</strong>؟
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setValue("email", emailSuggestion, { shouldValidate: true, shouldTouch: true });
                      toast.info(`تم تصحيح البريد الإلكتروني إلى: ${emailSuggestion}`);
                    }}
                    className="bg-[#9c6402] hover:bg-[#855402] text-white px-2.5 py-0.5 rounded-[3px] text-[11px] font-bold transition-colors cursor-pointer shrink-0"
                  >
                    تصحيح
                  </button>
                </div>
              )}

              {errors.email && (
                <p className="text-[12px] text-[#dc2626] dark:text-[#f87171] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="inline-block size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171]" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* 6. رقم الجوال / الهاتف للتواصل */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                رقم الجوال للتواصل <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="flex items-center gap-[8px]">
                <div className="relative flex-1">
                  <input
                    type="tel"
                    dir="ltr"
                    maxLength={10}
                    inputMode="numeric"
                    style={{ textAlign: "right", direction: "ltr" }}
                    {...register("phone", {
                      onChange: (e) => {
                        const clean = normalizeArabicDigits(e.target.value).replace(/\D/g, "").slice(0, 10);
                        if (validateNextPhoneValue(clean)) {
                          setValue("phone", clean, { shouldValidate: true });
                        } else {
                          const validPrefix = clean.startsWith("05") ? clean : clean.startsWith("0") ? "0" : "";
                          setValue("phone", validPrefix, { shouldValidate: true });
                        }
                      },
                    })}
                    onKeyDown={blockInvalidPhoneKey}
                    onPaste={handlePhonePaste}
                    onFocus={() => setFocusedField("phone")}
                    className={cn(
                      "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] pr-[40px] pl-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none !text-right font-mono transition-colors border",
                      getInputStateClass("phone")
                    )}
                    placeholder="0512345678"
                  />
                  <Phone className="size-[14px] text-[#837565] dark:text-[#a89f91] absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div
                  dir="ltr"
                  className="bg-[#eae8e4] dark:bg-[#2c1e15] border border-[#ded5c6] dark:border-[#523b2c] h-[44px] px-[12px] rounded-[6px] flex items-center justify-center text-[12px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] shrink-0"
                >
                  +966 🇸🇦
                </div>
              </div>
              {errors.phone && (
                <p className="text-[12px] text-[#dc2626] dark:text-[#f87171] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="inline-block size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171]" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* 7. الهاتف المكتبي الثابت */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                الهاتف المكتبي المباشر (الثابت) <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  maxLength={10}
                  inputMode="numeric"
                  style={{ textAlign: "right", direction: "ltr" }}
                  {...register("landline", {
                    onChange: (e) => {
                      const clean = normalizeArabicDigits(e.target.value).replace(/\D/g, "").slice(0, 10);
                      if (validateNextLandlineValue(clean)) {
                        setValue("landline", clean, { shouldValidate: true });
                      } else {
                        let validPrefix = "";
                        if (/^01[123467]/.test(clean)) validPrefix = clean;
                        else if (clean.startsWith("01")) validPrefix = "01";
                        else if (clean.startsWith("0")) validPrefix = "0";
                        setValue("landline", validPrefix, { shouldValidate: true });
                      }
                    },
                  })}
                  onKeyDown={blockInvalidLandlineKey}
                  onPaste={handleLandlinePaste}
                  onFocus={() => setFocusedField("landline")}
                  className={cn(
                    "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] pr-[40px] pl-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none !text-right font-mono transition-colors border",
                    getInputStateClass("landline")
                  )}
                  placeholder="0114829900"
                />
                <PhoneCall className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.landline && (
                <p className="text-[12px] text-[#dc2626] dark:text-[#f87171] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="inline-block size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171]" />
                  {errors.landline.message}
                </p>
              )}
            </div>

            {/* 8. المدينة / المقر الرئيسي (SEARCHABLE COMBOBOX) */}
            <div className="flex flex-col gap-[6px] text-start relative" ref={cityDropdownRef}>
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                المدينة / المقر الرئيسي <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>

              {/* Combobox Trigger Button */}
              <div
                tabIndex={0}
                role="combobox"
                aria-expanded={isCityDropdownOpen}
                aria-haspopup="listbox"
                onClick={() => {
                  setIsCityDropdownOpen(!isCityDropdownOpen);
                  setFocusedField("city");
                }}
                onFocus={() => setFocusedField("city")}
                className={cn(
                  "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] ps-[38px] pe-[36px] text-[14px] flex items-center justify-between cursor-pointer transition-colors border select-none relative",
                  getInputStateClass("city"),
                  watchedValues.city
                    ? "text-[#1b1c1a] dark:text-[#fdfbf7] font-medium"
                    : "text-[#837565] dark:placeholder:text-[#9e9286]"
                )}
              >
                <MapPin className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
                <span className="truncate">
                  {watchedValues.city
                    ? `المملكة العربية السعودية - ${watchedValues.city}`
                    : "اختر أو ابحث عن المدينة / المقر الرئيسي..."}
                </span>
                <ChevronDown
                  className={cn(
                    "size-[16px] text-[#837565] dark:text-[#a89f91] absolute end-[14px] top-1/2 -translate-y-1/2 transition-transform duration-200 pointer-events-none",
                    isCityDropdownOpen && "rotate-180"
                  )}
                />
              </div>

              {/* Hidden input for register accessibility & form submission */}
              <input type="hidden" {...register("city")} />

              {/* Dropdown Popover */}
              {isCityDropdownOpen && (
                <div className="absolute top-[calc(100%+4px)] start-0 end-0 z-50 bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] rounded-[6px] shadow-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                  {/* Search input header */}
                  <div className="p-2 border-b border-[#eae8e4] dark:border-[#422e20] bg-[#f5f3ef] dark:bg-[#160e0a] relative">
                    <input
                      type="text"
                      autoFocus
                      value={citySearchTerm}
                      onChange={(e) => setCitySearchTerm(e.target.value)}
                      placeholder="ابحث عن اسم المدينة أو المحافظة..."
                      className="w-full h-[36px] bg-white dark:bg-[#1f150f] border border-[#ded5c6] dark:border-[#523b2c] rounded-[4px] ps-[32px] pe-[10px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38]"
                    />
                    <Search className="size-[14px] text-[#837565] dark:text-[#a89f91] absolute start-[18px] top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* List of cities */}
                  <div className="max-h-[220px] overflow-y-auto divide-y divide-[#f5f3ef] dark:divide-[#261911]">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((cityName) => {
                        const isSelected = watchedValues.city === cityName;
                        return (
                          <div
                            key={cityName}
                            onClick={() => {
                              setValue("city", cityName, {
                                shouldValidate: true,
                                shouldTouch: true,
                              });
                              setIsCityDropdownOpen(false);
                              setCitySearchTerm("");
                            }}
                            className={cn(
                              "px-[14px] py-[9px] text-[13px] flex items-center justify-between cursor-pointer transition-colors",
                              isSelected
                                ? "bg-[#9c6402]/10 dark:bg-[#e29d38]/15 text-[#9c6402] dark:text-[#e29d38] font-bold"
                                : "text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#2c1e15]"
                            )}
                          >
                            <span>{cityName}</span>
                            {isSelected && (
                              <Check className="size-[14px] text-[#9c6402] dark:text-[#e29d38] stroke-[3]" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-[12px] text-[#837565] dark:text-[#a89f91]">
                        لم يتم العثور على مدينة تطابق بحثك
                      </div>
                    )}
                  </div>
                </div>
              )}

              {errors.city && (
                <p className="text-[12px] text-[#dc2626] dark:text-[#f87171] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="inline-block size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171]" />
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* 9. العنوان الوطني / مقر المكتب الرئيسي */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                العنوان الوطني / مقر المكتب الرئيسي <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={30}
                  {...register("address", {
                    onChange: (e) => {
                      const clean = e.target.value.slice(0, 30);
                      setValue("address", clean, { shouldValidate: true });
                    },
                  })}
                  onKeyDown={(e) => blockDisallowedKey(e, () => true, 30)}
                  onPaste={(e) => handlePasteSanitized(e, "address", (t) => t, 30)}
                  onFocus={() => setFocusedField("address")}
                  className={cn(
                    "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] ps-[38px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none transition-colors border",
                    getInputStateClass("address")
                  )}
                  placeholder="طريق الملك فهد، حي الصحافة، برج النخبة"
                />
                <MapPin className="size-[15px] text-[#837565] dark:text-[#a89f91] absolute start-[14px] top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.address && (
                <p className="text-[12px] text-[#dc2626] dark:text-[#f87171] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="inline-block size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171]" />
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* 10. كلمة المرور الأولية للحساب (بجانب العنوان الوطني) */}
            <div className="flex flex-col gap-[6px] text-start">
              <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                كلمة المرور الأولية للحساب <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  maxLength={20}
                  {...register("password", {
                    onChange: (e) => {
                      const clean = e.target.value.replace(/\s/g, "").slice(0, 20);
                      setValue("password", clean, { shouldValidate: true });
                    },
                  })}
                  onKeyDown={(e) =>
                    blockDisallowedKey(e, (k) => k !== " ", 20)
                  }
                  onPaste={(e) =>
                    handlePasteSanitized(e, "password", (t) => t.replace(/\s/g, ""), 20)
                  }
                  onFocus={() => setFocusedField("password")}
                  className={cn(
                    "w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] ps-[40px] pe-[14px] text-[14px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#9e9286] focus:outline-none direction-ltr text-start font-mono transition-colors border",
                    getInputStateClass("password")
                  )}
                  placeholder="أدخل كلمة مرور (من 9 إلى 20 خانة تحتوي على حرف ورقم ورمز)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute start-[12px] top-1/2 -translate-y-1/2 text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] p-1 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="size-[15px]" /> : <Eye className="size-[15px]" />}
                </button>
              </div>

              {errors.password && (
                <p className="text-[12px] text-[#dc2626] dark:text-[#f87171] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
                  <span className="inline-block size-1.5 rounded-full bg-[#dc2626] dark:bg-[#f87171]" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 11. حالة نشاط المكتب */}
            <div className="flex flex-col gap-[6px] text-start">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("حالة نشاط المكتب", "Office Activity Status")} <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
                </label>
                <span
                  className={cn(
                    "text-[10px] font-bold px-[8px] py-[1.5px] rounded-full border inline-flex items-center gap-1.5 transition-colors",
                    officeStatus === "active"
                      ? "bg-[#e8f5e9] dark:bg-[#132c1c] text-[#1b7340] dark:text-[#6ee7b7] border-[#c8e6c9] dark:border-emerald-500/40"
                      : "bg-[#fef2f2] dark:bg-[#2c1313] text-[#dc2626] dark:text-[#f87171] border-[#fecaca] dark:border-red-500/40"
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full shrink-0",
                      officeStatus === "active"
                        ? "bg-[#1b7340] dark:bg-[#10b981]"
                        : "bg-[#dc2626] dark:bg-[#ef4444]"
                    )}
                  />
                  {officeStatus === "active" ? t("نشط", "Active") : t("غير نشط", "Inactive")}
                </span>
              </div>
              <div className="w-full h-[44px] bg-[#f5f3ef] dark:bg-[#160e0a] rounded-[6px] p-1 border border-[#eae8e4] dark:border-[#38271c] grid grid-cols-2 gap-1.5 items-center">
                <button
                  type="button"
                  onClick={() => setOfficeStatus("active")}
                  className={cn(
                    "h-full rounded-[4px] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none",
                    officeStatus === "active"
                      ? "bg-white dark:bg-[#1f150f] text-[#1b7340] dark:text-[#6ee7b7] shadow-xs border border-[#c8e6c9] dark:border-emerald-500/40"
                      : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                  )}
                >
                  <CheckCircle2 className="size-[15px]" />
                  <span>{t("نشط", "Active")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOfficeStatus("inactive")}
                  className={cn(
                    "h-full rounded-[4px] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none",
                    officeStatus === "inactive"
                      ? "bg-white dark:bg-[#1f150f] text-[#dc2626] dark:text-[#f87171] shadow-xs border border-[#fecaca] dark:border-red-500/40"
                      : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                  )}
                >
                  <XCircle className="size-[15px]" />
                  <span>{t("غير نشط", "Inactive")}</span>
                </button>
              </div>
            </div>

            {/* 12. لون هوية المكتب (باليت الألوان) */}
            <div className="flex flex-col gap-[6px] text-start">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {t("لون هوية المكتب (باليت الألوان)", "Firm Brand Color Palette")} <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
                </label>
                <span className="text-[10px] font-bold px-[8px] py-[1.5px] rounded-full border border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#1f150f] text-[#514537] dark:text-[#cdc5bd] uppercase font-mono">
                  {selectedThemeColor}
                </span>
              </div>
              <OfficeColorPalettePicker
                value={selectedThemeColor}
                onChange={setSelectedThemeColor}
                firmName={watch("firmName") || officeToEdit?.name || t("مكتب المحاماة", "Law Firm")}
                className="w-full"
              />
            </div>
          </div>

          {/* Identity / Logo Upload Area */}
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
        {/* SECTION 2: بيانات الاشتراك السحابي + بوكس الفاليديشن */}
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
                  بيانات الاشتراك السحابي
                </h2>
                <p className="text-[12px] text-[#514537] dark:text-[#d5cec5] leading-[18px]">
                  تحديد باقة الاشتراك المفعلة للمكتب ودورة الفوترة والتحصيل وخيارات التجديد
                </p>
              </div>
            </div>

            <span className="bg-[#eae8e4] dark:bg-[#2c1e15] text-[#514537] dark:text-[#f0e6dc] border border-[#ded5c6] dark:border-[#523b2c] text-[10px] font-bold px-[8px] py-[3px] rounded-[2px]">
              الاشتراك والفوترة
            </span>
          </div>

          {/* ======================================================== */}
          {/* RESPONSIVE ROW: Subscription Types & Plans (Left) + Validation Box (Right) */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-[6px]">
            {/* Left Column (Desktop 7 cols): Subscription Type, Packages, Billing Details */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Subscription Plan Radio Cards */}
              <div className="flex flex-col gap-[8px] text-start">
                <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  نوع وخطة الاشتراك <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: باقة مدفوعة (Selected) */}
                  <div
                    onClick={() => {
                      setSelectedPlanType("paid");
                    }}
                    className={`rounded-[8px] p-[14px] flex flex-col gap-[8px] cursor-pointer transition-all border ${
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
                          <span className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[20px]">
                            باقة مدفوعة
                          </span>
                          <span className="text-[11px] text-[#514537] dark:text-[#d5cec5] leading-[15px]">
                            تفعيل فوري لكافة مزايا النظام
                          </span>
                        </div>
                      </div>

                      <span className="bg-[#9c6402]/15 dark:bg-[#e29d38]/20 text-[#9c6402] dark:text-[#e29d38] text-[10px] font-bold px-[8px] py-[2px] rounded-[2px]">
                        فوري
                      </span>
                    </div>

                    <div className="bg-white/80 dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] rounded-[4px] px-[8px] py-[5px] flex items-center justify-between text-[11px] font-bold text-[#514537] dark:text-[#d5cec5]">
                      <span>وصول كامل لكافة القضايا</span>
                      <FileCheck className="size-[13px] text-[#9c6402] dark:text-[#e29d38]" />
                    </div>
                  </div>

                  {/* Card 2: تجربة مجانية */}
                  <div
                    onClick={() => {
                      setSelectedPlanType("trial");
                    }}
                    className={`rounded-[8px] p-[14px] flex flex-col gap-[8px] cursor-pointer transition-all border ${
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
                          <span className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-[20px]">
                            تجربة مجانية
                          </span>
                          <span className="text-[11px] text-[#514537] dark:text-[#d5cec5] leading-[15px]">
                            فترة استكشافية لاختبار المنظومة
                          </span>
                        </div>
                      </div>

                      <span className="bg-[#eae8e4] dark:bg-[#2c1e15] text-[#514537] dark:text-[#f0e6dc] border border-[#ded5c6] dark:border-[#523b2c] text-[10px] font-semibold px-[8px] py-[2px] rounded-[2px]">
                        ١٤ يوماً
                      </span>
                    </div>

                    <div className="bg-white/80 dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] rounded-[4px] px-[8px] py-[5px] flex items-center justify-between text-[11px] font-bold text-[#514537] dark:text-[#d5cec5]">
                      <span>إمكانية إضافة 3 محامين</span>
                      <Hourglass className="size-[13px] text-[#837565] dark:text-[#a89f91]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier & Billing Configuration Details */}
              <div className="bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#422e20] rounded-[8px] p-[16px] flex flex-col gap-[14px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
                  {/* الباقة المعتمدة */}
                  <div className="flex flex-col gap-[6px] text-start">
                    <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("الباقة المعتمدة", "Approved Plan")}
                    </label>
                    <DashboardSelect
                      aria-label={t("الباقة المعتمدة", "Approved Plan")}
                      disabled={isTrial}
                      value={isTrial ? "trial" : isCustomPlan ? "custom" : String(selectedPlanId)}
                      placeholder={
                        isTrial
                          ? t("فترة تجريبية مجانية (14 يوماً)", "14-Day Free Trial")
                          : isCustomPlan
                          ? t("باقة مخصصة لهذا المكتب", "Custom Plan")
                          : packageTier || (availablePlans.length > 0 ? t("اختر الباقة المعتمدة...", "Select approved plan...") : t("باقة مخصصة لهذا المكتب", "Custom Plan"))
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "custom" || val === "") {
                          setIsCustomPlan(true);
                          setSelectedPlanId("custom");
                          setPackageTier("باقة مخصصة");
                          return;
                        }
                        setIsCustomPlan(false);
                        setSelectedPlanId(val);
                        const found = availablePlans.find((p) => String(p.id) === String(val));
                        if (found) {
                          setPackageTier(found.name);
                        }
                      }}
                      className={cn(
                        "bg-white dark:bg-[#1f150f] border-[#eae8e4] dark:border-[#422e20] h-[42px] rounded-[6px]",
                        isTrial && "opacity-60 cursor-not-allowed bg-[#eae8e4]/50 dark:bg-[#20150e]/50"
                      )}
                    >
                      {isTrial ? (
                        <option value="trial">
                          {t("فترة تجريبية مجانية (14 يوماً - غير مفعلة للفوترة)", "Free Trial (14 Days - Non-billing)")}
                        </option>
                      ) : (
                        <>
                          {availablePlans.length > 0 ? (
                            availablePlans.map((p) => (
                              <option key={p.id} value={String(p.id)}>
                                {p.name} ({Number(p.monthlyPrice).toLocaleString("ar-SA")} ر.س / شهرياً)
                              </option>
                            ))
                          ) : (
                            <option value="" disabled className="text-[#837565] dark:text-[#a89f91]">
                              {t("لا توجد باقات عامة معرفة في تاب الباقات", "No public plans in plans tab")}
                            </option>
                          )}
                          <option value="custom" className="font-bold text-[#9c6402] dark:text-[#c29547]">
                            ✨ {t("باقة مخصصة لهذا المكتب (اتفاق وشروط خاصة / إنشاء باقة)", "Custom Plan for this client (create new)")}
                          </option>
                        </>
                      )}
                    </DashboardSelect>
                    <span className={cn("text-[11px]", isTrial ? "text-[#9c6402] dark:text-[#c29547] font-medium" : "text-[#514537] dark:text-[#d5cec5]")}>
                      {isTrial
                        ? t("غير متاحة في التجربة المجانية — يتم تحديد باقة الاشتراك عند الترقية والدفع.", "Not available in Free Trial — subscription plan is selected upon upgrade and payment.")
                        : isCustomPlan
                        ? availablePlans.length === 0
                          ? t("لا توجد باقات سابقة في تاب الباقات. قم بضبط بيانات الباقة المخصصة أدناه لتفعيلها وتسميعها مباشرة في تاب الباقات.", "No plans in plans tab. Configure custom plan below to activate and sync to plans tab.")
                          : t("تم تفعيل إعداد باقة خاصة ومخصصة لهذا المكتب بشروط وأسعار ومزايا حصرية تسمع في تاب الباقات.", "Custom plan active for this client with tailored pricing & terms synced to plans tab.")
                        : t("تشمل كافة المزايا والحدود المعتمدة لهذه الباقة في تاب الباقات.", "Includes all approved features and limits for this plan in the plans tab.")}
                    </span>
                  </div>

                  {/* دورة الفوترة والتحصيل */}
                  <div className="flex flex-col gap-[6px] text-start">
                    <label className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {t("دورة الفوترة والتحصيل", "Billing Cycle")}
                    </label>
                    <DashboardSelect
                      aria-label={t("دورة الفوترة والتحصيل", "Billing Cycle")}
                      disabled={isTrial}
                      value={isTrial ? "none" : billingCycle}
                      placeholder={isTrial ? t("بدون دورة فوترة (فترة استكشافية مجانية)", "No billing cycle (Free trial)") : undefined}
                      onChange={(e) => setBillingCycle(e.target.value)}
                      className={cn(
                        "bg-white dark:bg-[#1f150f] border-[#eae8e4] dark:border-[#422e20] h-[42px] rounded-[6px]",
                        isTrial && "opacity-60 cursor-not-allowed bg-[#eae8e4]/50 dark:bg-[#20150e]/50"
                      )}
                    >
                      {isTrial ? (
                        <option value="none">
                          {t("بدون دورة فوترة (فترة استكشافية مجانية)", "No billing cycle (Free exploratory period)")}
                        </option>
                      ) : (
                        <>
                          <option value="اشتراك سنوي (موصى به - خصم شهرين مجاناً)">
                            {t("اشتراك سنوي (موصى به - خصم شهرين)", "Annual (Recommended - 2 Months Free)")}
                          </option>
                          <option value="اشتراك شهري عادي">
                            {t("اشتراك شهري عادي", "Monthly Standard")}
                          </option>
                        </>
                      )}
                    </DashboardSelect>
                    <span className={cn("text-[11px]", isTrial ? "text-[#9c6402] dark:text-[#c29547] font-medium" : "text-[#514537] dark:text-[#d5cec5]")}>
                      {isTrial
                        ? t("لا توجد مطالبات مالية أو فواتير مستحقة خلال فترة الـ 14 يوماً.", "No financial claims or invoices due during the 14-day trial.")
                        : t("يتم احتساب الفاتورة الأولى فور التأكيد.", "First invoice is calculated upon confirmation.")}
                    </span>
                  </div>

                  {/* قسم بناء باقة مخصصة لهذا المكتب */}
                  {!isTrial && isCustomPlan && (
                    <div className="md:col-span-2 p-[16px] bg-[#9c6402]/5 dark:bg-[#e29d38]/5 border border-[#9c6402]/30 dark:border-[#e29d38]/30 rounded-[8px] flex flex-col gap-[14px] text-start transition-all">
                      <div className="flex items-center justify-between pb-[10px] border-b border-[#9c6402]/20 dark:border-[#e29d38]/20">
                        <div className="flex items-center gap-[8px]">
                          <div className="size-[28px] rounded-[6px] bg-[#9c6402]/15 dark:bg-[#e29d38]/15 flex items-center justify-center text-[#9c6402] dark:text-[#e29d38]">
                            <Sparkles className="size-[16px]" />
                          </div>
                          <div>
                            <h4 className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                              {t("تخصيص وإنشاء باقة متكاملة لهذا المكتب (تسمع في تاب الباقات)", "Custom Plan Configuration (Synced to Plans Tab)")}
                            </h4>
                            <p className="text-[11px] text-[#514537] dark:text-[#d5cec5]">
                              {t("حدد مواصفات وبيانات الباقة العادية (التسعير، المقاعد، السعة، الدعم، والمزايا) لتثبيتها في تاب الباقات وربط المكتب بها", "Define full plan specs (pricing, seats, quota, SLA, features) to sync to Plans tab")}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#9c6402] dark:text-[#e29d38] bg-[#9c6402]/10 dark:bg-[#e29d38]/10 px-[8px] py-[3px] rounded-full">
                          {t("باقة مخصصة ومعتمدة", "Custom & Approved Plan")}
                        </span>
                      </div>

                      {/* 1. Basic Plan Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[12px]">
                        {/* اسم الباقة المخصصة */}
                        <div className="flex flex-col gap-[4px]">
                          <label className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("اسم الباقة", "Plan Name")} <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
                          </label>
                          <input
                            type="text"
                            value={customPlanName}
                            onChange={(e) => setCustomPlanName(e.target.value)}
                            placeholder={t("مثال: باقة النخبة القضائية أو باقة الشركات", "e.g., Elite Legal Plan")}
                            className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[38px] px-[10px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                          />
                        </div>

                        {/* السعر الشهري */}
                        <div className="flex flex-col gap-[4px]">
                          <label className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("السعر الشهري (ر.س)", "Monthly Price (SAR)")} <span className="text-[#9c6402] dark:text-[#e29d38] font-bold">*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={customMonthlyPrice}
                            onChange={(e) => {
                              const m = e.target.value;
                              setCustomMonthlyPrice(m);
                              if (m && (!customYearlyPrice || customYearlyPrice === "0")) {
                                setCustomYearlyPrice(String(Math.round(Number(m) * 10)));
                              }
                            }}
                            className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[38px] px-[10px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                          />
                        </div>

                        {/* السعر السنوي */}
                        <div className="flex flex-col gap-[4px]">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                              {t("السعر السنوي (ر.س)", "Yearly Price (SAR)")}
                            </label>
                            {Number(customMonthlyPrice) > 0 && Number(customYearlyPrice) > 0 && (
                              <span className="text-[10px] font-bold text-[#1b7340] dark:text-[#6ee7b7]">
                                {Math.max(0, Math.round(((Number(customMonthlyPrice) * 12 - Number(customYearlyPrice)) / (Number(customMonthlyPrice) * 12)) * 100))}% {t("توفير سنوي", "Savings")}
                              </span>
                            )}
                          </div>
                          <input
                            type="number"
                            min="0"
                            value={customYearlyPrice}
                            onChange={(e) => setCustomYearlyPrice(e.target.value)}
                            className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[38px] px-[10px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                          />
                        </div>
                      </div>

                      {/* 2. Description & Support SLA */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
                        <div className="md:col-span-2 flex flex-col gap-[4px]">
                          <label className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("وصف الباقة ومجالات عملها", "Plan Description")}
                          </label>
                          <input
                            type="text"
                            value={customPlanDescription}
                            onChange={(e) => setCustomPlanDescription(e.target.value)}
                            placeholder={t("وصف شامل للباقة وما تشتمل عليه من خدمات ومقاعد للمكتب...", "Comprehensive plan description...")}
                            className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[38px] px-[10px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                          />
                        </div>

                        <div className="flex flex-col gap-[4px]">
                          <label className="text-[11px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {t("مستوى الدعم الفني (SLA)", "Support Level SLA")}
                          </label>
                          <select
                            value={customSupportLevel}
                            onChange={(e) => setCustomSupportLevel(e.target.value)}
                            className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[38px] px-[10px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                          >
                            <option value="vip">{t("دعم مباشر ذو أولوية فائقة (VIP SLA)", "VIP Direct Support")}</option>
                            <option value="priority">{t("دعم فني ذو أولوية للمكتب (خلال 4 ساعات)", "Priority Support (4h)")}</option>
                            <option value="standard">{t("دعم فني قياسي (خلال 24 ساعة)", "Standard Support (24h)")}</option>
                          </select>
                        </div>
                      </div>

                      {/* 3. Limits & Quotas (Same as normal plan) */}
                      <div className="border-t border-[#9c6402]/15 dark:border-[#e29d38]/15 pt-[10px]">
                        <span className="text-[11px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block mb-[8px]">
                          {t("حدود واستيعاب الباقة (المقاعد والمساحة)", "Plan Limits & Quotas")}
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-[10px]">
                          {/* عدد المحامين */}
                          <div className="flex flex-col gap-[3px]">
                            <label className="text-[10px] font-semibold text-[#514537] dark:text-[#d5cec5]">
                              {t("المحامون والمستشارون", "Lawyers")}
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={customLawyersLimit}
                              onChange={(e) => setCustomLawyersLimit(e.target.value)}
                              className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[34px] px-[8px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                            />
                          </div>

                          {/* عدد القضايا */}
                          <div className="flex flex-col gap-[3px]">
                            <label className="text-[10px] font-semibold text-[#514537] dark:text-[#d5cec5]">
                              {t("القضايا النشطة", "Active Cases")}
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={customCasesLimit}
                              onChange={(e) => setCustomCasesLimit(e.target.value)}
                              className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[34px] px-[8px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                            />
                          </div>

                          {/* عدد الوكلاء الشرعيين */}
                          <div className="flex flex-col gap-[3px]">
                            <label className="text-[10px] font-semibold text-[#514537] dark:text-[#d5cec5]">
                              {t("الوكلاء الشرعيون", "Legal Agents")}
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={customAgentsLimit}
                              onChange={(e) => setCustomAgentsLimit(e.target.value)}
                              className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[34px] px-[8px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                            />
                          </div>

                          {/* عدد المساعدين */}
                          <div className="flex flex-col gap-[3px]">
                            <label className="text-[10px] font-semibold text-[#514537] dark:text-[#d5cec5]">
                              {t("المساعدون الإداريون", "Assistants")}
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={customAssistantsLimit}
                              onChange={(e) => setCustomAssistantsLimit(e.target.value)}
                              className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[34px] px-[8px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                            />
                          </div>

                          {/* عدد العملاء */}
                          <div className="flex flex-col gap-[3px]">
                            <label className="text-[10px] font-semibold text-[#514537] dark:text-[#d5cec5]">
                              {t("العملاء والموكلون", "Clients")}
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={customClientsLimit}
                              onChange={(e) => setCustomClientsLimit(e.target.value)}
                              className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[34px] px-[8px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                            />
                          </div>

                          {/* المساحة السحابية */}
                          <div className="flex flex-col gap-[3px]">
                            <label className="text-[10px] font-semibold text-[#514537] dark:text-[#d5cec5]">
                              {t("المساحة السحابية (GB)", "Storage (GB)")}
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={customStorageLimit}
                              onChange={(e) => setCustomStorageLimit(e.target.value)}
                              className="bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] h-[34px] px-[8px] rounded-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] focus:outline-none focus:border-[#9c6402]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4. Features & Entitlements */}
                      <div className="border-t border-[#9c6402]/15 dark:border-[#e29d38]/15 pt-[10px]">
                        <span className="text-[11px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block mb-[8px]">
                          {t("المزايا والصلاحيات المضمنة في الباقة", "Included Features & Entitlements")}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[10px]">
                          <label className="flex items-center gap-[7px] cursor-pointer text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] bg-white/70 dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] p-[8px] rounded-[6px]">
                            <input
                              type="checkbox"
                              checked={customNajizIntegration}
                              onChange={(e) => setCustomNajizIntegration(e.target.checked)}
                              className="accent-[#9c6402] size-4 rounded"
                            />
                            <span>{t("ربط ناجز ووزارة العدل التلقائي", "Najiz & MOJ Integration")}</span>
                          </label>

                          <label className="flex items-center gap-[7px] cursor-pointer text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] bg-white/70 dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] p-[8px] rounded-[6px]">
                            <input
                              type="checkbox"
                              checked={customZatcaPhase2}
                              onChange={(e) => setCustomZatcaPhase2(e.target.checked)}
                              className="accent-[#9c6402] size-4 rounded"
                            />
                            <span>{t("فوترة ZATCA المرحلة الثانية", "ZATCA Phase 2 E-Invoicing")}</span>
                          </label>

                          <label className="flex items-center gap-[7px] cursor-pointer text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] bg-white/70 dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] p-[8px] rounded-[6px]">
                            <input
                              type="checkbox"
                              checked={customKpiReports}
                              onChange={(e) => setCustomKpiReports(e.target.checked)}
                              className="accent-[#9c6402] size-4 rounded"
                            />
                            <span>{t("تقارير مؤشرات الأداء والتحليلات (KPI)", "KPI Analytics & Reports")}</span>
                          </label>

                          <label className="flex items-center gap-[7px] cursor-pointer text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] bg-white/70 dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] p-[8px] rounded-[6px]">
                            <input
                              type="checkbox"
                              checked={customDedicatedManager}
                              onChange={(e) => setCustomDedicatedManager(e.target.checked)}
                              className="accent-[#9c6402] size-4 rounded"
                            />
                            <span>{t("مدير حساب استشاري مخصص VIP", "Dedicated VIP Manager")}</span>
                          </label>

                          <label className="flex items-center gap-[7px] cursor-pointer text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] bg-white/70 dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] p-[8px] rounded-[6px]">
                            <input
                              type="checkbox"
                              checked={customApiIntegration}
                              onChange={(e) => setCustomApiIntegration(e.target.checked)}
                              className="accent-[#9c6402] size-4 rounded"
                            />
                            <span>{t("تكامل API خاص لأنظمة ERP", "Custom ERP API Integration")}</span>
                          </label>

                          <label className="flex items-center gap-[7px] cursor-pointer text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] bg-white/70 dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] p-[8px] rounded-[6px]">
                            <input
                              type="checkbox"
                              checked={customVipSupport}
                              onChange={(e) => setCustomVipSupport(e.target.checked)}
                              className="accent-[#9c6402] size-4 rounded"
                            />
                            <span>{t("دعم فني فوري مخصص 24/7", "24/7 Dedicated Priority Support")}</span>
                          </label>
                        </div>
                      </div>

                      {/* 5. Plans Tab Sync Banner */}
                      <div className="bg-[#9c6402]/10 dark:bg-[#e29d38]/10 border border-[#9c6402]/25 dark:border-[#e29d38]/25 rounded-[6px] p-[10px] flex items-center justify-between gap-[10px]">
                        <div className="flex items-center gap-[8px]">
                          <CheckCircle2 className="size-[16px] text-[#9c6402] dark:text-[#e29d38] shrink-0" />
                          <div className="flex flex-col text-start">
                            <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                              {t("تثبيت وتسميع هذه الباقة في تاب الباقات تلقائياً", "Auto-sync and register this plan in the Plans tab")}
                            </span>
                            <span className="text-[10px] text-[#514537] dark:text-[#d5cec5]">
                              {t("عند حفظ المنشأة، سيتم إنشاء باقة معتمدة في تاب الباقات وتظهر مباشرة في قائمة الباقات للمكاتب الأخرى أيضاً.", "When saved, an approved plan will be created in Plans tab and appear for other offices.")}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-[#9c6402] dark:text-[#e29d38] bg-[#9c6402]/15 dark:bg-[#e29d38]/15 px-[8px] py-[3px] rounded">
                          {t("مفعلة وتسمع فورياً", "Live Sync Active")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* التجديد التلقائي للاشتراك */}
                  <div className="flex items-center justify-between p-[12px] bg-white dark:bg-[#1f150f] border border-[#eae8e4] dark:border-[#422e20] rounded-[6px] md:col-span-2">
                    <div className="flex items-center gap-[10px]">
                      <div className="size-[30px] rounded-[4px] bg-[#f5f3ef] dark:bg-[#281c15] flex items-center justify-center text-[#9c6402] dark:text-[#e29d38]">
                        {isTrial ? (
                          <BellRing className="size-[14px]" />
                        ) : (
                          <RefreshCw className="size-[14px]" />
                        )}
                      </div>
                      <div className="flex flex-col text-start">
                        <div className="flex items-center gap-[8px]">
                          <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            {isTrial
                              ? t("تنبيه وتذكير المكتب بالترقية قبل انتهاء التجربة", "Remind Office Before Trial Ends")
                              : t("تفعيل التجديد التلقائي للاشتراك", "Enable Auto-Renewal")}
                          </span>
                          {isTrial && (
                            <span className="text-[10px] font-semibold text-[#9c6402] dark:text-[#e29d38] bg-[#9c6402]/10 dark:bg-[#e29d38]/10 px-[6px] py-[1px] rounded-full">
                              {t("تذكير بالترقية • بدون خصم آلي", "Upgrade reminder • No auto-charge")}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#514537] dark:text-[#d5cec5]">
                          {isTrial
                            ? t(
                                "إرسال إشعار تذكيري للمكتب قبل نهاية الـ 14 يوماً لتسجيل وسيلة دفع وترقية الحساب وتجنب انقطاع الخدمة",
                                "Send reminder notice before the 14 days end to add payment and upgrade"
                              )
                            : t(
                                "تجديد الاشتراك آلياً عبر البطاقة المسجلة لتجنب انقطاع الخدمة",
                                "Auto renew using registered card"
                              )}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={autoRenew}
                      onClick={() => setAutoRenew(!autoRenew)}
                      className={cn(
                        "relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none",
                        autoRenew
                          ? "bg-[#10b981] dark:bg-[#10b981]"
                          : "bg-[#d1ccc4] dark:bg-[#38271c]"
                      )}
                      aria-label={
                        isTrial
                          ? t("تنبيه وتذكير المكتب بالترقية", "Trial reminder")
                          : t("تفعيل التجديد التلقائي للاشتراك", "Enable Auto-Renewal")
                      }
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                          autoRenew
                            ? isEn
                              ? "translate-x-5"
                              : "-translate-x-5"
                            : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* Right Column (Desktop 5 cols): THE REAL-TIME VALIDATION BOX */}
            {/* ======================================================== */}
            <div className="lg:col-span-5 w-full flex flex-col h-full">
              <RealTimeValidationBox
                fieldStatuses={fieldValidationStatuses}
                activeFieldName={focusedField || "ownerName"}
                onSelectField={handleFocusFieldFromBox}
                isShaking={isBoxShaking}
              />
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-[16px] border-t border-[#f0eeea] dark:border-[#453022] flex flex-col sm:flex-row items-center justify-between gap-[16px]">
          {/* Note */}
          <div className="flex items-center gap-[8px] text-[12px] text-[#514537] dark:text-[#d5cec5]">
            <CheckCircle2 className="size-[15px] text-[#9c6402] dark:text-[#e29d38]" />
            <span>{t("جميع الحقول العشرة إلزامية ومحمية بنظام التحقق النظامي", "All 10 fields are required and verified")}</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-[10px]">
            {submitCount > 0 && Object.keys(errors).length > 0 && (
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#dc2626] dark:text-[#f87171] bg-[#fef2f2] dark:bg-[#341616] px-3 py-1.5 rounded-[6px] border border-[#fca5a5]/70 dark:border-[#7f1d1d] animate-in fade-in duration-200">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>
                  {t(
                    "يرجى إكمال البيانات لمواصلة التسجيل",
                    "Please complete the data to continue registration"
                  )}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className={cn(
                "bg-[#f0eeea] dark:bg-[#2c1e15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-[#eae8e4] dark:border-[#523b2c] px-[24px] py-[10px] rounded-[4px] text-[14px] font-semibold transition-colors cursor-pointer",
                isSubmitting && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
            >
              {t("إلغاء", "Cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "bg-[#9c6402] hover:bg-[#855402] dark:bg-[#c29547] dark:hover:bg-[#b0833b] text-white dark:text-[#1c140f] px-[32px] py-[10px] rounded-[4px] text-[14px] font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-[8px]",
                isSubmitting && "opacity-85 cursor-wait pointer-events-none"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-[16px] animate-spin text-white dark:text-[#1c140f]" />
                  <span>
                    {isEditMode
                      ? t("جاري حفظ التعديلات...", "Saving changes...")
                      : t("جاري تأسيس المنشأة...", "Setting up office...")}
                  </span>
                </>
              ) : (
                <>
                  <span>{isEditMode ? t("حفظ التعديلات", "Save Changes") : t("إضافة المكتب", "Add Office")}</span>
                  {isEditMode ? (
                    <CheckCircle2 className="size-[15px]" />
                  ) : (
                    <Building2 className="size-[15px]" />
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ======================================================== */}
      {/* Luxury Provisioning / Processing Overlay Modal */}
      {/* ======================================================== */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-[4px] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a120d] border border-[#e8dfd5] dark:border-[#453022] rounded-[16px] p-6 sm:p-8 max-w-[460px] w-full shadow-2xl flex flex-col items-center text-center gap-5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#9c6402] via-[#e29d38] to-[#9c6402] animate-pulse" />

            {/* Branded Spinning Ring & Icon */}
            <div className="relative flex items-center justify-center size-20 rounded-full bg-[#9c6402]/10 dark:bg-[#e29d38]/10 text-[#9c6402] dark:text-[#e29d38] ring-8 ring-[#9c6402]/5 dark:ring-[#e29d38]/5">
              <Building2 className="size-9 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-[#9c6402] dark:border-[#e29d38] border-t-transparent animate-spin" />
            </div>

            {/* Headings */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[17px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEditMode
                  ? t("جاري حفظ وتحديث بيانات المكتب...", "Updating Office Data...")
                  : t("جاري تأسيس وإطلاق بيئة المكتب...", "Provisioning Office Environment...")}
              </h3>
              <p className="text-[12px] text-[#716557] dark:text-[#b0a599] leading-relaxed max-w-[360px]">
                {t(
                  "يتم الآن تدقيق السجلات، ربط الباقة السحابية، وإعداد مساحة العمل الآمنة للمنشأة. نرجو عدم إغلاق الصفحة.",
                  "Verifying records, connecting cloud plan, and configuring secure legal workspace. Please do not close this page."
                )}
              </p>
            </div>

            {/* Stages Tracker */}
            <div className="w-full bg-[#fbf9f6] dark:bg-[#221711] border border-[#f0ece5] dark:border-[#38271c] rounded-[10px] p-3.5 flex flex-col gap-2.5 text-start">
              {/* Stage 1 */}
              <div className="flex items-center gap-2.5 text-[12px]">
                <div
                  className={cn(
                    "size-5 rounded-full flex items-center justify-center shrink-0 transition-all",
                    submitStage >= 1
                      ? "bg-[#10b981] text-white"
                      : "bg-[#eae8e4] dark:bg-[#38271c] text-[#716557]"
                  )}
                >
                  <Check className="size-3" />
                </div>
                <span
                  className={cn(
                    "font-medium",
                    submitStage >= 1
                      ? "text-[#1b1c1a] dark:text-[#fdfbf7]"
                      : "text-[#8d8071] dark:text-[#6b5f54]"
                  )}
                >
                  {t("مطابقة وتدقيق بيانات المنشأة مع السجل العدلي", "Verifying office credentials & license")}
                </span>
              </div>

              {/* Stage 2 */}
              <div className="flex items-center gap-2.5 text-[12px]">
                <div
                  className={cn(
                    "size-5 rounded-full flex items-center justify-center shrink-0 transition-all",
                    submitStage >= 2
                      ? "bg-[#10b981] text-white"
                      : "bg-[#9c6402] text-white animate-pulse"
                  )}
                >
                  {submitStage >= 2 ? (
                    <Check className="size-3" />
                  ) : (
                    <Loader2 className="size-3 animate-spin" />
                  )}
                </div>
                <span
                  className={cn(
                    "font-medium",
                    submitStage >= 2
                      ? "text-[#1b1c1a] dark:text-[#fdfbf7]"
                      : "text-[#8d8071] dark:text-[#6b5f54]"
                  )}
                >
                  {t("تجهيز ورفع وسائط وشعار المنشأة", "Uploading logo & media assets")}
                </span>
              </div>

              {/* Stage 3 */}
              <div className="flex items-center gap-2.5 text-[12px]">
                <div
                  className={cn(
                    "size-5 rounded-full flex items-center justify-center shrink-0 transition-all",
                    submitStage >= 3
                      ? "bg-[#10b981] text-white"
                      : submitStage === 2
                      ? "bg-[#9c6402] text-white animate-pulse"
                      : "bg-[#eae8e4] dark:bg-[#38271c] text-[#716557]"
                  )}
                >
                  {submitStage >= 3 ? (
                    <Check className="size-3" />
                  ) : (
                    <Loader2 className="size-3 animate-spin" />
                  )}
                </div>
                <span
                  className={cn(
                    "font-medium",
                    submitStage >= 3
                      ? "text-[#1b1c1a] dark:text-[#fdfbf7]"
                      : "text-[#8d8071] dark:text-[#6b5f54]"
                  )}
                >
                  {t("تأسيس الخادم السحابي وتفعيل رخص المنظومة", "Provisioning cloud server & activating licenses")}
                </span>
              </div>
            </div>

            {/* Smooth Dynamic Progress Bar */}
            <div className="w-full flex flex-col gap-1.5">
              <div className="w-full h-2 bg-[#eae8e4] dark:bg-[#38271c] rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-gradient-to-r from-[#9c6402] via-[#e29d38] to-[#9c6402] rounded-full transition-all duration-700 ease-out",
                    submitStage === 1 && "w-[35%]",
                    submitStage === 2 && "w-[70%]",
                    submitStage >= 3 && "w-[94%]"
                  )}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#716557] dark:text-[#b0a599] font-medium">
                <span>{t("جاري المعالجة الآمنة عبر خوادم الجودي...", "Processing securely via Al-Joudi servers...")}</span>
                <span>{submitStage === 1 ? "35%" : submitStage === 2 ? "70%" : "95%"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
