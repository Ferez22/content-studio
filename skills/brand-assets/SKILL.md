---
name: brand-assets
description: Curate marketing assets the owner drops in brands/<brand>/_inbox/ of the content-studio repo (logos, banners, brand book, charte graphique, fonts, photos, screenshots, videos, music, decks, templates). Classifies, renames and files them into brands/<brand>/assets/, extracts identity rules into charte.md, render values into theme.json, facts into brand.md, and logs every file in assets/index.md. Use when the owner adds or sends brand assets ("j'ai mis des assets", "voila le brand book", "nouveau logo"), when a brand is added, or when content-studio / motion-video needs an asset that is missing.
---

# brand-assets
Repo: content-studio root, the repo this skill is linked from (paths below relative to it). Follow its CLAUDE.md.
Goal: raw drop -> curated, named, linked assets any skill can find without asking again.

## Files owned
| file | holds | edit rule |
|---|---|---|
| brands/<b>/assets/<category>/ | curated files | free |
| brands/<b>/assets/index.md | one row per file: file, category, use for, source, rights, notes | free |
| brands/<b>/charte.md | visual rules (colors roles, logo usage, typography, imagery, do/don't), each cites source file + page | propose diff, owner OK |
| brands/<b>/theme.json | render values (colors incl. secondary[], fonts, logo path) read by remotion/ | propose diff, owner OK |
| brands/<b>/brand.md | facts (offer, tagline, segments, markets), marked with source | free, cite source |
| brands/<b>/sources/ | source documents (brand book PDF, playbook, decks) | free |
Never edit voicing.md or soul.md. Tone/messaging/persona findings -> brands/<b>/sources/notes-assets.md for brand-voice.

## Categories (assets/)
- logo/: logo-<variant>-<color>.<ext>. variant: primary | icon | wordmark | lockup. color: full | black | white. Prefer SVG; PNG >= 1000px.
- fonts/: font files + license line in index. Font not on Google Fonts -> flag: remotion/src/brand/fonts.ts needs local loading.
- images/: photo-<slug>, screenshot-<feature>-<slug>, ui-<slug>, illustration-<slug>.
- banners/: existing banners/ads/posts as reference: <platform>-<ratio>-<slug>.
- video/: owned clips: clip-<slug>. audio/: music-<slug>, sfx-<slug> (license required).
- templates/: decks, social templates, Figma/Canva links (.md with URL).
- Brand book, playbooks, decks as documents -> sources/ (keep original name + date prefix YYYY-MM-DD_).
Names: lowercase, hyphens, no spaces, no accents.

## Procedure
1. Identify brand (ask if unclear). Read brand.md, theme.json, charte.md, assets/index.md.
   brand.md header names the brand's SOURCE OF TRUTH (e.g. the brand's live site). On conflict it wins; sample its live
   CSS/screenshots for exact values, never guess. Live values: Firecrawl firecrawl_scrape formats ["branding"] on the
   source-of-truth home (1 page, cost gate per CLAUDE.md Tools).
2. Inventory brands/<b>/_inbox/: every file with type, size, pixel size or pages. Archives: extract into _inbox/<archive-name>/.
   Show the inventory in one table before moving anything.
3. Classify each file -> category + new name. Duplicates (same hash or same image at lower res) -> keep best, list dropped.
   Unusable (blurry, watermarked stock, screenshot of a logo) -> do not import, report.
   Ambiguous -> collect, ask the owner in one batch.
4. Extract:
   - Brand book / charte: colors (hex, role, proportion), logo rules (clearspace, min size, backgrounds, forbidden),
     typography hierarchy, imagery style, do/don't -> charte.md. Render values -> theme.json diff.
   - Logos: check variants present (full/black/white, icon, wordmark). Missing variant -> list as gap, never redraw.
   - Banners/posts: note recurring layout, colors, type use -> charte.md "observed in use" (lower trust than brand book).
   - Facts -> brand.md. Messaging/tone -> sources/notes-assets.md.
5. File: move from _inbox to target with new name, add row to assets/index.md. Source column = original filename + drop date.
6. Rights per image/video/audio/font: owned | licensed (<license>) | unknown. Unknown -> usable for TEST only.
7. Size: file > 50MB -> keep local, add its exact path to .gitignore, note "local only" in index.
8. Report to the owner (chat language, short): imported per category, extracted rules, theme.json + charte.md diffs to approve,
   gaps (missing logo variants, low-res, unknown rights, missing fonts), questions. Commit after OK.
_inbox must be empty at the end, except files waiting for an answer.

## Never
Redraw, upscale, recolor or crop logos. Delete a file without listing it in the report. Use unknown-rights assets in
published content. Hardcode brand values in remotion/ code (theme.json only).
