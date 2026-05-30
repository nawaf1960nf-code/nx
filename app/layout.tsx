import type { Metadata, Viewport } from "next";
import { LocaleProvider } from "@/lib/locale-context";
import "./globals.css";

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
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <div className="bg-aurora" aria-hidden />
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
