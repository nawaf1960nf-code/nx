import type { NextConfig } from "next";
import path from "path";

const root = path.join(__dirname);

const nextConfig: NextConfig = {
  // This app lives in a subdirectory of a repo that also contains another
  // Next app. Pin both the Turbopack root and the output file-tracing root to
  // this directory (and keep them equal) so the build picks the right
  // workspace root without warnings.
  turbopack: {
    root,
  },
  outputFileTracingRoot: root,
  // Exercise demo images are proxied/optimized through this app's own domain
  // (Vercel fetches them server-side), so they load even if a user's network
  // blocks the source CDN directly.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
