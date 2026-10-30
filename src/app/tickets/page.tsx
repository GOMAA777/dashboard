import React from "react";
import { Metadata } from "next";
import { TicketsView } from "@/features/tickets/components/TicketsView";

export const metadata: Metadata = {
  title: "الدعم الفني وتذاكر العمل | منصة الجودي لإدارة مكاتب وشركات المحاماة",
  description:
    "متابعة وإدارة تذاكر واستفسارات العملاء ومكاتب المحاماة، وتوزيع المهام الإدارية وهيكل الأقسام بالمنصة.",
};

export default function TicketsPage() {
  return <TicketsView />;
}
