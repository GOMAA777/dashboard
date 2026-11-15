"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { withBasePath } from "@/lib/base-path";

export default function RegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const loginUrl = withBasePath("/login");
    window.location.replace(loginUrl.endsWith("/") ? loginUrl : `${loginUrl}/`);
  }, [router]);

  return null;
}
