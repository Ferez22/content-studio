---
name: humanize
description: Check any text before the owner sees it, so it reads as written by a person in their own language, not by an AI and not translated. Runs check.py (dashes, invisible characters, AI tells, English calques in French, typography, tu/vous register, rhythm) and fixes what it flags. Use on every post, caption, email or page, and when the owner says "humanize", "this sounds like AI", "this sounds translated".
---

# humanize
Built-in checker (standard library Python). English: fallback gate when li-human is not installed, French: second
pass after fr-human. Run from the repo root: python3 -I skills/humanize/check.py <file> --lang en|fr.
## 1. Write it right first
- Write in the target language from the idea. Never draft in English and translate: rebuild the sentence in the
  language, with its own rhythm and references.
- Concrete beats clever: a number, a name, a real situation. One idea per sentence. Mix short and long sentences.
- Promise less than you deliver. No fact without a source.

## 2. Run the check
```
python3 check.py draft.txt --lang en
python3 check.py draft.txt --lang fr --register vous     # or --register tu
python3 check.py draft.txt --lang fr --fix                # safe fixes: invisibles, French spaces
```
(check.py and lexicon/ sit next to this file.) The gate is `VERDICT: OK`. Read every warning and decide.

## 3. Fix, then read it aloud
Rewrite each flagged line, do not just delete the word. Then read it aloud: would the owner say it like that to a
client? If not, rewrite. Domain terms stay (an AI "harness" is a noun, not slop).

## 4. Teach it
The owner removes the same word or phrase twice -> add it to lexicon/<lang>.json as a `warning` (log it in
memory/feedback-log.md). Confirmed again -> make it `blocking`.
