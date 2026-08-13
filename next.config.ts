import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Multiple lockfiles exist higher in the tree (this project lives inside a
  // larger workspace). Pin the root to this project so builds resolve here.
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    // Stripe success_url is /order-confirmed (no extension); the page ships as
    // a static file. Rewrites run before the /[slug] dynamic route, so this
    // never reaches the PRO-page handler.
    return [{ source: "/order-confirmed", destination: "/order-confirmed.html" }];
  },
};

export default nextConfig;
