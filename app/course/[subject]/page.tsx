"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  Layers3,
  FileText,
  Clock,
  Target,
  PenLine,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { LevelCard } from "@/components/LevelCard";
import { LEVELS } from "@/lib/levels";
import { getSubject } from "@/lib/subjects";
import { useLocale } from "@/lib/locale-context";
import { SubjectIcon } from "@/components/SubjectIcon";

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
            className="grid h-16 w-16 place-items-center rounded-2xl"
            style={{ background: `${subject.accent}1f`, color: subject.accent }}
          >
            <SubjectIcon name={subject.icon} className="h-8 w-8" />
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

      {/* Exam-prep toolkit */}
      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-white">{t.hub.toolsHeading}</h2>
          <p className="mt-2 text-sm text-brand-100/60">{t.hub.toolsSubtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ToolCard
            href={`/flashcards?subject=${subject.id}`}
            icon={Layers3}
            accent="#818cf8"
            title={t.hub.flashcards}
            desc={t.hub.flashcardsDesc}
            cta={t.hub.open}
          />
          <ToolCard
            href={`/summary?subject=${subject.id}`}
            icon={FileText}
            accent="#22d3ee"
            title={t.hub.summary}
            desc={t.hub.summaryDesc}
            cta={t.hub.open}
          />
          <ToolCard
            href={`/exam?subject=${subject.id}&mode=timed`}
            icon={Clock}
            accent="#fbbf24"
            title={t.hub.simulator}
            desc={t.hub.simulatorDesc}
            cta={t.hub.open}
          />
          <ToolCard
            href={`/exam?subject=${subject.id}&mode=mistakes`}
            icon={Target}
            accent="#fb7185"
            title={t.hub.mistakes}
            desc={t.hub.mistakesDesc}
            cta={t.hub.open}
          />
          {subject.essays && subject.essays.length > 0 && (
            <ToolCard
              href={`/essays?subject=${subject.id}`}
              icon={PenLine}
              accent="#f59e0b"
              title={t.hub.essays}
              desc={t.hub.essaysDesc}
              cta={t.hub.open}
            />
          )}
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

function ToolCard({
  href,
  icon: Icon,
  accent,
  title,
  desc,
  cta,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <Link href={href} className="group">
      <motion.div whileHover={{ y: -4 }} className="card-premium flex h-full items-start gap-4 p-6">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-transform group-hover:scale-110"
          style={{ background: `${accent}1f`, color: accent }}
        >
          <Icon className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-brand-100/65">{desc}</p>
          <span
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: accent }}
          >
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
