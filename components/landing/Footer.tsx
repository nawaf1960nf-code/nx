"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-start">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-white">{t.nav.brand}</p>
            <p className="text-[11px] text-brand-100/60">{t.landing.footer.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm text-brand-100/60">
          <Link href="#catalog" className="transition-colors hover:text-white">
            {t.landing.footer.product}
          </Link>
          <Link href="/study" className="transition-colors hover:text-white">
            {t.nav.study}
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-white">
            {t.nav.dashboard}
          </Link>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-brand-100/35">
        © {year} {t.nav.brand}. {t.landing.footer.rights}
      </p>
    </footer>
  );
}
