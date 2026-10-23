import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSlugs } from "@/lib/content";
import { serviceSlugs, site } from "@/lib/site";

const staticPaths = [
  "",
  "/portfolio",
  "/blog",
  "/about",
  "/contact",
  "/book",
  "/privacy",
  "/terms",
  "/legal",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Slugs are identical across locales, so the English content lists them.
  const [cases, posts] = await Promise.all([
    getSlugs("portfolio", routing.defaultLocale),
    getSlugs("blog", routing.defaultLocale),
  ]);
  const paths = [
    ...staticPaths,
    ...serviceSlugs.map((slug) => `/services/${slug}`),
    ...cases.map((slug) => `/portfolio/${slug}`),
    ...posts.map((slug) => `/blog/${slug}`),
  ];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${site.url}/${l}${path}`])
        ),
      },
    }))
  );
}
