import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // serverExternalPackages: ["@prisma/client", "prisma"],
  /* config options here */
  // output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "img.clerk.com",
      "unifyhighschool.org",
      "cdn-ildfjgl.nitrocdn.com",
    ],
  },
};

export default nextConfig;
