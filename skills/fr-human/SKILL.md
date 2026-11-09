---
name: fr-human
description: Make French copy read as native French, never as AI text or a translation from English. Writing method (write in French from the brief, never translate), the French AI tics and English calques to avoid, French typography and register (tu/vous), and a checker (check.py) that blocks dashes, invisible characters, AI tics, calques and English punctuation before anything is shown or published. Use for every French text in the content-studio repo (posts, captions, articles, emails, scripts, slides, voicing samples), when the user says "en francais", "humanise", "ca sonne traduit", "ca sonne IA", and in place of li-human whenever the text is French.
---

# fr-human
Repo: content-studio root. Follow its CLAUDE.md. li-human stays for English; French text goes through this skill.
Why: French copy must read as native French, never as a translation from English.

## 1. Write in French first (method)
- Start from the French brief and French sources. Never write an English draft and translate it. If both languages
  are needed, write the French version first, then adapt the English (not the reverse).
- English samples in a voicing = intent only. Rebuild the French line from the idea: new hook, French rhythm, French
  references (PME, TPE, expert-comptable, URSSAF, CCI, Bpifrance, la clôture, le bilan, le devis, la relance).
- Voice reference (spoken founder French, example): "Est-ce que toi aussi tu te poses la question X ?", "J'ai complètement
  merdé à X et je voudrais partager mon expérience", "Tu penses que tu es sur la bonne direction avec l'IA ?".
  Spoken, direct, concrete. Keep that energy, adapt the register to the channel.
- Register from the brand voicing (e.g. vous for a company brand, tu for a personal brand). One register per text.
- French rhythm: short sentences, but not a stack of English-style fragments. Vary: one line of three words, then a
  sentence that breathes. Prefer verbs to nouns ("on automatise la relance", not "l'automatisation de la relance").
- Numbers French style: 1 000, 3,5, 17 %, 112 600. Dates: 5 novembre 2026. Currency: 2 900 €.

## 2. Check (always, before showing the text)
```
python3 -I ~/.claude/skills/fr-human/check.py texte.txt --registre vous   # or --registre tu
python3 -I ~/.claude/skills/fr-human/check.py texte.txt --fix             # safe fixes: invisibles, spaces before ? ! : ;
```
Gate: VERDICT OK (0 bloquant). Read every avertissement and decide; rhythm and anglicisms are judgment calls
(keep a word when it is the owner's own word, not the machine's).
Plain space before ? ! : ; is fine (LinkedIn); non-breaking spaces are correct French and never flagged.

## 3. Read it aloud (manual pass)
- Would a French founder say it to a client, word for word? If not, rewrite.
- Does a sentence only exist because English needs it ("Voici pourquoi c'est important.")? Cut it.
- Any word that is a dictionary translation (opportunité, définitivement, impacter, adresser)? Replace.
- Claims: under-promise (voicing.md). No "garanti", no number without a source.

## Lexique
lexique.json: tics (AI tells in French) + calques (English structures in French), regex + fix + severity.
The owner corrects a tic or a calque -> add the pattern (avertissement first, bloquant once confirmed) and log the
correction in memory/feedback-log.md.
