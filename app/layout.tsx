import type { Metadata, Viewport } from "next";
import { Inter, Cairo } from "next/font/google";
import { LocaleProvider } from "@/lib/locale-context";
import "./globals.css";

// Latin UI font.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
  fallback: ["Segoe UI", "system-ui", "Arial", "sans-serif"],
});

// Arabic UI font (applied when dir=rtl, see globals.css).
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-arabic",
  display: "swap",
  fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Services Marketing Exam Platform",
  description:
    "An interactive exam platform for mastering Services Marketing — covering Chapters 4, 7, 8, 10 & 11 with adaptive practice, study mode, and performance analytics.",
  keywords: [
    "Services Marketing",
    "Exam Platform",
    "Flower of Service",
    "Service Blueprinting",
    "Servicescape",
    "Quiz",
    "Study",
  ],
  authors: [{ name: "Services Marketing Exam Platform" }],
};

export const viewport: Viewport = {
  themeColor: "#060713",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${cairo.variable} h-full`}>
      <head>
        {/* Set lang/dir before paint so a returning Arabic user sees no flash of LTR. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem('smep:locale');if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}`,
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
