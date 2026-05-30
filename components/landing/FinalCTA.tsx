"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  const { t } = useLocale();
  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 p-10 text-center sm:p-16">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(99,102,241,0.35), transparent 70%), linear-gradient(180deg, rgba(255,255,255,0.04), transparent)",
            }}
          />
          <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-glow-brand">
            <GraduationCap className="h-7 w-7 text-white" />
          </span>
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {t.landing.finalCta.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-brand-100/70">
            {t.landing.finalCta.subtitle}
          </p>
          <Link
            href="#catalog"
            className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-500 px-8 py-4 text-sm font-semibold text-white shadow-glow-brand transition-all hover:brightness-110 active:scale-[0.97]"
          >
            {t.landing.finalCta.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
