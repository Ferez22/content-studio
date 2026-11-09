# Platforms
Specs for spec + production phases. Checked 2026-11-04 against third-party 2026 guides, not official docs.
`?` = sources conflict or unconfirmed: verify in official help center before relying on it (boosted/ad content: always verify).
Update this file when a platform changes; log date + source.

## Ratios (master sizes)
| ratio | px | use |
|---|---|---|
| 9:16 | 1080x1920 | Reels, LinkedIn/X vertical video |
| 4:5 | 1080x1350 | IG feed, LinkedIn image + PDF carousel (default) |
| 1:1 | 1080x1080 | IG/LinkedIn feed, carousel fallback |
| 16:9 | 1920x1080 | X video, LinkedIn landscape, YouTube derivative |

Render master at 9:16 for video; derive 4:5 / 1:1 / 16:9 crops in spec (P3). Keep key content inside the 1:1 center crop so every derivative survives.

## Safe zones (9:16, 1080x1920)
- Top 250px: no text (profile/caption overlay). ?
- Bottom 670px (~35%): no text/CTA (caption, buttons). ? Meta ad guidance.
- Sides 65px each. ?
- Subtitles: above bottom safe zone, max 2 lines, 30-40 chars/line.
- Feed 4:5 / 1:1: 60px margin all sides for text.

## LinkedIn
- Post: 3000 chars. Truncation ("see more") ~140 chars mobile, ~210 desktop: hook in line 1.
- Comment: 1250 chars.
- Document (PDF carousel): max 100MB, 300 pages. Target 8-15 pages. Size 1080x1350 (4:5) default, 1080x1080 alt; all pages same size. Upload PDF, not images. Add document title (shown on post).
- Video organic: 3s min; max 10min ? (sources say 10/15/30min; 30min = ads). Ratios 9:16 to 16:9. Subtitles burned in or SRT (muted autoplay).
- Image: 1200x627 (1.91:1), 1080x1080, 1080x1350. Max 20 images ? multi-image.

## Instagram
- Caption: 2200 chars. Truncation ~125 chars: hook first.
- Hashtags: max 5 ? (reported Dec 2025 change; older sources say 30). Use 3-5.
- Reels: 9:16 1080x1920. Max 3min (180s) ? (some sources say 20min). Target 15-60s.
- Carousel: max 20 slides (image or video, video <=60s/slide). 4:5 1080x1350 default; all slides same ratio.
- Feed image: 4:5 1080x1350 | 1:1 1080x1080. 3:4 grid preview: unconfirmed, keep key content centered.

## X
- Post: 280 chars free. Premium 4000 ? or 25000 ? (sources conflict by tier). Default: write for 280.
- Video: 140s free (2:20); Premium longer (up to 4h ?). File 512MB free ?.
- Ratios: 16:9 (default), 1:1, 9:16 accepted. Image 1200x675 (16:9).
- Links in post: assume reach penalty; prefer link in reply. ?

## Video durations (targets, not limits)
| platform | organic | boosted/ad |
|---|---|---|
| LinkedIn | 30-90s | 15-30s |
| IG Reels | 15-60s | 15-30s |
| X | 30-60s | 15s |
Hook <3s everywhere (mandatory when boosted).
