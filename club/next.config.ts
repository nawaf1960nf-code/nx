import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // This app lives in a subdirectory of a repo that also contains another
  // Next app. Pin the Turbopack root so the build doesn't pick the parent
  // lockfile as the workspace root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
