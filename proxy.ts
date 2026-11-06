import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

const isLocale = (value?: string): value is (typeof routing.locales)[number] =>
  !!value && (routing.locales as readonly string[]).includes(value);

/** A manual pick (NEXT_LOCALE cookie) wins; else a French browser gets fr, any other language en, none fr. */
function detectLocale(req: NextRequest) {
  const saved = req.cookies.get("NEXT_LOCALE")?.value;
  if (isLocale(saved)) return saved;
  const header = req.headers.get("accept-language");
  if (!header) return routing.defaultLocale;
  const first = header.split(",")[0]?.trim().slice(0, 2).toLowerCase();
  return first === "fr" ? "fr" : "en";
}

export default function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // German is for site pages only: blog posts and case studies live in fr and en.
  const content = pathname.match(/^\/de\/(blog|portfolio)(\/.*)?$/);
  if (content) {
    return NextResponse.redirect(new URL(`/en/${content[1]}${content[2] ?? ""}${search}`, req.url), 308);
  }

  if (!isLocale(pathname.split("/")[1])) {
    const url = req.nextUrl.clone();
    url.pathname = `/${detectLocale(req)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 307);
  }

  return intl(req);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
