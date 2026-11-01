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

interface CreateTicketViewProps {
  departments: TicketDepartment[];
  assignees: TicketAssignee[];
  clients: TicketClient[];
  onBack: () => void;
  onSaveTicket: (ticket: Ticket) => void;
}

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
    <div
      dir={direction}
      className="flex flex-col gap-[24px] w-full"
    >
      {/* Main Identity & Command Banner */}
      <div
        className="bg-white rounded-[8px] p-[24px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]"
      >
        <div className="flex flex-col gap-[4px] text-start">
          <h1 className="text-[#1b1c1a] font-bold text-[24px] sm:text-[28px] leading-[38px]">
            {isEn ? "Create New Ticket" : "إنشاء تذكرة جديدة"}
          </h1>
          <p className="text-[#514537] text-[13px] sm:text-[14px] leading-[22px]">
            {isEn
              ? "Log the issue and assign department & responsible employee to ensure SLA compliance."
              : "سجّل المشكلة وحدد الجهة والقسم والموظف المسؤول عن متابعتها لضمان الالتزام بمصفوفة اتفاقية مستوى الخدمة (SLA)."}
          </p>
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="bg-white border border-[#eae8e4] hover:bg-[#f5f3ef] text-[#1b1c1a] flex items-center gap-[8px] px-[16px] py-[8px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-colors shrink-0 cursor-pointer"
        >
          <ArrowRight className={`size-[14px] ${isEn ? "rotate-180" : ""}`} />
          <span>{isEn ? "Back" : "العودة"}</span>
        </button>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
        {/* Card 1: Ticket Metadata & Routing */}
        <div className="bg-white rounded-[8px] p-[24px] sm:p-[32px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col gap-[24px]">
          <div className="border-b border-[#eae8e4] pb-[12px] flex items-center justify-between">
            <h2 className="text-[#1b1c1a] font-semibold text-[18px] leading-[26px]">
              {isEn ? "Ticket Metadata & Routing" : "بيانات التذكرة والتوجيه الإداري"}
            </h2>
          </div>

          {/* 3-Column Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {/* Field 1: Client / Law Firm */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center gap-[4px]">
                  <span>{isEn ? "Law Firm / Client" : "المكتب / العميل المستفيد"}</span>
                  <span className="text-[#ba1a1a]">*</span>
                </label>
                <span className="text-[10px] font-bold text-[#625d5d]">
                  {isEn ? "Instant Search" : "بحث فوري"}
                </span>
              </div>
              <div className="relative">
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-white border border-[#eae8e4] rounded-[4px] h-[44px] px-[12px] text-[13px] text-[#1b1c1a] focus:outline-none focus:border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] cursor-pointer"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firm} ({c.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field 2: Department */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center gap-[4px]">
                <span>{isEn ? "Responsible Department" : "القسم المختص"}</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full bg-white border border-[#eae8e4] rounded-[4px] h-[44px] px-[12px] text-[13px] text-[#1b1c1a] focus:outline-none focus:border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 3: Assignee */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center gap-[4px]">
                <span>{isEn ? "Assigned Employee" : "الموظف المسؤول (المكلف)"}</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                value={selectedAssigneeId}
                onChange={(e) => setSelectedAssigneeId(e.target.value)}
                className="w-full bg-white border border-[#eae8e4] rounded-[4px] h-[44px] px-[12px] text-[13px] text-[#1b1c1a] focus:outline-none focus:border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] cursor-pointer"
              >
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Channel and Priority Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px] pt-[8px]">
            {/* Communication Channel */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center gap-[4px]">
                <span>{isEn ? "Communication Channel" : "قناة التواصل"}</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as TicketChannel)}
                className="w-full bg-white border border-[#eae8e4] rounded-[4px] h-[44px] px-[12px] text-[13px] text-[#1b1c1a] focus:outline-none focus:border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] cursor-pointer"
              >
                <option value="portal">{isEn ? "Client Portal (Najiz)" : "بوابة العملاء (ناجز)"}</option>
                <option value="email">{isEn ? "Email" : "البريد الإلكتروني"}</option>
                <option value="phone">{isEn ? "Direct Phone Call" : "الاتصال الهاتفي المباشر"}</option>
                <option value="whatsapp">{isEn ? "Business WhatsApp" : "واتساب الأعمال"}</option>
              </select>
            </div>

            {/* Priority Selection Cards (Spanning 2 columns) */}
            <div className="md:col-span-2 flex flex-col gap-[6px]">
              <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center gap-[4px]">
                <span>{isEn ? "Priority Level" : "مستوى الأولوية"}</span>
                <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-[10px]">
                {/* 1. Low */}
                <button
                  type="button"
                  onClick={() => setPriority("low")}
                  className={`flex items-center justify-between p-[10px] rounded-[6px] border transition-all cursor-pointer ${
                    priority === "low"
                      ? "border-[#61564f] bg-[#f5f3ef]"
                      : "border-[#eae8e4] bg-white hover:bg-[#faf9f6]"
                  }`}
                >
                  <div className="flex items-center gap-[6px]">
                    <div className="size-[8px] rounded-full bg-[#61564f]" />
                    <span className="text-[13px] font-semibold text-[#1b1c1a]">
                      {isEn ? "Low" : "منخفضة"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#625d5d]">
                    {isEn ? "Within 48h" : "خلال 48 ساعة"}
                  </span>
                </button>

                {/* 2. Medium */}
                <button
                  type="button"
                  onClick={() => setPriority("medium")}
                  className={`flex items-center justify-between p-[10px] rounded-[6px] border transition-all cursor-pointer ${
                    priority === "medium"
                      ? "border-[#d97706] bg-[#fff8e1]"
                      : "border-[#eae8e4] bg-white hover:bg-[#faf9f6]"
                  }`}
                >
                  <div className="flex items-center gap-[6px]">
                    <div className="size-[8px] rounded-full bg-[#d97706]" />
                    <span className="text-[13px] font-semibold text-[#1b1c1a]">
                      {isEn ? "Medium" : "متوسطة"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#b76e00]">
                    {isEn ? "Within 24h" : "خلال 24 ساعة"}
                  </span>
                </button>

                {/* 3. Urgent */}
                <button
                  type="button"
                  onClick={() => setPriority("urgent")}
                  className={`flex items-center justify-between p-[10px] rounded-[6px] border transition-all cursor-pointer ${
                    priority === "urgent"
                      ? "border-[#ba1a1a] bg-[#ffdad6]/50"
                      : "border-[#eae8e4] bg-white hover:bg-[#faf9f6]"
                  }`}
                >
                  <div className="flex items-center gap-[6px]">
                    <div className="size-[8px] rounded-full bg-[#ba1a1a]" />
                    <span className="text-[13px] font-bold text-[#ba1a1a]">
                      {isEn ? "Urgent" : "عاجلة"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#93000a]">
                    {isEn ? "Immediate Response" : "استجابة فورية"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Subject, Description & File Upload */}
        <div className="bg-white rounded-[8px] p-[24px] sm:p-[32px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] border border-[#eae8e4]/60 flex flex-col gap-[20px]">
          <div className="border-b border-[#eae8e4] pb-[12px]">
            <h2 className="text-[#1b1c1a] font-semibold text-[18px] leading-[26px]">
              {isEn ? "Issue Details & Attachments" : "تفاصيل المشكلة والمرفقات"}
            </h2>
          </div>

          {/* Ticket Subject */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center gap-[4px]">
              <span>{isEn ? "Ticket Subject" : "موضوع التذكرة"}</span>
              <span className="text-[#ba1a1a]">*</span>
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
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] h-[44px] px-[14px] text-[13px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-start"
            />
          </div>

          {/* Ticket Description */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[14px] font-semibold text-[#1b1c1a] flex items-center gap-[4px]">
              <span>{isEn ? "Technical Details & Notes" : "التفاصيل والملاحظات الفنية"}</span>
              <span className="text-[#ba1a1a]">*</span>
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
              className="w-full bg-white border border-[#eae8e4] rounded-[4px] p-[14px] text-[13px] text-[#1b1c1a] placeholder:text-[#837565] focus:outline-none focus:border-[#9c6402] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-start"
            />
          </div>

          {/* File Upload Dropzone */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[14px] font-semibold text-[#1b1c1a]">
              {isEn ? "Attachments & Supporting Documents" : "المرفقات والوثائق الداعمة"}
            </label>
            <div className="border-2 border-dashed border-[#eae8e4] hover:border-[#9c6402]/50 bg-[#faf9f6] rounded-[8px] p-[24px] flex flex-col items-center justify-center text-center gap-[8px] cursor-pointer transition-colors">
              <UploadCloud className="size-[32px] text-[#9c6402]" />
              <div className="flex flex-col items-center">
                <span className="text-[13px] font-semibold text-[#1b1c1a]">
                  {isEn ? "Click to upload or drag files here" : "انقر لرفع ملف أو اسحبه إلى هنا"}
                </span>
                <span className="text-[11px] text-[#837565]">
                  {isEn
                    ? "Supports PDF, PNG, JPG, JSON, LOG up to 10MB per file"
                    : "يدعم PDF, PNG, JPG, JSON, LOG بحد أقصى 10 ميجابايت للملف"}
                </span>
              </div>
            </div>

            {/* Uploaded Files Preview Chips */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-[8px] pt-[6px]">
                {attachedFiles.map((f) => (
                  <div
                    key={f}
                    className="bg-[#f0eeea] border border-[#eae8e4] rounded-[4px] px-[10px] py-[4px] flex items-center gap-[6px] text-[12px] text-[#1b1c1a]"
                  >
                    <FileText className="size-[13px] text-[#9c6402]" />
                    <span>{f}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(f)}
                      className="text-[#837565] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                    >
                      <X className="size-[12px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Area */}
        <div className="flex items-center gap-[12px] justify-end">
          <button
            type="button"
            onClick={onBack}
            className="bg-[#f0eeea] hover:bg-[#eae8e4] text-[#1b1c1a] px-[20px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] transition-colors cursor-pointer"
          >
            {isEn ? "Cancel & Return" : "إلغاء والعودة"}
          </button>
          <button
            type="submit"
            className="bg-[#9c6402] hover:bg-[#855402] text-white flex items-center gap-[8px] px-[28px] py-[10px] rounded-[4px] font-semibold text-[14px] leading-[20px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all cursor-pointer"
          >
            <Check className="size-[16px]" />
            <span>{isEn ? "Create & Save Ticket" : "إنشاء التذكرة وحفظها"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
