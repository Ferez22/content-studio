# CLAUDE.md: qartmina.com

Guidelines for anyone (human or AI agent) working on the Qartmina website. Read this before changing code or copy.

## Task lists

- `TODO.md` holds open work. Read it at the start of a task and keep it current.
- `DONE.md` is the history of finished work. When an item is finished, remove it from `TODO.md` and add it to `DONE.md` with the date.
- **Do not read `DONE.md` unless asked, or when investigating a bug or regression** where past changes may explain it.

## What this is

Marketing site for **Qartmina**, an AI and data consulting company (Strategy · Data · AI · Execution), positioned as an **OpenAI Select Partner**. Audience: business decision-makers, often non-technical, across MENA and Africa. The site has to be clear for the board and precise for engineers.

Live at https://www.qartmina.com (the canonical address; the bare domain redirects to it), deployed on Vercel from `main` with server functions pinned to Frankfurt (`vercel.json`, region `fra1`). DNS is on Hostinger.

## Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS 4
- `next-intl` 4 for i18n, `next-mdx-remote` 6 for MDX content
- `motion` 12 for animation. Import from `motion/react` (it is Framer Motion under its current name); never add `framer-motion`
- `next-themes` for light/dark, `@tabler/icons-react` for icons, `class-variance-authority` + `tailwind-merge` via `cn()`
- Package manager: **pnpm**

```bash
pnpm dev          # http://localhost:3000
pnpm build        # must pass before every push
pnpm exec tsc --noEmit
```

## Structure

```
app/[locale]/            every page lives under a locale segment (en, fr, de)
app/api/contact/         contact form handler (Turnstile check, then Brevo email)
app/sitemap.ts, robots.ts
app/[locale]/opengraph-image.tsx   social preview, generated per locale
components/              sections and shared UI (one component per file)
components/ui/           primitives: button (magnetic), dotted-glow-background
components/features*/skeletons/    animated card mockups reused across sections
components/services/visuals.tsx    category → animated mockup; services use their own or their category's
components/ui/flip-card.tsx        3D two-face flip (home service categories, contact tabs)
components/ui/letter-reveal.tsx    letters springing up from a mask, staggered (CSS only)
i18n/                    routing (locales), request config, locale-aware navigation
lib/site.ts              site constants: URL, email, LinkedIn, Cal.com, Brevo form URL, service categories
lib/metadata.ts          pageMetadata(): canonical, hreflang, Open Graph, Twitter
lib/content.ts           MDX loader for content/
messages/{en,fr,de}.json all UI copy
content/portfolio/<locale>/<slug>.mdx   case studies (blog uses content/blog/<locale>/)
public/                  served assets (logos/, team/, robot/, badges)
assets/og/               images read at build time by the OG image route (not served)
proxy.ts                 next-intl locale detection and redirects (Next 16 name for middleware)
```

Home page order: Hero (title, KPIs, interactive workflow) → LogoCloud (OpenAI badge in the centre) → Features (6 service category cards that flip to their services) → OpenAIPartner → Team → Testimonials → FAQs → Contact. `WhyUs` exists but is commented out.

## Services

- Six categories, each with its services, defined once in `serviceCategories` (`lib/site.ts`). URLs: `/services` (overview), `/services/<category>` (hub), `/services/<category>/<service>`. Build links with `categoryPath()` / `servicePath()`, never by hand.
- Copy: `serviceCategories.<category>` (title, metaTitle, summary, intro) and `servicePages.<service>` (title, metaTitle, summary, intro, 4 features, 4 use cases, `faq` with 3 items, rendered as FAQPage JSON-LD).
- Adding a service: add the slug to its category, the copy in `messages/en.json`, an icon in `components/service-icons.tsx`; optionally its own mockup in `components/services/visuals.tsx`. Update the "29 services" figure in `home.figures`.
- Optional per-service extras: a hero video and example videos in `lib/service-media.ts`, and the sections `explainer`, `examples` and `included` in `servicePages.<service>` (each renders only when its copy exists). Example videos made by others always show the creator's credit and the "not Qartmina projects" note.
- `video-motion` has its own hero and scroll story (`components/services/motion-design.tsx`, copy under `servicePages.video-motion.explainer`). Its "Stops the scroll" video is our own render: edit `assets/motion/stop-the-scroll/index.html` (time-driven `seek(t)`, no CSS animations) and run `python3 assets/motion/stop-the-scroll/render.py` (`--probe` for stills) to regenerate `public/motion/stop-the-scroll.mp4`.
- The old flat URLs (`/services/ai-agents`, `consulting`, `automation`...) redirect permanently via `legacyServiceSlugs` in `next.config.ts`.
- Positioning: Qartmina is a digital partner. Clients buy project management, quality assurance and trust: one project lead, specialists cherry-picked from a vetted freelancer network, quality control before delivery. No prices on service pages.

## i18n rules

- Three locales, same slugs in every locale: `en` (default), `fr`, `de`. Routes are always prefixed (`/en/...`).
- **No hard-coded user-facing text in components.** Add the key to all three `messages/*.json` files with identical structure. Use `t.raw()` for arrays.
- Exception, for now: the services namespaces (`services`, `serviceCategories`, `servicePages`, `home.services`) exist in English only. Missing keys in fr/de fall back to English key by key (`i18n/messages.ts`). Untranslated service pages point their canonical to the English page and are left out of the fr/de sitemap and hreflang (`translatedLocales`); adding the namespace to fr.json/de.json makes them indexable in that language automatically.
- Links use `Link` from `@/i18n/navigation`, never `next/link`.
- Every page exports `generateMetadata` using `pageMetadata()` and calls `setRequestLocale(locale)`.
- Testimonials stay in the client's original words (not translated); FR/DE show a small "original in English" note.

## Writing rules (copy in any language)

- **No em dashes or en dashes as punctuation.** Use commas, full stops or restructure.
- Plain language for non-technical readers. Explain or avoid jargon (MCP, LLM, ERP...).
- **Evidence first.** Only publish figures that can be backed up, and link the source for third-party proof. Never invent clients, logos, testimonials or results. Label demos as demos.
- Preserve Fares's voice when editing; refine, don't replace. Strong, short openings.
- Don't infer pronouns from a name; use the person's name or neutral wording.
- **Legal pages** (`messages/*.json` under `legal`): liability is excluded "to the fullest extent permitted by applicable law" with the mandatory carve-out (intent, gross negligence, injury to life or health). Keep that structure: an absolute exclusion is void in the EU and can invalidate the whole clause. The privacy policy must name every provider that touches personal data (Vercel, Brevo, Google Workspace, Cal.com, Cloudflare) and stay accurate about where data is processed.
- **OpenAI badge:** use the files exactly as provided (`public/openai-select-partner-badge*.svg`, no recolouring or silhouette) and write the status exactly as **OpenAI Select Partner**.

## Branding

- **Palette:** monochrome (black, white, neutrals from the oklch tokens in `app/globals.css`) with one accent, **royal blue `#1E40FF`** (use `dark:blue-400` on dark backgrounds). The blue is for highlights: active states, travelling dots, caret, focus rings, glows. Don't introduce new accent colours.
- **Fonts** (`app/[locale]/layout.tsx`): Manrope bold for headings (`font-display`), Inter for body (`font-inter`), EB Garamond bold only for the wordmark (`font-logo`).
- **Logo:** the wordmark "Qartmina." rendered by `components/logo.tsx` (wavy letter animation). The "Q." mark is `LogoIcon` (SVG text, follows `currentColor`). Raster versions live in `public/logo.png` and `assets/og/logo-white.png`.
- **Mascot:** the white robot with royal-blue eyes. Video loop in `public/robot/robot.{webm,mp4}` on a pure white background, so it always sits in a white disc with `mix-blend-multiply`. Poster: `robot-poster.webp`. Generated with Higgsfield; regenerate poses from the same reference image to keep the character consistent.
- **Partner and client logos** in `public/logos/` are shown as one-tone silhouettes (`brightness-0 opacity-70 dark:invert`) so mixed colours stay consistent. Exception: the ESGITECH logo (`public/logoesgitech.svg`) is white, so it sits on a dark rounded tile in both themes.
- Both themes must work. Check light and dark for every change.

## UI conventions

- Layout primitives: `Container` (max-w-7xl, px-4 md:px-8), `Heading` (h1/h2, text-3xl → 6xl), `Subheading`. Sections use `py-10 md:py-20 lg:py-32`.
- Cards: `bg-neutral-50 dark:bg-neutral-800`, generous radius (`rounded-3xl` on outer corners of grids), thin `border-neutral-200 dark:border-neutral-800`.
- **Buttons:** always the shared `Button` (`components/ui/button.tsx`). Every CTA is magnetic (follows the cursor by 35%, 0.15s ease-out) and is a pill (`rounded-full`, set once in `buttonVariants`, matching the navbar); never override the radius per page. Primary CTAs use `shadow-brand`. Don't hand-roll buttons for CTAs.
- **Animation:** entrance reveals use `Reveal` (fade + lift + blur, once). Respect `prefers-reduced-motion` in anything that loops (robot video falls back to the poster, magnetic effect and float stop). Prefer CSS for simple infinite loops (`float-bob`, `progress-fill` keyframes in `globals.css`).
- **Mobile first-class:** every UI change must also be checked on mobile (about 390px wide) and look good there with proper proportions: readable font sizes, nothing oversized, no cramped rows, no horizontal scroll. Test at 390px. Phones get a full-width navbar with a custom burger (short top bar) and a full-screen drop menu; desktop gets the floating pill navbar that shrinks on scroll. Service cards are 2 columns on phones (titles only). Carousels use `SnapCarousel` (native scroll snap + dots).
- No horizontal page overflow at any width. Clip decorative overflow inside its own section.
- Icons: Tabler, or the brand icons in `icons/`. Service icons map in `components/service-icons.tsx`.

## Blog posts (MDX)

1. Copy `content/blog/_template.mdx` to `content/blog/<locale>/<slug>.mdx`. The file name is the URL (`/en/blog/<slug>`); use the same slug in every language.
2. Frontmatter: `title`, `summary` (list, search results and previews), `date` (`YYYY-MM-DD`, newest first), optional `tags`.
3. Body: standard Markdown. Images go in `public/blog/<slug>/` and are referenced as `/blog/<slug>/image.png`. Styles for every element live in `components/mdx.tsx`.
4. A post can exist in one language only: the sitemap and hreflang list just the languages that have the file, and other languages return 404 for that slug.
5. Apply the writing rules (no dashes as punctuation, evidence first). Check the post on mobile and desktop before pushing.

Nothing else is needed: the blog list, article page, reading time, related posts, BlogPosting JSON-LD and sitemap entry are generated automatically.

## Forms, integrations and secrets

- **Contact form** → `POST /api/contact`. Server order: honeypot (filled → fake success), validation, keys present (fail closed with 500), Cloudflare Turnstile verification, then Brevo transactional email from and to `fares@qartmina.com` with `replyTo` set to the visitor. Rejections are logged with Cloudflare's error codes.
- **Newsletter form** posts directly from the browser to the Brevo form endpoint in `lib/site.ts` with `?isAjax=1` (required for a JSON answer). Brevo accepts any string as `EMAIL`, so validate client-side. Keep Brevo's own honeypot field `email_address_check`.
- **Newsletter popover:** once per browser (`localStorage` key `qartmina-newsletter-popover`), random delay 8 to 20 s.
- **Cal.com:** `CalEmbed` answers Cal's `__iframeReady` with `parentKnowsIframeReady` to receive `__dimensionChanged` heights, sends the transparent-body `ui` message, passes `theme=light|dark`, and pins the iframe `color-scheme` to `light` (Cal's document is always light; a mismatch paints an opaque backdrop). Render it after mount to avoid hydration errors.
- **Env vars** (see `.env.example`): `BREVO_API_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`. Set them in Vercel for Production and redeploy after changes. Never commit `.env*` files or paste keys into code, messages or chat. Brevo "Authorized IPs" must stay off because Vercel has no fixed outbound IPs.
- Never place secrets or personal data in URLs.

## Known pitfalls (learned the hard way)

- Hidden honeypot inputs must be hidden in place (clip/opacity), not parked at `-9999px`: inside the 3D-flipped contact card the offset gets mirrored and creates ~10,000px of horizontal scroll.
- `backdrop-filter` on an ancestor makes `position: fixed` children relative to it. Full-screen overlays (mobile menu) render through a portal to `document.body`.
- A `ChunkLoadError` after a rebuild usually means an old `next start` process still holds the port. Kill it before testing.
- `opengraph-image.tsx` can't clip with `overflow: hidden`; round images themselves. Read images from `assets/og/` as data URLs.
- Page-level `openGraph` metadata replaces the file-based OG image, so `pageMetadata()` sets the image URL explicitly.

## Before you push

1. `pnpm exec tsc --noEmit` and `pnpm build` pass.
2. Copy updated in **en, fr and de**, no dashes as punctuation, no unverifiable claims.
3. For any UI change: checked on mobile (390px) and desktop, in light and dark mode, with good proportions on mobile, no horizontal scroll and no console errors.
4. `TODO.md` and `DONE.md` updated.
5. Commit only intended files (leave stray assets in `public/` out), never `.env*`. End commit messages with the co-author line if an AI agent wrote the change.
