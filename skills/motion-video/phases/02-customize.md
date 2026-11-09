# P2 Customize
1. Build the customized prompt = prompts/mine/studio-base.md + type prompt. Fill every {{field}} from:
   theme.json (colors, fonts, logos, mode), charte.md (look rules), brand.md (facts, numbers), voicing.md (tone, CTA),
   assets/index.md (real files: logos, screenshots, illustrations, clips, music + rights), content input.
   Missing input the prompt asks for -> ask the owner in one batch. Never invent facts, metrics, screens.
2. Copy: write on-screen text (+ VO script if any) in brand language -> livrables/NN-motion/copy.txt.
   French copy: fr-human (write in French, check.py --registre per voicing, gate VERDICT OK). English copy: li-human:
   humanize.py on ALL copy: python3 -I ~/.claude/skills/li-human/humanize.py copy.txt --report (fix every artefact).
   detect.py score on PROSE only (VO script, caption): python3 -I ~/.claude/skills/li-human/detect.py vo.txt.
   Not on UI labels / short on-screen fragments: detect.py flags them as uniform/unspecific (false positive).
   Keep lines short: 1 idea per line, headline fits 1-2 lines at the master size.
3. prompts.md: | source link | original | customized | (source = prompts/mine/<file> or creator URL).
4. storyboard.md: | scene | duration (start-end s) | visual/motion | on-screen text | VO |. Timings on the beat grid
   if music (default 120 BPM, 2 s bars). Name the transition logic per cut (shared shape, mask, push).
5. Audio: owned/licensed track in assets/audio -> use it. None -> silent master + cue-sheet.md (time | event | sound).
Gate: storyboard (see SKILL.md Gates).
