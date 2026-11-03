"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: React.ReactNode;
  isOpen?: boolean;
}

let activeModalCount = 0;

function lockPageScroll() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.add("modal-open");
  document.body.classList.add("modal-open");
}

function unlockPageScroll() {
  if (typeof document === "undefined") return;
  if (activeModalCount > 0) return;
  document.documentElement.classList.remove("modal-open");
  document.body.classList.remove("modal-open");
}

export function ModalPortal({ children, isOpen = true }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      activeModalCount += 1;
      lockPageScroll();
      return () => {
        activeModalCount = Math.max(0, activeModalCount - 1);
        unlockPageScroll();
      };
    }
  }, [isOpen, mounted]);

  if (!mounted || !isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}
