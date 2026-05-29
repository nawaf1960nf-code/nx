import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Services Marketing Exam Platform",
  description:
    "An AI-powered, interactive exam platform for mastering Services Marketing — covering Chapters 4, 7, 8, 10 & 11 with adaptive testing, study mode, and performance analytics.",
  keywords: [
    "Services Marketing",
    "Exam Platform",
    "Flower of Service",
    "Service Blueprinting",
    "Servicescape",
    "Quiz",
    "AI tutor",
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
        {children}
      </body>
    </html>
  );
}
