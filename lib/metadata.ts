import type { Metadata } from "next";
import { routing, sourceLocale } from "@/i18n/routing";

// Canonical, hreflang alternates and social tags for a path such as "" or "/about".
export const pageMetadata = ({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
  locales = routing.locales,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
  // Locales this page exists in (posts and case studies may not be translated).
  locales?: readonly string[];
}): Metadata => {
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]));
  // x-default = what a browser in another language gets (proxy.ts): English.
  const fallback = locales.includes(sourceLocale) ? sourceLocale : locale;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        ...languages,
        "x-default": `/${fallback}${path}`,
      },
    },
    // Page-level openGraph replaces the file-based image, so point to it explicitly.
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      siteName: "Qartmina",
      locale,
      type: "website",
      images: [`/${locale}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/${locale}/opengraph-image`],
    },
    robots: { index: true, follow: true },
  };
};
