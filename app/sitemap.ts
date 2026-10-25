import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSlugs, type Collection } from "@/lib/content";
import { partnerProgramEnabled, partnerSlugs, serviceSlugs, site } from "@/lib/site";

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

const entry = (path: string, locales: readonly string[]) =>
  locales.map((locale) => ({
    url: `${site.url}/${locale}${path}`,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])),
    },
  }));

// Posts and case studies may not exist in every language: list each slug only in
// the locales that have it, with alternates limited to those locales.
const collectionEntries = async (collection: Collection, base: string) => {
  const perLocale = await Promise.all(
    routing.locales.map(async (locale) => ({ locale, slugs: await getSlugs(collection, locale) }))
  );
  const slugs = new Set(perLocale.flatMap((l) => l.slugs));
  return [...slugs].flatMap((slug) =>
    entry(
      `${base}/${slug}`,
      perLocale.filter((l) => l.slugs.includes(slug)).map((l) => l.locale)
    )
  );
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cases, posts] = await Promise.all([
    collectionEntries("portfolio", "/portfolio"),
    collectionEntries("blog", "/blog"),
  ]);
  return [
    ...[
      ...staticPaths,
      ...serviceSlugs.map((slug) => `/services/${slug}`),
      ...(partnerProgramEnabled ? partnerSlugs.map((slug) => `/partners/${slug}`) : []),
    ].flatMap((path) => entry(path, routing.locales)),
    ...cases,
    ...posts,
  ];
}
