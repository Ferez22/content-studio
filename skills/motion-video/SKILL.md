---
name: motion-video
description: Produce motion graphics videos for a brand in the content-studio repo. Picks the motion type and studio-* prompt from the content and content plan, customizes it with brand data (theme, charte, voicing, assets), builds a Remotion composition, renders, runs automatic + visual checks, fixes and loops until owner OK. Use for any motion graphics, animated video, product film, explainer, launch/announcement video, UI animation or animated ad, and when content-studio reaches P3/P4 for a motion deliverable. Not for talking-head reels (famous-reel-editor) or AI-generated footage (Higgsfield).
---

# motion-video
Repo: content-studio root, the repo this skill is linked from (paths relative to it). Follow its CLAUDE.md (hard rules, writing modes).
Load ONE phase file at a time: phases/01-select.md -> 02-customize.md -> 03-render.md -> 04-check.md.

## Inputs
brand | content (idea, script or source) | content type (content-types.md) | platform(s) | campaign folder or plan.md
if called by content-studio | test: true/false.
Missing brand or content -> ask once, batched. Missing type/platform -> propose, the owner confirms.

## Read first
CLAUDE.md, content-types.md, platforms.md, prompts/types.md, prompts/index.md,
brands/<b>/{brand.md, charte.md, theme.json, voicing.md, strategie.md, assets/index.md}, memory/learnings.md.
voicing.md missing/not validated -> test mode only (placeholder copy, TEST mark), or run brand-voice first.

## Outputs (per deliverable NN)
brands/<b>/campagnes/YYYY-MM-DD_<slug>/livrables/NN-motion/
  spec.md (templates/motion-spec.md: selection, format, fields, iterations, status)
  prompts.md (source link | original | customized), storyboard.md, cue-sheet.md if silent
  rendu/<id>.mp4 (+ ratio variants), rendu/stills/, rendu/check/contact.png   (rendu/ not in git)
remotion/src/videos/<id>/Video.tsx exporting `video` (auto-registered, local: gitignored). id = <brand>-<YYYYMMDD>-<slug>-<NN>.
Standalone call (no campaign): create campagnes/YYYY-MM-DD_<slug>/ with plan.md "Status: draft" (or TEST).

## Gates
Storyboard (end of P2) and final video (end of P4): owner OK, logged dated in the campaign decisions.md + git commit.
Skip storyboard gate only if content-studio already validated spec+budget, or test mode.
Between gates: iterate alone (max 3 self-fix rounds per render).

## Rules
- Brand values only from theme.json (via remotion/src/brand). Never hardcode colors, fonts, logos, brand name.
- Real assets and facts only (brand.md, site = source of truth, assets/index.md rights). Unknown rights -> TEST only.
- All on-screen text and VO: brand voice + li-human (humanize.py, detect.py). No em dash. No full stops on screen (studio-base).
- Every frame inside platform safe zones (platforms.md, SAFE_ZONES in remotion/src/brand/formats.ts).
- Creator-inspired prompt (prompts/motion) -> credit @creator in caption on publish.
- Never publish. Never install packages without asking. Cost: Remotion local = free; any paid tool -> estimate + OK.
