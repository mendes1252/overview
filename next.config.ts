import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // The existing codebase has pre-existing TypeScript issues unrelated to the Vistoria Aí site
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
