import { NextResponse } from "next/server";
import { callClaude, extractJson } from "@/lib/ai-server";
import { buildContext } from "@/lib/knowledge-base";
import { TOPICS } from "@/lib/topics";
import type { Difficulty, Question, TopicId } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  difficulty: Difficulty;
  topics: TopicId[];
  count: number;
}

const DIFFICULTY_GUIDE: Record<Difficulty, string> = {
  easy: "direct definitions and core concepts; one clearly-correct answer.",
  medium: "understanding, application and comparison between related concepts.",
  hard: "analytical scenarios and easily-confused concepts requiring careful reasoning.",
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ questions: [], source: "fallback" }, { status: 400 });
  }

  const topics = (body.topics ?? []).filter((t) => TOPICS[t]);
  const count = Math.min(Math.max(body.count ?? 5, 1), 12);
  const difficulty: Difficulty = ["easy", "medium", "hard"].includes(body.difficulty)
    ? body.difficulty
    : "medium";

  if (topics.length === 0) {
    return NextResponse.json({ questions: [], source: "fallback" });
  }

  const context = buildContext(topics);
  const system =
    "You are an expert Services Marketing exam author. You write rigorous, " +
    "accurate exam questions grounded ONLY in the provided course notes. " +
    "Never introduce facts that are not supported by the notes. " +
    "Always respond with strict JSON and nothing else.";

  const user = `Course notes (the ONLY source you may use):\n\n${context}\n\n` +
    `Write ${count} ${difficulty} exam questions. Difficulty means: ${DIFFICULTY_GUIDE[difficulty]}\n` +
    `Mix multiple-choice (4 options) and true/false. Each question must be answerable from the notes.\n\n` +
    `Return ONLY a JSON array, each item shaped exactly like:\n` +
    `{"type":"multiple-choice"|"true-false","topic":"<one of: ${topics.join(", ")}>",` +
    `"prompt":"...","options":["..."],"correctIndex":0,"explanation":"..."}\n` +
    `For true/false use options ["True","False"].`;

  const text = await callClaude({ system, user, temperature: 0.8, maxTokens: 3000 });
  if (!text) {
    return NextResponse.json({ questions: [], source: "fallback" });
  }

  const raw = extractJson<Array<Record<string, unknown>>>(text);
  if (!Array.isArray(raw)) {
    return NextResponse.json({ questions: [], source: "fallback" });
  }

  const questions: Question[] = [];
  raw.forEach((item, i) => {
    const q = normalize(item, difficulty, topics, i);
    if (q) questions.push(q);
  });

  return NextResponse.json({
    questions,
    source: questions.length > 0 ? "ai" : "fallback",
  });
}

function normalize(
  item: Record<string, unknown>,
  difficulty: Difficulty,
  allowed: TopicId[],
  index: number,
): Question | null {
  const type = item.type === "true-false" ? "true-false" : "multiple-choice";
  const prompt = typeof item.prompt === "string" ? item.prompt.trim() : "";
  let options = Array.isArray(item.options) ? item.options.map(String) : [];
  if (type === "true-false") options = ["True", "False"];
  const correctIndex = Number(item.correctIndex);
  const explanation =
    typeof item.explanation === "string" ? item.explanation.trim() : "";
  const topic = (allowed.includes(item.topic as TopicId)
    ? (item.topic as TopicId)
    : allowed[0]) as TopicId;

  if (!prompt || options.length < 2) return null;
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length)
    return null;

  return {
    id: `ai-${difficulty}-${Date.now()}-${index}`,
    type,
    difficulty,
    chapter: TOPICS[topic].chapter,
    topic,
    prompt,
    options,
    correctIndex,
    explanation: explanation || "Generated from the course notes.",
  };
}
