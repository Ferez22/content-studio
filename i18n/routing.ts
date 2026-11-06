import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "de"],
  defaultLocale: "fr",
  // Detection is done in proxy.ts: French browsers get fr, every other language gets en.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/** Language every copy is complete in: fallback for missing keys, canonical of untranslated pages, x-default. */
export const sourceLocale = "en";

/** Blog posts and case studies exist in these locales only; German is for site pages. */
export const contentLocales = ["fr", "en"] as const;
