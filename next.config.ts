import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { isServiceSlug, legacyServiceSlugs, servicePath } from "./lib/site";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  // Dev only: lets a phone on the local network (http://192.168.x.x:3000) load the dev
  // scripts. Without it Next blocks them and the page never becomes interactive.
  allowedDevOrigins: ["192.168.*.*"],
  async redirects() {
    // Only to published services: a hidden one 404s instead of redirecting permanently.
    return Object.entries(legacyServiceSlugs)
      .filter(([, service]) => isServiceSlug(service))
      .map(([legacy, service]) => ({
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
