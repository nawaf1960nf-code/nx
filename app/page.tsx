import {
  Brain,
  RefreshCw,
  Target,
  BarChart3,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LevelCard } from "@/components/LevelCard";
import { LEVELS } from "@/lib/levels";
import { CHAPTER_TITLES, CHAPTERS } from "@/lib/topics";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Question Generation",
    desc: "Fresh, syllabus-grounded questions synthesised on every attempt — never the same exam twice.",
  },
  {
    icon: Target,
    title: "Adaptive Learning",
    desc: "The engine over-samples the topics you miss and eases up on the ones you've mastered.",
  },
  {
    icon: RefreshCw,
    title: "No-Repetition System",
    desc: "Different order, different wording, different questions — same learning objectives.",
  },
  {
    icon: BarChart3,
    title: "Performance Analysis",
    desc: "Per-topic breakdowns, strong/weak areas and concrete recommendations after every exam.",
  },
  {
    icon: GraduationCap,
    title: "Study Mode",
    desc: "A personal AI tutor that asks, waits, explains, and gives extra examples — one concept at a time.",
  },
  {
    icon: ShieldCheck,
    title: "Grounded & Accurate",
    desc: "A knowledge base of the five chapters keeps the AI on-syllabus and prevents hallucination.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <Hero />

      {/* Levels */}
      <section id="levels" className="mx-auto mt-10 max-w-6xl px-4 scroll-mt-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Choose your challenge
          </h2>
          <p className="mt-3 text-brand-100/60">
            Three carefully calibrated difficulty levels. Each exam is 30 questions.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {LEVELS.map((level, i) => (
            <LevelCard key={level.id} level={level} index={i} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            More than a quiz — a smart tutor
          </h2>
          <p className="mt-3 text-brand-100/60">
            Everything you need to go from memorising to mastering.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08]"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/15 text-brand-300 transition-transform group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-100/65">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section className="mx-auto mt-24 max-w-4xl px-4">
        <div className="glass-strong rounded-3xl p-8 sm:p-10">
          <h2 className="font-display text-2xl font-bold text-white">
            Full syllabus coverage
          </h2>
          <p className="mt-2 text-sm text-brand-100/60">
            Questions span every required concept across five chapters.
          </p>
          <ul className="mt-6 space-y-3">
            {CHAPTERS.map((ch) => (
              <li key={ch} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-500/20 text-xs font-bold text-brand-200">
                  {ch}
                </span>
                <span className="text-sm text-brand-100/80">
                  <span className="font-semibold text-white">Chapter {ch}</span> ·{" "}
                  {CHAPTER_TITLES[ch]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
