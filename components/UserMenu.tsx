"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCredits } from "@/lib/credits-context";
import {
  User,
  LogOut,
  ChevronDown,
  LogIn,
  Gamepad2,
  Ticket,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_EMAIL = "nawaf1960nf@gmail.com";

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const { credits } = useCredits();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (loading) {
    return <div className="w-10 h-10 rounded-full bg-ink-100 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500 text-white font-bold hover:bg-primary-600 transition"
      >
        <LogIn className="w-4 h-4" />
        تسجيل دخول
      </Link>
    );
  }

  const displayName =
    (user.user_metadata?.display_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "لاعب";
  const initial = displayName.charAt(0).toUpperCase();
  const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // عرض الرصيد الإجمالي = مجاني (إن وُجد) + مدفوع
  const totalPlays =
    (credits?.has_free_play ? 1 : 0) + (credits?.paid_plays_remaining ?? 0);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-ink-100 transition"
      >
        {/* عداد الرصيد */}
        {credits && (
          <div
            className={cn(
              "hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black",
              totalPlays > 0
                ? "bg-gold-500/15 text-gold-700"
                : "bg-red-50 text-red-600",
            )}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            {totalPlays}
          </div>
        )}

        <div className="w-9 h-9 rounded-full bg-primary-500 text-white font-black flex items-center justify-center">
          {initial}
        </div>
        <span className="hidden md:inline font-bold text-ink-700">
          {displayName}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 text-ink-400 transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl border-2 border-ink-100 shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-ink-100">
            <div className="text-xs text-ink-400 font-bold">مسجّل دخول</div>
            <div
              className="text-sm font-bold text-ink-800 truncate"
              dir="ltr"
            >
              {user.email}
            </div>
          </div>

          {credits && (
            <div className="px-4 py-3 border-b border-ink-100 bg-gold-500/5">
              <div className="text-xs text-ink-500 font-bold mb-1">
                رصيد الألعاب
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gold-600 tabular-nums">
                  {totalPlays}
                </span>
                <span className="text-xs text-ink-500">
                  {credits.has_free_play && credits.paid_plays_remaining > 0
                    ? `(${1} مجانية + ${credits.paid_plays_remaining} مدفوعة)`
                    : credits.has_free_play
                      ? "(لعبة مجانية أولى)"
                      : ""}
                </span>
              </div>
            </div>
          )}

          <Link
            href="/setup"
            className="flex items-center gap-3 px-4 py-3 hover:bg-ink-50 transition"
          >
            <User className="w-4 h-4 text-ink-500" />
            <span className="font-bold">ابدأ لعبة جديدة</span>
          </Link>

          <Link
            href="/redeem"
            className="flex items-center gap-3 px-4 py-3 hover:bg-ink-50 transition border-t border-ink-100"
          >
            <Ticket className="w-4 h-4 text-ink-500" />
            <span className="font-bold">إضافة كود لعبة</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gold-50 transition border-t border-ink-100 text-gold-700"
            >
              <Shield className="w-4 h-4" />
              <span className="font-bold">لوحة التحكم</span>
            </Link>
          )}

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition border-t border-ink-100"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-bold">تسجيل خروج</span>
          </button>
        </div>
      )}
    </div>
  );
}
