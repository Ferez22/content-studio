import type { MetadataRoute } from "next";
import { contentLocales, routing } from "@/i18n/routing";
import { getSlugs, type Collection } from "@/lib/content";
import { translatedLocales } from "@/i18n/messages";
import {
  categoryPath,
  categorySlugs,
  partnerProgramEnabled,
  partnerSlugs,
  servicePath,
  serviceSlugs,
  site,
} from "@/lib/site";

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

// Blog and case-study lists exist in the content locales only.
const contentPaths = ["/portfolio", "/blog"];

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
    contentLocales.map(async (locale) => ({ locale, slugs: await getSlugs(collection, locale) }))
  );
  const slugs = new Set(perLocale.flatMap((l) => l.slugs));
  return [...slugs].flatMap((slug) =>
    entry(
      `${base}/${slug}`,
      perLocale.filter((l) => l.slugs.includes(slug)).map((l) => l.locale)
    )
  );
};

// Service pages are listed only in the locales that have their copy translated.
const servicePages = async () =>
  (
    await Promise.all([
      ["/services", "services.overview"],
      ...categorySlugs.map((slug) => [categoryPath(slug), `serviceCategories.${slug}`]),
      ...serviceSlugs.map((slug) => [servicePath(slug), `servicePages.${slug}`]),
    ].map(async ([path, namespace]) => entry(path, await translatedLocales(namespace))))
  ).flat();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cases, posts, services] = await Promise.all([
    collectionEntries("portfolio", "/portfolio"),
    collectionEntries("blog", "/blog"),
    servicePages(),
  ]);
  return [
    ...[
      ...staticPaths,
      ...(partnerProgramEnabled ? partnerSlugs.map((slug) => `/partners/${slug}`) : []),
    ].flatMap((path) => entry(path, contentPaths.includes(path) ? contentLocales : routing.locales)),
    ...services,
    ...cases,
    ...posts,
  ];
}
