import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/alwan2311198/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
