"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { User, LogOut, ChevronDown, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
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
        <div className="w-9 h-9 rounded-full bg-primary-500 text-white font-black flex items-center justify-center">
          {initial}
        </div>
        <span className="hidden sm:inline font-bold text-ink-700">
          {displayName}
        </span>
        <ChevronDown
          className={cn("w-4 h-4 text-ink-400 transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl border-2 border-ink-100 shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-ink-100">
            <div className="text-xs text-ink-400 font-bold">مسجّل دخول</div>
            <div
              className="text-sm font-bold text-ink-800 truncate"
              dir="ltr"
            >
              {user.email}
            </div>
          </div>
          <Link
            href="/setup"
            className="flex items-center gap-3 px-4 py-3 hover:bg-ink-50 transition"
          >
            <User className="w-4 h-4 text-ink-500" />
            <span className="font-bold">ابدأ لعبة جديدة</span>
          </Link>
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
