"use client";

import React from "react";
import { motion } from "motion/react";
import { useUIStore } from "@/stores/use-ui-store";
import { AuthSideVisual } from "./AuthSideVisual";
import { LoginForm } from "./LoginForm";
import { cn } from "@/lib/utils";

export function AuthSplitCard() {
  const { direction } = useUIStore();
  const isRtl = direction === "rtl";

  return (
    <div className="relative z-10 w-full max-w-6xl min-h-[660px] lg:h-[730px] rounded-[36px] sm:rounded-[44px] overflow-hidden flex flex-col lg:flex-row shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-[#2f2a24] bg-[#151311]">
      {/* Visual Brand Showcase Column */}
      <motion.div
        layout="position"
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="h-full hidden lg:block overflow-hidden lg:w-5/12"
      >
        <AuthSideVisual />
      </motion.div>

      {/* Interactive Sign In Form Column */}
      <motion.div
        layout="position"
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          "h-full overflow-hidden lg:w-7/12 transition-all duration-500",
          isRtl
            ? "lg:rounded-s-[44px] shadow-[-10px_0_30px_rgba(0,0,0,0.3)]"
            : "lg:rounded-e-[44px] shadow-[10px_0_30px_rgba(0,0,0,0.3)]"
        )}
      >
        <LoginForm />
      </motion.div>
    </div>
  );
}
