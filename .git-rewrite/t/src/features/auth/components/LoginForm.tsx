"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ShieldCheck, LogIn, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useUIStore } from "@/stores/use-ui-store";
import { translations } from "@/lib/i18n";
import { loginSchema, LoginInput } from "../schemas/login.schema";
import { loginAction } from "../actions/login.action";
import { AlJoudyLogo } from "@/components/shared/BrandLogos";
import { setAuthSession, getAuthSession } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const { language, toggleLanguage } = useUIStore();
  const t = translations[language].auth;
  const brand = translations[language].brand;

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto redirect to dashboard if already authenticated
  useEffect(() => {
    if (getAuthSession()) {
      router.replace("/");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    try {
      const res = await loginAction(data);
      if (res?.data?.success) {
        setAuthSession();
        toast.success(t.loginSuccess);
        router.push("/");
      } else {
        toast.error(res?.serverError || "Failed to sign in. Please check credentials.");
      }
    } catch {
      toast.error("An error occurred during sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full bg-white dark:bg-[#1a1816] p-8 md:p-12 lg:p-16 flex flex-col justify-between select-none overflow-hidden">
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
        <div className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-[#faf5eb] dark:bg-[#201c17] text-[#c29547] dark:text-[#d4a759] border border-[#eeddbb] dark:border-[#382b18] shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#c29547]" />
          <span>{language === "ar" ? "بوابة الدخول المصرح بها" : "Authorized Portal"}</span>
        </div>
      </div>

      {/* Main Form Center Area */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c1917] dark:text-[#f5f4f0] text-start mb-8 tracking-tight">
          {t.signIn}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-start">
          {/* Email or Username Pill Input with Animated Floating Label */}
          <div className="space-y-1.5">
            <div className="relative">
              <input
                id="identifier"
                type="text"
                placeholder=" "
                {...register("identifier")}
                className="peer w-full h-13 rounded-full ps-5 pe-5 text-sm bg-white dark:bg-[#201d1a] text-[#1c1917] dark:text-[#f5f4f0] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15 transition-all shadow-2xs"
              />
              <label
                htmlFor="identifier"
                className="pointer-events-none absolute start-5 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1816] px-2 text-xs font-bold text-[#c29547] dark:text-[#d4a759] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#787166] peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759] peer-focus:bg-white dark:peer-focus:bg-[#1a1816] peer-autofill:top-0 peer-autofill:text-xs peer-autofill:font-bold peer-autofill:text-[#c29547] peer-autofill:bg-white dark:peer-autofill:bg-[#1a1816]"
              >
                {t.emailOrUsername}
              </label>
            </div>
            {errors.identifier && (
              <p className="text-[11px] font-medium text-red-500 px-4">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Pill Input with Animated Floating Label */}
          <div className="space-y-1.5">
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                {...register("password")}
                className="peer w-full h-13 rounded-full ps-5 pe-12 text-sm bg-white dark:bg-[#201d1a] text-[#1c1917] dark:text-[#f5f4f0] border border-[#ded5c6] dark:border-[#2f2a24] focus:outline-none focus:border-[#c29547] dark:focus:border-[#d4a759] focus:ring-3 focus:ring-[#c29547]/15 transition-all shadow-2xs"
              />
              <label
                htmlFor="password"
                className="pointer-events-none absolute start-5 top-0 -translate-y-1/2 bg-white dark:bg-[#1a1816] px-2 text-xs font-bold text-[#c29547] dark:text-[#d4a759] transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#8c8279] dark:peer-placeholder-shown:text-[#787166] peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:font-bold peer-focus:text-[#c29547] dark:peer-focus:text-[#d4a759] peer-focus:bg-white dark:peer-focus:bg-[#1a1816] peer-autofill:top-0 peer-autofill:text-xs peer-autofill:font-bold peer-autofill:text-[#c29547] peer-autofill:bg-white dark:peer-autofill:bg-[#1a1816]"
              >
                {t.password}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-4 p-1 text-[#8c8279] dark:text-[#787166] hover:text-[#c29547] dark:hover:text-[#d4a759] transition-colors cursor-pointer z-10"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] font-medium text-red-500 px-4">
                {errors.password.message}
              </p>
            )}
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
        </form>
      </div>

      {/* Bottom Footer: Copyright & Language Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c8279] dark:text-[#787166] pt-4 border-t border-[#ded5c6]/40 dark:border-[#2f2a24]/60">
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
            className="font-semibold text-[#524b43] dark:text-[#c4bcb1] hover:text-[#c29547] dark:hover:text-[#d4a759] transition-colors cursor-pointer"
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
