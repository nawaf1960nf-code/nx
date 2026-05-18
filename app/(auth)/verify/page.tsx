"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Mail, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      e.preventDefault();
      const next = pasted.split("").concat(Array(6 - pasted.length).fill(""));
      setCode(next.slice(0, 6));
      inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async () => {
    const token = code.join("");
    if (token.length !== 6) {
      setError("اكتب الرمز كامل (٦ أرقام)");
      return;
    }
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      setError("الرمز خطأ أو منتهي. حاول مرة ثانية أو أعد الإرسال.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/setup");
      router.refresh();
    }, 1200);
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({ email, type: "signup" });
    if (error) {
      setError("تعذّر إعادة الإرسال. حاول بعد قليل.");
    }
    setResending(false);
  };

  if (success) {
    return (
      <main className="min-h-screen bg-mesh flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black mb-2">تم التحقق!</h1>
          <p className="text-ink-500">ينقلك للعبة...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mesh flex flex-col">
      <header className="px-6 py-5 max-w-7xl mx-auto w-full">
        <Link href="/">
          <Logo size="md" />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>

          <h1 className="text-3xl font-black mb-2">
            ابعتنالك <span className="text-primary-500">رمز</span>
          </h1>
          <p className="text-ink-500 mb-1">
            تحقق من إيميلك
          </p>
          <p className="text-ink-800 font-bold mb-8" dir="ltr">
            {email}
          </p>

          <div className="bg-white rounded-3xl border-2 border-ink-100 p-6 md:p-8">
            <label className="block text-sm font-bold text-ink-600 mb-4">
              اكتب الرمز المكوّن من ٦ أرقام
            </label>

            <div className="flex justify-center gap-2 mb-5" dir="ltr">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  className={cn(
                    "w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-black",
                    "border-2 border-ink-200 rounded-xl focus:border-primary-500 focus:outline-none transition",
                  )}
                />
              ))}
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-700 text-sm font-bold flex items-start gap-2 mb-4">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Button
              onClick={handleVerify}
              size="lg"
              className="w-full mb-4"
              loading={loading}
              disabled={loading || code.join("").length !== 6}
            >
              تأكيد
            </Button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-ink-500 hover:text-primary-500 font-bold transition"
            >
              {resending ? "جاري الإرسال..." : "ما وصلني، أعد الإرسال"}
            </button>
          </div>

          <p className="text-sm text-ink-400 mt-6">
            تأكد من مجلد Spam/المهملات إذا ما لقيت الإيميل
          </p>
        </div>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      }
    >
      <VerifyForm />
    </Suspense>
  );
}
