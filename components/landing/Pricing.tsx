"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

export function Pricing() {
  const { t } = useLocale();
  const plans = t.landing.pricing.plans;

  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24">
      <Reveal className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {t.landing.pricing.heading}
        </h2>
        <p className="mt-3 text-brand-100/60">{t.landing.pricing.subtitle}</p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, i) => {
          const popular = i === 1;
          return (
            <Reveal key={plan.name} delay={i * 0.1}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl p-7",
                  popular
                    ? "border border-brand-400/40 bg-gradient-to-b from-brand-500/12 to-transparent shadow-glow-brand"
                    : "card-premium",
                )}
              >
                {popular && (
                  <span className="absolute -top-3 start-7 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                    {t.landing.pricing.mostPopular}
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-white">{plan.name}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className="font-display text-4xl font-extrabold text-white">{plan.price}</span>
                  {plan.price.startsWith("$") && plan.price !== "$0" && (
                    <span className="mb-1 text-sm text-brand-100/50">{t.landing.pricing.perMonth}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-brand-100/60">{plan.desc}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-brand-100/80">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/20 text-success">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="#catalog"
                  className={cn(
                    "mt-7 inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition-all active:scale-[0.97]",
                    popular
                      ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:brightness-110"
                      : "border border-white/15 text-white hover:bg-white/10",
                  )}
                >
                  {t.landing.pricing.cta}
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
