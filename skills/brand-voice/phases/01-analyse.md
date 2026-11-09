# P1 Analyse -> brands/<b>/sources/analyse.md + concurrents.md
1. Existing material, ask in one batch: playbook (Notion page or URL), brand book, pitch deck, past posts (LinkedIn URL or
   paste), sales emails, testimonials. Notion connector (mcp__claude_ai_Notion__*) -> notion-search + notion-fetch;
   else export (MD/PDF) into brands/<b>/_inbox/. Condense each into sources/imports-<slug>.md (source + date).
   Logos, brand book, banners -> hand to brand-assets.
2. Site: page list from /sitemap.xml (curl) or Firecrawl links on home. Pick <= 8: home, offer/services, pricing, about,
   2 recent blog posts, cases/clients. State count + est. credits, OK -> firecrawl_scrape markdown; home also with
   formats ["branding"] (colors, fonts, logo -> brand-assets if theme.json or charte.md missing).
   No site or thin site -> say so; the interview carries more weight.
3. analyse.md: offer (what, how sold, price signals) | audience signals | claims + proof shown | tone observed (person,
   sentence length, jargon, CTAs, 3 verbatim lines) | key page structure | inconsistencies (site vs imports vs CLAUDE.md
   seed) | gaps (missing proof, vague ICP, no CTA).
4. Competitors: from brand.md, else WebSearch offer keywords + market. Propose 2-3 with a one-line why, OK -> scrape home
   + offer page each (cost gate). concurrents.md table: | name | URL | positioning line | ICP | proof | tone | price signal |
   better than us at | open angle for us |.
5. End of analyse.md: 8-15 numbered hypotheses to confirm. Each: statement | evidence | confidence (high|med|low).
   Example: "H3: buyer = operations lead at 50-500 staff companies | case studies page | med".
6. Show owner: 5-line summary, hypotheses count, top 3 open angles. Commit. Go to P2 (no gate).
