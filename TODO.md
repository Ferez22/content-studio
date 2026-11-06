# TODO

Open work. When an item is done, remove it here and add it to `DONE.md` with the date.

## Partner program

- [ ] Launch: set `NEXT_PUBLIC_PARTNER_PROGRAM=true` in Vercel Production and redeploy (hidden in prod until then: routes 404, no sitemap entries, no navbar/footer links)
- [ ] Choose the program name (working copy says "Partner program") and update `partners`/`partnerPages` in all three message files
- [ ] Add the dedicated partner Cal.com link to `site.partnerBookingUrl` in `lib/site.ts` (falls back to the discovery call)
- [ ] Lawyer check: co-ownership and contract model before promising terms beyond "set in a partnership agreement"
- [ ] Partner pages for the other types (universities, startups, non-profits): add the slug to `partnerSlugs`, copy under `partnerPages.<slug>`, then turn `/partners` into an overview page
- [ ] Replace "Already in motion" with named partners and results once they agree to be named

## Legal

- [ ] Optional but recommended: have a lawyer review privacy, terms and legal notice (governing law set to Tunisia, courts of Tunis)
- [ ] Add the full tax number (matricule fiscal) to the legal notice if you want it shown
- [ ] Legal pages (privacy, terms, legal notice) still name Qartmina SUARL in Les Berges du Lac, Tunisia, under Tunisian law: that is the legal entity, so it stays until the entity or its address changes. Update them (with a lawyer) when it does

## Search and indexing

- [ ] Bing Webmaster Tools: import the site from Search Console
- [ ] LinkedIn Post Inspector: check the preview for `https://www.qartmina.com/en`
- [ ] Create a Google Business Profile for Qartmina (France address)
- [ ] When the blog is written for fr and de: remove the `/blog/:path*` to `/en/blog/:path*` redirect in `next.config.ts` so unprefixed blog URLs get language detection again. `/about` and `/contact` keep the next-intl 307 with language detection

## Positioning

- [ ] France first for now (Fares 2026-11-05). Next markets when ready: French-speaking Europe (Belgium, Switzerland, Luxembourg), then DACH: add them to `about.coreMarkets` / `about.reach` in all three message files
- [ ] `how-to-choose-a-crm` still frames hosting for the Gulf and Egypt: refresh for European SMEs when the post is next updated

## Services

- [ ] Translate the services copy to fr and de (`services`, `serviceCategories`, `servicePages`, `home.services`, `home.hero` title and subtitle, `metadata`, `header.allServices`/`categoryOverview`, `footer.positioning`, `common.readyText`). The pre-category fr/de copy for the first 6 services is in git history (commit 21cef84) if useful
- [ ] The interactive workflow under the hero is still about AI agents: decide whether to keep it under the digital partner title
- [ ] Example videos on video-motion, social-media and personal-branding are by independent creators on Prompt Motion (no licence stated) and hotlinked from their server (up to 28 MB each): ask the creators for permission, or replace them with our own work, then self-host compressed copies
- [ ] Confirm the network can deliver what the copy promises: voice-overs in Arabic, French and English (video), on-site IT via a local technician (IT support), Power BI as an example tool (data platforms) (Fares is asking them)
- [ ] Deepen the other service pages the same way (explainer, examples, what's included), then switch each one on in `serviceToggles` (`lib/site.ts`). 24 services are off for now
- [ ] Show freelancer portfolio work on service pages, with each person's permission and labelled as their work
- [ ] SEO plan from Search Console data (export the Performance report or connect a GSC MCP), then blog posts per category

## Content (later)

- [ ] CRM blog (`how-to-choose-a-crm`): product screenshots. No vendor licenses screenshots for this use except Microsoft (unaltered, with "Used with permission from Microsoft") and a monday.com press image without stated terms. Decide: ask vendors, take our own screenshots under Microsoft-style terms, or keep it without images
- [ ] CRM blog: logos for Pipedrive (press kit says files must be requested), monday.com (pack only has guideline examples), Freshworks (no official download) and Microsoft (needs an express licence). Ask the brands, or keep them as names
- [ ] CRM blog: re-check prices every few months and bump `updated` (HubSpot Starter promo, Odoo first-year discount, Salesforce UAE hosting routed to the EU since 20 Oct 2026)
- [ ] ERP and CRM setup: confirm the FAQ promise that licences are bought in the client's name, and add our own CRM setup results and testimonials once clients agree
- [ ] Blog: write `ai-2026-year-in-review` in the first week of December (brief in `briefs/`)
- [ ] Blog: refresh prices in the n8n and Copilot articles every few months (Copilot Business $18 promo ends 31 Dec 2026) and bump `updated`
- [ ] Portfolio: real case studies (Additionality, Almajd, AMLD, Docutrad) with before/after results
- [ ] More client testimonials

## Later

- [ ] Keep proof ready for the hero KPIs (3.2M€ average ROI, 80% time saved)
- [ ] OpenAI Select Partner press release (needs written approval from partnermarketing@openai.com before publishing)
- [ ] Cookie-free analytics (e.g. Vercel Web Analytics) and a line about it in the privacy policy
- [ ] Chat assistant phase 2: a real Qartmina agent answering from the site content
- [ ] Lead magnet guide ("Your first AI agent in 90 days") and its exit-intent popup
- [ ] Fix the typo "konw" in the Cal.com event description (Cal.com settings)
