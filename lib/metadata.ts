import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

// Canonical, hreflang alternates and social tags for a path such as "" or "/about".
export const pageMetadata = ({
  locale,
  path,
  title,
  description,
  absoluteTitle = false,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata => {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}${path}`])
  );
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        ...languages,
        "x-default": `/${routing.defaultLocale}${path}`,
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
