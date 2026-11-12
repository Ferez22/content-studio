import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { categoryPath, expertisesPath, servicePath, type CategorySlug, type ServiceSlug } from "./lib/site";
import { contentLocales } from "./i18n/routing";

const withNextIntl = createNextIntlPlugin();

// Posts from the previous site lived at /blog/<slug> (English, no locale) and are still indexed.
// Restored posts keep their slug; old posts that were not restored point to the live post on the same topic.
// Old posts with no close match (no-standard-process-digital-transformation) are left to 404.
// Permanent, straight to English: without these, proxy.ts sends /blog/<slug> through two 307s (/fr, then /en),
// so Google keeps the old URL and never moves its signals to the new one.
const restoredPosts = [
  "security-certifications-explained",
  "ai-and-data-consulting-cost",
  "how-to-identify-ai-use-cases",
  "qartmina-openai-select-partner",
  "databricks-alternatives-comparison",
];
const legacyPosts: Record<string, string> = {
  ...Object.fromEntries(restoredPosts.map((slug) => [slug, slug])),
  "mcp-and-the-future-of-saas": "connect-ai-agent-erp-crm",
  "eu-ai-act-transparency-enforcement": "ai-agents-gdpr-eu-ai-act",
  "why-ai-pilots-never-reach-production": "ai-and-data-consulting-cost",
  "what-you-pay-for-ai-consulting": "ai-and-data-consulting-cost",
  "ai-agents-with-tools-banking-insurance": "ai-agents-for-business",
  "databricks-business-case": "databricks-alternatives-comparison",
  "llm-plus-your-data": "ai-agent-knowledge-base",
};

// Every /services URL before the move to /expertises (2026-11-11), mapped to its closest page
// today: a service, a category or the overview. Covers the old
// categories, their services and the flat URLs from before the categories.
const toService = (slug: ServiceSlug) => servicePath(slug);
const toCategory = (slug: CategorySlug) => categoryPath(slug);
const oldServiceUrls: Record<string, string> = {
  "": expertisesPath,
  // Old categories
  ai: toCategory("data-ai"),
  "data-automation": toCategory("data-ai"),
  "websites-ecommerce": expertisesPath,
  "software-development": toCategory("software-development"),
  brand: toCategory("brand"),
  "cybersecurity-it": expertisesPath,
  // AI
  "ai/ai-automation": toService("ai-automation"),
  "ai/ai-consulting": toService("ai-sprint"),
  "ai/ai-agents": toService("generative-ai"),
  "ai/chatbots": toService("generative-ai"),
  "ai/voice-agents": toService("generative-ai"),
  "ai/ai-training": toService("ai-sprint"),
  // Data and automation
  "data-automation/process-automation": toService("ai-automation"),
  "data-automation/api-integration": toService("mcp"),
  "data-automation/data-platforms": toService("predictive-systems"),
  // Websites and e-commerce (no longer offered as such)
  "websites-ecommerce/web-platforms": toService("saas"),
  "websites-ecommerce/business-websites": expertisesPath,
  "websites-ecommerce/ecommerce": expertisesPath,
  "websites-ecommerce/shopify": expertisesPath,
  "websites-ecommerce/website-care": expertisesPath,
  // Software development
  "software-development/crm-development": toService("custom-software"),
  "software-development/erp-crm-setup": toService("custom-software"),
  "software-development/erp-development": toService("custom-software"),
  "software-development/business-apps": toService("custom-software"),
  "software-development/mobile-apps": toService("custom-software"),
  "software-development/cloud-migration": toService("custom-software"),
  // Brand and online presence (same services, new base path)
  "brand/brand-identity": toCategory("brand"),
  "brand/graphic-design": toCategory("brand"),
  "brand/ui-ux-design": toService("ui-ux-design"),
  "brand/personal-branding": toService("personal-branding"),
  "brand/social-media": toService("social-media"),
  "brand/video-motion": toService("video-motion"),
  // Cybersecurity and IT (no longer offered as such)
  "cybersecurity-it/security-audits": expertisesPath,
  "cybersecurity-it/penetration-testing": expertisesPath,
  "cybersecurity-it/compliance": expertisesPath,
  "cybersecurity-it/ai-security": expertisesPath,
  "cybersecurity-it/it-support": expertisesPath,
  // Flat URLs from before the categories
  "ai-agents": toService("generative-ai"),
  chatbots: toService("generative-ai"),
  automation: toService("ai-automation"),
  integration: toService("mcp"),
  consulting: toService("ai-sprint"),
  training: toService("ai-sprint"),
};

const slugsOf = (collection: string, locale: string) => {
  const dir = path.join(import.meta.dirname, "content", collection, locale);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""));
};

// German was removed on 2026-11-11 (proxy.ts sends /de/* to /en/*). Old German posts, case studies and
// services go straight to their final page here, in one hop, instead of /de -> /en -> final.
const germanContent = () =>
  ["blog", "portfolio"].flatMap((collection) => {
    const en = new Set(slugsOf(collection, "en"));
    const all = new Set([...en, ...slugsOf(collection, "fr")]);
    return [...all].map((slug) => ({
      source: `/de/${collection}/${slug}`,
      destination: `/${en.has(slug) ? "en" : "fr"}/${collection}/${slug}`,
      permanent: true,
    }));
  });

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
    // Old /services URLs: each to its closest page, anything else to the overview.
    const services = [
      ...Object.entries(oldServiceUrls).map(([from, to]) => ({
        source: `/:locale(en|fr)/services${from ? `/${from}` : ""}`,
        destination: `/:locale${to}`,
        permanent: true,
      })),
      { source: "/:locale(en|fr)/services/:path*", destination: `/:locale${expertisesPath}`, permanent: true },
      ...Object.entries(oldServiceUrls).map(([from, to]) => ({
        source: `/de/services${from ? `/${from}` : ""}`,
        destination: `/en${to}`,
        permanent: true,
      })),
      { source: "/de/services/:path*", destination: `/en${expertisesPath}`, permanent: true },
    ];
    const posts = Object.entries(legacyPosts).map(([legacy, slug]) => ({
      source: `/blog/${legacy}`,
      destination: `/en/blog/${slug}`,
      permanent: true,
    }));
    // A post or case study missing in one content locale goes to the locale that has it
    // (temporary: the translation may come later). Unprefixed URLs are detected in proxy.ts.
    return [...services, ...posts, ...germanContent(), ...missingTranslations()];
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
