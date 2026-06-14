import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";

export const runtime = "nodejs";
export const maxDuration = 60;

export interface ConsultProfile {
  sex?: "male" | "female";
  age?: number;
  weightKg?: number;
  heightCm?: number;
  bodyFat?: number;
  goal?: string;
  daysPerWeek?: number;
  experience?: string;
}

interface Body {
  profile?: ConsultProfile;
  locale?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  message?: string;
}

function profileText(p: ConsultProfile = {}): string {
  const parts: string[] = [];
  if (p.sex) parts.push(`Sex: ${p.sex}`);
  if (p.age) parts.push(`Age: ${p.age}`);
  if (p.weightKg) parts.push(`Weight: ${p.weightKg} kg`);
  if (p.heightCm) parts.push(`Height: ${p.heightCm} cm`);
  if (p.bodyFat) parts.push(`Body fat: ${p.bodyFat}%`);
  if (p.goal) parts.push(`Goal: ${p.goal}`);
  if (p.daysPerWeek) parts.push(`Training days/week: ${p.daysPerWeek}`);
  if (p.experience) parts.push(`Experience: ${p.experience}`);
  return parts.length ? parts.join(" · ") : "(no details provided)";
}

function buildSystem(profile: ConsultProfile, locale: string): string {
  const lang =
    locale === "ar"
      ? "Reply in clear, simple Modern Standard Arabic."
      : "Reply in clear, simple English.";
  return (
    `You are an expert, encouraging personal fitness and nutrition coach. ` +
    `${lang} Be practical and specific, but concise (about 140 words). Use the ` +
    `member's stats to tailor advice on training, nutrition, calories, recovery ` +
    `and progression. Prefer short paragraphs or tight bullet points.\n\n` +
    `SAFETY: Give general fitness guidance only — not medical advice. If asked ` +
    `about injury, pain, medication, supplements with health claims, or eating ` +
    `disorders, briefly recommend seeing a qualified professional. Never propose ` +
    `extreme or unsafe calorie/weight targets. Stay strictly on fitness, training ` +
    `and nutrition; politely redirect off-topic questions.\n\n` +
    `MEMBER PROFILE:\n${profileText(profile)}`
  );
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
    // No API key on this deployment — client shows its offline fallback.
    return new Response("", { status: 200, headers: { "x-coach": "fallback" } });
  }

  const locale = body.locale === "ar" ? "ar" : "en";
  const system = buildSystem(body.profile ?? {}, locale);

  const firstTurn =
    locale === "ar"
      ? "حلّل ملفي وأعطني خطة تدريب وتغذية مختصرة تناسب هدفي."
      : "Analyze my profile and give me a concise training and nutrition plan for my goal.";

  const messages: { role: "user" | "assistant"; content: string }[] = [
    ...(body.history ?? []).slice(-8),
    { role: "user", content: body.message?.trim() || firstTurn },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const mstream = await client.messages.stream({
          model: CLAUDE_MODEL,
          max_tokens: 700,
          temperature: 0.6,
          system,
          messages,
        });
        for await (const event of mstream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch {
        controller.error(new Error("stream-failed"));
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "x-coach": "ai",
    },
  });
}
