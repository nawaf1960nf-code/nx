"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { UserMenu } from "@/components/UserMenu";
import { useCredits } from "@/lib/credits-context";
import {
  Ticket,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function RedeemPage() {
  const router = useRouter();
  const { credits, refresh } = useCredits();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    plays: number;
    package: string | null;
  } | null>(null);

  const totalPlays =
    (credits?.has_free_play ? 1 : 0) + (credits?.paid_plays_remaining ?? 0);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/codes/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "تعذّر استخدام الكود");
        return;
      }
      setSuccess({
        plays: data.plays_granted,
        package: data.package_name,
      });
      await refresh();
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-mesh flex flex-col">
        <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
          <Logo size="md" />
          <UserMenu />
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-black mb-3">
              تم تفعيل الكود! 🎉
            </h1>
            <p className="text-ink-500 mb-6">
              تم إضافة{" "}
              <span className="text-3xl font-black text-primary-600 mx-1">
                {success.plays}
              </span>{" "}
              {success.plays === 1 ? "لعبة" : "ألعاب"} لرصيدك
              {success.package && (
                <>
                  <br />
                  <span className="text-sm">من {success.package}</span>
                </>
              )}
            </p>

            <div className="flex flex-col gap-3">
              <Button
                size="xl"
                onClick={() => router.push("/setup")}
                icon={<Sparkles className="w-5 h-5" />}
              >
                ابدأ لعبة جديدة!
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setSuccess(null)}
              >
                استخدم كود آخر
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mesh flex flex-col">
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <UserMenu />
          <Link href="/">
            <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              الرئيسية
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold-500/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-8 h-8 text-gold-600" />
            </div>
            <h1 className="text-3xl font-black mb-2">
              استخدم <span className="text-primary-500">كودك</span>
            </h1>
            <p className="text-ink-500">
              {totalPlays > 0
                ? `عندك ${totalPlays} ${totalPlays === 1 ? "لعبة" : "ألعاب"} متاحة الآن`
                : "ما عندك ألعاب متبقية، أضف كود لتلعب"}
            </p>
          </div>

          <form
            onSubmit={handleRedeem}
            className="bg-white rounded-3xl border-2 border-ink-100 p-6 md:p-8"
          >
            <label className="block text-sm font-bold text-ink-600 mb-2">
              الكود
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.toUpperCase().replace(/\s/g, ""))
              }
              required
              autoFocus
              dir="ltr"
              maxLength={20}
              className="w-full px-4 py-4 border-2 border-ink-200 rounded-xl text-2xl font-mono font-black text-center tracking-wider focus:border-primary-500 focus:outline-none transition"
              placeholder="NN-XXXX-XX"
            />

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-700 text-sm font-bold flex items-start gap-2 mt-4">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="xl"
              className="w-full mt-5"
              loading={loading}
              disabled={loading || code.length < 5}
            >
              تفعيل الكود
            </Button>
          </form>

          <div className="text-center mt-6 text-ink-500 text-sm">
            <p>تبي تشتري كود؟ تواصل معنا على الإنستاجرام</p>
            <p className="font-bold text-ink-700 mt-1">@noonaeenkw</p>
          </div>
        </div>
      </div>
    </main>
  );
}
