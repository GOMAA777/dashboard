"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Laptop,
  Tablet,
  Check,
  RotateCcw,
  Camera,
  Calendar,
  MapPin,
  Building2,
  Phone,
  Eye,
  EyeOff,
  Clock,
  LogOut,
  Send,
  Bell,
  CheckCircle2,
  AlertCircle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import userAvatarImg from "../../../../public/figma/user-avatar.png";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import { DashboardTopNavbar } from "@/features/dashboard/components/DashboardTopNavbar";
import { DashboardPageTransition } from "@/components/shared/DashboardPageTransition";
import { DashboardStickyActionBar } from "@/components/shared/DashboardStickyActionBar";
import { initialProfileData, initialActiveSessions } from "../data/initialProfile";
import { UserProfileData, ActiveSessionItem } from "../types/profile.types";

type ProfileTab = "personal" | "email" | "security" | "sessions";

export function ProfileView() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [formData, setFormData] = useState<UserProfileData>(initialProfileData);
  const [sessions, setSessions] = useState<ActiveSessionItem[]>(initialActiveSessions);

  // Email update state
  const [newEmail, setNewEmail] = useState("");
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Save handler
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("تم حفظ تحديثات الملف الشخصي بنجاح");
    }, 600);
  };

  // Reset handler
  const handleReset = () => {
    setFormData(initialProfileData);
    setNewEmail("");
    setEmailVerificationCode("");
    setIsCodeSent(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.info("تم التراجع عن التعديلات غير المحفوظة");
  };

  // Send verification code handler
  const handleSendVerificationCode = () => {
    if (!newEmail.trim() || !newEmail.includes("@")) {
      toast.error("يرجى إدخال بريد إلكتروني صالح");
      return;
    }
    setIsCodeSent(true);
    toast.success(`تم إرسال رمز التحقق إلى: ${newEmail}`);
  };

  // Confirm verification code handler
  const handleConfirmEmailChange = () => {
    if (emailVerificationCode.trim().length !== 6) {
      toast.error("يرجى إدخال رمز التحقق المكون من 6 أرقام");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      email: newEmail,
      emailVerified: true,
      emailVerifiedDate: "الآن (مُحدّث)",
    }));
    setNewEmail("");
    setEmailVerificationCode("");
    setIsCodeSent(false);
    toast.success("تم تحديث البريد الإلكتروني الرسمي بنجاح وتوثيقه");
  };

  // Terminate other sessions
  const handleTerminateOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    toast.success("تم تسجيل الخروج بنجاح من جميع الأجهزة الأخرى");
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "bg-gray-200" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: "ضعيفة جداً", color: "bg-red-500" };
      case 2:
        return { score: 50, label: "مقبولة", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "جيدة", color: "bg-emerald-500" };
      case 4:
        return { score: 100, label: "قوية جداً ومحمية", color: "bg-[#059669]" };
      default:
        return { score: 0, label: "", color: "bg-gray-200" };
    }
  };

  const pwdStrength = getPasswordStrength(newPassword);

  return (
    <div className="flex h-screen h-dvh overflow-hidden w-full bg-[#f5f3ef] dark:bg-[#121110] text-[#1b1c1a] dark:text-[#fdfbf7] transition-colors duration-200 font-['Cairo',sans-serif]">
      {/* 1. Global Navigation Sidebar */}
      <DashboardSidebar activeNav="profile" />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <DashboardTopNavbar />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[1360px] w-full mx-auto space-y-6 scrollbar-thin">
          <DashboardPageTransition>
            {/* Header Banner */}
            <div className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#2f2a24] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col text-start">
                <h1 className="text-[24px] sm:text-[28px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  الملف الشخصي وإعدادات الحساب
                </h1>
                <p className="text-[13px] sm:text-[14px] text-[#514537] dark:text-[#a89f91] mt-0.5">
                  إدارة البيانات الشخصية، توثيق البريد الإلكتروني، إعدادات كلمة المرور والجلسات لمشرف النظام العام.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 bg-[#ecfdf5] dark:bg-[#132c21] border border-emerald-200 dark:border-emerald-500/40 px-3.5 py-1.5 rounded-full w-fit shrink-0">
                <span className="size-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] ring-1 ring-emerald-400/60" />
                <span className="font-bold text-[12px] text-[#065f46] dark:text-[#6ee7b7]">
                  {formData.statusLabel}
                </span>
              </div>
            </div>

            {/* Profile Overview Card (Hero) */}
            <div className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-6 sm:p-7 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#2f2a24] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar with Camera badge */}
                <div className="relative size-24 sm:size-28 rounded-full overflow-hidden border-3 border-[#9c6402] dark:border-[#f59e0b] shadow-md shrink-0 group">
                  <Image
                    src={userAvatarImg}
                    alt={formData.fullName}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                    priority
                  />
                  <button
                    type="button"
                    onClick={() => toast.info("ميزة تحديث الصورة الشخصية ستتاح في التحديث القادم")}
                    title="تغيير الصورة الشخصية"
                    className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
                  >
                    <Camera className="size-5" />
                    <span className="text-[10px] font-bold">تغيير</span>
                  </button>
                </div>

                {/* Identity & Badges */}
                <div className="flex-1 text-center sm:text-start space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-[22px] sm:text-[24px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {formData.fullName}
                      </h2>
                      <p className="text-[13px] font-semibold text-[#837565] dark:text-[#a89f91] mt-0.5">
                        {formData.jobTitle} • {formData.department}
                      </p>
                    </div>

                    <div className="flex items-center justify-center sm:justify-start gap-2 self-center sm:self-auto">
                      <span className="bg-[#f5f3ef] dark:bg-[#2c2621] border border-[#eae8e4] dark:border-[#38332c] text-[#9c6402] dark:text-[#f59e0b] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <KeyRound className="size-3.5" />
                        <span>{formData.roleBadge}</span>
                      </span>
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1 text-[12px] text-[#514537] dark:text-[#cdc5bd]">
                    <div className="flex items-center gap-1.5 bg-[#f5f3ef] dark:bg-[#2c2621] px-3 py-1 rounded-full border border-[#eae8e4] dark:border-[#38332c]">
                      <Mail className="size-3.5 text-[#9c6402] dark:text-[#f59e0b]" />
                      <span className="font-mono text-[11px]" dir="ltr">
                        {formData.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#f5f3ef] dark:bg-[#2c2621] px-3 py-1 rounded-full border border-[#eae8e4] dark:border-[#38332c]">
                      <Phone className="size-3.5 text-[#059669]" />
                      <span className="font-mono text-[11px]" dir="ltr">
                        {formData.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#f5f3ef] dark:bg-[#2c2621] px-3 py-1 rounded-full border border-[#eae8e4] dark:border-[#38332c]">
                      <Calendar className="size-3.5 text-[#837565] dark:text-[#a89f91]" />
                      <span>تاريخ الانضمام: {formData.joinDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#ecfdf5] dark:bg-[#132c21] border border-emerald-200 dark:border-emerald-500/40 text-[#065f46] dark:text-[#6ee7b7] px-3 py-1 rounded-full font-bold text-[11px]">
                      <ShieldCheck className="size-3.5" />
                      <span>2FA مفعّل</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Segmented Pill Navigation Tabs */}
            <div className="bg-[#f5f3ef] dark:bg-[#2c2621] p-1 rounded-[8px] flex flex-wrap items-center gap-1.5 border border-[#eae8e4] dark:border-[#38332c] w-full">
              <button
                type="button"
                onClick={() => setActiveTab("personal")}
                className={cn(
                  "flex-1 sm:flex-initial px-4 py-2 rounded-[6px] text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === "personal"
                    ? "bg-white dark:bg-[#1e1c1a] text-[#9c6402] dark:text-[#f59e0b] shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
                    : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                )}
              >
                <User className="size-4" />
                <span>البيانات الشخصية</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("email")}
                className={cn(
                  "flex-1 sm:flex-initial px-4 py-2 rounded-[6px] text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === "email"
                    ? "bg-white dark:bg-[#1e1c1a] text-[#9c6402] dark:text-[#f59e0b] shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
                    : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                )}
              >
                <Mail className="size-4" />
                <span>البريد الإلكتروني والاتصال</span>
                <span className="size-2 rounded-full bg-[#10b981]" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={cn(
                  "flex-1 sm:flex-initial px-4 py-2 rounded-[6px] text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === "security"
                    ? "bg-white dark:bg-[#1e1c1a] text-[#9c6402] dark:text-[#f59e0b] shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
                    : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                )}
              >
                <Lock className="size-4" />
                <span>كلمة المرور والأمان</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("sessions")}
                className={cn(
                  "flex-1 sm:flex-initial px-4 py-2 rounded-[6px] text-[13px] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                  activeTab === "sessions"
                    ? "bg-white dark:bg-[#1e1c1a] text-[#9c6402] dark:text-[#f59e0b] shadow-[0px_1px_2px_rgba(0,0,0,0.06)]"
                    : "text-[#514537] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7]"
                )}
              >
                <Laptop className="size-4" />
                <span>الأجهزة والجلسات</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[#837565] dark:text-[#a89f91]">
                  {sessions.length}
                </span>
              </button>
            </div>

            {/* TAB 1: Personal Information */}
            {activeTab === "personal" && (
              <div className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#2f2a24] space-y-6">
                <div className="border-b border-[#eae8e4] dark:border-[#2f2a24] pb-4 text-start">
                  <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    المعلومات والبيانات الشخصية
                  </h3>
                  <p className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                    البيانات الأساسية التي تظهر في سجلات الحوكمة وتقارير تدقيق المنصة.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* First Name */}
                  <div className="space-y-1.5 text-start">
                    <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                      <span>الاسم الأول</span>
                      <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstName: e.target.value,
                          fullName: `${e.target.value} ${formData.lastName}`,
                        })
                      }
                      className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5 text-start">
                    <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                      <span>اسم العائلة</span>
                      <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastName: e.target.value,
                          fullName: `${formData.firstName} ${e.target.value}`,
                        })
                      }
                      className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                    />
                  </div>

                  {/* Job Title */}
                  <div className="space-y-1.5 text-start">
                    <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      المسمى الوظيفي
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] ps-3.5 pe-10 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                      />
                      <Building2 className="size-4 text-[#837565] dark:text-[#a89f91] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5 text-start">
                    <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      القسم أو الإدارة التابعة
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                    />
                  </div>

                  {/* National ID */}
                  <div className="space-y-1.5 text-start">
                    <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      رقم الهوية الوطنية / الإقامة
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={formData.nationalId}
                      onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                      className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] px-3.5 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5 text-start">
                    <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                      <span>رقم الهاتف المعتمد</span>
                      <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] ps-3.5 pe-10 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                      />
                      <Phone className="size-4 text-[#837565] dark:text-[#a89f91] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-1.5 text-start">
                    <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      المدينة والدولة
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={`${formData.city}، ${formData.country}`}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] ps-3.5 pe-10 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                      />
                      <MapPin className="size-4 text-[#837565] dark:text-[#a89f91] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Timezone */}
                  <div className="space-y-1.5 text-start">
                    <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      المنطقة الزمنية
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.timezone}
                        readOnly
                        className="w-full h-[42px] bg-[#f5f3ef]/80 dark:bg-[#2c2621]/80 text-[#837565] dark:text-[#a89f91] text-[13px] font-semibold rounded-[6px] ps-3.5 pe-10 border border-[#eae8e4] dark:border-[#38332c] cursor-not-allowed"
                      />
                      <Clock className="size-4 text-[#837565] dark:text-[#a89f91] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Bio (Col span 2) */}
                  <div className="md:col-span-2 space-y-1.5 text-start">
                    <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      نبذة تعريفية
                    </label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] p-3 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Email & Communication Settings */}
            {activeTab === "email" && (
              <div className="space-y-6">
                {/* 1. Current Verified Email Card */}
                <div className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#2f2a24] text-start space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae8e4] dark:border-[#2f2a24] pb-4">
                    <div>
                      <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-2">
                        <Mail className="size-5 text-[#9c6402] dark:text-[#f59e0b]" />
                        <span>البريد الإلكتروني المعتمد الحالي</span>
                      </h3>
                      <p className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                        هذا العنوان هو القناة الرسمية الوحيدة المعتمدة لاستلام التنبيهات الأمنية وتأكيدات عمليات النظام.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#ecfdf5] dark:bg-[#132c21] border border-emerald-200 dark:border-emerald-500/40 text-[#065f46] dark:text-[#6ee7b7] px-3.5 py-1.5 rounded-full w-fit font-bold text-[12px]">
                      <ShieldCheck className="size-4" />
                      <span>مُتحقق منه ومُعتمد</span>
                      <span className="size-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                    </div>
                  </div>

                  <div className="bg-[#faf9f7] dark:bg-[#251e18] p-4 rounded-[6px] border border-[#ede8e1] dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#837565] dark:text-[#a89f91] block">
                        العنوان الأساسي
                      </span>
                      <span className="text-[15px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] font-mono select-all" dir="ltr">
                        {formData.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(formData.email);
                          toast.success("تم نسخ البريد الإلكتروني إلى الحافظة");
                        }}
                        className="h-[34px] px-3 rounded-[6px] border border-[#ded5c6] dark:border-[#38271c] bg-white dark:bg-[#1e1c1a] hover:bg-[#f5f3ef] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Copy className="size-3.5" />
                        <span>نسخ العنوان</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[12px]">
                    <div className="p-3 rounded-[6px] bg-[#f5f3ef] dark:bg-[#2c2621] border border-[#eae8e4] dark:border-[#38271c] space-y-1">
                      <span className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] block">تاريخ التحقق</span>
                      <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">{formData.emailVerifiedDate}</span>
                    </div>
                    <div className="p-3 rounded-[6px] bg-[#f5f3ef] dark:bg-[#2c2621] border border-[#eae8e4] dark:border-[#38271c] space-y-1">
                      <span className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] block">بروتوكول الأمان</span>
                      <span className="font-semibold text-[#10b981]">TLS 1.3 مشفر بالكامل</span>
                    </div>
                    <div className="p-3 rounded-[6px] bg-[#f5f3ef] dark:bg-[#2c2621] border border-[#eae8e4] dark:border-[#38271c] space-y-1">
                      <span className="text-[10px] font-bold text-[#837565] dark:text-[#a89f91] block">الربط بالمصادقة 2FA</span>
                      <span className="font-semibold text-[#059669]">مُفعّل ومحمي</span>
                    </div>
                  </div>
                </div>

                {/* 2. Change Email Address Form */}
                <div className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#2f2a24] text-start space-y-4">
                  <div className="border-b border-[#eae8e4] dark:border-[#2f2a24] pb-4">
                    <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      تحديث وتغيير البريد الإلكتروني
                    </h3>
                    <p className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                      يتطلب تغيير البريد إرسال رمز أمان إلى العنوان الجديد للتحقق من ملكيته قبل اعتماده.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        البريد الإلكتروني الجديد
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          dir="ltr"
                          placeholder="example@aljoody-law.sa"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder-[#837565] text-[13px] font-semibold rounded-[6px] ps-3.5 pe-10 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                        />
                        <Mail className="size-4 text-[#837565] dark:text-[#a89f91] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleSendVerificationCode}
                        className="w-full sm:w-auto h-[42px] px-5 rounded-[6px] bg-[#9c6402] hover:bg-[#855401] text-white text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                      >
                        <Send className="size-4" />
                        <span>إرسال رمز التحقق</span>
                      </button>
                    </div>
                  </div>

                  {/* Verification Code Box (Visible when code is sent) */}
                  {isCodeSent && (
                    <div className="bg-[#fffbeb] dark:bg-[#2c2214] border border-[#fef3c7] dark:border-[#4d3a1f] p-4 rounded-[6px] space-y-3 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 text-[#92400e] dark:text-[#fbbf24] text-[12px] font-bold">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>تم إرسال رمز التحقق (رمز تجريبي للاختبار: 123456)</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <input
                          type="text"
                          dir="ltr"
                          maxLength={6}
                          placeholder="123456"
                          value={emailVerificationCode}
                          onChange={(e) => setEmailVerificationCode(e.target.value)}
                          className="w-full sm:w-[160px] h-[40px] tracking-widest text-center bg-white dark:bg-[#1e1c1a] text-[#1b1c1a] dark:text-[#fdfbf7] text-[16px] font-mono font-bold rounded-[6px] border border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#9c6402]"
                        />

                        <button
                          type="button"
                          onClick={handleConfirmEmailChange}
                          className="w-full sm:w-auto h-[40px] px-4 rounded-[6px] bg-[#059669] hover:bg-[#047857] text-white text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <Check className="size-4" />
                          <span>تأكيد واعتماد البريد الجديد</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Recovery Email Card */}
                <div className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#2f2a24] text-start space-y-4">
                  <div className="border-b border-[#eae8e4] dark:border-[#2f2a24] pb-4">
                    <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      البريد الإلكتروني الاحتياطي للاسترداد
                    </h3>
                    <p className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                      يُستخدم فقط في حالات الطوارئ القصوى لاستعادة صلاحيات الحساب إذا تعذر الوصول للبريد الرئيسي.
                    </p>
                  </div>

                  <div className="space-y-1.5 max-w-xl">
                    <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      البريد الاحتياطي
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        dir="ltr"
                        value={formData.recoveryEmail}
                        onChange={(e) => setFormData({ ...formData, recoveryEmail: e.target.value })}
                        className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] ps-3.5 pe-10 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                      />
                      <Mail className="size-4 text-[#837565] dark:text-[#a89f91] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 4. Email Notification Preferences Matrix */}
                <div className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#2f2a24] text-start space-y-4">
                  <div className="border-b border-[#eae8e4] dark:border-[#2f2a24] pb-4">
                    <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-2">
                      <Bell className="size-5 text-[#9c6402] dark:text-[#f59e0b]" />
                      <span>تفضيلات إشعارات البريد الإلكتروني</span>
                    </h3>
                    <p className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                      تحديد نوعية الرسائل والتقارير الدورية التي ترغب في استلامها عبر بريدك الإلكتروني المعتمد.
                    </p>
                  </div>

                  <div className="divide-y divide-[#eae8e4] dark:divide-[#2f2a24]">
                    {/* Item 1: Subscriptions */}
                    <div className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          إشعارات الاشتراكات والتراخيص
                        </span>
                        <span className="text-[12px] text-[#837565] dark:text-[#a89f91]">
                          استلام تنبيه فوري عند تسجيل اشتراك جديد، طلب تجديد، أو ترقية باقة.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.emailNotifications.subscriptions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emailNotifications: {
                              ...formData.emailNotifications,
                              subscriptions: e.target.checked,
                            },
                          })
                        }
                        className="size-5 rounded border-[#eae8e4] text-[#9c6402] focus:ring-[#9c6402] cursor-pointer"
                      />
                    </div>

                    {/* Item 2: Invoices */}
                    <div className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          إشعارات الفواتير وعمليات الدفع
                        </span>
                        <span className="text-[12px] text-[#837565] dark:text-[#a89f91]">
                          تأكيدات سداد الفواتير الإلكترونية المعتمدة وإشعارات فشل العمليات المالية.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.emailNotifications.invoices}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emailNotifications: {
                              ...formData.emailNotifications,
                              invoices: e.target.checked,
                            },
                          })
                        }
                        className="size-5 rounded border-[#eae8e4] text-[#9c6402] focus:ring-[#9c6402] cursor-pointer"
                      />
                    </div>

                    {/* Item 3: Security Alerts (Required) */}
                    <div className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                            تنبيهات الأمان والدخول الحساس
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fef2f2] text-[#991b1b] dark:bg-[#311616] dark:text-[#f87171]">
                            إجباري للأمان
                          </span>
                        </div>
                        <span className="text-[12px] text-[#837565] dark:text-[#a89f91]">
                          إشعار فوري عند تسجيل الدخول من جهاز جديد أو تغيير إعدادات الحساب الحساسة.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="size-5 rounded border-[#eae8e4] text-[#9c6402] opacity-60 cursor-not-allowed"
                      />
                    </div>

                    {/* Item 4: Weekly Digest */}
                    <div className="py-3.5 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] block">
                          التقرير الإداري الأسبوعي الشامل
                        </span>
                        <span className="text-[12px] text-[#837565] dark:text-[#a89f91]">
                          ملخص أسبوعي يصل صباح كل خميس بإحصائيات المكاتب، الفواتير، ونشاط الدعم الفني.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.emailNotifications.weeklyDigest}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emailNotifications: {
                              ...formData.emailNotifications,
                              weeklyDigest: e.target.checked,
                            },
                          })
                        }
                        className="size-5 rounded border-[#eae8e4] text-[#9c6402] focus:ring-[#9c6402] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Security & Password */}
            {activeTab === "security" && (
              <div className="space-y-6">
                {/* 1. Change Password Card */}
                <div className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#2f2a24] text-start space-y-4">
                  <div className="border-b border-[#eae8e4] dark:border-[#2f2a24] pb-4">
                    <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-2">
                      <Lock className="size-5 text-[#9c6402] dark:text-[#f59e0b]" />
                      <span>تحديث كلمة المرور</span>
                    </h3>
                    <p className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                      احرص على استخدام كلمة مرور قوية تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز خاصة.
                    </p>
                  </div>

                  <div className="space-y-4 max-w-xl">
                    {/* Current Password */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        كلمة المرور الحالية
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] ps-3.5 pe-10 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] cursor-pointer"
                        >
                          {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        كلمة المرور الجديدة
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] ps-3.5 pe-10 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>

                      {/* Password strength meter */}
                      {newPassword && (
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-[#837565] dark:text-[#a89f91]">قوة كلمة المرور:</span>
                            <span className={cn(pwdStrength.score >= 75 ? "text-[#059669]" : "text-[#d97706]")}>
                              {pwdStrength.label}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-[#eae8e4] dark:bg-[#38332c] rounded-full overflow-hidden">
                            <div
                              className={cn("h-full transition-all duration-300", pwdStrength.color)}
                              style={{ width: `${pwdStrength.score}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        تأكيد كلمة المرور الجديدة
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full h-[42px] bg-[#f5f3ef] dark:bg-[#2c2621] text-[#1b1c1a] dark:text-[#fdfbf7] text-[13px] font-semibold rounded-[6px] ps-3.5 pe-10 border border-[#eae8e4] dark:border-[#38332c] focus:outline-none focus:ring-1 focus:ring-[#9c6402] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute end-3.5 top-1/2 -translate-y-1/2 text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Two-Factor Authentication (2FA) */}
                <div className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#2f2a24] text-start space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae8e4] dark:border-[#2f2a24] pb-4">
                    <div>
                      <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-2">
                        <ShieldCheck className="size-5 text-[#059669]" />
                        <span>المصادقة الثنائية (2FA)</span>
                      </h3>
                      <p className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                        حماية إضافية تطلب رمز أمان مؤقت من هاتفك في كل مرة تسجل فيها الدخول.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#ecfdf5] dark:bg-[#132c21] border border-emerald-200 dark:border-emerald-500/40 text-[#065f46] dark:text-[#6ee7b7] px-3.5 py-1.5 rounded-full w-fit font-bold text-[12px]">
                      <CheckCircle2 className="size-4" />
                      <span>مفعلة بواسطة التطبيق</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-[6px] bg-[#faf9f7] dark:bg-[#251e18] border border-[#ede8e1] dark:border-[#38271c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[13px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        تطبيق المصادقة (Authenticator App)
                      </span>
                      <span className="text-[12px] text-[#837565] dark:text-[#a89f91] block">
                        مرتبط بتطبيق {formData.twoFactorMethod}.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toast.info("مفاتيح الاسترداد الاحتياطية محفوظة بأمان")}
                      className="h-[36px] px-4 rounded-[6px] border border-[#ded5c6] dark:border-[#38332c] bg-white dark:bg-[#1e1c1a] hover:bg-[#f5f3ef] text-[#514537] dark:text-[#cdc5bd] text-[12px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <KeyRound className="size-3.5" />
                      <span>عرض مفاتيح الاسترداد</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Active Devices & Sessions */}
            {activeTab === "sessions" && (
              <div className="bg-white dark:bg-[#1e1c1a] rounded-[8px] p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] border border-[#eae8e4] dark:border-[#2f2a24] text-start space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eae8e4] dark:border-[#2f2a24] pb-4">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-2">
                      <Laptop className="size-5 text-[#9c6402] dark:text-[#f59e0b]" />
                      <span>الأجهزة والجلسات النشطة حالياً</span>
                    </h3>
                    <p className="text-[12px] text-[#837565] dark:text-[#a89f91] mt-0.5">
                      قائمة بجميع الأجهزة التي يتوفر لديها تصريح دخول نشط إلى هذا الحساب الإداري.
                    </p>
                  </div>

                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={handleTerminateOtherSessions}
                      className="h-[36px] px-3.5 rounded-[6px] bg-[#ba1a1a]/10 hover:bg-[#ba1a1a]/20 text-[#ba1a1a] dark:text-[#f87171] border border-[#ba1a1a]/20 text-[12px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <LogOut className="size-3.5" />
                      <span>تسجيل الخروج من باقي الأجهزة</span>
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[#eae8e4] dark:divide-[#2f2a24]">
                  {sessions.map((session) => {
                    const isMac = session.os.toLowerCase().includes("mac");
                    const isPhone = session.device.toLowerCase().includes("phone");
                    return (
                      <div
                        key={session.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="size-11 rounded-[8px] bg-[#f5f3ef] dark:bg-[#2c2621] border border-[#eae8e4] dark:border-[#38332c] flex items-center justify-center text-[#9c6402] dark:text-[#f59e0b] shrink-0">
                            {isPhone ? (
                              <Smartphone className="size-5" />
                            ) : isMac ? (
                              <Laptop className="size-5" />
                            ) : (
                              <Tablet className="size-5" />
                            )}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                                {session.device}
                              </span>
                              {session.isCurrent && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ecfdf5] dark:bg-[#132c21] text-[#065f46] dark:text-[#6ee7b7] border border-emerald-200 dark:border-emerald-500/40">
                                  الجهاز الحالي
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-[#837565] dark:text-[#a89f91]">
                              {session.browser} • {session.os}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-[#514537] dark:text-[#cdc5bd] pt-0.5">
                              <MapPin className="size-3 text-[#837565]" />
                              <span>{session.location}</span>
                              <span>•</span>
                              <span className="font-mono">{session.ipAddress}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className="text-[12px] font-semibold text-[#837565] dark:text-[#a89f91]">
                            {session.lastActive}
                          </span>

                          {!session.isCurrent && (
                            <button
                              type="button"
                              onClick={() => {
                                setSessions((prev) => prev.filter((s) => s.id !== session.id));
                                toast.success(`تم إنهاء الجلسة على ${session.device}`);
                              }}
                              className="size-8 rounded-[4px] hover:bg-[#ba1a1a]/10 text-[#837565] hover:text-[#ba1a1a] flex items-center justify-center transition-colors cursor-pointer"
                              title="إنهاء هذه الجلسة"
                            >
                              <LogOut className="size-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {/* 3. Sticky Action Bar */}
            <DashboardStickyActionBar>
              <div className="flex items-center gap-2 text-[12px] text-[#837565] dark:text-[#a89f91]">
                <ShieldCheck className="size-4 text-[#059669]" />
                <span>يتم حفظ جميع التعديلات في سجل تدقيق العمليات الإدارية المشفر.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial h-[40px] px-4 rounded-[6px] border border-[#ded5c6] dark:border-[#38271c] bg-white dark:bg-[#1e1c1a] hover:bg-[#f5f3ef] text-[#514537] dark:text-[#cdc5bd] text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="size-4" />
                  <span>إلغاء التراجع</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 sm:flex-initial h-[40px] px-6 rounded-[6px] bg-[#9c6402] hover:bg-[#855401] text-white text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-50"
                >
                  <Check className="size-4" />
                  <span>{isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}</span>
                </button>
              </div>
            </DashboardStickyActionBar>
          </DashboardPageTransition>
        </main>
      </div>
    </div>
  );
}
