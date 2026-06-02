"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { Reveal } from "@/components/ui/Reveal";

export function FAQ() {
  const { t } = useLocale();
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="mx-auto max-w-3xl px-4 py-24">
      <Reveal className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {t.landing.faq.heading}
        </h2>
      </Reveal>

      <div className="space-y-3">
        {t.landing.faq.items.map((item, i) => {
          const isOpen = open === i;
          const triggerId = `${baseId}-faq-trigger-${i}`;
          const panelId = `${baseId}-faq-panel-${i}`;
          return (
            <Reveal key={item.q} delay={i * 0.05}>
              <div className="card-premium overflow-hidden">
                <h3 className="m-0">
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-12 w-full items-center justify-between gap-4 p-5 text-start"
                  >
                    <span className="text-sm font-semibold text-white">{item.q}</span>
                    <motion.span
                      aria-hidden
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-brand-100"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-brand-100/75">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
