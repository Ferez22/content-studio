---
name: seo-writer
description: SEO for a brand website from the content-studio repo. Researches with Google Search Console (gsc MCP) and SERPs, writes or refreshes blog articles in the brand voice, humanizes them with li-human (English) or fr-human (French), optimizes on-page SEO, and ships them as a pull request on the site's own repo (never merges, never publishes). Also audits a site from GSC data (lost pages, quick wins, low CTR, cannibalization) and turns articles into LinkedIn posts with li-repurpose. Adapts to each user and site on first run (asks for the repo, content folder, format). Use for SEO, blog posts, articles, keywords, GSC/Search Console analysis, rankings, "write an article about X", "why is my traffic down", "improve this post".
---

# seo-writer
Repo: content-studio root, the repo this skill is linked from (paths relative to it). Follow its CLAUDE.md.
Site repo rules (its CLAUDE.md, writing rules, build) override ours inside the site repo.
Load ONE phase file at a time.

## Modes
| mode | when | phases |
|---|---|---|
| setup | brand has no brands/<b>/seo/config.md | 00 |
| audit | "check my SEO", traffic questions, monthly | 01 (audit) -> actions list -> each action = write/refresh |
| write | new article | 01 -> 02 -> 03 -> 04 -> 05 -> 06 |
| refresh | improve an existing post (quick win, low CTR, outdated) | 01 (page) -> 02 -> 03 (edit, keep URL) -> 04 -> 05 -> 06 |

## Data (per brand)
brands/<b>/seo/config.md      site repo, content dir, format, frontmatter schema, languages, GSC property, rules
brands/<b>/seo/keywords.md    clusters: keyword | intent | target URL | status (live|planned|gap)
brands/<b>/seo/index.md       | slug | type | primary keyword | URL | status (brief|draft|pr|live) | PR | date | GSC D+14 | D+30 |
brands/<b>/seo/audit.md       latest audit (dated) + action list
brands/<b>/seo/articles/YYYY-MM-DD_<slug>/{serp.md, brief.md, article.mdx, linkedin.md}

## Gates (owner OK, logged in the article folder brief.md "Decisions")
Brief (end of 02). PR review on GitHub = final gate (the owner merges; merge = publish, never by the agent).

## Rules
- Voice: brands/<b>/voicing.md when validated; until then the site's own published posts + site CLAUDE.md writing rules
  (site = source of truth). Content type from content-types.md (educational, informative, news, case-study, opinion...).
- Facts: brand.md, site, cited third-party sources with URL. Never invent numbers, clients, quotes, results.
- Humanize every article: English li-human (humanize.py + detect.py), French fr-human (check.py), 03-write step 6.
- No em/en dashes. No slop words (site list + li-human slop.json).
- GSC: read-only use (no sitemap submit, no site add/delete) unless the owner asks. Drop non-human queries
  (contain "<" or ">", or > 120 chars: AI tools probing search).
- Never commit to the site's main, never merge, never deploy. Work in a git worktree so the owner's checkout is untouched.
- Paid tools (Firecrawl, see CLAUDE.md Tools): estimate + OK. WebSearch first, Firecrawl for full page text.
