# CLAUDE.md: qartmina.com

Guidelines for anyone (human or AI agent) working on the Qartmina website. Read this before changing code or copy.

## Task lists

- `TODO.md` holds open work. Read it at the start of a task and keep it current.
- `DONE.md` is the history of finished work. When an item is finished, remove it from `TODO.md` and add it to `DONE.md` with the date.
- **Do not read `DONE.md` unless asked, or when investigating a bug or regression** where past changes may explain it.

## What this is

Marketing site for **Qartmina**, a **digital partner** for businesses: AI, data and automation, websites and e-commerce, software, brand and online presence, cybersecurity and IT. Clients buy project management, quality assurance and trust: one Qartmina project lead, specialists cherry-picked from a vetted freelancer network, quality control before delivery. Positioned as an **OpenAI Select Partner**. Audience: decision-makers at SMEs in France (France first, Europe later), often non-technical. Clear for the board, precise for engineers. No prices on service pages.

Live at https://www.qartmina.com (canonical; the bare domain redirects), deployed on Vercel from `main`, server functions in Frankfurt (`vercel.json`, `fra1`). DNS on Hostinger. Work on a branch, never commit to `main` directly.

## Brand and design references

- `brand.md`: Qartmina facts (offer, audience, market, claims we may and may not use). Read before writing copy.
- `design.md`: the site's visual style (colors, type, radii, components, do's and don'ts, CSS and Tailwind tokens). Read before any UI change.
- Both are copies: the source is Content Studio (`brands/qartmina/brand.md`, `brands/qartmina/design.md`). Edit there,
  then copy here. On a conflict with the live site, the site wins and both files get updated.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4, pnpm
- `next-intl` 4 (i18n), `next-mdx-remote` 6 (MDX), `next-themes` (light/dark)
- `motion` 12, imported from `motion/react` (Framer Motion's current name); never add `framer-motion`
- Icons: `@tabler/icons-react`; brand logos in `icons/` (`tool-logos.tsx` from Simple Icons, CC0). `cn()` = `clsx` + `tailwind-merge`

```bash
pnpm dev          # http://localhost:3000 (phones on the LAN work thanks to allowedDevOrigins)
pnpm build        # must pass before every push
pnpm exec tsc --noEmit
```

## Routes

All pages live under `app/[locale]/` (`fr`, `en`, always prefixed).

| Route | What |
|---|---|
| `/` | Home: Hero → LogoCloud → Features (6 category cards that flip to their services) → OpenAIPartner → Team → Testimonials → FAQs → Contact |
| `/services` | Overview with a sticky category list (`TableOfContents`) |
| `/services/<category>` | Category hub |
| `/services/<category>/<service>` | Service page; `video-motion` has its own layout |
| `/portfolio`, `/portfolio/<slug>` | Case studies (MDX in `content/portfolio/<locale>/`) |
| `/blog`, `/blog/<slug>` | Articles (MDX in `content/blog/<locale>/`) |
| `/about`, `/contact`, `/book`, `/newsletter/thank-you` | Company, contact form, Cal.com booking |
| `/partners/<slug>` | Partner program, hidden unless `NEXT_PUBLIC_PARTNER_PROGRAM=true` |
| `/privacy`, `/terms`, `/legal` | Legal pages (copy in `messages` under `legal`) |
| `/api/contact` | Contact form handler (Turnstile, then Brevo email) |

Old flat service URLs (`/services/ai-agents`...) redirect permanently via `legacyServiceSlugs` in `next.config.ts`.

## Structure

```
app/[locale]/…                 pages (see Routes); opengraph-image.tsx per locale
app/sitemap.ts, robots.ts
components/                    sections and shared UI, one component per file
components/ui/                 primitives: button, flip-card, before-after, letter-reveal
components/services/           service cards, card visuals, motion design page, business card
components/<affectui>.tsx      affectUI illustrations (agent-team, team-invite, layer-stack,
                               lead-sourcing, integration-beam)
components/features*/skeletons animated mockups used by the category cards
i18n/                          routing, request config (English fallback), navigation
lib/site.ts                    site constants and serviceCategories (+ categoryPath/servicePath)
lib/service-media.ts           videos per service (hero, examples, demos)
lib/metadata.ts, service-metadata.ts   pageMetadata(): canonical, hreflang, OG
messages/{en,fr}.json          all UI copy
assets/motion/<name>/          our own motion video compositions (see below)
assets/og/                     images read at build time by the OG route (not served)
public/motion/                 rendered motion videos and posters
proxy.ts                       locale detection (fr browser -> fr, else en; cookie wins), /de/* -> /en/* (308)
brand.md, design.md            brand facts and visual style reference (copies from Content Studio, see below)
```

## Services

- Six categories with their services, defined once in `lib/site.ts`. Build links with `categoryPath()` / `servicePath()`, never by hand.
- **Feature toggles:** `serviceToggles` (`lib/site.ts`) switches each service on or off. Off means no page (404), no sitemap entry, no link in menus, footer, home, overview, hubs or "More in"; blog and case-study links to it render as plain text; a category with nothing on disappears too. `serviceCategories`, `categorySlugs`, `serviceSlugs` and `isServiceSlug` only contain what is on, so new code gets this for free.
- Copy: `serviceCategories.<category>` (title, metaTitle, summary, intro) and `servicePages.<service>` (title, metaTitle, summary, intro, 4 features, 4 use cases, `faq` with 3 items as FAQPage JSON-LD). Optional sections render when their copy exists: `explainer`, `examples`, `included`.
- **One card everywhere:** `ServiceCard` / `ServiceCards` (`components/services/service-cards.tsx`) on the home panel, overview, hubs and "More in". Its top is `ServiceCardMedia`: a free-license Unsplash photo (`service-photos.ts`) or an animated visual (`card-visuals.tsx`), plus tool logos. The desktop Services menu previews the same media on hover.
- **Deeper service pages:** the `extras` map in `app/[locale]/services/[category]/[slug]/page.tsx` adds a hero visual, a wide visual under the hero, own sections, level icons, a use-case aside, a features marquee or a demo per slug; such pages skip "How we deliver". Copy-driven sections (`explainer`, `levels`, `useCases`, `included`, `examples`) render only when their copy exists.
- **Adding a service:** slug in its category, copy in `messages/en.json`, icon in `components/service-icons.tsx`, photo or visual in `service-card-media.tsx`, switch it on in `serviceToggles` (`lib/site.ts`). The service count on the home page follows the toggles.
- Each category has a soft tint (pastel light, deep tone dark), only in `components/services/category-tints.ts`.

## Motion and animation toolkit

Motion should feel premium but never take over the page. **Never pin sections or drive animations from the scroll position** (it broke scrolling on iPhone). Animate when an element comes into view, loop only while visible, and always give `prefers-reduced-motion` a still version.

Reusable pieces:

| Need | Use |
|---|---|
| Entrance on scroll (fade, lift, unblur, once) | `Reveal` (`components/reveal.tsx`); `RevealList` + `RevealItem` stagger a list; `ServiceCards reveal` staggers cards |
| Letters springing up from a mask | `LetterReveal` (`components/ui/letter-reveal.tsx`) |
| Two faces flipping in 3D | `FlipCard` (`components/ui/flip-card.tsx`) |
| Before/after drag comparison (sweeps once on view) | `BeforeAfter` (`components/ui/before-after.tsx`) |
| Small animated UI at a fixed size, scaled to its box | `Canvas` in `components/services/card-visuals.tsx` (480 x 270, plays only in view, `useStep` / `useTyping` helpers) |
| Video that plays only on screen, no controls | `HeroVideo`, `DoorVideo`, `usePlayWhileVisible` (`components/services/showcase-video.tsx`) |
| A UI drawn as a function of time (editor building a card) | `BusinessCard` (`components/services/business-card.tsx`) |
| Node graph that builds in, runs beams along its lines, popover per node | `NodeGraph` (`components/services/node-graph.tsx`) fed a `GraphSpec` (tiles, labelled diagram boxes with logos, dashed zones); see `agent-graph.tsx`, `system-graph.tsx` |
| Interactive demo that pins centred over the page (Esc / X to release, `#demo` opens it) | `DemoStage` (`components/services/demo-stage.tsx`); no transformed or filtered ancestor |
| Simple infinite loops | CSS keyframes in `app/globals.css` (with a reduced-motion block next to each) |

**affectUI illustrations** (affectui.com) are added with `pnpm dlx shadcn@latest add https://www.affectui.com/r/<name>.json`. Before installing, fetch the JSON and read the file: it must be a single self-contained component with no network, storage or eval code. They land in `components/<name>.tsx` (UI pieces like `tool-call-card-clean` in `components/ui/`); wrap illustrations in `Canvas` to size them.

**Reduced motion and hydration:** `useReducedMotion()` differs between server and client. Switching only styles is fine; to render a different *layout* for reduced motion, wait for a `mounted` flag set in an effect, or React throws a hydration error.

### Our own motion videos

Compositions live in `assets/motion/<name>/index.html`: a 1920 x 1080 page that draws every frame from `window.seek(t)` (no CSS animations, no timers, no state between frames) and sets `window.DURATION` and `window.POSTER`; `window.prepare()` runs once after fonts load.

```bash
python3 assets/motion/render.py <name> --probe   # 20 stills in assets/motion/<name>/probe/ (delete after)
python3 assets/motion/render.py <name>           # public/motion/<name>.mp4 + .jpg, 60 fps with motion blur
```

Needs Python Playwright with Chrome (`channel="chrome"`) and ffmpeg. Existing: `stop-the-scroll` (countdown, 7.5 s) and `qartmina-brand` (brand film, 10 s). Fast moves show the 3 blur subframes as steps: slow the move rather than add subframes. Example videos made by others (Prompt Motion) always show the creator credit and the "not Qartmina projects" note.

## i18n rules

- Two locales, same slugs in both: `fr` (default) and `en`. Detection (proxy.ts): NEXT_LOCALE cookie, else a French
  browser gets `fr`, any other language `en`, no header `fr`.
- German was removed (Fares 2026-11-11): every `/de` URL redirects permanently (308) to the same `/en` path (proxy.ts).
- Blog posts and case studies: `fr` and `en` (`contentLocales`). A post missing in one locale redirects to the other (next.config.ts).
- **No hard-coded user-facing text in components.** Add keys to `messages/*.json` with identical structure; `t.raw()` for arrays.
- French is written natively, never translated word for word. Everything is in fr.json except `servicePages` (service page copy, English only for now). Missing fr keys fall back to English key by key (`i18n/messages.ts`); an untranslated service page is canonical to English and left out of the fr sitemap (`translatedLocales`). Adding `servicePages.<service>` to fr.json makes it indexable.
- Links use `Link` from `@/i18n/navigation`, never `next/link`. Every page exports `generateMetadata` (`pageMetadata()` or `translatedPageMetadata()`) and calls `setRequestLocale(locale)`.
- Testimonials stay in the client's original words; FR shows a small "original in English" note.

## Writing rules (copy in any language)

- **No em dashes or en dashes as punctuation.** Use commas, full stops or restructure.
- Plain language for non-technical readers. Explain or avoid jargon (MCP, LLM, ERP...).
- **Evidence first.** Only publish figures that can be backed up, link sources for third-party proof. Never invent clients, logos, testimonials or results; no promises like "goes viral". Label demos as demos.
- Preserve Fares's voice when editing; refine, don't replace. Strong, short openings. Avoid slop words (elevate, unlock, seamless, leverage...).
- Don't infer pronouns from a name; use the person's name or neutral wording.
- **Legal pages:** liability excluded "to the fullest extent permitted by applicable law" with the mandatory carve-out (intent, gross negligence, injury to life or health). The privacy policy must name every provider that touches personal data (Vercel, Brevo, Google Workspace, Cal.com, Cloudflare).
- **OpenAI badge:** files exactly as provided (`public/openai-select-partner-badge*.svg`), status written exactly as **OpenAI Select Partner**.
- No personal phone numbers on the site.

## Design

- **Palette:** monochrome (oklch neutrals in `app/globals.css`) with one accent, **royal blue `#1E40FF`** (`dark:blue-400` on dark). Blue is for highlights only. Only other colours: the category tints.
- **Fonts:** Manrope bold for headings (`font-display`), Inter for body, EB Garamond bold for the wordmark (`font-logo`; its italic works as an accent in motion pieces).
- **Logo:** wordmark "Qartmina." in `components/logo.tsx`; "Q." mark is `LogoIcon` (follows `currentColor`). Rasters: `public/logo.png`, `assets/og/logo-white.png`.
- **Mascot:** white robot with royal-blue eyes (`public/robot/`), always in a white disc with `mix-blend-multiply`. Generated with Higgsfield from the same reference image.
- **Partner logos** in `public/logos/` as one-tone silhouettes (`brightness-0 opacity-70 dark:invert`); ESGITECH sits on a dark tile.
- **Buttons:** always the shared `Button`. Pills (`rounded-full`, set once in `buttonVariants`), magnetic, **no shadows**: primary swaps black to white with a light grey outline on hover. Never override the radius per page.
- **Cards:** `bg-neutral-50 dark:bg-neutral-800`, `rounded-3xl` outer corners, thin borders. Hover: lift slightly and darken the outline, no shadow.
- Layout primitives: `Container` (max-w-7xl, px-4 md:px-8), `Heading`, `Subheading`. Sections `py-10 md:py-20 lg:py-32`.
- **Navbar:** floating pill on desktop (Services menu: categories in columns, underline links, hover preview from xl, centred on the page); full-width bar with a burger and full-screen drop menu on phones.
- **Mobile first-class:** check every change at 390px: readable sizes, no cramped rows, **no horizontal scroll**, service cards 2 per row (titles only). Both themes must work.

## Blog posts (MDX)

Copy `content/blog/_template.mdx` to `content/blog/<locale>/<slug>.mdx`, locale `fr` or `en` only (file name = URL, same slug in both). Frontmatter: `title`, `summary`, `date` (`YYYY-MM-DD`), optional `tags`, `description`, `faq`, `updated`. Images in `public/blog/<slug>/`. A post may exist in one language only. List, reading time, related posts, JSON-LD and sitemap are automatic.

## Forms, integrations and secrets

- **Contact form** → `POST /api/contact`: honeypot, validation, keys present (fail closed), Turnstile, then Brevo email to `fares@qartmina.com` with `replyTo` the visitor.
- **Newsletter** posts from the browser to the Brevo endpoint in `lib/site.ts` with `?isAjax=1`; validate the email client-side; keep the `email_address_check` honeypot. Popover once per browser (`localStorage` `qartmina-newsletter-popover`).
- **Cal.com:** `CalEmbed` handles Cal's iframe messages, passes `theme`, pins `color-scheme: light`, renders after mount.
- **Env vars** (`.env.example`): `BREVO_API_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_PARTNER_PROGRAM`. Never commit `.env*` or paste keys anywhere. Brevo "Authorized IPs" stays off. No secrets or personal data in URLs.

## Testing changes

- Run `pnpm build && pnpm start -p 3100` (a separate port; `pnpm dev` refuses a second instance) and check pages with Python Playwright (`channel="chrome"`), at 1440 and 390px, light and dark.
- The site uses smooth scrolling: in tests scroll with `window.scrollTo({ top, behavior: "instant" })`, or a second scroll call cancels the first.
- Whole-page screenshots miss content that reveals on view; scroll to each section instead.

## Known pitfalls (learned the hard way)

- An element with a `transform` (motion animations) becomes the containing block of absolute children: anchor wide popovers outside it (see the Services menu).
- Next 16 blocks dev resources for other origins: phones on the LAN need `allowedDevOrigins` (already set in `next.config.ts`).
- Hidden honeypots: hide in place (clip/opacity), never park at `-9999px` (mirrored inside the 3D contact card, creates horizontal scroll).
- `backdrop-filter` on an ancestor makes `position: fixed` children relative to it: full-screen overlays render through a portal.
- A `ChunkLoadError` after a rebuild usually means an old `next start` holds the port. Kill it.
- `opengraph-image.tsx` can't clip with `overflow: hidden`; read images from `assets/og/` as data URLs. Page-level `openGraph` replaces the file OG image, so `pageMetadata()` sets it explicitly.

## Before you push

1. `pnpm exec tsc --noEmit` and `pnpm build` pass.
2. Copy rules followed (no dashes, evidence first); en and fr done.
3. UI checked at 390px and desktop, light and dark, no horizontal scroll, no console errors.
4. `TODO.md` and `DONE.md` updated.
5. Commit only intended files (no probe folders, no stray assets, never `.env*`). End commit messages with the co-author line if an AI agent wrote the change.
