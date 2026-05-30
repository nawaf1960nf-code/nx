"use client";

import { Star } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials() {
  const { t } = useLocale();
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <Reveal className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {t.landing.testimonials.heading}
        </h2>
        <p className="mt-3 text-brand-100/60">{t.landing.testimonials.subtitle}</p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {t.landing.testimonials.items.map((item, i) => (
          <Reveal key={item.name} delay={i * 0.1}>
            <figure className="card-premium flex h-full flex-col p-7">
              <div className="mb-4 flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-brand-100/85">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                  {item.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-brand-100/50">{item.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
