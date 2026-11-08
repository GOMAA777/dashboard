"use client";

import React, { useState, useRef } from "react";
import {
  ArrowRight,
  Check,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  FileCode,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  TicketPriority,
  TicketChannel,
  TicketDepartment,
  TicketAssignee,
  TicketClient,
  TicketAttachment,
} from "../types/tickets.types";
import type { CreateTicketPayload } from "@/lib/api/tickets";
import { useLanguage } from "@/lib/i18n";
import { DashboardSelect } from "@/components/shared/DashboardSelect";
import { ModalPortal } from "@/components/shared/ModalPortal";
import { cn } from "@/lib/utils";

interface CreateTicketViewProps {
  departments: TicketDepartment[];
  assignees: TicketAssignee[];
  clients: TicketClient[];
  onBack: () => void;
  onSaveTicket: (
    payload: CreateTicketPayload,
    assigneeId?: string,
    attachments?: TicketAttachment[]
  ) => Promise<boolean>;
}

const fieldClass =
  "w-full bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] h-[44px] px-[12px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] cursor-pointer";

const selectClass =
  "h-[44px] rounded-[4px] px-[12px] text-[13px] dark:bg-[#160e0a] shadow-[0px_1px_1px_rgba(0,0,0,0.05)]";

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
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) {
    return isEn ? "Digital Image" : "صورة رقمية";
  }
  if (ext === "pdf") {
    return isEn ? "PDF Document" : "مستند PDF";
  }
  if (ext === "json") {
    return isEn ? "JSON Data" : "ملف بيانات JSON";
  }
  if (ext === "log" || ext === "txt") {
    return isEn ? "System Log" : "سجل نظام فني";
  }
  return isEn ? "Supporting File" : "ملف داعم";
}

const ALLOWED_EXTS = ["pdf", "png", "jpg", "jpeg", "webp", "json", "log", "txt"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function CreateTicketView({
  departments,
  assignees,
  clients,
  onBack,
  onSaveTicket,
}: CreateTicketViewProps) {
  const { direction, isEn, t } = useLanguage();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || "");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(assignees[0]?.id || "");
  const [channel, setChannel] = useState<TicketChannel>("portal");
  const [priority, setPriority] = useState<TicketPriority>("urgent");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<TicketAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!selectedClientId) {
      errors.company_id = isEn ? "Please select a client firm" : "يرجى تحديد المكتب أو العميل المستفيد";
    }

    if (!selectedDeptId) {
      errors.department_id = isEn ? "Please select a department" : "يرجى تحديد القسم المختص";
    }

    if (!title.trim()) {
      errors.subject = isEn ? "Please enter ticket subject" : "يرجى إدخال موضوع التذكرة";
    } else if (title.trim().length < 3) {
      errors.subject = isEn ? "Subject must be at least 3 characters" : "يجب أن يتكون الموضوع من 3 أحرف على الأقل";
    }

    if (!description.trim()) {
      errors.description = isEn ? "Please enter technical problem details" : "يرجى إدخال تفاصيل المشكلة والملاحظات الفنية";
    } else if (description.trim().length < 5) {
      errors.description = isEn ? "Description must be at least 5 characters" : "يجب ألا يقل وصف المشكلة عن 5 أحرف";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(
        isEn
          ? "Please fill in all required fields properly"
          : "يرجى ملء الحقول المطلوبة بشكل صحيح"
      );
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setFieldErrors({});

    const companyIdNum = Number(selectedClientId) || 1;
    const deptIdNum = Number(selectedDeptId) || 1;

    const payload: CreateTicketPayload = {
      company_id: companyIdNum,
      subject: title.trim(),
      description: description.trim(),
      department_id: deptIdNum,
      priority,
      channel,
    };

    try {
      const success = await onSaveTicket(payload, selectedAssigneeId, attachedFiles);
      if (success) {
        setShowConfirmModal(false);
      }
    } catch (err: unknown) {
      const errObj = err as { status?: number; body?: { errors?: Record<string, string[]> } };
      if (errObj?.body?.errors) {
        const serverErrs: Record<string, string> = {};
        for (const [k, v] of Object.entries(errObj.body.errors)) {
          if (Array.isArray(v) && v[0]) serverErrs[k] = v[0];
        }
        setFieldErrors(serverErrs);
        setShowConfirmModal(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateAndAddFiles = (fileList: FileList | File[]) => {
    const toAdd: TicketAttachment[] = [];
    const arr = Array.from(fileList);

    for (const file of arr) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      if (!ALLOWED_EXTS.includes(ext)) {
        toast.error(
          isEn
            ? `Unsupported format: "${file.name}". Allowed: PDF, PNG, JPG, JSON, LOG`
            : `نوع الملف غير مدعوم: "${file.name}". الصيغ المدعومة: PDF, PNG, JPG, JSON, LOG`
        );
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          isEn
            ? `File "${file.name}" exceeds the 10MB size limit.`
            : `حجم الملف "${file.name}" يتجاوز الحد الأقصى المسموح به (10 ميجابايت).`
        );
        continue;
      }
      if (attachedFiles.some((f) => f.name === file.name && f.size === formatFileSize(file.size))) {
        toast.info(
          isEn
            ? `File "${file.name}" is already attached.`
            : `الملف "${file.name}" مرفق بالفعل.`
        );
        continue;
      }

      toAdd.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: formatFileSize(file.size),
        typeLabel: getFileTypeLabel(file.name, isEn),
        category: getFileCategory(file.name),
        verifiedStatus: isEn ? "Verified & Uploaded" : "سليم وموثق",
      });
    }

    if (toAdd.length > 0) {
      setAttachedFiles((prev) => [...prev, ...toAdd]);
      toast.success(
        isEn
          ? `Attached ${toAdd.length} file(s) successfully`
          : `تم إرفاق ${toAdd.length} ملف(ات) بنجاح`
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const selectedClientObj = clients.find((c) => String(c.id) === String(selectedClientId)) || clients[0];
  const selectedDeptObj = departments.find((d) => String(d.id) === String(selectedDeptId)) || departments[0];

  return (
    <div dir={direction} className="flex flex-col gap-[24px] w-full">
      {/* Main Identity & Command Banner */}
      <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
        <div className="flex flex-col gap-[4px] text-start">
          <h1 className="text-[#1b1c1a] dark:text-[#fdfbf7] font-bold text-[24px] sm:text-[28px] leading-[38px]">
            {isEn ? "Create New Ticket" : "إنشاء تذكرة جديدة"}
          </h1>
          <p className="text-[#514537] dark:text-[#cdc5bd] text-[13px] sm:text-[14px] leading-[22px]">
            {isEn
              ? "Log the issue and assign department & responsible employee to ensure SLA compliance."
              : "سجّل المشكلة وحدد الجهة والقسم والموظف المسؤول عن متابعتها لضمان الالتزام بمصفوفة اتفاقية مستوى الخدمة (SLA)."}
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="bg-white dark:bg-[#2d1f16] border border-[#eae8e4] dark:border-[#4d3627] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[8px] px-[16px] py-[8px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0 cursor-pointer disabled:opacity-50"
        >
          <ArrowRight className={`size-[14px] ${isEn ? "rotate-180" : ""}`} />
          <span>{isEn ? "Back" : "العودة"}</span>
        </button>
      </div>

      <form onSubmit={handleOpenConfirm} className="flex flex-col gap-[24px]">
        {/* Card 1: Ticket Metadata & Routing */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] sm:p-[32px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c] flex flex-col gap-[24px]">
          <div className="border-b border-[#eae8e4] dark:border-[#38271c] pb-[12px] flex items-center justify-between">
            <h2 className="text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold text-[18px] leading-[26px]">
              {isEn ? "Ticket Metadata & Routing" : "بيانات التذكرة والتوجيه الإداري"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {/* Field: Client / Firm */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
                  <span>{isEn ? "Law Firm / Client" : "المكتب / العميل المستفيد"}</span>
                  <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
                </label>
                <span className="text-[10px] font-bold text-[#625d5d] dark:text-[#a89f91]">
                  {isEn ? "API Linked" : "مربوط بالـ API"}
                </span>
              </div>
              <DashboardSelect
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, company_id: "" }));
                }}
                className={cn(
                  selectClass,
                  fieldErrors.company_id && "border-[#ba1a1a] dark:border-[#f87171]"
                )}
              >
                {clients.length === 0 ? (
                  <option value="">{isEn ? "No firms available" : "لا توجد مكاتب مسجلة"}</option>
                ) : (
                  clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firm} {c.name ? `(${c.name})` : ""}
                    </option>
                  ))
                )}
              </DashboardSelect>
              {fieldErrors.company_id && (
                <div className="flex items-center gap-1 text-[11px] text-[#ba1a1a] dark:text-[#f87171]">
                  <AlertCircle className="size-3 shrink-0" />
                  <span>{fieldErrors.company_id}</span>
                </div>
              )}
            </div>

            {/* Field: Department */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
                <span>{isEn ? "Responsible Department" : "القسم المختص"}</span>
                <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
              </label>
              <DashboardSelect
                value={selectedDeptId}
                onChange={(e) => {
                  setSelectedDeptId(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, department_id: "" }));
                }}
                className={cn(
                  selectClass,
                  fieldErrors.department_id && "border-[#ba1a1a] dark:border-[#f87171]"
                )}
              >
                {departments.length === 0 ? (
                  <option value="">{isEn ? "No departments available" : "لا توجد أقسام مسجلة"}</option>
                ) : (
                  departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))
                )}
              </DashboardSelect>
              {fieldErrors.department_id && (
                <div className="flex items-center gap-1 text-[11px] text-[#ba1a1a] dark:text-[#f87171]">
                  <AlertCircle className="size-3 shrink-0" />
                  <span>{fieldErrors.department_id}</span>
                </div>
              )}
            </div>

            {/* Field: Assignee */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
                <span>{isEn ? "Assigned Employee" : "الموظف المسؤول (المكلف)"}</span>
                <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
              </label>
              <DashboardSelect
                value={selectedAssigneeId}
                onChange={(e) => setSelectedAssigneeId(e.target.value)}
                className={selectClass}
              >
                {assignees.length === 0 ? (
                  <option value="">{isEn ? "No staff available" : "لا يوجد موظفون متاحون"}</option>
                ) : (
                  assignees.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.role})
                    </option>
                  ))
                )}
              </DashboardSelect>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] pt-[8px]">
            {/* Field: Channel */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
                <span>{isEn ? "Communication Channel" : "قناة التواصل"}</span>
                <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
              </label>
              <DashboardSelect
                value={channel}
                onChange={(e) => setChannel(e.target.value as TicketChannel)}
                className={selectClass}
              >
                <option value="portal">{isEn ? "Client Portal (Najiz)" : "بوابة العملاء (ناجز)"}</option>
                <option value="email">{isEn ? "Email" : "البريد الإلكتروني"}</option>
                <option value="phone">{isEn ? "Direct Phone Call" : "الاتصال الهاتفي المباشر"}</option>
                <option value="whatsapp">{isEn ? "Business WhatsApp" : "واتساب الأعمال"}</option>
              </DashboardSelect>
            </div>

            {/* Field: Priority */}
            <div className="md:col-span-2 flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
                <span>{isEn ? "Priority Level" : "مستوى الأولوية"}</span>
                <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-[10px]">
                <button
                  type="button"
                  onClick={() => setPriority("low")}
                  className={cn(
                    "flex items-center justify-between p-[10px] rounded-[6px] border transition-all cursor-pointer",
                    priority === "low"
                      ? "border-[#61564f] dark:border-[#a89f91] bg-[#f5f3ef] dark:bg-[#281c15]"
                      : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#1a120d] hover:bg-[#faf9f6] dark:hover:bg-[#281c15]"
                  )}
                >
                  <div className="flex items-center gap-[6px]">
                    <div className="size-[8px] rounded-full bg-[#61564f] dark:bg-[#a89f91]" />
                    <span className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {isEn ? "Low" : "منخفضة"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#625d5d] dark:text-[#a89f91]">
                    {isEn ? "Within 48h" : "خلال 48 ساعة"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPriority("medium")}
                  className={cn(
                    "flex items-center justify-between p-[10px] rounded-[6px] border transition-all cursor-pointer",
                    priority === "medium"
                      ? "border-[#d97706] dark:border-[#e29d38] bg-[#fff8e1] dark:bg-[#2b1f0c]"
                      : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#1a120d] hover:bg-[#faf9f6] dark:hover:bg-[#281c15]"
                  )}
                >
                  <div className="flex items-center gap-[6px]">
                    <div className="size-[8px] rounded-full bg-[#d97706] dark:bg-[#e29d38]" />
                    <span className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                      {isEn ? "Medium" : "متوسطة"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#b76e00] dark:text-[#e29d38]">
                    {isEn ? "Within 24h" : "خلال 24 ساعة"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPriority("urgent")}
                  className={cn(
                    "flex items-center justify-between p-[10px] rounded-[6px] border transition-all cursor-pointer",
                    priority === "urgent"
                      ? "border-[#ba1a1a] dark:border-[#f87171] bg-[#ffdad6]/50 dark:bg-[#381616]"
                      : "border-[#eae8e4] dark:border-[#38271c] bg-white dark:bg-[#1a120d] hover:bg-[#faf9f6] dark:hover:bg-[#281c15]"
                  )}
                >
                  <div className="flex items-center gap-[6px]">
                    <div className="size-[8px] rounded-full bg-[#ba1a1a] dark:bg-[#f87171]" />
                    <span className="text-[13px] font-bold text-[#ba1a1a] dark:text-[#fca5a5]">
                      {isEn ? "Urgent" : "عاجلة"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#93000a] dark:text-[#f87171]">
                    {isEn ? "Immediate Response" : "استجابة فورية"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Subject, Description & File Upload */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] sm:p-[32px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c] flex flex-col gap-[20px]">
          <div className="border-b border-[#eae8e4] dark:border-[#38271c] pb-[12px]">
            <h2 className="text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold text-[18px] leading-[26px]">
              {isEn ? "Issue Details & Attachments" : "تفاصيل المشكلة والمرفقات"}
            </h2>
          </div>

          {/* Subject Field */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
              <span>{isEn ? "Ticket Subject" : "موضوع التذكرة"}</span>
              <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setFieldErrors((prev) => ({ ...prev, subject: "" }));
              }}
              placeholder={
                isEn
                  ? "e.g., Judicial sessions sync outage with Najiz portal"
                  : "مثال: تعطل مزامنة الجلسات القضائية مع بوابة ناجز"
              }
              className={cn(
                fieldClass,
                "px-[14px] cursor-text text-start",
                fieldErrors.subject && "border-[#ba1a1a] dark:border-[#f87171]"
              )}
            />
            {fieldErrors.subject && (
              <div className="flex items-center gap-1 text-[11px] text-[#ba1a1a] dark:text-[#f87171]">
                <AlertCircle className="size-3 shrink-0" />
                <span>{fieldErrors.subject}</span>
              </div>
            )}
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
              <span>{isEn ? "Technical Details & Notes" : "التفاصيل والملاحظات الفنية"}</span>
              <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setFieldErrors((prev) => ({ ...prev, description: "" }));
              }}
              placeholder={
                isEn
                  ? "Write a detailed description including case numbers, timestamp, and visible error codes..."
                  : "اكتب وصفاً مفصلاً للمشكلة مع ذكر أرقام القضايا، وقت الحدوث، وأي رسائل خطأ ظاهرة للمستخدم..."
              }
              className={cn(
                "w-full bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] p-[14px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-start",
                fieldErrors.description && "border-[#ba1a1a] dark:border-[#f87171]"
              )}
            />
            {fieldErrors.description && (
              <div className="flex items-center gap-1 text-[11px] text-[#ba1a1a] dark:text-[#f87171]">
                <AlertCircle className="size-3 shrink-0" />
                <span>{fieldErrors.description}</span>
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                {isEn ? "Attachments & Supporting Documents" : "المرفقات والوثائق الداعمة"}
              </label>
              {attachedFiles.length > 0 && (
                <span className="text-[11px] font-medium text-[#837565] dark:text-[#a89f91]">
                  {isEn
                    ? `${attachedFiles.length} file(s) attached`
                    : `تم إرفاق ${attachedFiles.length} ملف(ات)`}
                </span>
              )}
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.webp,.json,.log,.txt,application/pdf,image/png,image/jpeg,application/json,text/plain"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Dropzone Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-[8px] p-[24px] flex flex-col items-center justify-center text-center gap-[10px] cursor-pointer transition-all select-none",
                isDragging
                  ? "border-[#9c6402] dark:border-[#e29d38] bg-[#9c6402]/10 dark:bg-[#e29d38]/15 scale-[1.005]"
                  : "border-[#eae8e4] dark:border-[#4d3627] hover:border-[#9c6402]/60 dark:hover:border-[#e29d38]/60 bg-[#faf9f6] dark:bg-[#160e0a]"
              )}
            >
              <div
                className={cn(
                  "size-[48px] rounded-full flex items-center justify-center transition-colors",
                  isDragging
                    ? "bg-[#9c6402]/20 dark:bg-[#e29d38]/25 text-[#9c6402] dark:text-[#e29d38]"
                    : "bg-[#f5f3ef] dark:bg-[#221812] text-[#9c6402] dark:text-[#e29d38]"
                )}
              >
                <UploadCloud className="size-[26px]" />
              </div>
              <div className="flex flex-col items-center gap-[2px]">
                <span className="text-[13px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
                  {isEn ? "Click to upload or drag files here" : "انقر لرفع ملف أو اسحبه إلى هنا"}
                </span>
                <span className="text-[11px] text-[#837565] dark:text-[#a89f91]">
                  {isEn
                    ? "Supports PDF, PNG, JPG, JSON, LOG up to 10MB per file"
                    : "يدعم PDF, PNG, JPG, JSON, LOG بحد أقصى 10 ميجابايت للملف"}
                </span>
              </div>
            </div>

            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-[8px] pt-[6px]">
                {attachedFiles.map((f) => (
                  <div
                    key={f.id}
                    className="bg-[#f0eeea] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] rounded-[6px] px-[10px] py-[6px] flex items-center gap-[8px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7] shadow-xs"
                  >
                    <div className="size-[22px] rounded-[3px] bg-white dark:bg-[#160e0a] border border-[#eae8e4]/60 dark:border-[#422e20] flex items-center justify-center shrink-0">
                      {f.category === "image" ? (
                        <ImageIcon className="size-[13px] text-[#0284c7]" />
                      ) : f.category === "pdf" ? (
                        <FileText className="size-[13px] text-[#dc2626]" />
                      ) : (
                        <FileCode className="size-[13px] text-[#d97706]" />
                      )}
                    </div>
                    <div className="flex items-baseline gap-[6px] min-w-0">
                      <span dir="ltr" className="font-semibold text-[12px] truncate max-w-[200px] text-start font-mono">
                        {f.name}
                      </span>
                      <span className="text-[10px] text-[#837565] dark:text-[#a89f91] shrink-0">
                        ({f.size})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(f.id);
                      }}
                      className="size-[18px] rounded-[3px] hover:bg-[#ba1a1a]/15 text-[#837565] dark:text-[#a89f91] hover:text-[#ba1a1a] dark:hover:text-[#f87171] transition-colors cursor-pointer flex items-center justify-center shrink-0 ms-1"
                      title={isEn ? "Remove file" : "إزالة الملف"}
                    >
                      <X className="size-[12px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="flex items-center gap-[12px] justify-end">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c] px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isEn ? "Cancel & Return" : "إلغاء والعودة"}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#f3c27e] text-white dark:text-[#1c140f] flex items-center gap-[8px] px-[28px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Check className="size-[16px]" />
            <span>{isEn ? "Create & Save Ticket" : "إنشاء التذكرة وحفظها"}</span>
          </button>
        </div>
      </form>

      {/* Confirmation AlertDialog before saving */}
      {showConfirmModal && (
        <ModalPortal isOpen={showConfirmModal}>
          <div
            dir={direction}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-['Cairo']"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSubmitting) setShowConfirmModal(false);
            }}
          >
            <div
              className="bg-white dark:bg-[#221812] rounded-[12px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1)] border border-[#e6e2dc] dark:border-[#38271c] w-full max-w-[500px] overflow-hidden"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-[#f0eeea] dark:border-[#38271c] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#fff8e1] dark:bg-[#2e1d0f] size-[40px] rounded-[10px] flex items-center justify-center text-[#9c6402] shrink-0">
                    <Check className="size-[20px]" />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7]">
                    {t("تأكيد إنشاء التذكرة وحفظها؟", "Confirm Create and Save Ticket?")}
                  </h3>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmModal(false)}
                  className="p-1.5 text-[#837565] dark:text-[#a89f91] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] hover:bg-[#f5f3ef] dark:hover:bg-[#281c15] rounded-[6px] transition-colors cursor-pointer"
                >
                  <X className="size-[18px]" />
                </button>
              </div>

              <div className="p-6 space-y-3 text-start">
                <div className="bg-[#f5f3ef] dark:bg-[#281c15] rounded-[8px] p-3 text-[13px] border border-[#e6e2dc] dark:border-[#38271c] space-y-1">
                  <div>
                    <span className="text-[#837565] dark:text-[#a89f91]">{isEn ? "Client: " : "العميل: "}</span>
                    <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">{selectedClientObj?.firm}</span>
                  </div>
                  <div>
                    <span className="text-[#837565] dark:text-[#a89f91]">{isEn ? "Department: " : "القسم: "}</span>
                    <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">{selectedDeptObj?.name}</span>
                  </div>
                  <div>
                    <span className="text-[#837565] dark:text-[#a89f91]">{isEn ? "Subject: " : "الموضوع: "}</span>
                    <span className="font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">{title}</span>
                  </div>
                </div>

                <p className="text-[13px] text-[#514537] dark:text-[#cdc5bd] leading-[22px]">
                  {t(
                    "هل أنت متأكد من رغبتك في إرسال التذكرة وحفظها بالمنصة؟ سيتم إدراجها فورياً في قائمة تذاكر الدعم وتوجيهها للموظف والقسم المختص.",
                    "Are you sure you want to create and submit this ticket? It will be added to the tickets queue and routed to the assigned department and staff."
                  )}
                </p>
              </div>

              <div className="p-4 bg-[#fbf9f6] dark:bg-[#221812] border-t border-[#f0eeea] dark:border-[#38271c] flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmModal(false)}
                  className="px-5 py-2.5 bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#e6e2dc] text-[#514537] dark:text-[#a89f91] rounded-[6px] text-[13px] font-semibold transition-colors cursor-pointer"
                >
                  {t("إلغاء", "Cancel")}
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmSubmit}
                  className="px-6 py-2.5 bg-[#9c6402] hover:bg-[#855402] text-white rounded-[6px] text-[13px] font-bold shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>{t("جاري الحفظ...", "Saving...")}</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-[16px]" />
                      <span>{t("تأكيد الإنشاء والحفظ", "Confirm & Save")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
