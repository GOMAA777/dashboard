"use client";

import React from "react";
import { GatewayFilterStatus } from "../types/payment-gateways.types";

interface GatewaysFilterBarProps {
  filter: GatewayFilterStatus;
  onFilterChange: (status: GatewayFilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  activeCount: number;
  disabledCount: number;
}

export function GatewaysFilterBar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  totalCount,
  activeCount,
  disabledCount,
}: GatewaysFilterBarProps) {
  return (
    <div className="bg-white rounded-[16px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#eae8e4]/60">
      {/* Right side in RTL: Segmented Filter Tabs */}
      <div className="bg-[#f5f3ef] rounded-[8px] p-1 flex items-center gap-1 order-2 sm:order-1 w-full sm:w-auto justify-center">
        <button
          type="button"
          onClick={() => onFilterChange("disabled")}
          className={`px-4 py-1.5 rounded-[4px] text-xs transition-all cursor-pointer ${
            filter === "disabled"
              ? "bg-white text-[#1c140f] font-bold shadow-xs"
              : "text-[#514537] font-semibold hover:text-[#1c140f]"
          }`}
        >
          المعطلة ({disabledCount})
        </button>
        <button
          type="button"
          onClick={() => onFilterChange("active")}
          className={`px-4 py-1.5 rounded-[4px] text-xs transition-all cursor-pointer ${
            filter === "active"
              ? "bg-white text-[#1c140f] font-bold shadow-xs"
              : "text-[#514537] font-semibold hover:text-[#1c140f]"
          }`}
        >
          النشطة ({activeCount})
        </button>
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={`px-4 py-1.5 rounded-[4px] text-xs transition-all cursor-pointer ${
            filter === "all"
              ? "bg-white text-[#1c140f] font-bold shadow-xs"
              : "text-[#514537] font-semibold hover:text-[#1c140f]"
          }`}
        >
          الكل ({totalCount})
        </button>
      </div>

      {/* Left side in RTL: Search Input */}
      <div className="bg-[#f5f3ef] rounded-[8px] w-full sm:w-[320px] flex items-center px-4 py-2 gap-2.5 order-1 sm:order-2 focus-within:ring-1 focus-within:ring-[#9c6402]/30 transition-all">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="البحث عن بوابة، بروتوكول، أو معرّف..."
          className="bg-transparent text-xs text-[#1c140f] placeholder-[#837565] outline-none w-full text-right font-sans"
          dir="rtl"
        />
        <img
          alt=""
          className="size-[13.5px] shrink-0 opacity-70"
          src="/figma/payment-gateways/search-icon.svg"
        />
      </div>
    </div>
  );
}
