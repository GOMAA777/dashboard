"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  UploadCloud,
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  Ticket,
  TicketPriority,
  TicketChannel,
  TicketDepartment,
  TicketAssignee,
  TicketClient,
} from "../types/tickets.types";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CreateTicketViewProps {
  departments: TicketDepartment[];
  assignees: TicketAssignee[];
  clients: TicketClient[];
  onBack: () => void;
  onSaveTicket: (ticket: Ticket) => void;
}

const fieldClass =
  "w-full bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] h-[44px] px-[12px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] cursor-pointer";

export function CreateTicketView({
  departments,
  assignees,
  clients,
  onBack,
  onSaveTicket,
}: CreateTicketViewProps) {
  const { direction, isEn } = useLanguage();
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || "");
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || "");
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(assignees[0]?.id || "");
  const [channel, setChannel] = useState<TicketChannel>("portal");
  const [priority, setPriority] = useState<TicketPriority>("urgent");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<string[]>([
    "system_error_log.txt",
    "court_notice_snapshot.png",
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error(isEn ? "Please enter ticket subject" : "يرجى إدخال موضوع التذكرة");
      return;
    }

    if (!description.trim()) {
      toast.error(isEn ? "Please enter problem details and notes" : "يرجى إدخال تفاصيل المشكلة والملاحظات");
      return;
    }

    const client = clients.find((c) => c.id === selectedClientId) || clients[0];
    const dept = departments.find((d) => d.id === selectedDeptId) || departments[0];
    const assignee = assignees.find((a) => a.id === selectedAssigneeId) || assignees[0];

    const getChannelLabel = (ch: TicketChannel) => {
      switch (ch) {
        case "portal":
          return isEn ? "Client Portal (Najiz)" : "بوابة العملاء (ناجز)";
        case "email":
          return isEn ? "Email" : "البريد الإلكتروني";
        case "phone":
          return isEn ? "Direct Phone Call" : "الاتصال الهاتفي";
        case "whatsapp":
          return isEn ? "Business WhatsApp" : "واتساب الأعمال";
      }
    };

    const newTicket: Ticket = {
      id: `tck-${Date.now()}`,
      ticketNumber: `#TCK-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      description: description.trim(),
      client,
      department: {
        id: dept.id,
        name: dept.name,
        code: dept.code,
      },
      assignee,
      priority,
      status: "open",
      channel,
      channelLabel: getChannelLabel(channel),
      category: isEn ? "Operational Support" : "دعم تشغيلي",
      createdAt: isEn ? "Now - Today" : "الآن - اليوم",
      updatedAt: isEn ? "1 min ago" : "منذ دقيقة",
      attachments: attachedFiles.map((f, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        name: f,
        size: isEn ? "450 KB" : "450 كيلوبايت",
        typeLabel: isEn ? "Attachment" : "ملف مرفق",
        category: f.endsWith(".png") ? "image" : "log",
        verifiedStatus: isEn ? "Verified & Clean" : "سليم وموثق",
      })),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: client.name,
          senderRole: client.firm,
          senderInitials: client.name.slice(0, 2),
          isStaff: false,
          timestamp: isEn ? "Just now" : "الآن",
          content: description.trim(),
        },
      ],
      auditEvents: [
        {
          id: `aud-${Date.now()}`,
          action: isEn ? "Ticket created successfully" : "تم إنشاء التذكرة بنجاح",
          performer: isEn ? "System Administrator" : "مشرف النظام",
          timestamp: isEn ? "Just now" : "الآن",
        },
      ],
    };

    onSaveTicket(newTicket);
  };

  const removeFile = (fileName: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f !== fileName));
  };

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
          className="bg-white dark:bg-[#2d1f16] border border-[#eae8e4] dark:border-[#4d3627] hover:bg-[#f5f3ef] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[8px] px-[16px] py-[8px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0 cursor-pointer"
        >
          <ArrowRight className={`size-[14px] ${isEn ? "rotate-180" : ""}`} />
          <span>{isEn ? "Back" : "العودة"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
        {/* Card 1: Ticket Metadata & Routing */}
        <div className="bg-white dark:bg-[#221812] rounded-[8px] p-[24px] sm:p-[32px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 dark:border-[#38271c] flex flex-col gap-[24px]">
          <div className="border-b border-[#eae8e4] dark:border-[#38271c] pb-[12px] flex items-center justify-between">
            <h2 className="text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold text-[18px] leading-[26px]">
              {isEn ? "Ticket Metadata & Routing" : "بيانات التذكرة والتوجيه الإداري"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
                  <span>{isEn ? "Law Firm / Client" : "المكتب / العميل المستفيد"}</span>
                  <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
                </label>
                <span className="text-[10px] font-bold text-[#625d5d] dark:text-[#a89f91]">
                  {isEn ? "Instant Search" : "بحث فوري"}
                </span>
              </div>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className={fieldClass}
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firm} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
                <span>{isEn ? "Responsible Department" : "القسم المختص"}</span>
                <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className={fieldClass}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
                <span>{isEn ? "Assigned Employee" : "الموظف المسؤول (المكلف)"}</span>
                <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
              </label>
              <select
                value={selectedAssigneeId}
                onChange={(e) => setSelectedAssigneeId(e.target.value)}
                className={fieldClass}
              >
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] pt-[8px]">
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
                <span>{isEn ? "Communication Channel" : "قناة التواصل"}</span>
                <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as TicketChannel)}
                className={fieldClass}
              >
                <option value="portal">{isEn ? "Client Portal (Najiz)" : "بوابة العملاء (ناجز)"}</option>
                <option value="email">{isEn ? "Email" : "البريد الإلكتروني"}</option>
                <option value="phone">{isEn ? "Direct Phone Call" : "الاتصال الهاتفي المباشر"}</option>
                <option value="whatsapp">{isEn ? "Business WhatsApp" : "واتساب الأعمال"}</option>
              </select>
            </div>

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

          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
              <span>{isEn ? "Ticket Subject" : "موضوع التذكرة"}</span>
              <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isEn
                  ? "e.g., Judicial sessions sync outage with Najiz portal"
                  : "مثال: تعطل مزامنة الجلسات القضائية مع بوابة ناجز"
              }
              className={cn(fieldClass, "px-[14px] cursor-text text-start")}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7] flex items-center gap-[4px]">
              <span>{isEn ? "Technical Details & Notes" : "التفاصيل والملاحظات الفنية"}</span>
              <span className="text-[#ba1a1a] dark:text-[#f87171]">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isEn
                  ? "Write a detailed description including case numbers, timestamp, and visible error codes..."
                  : "اكتب وصفاً مفصلاً للمشكلة مع ذكر أرقام القضايا، وقت الحدوث، وأي رسائل خطأ ظاهرة للمستخدم..."
              }
              className="w-full bg-[#f5f3ef] dark:bg-[#160e0a] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] p-[14px] text-[13px] text-[#1b1c1a] dark:text-[#fdfbf7] placeholder:text-[#837565] dark:placeholder:text-[#8e8680] focus:outline-none focus:border-[#9c6402] dark:focus:border-[#e29d38] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-start"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-semibold text-[#1b1c1a] dark:text-[#fdfbf7]">
              {isEn ? "Attachments & Supporting Documents" : "المرفقات والوثائق الداعمة"}
            </label>
            <div className="border-2 border-dashed border-[#eae8e4] dark:border-[#4d3627] hover:border-[#9c6402]/50 dark:hover:border-[#e29d38]/60 bg-[#faf9f6] dark:bg-[#160e0a] rounded-[8px] p-[24px] flex flex-col items-center justify-center text-center gap-[8px] cursor-pointer transition-colors">
              <UploadCloud className="size-[32px] text-[#9c6402] dark:text-[#e29d38]" />
              <div className="flex flex-col items-center">
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

            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-[8px] pt-[6px]">
                {attachedFiles.map((f) => (
                  <div
                    key={f}
                    className="bg-[#f0eeea] dark:bg-[#281c15] border border-[#eae8e4] dark:border-[#38271c] rounded-[4px] px-[10px] py-[4px] flex items-center gap-[6px] text-[12px] text-[#1b1c1a] dark:text-[#fdfbf7]"
                  >
                    <FileText className="size-[13px] text-[#9c6402] dark:text-[#e29d38]" />
                    <span>{f}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(f)}
                      className="text-[#837565] dark:text-[#a89f91] hover:text-[#ba1a1a] dark:hover:text-[#f87171] transition-colors cursor-pointer"
                    >
                      <X className="size-[12px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-[12px] justify-end">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#f0eeea] dark:bg-[#281c15] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#1b1c1a] dark:text-[#fdfbf7] border border-transparent dark:border-[#38271c] px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] transition-colors cursor-pointer"
          >
            {isEn ? "Cancel & Return" : "إلغاء والعودة"}
          </button>
          <button
            type="submit"
            className="bg-[#9c6402] dark:bg-[#e29d38] hover:bg-[#855402] dark:hover:bg-[#f3c27e] text-white dark:text-[#1c140f] flex items-center gap-[8px] px-[28px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
          >
            <Check className="size-[16px]" />
            <span>{isEn ? "Create & Save Ticket" : "إنشاء التذكرة وحفظها"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
