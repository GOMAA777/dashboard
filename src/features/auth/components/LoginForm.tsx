"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  LogIn,
  Loader2,
  CircleAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";
import { LoginInput } from "../schemas/login.schema";
import { loginAction } from "../actions/login.action";
import { AlJoudyLogo } from "@/components/shared/BrandLogos";
import { getAuthSession, setAuthSession } from "@/lib/auth-client";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps = {}) {
  const { language, toggleLanguage } = useUIStore();
  const t = translations[language].auth;
  const brand = translations[language].brand;

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);

  // Auto redirect to dashboard if already authenticated (only on separate /login page)
  useEffect(() => {
    if (!onLoginSuccess && getAuthSession()) {
      const target =
        typeof window !== "undefined" && window.location.pathname.includes("/login")
          ? window.location.pathname.replace(/\/login\/?$/, "") || "/"
          : withBasePath("/");
      window.location.replace(target.endsWith("/") ? target : `${target}/`);
    }
  }, [onLoginSuccess]);

  const { register, handleSubmit, watch } = useForm<LoginInput>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const identifierValue = watch("identifier");
  const passwordValue = watch("password");

  useEffect(() => {
    if (formError) setFormError(null);
    // Clear banner as soon as the user edits either field.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional clear-on-edit
  }, [identifierValue, passwordValue]);

  const showLoginError = (message: string) => {
    setFormError(message);
    setShakeKey((k) => k + 1);
    toast.error(message);
  };

  const handleFinishLogin = () => {
    toast.success(t.loginSuccess);
    onLoginSuccess?.();
    // Hard navigation so every route remounts AuthGate with a fresh session read.
    const home = withBasePath("/");
    window.location.assign(home.endsWith("/") ? home : `${home}/`);
  };

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      const res = await loginAction(data);
      if (res?.data?.success) {
        // Real login already persisted the Sanctum token in loginAdmin/setAuthSession.
        // Only seed a bypass token when AUTH_BYPASS fell back and nothing was stored.
        if (!getAuthSession() && res.data.user) {
          setAuthSession("bypass-test-token", res.data.user);
        }
        handleFinishLogin();
        return;
      }
      showLoginError(res?.serverError || t.loginFailedTitle);
    } catch {
      showLoginError(t.loginFailedTitle);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "peer w-full h-13 rounded-full ps-5 text-sm bg-white dark:bg-[#281c15] text-[#1c1917] dark:text-[#fdfbf7] focus:outline-none transition-all shadow-2xs";
  const inputOk =
    "border border-[#ded5c6] dark:border-[#38271c] focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15";
  const inputBad =
    "border-2 border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-3 focus:ring-red-500/20";

  return (
    <div className="w-full h-full bg-white dark:bg-[#1a120d] p-8 md:p-12 lg:p-16 flex flex-col justify-between select-none overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={language}
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full flex flex-col justify-between"
        >
          {/* Top Bar: Brand Logo & Sign Up Link */}
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name (Static Display) */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shadow-2xs">
                <AlJoudyLogo className="w-9 h-9" priority />
              </div>
              <span className="text-lg font-extrabold text-[#c29547] dark:text-[#d4a759] tracking-tight">
                {brand.name}
              </span>
            </div>

            {/* Secure Lawyers Portal Badge */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#faf5eb] dark:bg-[#281c15] text-[#c29547] dark:text-[#d4a759] border border-[#eeddbb] dark:border-[#382b18] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c29547]" />
              <span>
                {language === "ar" ? "بوابة الدخول المصرح بها" : "Authorized Portal"}
              </span>
            </div>
          </div>

          {/* Main Form Center Area */}
          <div className="max-w-md w-full mx-auto my-auto py-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] dark:text-[#fdfbf7] text-start mb-8 tracking-tight">
              {t.signIn}
            </h1>

            <noscript>
              <p className="mb-4 text-sm font-semibold text-red-600">
                يجب تفعيل JavaScript لتسجيل الدخول إلى لوحة التحكم.
              </p>
            </noscript>

            <motion.form
              key={shakeKey}
              method="post"
              action="#"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit(onSubmit)(event);
              }}
              className="space-y-4 text-start"
              animate={
                formError
                  ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
                  : { x: 0 }
              }
              transition={{ duration: 0.45 }}
            >
              <AnimatePresence>
                {formError ? (
                  <motion.div
                    key="login-error"
                    role="alert"
                    aria-live="assertive"
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-1 flex items-start gap-3 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-[#2a1412] px-4 py-3.5 text-start shadow-[0_4px_16px_rgba(220,38,38,0.12)]">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400">
                        <CircleAlert className="size-4" aria-hidden />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-[13px] font-bold text-red-700 dark:text-red-300">
                          {t.loginFailedTitle}
                        </p>
                        <p className="text-[12px] leading-5 text-red-600/90 dark:text-red-300/80">
                          {formError === t.loginFailedTitle
                            ? t.loginFailedHint
                            : formError}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Email or Username Pill Input with Animated Floating Label */}
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    id="identifier"
                    type="text"
                    placeholder=" "
                    aria-invalid={!!formError}
                    {...register("identifier")}
                    className={cn(inputBase, "pe-5", formError ? inputBad : inputOk)}
                  />
                  <label
                    htmlFor="identifier"
                    className={cn(
                      "pointer-events-none absolute start-5 top-0 -translate-y-1/2 bg-white dark:bg-[#1a120d] px-2 text-xs font-bold transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:bg-white dark:peer-focus:bg-[#1a120d] peer-autofill:top-0 peer-autofill:text-xs peer-autofill:font-bold peer-autofill:bg-white dark:peer-autofill:bg-[#1a120d]",
                      formError
                        ? "text-red-600 dark:text-red-400 peer-placeholder-shown:text-red-500/80 peer-focus:text-red-600 dark:peer-focus:text-red-400"
                        : "text-[#c29547] dark:text-[#d4a759] peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#8e8680] peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759]"
                    )}
                  >
                    {t.emailOrUsername}
                  </label>
                </div>
              </div>

              {/* Password Pill Input with Animated Floating Label */}
              <div className="space-y-1.5">
                <div className="relative flex items-center">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    aria-invalid={!!formError}
                    {...register("password")}
                    className={cn(inputBase, "pe-12", formError ? inputBad : inputOk)}
                  />
                  <label
                    htmlFor="password"
                    className={cn(
                      "pointer-events-none absolute start-5 top-0 -translate-y-1/2 bg-white dark:bg-[#1a120d] px-2 text-xs font-bold transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:bg-white dark:peer-focus:bg-[#1a120d] peer-autofill:top-0 peer-autofill:text-xs peer-autofill:font-bold peer-autofill:bg-white dark:peer-autofill:bg-[#1a120d]",
                      formError
                        ? "text-red-600 dark:text-red-400 peer-placeholder-shown:text-red-500/80 peer-focus:text-red-600 dark:peer-focus:text-red-400"
                        : "text-[#c29547] dark:text-[#d4a759] peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#8e8680] peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759]"
                    )}
                  >
                    {t.password}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-4 p-1 text-[#8c8279] dark:text-[#8e8680] hover:text-[#c29547] dark:hover:text-[#d4a759] transition-colors cursor-pointer z-10"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In Primary Pill Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12.5 rounded-full bg-gradient-to-r from-[#d4a759] via-[#c29547] to-[#b38032] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(194,149,71,0.35)] hover:shadow-[0_8px_25px_rgba(194,149,71,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.signingIn}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{t.signInButton}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </div>

          {/* Bottom Footer: Copyright & Language Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c8279] dark:text-[#8e8680] pt-4 border-t border-[#ded5c6]/40 dark:border-[#38271c]/60">
            <span className="text-[11px]">{t.copyright}</span>

            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="hover:text-[#c29547] dark:hover:text-[#d4a759] transition-colors"
              >
                {t.contactUs}
              </Link>

              <button
                type="button"
                onClick={toggleLanguage}
                className="font-semibold text-[#524b43] dark:text-[#cdc5bd] hover:text-[#c29547] dark:hover:text-[#d4a759] transition-colors cursor-pointer"
                title={language === "ar" ? "التبديل إلى English" : "Switch to العربية"}
              >
                {language === "ar" ? "العربية" : "English"}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
