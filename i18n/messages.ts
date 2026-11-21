import { routing, sourceLocale } from "./routing";

type Messages = { [key: string]: unknown };

const load = async (locale: string): Promise<Messages> =>
  (await import(`../messages/${locale}.json`)).default;

const isObject = (value: unknown): value is Messages =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Keys missing in a translation fall back to the source locale (English), key by key.
const merge = (base: Messages, override: Messages): Messages =>
  Object.fromEntries(
    Object.keys({ ...base, ...override }).map((key) => {
      const [a, b] = [base[key], override[key]];
      return [key, isObject(a) && isObject(b) ? merge(a, b) : b ?? a];
    })
  );

export const withFallback = async (locale: string) => {
  const messages = await load(locale);
  if (locale === sourceLocale) return messages;
  return merge(await load(sourceLocale), messages);
};

// Locales whose own message file has the given namespace, e.g. "servicePages.shopify".
// Pages built from untranslated copy are only listed (sitemap, hreflang) in these locales.
export const translatedLocales = async (namespace: string) => {
  const has = (messages: Messages) =>
    namespace.split(".").reduce<unknown>((node, key) => (isObject(node) ? node[key] : undefined), messages) !==
    undefined;
  const results = await Promise.all(
    routing.locales.map(async (locale) => (has(await load(locale)) ? locale : null))
  );
  return results.filter((locale): locale is (typeof routing.locales)[number] => locale !== null);
};

// The copy every page sends to the browser (layout.tsx). Deep service and partner copy and the
// legal pages are only read on the server, except on the service and partner pages, which wrap
// themselves in a NextIntlClientProvider with everything. Cuts about 95 KB from every page's HTML.
export const clientMessages = (messages: Messages): Messages => {
  const { legal: _legal, partnerPages: _partnerPages, servicePages = {}, ...rest } = messages;
  return {
    ...rest,
    // Menus and service cards only show each service's title and summary.
    servicePages: Object.fromEntries(
      Object.entries(servicePages as Messages).map(([slug, page]) => {
        const { title, summary } = page as Messages;
        return [slug, { title, summary }];
      })
    ),
  };
};

// Same, plus the full copy of one service or partner page, for that page's own provider.
export const clientMessagesWith = (messages: Messages, namespace: "servicePages" | "partnerPages", slug: string) => {
  const base = clientMessages(messages);
  const page = (messages[namespace] as Messages | undefined)?.[slug];
  return { ...base, [namespace]: { ...((base[namespace] as Messages | undefined) ?? {}), [slug]: page } };
};
