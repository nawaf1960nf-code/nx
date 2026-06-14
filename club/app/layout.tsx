import type { Metadata, Viewport } from "next";
import { Inter, Cairo } from "next/font/google";
import { LocaleProvider } from "@/lib/locale-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
  fallback: ["Segoe UI", "system-ui", "Arial", "sans-serif"],
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
  fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Apex Club — Personal Training Studio",
  description:
    "Tap any muscle to see the best exercises for it, build a weekly workout, get a personal AI consultant, and dial in your daily calories.",
  keywords: ["gym", "workout", "muscle map", "training", "fitness", "نادي", "تمارين", "عضلات"],
};

export const viewport: Viewport = {
  themeColor: "#05080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${cairo.variable} h-full`}>
      <head>
        {/* Set lang/dir before paint so a returning user sees no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem('club:locale');if(l==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr';}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full antialiased">
        <div className="bg-aurora" aria-hidden />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
