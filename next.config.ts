import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { isServiceSlug, legacyServiceSlugs, servicePath } from "./lib/site";
import { contentLocales } from "./i18n/routing";

const withNextIntl = createNextIntlPlugin();

// Posts from the previous site lived at /blog/<slug> (English, no locale) and are still indexed.
// Old posts that were not restored point to the live post on the same topic.
// Old posts with no close match (no-standard-process-digital-transformation) are left to 404.
const legacyPosts: Record<string, string> = {
  "mcp-and-the-future-of-saas": "connect-ai-agent-erp-crm",
  "eu-ai-act-transparency-enforcement": "ai-agents-gdpr-eu-ai-act",
  "why-ai-pilots-never-reach-production": "ai-and-data-consulting-cost",
  "what-you-pay-for-ai-consulting": "ai-and-data-consulting-cost",
  "ai-agents-with-tools-banking-insurance": "ai-agents-for-business",
  "databricks-business-case": "databricks-alternatives-comparison",
  "llm-plus-your-data": "ai-agent-knowledge-base",
};

const slugsOf = (collection: string, locale: string) => {
  const dir = path.join(import.meta.dirname, "content", collection, locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
};

// /fr/blog/<slug> with no French version -> the English one, and the other way round.
const missingTranslations = () =>
  ["blog", "portfolio"].flatMap((collection) =>
    contentLocales.flatMap((locale) => {
      const own = new Set(slugsOf(collection, locale));
      const other = contentLocales.find((l) => l !== locale)!;
      return slugsOf(collection, other)
        .filter((slug) => !own.has(slug))
        .map((slug) => ({
          source: `/${locale}/${collection}/${slug}`,
          destination: `/${other}/${collection}/${slug}`,
          permanent: false,
        }));
    })
  );

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
    const posts = Object.entries(legacyPosts).map(([legacy, slug]) => ({
      source: `/blog/${legacy}`,
      destination: `/en/blog/${slug}`,
      permanent: true,
    }));
    // A post or case study missing in one content locale goes to the locale that has it
    // (temporary: the translation may come later). Unprefixed URLs are detected in proxy.ts.
    return [...services, ...posts, ...missingTranslations()];
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
