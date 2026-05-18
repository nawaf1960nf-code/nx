"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Loader2, EyeOff } from "lucide-react";
import { useState } from "react";

function CardView() {
  const params = useSearchParams();
  const word = params.get("w") || "";
  const img = params.get("img") || "";
  const cat = params.get("c") || "";
  const [hidden, setHidden] = useState(false);

  return (
    <main className="min-h-screen bg-ink-900 text-white flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between">
        <Logo size="sm" />
        <button
          onClick={() => setHidden((h) => !h)}
          className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 transition"
        >
          <EyeOff className="w-4 h-4" />
          {hidden ? "إظهار" : "إخفاء"}
        </button>
      </header>

      {hidden ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-8xl mb-6">🫣</div>
          <p className="text-white/60 text-center text-lg">
            مخفية مؤقتاً.<br />
            اضغط "إظهار" لما تكون لحالك.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          {cat && (
            <div className="bg-fuchsia-500/20 text-fuchsia-200 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              {cat}
            </div>
          )}

          {img && (
            <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-white/5 mb-6 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="text-center">
            <div className="text-xs text-white/40 font-bold mb-2">
              مثّل بدون كلام
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              {word}
            </h1>
          </div>
        </div>
      )}

      <footer className="px-6 py-4 text-center text-white/30 text-xs">
        لا تُري الشاشة لأحد
      </footer>
    </main>
  );
}

export default function CardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink-900 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-white" />
        </div>
      }
    >
      <CardView />
    </Suspense>
  );
}
