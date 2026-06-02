"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, RotateCw, Shuffle, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { getSubject } from "@/lib/subjects";
import { buildFlashcards, type Flashcard } from "@/lib/review";
import { shuffle } from "@/lib/utils";
import { useLocale } from "@/lib/locale-context";

function FlashcardsInner() {
  const { t, locale } = useLocale();
  const params = useSearchParams();
  const subject = getSubject(params.get("subject"));

  const allCards = useMemo(() => buildFlashcards(subject, locale), [subject, locale]);
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [reviewOnly, setReviewOnly] = useState(false);

  useEffect(() => {
    setDeck(allCards);
    setPos(0);
    setFlipped(false);
    setKnown(new Set());
    setReviewOnly(false);
  }, [allCards]);

  const card = deck[pos];
  const done = deck.length > 0 && pos >= deck.length;

  function go(dir: 1 | -1) {
    setFlipped(false);
    setTimeout(() => setPos((p) => Math.max(0, Math.min(deck.length, p + dir))), 120);
  }

  function mark(knows: boolean) {
    if (!card) return;
    setKnown((prev) => {
      const next = new Set(prev);
      if (knows) next.add(card.topic);
      else next.delete(card.topic);
      return next;
    });
    go(1);
  }

  function restart(onlyReview = false) {
    const base = onlyReview ? allCards.filter((c) => !known.has(c.topic)) : allCards;
    setDeck(base.length ? base : allCards);
    setReviewOnly(onlyReview);
    setPos(0);
    setFlipped(false);
  }

  const knownCount = known.size;

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pt-10">
        <Link
          href={`/course/${subject.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-brand-100/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {subject.name[locale]}
        </Link>

        <div className="mt-5 mb-6 text-center">
          <h1 className="font-display text-3xl font-bold text-white">{t.flashcards.title}</h1>
          <p className="mt-2 text-sm text-brand-100/60">{t.flashcards.subtitle}</p>
        </div>

        {/* progress + counters */}
        <div className="mb-5 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 font-semibold text-success">
            <Check className="h-3 w-3" /> {knownCount} {t.flashcards.knewIt}
          </span>
          <span className="text-brand-100/60">
            {deck.length ? t.flashcards.progress(Math.min(pos + 1, deck.length), deck.length) : "—"}
          </span>
          <span className="rounded-full bg-white/8 px-3 py-1 font-semibold text-brand-100/70">
            {allCards.length - knownCount} {t.flashcards.reviewing}
          </span>
        </div>

        {done ? (
          <div className="card-premium p-10 text-center">
            <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-success/15 text-success">
              <Sparkles className="h-8 w-8" />
            </span>
            <h2 className="font-display text-xl font-semibold text-white">{t.flashcards.done}</h2>
            <p className="mt-2 text-sm text-brand-100/60">{t.flashcards.doneDesc}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={() => restart(false)} variant="subtle">
                <RotateCw className="h-4 w-4" /> {t.flashcards.allCards}
              </Button>
              {knownCount < allCards.length && (
                <Button onClick={() => restart(true)}>
                  {t.flashcards.onlyReview}
                </Button>
              )}
            </div>
          </div>
        ) : card ? (
          <>
            <div className="[perspective:1600px]">
              <motion.button
                key={card.topic}
                onClick={() => setFlipped((f) => !f)}
                className="relative h-80 w-full cursor-pointer text-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotateY: flipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front */}
                  <div
                    className="card-premium absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span
                      className="mb-3 rounded-full px-3 py-1 text-[11px] font-semibold"
                      style={{ background: `${subject.accent}1f`, color: subject.accent }}
                    >
                      {t.exam.chShort} {card.chapter}
                    </span>
                    <h2 className="font-display text-2xl font-bold text-white">{card.term}</h2>
                    <span className="mt-6 text-xs text-brand-100/60">{t.flashcards.tapToFlip}</span>
                  </div>
                  {/* Back */}
                  <div
                    className="card-premium absolute inset-0 overflow-auto p-7"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <p className="text-sm font-semibold text-brand-200">{card.term}</p>
                    <p className="mt-3 text-sm leading-relaxed text-brand-100/85">{card.definition}</p>
                  </div>
                </motion.div>
              </motion.button>
            </div>

            {/* controls */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button onClick={() => mark(false)} variant="outline" size="lg">
                <RotateCw className="h-4 w-4" /> {t.flashcards.review}
              </Button>
              <Button onClick={() => mark(true)} size="lg">
                <Check className="h-4 w-4" /> {t.flashcards.know}
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => go(-1)}
                disabled={pos === 0}
                className="flex items-center gap-1.5 text-sm text-brand-100/60 transition-colors hover:text-white disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
              <button
                onClick={() => { setDeck((d) => shuffle(d)); setPos(0); setFlipped(false); }}
                className="flex items-center gap-1.5 text-xs text-brand-100/60 transition-colors hover:text-white"
              >
                <Shuffle className="h-3.5 w-3.5" /> {t.flashcards.shuffle}
              </button>
              <button
                onClick={() => go(1)}
                className="flex items-center gap-1.5 text-sm text-brand-100/60 transition-colors hover:text-white"
              >
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center"><Sparkles className="h-8 w-8 animate-pulse text-brand-300" /></div>}>
      <FlashcardsInner />
    </Suspense>
  );
}
