import { NextResponse } from "next/server";
import { callClaude, extractJson } from "@/lib/ai-server";
import { getSubject, buildContext } from "@/lib/subjects";
import type { TopicId } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface TopicStat {
  label: string;
  correct: number;
  total: number;
  topicId: string;
}

interface Body {
  subjectId: string;
  percentage: number;
  grade: string;
  difficulty: string;
  topics: TopicStat[];
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ source: "fallback" }, { status: 400 });
  }

  const subject = getSubject(body.subjectId);
  const topics = Array.isArray(body.topics) ? body.topics : [];
  const context = buildContext(subject, topics.map((t) => t.topicId as TopicId));

  const breakdown = topics.map((t) => `- ${t.label}: ${t.correct}/${t.total}`).join("\n");

  const system =
    `You are a supportive ${subject.name.en} tutor. Analyse a student's exam ` +
    "performance and give specific, encouraging, actionable feedback grounded " +
    "ONLY in the provided course notes. Respond with strict JSON only.";

  const user =
    `Course notes:\n${context}\n\n` +
    `Student scored ${body.percentage}% (grade ${body.grade}) on a ${body.difficulty} exam.\n` +
    `Per-topic results:\n${breakdown}\n\n` +
    `Return ONLY JSON: {"summary":"2-3 sentences","strongAreas":["..."],` +
    `"weakAreas":["..."],"recommendations":["specific study actions referencing chapters/topics"]}`;

  const text = await callClaude({ system, user, temperature: 0.5, maxTokens: 1200 });
  if (!text) return NextResponse.json({ source: "fallback" });

  const parsed = extractJson<{
    summary: string;
    strongAreas: string[];
    weakAreas: string[];
    recommendations: string[];
  }>(text);

  if (!parsed) return NextResponse.json({ source: "fallback" });

  return NextResponse.json({
    summary: parsed.summary ?? "",
    strongAreas: parsed.strongAreas ?? [],
    weakAreas: parsed.weakAreas ?? [],
    recommendations: parsed.recommendations ?? [],
    source: "ai",
  });
}
