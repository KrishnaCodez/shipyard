import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // serverExternalPackages: ["@prisma/client", "prisma"],
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["img.clerk.com"],
  },
};

export default nextConfig;
