"use client";

import React from "react";
import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldValidationStatus, OfficeFormValues } from "./office.schema";

export const VALIDATION_FIELD_KEYS: (keyof OfficeFormValues)[] = [
  "ownerName",     // Row 0, Right in RTL: صاحب المكتب
  "firmName",      // Row 0, Left in RTL: اسم المكتب
  "licenseNumber", // Row 1, Right in RTL: رقم الترخيص
  "taxNumber",     // Row 1, Left in RTL: الرقم الضريبي
  "email",         // Row 2, Right in RTL: البريد الإلكتروني
  "phone",         // Row 2, Left in RTL: رقم الجوال
  "landline",      // Row 3, Right in RTL: الهاتف المكتبي
  "city",          // Row 3, Left in RTL: المدينة
  "address",       // Row 4, Right in RTL: العنوان
  "password",      // Row 4, Left in RTL: كلمة المرور
];

interface RealTimeValidationBoxProps {
  fieldStatuses: FieldValidationStatus[];
  activeFieldName: keyof OfficeFormValues;
  onSelectField: (fieldName: keyof OfficeFormValues) => void;
  isShaking?: boolean;
}

export function RealTimeValidationBox({
  fieldStatuses,
  activeFieldName,
  onSelectField,
  isShaking = false,
}: RealTimeValidationBoxProps) {
  // Map fields by name for quick O(1) lookup
  const statusMap = React.useMemo(() => {
    const map = new Map<keyof OfficeFormValues, FieldValidationStatus>();
    for (const status of fieldStatuses) {
      map.set(status.name, status);
    }
    return map;
  }, [fieldStatuses]);

  // Valid count (0 to 10)
  const validCount = React.useMemo(() => {
    return fieldStatuses.filter((s) => s.isValid).length;
  }, [fieldStatuses]);

  // Active field status
  const activeStatus = statusMap.get(activeFieldName) || fieldStatuses[0];

  return (
    <div
      dir="rtl"
      className={cn(
        "bg-white dark:bg-[#1a120d] border border-[#EFF0F5] dark:border-[#38271c] rounded-[16px] p-3 sm:p-3.5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between w-full transition-all text-start",
        isShaking && "animate-subtle-shake ring-2 ring-[#B82128]/50 dark:ring-[#ef4444]/60"
      )}
    >
      <div>
        {/* Top Header: مراجعة البيانات (Right) | X من 10 حقول صحيحة (Left) */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1b1c1a] dark:text-[#fdfbf7] leading-none">
            مراجعة البيانات
          </h3>
          <span className="text-[11.5px] sm:text-[12px] font-normal text-[#64748b] dark:text-[#94a3b8]">
            {validCount} من 10 حقول صحيحة
          </span>
        </div>

        {/* Progress Bar (Green starts on the right in RTL) */}
        <div className="w-full bg-[#E3E4EA] dark:bg-[#2c1e15] h-[4px] rounded-full overflow-hidden flex flex-row-reverse mb-2.5">
          <div
            className="h-full rounded-full transition-all duration-300 bg-[#147F3E] dark:bg-[#10b981]"
            style={{ width: `${(validCount / 10) * 100}%` }}
          />
        </div>

        {/* 2-Column Grid of 10 Fields (Compact height) */}
        <div className="grid grid-cols-2 gap-1.5 mb-2.5">
          {VALIDATION_FIELD_KEYS.map((fieldKey) => {
            const status = statusMap.get(fieldKey);
            if (!status) return null;

            const isActive = fieldKey === activeFieldName;
            const isFilled = status.isFilled;
            const isValid = status.isValid;

            return (
              <button
                key={fieldKey}
                type="button"
                onClick={() => onSelectField(fieldKey)}
                className={cn(
                  "relative h-[28px] sm:h-[30px] rounded-[8px] px-2 sm:px-2.5 flex items-center justify-start gap-1.5 sm:gap-2 cursor-pointer transition-all select-none text-start border-none outline-none",
                  // Active field states
                  isActive && !isValid && isFilled && "bg-[#FEF2F2] dark:bg-[#341616]",
                  isActive && isValid && "bg-[#F4F5F9] dark:bg-[#221812]",
                  isActive && !isFilled && "bg-[#F4F5F9] dark:bg-[#221812]",
                  // Inactive field states
                  !isActive && !isValid && isFilled && "bg-[#FEF2F2] hover:bg-[#fee2e2] dark:bg-[#341616] dark:hover:bg-[#450a0a]",
                  !isActive && isValid && "bg-[#F4F5F9] hover:bg-[#eaecee] dark:bg-[#221812] dark:hover:bg-[#2c1e15]",
                  !isActive && !isFilled && "bg-[#F4F5F9] hover:bg-[#eaecee] dark:bg-[#221812] dark:hover:bg-[#2c1e15]"
                )}
              >
                {/* Right edge indicator bar when active */}
                {isActive && (
                  <span
                    className={cn(
                      "absolute top-0 bottom-0 end-0 w-[2px] rounded-e-[8px]",
                      !isValid && isFilled
                        ? "bg-[#824949] dark:bg-[#ef4444]"
                        : isValid
                        ? "bg-[#147F3E] dark:bg-[#10b981]"
                        : "bg-[#94A3B8] dark:bg-[#64748b]"
                    )}
                  />
                )}

                {/* Icon placed on the RIGHT side in RTL */}
                {!isFilled ? (
                  <span className="size-3 rounded-full border-[1.5px] border-[#94A3B8] dark:border-[#64748b] shrink-0" />
                ) : isValid ? (
                  <Check className="size-3.5 text-[#147F3E] dark:text-[#34d399] stroke-[2.5] shrink-0" />
                ) : (
                  <X className="size-3.5 text-[#B82128] dark:text-[#f87171] stroke-[2.5] shrink-0" />
                )}

                {/* Field Label */}
                <span className="text-[11.5px] sm:text-[12px] font-medium text-[#1b1c1a] dark:text-[#fdfbf7] truncate">
                  {status.shortTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Field Detail Box (Compact height) */}
      {activeStatus && (
        <div
          className={cn(
            "rounded-[10px] p-2.5 transition-all border flex flex-col gap-1.5",
            activeStatus.isFilled && !activeStatus.isValid
              ? "bg-[#FEF2F2] dark:bg-[#2a1414] border-[#F0ACA9] dark:border-[#7f1d1d]"
              : activeStatus.isValid
              ? "bg-[#F0FDF4] dark:bg-[#132c1c] border-[#A7F3D0] dark:border-[#059669]/40"
              : "bg-[#F4F5F9] dark:bg-[#221812] border-[#E2E8F0] dark:border-[#38271c]"
          )}
        >
          {/* Detail Box Header */}
          <h4
            className={cn(
              "text-[12px] sm:text-[12.5px] font-bold text-start leading-tight",
              activeStatus.isFilled && !activeStatus.isValid
                ? "text-[#B82128] dark:text-[#f87171]"
                : activeStatus.isValid
                ? "text-[#147F3E] dark:text-[#34d399]"
                : "text-[#475569] dark:text-[#cbd5e1]"
            )}
          >
            {activeStatus.detailHeader}
          </h4>

          {/* Sub-rules Checklist */}
          <div className="flex flex-col gap-1">
            {activeStatus.rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-1.5 text-start">
                {!activeStatus.isFilled ? (
                  <span className="size-3 rounded-full border-[1.5px] border-[#94A3B8] dark:border-[#64748b] shrink-0" />
                ) : rule.isValid ? (
                  <Check className="size-3.5 text-[#147F3E] dark:text-[#34d399] stroke-[2.5] shrink-0" />
                ) : (
                  <X className="size-3.5 text-[#B82128] dark:text-[#f87171] stroke-[2.5] shrink-0" />
                )}
                <span className="text-[11px] sm:text-[11.5px] text-[#1b1c1a] dark:text-[#fdfbf7] leading-tight">
                  {rule.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Registration Readiness Status */}
      <div className="mt-2.5 pt-2 border-t border-[#EFF0F5] dark:border-[#38271c] flex items-center justify-between text-[11px] select-none">
        {validCount < 10 ? (
          <span className="text-[#b45309] dark:text-[#f59e0b] font-medium flex items-center gap-1.5">
            <AlertCircle className="size-3.5 shrink-0" />
            يرجى إكمال البيانات لمواصلة التسجيل
          </span>
        ) : (
          <span className="text-[#147F3E] dark:text-[#34d399] font-medium flex items-center gap-1.5">
            <Check className="size-3.5 stroke-[2.5] shrink-0" />
            اكتملت جميع البيانات، يمكنك مواصلة التسجيل
          </span>
        )}
      </div>
    </div>
  );
}
