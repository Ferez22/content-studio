# DONE

History of finished work, newest first. Only read this when asked or when tracking down a bug.

## 2026-10-28

- Desktop services menu: a square preview on the left (from xl) shows the hovered service's card media, with its title and summary; the menu is now centred on the page instead of on the Services link (it overflowed the left edge at 1024 to 1280px)

- Motion design page content: before/after slider (`components/ui/before-after.tsx`, sweeps once on view) comparing Fares's business card still and building itself in an editor (cursor adds, edits, publishes); "Content that feels alive" with the JayScambler film; "Looks like your brand" with our own Qartmina brand film (`assets/motion/qartmina-brand`, rendered with the now shared `assets/motion/render.py <name>`); benefit cards load one after another; "Your video engine" (AI system from brand to launch schedule); an offer section instead of "How we deliver"; features and use cases about ads, launches and social content; "How we work" removed

- Video and motion design page simplified after scroll bugs on iPhone: no pinned sections or scroll-driven scenes anymore. Hero (letter reveal, description, video with light parallax), "Still or in motion" toggle on a website mockup, four benefit cards with demos (the mockup in motion, the explainer video, our countdown video, "Your brand"), "How we work" in four steps, then the examples. Navbar pill removed with the dark full-screen sections
- Services overview, category hubs and "More in" now use the same card as the home panel (photo or animated visual, two per row on phones)
- Dev: `allowedDevOrigins` lets phones on the local network load the dev server (Next 16 blocks them by default)

- Home service cards get real visuals: affectUI illustrations (team invite for AI consulting, agent team for AI agents, lead sourcing for process automation, integration beam for connecting tools, layer stack for business apps; installed with `shadcn add`, reviewed first) and our own animated UIs on a scaled 480x270 canvas (chat composer with AI model logos, ElevenLabs on voice, logo cluster with Shopify, Stripe and Amboras, Shopify dashboard, SEO ranking, CRM and ERP tables with a clicking cursor, phones, cloud migration to AWS, Azure and Google Cloud)
- No more shadows on hover: buttons swap black to white with a light grey outline, cards lift and their outline darkens

- Home services section: each category has its own soft colour (front card and the panel it flips to); white round close button; every service card in the panel has a free Unsplash photo or an animated graphic (voice waveform, rising bars, security scan, automation flow) and the logos of the tools involved (n8n, Make, Zapier, Salesforce, HubSpot, Odoo, Shopify, Figma...)

- Every button is now a pill (`rounded-full`, set once in `buttonVariants`, matching the navbar). Desktop services menu: categories and services as plain text links with an underline that draws in and an arrow that appears on hover (no icons, no hover background). Motion page examples section renamed "Other examples"

- Video and motion design page, third pass: the hero description crosses the bottom of the full-screen video in big type, right to left (shorter text, slower); the navbar shrinks to a thin white pill during the dark sections (hover or tap brings it back; `lib/navbar-mode.ts` lets any section ask for it); "Stops the scroll" is a pinned cube: the screen turns from the title and description onto a dark face where our own motion graphic plays (`public/motion/stop-the-scroll.mp4`, 7.5 s: a countdown with a water drop, a ray burst and a rise, then "See, it made you stop..."; rendered from `assets/motion/stop-the-scroll/` with real motion blur); "Explains in seconds" stays on one row on desktop and its video grows from small; phone layouts for every scene (uncropped hero video band on a dark stage, bigger kinetic type, edge-to-edge video)
- Video and motion design page, second pass: the hero is one pinned scroll sequence (title alone with a letter-reveal load, the video rising and growing to full screen, the description lighting up word by word, then a zoom into the text that dissolves into scene 01). Scene 01 is a full-screen dark stage with giant kinetic type (words sliding past each other, "alive" growing with rippling letters) and a cursor spotlight that lights up the type (drifts with the scroll on touch screens). Scene 02 has a compressing kinetic title over a large explainer video. Tighter spacing between scenes
- Video and motion design page redesigned as a motion piece (`components/services/motion-design.tsx`): letter-reveal title over a large always-on video, description card with parallax, hero fades and shrinks on scroll; four scroll-driven scenes (a pinned browser that tilts flat while a stock photo breaks into moving shapes; text folding into three steps; a pinned horizontal timeline of motion design history, 1878 to 2026, that stops the page while it travels; "Your brand" springing up letter by letter on view and hover). Still layout for reduced motion, chosen after mount to avoid hydration mismatches. New `LetterReveal` primitive

- Hero and site meta title rewritten for the digital partner positioning ("One partner for everything digital")
- Service pages can now have a hero video (`lib/service-media.ts`) and optional sections from their copy: `explainer`, `examples` (videos behind folding doors that open on hover or tap and play, with a hover/tap hint) and `included`. Video and motion design: what motion design is and what it is good for, plus 4 example videos; social media management and personal branding: hero video and a "What's included" list (content plan, AI images and videos, automations, Claude course for marketing; bcards.io page and lead CRM, presence audit, six-month content plan, portfolio website, SEO). Every example video credits its creator and says it is not Qartmina work

- Services restructured into 6 categories and 29 services (AI, data and automation, websites and e-commerce, software development, brand and online presence, cybersecurity and IT), English copy for all of them with FAQs (FAQPage JSON-LD) and breadcrumbs (BreadcrumbList JSON-LD); new `/services` overview and `/services/<category>` hub pages; service URLs now `/services/<category>/<service>` with permanent redirects from the old ones and blog links updated
- Home services section: 6 category cards that flip in 3D to that category's services (X or Escape to go back, focus follows); desktop navbar menu with the categories in three columns; phone menu with one expandable row per category; footer lists the categories
- New animated mockups for websites, software, brand and security; `FlipCard` extracted from the contact tabs and shared
- "How we deliver" block (vetted specialists, one project lead, quality control) on the overview, hub and service pages; home figures and CTA text updated for the digital partner positioning
- fr/de fall back to English for missing keys; untranslated service pages are canonical to English and only listed in the English sitemap

## 2026-10-24

- Partner program: `/partners/consulting-firms` in en, fr and de (who brings what, six-step process, sourced proof from three co-built AI products (ContractMatrix, PwC tax assistant, Muse), MIT 2025 partner vs in-house figure, FAQ, partner call booking); `/partners` redirects there; light italic "Become a partner" text link with an arrow next to the logo in the navbar (desktop and phones); footer and sitemap links. Everything sits behind `NEXT_PUBLIC_PARTNER_PROGRAM` (only `true` shows it; unset or anything else: routes 404, no sitemap entries, no links). `FAQs` and `CalEmbed` now take a namespace and booking URL
- Hero: KPIs centred, "trusted by" logos moved under them as a smaller marquee next to the static OpenAI badge

- Portfolio: case study `crm-startup-cloud-migration` (CRM startup: AI coding setup cleanup, dev/staging/prod split, VPS to Railway, Cloudflare and S3 migration, CI/CD with tests on staging) in en, fr and de
- Portfolio: internal case study `qartmina-ai-workforce` (seven agents for prospecting, outreach, content and SEO) in en, fr and de
- Fixed portfolio pages crashing on the server (Radix Slot could not unwrap nested lazy children from server-rendered `Link`s, which also caused the "script tag" console error); `Button` now resolves them. Navbar About link now scrolls to the home team section (`/#team`). Removed the legacy `allowTransparency` iframe prop (console error on the home page) and added `data-scroll-behavior` on `<html>`
- Blog batches 1 and 2 translated to fr and de (22 articles, same slugs, localized keywords and tags, official FR/DE source pages where they exist); neutral wording for people in en/fr/de
- Blog batches 1 and 2 published (merged `blog-batch-1` into `main`)
- Blog batch 2 (EN): `ai-trends-2027`, `n8n-vs-make-vs-zapier`, `company-brain-ai`, `copilot-vs-chatgpt-claude-gemini`, `voice-ai-use-cases`; prices checked on official pages on 24 October 2026; December brief in `briefs/ai-2026-year-in-review.md`
- Blog batch 1 (EN): pillar `ai-agents-for-business` plus `ai-agent-security`, `ai-agent-token-cost`, `ai-agent-knowledge-base`, `connect-ai-agent-erp-crm`, `ai-agents-gdpr-eu-ai-act`; every figure sourced, humanized with li-human
- Blog features: "What's in this article" table of contents (sticky sidebar with active section on desktop, collapsible on phones), GFM tables via `remark-gfm` (scroll inside their box on phones), optional `description` (meta), `faq` (FAQPage JSON-LD) and `updated` ("Last updated", `dateModified`) frontmatter; reading time now ignores frontmatter; smooth scroll respects reduced motion
- Legal pages completed with company details: Qartmina SUARL, Immeuble Mazars, Les Berges du Lac, RNE 1973016B, represented by Fares Mohamed Aouani Cherif (managing partner); Tunisian law, courts of Tunis
- Vercel function region confirmed (Frankfurt); sitemap resubmitted and priority URLs requested in Google Search Console (by Fares)
- Article author card: photo, bio, links to business card, LinkedIn and newsletter, and QR codes (newsletter form, bcards) on tablet and desktop; QR files in `public/qr/`
- Blog MDX environment completed: `content/blog/{en,fr,de}` folders, `_template.mdx`, styles for images, code, dividers, italics and h4; sitemap and hreflang now list posts and case studies only in the languages that exist; tested end to end on desktop and mobile
- Canonical site URL switched to `https://www.qartmina.com` (sitemap, canonicals, hreflang, JSON-LD); Vercel functions pinned to Frankfurt (`vercel.json`)
- Legal pages rewritten in en/fr/de: privacy policy (Vercel, Brevo, Google Workspace, Cal.com, Cloudflare, EU processing, transfers), terms of service (acceptance by use, no warranty, maximum liability exclusion with mandatory carve-out, indemnity), legal notice with placeholders for company details
- Guidelines file is now `CLAUDE.md` (single file) with task-list workflow and the mobile testing rule; `TODO.md` and `DONE.md` created
- Newsletter welcome page `/newsletter/thank-you` (noindex), opened after sign-up
- Mobile polish: one-row KPIs, larger hero title, logo marquee, founder links at the bottom, ESGITECH link, expandable testimonial, contact card height follows the visible face, navbar `top-0` on phones
- ESGITECH logo restored on a dark rounded tile
- Cal.com embed: auto height, transparent background, theme-matched, hydration fix
- Fixed ~10,000px horizontal scroll (mirrored honeypot in the flipped contact card)
- Contact section: centred tabs flipping a 3D card between Cal.com and the contact form
- Hero: static title "Put AI agents at the service of your company" and three KPIs
- Removed unused assets from `public/`

## 2026-10-23

- Site rebuilt from the Aceternity template into the Qartmina site: en/fr/de routing, home sections, six service pages, portfolio (demo case study), blog, about, contact, book, legal pages, sitemap, robots, JSON-LD, OG image
- Contact form: Turnstile + honeypot + Brevo transactional email; newsletter form posting to Brevo with `isAjax=1`; first-visit newsletter popover
- Branding: wavy "Qartmina." wordmark (EB Garamond), "Q." mark, royal blue accent, client logos, OpenAI Select Partner badge and section, testimonial, founder photo
- Hero workflow: rotating Integration / AI agent / Automation scenes around the Higgsfield robot video, cursor tilt and glow
- Navbar: sticky, shrinking pill on desktop, services mega-menu, mobile drop menu; magnetic buttons; footer with newsletter and centred CTA
- Mobile layout pass (navbar, two-column services, OpenAI carousel); removed the "cost of working without AI" section
- Deployment on Vercel, DNS conflict on Hostinger resolved, Brevo domain authenticated
