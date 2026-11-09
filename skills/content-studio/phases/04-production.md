# P4 Production
Iterate alone between gates. Max 3 self-fix rounds per deliverable, then show the owner.
## Text (post, caption, carousel text)
0. No validated post plan in brief.md / plan.md -> stop, go back to 01 Post plan.
1. 3 hooks (quick mode: here; full: from plan.md), each serving the plan's goal and target. Pick the strongest, 1-line why, keep the 2 others for the owner.
2. Draft in the brand voice: voicing.md -> brands/<b>/voicing.md -> strategie.md (later wins). Structure from
   content-types.md for the type. One idea per post. Facts only from brand.md, sources, cited URLs.
3. Platform variants, rebuilt not cut (platforms.md): LinkedIn hook line 1, link in first comment, 1-3 hashtags |
   Instagram carousel text (slide 1 hook, 1 idea/slide, last = CTA) + caption, 3-5 hashtags, "lien en bio" / "link in
   bio" | X <= 280 chars or short thread.
4. Humanize gate on every variant (separate .txt in scratchpad, strip markdown):
   French: python3 -I ~/.claude/skills/fr-human/check.py <f> --registre <vous|tu> -> VERDICT OK.
   English: python3 -I ~/.claude/skills/li-human/humanize.py <f> --report, apply fixes by hand (read the diff, keep
   domain terms), then detect.py <f> -> 0 artefacts, 0 slop, 0 fingerprint.
5. Save captions/<platform>.md (copy-ready, one code block each, first comment block if a link) + gate result line.
## Video
Motion -> skill motion-video with campaign folder, NN, content, plan.md (spec+budget already OK: skips its storyboard
gate). Higgsfield -> quoted calls only, within approved budget, outputs in livrables/NN/rendu/. Subtitles + captions
go through step 4. Render files stay out of git.
## Then
Go to 05-revue.md.
