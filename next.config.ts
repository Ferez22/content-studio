import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { legacyServiceSlugs, servicePath } from "./lib/site";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return Object.entries(legacyServiceSlugs).map(([legacy, service]) => ({
      source: `/:locale(en|fr|de)/services/${legacy}`,
      destination: `/:locale${servicePath(service)}`,
      permanent: true,
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
