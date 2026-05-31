"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, LayoutDashboard } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LevelCard } from "@/components/LevelCard";
import { LEVELS } from "@/lib/levels";
import { getSubject } from "@/lib/subjects";
import { useLocale } from "@/lib/locale-context";

export default function CourseHubPage() {
  const params = useParams<{ subject: string }>();
  const { t, locale } = useLocale();
  const subject = getSubject(params.subject);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />

      <section className="mx-auto max-w-6xl px-4 pt-12">
        <Link
          href="/#catalog"
          className="inline-flex items-center gap-1.5 text-sm text-brand-100/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.hub.backToCourses}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
        >
          <span
            className="grid h-16 w-16 place-items-center rounded-2xl text-4xl"
            style={{ background: `${subject.accent}1f` }}
          >
            {subject.icon}
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              {subject.name[locale]}
            </h1>
            <p className="mt-1 text-sm text-brand-100/60">{subject.tagline[locale]}</p>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/study?subject=${subject.id}`}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            <BookOpen className="h-4 w-4" /> {t.hub.studyCta}
          </Link>
          <Link
            href={`/dashboard?subject=${subject.id}`}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            <LayoutDashboard className="h-4 w-4" /> {t.hub.dashboardCta}
          </Link>
        </div>
      </section>

      {/* Levels */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-white">{t.hub.chooseLevel}</h2>
          <p className="mt-2 text-sm text-brand-100/60">{t.hub.levelSubtitle}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {LEVELS.map((level, i) => (
            <LevelCard key={level.id} level={level} index={i} subjectId={subject.id} />
          ))}
        </div>
      </section>

      {/* Chapters covered */}
      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="card-premium p-8 sm:p-10">
          <h2 className="font-display text-xl font-bold text-white">{t.hub.chaptersCovered}</h2>
          <ul className="mt-6 space-y-3">
            {subject.chapters.map((ch) => (
              <li key={ch} className="flex items-start gap-3">
                <span
                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold"
                  style={{ background: `${subject.accent}22`, color: subject.accent }}
                >
                  {ch}
                </span>
                <span className="text-sm text-brand-100/80">
                  <span className="font-semibold text-white">
                    {t.coverage.chapterWord} {ch}
                  </span>{" "}
                  · {subject.chapterTitles[ch]?.[locale] ?? ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </main>
  );
}
