"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BrainCircuit,
  CalendarRange,
  Dumbbell,
  Flame,
  Languages,
  LineChart,
  UserCircle2,
} from "lucide-react";
import type { ComponentType } from "react";
import { useLocale } from "@/lib/locale-context";
import { StreakChip } from "./StreakChip";

export function Header() {
  const { t, locale, toggle } = useLocale();
  const pathname = usePathname();

  const links: { href: string; label: string; icon: ComponentType<{ className?: string }> }[] = [
    { href: "/", label: t.nav.map, icon: Activity },
    { href: "/exercises", label: t.nav.library, icon: Dumbbell },
    { href: "/workout", label: t.nav.generator, icon: CalendarRange },
    { href: "/calories", label: t.nav.calories, icon: Flame },
    { href: "/consultant", label: t.nav.consultant, icon: BrainCircuit },
    { href: "/progress", label: t.nav.progress, icon: LineChart },
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
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-white/8 text-white" : "text-energy-100/70 hover:text-white"
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <StreakChip />
          <Link
            href="/account"
            aria-label={t.nav.account}
            className={`grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/[0.04] transition-colors hover:text-white ${
              pathname === "/account" ? "text-white" : "text-energy-100/80"
            }`}
          >
            <UserCircle2 className="h-5 w-5" />
          </Link>
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

      {/* Mobile nav — horizontally scrollable icon chips, no wrapping. */}
      <nav className="flex items-center gap-1.5 overflow-x-auto border-t border-white/6 px-3 py-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                active ? "bg-energy-500 text-base-950" : "bg-white/[0.05] text-energy-100/75"
              }`}
            >
              <l.icon className="h-3.5 w-3.5" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
