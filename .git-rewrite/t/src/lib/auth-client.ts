"use client";

export function setAuthSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("aljudy_auth", "true");
    document.cookie = "aljudy_auth=true; path=/; max-age=604800; SameSite=Lax";
  } catch {}
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("aljudy_auth");
    document.cookie = "aljudy_auth=; path=/; max-age=0";
  } catch {}
}

export function getAuthSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      localStorage.getItem("aljudy_auth") === "true" ||
      document.cookie.includes("aljudy_auth=true")
    );
  } catch {
    return false;
  }
}
