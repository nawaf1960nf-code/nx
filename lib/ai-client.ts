"use client";

import type { Difficulty, Question, TopicId } from "./types";

/**
 * Thin client wrappers around the AI API routes. Each call degrades
 * gracefully: if the server has no API key configured (or the request
 * fails), the caller falls back to the static question bank / local logic.
 */

export interface AIGenerateResponse {
  questions: Question[];
  source: "ai" | "fallback";
}

export async function aiGenerateQuestions(params: {
  subjectId: string;
  difficulty: Difficulty;
  topics: TopicId[];
  count: number;
}): Promise<AIGenerateResponse> {
  try {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) return { questions: [], source: "fallback" };
    const data = await res.json();
    return {
      questions: Array.isArray(data.questions) ? data.questions : [],
      source: data.source === "ai" ? "ai" : "fallback",
    };
  } catch {
    return { questions: [], source: "fallback" };
  }
}

export interface AIAnalysisResponse {
  summary: string;
  strongAreas: string[];
  weakAreas: string[];
  recommendations: string[];
  source: "ai" | "fallback";
}

export async function aiAnalyze(payload: unknown): Promise<AIAnalysisResponse | null> {
  try {
    const res = await fetch("/api/ai/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return (await res.json()) as AIAnalysisResponse;
  } catch {
    return null;
  }
}

export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
}

export async function aiTutor(payload: {
  subjectId: string;
  topic: TopicId;
  question: string;
  studentAnswer?: string;
  history?: TutorMessage[];
}): Promise<{ reply: string; source: "ai" | "fallback" } | null> {
  try {
    const res = await fetch("/api/ai/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export type TutorMode = "chat" | "socratic" | "explain-wrong";

export interface StreamTutorParams {
  subjectId: string;
  topic: TopicId;
  locale: "en" | "ar";
  mode?: TutorMode;
  question?: string;
  studentAnswer?: string;
  correctAnswer?: string;
  message?: string;
  history?: TutorMessage[];
}

export type StreamResult = "ai" | "fallback" | "error";

/**
 * Stream a tutor reply token-by-token. Calls `onChunk` for each text delta and
 * resolves with how it ended: "ai" (streamed ok), "fallback" (no API key
 * configured — caller shows the offline message), or "error" (network/timeout —
 * caller shows a retry). Pass an AbortSignal to cancel in flight.
 */
export async function streamTutor(
  params: StreamTutorParams,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<StreamResult> {
  try {
    const res = await fetch("/api/ai/tutor-stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal,
    });

    // 204 = no API key configured on the server → graceful offline fallback.
    if (res.status === 204 || res.headers.get("x-tutor") === "fallback") {
      return "fallback";
    }
    if (!res.ok || !res.body) return "error";

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let received = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      if (text) {
        received = true;
        onChunk(text);
      }
    }
    return received ? "ai" : "error";
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return "error";
    return "error";
  }
}
