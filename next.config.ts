import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The landing page used to live at /home while / was the repair intake.
      // Both moved; these keep older links, bookmarks and any indexed URLs working.
      { source: "/home", destination: "/", permanent: true },
      // /ai was a second AI surface, off the design system. The repair intake
      // at /describe replaces it.
      { source: "/ai", destination: "/describe", permanent: true },
    ];
  },
};

export default nextConfig;
