"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: React.ReactNode;
  isOpen?: boolean;
}

let activeModalCount = 0;

export function ModalPortal({ children, isOpen = true }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      activeModalCount++;
      if (typeof document !== "undefined") {
        document.body.classList.add("modal-open");
      }
      return () => {
        activeModalCount = Math.max(0, activeModalCount - 1);
        if (activeModalCount === 0 && typeof document !== "undefined") {
          document.body.classList.remove("modal-open");
        }
      };
    }
  }, [isOpen, mounted]);

  if (!mounted || !isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}
