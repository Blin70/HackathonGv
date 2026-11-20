import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The landing page used to live at /home; keep old links and bookmarks working.
    return [{ source: "/home", destination: "/", permanent: true }];
  },
};

export default nextConfig;
