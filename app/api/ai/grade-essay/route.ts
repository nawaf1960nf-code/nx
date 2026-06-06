import { NextResponse } from "next/server";
import { callClaude, extractJson } from "@/lib/ai-server";
import { getSubject, buildContext } from "@/lib/subjects";
import type { TopicId } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  subjectId: string;
  topic: TopicId;
  prompt: string;
  modelAnswer: string;
  keyPoints: string[];
  answer: string;
  locale?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ source: "fallback" }, { status: 400 });
  }

  const subject = getSubject(body.subjectId);
  const notes = buildContext(subject, [body.topic]);
  const locale = body.locale === "ar" ? "ar" : "en";
  const lang =
    locale === "ar"
      ? "Write the feedback in clear Arabic."
      : "Write the feedback in clear English.";

  const system =
    `You are a fair university examiner grading a ${subject.name.en} exam answer, ` +
    `at the level of King Saud University. Grade ONLY against the model answer, ` +
    `key points and course notes provided — do not reward correct-sounding content ` +
    `that is off-syllabus. Award partial credit for each key point the student covers. ` +
    `Be encouraging but honest. ${lang} Respond with strict JSON only.`;

  const user =
    `COURSE NOTES:\n${notes}\n\n` +
    `EXAM QUESTION:\n${body.prompt}\n\n` +
    `MODEL ANSWER:\n${body.modelAnswer}\n\n` +
    `KEY POINTS (each is worth partial credit):\n- ${body.keyPoints.join("\n- ")}\n\n` +
    `STUDENT'S ANSWER:\n${body.answer}\n\n` +
    `Return ONLY JSON: {"score": <0-100 integer>, ` +
    `"covered": ["key points the student addressed"], ` +
    `"missing": ["key points the student missed"], ` +
    `"feedback": "2-4 sentences of specific, constructive feedback"}`;

  const text = await callClaude({ system, user, temperature: 0.3, maxTokens: 900 });
  if (!text) return NextResponse.json({ source: "fallback" });

  const parsed = extractJson<{
    score: number;
    covered: string[];
    missing: string[];
    feedback: string;
  }>(text);
  if (!parsed) return NextResponse.json({ source: "fallback" });

  const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
  return NextResponse.json({
    score,
    covered: Array.isArray(parsed.covered) ? parsed.covered : [],
    missing: Array.isArray(parsed.missing) ? parsed.missing : [],
    feedback: typeof parsed.feedback === "string" ? parsed.feedback : "",
    source: "ai",
  });
}
