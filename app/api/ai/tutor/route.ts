import { NextResponse } from "next/server";
import { callClaude } from "@/lib/ai-server";
import { getSubject } from "@/lib/subjects";
import type { TopicId } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  subjectId: string;
  topic: TopicId;
  question: string;
  studentAnswer?: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ source: "fallback" }, { status: 400 });
  }

  const subject = getSubject(body.subjectId);
  const notes = subject.topics[body.topic] ? subject.knowledge[body.topic] ?? "" : "";

  const system =
    `You are a friendly personal tutor for a ${subject.name.en} course. ` +
    "Explain clearly and concisely (max ~120 words), give a concrete example, " +
    "and base everything ONLY on the provided notes. Be warm and encouraging.";

  const historyText = (body.history ?? [])
    .map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
    .join("\n");

  const user =
    `Topic notes: ${notes}\n\n` +
    (body.question ? `Question discussed: ${body.question}\n` : "") +
    (body.studentAnswer ? `Student's answer/message: ${body.studentAnswer}\n` : "") +
    (historyText ? `Conversation so far:\n${historyText}\n` : "") +
    `\nRespond as the tutor.`;

  const text = await callClaude({ system, user, temperature: 0.6, maxTokens: 500 });
  if (!text) return NextResponse.json({ source: "fallback" });

  return NextResponse.json({ reply: text, source: "ai" });
}
