import type { Metadata } from "next";
import { sourceLocale } from "@/i18n/routing";
import { translatedLocales } from "@/i18n/messages";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

// Service pages may be written in English only for now: an untranslated locale shows the
// English copy, so it points its canonical to the English page and is left out of hreflang.
export const translatedPageMetadata = async ({
  locale,
  namespace,
  ...rest
}: {
  locale: string;
  namespace: string;
  path: string;
  title: string;
  description: string;
}): Promise<Metadata> => {
  const locales = await translatedLocales(namespace);
  return pageMetadata({
    ...rest,
    locale: (locales as string[]).includes(locale) ? locale : sourceLocale,
    locales,
  });
};

export const breadcrumbJsonLd = (locale: string, items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${site.url}/${locale}${item.path}`,
  })),
});
