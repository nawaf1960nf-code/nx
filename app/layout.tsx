import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800", "900"],
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نون عين | لعبة الفرق التنافسية",
  description:
    "لعبة جماعية ممتعة بين فريقين، أسئلة ذكية متجددة في تصنيفات متنوعة، مع وسائل مساعدة وتحديات مثيرة.",
  keywords: ["نون عين", "لعبة فرق", "سؤال وجواب", "ألعاب جماعية", "ديوانية"],
};

export const viewport: Viewport = {
  themeColor: "#00c853",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} h-full`}>
      <body className="min-h-full antialiased bg-white text-ink-800">
        {children}
      </body>
    </html>
  );
}
