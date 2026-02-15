import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // React Compiler
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tournalink.com",
      },
    ],
  },
};

export default nextConfig;
