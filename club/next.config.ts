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
};

export default nextConfig;
