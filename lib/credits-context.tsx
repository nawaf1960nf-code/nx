"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";

export interface Credits {
  free_plays_used: number;
  paid_plays_remaining: number;
  total_plays_completed: number;
  has_free_play: boolean;
  has_credits: boolean;
}

interface CreditsContextValue {
  credits: Credits | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextValue>({
  credits: null,
  loading: false,
  refresh: async () => {},
});

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCredits(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = (await res.json()) as Credits;
        setCredits(data);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CreditsContext.Provider value={{ credits, loading, refresh }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  return useContext(CreditsContext);
}
