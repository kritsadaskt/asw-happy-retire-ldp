import type { NextConfig } from "next";

/**
 * The site is served from https://assetwise.co.th/happyretire through a
 * Cloudflare Worker reverse proxy, so Next.js has to know about the subpath.
 * Leave NEXT_PUBLIC_BASE_PATH empty in development to run on localhost:3000/.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assetwise.co.th",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.assetwise.co.th",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
