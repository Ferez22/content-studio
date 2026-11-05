import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { isServiceSlug, legacyServiceSlugs, servicePath } from "./lib/site";

const withNextIntl = createNextIntlPlugin();

// Old-site posts restored in content/blog/en (same slug). Still indexed by Google at /blog/<slug>.
const restoredLegacyPosts = [
  "security-certifications-explained",
  "ai-and-data-consulting-cost",
  "how-to-identify-ai-use-cases",
  "qartmina-openai-select-partner",
  "databricks-alternatives-comparison",
];

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  // Dev only: lets a phone on the local network (http://192.168.x.x:3000) load the dev
  // scripts. Without it Next blocks them and the page never becomes interactive.
  allowedDevOrigins: ["192.168.*.*"],
  async redirects() {
    // Only to published services: a hidden one 404s instead of redirecting permanently.
    const services = Object.entries(legacyServiceSlugs)
      .filter(([, service]) => isServiceSlug(service))
      .map(([legacy, service]) => ({
        source: `/:locale(en|fr|de)/services/${legacy}`,
        destination: `/:locale${servicePath(service)}`,
        permanent: true,
      }));
    // Posts from the previous site lived at /blog/<slug> (English, no locale). Only restored
    // posts get a permanent redirect; the others keep the default locale redirect.
    const posts = restoredLegacyPosts.map((slug) => ({
      source: `/blog/${slug}`,
      destination: `/en/blog/${slug}`,
      permanent: true,
    }));
    return [...services, ...posts];
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
