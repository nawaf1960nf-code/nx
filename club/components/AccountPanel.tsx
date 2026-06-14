"use client";

import { useState } from "react";
import { CloudDownload, CloudUpload, LogOut, UserCircle2 } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { syncPull, syncPush } from "@/lib/sync";

export function AccountPanel() {
  const { t } = useLocale();
  const { user, loading, configured, signIn, signUp, signOut } = useAuth();

  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  async function submit() {
    if (!email || !password || busy) return;
    setBusy(true);
    setMsg(null);
    const res = mode === "in" ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (res.error) setMsg(t.account.error);
    else if ("confirm" in res && res.confirm) setMsg(t.account.confirmEmail);
  }

  async function doSync(fn: () => Promise<{ ok: boolean }>, ) {
    setSyncMsg(t.account.syncing);
    const res = await fn();
    setSyncMsg(res.ok ? t.account.synced : t.account.error);
  }

  // ── Not configured ──────────────────────────────────────────────────
  if (!configured) {
    return (
      <Shell>
        <p className="rounded-xl bg-flame-500/10 px-5 py-6 text-center text-sm leading-relaxed text-flame-200">
          {t.account.notConfigured}
        </p>
      </Shell>
    );
  }

  if (loading) {
    return (
      <Shell>
        <p className="py-8 text-center text-sm text-energy-100/50">…</p>
      </Shell>
    );
  }

  // ── Signed in ───────────────────────────────────────────────────────
  if (user) {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-energy-500/15 text-energy-400">
            <UserCircle2 className="h-7 w-7" />
          </span>
          <p className="text-xs text-energy-100/55">{t.account.signedInAs}</p>
          <p className="font-semibold text-white">{user.email}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => doSync(syncPush)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-energy-500 font-semibold text-base-950"
          >
            <CloudUpload className="h-4 w-4" /> {t.account.backup}
          </button>
          <button
            type="button"
            onClick={() => doSync(syncPull)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] font-semibold text-energy-100/80"
          >
            <CloudDownload className="h-4 w-4" /> {t.account.restore}
          </button>
        </div>
        {syncMsg && <p className="mt-3 text-center text-sm text-energy-300">{syncMsg}</p>}

        <button
          type="button"
          onClick={signOut}
          className="mt-6 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium text-energy-100/60 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> {t.account.signOut}
        </button>
      </Shell>
    );
  }

  // ── Signed out — auth form ──────────────────────────────────────────
  return (
    <Shell>
      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-energy-100/80">{t.account.email}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white outline-none focus:border-energy-400"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-energy-100/80">{t.account.password}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white outline-none focus:border-energy-400"
          />
        </label>
      </div>

      {msg && <p className="mt-3 text-center text-sm text-flame-300">{msg}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-energy-500 font-semibold text-base-950 disabled:opacity-50"
      >
        {mode === "in" ? t.account.signIn : t.account.signUp}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "in" ? "up" : "in");
          setMsg(null);
        }}
        className="mt-4 w-full text-center text-sm text-energy-100/60 hover:text-white"
      >
        {mode === "in" ? t.account.toSignUp : t.account.toSignIn}
      </button>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{t.account.title}</h1>
        <p className="mt-2 text-energy-100/60">{t.account.subtitle}</p>
      </div>
      <div className="card-premium mx-auto max-w-md p-6 sm:p-8">{children}</div>
    </div>
  );
}
