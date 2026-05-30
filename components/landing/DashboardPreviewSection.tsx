"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { Reveal } from "@/components/ui/Reveal";
import { DashboardMockup } from "./DashboardMockup";

export function DashboardPreviewSection() {
  const { t } = useLocale();
  const d = t.landing.dashboardPreview;

  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="right">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-200">
            <Sparkles className="h-3.5 w-3.5" /> {d.badge}
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            {d.heading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-100/70">{d.subtitle}</p>

          <ul className="mt-6 space-y-3">
            {[d.cardAnalytics, d.cardProgress, d.cardInsight].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-brand-100/80">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-success/20 text-success">
                  <Check className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className="group mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            {t.nav.dashboard}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <DashboardMockup />
        </Reveal>
      </div>
    </section>
  );
}
