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

/** Check whether the AI backend is configured (has an API key). */
export async function aiStatus(): Promise<boolean> {
  try {
    const res = await fetch("/api/ai/status");
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.enabled);
  } catch {
    return false;
  }
}
