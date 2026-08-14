import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Multiple lockfiles exist higher in the tree (this project lives inside a
  // larger workspace). Pin the root to this project so builds resolve here.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
