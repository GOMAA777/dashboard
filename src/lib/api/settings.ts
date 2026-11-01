"use client";

import { apiRequest } from "./http";

export async function fetchGeneralSettings() {
  return apiRequest("/admin/settings/general", { method: "GET" });
}

export async function updateGeneralSettings(body: Record<string, unknown>) {
  return apiRequest("/admin/settings/general", { method: "POST", body });
}

export async function fetchMailSettings() {
  return apiRequest("/admin/settings/mail", { method: "GET" });
}

export async function updateMailSettings(body: Record<string, unknown>) {
  return apiRequest("/admin/settings/mail", { method: "POST", body });
}

export async function testMailSettings(body: Record<string, unknown>) {
  return apiRequest("/admin/settings/mail/test", { method: "POST", body });
}

export async function fetchServerInfo() {
  return apiRequest("/admin/settings/server-info", { method: "GET" });
}

export async function fetchSystemUpdate() {
  return apiRequest("/admin/settings/system-update", { method: "GET" });
}

export async function startSystemUpdate(body: Record<string, unknown> = {}) {
  return apiRequest("/admin/settings/system-update", {
    method: "POST",
    body,
  });
}

export async function fetchAuditLogs() {
  return apiRequest("/admin/audit-logs", { method: "GET" });
}

export async function fetchCurrencies() {
  return apiRequest("/admin/currencies", { method: "GET" });
}

export async function createCurrency(body: Record<string, unknown>) {
  return apiRequest("/admin/currencies", { method: "POST", body });
}

export async function setDefaultCurrency(currencyId: string | number) {
  return apiRequest(`/admin/currencies/${currencyId}/default`, {
    method: "POST",
  });
}

export async function deleteCurrency(currencyId: string | number) {
  return apiRequest(`/admin/currencies/${currencyId}`, { method: "DELETE" });
}

export async function fetchLanguages() {
  return apiRequest("/admin/languages", { method: "GET" });
}

export async function createLanguage(body: Record<string, unknown>) {
  return apiRequest("/admin/languages", { method: "POST", body });
}

export async function setDefaultLanguage(languageId: string | number) {
  return apiRequest(`/admin/languages/${languageId}/default`, {
    method: "POST",
  });
}

export async function deleteLanguage(languageId: string | number) {
  return apiRequest(`/admin/languages/${languageId}`, { method: "DELETE" });
}
