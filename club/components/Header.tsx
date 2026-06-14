"use client";

import { Dumbbell, Languages } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

export function Header() {
  const { t, locale, toggle } = useLocale();
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-base-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-energy-500 text-base-950">
            <Dumbbell className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-bold text-white">{t.brandName}</p>
            <p className="text-[11px] text-energy-100/55">{t.tagline}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggle}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 text-sm font-semibold text-energy-100/80 transition-colors hover:text-white"
        >
          <Languages className="h-4 w-4" />
          {locale === "ar" ? "EN" : "ع"}
        </button>
      </div>
    </header>
  );
}
