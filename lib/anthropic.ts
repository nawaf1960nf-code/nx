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

// Haiku للسرعة (٣x أسرع من Sonnet) مع جودة ممتازة للأسئلة
export const CLAUDE_MODEL = "claude-haiku-4-5-20251001";

// نموذج أقوى للتحكيم (دقة عالية مطلوبة)
export const JUDGE_MODEL = "claude-haiku-4-5-20251001";
