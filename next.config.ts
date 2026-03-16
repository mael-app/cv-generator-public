import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/generate": ["./src/views/**/*"],
  },
};

export default nextConfig;
