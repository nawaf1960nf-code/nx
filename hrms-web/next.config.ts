import type { NextConfig } from "next";
import path from "node:path";

// في وضع التطوير يحتاج Next إلى unsafe-eval لخرائط المصادر — لا يُسمح به في الإنتاج.
const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "'self' 'unsafe-inline' 'unsafe-eval'"
    : "'self' 'unsafe-inline'";

const securityHeaders = [
  // منع تضمين الموقع داخل iframe (حماية من Clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // منع المتصفح من تخمين نوع المحتوى.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // عدم تسريب عناوين الصفحات الداخلية للمواقع الخارجية.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // إجبار HTTPS لمدة سنتين مع النطاقات الفرعية.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // تعطيل الكاميرا والمايكروفون، والسماح بالموقع الجغرافي للنطاق نفسه فقط (لتسجيل الحضور).
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  // سياسة أمان المحتوى: كل شيء من النطاق نفسه فقط.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // إخفاء ترويسة X-Powered-By.
  turbopack: { root: path.resolve(".") },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
