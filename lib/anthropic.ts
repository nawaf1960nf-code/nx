import Anthropic from "@anthropic-ai/sdk";

let cachedClient: Anthropic | null = null;

export function getAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return cachedClient;
}

export const CLAUDE_MODEL = "claude-sonnet-4-6";
