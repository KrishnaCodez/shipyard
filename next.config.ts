import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // serverExternalPackages: ["@prisma/client", "prisma"],
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
