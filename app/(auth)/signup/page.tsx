"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Mail, Lock, User, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
      },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already registered")) {
        setError("الإيميل مسجل قبل، روح لتسجيل الدخول");
      } else if (msg.includes("password")) {
        setError("كلمة السر ضعيفة. ٦ أحرف على الأقل");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    // لو التحقق بالإيميل معطّل في Supabase، المستخدم يُسجّل دخوله مباشرة
    if (data.session) {
      router.push("/setup");
      router.refresh();
    } else {
      // التحقق بالإيميل مفعّل، انتقل لصفحة إدخال الرمز
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    }
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
              سوّ <span className="text-primary-500">حساب</span>
            </h1>
            <p className="text-ink-500">دقيقتين ونلعب أول جولة</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border-2 border-ink-100 p-6 md:p-8 space-y-5"
          >
            <div>
              <label className="block text-sm font-bold text-ink-600 mb-2">
                <User className="inline w-4 h-4 ml-1" />
                اسمك
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                className="w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-lg focus:border-primary-500 focus:outline-none transition"
                placeholder="مثلاً: نواف"
              />
            </div>

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
                autoComplete="new-password"
                minLength={6}
                className="w-full px-4 py-3 border-2 border-ink-200 rounded-xl text-lg focus:border-primary-500 focus:outline-none transition"
                placeholder="٦ أحرف على الأقل"
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
              سوّ الحساب
            </Button>
          </form>

          <p className="text-center mt-6 text-ink-500">
            عندك حساب؟{" "}
            <Link
              href="/login"
              className="text-primary-500 font-bold hover:underline"
            >
              ادخل من هنا
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
