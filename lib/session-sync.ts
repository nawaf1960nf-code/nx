"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SessionResponse {
  code: string;
  sessionId: string;
}

interface SyncableState {
  // أي بيانات نريد مشاركتها مع المشاهدين
  [key: string]: unknown;
}

/**
 * Hook لإدارة جلسة المشاركة المباشرة.
 * - يُنشئ جلسة عند الطلب
 * - يدفع التحديثات تلقائياً عند تغيير الحالة
 * - throttled لتفادي ضغط الـ API
 */
export function useSessionSync(state: SyncableState | null) {
  const [code, setCode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastStateRef = useRef<string>("");
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdateRef = useRef(false);

  const create = useCallback(async (initialState: SyncableState) => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: initialState }),
      });
      const data = (await res.json()) as SessionResponse | { error: string };
      if (!res.ok || !("code" in data)) {
        setError(("error" in data ? data.error : "تعذّر الإنشاء") as string);
        return null;
      }
      setCode(data.code);
      lastStateRef.current = JSON.stringify(initialState);
      return data.code;
    } finally {
      setCreating(false);
    }
  }, []);

  // دفع التحديثات (throttled)
  useEffect(() => {
    if (!code || !state) return;
    const serialized = JSON.stringify(state);
    if (serialized === lastStateRef.current) return;
    lastStateRef.current = serialized;

    pendingUpdateRef.current = true;

    if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    updateTimerRef.current = setTimeout(async () => {
      if (!pendingUpdateRef.current) return;
      pendingUpdateRef.current = false;
      try {
        await fetch(`/api/sessions/${code}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state }),
        });
      } catch {
        // تجاهل أخطاء المزامنة لتفادي تعطيل اللعبة
      }
    }, 500); // 500ms throttle

    return () => {
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    };
  }, [code, state]);

  return { code, create, creating, error };
}

/**
 * Hook لاستلام تحديثات الجلسة (للمشاهد).
 */
export function useSessionWatch(code: string | null, intervalMs = 1500) {
  const [state, setState] = useState<SyncableState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;

    const fetchState = async () => {
      try {
        const res = await fetch(`/api/sessions/${code}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (!cancelled) {
            if (data.error === "not_found") setError("الجلسة غير موجودة");
            else if (data.error === "expired") setError("الجلسة منتهية");
            else setError("تعذّر التحميل");
            setLoading(false);
          }
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setState(data.state ?? null);
          setError(null);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("تعذّر الاتصال");
          setLoading(false);
        }
      }
    };

    fetchState();
    const interval = setInterval(fetchState, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [code, intervalMs]);

  return { state, error, loading };
}
