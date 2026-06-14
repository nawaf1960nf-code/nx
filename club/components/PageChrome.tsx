"use client";

import { useLocale } from "@/lib/locale-context";

export function MapSectionHeading() {
  const { t } = useLocale();
  return (
    <div className="mb-8 text-center">
      <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">{t.map.title}</h2>
      <p className="mt-2 text-energy-100/60">{t.map.hint}</p>
    </div>
  );
}

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="border-t border-white/8 py-8 text-center text-sm text-energy-100/50">
      {t.footer}
    </footer>
  );
}
