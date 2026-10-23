# Qartmina website: site map and build brief

Brief for Claude Code. Covers pages, routes, translations and the sections of each page. Layout, branding and visual design are intentionally left out: apply the existing design system.

Structure modelled on kodkodkod.studio (scraped 23 October 2026). All copy below is Qartmina's own. Do not copy text, images, logos, stats or testimonials from that site.

## 1. Tech and global setup

- **Framework:** Next.js (App Router), TypeScript.
- **i18n:** three locales, `en` (default), `fr`, `de`, with locale-prefixed routes: `/en/...`, `/fr/...`, `/de/...`. The root `/` redirects based on the `Accept-Language` header, falling back to `en`. Use `next-intl` (or an equivalent) with middleware for locale detection.
- **Translation files:** `messages/en.json`, `messages/fr.json`, `messages/de.json`, one namespace per page and per shared component (`common`, `header`, `footer`, `home`, `services`, `servicePages.<slug>`, `portfolio`, `blog`, `about`, `contact`, `book`, `legal`, `chat`, `leadMagnet`).
- **Slugs:** keep route slugs identical across locales (simpler routing, simpler hreflang). Translate only the content.
- **Content:** blog posts and case studies as MDX per locale, e.g. `content/blog/<locale>/<slug>.mdx` and `content/portfolio/<locale>/<slug>.mdx`.
- **SEO on every page:** `generateMetadata` with a unique title and description per locale, `alternates.languages` for en, fr, de and x-default, canonical URL, Open Graph and Twitter tags, `robots: index, follow`.
- **Site files:** `app/sitemap.ts` (every route in every locale, with alternates), `app/robots.ts` pointing to the sitemap, favicon, a default OG image.
- **Structured data:** JSON-LD `Organization` (name, url, logo, email, sameAs LinkedIn) on home; `Service` on each service page; `FAQPage` for the home FAQ; `BlogPosting` on posts.
- **Contact data:** fares@qartmina.com, LinkedIn https://www.linkedin.com/company/qartmina/, qartmina.com. Tagline: "Start that project."

## 2. Routes

```
app/[locale]/
├── page.tsx                      Home (anchors: #services, #about, #contact)
├── services/[slug]/page.tsx      Service page, slugs below
│     ai-agents
│     automation
│     integration
│     consulting
│     training
│     chatbots
├── portfolio/page.tsx            Case studies list
├── portfolio/[slug]/page.tsx     Case study detail
├── blog/page.tsx                 Articles list
├── blog/[slug]/page.tsx          Article
├── about/page.tsx                Company and founder
├── contact/page.tsx              Contact form page
├── book/page.tsx                 Booking page (embedded calendar)
├── privacy/page.tsx              Privacy policy (GDPR)
├── terms/page.tsx                Terms of service
└── legal/page.tsx                Impressum / mentions legales (required in DE and FR)
app/api/contact/route.ts          Contact form handler
app/api/lead/route.ts             Lead magnet sign-up handler
```

Use `generateStaticParams` for locales, service slugs, case studies and posts.

## 3. Shared components and their content

**Header**
- Logo linking to the locale home.
- Nav: Home, Services (`/#services`), Portfolio, About (`/#about`), Blog, Contact (`/#contact`).
- Language switcher: English, Francais, Deutsch (keeps the current path).
- Primary action: "Book a call" to `/book`.
- Mobile menu with the same items.

**Footer**
- Logo, one-line positioning, LinkedIn link.
- Group "Services": the six service pages.
- Group "Company": About, Blog, Portfolio, Contact.
- Group "Contact": email, website, location line.
- Legal line: copyright 2026 Qartmina, Privacy, Terms, Legal notice.

**Chat assistant widget**
- Greeting plus four quick replies: AI agents, Automation, Pricing, Contact.
- Phase 1: scripted answers and a link to `/book`. Phase 2: a real Qartmina agent answering from the site content (a live demo of the offer).

**Lead magnet popup (exit intent, once per visitor)**
- Free guide offer, e.g. "Your first AI agent in 90 days: a checklist for managers".
- Email field, GDPR consent checkbox, success state, dismiss link.
- Remember dismissal in localStorage.

## 4. Home page sections, in order

1. **Hero**
   - H1: "Put AI agents to work in your company"
   - Subline: agents that take repetitive work off your teams, inside the tools you already use, with a person approving what matters.
   - Actions: "Book a free 30-minute call" (`/book`), "See our work" (`/portfolio`).
   - Key figures, 4 items. Only real numbers. Until you have client results, use facts about the offer, e.g. "3 languages", "90-day pilot", "6 services", "100% human-approved outputs".
   - Supporting visual explaining an agent: inputs (PDF, email, Excel, ERP), the agent, outputs (report, CRM update, approval).

2. **Trusted by**
   - Client or partner logos, only real ones with permission. Start with partners (ESGITECH) or hide the section until you have three.

3. **Services** (`#services`)
   - Heading, one-line intro, six items each linking to its page:
   - AI agent development: custom agents that run multi-step work across your tools and hand the result to a person to approve.
   - Process automation: end-to-end workflows that remove copy-paste, data entry and manual hand-offs.
   - Integration: AI connected to Excel, CRM, ERP, email and databases through secure connectors and APIs.
   - AI consulting: an audit of your processes and a roadmap of the agents worth building first.
   - Team training: the AI for Business programme with ESGITECH, from the basics to a first working workflow.
   - Chatbots and assistants: assistants that answer customers or staff from your own documents, around the clock.

4. **The cost of working without AI**
   - Pain: hours lost collecting files, retyping figures, formatting reports; the postponed project; unread data.
   - Three benefits: time back, the long-postponed project done, new insights.
   - Two public proof points with source links: NBIM about 213,000 hours saved with Claude; Moody's credit memo from about 40 hours to 2 minutes.

5. **Why choose us** (`#about`)
   - Four points: engineering first; people stay in control (traceable figures, approved outputs); your data protected (enterprise plans, self-hosting where needed, GDPR); measured results (time measured before and after).
   - Supporting figures: only real ones (founder's years of experience, projects delivered, languages).

6. **Team**
   - Founder: Fares, Founder and Principal Engineer, photo, skills.
   - Partners: ESGITECH. Extend as the team grows.

7. **Testimonials**
   - Quote, name, role, company. Hide until you have real ones; never invent.

8. **FAQ** (4 to 6 questions)
   - How long does it take to build an agent?
   - What return can we expect, and how do you measure it?
   - Do you build custom agents or use ready-made ones?
   - Where is our data processed, and is it used for training?
   - What happens after launch?
   - Can our team maintain the agents ourselves?

9. **Contact** (`#contact`)
   - Heading "Let's find your first agent", email, LinkedIn, location, "Book a call" action.
   - Form: Name, Email, Company, Website, Message, Send. Success and error states, spam protection, privacy consent line. Posts to `/api/contact`.

## 5. Service page sections (`/services/[slug]`)

Same section structure for all six:

1. Back link "Our services" to `/#services`.
2. Intro: service name (H1), one explanatory paragraph, action "Start your project" to `/contact`.
3. **Key features**: 4 items, each a title and one line.
4. **Use cases**: 4 concrete examples.
5. Closing call to action "Ready to get started?" linking to `/contact`.
6. Metadata: title "<Service> | Qartmina", description = the service's one-liner.

Store each service's content in `messages/<locale>.json` under `servicePages.<slug>` with keys `title`, `intro`, `features[4] {title, text}`, `useCases[4]`, `metaTitle`, `metaDescription`.

Example content for `ai-agents`:
- Features: works across your tools; asks a person before anything leaves; every figure linked to its source; runs on a schedule or on demand.
- Use cases: data room and document analysis; invoice intake and reconciliation; monthly reporting packs; lead qualification and CRM updates.

## 6. Other pages: sections

- **Portfolio list**: intro, filter by sector or service, list of case studies (sector, problem, agent built, measured result).
- **Case study detail**: context, approach, result with before and after figures, client quote, call to action. Start with the due diligence agent, labelled as a demo.
- **Blog list**: intro, tag filter, posts with title, date, excerpt, tags.
- **Blog post**: title, date, reading time, body (MDX), author box, related posts, call to action.
- **About**: the name's story ("the new mine"), founder bio, how we work, partners, locations, call to action.
- **Contact**: same content as the home contact section, standalone.
- **Book**: short intro, embedded calendar (Cal.com or Calendly), 30-minute slot.
- **Privacy, Terms, Legal notice**: legal text per locale.

## 7. What to leave out from the reference

- Their 47 machine-translated languages: keep EN, FR, DE done well; add Arabic later if you target Tunisia actively.
- Unverified figures (ROI, satisfaction, project counts): only publish what you can prove.
- Team and client logo sections you can't fill yet.

## 8. Build order for Claude Code

1. Next.js project, i18n middleware and `[locale]` routing, translation files, root layout, header, footer.
2. Home page sections 1, 3, 4, 5, 8, 9.
3. Service page route and the six service entries.
4. Contact API route, contact and book pages, legal pages.
5. SEO layer: metadata, alternates, JSON-LD, `sitemap.ts`, `robots.ts`.
6. Portfolio and blog with MDX.
7. Chat widget and lead magnet popup.
8. Deploy, then submit the sitemap in Google Search Console and Bing Webmaster Tools.
