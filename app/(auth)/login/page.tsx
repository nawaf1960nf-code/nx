"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") || "/setup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("email not confirmed")) {
        setError("لازم تأكد الإيميل أولاً. سويلك تسجيل جديد؟");
      } else if (msg.includes("invalid login")) {
        setError("الإيميل أو كلمة السر خطأ");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-mesh flex flex-col">
      <header className="px-6 py-5 max-w-7xl mx-auto w-full">
        <Link href="/">
          <Logo size="md" />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2">
              مرحباً <span className="text-primary-500">رجعت!</span>
            </h1>
            <p className="text-ink-500">سجّل دخول وأكمل اللعب</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border-2 border-ink-100 p-6 md:p-8 space-y-5"
          >
            <div>
              <label className="block text-sm font-bold text-ink-600 mb-2">
                <Mail className="inline w-4 h-4 ml-1" />
                الإيميل
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                dir="ltr"
                className="w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-lg focus:border-primary-500 focus:outline-none transition text-right"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-ink-600 mb-2">
                <Lock className="inline w-4 h-4 ml-1" />
                كلمة السر
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                minLength={6}
                className="w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-lg focus:border-primary-500 focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-700 text-sm font-bold flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              تسجيل دخول
            </Button>
          </form>

          <p className="text-center mt-6 text-ink-500">
            ما عندك حساب؟{" "}
            <Link
              href="/signup"
              className="text-primary-500 font-bold hover:underline"
            >
              سجل الحين
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
