"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, BookOpen, Home, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale-context";

export function Navbar() {
  const pathname = usePathname();
  const { t, toggle } = useLocale();

  const links = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/study", label: t.nav.study, icon: BookOpen },
    { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav className="glass-strong mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-600/40">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <span className="hidden font-display text-sm font-bold tracking-tight text-white sm:block">
            {t.nav.brand}
            <span className="block text-[11px] font-medium text-brand-200/70">
              {t.nav.brandSub}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-white/10 text-white"
                    : "text-brand-100/60 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:block">{label}</span>
              </Link>
            );
          })}

          <button
            onClick={toggle}
            className="ms-1 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-white/10"
            aria-label="Switch language"
          >
            <Languages className="h-4 w-4" />
            {t.switchTo}
          </button>
        </div>
      </nav>
    </header>
  );
}
