---
name: content-studio
description: Content production for the brands in the content-studio repo (any brand you add). Turns an idea, link, note or campaign goal into ready-to-publish deliverables in the brand voice - LinkedIn and Instagram posts, X posts, carousels, motion graphics videos, Higgsfield videos, ads, SEO article derivatives - through gated phases (brief, strategy, spec + budget, production, review, archive) with memory of every correction. Quick mode for a single post, full mode for campaigns and series. Never publishes. Use for any content request ("write a post about", "make a carousel", "video for the launch", "campaign", "what should I post", "post for <brand>") and when onboarding is done and the owner wants content.
---

# content-studio
Repo: content-studio root, the repo this skill is linked from (paths relative to it). Follow its CLAUDE.md (hard rules,
writing modes, voicing precedence). Load ONE phase file at a time.

## Start (every request)
1. User: users/<git user.name>.md. Missing -> skill onboarding first.
2. Brand: from the request, else ask (one line, list brands/). Unknown brand -> brand-voice mode new-brand.
3. Read: soul.md (if filled), memory/learnings.md, last 15 lines of memory/feedback-log.md, voicing.md,
   brands/<b>/{brand.md, voicing.md, strategie.md, ideas.md}, content-types.md, platforms.md.
4. Voicing gate (hard rule 1), brands/<b>/voicing.md Status:
   validated -> normal | draft -> allowed, every output marked DRAFT | missing -> brand-voice first, or test mode
   (placeholder copy, TEST mark, never published) if the owner asks.
5. Mode:
| mode | when | phases | gates |
|---|---|---|---|
| quick | one post / caption / carousel text, no paid tool, no video | post plan -> 01q -> 04 -> 05 | post plan, final |
| full | campaign, series, video, ad, boost, any paid tool, several deliverables | post plan -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 | post plan + brief, plan, spec+budget, final |
Quick escalates to full as soon as a video, paid tool or boost enters. Mode stated to the owner in 1 line.

## Phases
phases/01-brief.md (01q = quick section inside) | 02-strategie.md | 03-spec.md | 04-production.md | 05-revue.md |
06-archive.md. Templates in templates/.

## Campaign folder (CLAUDE.md Layout, never moves)
brands/<b>/campagnes/YYYY-MM-DD_<slug>/ brief.md plan.md decisions.md captions/ publication.md resultats.md
livrables/NN-<format>/{script.md, storyboard.md, prompts.md, voix/, rendu/}. Quick mode: brief.md + captions/ +
decisions.md only. Status (draft|validated|published|TEST) at top of plan.md (quick: of brief.md).

## Skills called
| need | skill |
|---|---|
| hooks, English text post | li-post (hooks.json formulas), then brand voicing wins on style |
| French text (any) | written natively in French from the brief, never translated (fr-human method) |
| carousel / document post | li-carousel |
| motion graphics | motion-video (P1-P4, passes campaign folder + plan.md) |
| talking-head reel | viral-video-writing + famous-reel-editor |
| AI video / image | Higgsfield MCP (paid: quote first, hard rule 3) |
| VO | ElevenLabs MCP (T11; not connected -> say so, offer silent + subtitles) |
| SEO article | seo-writer (own gates, ships PR) |
| derivatives of a long piece | li-repurpose |
| humanize (gate) | English li-human (humanize.py + detect.py), French fr-human (check.py) |
| voicing change from results | brand-voice mode evolve |

## Rules
- Always plan before writing: idea -> refined message -> goal -> why -> target -> fit check (01-brief.md Post plan).
- Never publish, never schedule, never post. The owner presses publish. Links go in the first comment (LinkedIn).
- Never invent facts, numbers, clients, quotes, results (content-types.md proof column). Missing -> ask or change type.
- The owner's own wording is kept verbatim; only propose typo fixes and flag claims that break the rules (learnings).
- Claims describe the real flow: under-promise, never over-promise (voicing.md Sales principles).
- Brand language, register and platform variants per brand voicing.
- Read every humanize diff: keep domain terms (learnings 2026-11-05 "harness").
- Promotional max ~1 in 5 pieces per brand (content-types.md) unless strategie.md says otherwise.
- Every owner edit -> dated line in memory/feedback-log.md. Gate OK -> dated line in decisions.md + git commit.
- Paid tools: estimate credits/EUR, wait OK. No em/en dashes anywhere. No API keys in git.
