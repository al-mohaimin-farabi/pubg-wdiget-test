/** @type {import('next').NextConfig} */
const nextConfig = {
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
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://tournalink.com/widgets/9/angle/:path*",
      },
    ];
  },
};

export default nextConfig;
