/**
 * Canonical list-page visual tokens (Client Management reference).
 * Layout order is always: Header → KPIs → Filter (standalone) → Table card → Pagination.
 */

export const LIST_PAGE_STACK =
  "flex flex-col gap-6 w-full shrink-0 font-['Cairo',sans-serif]";

export const DATA_TABLE_CARD =
  "bg-white dark:bg-[#221812] rounded-[8px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-[#f0eeea] dark:border-[#38271c] overflow-hidden w-full shrink-0";

export const TABLE_HEAD_ROW =
  "bg-[#f5f3ef] dark:bg-[#281c15] border-b border-[#eae8e4] dark:border-[#38271c] text-[#514537] dark:text-[#cdc5bd] text-[12px] leading-[18px] font-bold";

export const TABLE_HEAD_CELL =
  "py-[12px] px-[16px] text-start font-bold whitespace-nowrap";

export const TABLE_BODY =
  "divide-y divide-[#f0eeea] dark:divide-[#38271c]";

export const TABLE_ROW =
  "hover:bg-[#faf9f7] dark:hover:bg-[#281c15]/60 transition-colors group";

export const TABLE_CELL = "py-[16px] px-[16px] text-start";

export const ROW_INDEX_BADGE =
  "inline-flex items-center justify-center size-[24px] rounded-[4px] font-mono text-[11px] font-bold text-[#837565] dark:text-[#cdc5bd] bg-[#f5f3ef] dark:bg-[#1a120d] border border-transparent dark:border-[#38271c]";

export const ID_BADGE =
  "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#f4efe6] dark:bg-[#271d15] text-[#78644f] dark:text-[#c4b3a3] border border-[#dfd7cc] dark:border-[#423122]";

export const ACTION_ICON_BUTTON =
  "p-[6px] rounded-[4px] hover:bg-[#eae8e4] dark:hover:bg-[#38271c] text-[#514537] dark:text-[#cdc5bd] hover:text-[#1b1c1a] dark:hover:text-[#fdfbf7] transition-colors cursor-pointer";

export const ACTION_ICON_BUTTON_DANGER =
  "p-[6px] rounded-[4px] hover:bg-[#fef2f2] dark:hover:bg-[#311616] text-[#dc2626] dark:text-[#f87171] transition-colors cursor-pointer";
