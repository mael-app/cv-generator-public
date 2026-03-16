import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/generate": ["./src/views/**/*"],
  },
  eslint: {
    // ESLint runs as a dedicated CI step — skip during next build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
