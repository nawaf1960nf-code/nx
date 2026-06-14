"use client";

import { getSupabase } from "./supabase";
import { getWeights, setWeights, type WeightEntry } from "./progress";
import { getWorkoutDays, setWorkoutDays } from "./activity";

/**
 * Per-user progress backup. One row per user in the `progress` table holds a
 * JSON blob of weights + workout days, so members keep their data across
 * devices once signed in.
 */
interface ProgressBlob {
  weights: WeightEntry[];
  workouts: number[];
}

export type SyncResult = { ok: true } | { ok: false; error: string };

export async function syncPush(): Promise<SyncResult> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "not-configured" };
  const { data } = await sb.auth.getUser();
  if (!data.user) return { ok: false, error: "no-user" };

  const blob: ProgressBlob = { weights: getWeights(), workouts: getWorkoutDays() };
  const { error } = await sb
    .from("progress")
    .upsert({ user_id: data.user.id, data: blob, updated_at: new Date().toISOString() });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function syncPull(): Promise<SyncResult> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "not-configured" };
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return { ok: false, error: "no-user" };

  const { data, error } = await sb
    .from("progress")
    .select("data")
    .eq("user_id", auth.user.id)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };

  const blob = data?.data as ProgressBlob | undefined;
  if (blob) {
    if (Array.isArray(blob.weights)) setWeights(blob.weights);
    if (Array.isArray(blob.workouts)) setWorkoutDays(blob.workouts);
    window.dispatchEvent(new Event("club:activity-changed"));
  }
  return { ok: true };
}
