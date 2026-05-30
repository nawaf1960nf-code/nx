"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMessages, type Locale, type Messages } from "./i18n";

interface LocaleContextValue {
  locale: Locale;
  t: Messages;
  setLocale: (l: Locale) => void;
  toggle: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "smep:locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Load saved preference on mount.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "en" || saved === "ar") setLocaleState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  // Reflect locale on <html> (lang + dir) and persist it.
  useEffect(() => {
    const t = getMessages(locale);
    const html = document.documentElement;
    html.lang = locale;
    html.dir = t.dir;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggle = useCallback(
    () => setLocaleState((l) => (l === "en" ? "ar" : "en")),
    [],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, t: getMessages(locale), setLocale, toggle }),
    [locale, setLocale, toggle],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Safe fallback so non-wrapped usage still renders English.
    return {
      locale: "en",
      t: getMessages("en"),
      setLocale: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}
