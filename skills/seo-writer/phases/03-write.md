# P3 Write -> articles/<folder>/article.mdx
1. Voice: see SKILL.md Rules. Read 2 published posts of the site first; match their rhythm, opening style, depth.
2. Opening: answer the query in the first 2 sentences (bold key sentence if the site does). Then the why/how.
3. Short paragraphs, H2 every ~200-300 words, lists for steps, one table if comparing. Examples > adjectives.
4. Every number/claim: source link or brand.md fact. Unsure -> remove or ask.
5. Frontmatter per config.md schema (title, summary, description, date, tags, keywords, faq...).
6. French article -> fr-human instead: write in French from the brief (never translate an EN post), body to .txt,
   python3 -I ~/.claude/skills/fr-human/check.py body.txt --registre vous, gate VERDICT OK. Record result in brief.md.
   English article -> li-human: write body to a temp .txt (strip tables/markdown), python3 -I ~/.claude/skills/li-human/humanize.py body.txt
   --report, apply fixes in the MDX, then detect.py body.txt. Record score in brief.md.
   Long-form gate (detect.py is calibrated for LinkedIn posts): MUST be 0 artefacts, 0 slop terms, 0 fingerprint,
   burstiness >= 0.55. SPECIFICITY and VOICE (numbers per 100 words, contractions) are advisory: add real facts where
   they help, never pad numbers or change the author's voice (e.g. no forced contractions) to raise the score.
7. Refresh: edit in place, keep what ranks (headings matching queries), add what's missing, update facts + `updated`.
