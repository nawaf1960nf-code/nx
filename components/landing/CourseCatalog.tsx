"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookMarked, Layers, FileQuestion, Plus } from "lucide-react";
import { SUBJECTS, subjectQuestionCount } from "@/lib/subjects";
import { useLocale } from "@/lib/locale-context";
import { Reveal } from "@/components/ui/Reveal";
import { SubjectIcon } from "@/components/SubjectIcon";

export function CourseCatalog() {
  const { t, locale } = useLocale();

  return (
    <section id="catalog" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24">
      <Reveal className="mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {t.landing.catalogHeading}
        </h2>
        <p className="mt-3 text-brand-100/60">{t.landing.catalogSubtitle}</p>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SUBJECTS.map((s, i) => (
          <Reveal key={s.id} delay={i * 0.08}>
            <motion.div whileHover={{ y: -6 }} className="group relative h-full">
              <div
                className="absolute -inset-0.5 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
                style={{ background: s.glow }}
                aria-hidden
              />
              <div className="card-premium relative flex h-full flex-col p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-2xl"
                    style={{ background: `${s.accent}1f`, color: s.accent }}
                  >
                    <SubjectIcon name={s.icon} className="h-7 w-7" />
                  </span>
                  {!s.available && (
                    <span className="rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold text-brand-100/60">
                      {t.landing.comingSoon}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-bold text-white">
                  {s.name[locale]}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-100/65">
                  {s.tagline[locale]}
                </p>

                <div className="mt-6 flex items-center gap-4 text-xs text-brand-100/55">
                  <span className="flex items-center gap-1.5">
                    <FileQuestion className="h-3.5 w-3.5" />
                    {subjectQuestionCount(s)} {t.landing.questionsLabel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    {s.chapters.length} {t.landing.chaptersLabel}
                  </span>
                </div>

                {s.available ? (
                  <Link
                    href={`/course/${s.id}`}
                    className="group/btn mt-6 inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 active:scale-[0.97]"
                    style={{
                      background: `linear-gradient(110deg, ${s.accent}, #22d3ee)`,
                      boxShadow: `0 10px 30px -12px ${s.glow}`,
                    }}
                  >
                    {t.landing.open}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="mt-6 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-white/10 px-6 py-3.5 text-sm font-semibold text-brand-100/40"
                  >
                    <BookMarked className="h-4 w-4" />
                    {t.landing.comingSoon}
                  </button>
                )}
              </div>
            </motion.div>
          </Reveal>
        ))}

        {/* "Add your subject" placeholder card */}
        <Reveal delay={SUBJECTS.length * 0.08}>
          <div className="flex h-full min-h-[18rem] flex-col items-center justify-center rounded-3xl border border-dashed border-white/12 p-7 text-center">
            <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-brand-100/70">
              <Plus className="h-6 w-6" aria-hidden />
            </span>
            <p className="text-sm font-medium text-brand-100/70">{t.landing.comingSoon}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
