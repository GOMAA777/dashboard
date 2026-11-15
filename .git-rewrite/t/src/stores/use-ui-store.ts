import { create } from "zustand";

export type TableDensity = "compact" | "normal" | "comfortable";
export type ThemePreference = "light" | "dark";
export type AppLanguage = "ar" | "en";
export type TextDirection = "rtl" | "ltr";

interface UIState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  tableDensity: TableDensity;
  theme: ThemePreference;
  language: AppLanguage;
  direction: TextDirection;
  isPageNavigating: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTableDensity: (density: TableDensity) => void;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  setDirection: (dir: TextDirection) => void;
  toggleDirection: () => void;
  setPageNavigating: (navigating: boolean) => void;
}

function applyThemeToDOM(theme: ThemePreference) {
  if (typeof document !== "undefined") {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("app-theme", theme);
    } catch {
      // Ignore in private browsing
    }
  }
}

function applyLanguageToDOM(lang: AppLanguage) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("app-language", lang);
    } catch {
      // Ignore in private browsing
    }
  }
}

function applyDirectionToDOM(dir: TextDirection) {
  if (typeof document !== "undefined") {
    document.documentElement.dir = dir;
    try {
      localStorage.setItem("app-direction", dir);
    } catch {
      // Ignore in private browsing
    }
  }
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  tableDensity: "normal",
  theme: "light",
  language: "ar",
  direction: "rtl",
  isPageNavigating: false,
  setPageNavigating: (navigating: boolean) => set({ isPageNavigating: navigating }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => {
    const next = !get().sidebarCollapsed;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("app-sidebar-collapsed", String(next));
      } catch {
        // Ignore
      }
    }
    set({ sidebarCollapsed: next });
  },
  setSidebarCollapsed: (collapsed) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("app-sidebar-collapsed", String(collapsed));
      } catch {
        // Ignore
      }
    }
    set({ sidebarCollapsed: collapsed });
  },
  setTableDensity: (density) => set({ tableDensity: density }),

  setTheme: (theme: ThemePreference) => {
    applyThemeToDOM(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme: ThemePreference = get().theme === "light" ? "dark" : "light";
    applyThemeToDOM(nextTheme);
    set({ theme: nextTheme });
  },

  setLanguage: (lang: AppLanguage) => {
    applyLanguageToDOM(lang);
    set({ language: lang });
  },

  toggleLanguage: () => {
    const nextLang: AppLanguage = get().language === "ar" ? "en" : "ar";
    applyLanguageToDOM(nextLang);
    set({ language: nextLang });
  },

  setDirection: (dir: TextDirection) => {
    applyDirectionToDOM(dir);
    set({ direction: dir });
  },

  toggleDirection: () => {
    const nextDir: TextDirection = get().direction === "rtl" ? "ltr" : "rtl";
    applyDirectionToDOM(nextDir);
    set({ direction: nextDir });
  },
}));

// Hydrate stored preferences on client initialization
if (typeof window !== "undefined") {
  try {
    const savedTheme = localStorage.getItem("app-theme") as ThemePreference | null;
    if (savedTheme === "light" || savedTheme === "dark") {
      applyThemeToDOM(savedTheme);
      useUIStore.setState({ theme: savedTheme });
    }
    const savedLang = localStorage.getItem("app-language") as AppLanguage | null;
    if (savedLang === "ar" || savedLang === "en") {
      applyLanguageToDOM(savedLang);
      useUIStore.setState({ language: savedLang });
    }
    const savedDir = localStorage.getItem("app-direction") as TextDirection | null;
    if (savedDir === "rtl" || savedDir === "ltr") {
      applyDirectionToDOM(savedDir);
      useUIStore.setState({ direction: savedDir });
    } else {
      applyDirectionToDOM("rtl");
      useUIStore.setState({ direction: "rtl" });
    }
    const savedCollapsed = localStorage.getItem("app-sidebar-collapsed");
    if (savedCollapsed !== null) {
      useUIStore.setState({ sidebarCollapsed: savedCollapsed === "true" });
    }
  } catch {
    // Ignore in private browsing mode
  }
}
