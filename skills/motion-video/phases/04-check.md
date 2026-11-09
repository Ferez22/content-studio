# P4 Check + loop
1. Auto: remotion/scripts/check-render.sh <mp4> <W>x<H> <seconds> <rendu>/check [--loop]  -> FAIL = fix first.
   --loop for looping pieces (studio-ui-moment): first/last frame SSIM >= 0.99.
   WARN frozen segment: intended hold (end card, read time >= 1.5 s for long text)? else dead air -> add motion.
2. Visual: Read rendu/check/contact.png + stills. Checklist (each pass/fail in spec.md Iterations):
   - text legible, no overflow/cut, inside safe zones, max 2 lines per text block
   - charte: mode colors, accent = detail only, one pillar tint max, logo variant right for the background
   - studio-base quality bar: not template-looking, 1 idea per shot, transitions motivated, no banned effects
   - hook readable < 3 s; end card held >= 1.5 s; CTA present
   - TEST mark present iff test mode; no em dash; no invented facts
3. Fail -> fix code -> re-render (stills first) -> recheck. Max 3 rounds, then present with remaining issues listed.
4. Present to the owner (chat language, short): mp4 path, contact sheet, what was checked, known compromises, cost (tokens only).
5. The owner edits -> dated entry memory/feedback-log.md -> apply -> P3 -> P4. Loop until OK.
6. OK -> spec.md status validated, decisions.md entry, commit (code + spec, not rendu/). Add new learnings
   (confirmed >= 2x) to memory/learnings.md. Results later (content-studio P6) set performed in prompts/index.md.
