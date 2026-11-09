---
name: onboarding
description: First-run onboarding for the content-studio repo. Identifies the user, creates their profile (users/<name>.md), checks and links the skills and connectors the studio needs, then walks them through global voicing, adding or picking brands, brand voicing, brand assets and optional channels (SEO) until the studio can produce content. Resumable: each step is ticked in the user's checklist. Use when someone opens the repo for the first time, has no users/ file, says "onboarding", "setup", "getting started", "how do I start", "comment je commence", or when a request is blocked by a missing onboarding step.
---

# onboarding
Repo: content-studio root. Follow its CLAUDE.md. This file is the whole flow (no phase files).
Speak the user's chat language. One step at a time: explain in 2-3 lines why, do it, tick it, commit, next.
User can stop anytime: state is the checklist in users/<me>.md; next session resumes at the first open step.

## O0 Identify (every session start, silent)
git config user.name -> find users/*.md with that git_name. Found -> read checklist: all ticked = done, say nothing;
open steps = resume only if the user asks or the request needs that step. Not found -> new user: start O1.
No git user.name -> ask the name, match on the users/ file name.

## O1 Welcome
5 lines max: what the studio does (brand voicing -> content plan -> posts, videos, articles; Claude Code is the UI;
nothing is ever published by the agent; you validate every gate). Steps ahead O2-O8, about 30-60 min in total,
can be split over several sessions. Ask chat language if unclear.

## O2 Profile -> users/<slug>.md (templates/user.md)
Ask in one batch: name, role, company, chat language, writing languages, platforms you publish on, who validates
(default: you). Slug = first name, kebab-case. Fill git_name from git config. Commit.

## O3 Tools
1. Own skills: bash scripts/install-skills.sh --check. Missing -> explain (links repo skills/ into the Claude skills
   folder, nothing downloaded) -> OK -> bash scripts/install-skills.sh. Until linked, read skills/<name>/SKILL.md directly.
2. Third-party skills: skills/third-party.md. Check each path; missing -> list with source + what it unlocks. Install only
   after OK (hard rule 4). Required: li-human. Others: when first needed.
3. Connectors: claude mcp list. Report present / missing for gsc, Firecrawl, Higgsfield, ElevenLabs, Notion. None is
   required now; each is set up when first needed (setup notes in CLAUDE.md Tools, cost gate for paid ones).
4. Never read or print secrets. Keys stay out of git (.gitignore). Tick O3.

## O4 Global voicing
voicing.md Status validated -> show its summary, ask: adopt as-is (team member) or add your own founder voice section
(proposed diff, owner of voicing.md validates). Missing or draft -> brand-voice mode global. Tick when validated.

## O5 Brands
List brands/*/ with voicing status. Ask: work on these, add a new one, or both.
New -> brand-voice mode new-brand. Existing, voicing not validated -> brand-voice mode brand.
Record brands + role (owner | contributor) in users/<me>.md. Tick when at least one brand voicing is validated.

## O6 Assets (per brand)
Explain brands/<b>/_inbox/ (drop logos, brand book, fonts, photos, banners, clips; not in git). Wait for the drop
-> brand-assets. Skip allowed: videos then render in TEST mode with placeholder logo. Tick per brand.

## O7 Channels (optional)
Per brand: platforms from O2 -> confirm in brand voicing Channels. Blog on a site repo -> seo-writer setup mode.
Ask once, skip allowed. Tick.

## O8 Ready
Summary: what is set, what is skipped (and what it blocks). Suggest 3 first requests, one per type, e.g.
"un post LinkedIn educational pour <brand>", "une video motion pour annoncer <news>", "un article SEO sur <keyword>".
Tick O8. Commit "onboarding: <user> ready".

## Rules
- Never skip a gate the CLAUDE.md hard rules require; onboarding only orders them.
- Never delete or overwrite another user's files or brands; propose a diff to their owner.
- Test mode stays available before O4/O5 are done (CLAUDE.md hard rule 1 exception).
