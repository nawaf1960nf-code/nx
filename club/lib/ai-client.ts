"use client";

import type { ConsultProfile } from "@/app/api/consultant/route";

export type CoachResult = "ai" | "fallback" | "error";

/**
 * Stream a coaching reply. Calls onChunk with each text delta. Returns:
 * - "ai": a real streamed answer
 * - "fallback": no API key configured on the server
 * - "error": network/stream failure
 */
export async function streamConsultant(
  params: {
    profile: ConsultProfile;
    locale: string;
    history: { role: "user" | "assistant"; content: string }[];
    message?: string;
  },
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<CoachResult> {
  try {
    const res = await fetch("/api/consultant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal,
    });

    if (res.headers.get("x-coach") === "fallback") return "fallback";
    if (!res.ok || !res.body) return "error";

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
    return "ai";
  } catch {
    return "error";
  }
}
