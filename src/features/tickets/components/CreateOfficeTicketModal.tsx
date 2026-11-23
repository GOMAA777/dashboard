"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Check,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FileCode,
  AlertCircle,
  MessageSquare,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Loader2,
  Building2,
  ChevronUp,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import {
  TicketPriority,
  TicketChannel,
  TicketDepartment,
  TicketAssignee,
  TicketAttachment,
} from "../types/tickets.types";
import type { CreateTicketPayload } from "@/lib/api/tickets";
import { useLanguage } from "@/lib/i18n";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { ModalPortal } from "@/components/shared/ModalPortal";
import {
  CustomTimeValue,
  formatCustomTime,
  getDefaultTimeFromNow,
} from "@/components/shared/LuxuryTimePicker";
import { cn } from "@/lib/utils";

interface CreateOfficeTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  officeName: string;
  officeCrNumber?: string;
  officeId: string | number;
  officePhone?: string;
  officeEmail?: string;
  departments: TicketDepartment[];
  assignees: TicketAssignee[];
  onSaveTicket: (
    payload: CreateTicketPayload,
    assigneeId?: string,
    attachments?: TicketAttachment[]
  ) => Promise<boolean>;
}

const compactFieldClass =
  "w-full bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] h-[40px] px-[12px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] shadow-xs";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileCategory(fileName: string): "json" | "image" | "log" | "pdf" {
  const ext = fileName.toLowerCase().split(".").pop() || "";
  if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (ext === "json") return "json";
  return "log";
}

function getFileTypeLabel(fileName: string, isEn = false): string {
  const ext = fileName.toLowerCase().split(".").pop() || "";
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return isEn ? "Image" : "صورة";
  if (ext === "pdf") return isEn ? "PDF" : "PDF";
  if (ext === "json") return isEn ? "JSON" : "JSON";
  return isEn ? "Log File" : "سجل";
}

export function CreateOfficeTicketModal({
  isOpen,
  onClose,
  officeName,
  officeCrNumber,
  officeId,
  officePhone = "",
  officeEmail = "",
  departments,
  assignees,
  onSaveTicket,
}: CreateOfficeTicketModalProps) {
  const { direction, isEn, t } = useLanguage();

  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || "");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(assignees[0]?.id || "");
  const [channel, setChannel] = useState<TicketChannel>("whatsapp");
  const [priority, setPriority] = useState<TicketPriority | "custom">("urgent");

  // Custom Time State
  const [customTime, setCustomTime] = useState<CustomTimeValue>(() =>
    getDefaultTimeFromNow(2)
  );

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactDetail, setContactDetail] = useState(officePhone || officeEmail || "");
  const [attachedFiles, setAttachedFiles] = useState<TicketAttachment[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const customTimeDisplay = formatCustomTime(customTime, isEn);

  if (!isOpen) return null;

  const handleChannelSelect = (newChannel: TicketChannel) => {
    setChannel(newChannel);
    if (newChannel === "whatsapp" || newChannel === "phone") {
      setContactDetail(officePhone || "");
    } else if (newChannel === "email") {
      setContactDetail(officeEmail || "");
    } else {
      setContactDetail("");
    }
  };

  const handleHourStep = (delta: number) => {
    let num = parseInt(customTime.hour, 10) || 12;
    num += delta;
    if (num > 12) num = 1;
    if (num < 1) num = 12;
    setCustomTime((prev) => ({
      ...prev,
      hour: String(num).padStart(2, "0"),
    }));
  };

  const handleMinuteStep = (delta: number) => {
    let num = parseInt(customTime.minute, 10) || 0;
    num += delta;
    if (num >= 60) num = 0;
    if (num < 0) num = 55;
    setCustomTime((prev) => ({
      ...prev,
      minute: String(num).padStart(2, "0"),
    }));
  };

  const applyPresetHours = (addHours: number) => {
    const preset = getDefaultTimeFromNow(addHours);
    setCustomTime(preset);
  };

  const applyFixedPreset = (h: string, m: string, p: "AM" | "PM") => {
    setCustomTime({
      hour: h,
      minute: m,
      period: p,
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: TicketAttachment[] = [];
    Array.from(files).forEach((file) => {
      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: formatFileSize(file.size),
        typeLabel: getFileTypeLabel(file.name, isEn),
        category: getFileCategory(file.name),
        verifiedStatus: isEn ? "Verified" : "تم الفحص",
      });
    });

    setAttachedFiles((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedDeptId) {
      errors.department_id = isEn ? "Please select a department" : "يرجى تحديد القسم المختص";
    }

    if (!title.trim()) {
      errors.subject = isEn ? "Please enter ticket subject" : "يرجى إدخال موضوع التذكرة";
    } else if (title.trim().length < 3) {
      errors.subject = isEn ? "Subject must be at least 3 characters" : "يجب ألا يقل الموضوع عن 3 أحرف";
    }

    if (!description.trim()) {
      errors.description = isEn ? "Please enter ticket details" : "يرجى إدخال تفاصيل المشكلة";
    } else if (description.trim().length < 5) {
      errors.description = isEn ? "Description must be at least 5 characters" : "يجب ألا يقل الوصف عن 5 أحرف";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(isEn ? "Please complete all required fields" : "يرجى ملء الحقول المطلوبة بشكل صحيح");
      return;
    }

    setIsSubmitting(true);

    const channelNotes: string[] = [];
    if (channel === "whatsapp") {
      channelNotes.push("واتساب الأعمال");
      if (contactDetail.trim()) channelNotes.push(`الرقم: ${contactDetail.trim()}`);
    } else if (channel === "portal") {
      channelNotes.push("شات المنصة");
      if (contactDetail.trim()) channelNotes.push(`الجلسة: ${contactDetail.trim()}`);
    } else if (channel === "phone") {
      channelNotes.push("مكالمة هاتفية");
      if (contactDetail.trim()) channelNotes.push(`رقم المتصل: ${contactDetail.trim()}`);
    } else if (channel === "email") {
      channelNotes.push("البريد الإلكتروني");
      if (contactDetail.trim()) channelNotes.push(`البريد: ${contactDetail.trim()}`);
    }

    if (priority === "custom") {
      channelNotes.push(
        isEn
          ? `Custom SLA / Response Time: ${customTimeDisplay}`
          : `وقت الاستجابة المطلوب: ${customTimeDisplay}`
      );
    }

    const header = channelNotes.length > 0 ? `[قناة الورود: ${channelNotes.join(" | ")}]` : "";
    const enrichedDescription = header ? `${header}\n\n${description.trim()}` : description.trim();

    const effectivePriority: TicketPriority = priority === "custom" ? "medium" : priority;

    const payload: CreateTicketPayload = {
      company_id: Number(officeId) || 1,
      subject: title.trim(),
      description: enrichedDescription,
      department_id: Number(selectedDeptId) || 1,
      priority: effectivePriority,
      channel,
    };

    try {
      const success = await onSaveTicket(payload, selectedAssigneeId, attachedFiles);
      if (success) {
        toast.success(
          isEn
            ? "Ticket created and saved successfully"
            : "تم إنشاء التذكرة وحفظها بنجاح للمكتب"
        );
        onClose();
      }
    } catch {
      toast.error(isEn ? "Failed to save ticket" : "تعذر حفظ التذكرة، يرجى المحاولة ثانية");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        dir={direction}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 font-['Cairo'] animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSubmitting) onClose();
        }}
      >
        <div
          className="bg-white dark:bg-[#1a120c] border border-[#e6e2dc] dark:border-[#38271c] rounded-[10px] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-start"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between bg-[#fcfaf8] dark:bg-[#221812] shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-[36px] rounded-[8px] bg-[#9c6402]/10 dark:bg-[#e29d38]/20 text-[#9c6402] dark:text-[#f3c27e] flex items-center justify-center shrink-0">
                <Clock className="size-[18px]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isEn ? "Create New Support Ticket" : "إنشاء تذكرة دعم فني جديدة"}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#9c6402]/10 dark:bg-[#e29d38]/15 text-[#9c6402] dark:text-[#f3c27e] flex items-center gap-1">
                    <Building2 className="size-[11px]" />
                    <span>{officeName}</span>
                    {officeCrNumber && <span className="opacity-75 font-mono">({officeCrNumber})</span>}
                  </span>
                </div>
                <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">
                  {isEn
                    ? "Directly assigned to this law firm with custom SLA tracking"
                    : "إسناد التذكرة وتوجيهها المباشر لمكتب المحاماة مع تحديد الأولوية والوقت"}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="p-1.5 text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] rounded-[6px] transition-colors cursor-pointer"
            >
              <X className="size-[18px]" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
            <div className="p-5 space-y-4">
              {/* Row 1: Department & Staff Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                    <span>{isEn ? "Assigned Department" : "القسم المختص"}</span>
                    <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
                  </label>
                  <DashboardSelect
                    value={selectedDeptId}
                    onChange={(e) => setSelectedDeptId(e.target.value)}
                    className="h-[38px] rounded-[6px] text-[12px] dark:bg-[#160e0a]"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code ? `${d.code} - ` : ""}
                        {d.name}
                      </option>
                    ))}
                  </DashboardSelect>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isEn ? "Assignee Staff" : "الموظف المسؤول (المكلف)"}
                  </label>
                  <DashboardSelect
                    value={selectedAssigneeId}
                    onChange={(e) => setSelectedAssigneeId(e.target.value)}
                    className="h-[38px] rounded-[6px] text-[12px] dark:bg-[#160e0a]"
                  >
                    {assignees.length === 0 ? (
                      <option value="">{isEn ? "No staff available" : "لا يوجد موظفون متاحون"}</option>
                    ) : (
                      assignees.map((a) => {
                        const roleLabel =
                          typeof a.role === "object" && a.role !== null
                            ? ((a.role as Record<string, unknown>).name as string) || "موظف"
                            : a.role;
                        return (
                          <option key={a.id} value={a.id}>
                            {a.name} ({roleLabel})
                          </option>
                        );
                      })
                    )}
                  </DashboardSelect>
                </div>
              </div>

              {/* Row 2: Priority Cards (4 Compact Options) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                  <span>{isEn ? "Priority Level" : "مستوى الأولوية"}</span>
                  <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Low */}
                  <button
                    type="button"
                    onClick={() => setPriority("low")}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-[6px] border text-start transition-all cursor-pointer",
                      priority === "low"
                        ? "border-[#61564f] dark:border-[#a89f91] bg-[#f5f3ef] dark:bg-[#281c15] shadow-xs"
                        : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#160e0a] hover:bg-[#faf9f6] dark:hover:bg-[#20150e]"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="size-[7px] rounded-full bg-[#61564f] dark:bg-[#a89f91]" />
                      <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {isEn ? "Low" : "منخفضة"}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#625d5d] dark:text-[#a89f91]">48h</span>
                  </button>

                  {/* Medium */}
                  <button
                    type="button"
                    onClick={() => setPriority("medium")}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-[6px] border text-start transition-all cursor-pointer",
                      priority === "medium"
                        ? "border-[#d97706] dark:border-[#e29d38] bg-[#fff8e1] dark:bg-[#2b1f0c] shadow-xs"
                        : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#160e0a] hover:bg-[#faf9f6] dark:hover:bg-[#20150e]"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="size-[7px] rounded-full bg-[#d97706] dark:bg-[#e29d38]" />
                      <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                        {isEn ? "Medium" : "متوسطة"}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#b76e00] dark:text-[#e29d38]">24h</span>
                  </button>

                  {/* Urgent */}
                  <button
                    type="button"
                    onClick={() => setPriority("urgent")}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-[6px] border text-start transition-all cursor-pointer",
                      priority === "urgent"
                        ? "border-[#ba1a1a] dark:border-[#f87171] bg-[#ffdad6]/40 dark:bg-[#381616] shadow-xs"
                        : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#160e0a] hover:bg-[#faf9f6] dark:hover:bg-[#20150e]"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="size-[7px] rounded-full bg-[#ba1a1a] dark:bg-[#f87171]" />
                      <span className="text-[12px] font-bold text-[#ba1a1a] dark:text-[#fca5a5]">
                        {isEn ? "Urgent" : "عاجلة"}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-[#ba1a1a] dark:text-[#fca5a5]">
                      {isEn ? "Immediate" : "فورية"}
                    </span>
                  </button>

                  {/* Custom */}
                  <button
                    type="button"
                    onClick={() => setPriority("custom")}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-[6px] border text-start transition-all cursor-pointer",
                      priority === "custom"
                        ? "border-[#9c6402] dark:border-[#e29d38] bg-[#fff8e1]/80 dark:bg-[#2e1d0f] shadow-xs ring-1 ring-[#9c6402] dark:ring-[#e29d38]"
                        : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#160e0a] hover:bg-[#faf9f6] dark:hover:bg-[#20150e]"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="size-[7px] rounded-full bg-[#9c6402] dark:bg-[#e29d38]" />
                      <span
                        className={cn(
                          "text-[12px] font-bold",
                          priority === "custom"
                            ? "text-[#9c6402] dark:text-[#f3c27e]"
                            : "text-[#1b1c1a] dark:text-[#fdfbf7]"
                        )}
                      >
                        {isEn ? "Custom" : "مخصصة"}
                      </span>
                    </div>
                    <span
                      dir="ltr"
                      className="text-[9px] font-bold text-[#9c6402] dark:text-[#e29d38]"
                    >
                      {customTimeDisplay}
                    </span>
                  </button>
                </div>
              </div>

              {/* Row 3: Slim Compact Time Picker when 'custom' is active */}
              {priority === "custom" && (
                <div className="bg-[#fffdfa] dark:bg-[#1c130d] border border-[#9c6402]/30 dark:border-[#e29d38]/30 rounded-[8px] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-150">
                  {/* Digital Clock Stepper */}
                  <div className="flex items-center gap-1.5" dir="ltr">
                    {/* Hours */}
                    <div className="flex items-center bg-[#faf9f6] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] px-1.5 py-0.5">
                      <span className="text-[14px] font-bold font-mono text-[#1b1c1a] dark:text-[#fdfbf7] w-[22px] text-center">
                        {customTime.hour}
                      </span>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleHourStep(1)}
                          className="text-[#837565] hover:text-[#9c6402] p-0.5 cursor-pointer"
                        >
                          <ChevronUp className="size-[12px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleHourStep(-1)}
                          className="text-[#837565] hover:text-[#9c6402] p-0.5 cursor-pointer"
                        >
                          <ChevronDown className="size-[12px]" />
                        </button>
                      </div>
                    </div>

                    <span className="font-bold text-[#837565] font-mono">:</span>

                    {/* Minutes */}
                    <div className="flex items-center bg-[#faf9f6] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] px-1.5 py-0.5">
                      <span className="text-[14px] font-bold font-mono text-[#1b1c1a] dark:text-[#fdfbf7] w-[22px] text-center">
                        {customTime.minute}
                      </span>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleMinuteStep(5)}
                          className="text-[#837565] hover:text-[#9c6402] p-0.5 cursor-pointer"
                        >
                          <ChevronUp className="size-[12px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMinuteStep(-5)}
                          className="text-[#837565] hover:text-[#9c6402] p-0.5 cursor-pointer"
                        >
                          <ChevronDown className="size-[12px]" />
                        </button>
                      </div>
                    </div>

                    {/* AM/PM toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setCustomTime((prev) => ({
                          ...prev,
                          period: prev.period === "AM" ? "PM" : "AM",
                        }))
                      }
                      className="px-2 py-1 rounded-[4px] text-[11px] font-bold bg-[#9c6402] text-white flex items-center gap-1 cursor-pointer ms-1"
                    >
                      {customTime.period === "AM" ? (
                        <>
                          <Sun className="size-[11px]" />
                          <span>ص</span>
                        </>
                      ) : (
                        <>
                          <Moon className="size-[11px]" />
                          <span>م</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Compact Presets Chips */}
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => applyPresetHours(1)}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:border-[#9c6402] cursor-pointer"
                    >
                      ساعة واحدة
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetHours(2)}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:border-[#9c6402] cursor-pointer"
                    >
                      ساعتين
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetHours(4)}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:border-[#9c6402] cursor-pointer"
                    >
                      4 ساعات
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFixedPreset("05", "00", "PM")}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:border-[#9c6402] cursor-pointer"
                    >
                      نهاية الدوام
                    </button>
                  </div>
                </div>
              )}

              {/* Row 4: Channel Selector (Pills) + Detail input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {isEn ? "Intake Channel" : "قناة التواصل والورود"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChannelSelect("whatsapp")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 h-[34px] rounded-[6px] border text-[11px] font-bold transition-all cursor-pointer",
                      channel === "whatsapp"
                        ? "border-[#25D366] bg-[#25D366]/10 text-[#25D366] shadow-xs"
                        : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#160e0a] text-[#837565] dark:text-[#a89f91] hover:bg-[#faf9f6]"
                    )}
                  >
                    <MessageCircle className="size-[14px]" />
                    <span>واتساب</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChannelSelect("portal")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 h-[34px] rounded-[6px] border text-[11px] font-bold transition-all cursor-pointer",
                      channel === "portal"
                        ? "border-[#0284c7] bg-[#0284c7]/10 text-[#0284c7] shadow-xs"
                        : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#160e0a] text-[#837565] dark:text-[#a89f91] hover:bg-[#faf9f6]"
                    )}
                  >
                    <MessageSquare className="size-[14px]" />
                    <span>شات / محادثة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChannelSelect("phone")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 h-[34px] rounded-[6px] border text-[11px] font-bold transition-all cursor-pointer",
                      channel === "phone"
                        ? "border-[#d97706] bg-[#d97706]/10 text-[#d97706] shadow-xs"
                        : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#160e0a] text-[#837565] dark:text-[#a89f91] hover:bg-[#faf9f6]"
                    )}
                  >
                    <Phone className="size-[14px]" />
                    <span>مكالمة هاتفية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChannelSelect("email")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 h-[34px] rounded-[6px] border text-[11px] font-bold transition-all cursor-pointer",
                      channel === "email"
                        ? "border-[#9c6402] bg-[#9c6402]/10 text-[#9c6402] shadow-xs"
                        : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#160e0a] text-[#837565] dark:text-[#a89f91] hover:bg-[#faf9f6]"
                    )}
                  >
                    <Mail className="size-[14px]" />
                    <span>البريد الإلكتروني</span>
                  </button>
                </div>

                {/* Single compact detail input */}
                <input
                  type="text"
                  value={contactDetail}
                  onChange={(e) => setContactDetail(e.target.value)}
                  placeholder={
                    channel === "whatsapp" || channel === "phone"
                      ? "رقم هاتف العميل (مثال: +966 5x xxx xxxx)"
                      : channel === "email"
                      ? "البريد الإلكتروني للعميل"
                      : "معرّف جلسة الشات أو مرجع البوابة (اختياري)"
                  }
                  className={cn(compactFieldClass, "mt-1 text-start")}
                />
              </div>

              {/* Row 5: Ticket Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                  <span>{isEn ? "Subject" : "موضوع التذكرة"}</span>
                  <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, subject: "" }));
                  }}
                  placeholder="مثال: تعطل مزامنة الجلسات القضائية مع بوابة ناجز"
                  className={cn(
                    compactFieldClass,
                    fieldErrors.subject && "border-[#ba1a1a] dark:border-[#f87171]"
                  )}
                />
                {fieldErrors.subject && (
                  <span className="text-[11px] text-[#ba1a1a] dark:text-[#f87171] flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{fieldErrors.subject}</span>
                  </span>
                )}
              </div>

              {/* Row 6: Technical Details */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-1">
                  <span>{isEn ? "Details & Notes" : "التفاصيل والملاحظات الفنية"}</span>
                  <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  placeholder="اكتب وصفاً مفصلاً للمشكلة مع ذكر أرقام القضايا، وقت الحدوث، ورسائل الخطأ..."
                  className={cn(
                    "w-full bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] p-2.5 text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] shadow-xs text-start",
                    fieldErrors.description && "border-[#ba1a1a] dark:border-[#f87171]"
                  )}
                />
                {fieldErrors.description && (
                  <span className="text-[11px] text-[#ba1a1a] dark:text-[#f87171] flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    <span>{fieldErrors.description}</span>
                  </span>
                )}
              </div>

              {/* Row 7: Compact Attachments Bar */}
              <div className="flex flex-col gap-2 pt-1 border-t border-[#eae8e4]/60 dark:border-[#38271c]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {isEn ? "Attachments (Optional)" : "المرفقات والملفات الداعمة"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.json,.log,.txt"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-[4px] border border-[#eae8e4] dark:border-[#38271c] bg-[#faf9f6] dark:bg-[#160e0a] hover:border-[#9c6402] dark:hover:border-[#e29d38] text-[11px] font-bold text-[#9c6402] dark:text-[#f3c27e] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UploadCloud className="size-[13px]" />
                    <span>{isEn ? "Upload Files" : "إرفاق ملف"}</span>
                  </button>
                </div>

                {/* Attached file pills */}
                {attachedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {attachedFiles.map((f) => (
                      <div
                        key={f.id}
                        className="bg-[#f0eeea] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] px-2 py-1 flex items-center gap-1.5 text-[11px] text-[#1b1c1a] dark:text-[#fdfbf7]"
                      >
                        {f.category === "image" ? (
                          <ImageIcon className="size-[12px] text-[#0284c7]" />
                        ) : f.category === "pdf" ? (
                          <FileText className="size-[12px] text-[#dc2626]" />
                        ) : (
                          <FileCode className="size-[12px] text-[#d97706]" />
                        )}
                        <span dir="ltr" className="font-semibold truncate max-w-[140px] font-mono">
                          {f.name}
                        </span>
                        <span className="text-[9px] text-[#837565]">({f.size})</span>
                        <button
                          type="button"
                          onClick={() => removeFile(f.id)}
                          className="hover:text-[#ba1a1a] p-0.5 cursor-pointer text-[#837565]"
                        >
                          <X className="size-[11px]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-[#fcfaf8] dark:bg-[#221812] border-t border-[#f0eeea] dark:border-[#38271c] flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-4 py-2 bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#e6e2dc] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#a89f91] rounded-[6px] text-[12px] font-bold transition-colors cursor-pointer disabled:opacity-50"
              >
                {t("إلغاء", "Cancel")}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#9c6402] hover:bg-[#855402] dark:bg-[#e29d38] dark:hover:bg-[#f3c27e] text-white dark:text-[#1c140f] rounded-[6px] text-[12px] font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-[14px] animate-spin" />
                    <span>{t("جاري الحفظ...", "Saving...")}</span>
                  </>
                ) : (
                  <>
                    <Check className="size-[14px]" />
                    <span>{t("إنشاء التذكرة وحفظها", "Create & Save")}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
