import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { getSubject } from "@/lib/subjects";
import type { TopicId } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

type Mode = "chat" | "socratic" | "explain-wrong";

interface Body {
  subjectId: string;
  topic: TopicId;
  /** The exam/study question under discussion. */
  question?: string;
  /** For explain-wrong: what the student picked and the correct answer. */
  studentAnswer?: string;
  correctAnswer?: string;
  mode?: Mode;
  /** "en" | "ar" — the language the tutor should reply in. */
  locale?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  /** Latest user message (for chat / quick actions). */
  message?: string;
}

function buildSystem(subjectName: string, notes: string, mode: Mode, locale: string): string {
  const lang =
    locale === "ar"
      ? "Reply in clear, simple Modern Standard Arabic."
      : "Reply in clear, simple English.";

  const base =
    `You are a warm, encouraging personal tutor for a "${subjectName}" course. ` +
    `${lang} Keep answers concise (about 120 words) and use a concrete example. ` +
    `Ground EVERYTHING strictly in the COURSE NOTES below — never introduce facts ` +
    `that are not supported by them. If a question is outside these notes, say so ` +
    `briefly and steer the student back to the topic.\n\n` +
    `COURSE NOTES:\n${notes || "(no notes available for this topic)"}`;

  if (mode === "socratic") {
    return (
      base +
      `\n\nTEACHING STYLE — SOCRATIC: Do NOT explain everything at once. Ask the ` +
      `student ONE short guiding question about the concept and wait. When they ` +
      `reply, acknowledge it, correct gently if needed, then ask the next single ` +
      `question — one concept at a time. Only give a full explanation if the ` +
      `student explicitly asks or is clearly stuck.`
    );
  }
  return base;
}

function buildUserTurn(b: Body): string {
  if (b.mode === "explain-wrong") {
    return (
      `The student answered an exam question incorrectly.\n` +
      `Question: ${b.question ?? ""}\n` +
      `Student's answer (incorrect): ${b.studentAnswer ?? ""}\n` +
      `Correct answer: ${b.correctAnswer ?? ""}\n\n` +
      `Explain why their answer is wrong and walk through the correct reasoning, ` +
      `based only on the course notes.`
    );
  }
  return b.message?.trim() || (b.question ? `Help me understand: ${b.question}` : "Help me with this topic.");
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const client = getAnthropic();
  if (!client) {
    // No API key configured — signal the client to show its offline fallback.
    return new Response("", { status: 204, headers: { "x-tutor": "fallback" } });
  }

  const subject = getSubject(body.subjectId);
  const notes = subject.topics[body.topic] ? subject.knowledge[body.topic] ?? "" : "";
  const mode: Mode = body.mode ?? "chat";
  const locale = body.locale === "ar" ? "ar" : "en";

  const system = buildSystem(subject.name.en, notes, mode, locale);

  const messages: { role: "user" | "assistant"; content: string }[] = [
    ...(body.history ?? []).slice(-8),
    { role: "user", content: buildUserTurn(body) },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const mstream = await client.messages.stream({
          model: CLAUDE_MODEL,
          max_tokens: 600,
          temperature: mode === "socratic" ? 0.7 : 0.5,
          system,
          messages,
        });
        for await (const event of mstream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch {
        // Surface a recoverable error to the client.
        controller.error(new Error("stream-failed"));
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "x-tutor": "ai",
    },
  });
}
