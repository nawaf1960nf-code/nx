# Services Marketing Exam Platform

A premium, AI-powered exam platform for mastering **Services Marketing**
(Chapters 4, 7, 8, 10 & 11 — Lovelock & Wirtz). Built with Next.js 16,
TypeScript, Tailwind CSS v4, Framer Motion and Lucide icons.

> Dark, glassmorphism UI inspired by Stripe, Notion and Coursera.

## ✨ Features

- **Three difficulty levels** — Easy (definitions), Medium (application &
  comparison) and Hard (analytical scenarios). Each exam is 30 questions.
- **One question per page** with a progress bar, `Question X of 30` counter,
  auto-advance on answer and no going back.
- **Randomised every attempt** — questions and option order are shuffled, and
  recently-served questions are avoided (no-repetition system).
- **Professional results** — final score, percentage, letter grade (A+→F),
  per-topic breakdown, strong/weak areas and concrete recommendations.
- **Review mode** — every question with your answer, the correct answer and a
  short explanation.
- **Digital certificate** + confetti when you score 90 %+.
- **Local progress** — best score, attempt count, full history and adaptive
  weak/strong topic tracking saved in `localStorage`.
- **Dashboard** — exams completed, average score, best score, improvement over
  time, strengths, weaknesses and chapters to review.
- **Study Mode** — a personal AI tutor that asks, waits, explains instantly and
  answers your follow-up questions.
- **Fully responsive** and accessible (focus rings, reduced-motion support).

## 🤖 AI layer (optional)

The platform works fully offline using a hand-authored, syllabus-grounded
question bank. When an `ANTHROPIC_API_KEY` is provided it additionally enables:

- **AI Question Generation** — fresh questions synthesised per attempt,
  grounded in a knowledge base of the five chapters (RAG-style context) to
  prevent hallucination and stay on-syllabus.
- **AI Performance Analysis** — a tailored report after each exam.
- **AI Study Tutor** — explanations, examples and Q&A in Study Mode.
- **Adaptive learning** — new attempts emphasise the topics you previously
  missed.

Every AI feature degrades gracefully to the offline engine if no key is set.

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

### Environment variables

Copy `.env.example` to `.env.local`. The AI features are optional:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## 🗂️ Project structure

```
app/
  page.tsx              Landing (hero, 3 levels, features, coverage)
  exam/page.tsx         Exam flow (welcome → questions → results → review)
  study/page.tsx        AI Study Mode
  dashboard/page.tsx    Analytics dashboard
  api/ai/*              Grounded AI route handlers (generate/analyze/tutor/status)
components/             UI primitives + feature components
lib/
  questions.ts          The static question bank
  knowledge-base.ts     Per-topic notes used to ground the AI (RAG source)
  topics.ts             Topic ↔ chapter taxonomy
  exam-engine.ts        Selection, randomisation, adaptive weighting
  grading.ts            Scoring, grades and performance analysis
  storage.ts            localStorage persistence & adaptive tracking
```

## 📚 Syllabus coverage

Every required concept is covered: Flower of Service, Facilitating & Enhancing
Services, Branding Alternatives, New Service Development, Marketing
Communications, 5Ws Model, Word of Mouth, Corporate Design, Blueprinting,
Flowcharting, Service Blueprint, Fail-Proofing, Service Standards, SSTs,
Servicescape, Ambient Conditions, Pleasure & Arousal, Mehrabian-Russell Model,
Role Stress, Boundary Spanners, Empowerment, Service Culture, Internal
Marketing, Cycle of Success, Cycle of Failure and Emotional Labor.
