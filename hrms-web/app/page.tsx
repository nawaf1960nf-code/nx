"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const currentUser = useStore((s) => s.currentUser);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!currentUser) router.replace("/login");
    else router.replace(currentUser.role === "SUPER_ADMIN" ? "/overview" : "/dashboard");
  }, [mounted, currentUser, router]);

  return <div className="grid min-h-screen place-items-center text-sm text-slate-400">جارٍ التحويل…</div>;
}
