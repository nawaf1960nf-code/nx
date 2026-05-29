import { getAnthropic, CLAUDE_MODEL } from "./anthropic";

/** Call Claude and return raw text, or null if unavailable/failed. */
export async function callClaude(params: {
  system: string;
  user: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string | null> {
  const client = getAnthropic();
  if (!client) return null;
  try {
    const msg = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: params.maxTokens ?? 2000,
      temperature: params.temperature ?? 0.7,
      system: params.system,
      messages: [{ role: "user", content: params.user }],
    });
    const text = msg.content
      .map((block) => ("text" in block ? block.text : ""))
      .join("")
      .trim();
    return text || null;
  } catch {
    return null;
  }
}

/** Extract the first JSON value (object or array) from a model response. */
export function extractJson<T>(text: string): T | null {
  if (!text) return null;
  // Strip markdown fences if present.
  const cleaned = text.replace(/```json/gi, "```").replace(/```/g, "").trim();
  const candidates = [cleaned];
  const firstBrace = cleaned.search(/[[{]/);
  if (firstBrace > 0) candidates.push(cleaned.slice(firstBrace));
  for (const c of candidates) {
    try {
      return JSON.parse(c) as T;
    } catch {
      /* try next */
    }
  }
  return null;
}
