import React from "react";
import type { Metadata } from "next";
import { ProfileView } from "@/features/profile/components/ProfileView";

export const metadata: Metadata = {
  title: "الملف الشخصي | منصة الجودي لإدارة مكاتب المحاماة",
  description: "عرض وتعديل بيانات الملف الشخصي وإعدادات الحساب لمشرف النظام العام",
};

export default function ProfilePage() {
  return <ProfileView />;
}
