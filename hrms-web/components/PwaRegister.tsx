"use client";

import { useEffect } from "react";

/** تسجيل Service Worker لتفعيل تثبيت التطبيق (PWA) والعمل دون اتصال. */
export function PwaRegister() {
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}
