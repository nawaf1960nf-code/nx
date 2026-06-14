"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Languages } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { StreakChip } from "./StreakChip";

export function Header() {
  const { t, locale, toggle } = useLocale();
  const pathname = usePathname();

  const links = [
    { href: "/", label: t.nav.map },
    { href: "/workout", label: t.nav.generator },
    { href: "/calories", label: t.nav.calories },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-base-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-energy-500 text-base-950">
            <Dumbbell className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-base font-bold text-white">{t.brandName}</p>
            <p className="hidden text-[11px] text-energy-100/55 sm:block">{t.tagline}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-white/8 text-white" : "text-energy-100/70 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <StreakChip />
          <button
            type="button"
            onClick={toggle}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 text-sm font-semibold text-energy-100/80 transition-colors hover:text-white"
          >
            <Languages className="h-4 w-4" />
            {locale === "ar" ? "EN" : "ع"}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center justify-center gap-1 border-t border-white/6 py-1.5 md:hidden">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                active ? "bg-white/8 text-white" : "text-energy-100/70 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
