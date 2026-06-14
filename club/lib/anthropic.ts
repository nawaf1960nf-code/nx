import Anthropic from "@anthropic-ai/sdk";

let cachedClient: Anthropic | null = null;

/** Returns a configured Anthropic client, or null if no key is set. */
export function getAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!cachedClient) {
    cachedClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return cachedClient;
}

// Fast, high-quality model for the coaching chat.
export const CLAUDE_MODEL = "claude-haiku-4-5-20251001";
