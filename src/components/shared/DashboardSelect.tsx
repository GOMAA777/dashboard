"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardSelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface DashboardSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  containerClassName?: string;
  iconClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  dropdownPlacement?: "top" | "bottom" | "auto";
  optionsList?: DashboardSelectOption[];
  placeholder?: string;
}

/**
 * Helper to recursively extract option values and labels from React children
 */
function extractOptionsFromChildren(children: React.ReactNode): DashboardSelectOption[] {
  const options: DashboardSelectOption[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === React.Fragment) {
      const fragmentProps = child.props as { children?: React.ReactNode };
      options.push(...extractOptionsFromChildren(fragmentProps.children));
    } else if (
      child.type === "option" ||
      (child.props && typeof child.props === "object" && "value" in child.props)
    ) {
      const p = child.props as {
        value?: string | number;
        children?: React.ReactNode;
        disabled?: boolean;
      };
      options.push({
        value: p.value !== undefined ? String(p.value) : "",
        label: p.children !== undefined ? p.children : String(p.value ?? ""),
        disabled: Boolean(p.disabled),
      });
    }
  });

  return options;
}

/**
 * Enterprise Custom Luxury Dashboard Select Component.
 * Replaces the operating system's native ugly select popup with a fully styled,
 * high-fidelity dropdown menu that matches the platform's luxury dark/light theme.
 *
 * - Text on the RIGHT (Arabic text-right)
 * - ChevronDown arrow on the LEFT (smooth rotate-180 when open)
 * - Custom styled floating menu with Cairo typography, rounded borders, and gold accents
 * - Selected item highlighted with Check icon and warm gold tone
 * - Fully accessible with keyboard navigation, click outside, and hidden select for forms
 */
export const DashboardSelect = React.forwardRef<HTMLSelectElement, DashboardSelectProps>(
  (
    {
      className,
      containerClassName,
      iconClassName,
      menuClassName,
      itemClassName,
      dropdownPlacement = "auto",
      optionsList,
      children,
      value,
      defaultValue,
      onChange,
      disabled,
      placeholder,
      name,
      id,
      required,
      ...restProps
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const internalSelectRef = useRef<HTMLSelectElement>(null);
    const uniqueId = useId();
    const selectId = id || uniqueId;

    // Extract options either from prop or from React children
    const options: DashboardSelectOption[] = React.useMemo(() => {
      if (optionsList && optionsList.length > 0) return optionsList;
      return extractOptionsFromChildren(children);
    }, [optionsList, children]);

    // Handle controlled vs uncontrolled value
    const [internalValue, setInternalValue] = useState<string>(() => {
      if (value !== undefined) return String(value);
      if (defaultValue !== undefined) return String(defaultValue);
      return options[0]?.value ?? "";
    });

    const currentValue = value !== undefined ? String(value) : internalValue;

    // Find active option
    const activeOption = options.find((opt) => opt.value === currentValue);

    // Auto placement detection
    const [openDirection, setOpenDirection] = useState<"top" | "bottom">("bottom");

    useEffect(() => {
      if (dropdownPlacement !== "auto") {
        setOpenDirection(dropdownPlacement);
        return;
      }
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        // If less than 240px below and more space above, open upwards
        if (spaceBelow < 240 && rect.top > spaceBelow) {
          setOpenDirection("top");
        } else {
          setOpenDirection("bottom");
        }
      }
    }, [isOpen, dropdownPlacement]);

    // Click outside listener
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen]);

    // Handle selecting an option
    const handleSelectOption = (opt: DashboardSelectOption) => {
      if (opt.disabled || disabled) return;

      setInternalValue(opt.value);
      setIsOpen(false);

      if (onChange) {
        const syntheticEvent = {
          target: { value: opt.value, name: name || selectId },
          currentTarget: { value: opt.value, name: name || selectId },
          persist: () => {},
          preventDefault: () => {},
          stopPropagation: () => {},
        } as unknown as React.ChangeEvent<HTMLSelectElement>;

        onChange(syntheticEvent);
      }

      // Also sync value into hidden select
      if (internalSelectRef.current) {
        internalSelectRef.current.value = opt.value;
      }
    };

    const isPlaceholderActive =
      (!currentValue || activeOption?.value === "" || Boolean(activeOption?.disabled)) &&
      Boolean(placeholder || (activeOption?.value === "" && activeOption?.label));

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full select-none font-['Cairo',sans-serif]", containerClassName)}
      >
        {/* Hidden Native Select for Form Integrations & Accessibility */}
        <select
          ref={(node) => {
            internalSelectRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node;
          }}
          id={selectId}
          name={name}
          value={currentValue}
          disabled={disabled}
          required={required}
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only pointer-events-none"
          onChange={onChange}
        >
          {children}
        </select>

        {/* Visible Custom Luxury Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className={cn(
            "w-full h-[42px] px-3.5 rounded-[8px] border text-[13px] font-semibold",
            "flex items-center justify-between gap-3 text-start transition-all duration-150 cursor-pointer",
            "bg-[#f5f3ef] dark:bg-[#1a120d] text-[#1b1c1a] dark:text-[#fdfbf7]",
            "border-[#eae8e4] dark:border-[#38271c]",
            isOpen
              ? "border-[#9c6402] dark:border-[#c29547] ring-1 ring-[#9c6402] dark:ring-[#c29547] shadow-xs"
              : "hover:border-[#9c6402]/40 dark:hover:border-[#c29547]/50 hover:bg-[#faf9f7] dark:hover:bg-[#221812]",
            disabled && "opacity-60 cursor-not-allowed hover:border-[#eae8e4] dark:hover:border-[#38271c]",
            className
          )}
        >
          {/* Label on the START in RTL/LTR */}
          <span
            className={cn(
              "flex-1 text-start truncate",
              isPlaceholderActive
                ? "text-[#837565] dark:text-[#a89f91] font-normal"
                : "text-[#1b1c1a] dark:text-[#fdfbf7] font-semibold"
            )}
          >
            {activeOption?.label || placeholder || (options[0]?.label ?? "")}
          </span>

          {/* Chevron Arrow on the END in RTL/LTR */}
          <div
            className={cn(
              "shrink-0 flex items-center justify-center text-[#837565] dark:text-[#a89f91] transition-transform duration-200",
              isOpen && "rotate-180 text-[#9c6402] dark:text-[#c29547]",
              iconClassName
            )}
          >
            <ChevronDown className="size-4" />
          </div>
        </button>

        {/* Floating Custom Luxury Dropdown Menu */}
        {isOpen && (
          <div
            role="listbox"
            tabIndex={-1}
            className={cn(
              "absolute z-50 w-full rounded-[8px] p-1.5 shadow-2xl font-['Cairo',sans-serif]",
              "bg-white dark:bg-[#221812] border border-[#eae8e4] dark:border-[#3d2a1d]",
              "max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#d5cec5] dark:scrollbar-thumb-[#453022]",
              "animate-in fade-in-0 zoom-in-95 duration-150",
              openDirection === "top" ? "bottom-full mb-1.5 start-0" : "top-full mt-1.5 start-0",
              menuClassName
            )}
          >
            {options.length === 0 ? (
              <div className="py-2 px-3 text-center text-xs text-[#837565] dark:text-[#a89f91]">
                لا توجد خيارات متاحة
              </div>
            ) : (
              options.map((option) => {
                const isSelected = option.value === currentValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    onClick={() => handleSelectOption(option)}
                    className={cn(
                      "w-full px-3 py-2 rounded-[6px] text-[13px] font-medium font-['Cairo',sans-serif]",
                      "flex items-center justify-between gap-2.5 transition-colors cursor-pointer select-none text-start",
                      option.disabled && "opacity-40 cursor-not-allowed",
                      isSelected
                        ? "bg-[#9c6402]/10 dark:bg-[rgba(226,157,56,0.18)] text-[#9c6402] dark:text-[#e29d38] font-bold"
                        : "text-[#1b1c1a] dark:text-[#fdfbf7] hover:bg-[#faf6f0] dark:hover:bg-[#2c1f17]",
                      itemClassName
                    )}
                  >
                    {/* Option Text on Start */}
                    <span className="flex-1 text-start truncate">
                      {option.label}
                    </span>

                    {/* Checkmark icon on Left */}
                    {isSelected && (
                      <Check className="size-4 text-[#9c6402] dark:text-[#e29d38] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  }
);

DashboardSelect.displayName = "DashboardSelect";
