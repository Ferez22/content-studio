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

## Search and indexing

- [ ] Bing Webmaster Tools: import the site from Search Console
- [ ] LinkedIn Post Inspector: check the preview for `https://www.qartmina.com/en`
- [ ] Create a Google Business Profile for Qartmina (Les Berges du Lac)

## Content (later)

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
