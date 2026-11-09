#!/usr/bin/env python3
"""fr-human: vérifie qu'un texte français se lit comme du français natif, pas comme de l'IA ou une traduction.

Usage: python3 -I check.py texte.txt [--registre vous|tu] [--fix] [--json]
  --registre  signale toute forme de l'autre registre (sinon: signale seulement un mélange tu/vous)
  --fix       corrige ce qui est sûr (caractères invisibles, espaces avant ? ! : ;, doubles espaces) et écrit le texte corrigé
Sortie: liste des points (bloquant / avertissement), puis verdict. Code retour 1 s'il reste un point bloquant.
"""
import argparse
import json
import re
import statistics
import sys
from pathlib import Path

LEXIQUE = json.loads((Path(__file__).parent / "lexique.json").read_text(encoding="utf-8"))
INVISIBLES = "​‌‍⁠﻿­"
NBSP = "  "  # espaces insécables: typographie française correcte, jamais signalées

TU = re.compile(r"\b(tu|toi|ton|ta|tes|t'(?=\w))\b|\bt'", re.I)
VOUS = re.compile(r"(?<![-\w])(vous|votre|vos)\b", re.I)  # pas « rendez-vous »


def check(text, registre=None):
    points = []

    def add(n, cat, sev, extrait, fix):
        points.append({"ligne": n, "categorie": cat, "severite": sev, "extrait": extrait.strip()[:80], "fix": fix})

    lines = text.splitlines()
    for n, line in enumerate(lines, 1):
        if not line.strip():
            continue
        # Empreinte
        for ch in "—–":
            if ch in line:
                add(n, "empreinte", "bloquant", line, "tiret long/moyen: virgule, deux-points, point ou reformuler")
        if any(c in line for c in INVISIBLES):
            add(n, "empreinte", "bloquant", line, "caractère invisible (corrigé par --fix)")
        if re.search(r'"[^"]{2,}"', line) or re.search(r"[“”]", line):
            add(n, "typographie", "avertissement", line, "guillemets anglais: « » en français")
        # Typographie française
        for m in re.finditer(r"(?<=[\w)»\]])([?!;:])(?=\s|$|[A-Za-zÀ-ÿ])", line):
            if line[max(0, m.start() - 6):m.start()].endswith(("http", "https")):
                continue
            add(n, "typographie", "bloquant", line[max(0, m.start() - 20):m.end() + 5],
                f"espace avant « {m.group(1)} » (corrigé par --fix)")
        if re.search(r"\s[,.]", line.replace("...", "")):
            add(n, "typographie", "bloquant", line, "pas d'espace avant une virgule ou un point")
        if re.search(r"\b\d{1,3},\d{3}\b", line):
            add(n, "typographie", "bloquant", line, "séparateur de milliers anglais: 1 000, pas 1,000")
        if re.search(r"\b\d+\.\d+\b", line) and not re.search(r"\d+\.\d+\.\d+|v\d", line):
            add(n, "typographie", "avertissement", line, "décimale à l'anglaise: 3,5 et non 3.5")
        if re.search(r"\d%", line):
            add(n, "typographie", "avertissement", line, "pourcentage: « 17 % » (espace) en français")
        if re.match(r"\s*#+ ", line):  # titre markdown, pas un hashtag
            words = [w for w in re.findall(r"[A-Za-zÀ-ÿ']+", line) if len(w) > 3]
            if len(words) >= 3 and sum(w[0].isupper() for w in words[1:]) >= max(2, len(words) // 2):
                add(n, "typographie", "avertissement", line, "titre en Title Case anglais: majuscule au premier mot seulement")
        # Lexique
        for cat, key in (("tic IA", "tics"), ("calque", "calques")):
            for e in LEXIQUE[key]:
                m = re.search(e["motif"], line, re.I | re.M)
                if m:
                    add(n, cat, e["severity"], m.group(0), e["fix"])

    # Registre tu/vous
    nb_tu, nb_vous = len(TU.findall(text)), len(VOUS.findall(text))
    if registre == "vous" and nb_tu:
        add(0, "registre", "bloquant", f"{nb_tu} forme(s) de tutoiement", "registre attendu: vous")
    elif registre == "tu" and nb_vous:
        add(0, "registre", "avertissement", f"{nb_vous} forme(s) de vouvoiement", "registre attendu: tu (vous pluriel possible)")
    elif not registre and nb_tu and nb_vous:
        add(0, "registre", "bloquant", f"tu x{nb_tu} et vous x{nb_vous}", "mélange tu/vous: choisir un registre (voicing de la marque)")

    # Rythme
    prose = re.sub(r"#.*|\|.*", "", text)
    phrases = [p for p in re.split(r"(?<=[.!?…])\s+", prose) if len(p.split()) >= 2]
    stats = {"phrases": len(phrases), "tu": nb_tu, "vous": nb_vous}
    if len(phrases) >= 5:
        lens = [len(p.split()) for p in phrases]
        cv = statistics.pstdev(lens) / statistics.mean(lens)
        stats["variation"] = round(cv, 2)
        if cv < 0.45:
            add(0, "rythme", "avertissement", f"variation {cv:.2f} (cible 0,45+)", "alterner phrases très courtes et plus longues")
        debuts = {}
        for p in phrases:
            w = p.split()[0].lower().strip("«»\"'")
            debuts[w] = debuts.get(w, 0) + 1
        for w, c in debuts.items():
            if c >= 3 and c / len(phrases) > 0.25:
                add(0, "rythme", "avertissement", f"« {w} » commence {c} phrases", "varier les débuts de phrase")
        ment = len(re.findall(r"\b\w{4,}ment\b", prose, re.I)) / max(1, len(prose.split())) * 100
        if ment > 3:
            add(0, "rythme", "avertissement", f"{ment:.1f} adverbes en -ment / 100 mots", "couper les adverbes, garder le verbe fort")
    return points, stats


def fix(text):
    text = "".join(c for c in text if c not in INVISIBLES)
    text = re.sub(r"(?<=[\w)»\]])([?!;:])(?=\s|$|[A-Za-zÀ-ÿ])", r" \1", text)
    text = re.sub(r" ([?!;:])(?=[A-Za-zÀ-ÿ])", r" \1 ", text)
    text = re.sub(r"(?<=\S) {2,}(?=\S)", " ", text)
    return text


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("fichier", help="fichier texte, ou - pour stdin")
    ap.add_argument("--registre", choices=["vous", "tu"])
    ap.add_argument("--fix", action="store_true")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    text = sys.stdin.read() if a.fichier == "-" else Path(a.fichier).read_text(encoding="utf-8")
    if a.fix:
        text = fix(text)
        if a.fichier != "-":
            Path(a.fichier).write_text(text, encoding="utf-8")
    points, stats = check(text, a.registre)
    bloquants = [p for p in points if p["severite"] == "bloquant"]
    if a.json:
        print(json.dumps({"points": points, "stats": stats, "ok": not bloquants}, ensure_ascii=False, indent=1))
    else:
        for p in points:
            where = f"l.{p['ligne']}" if p["ligne"] else "texte"
            print(f"[{p['severite']}] {where} {p['categorie']}: « {p['extrait']} » -> {p['fix']}")
        print(f"\n{len(bloquants)} bloquant(s), {len(points) - len(bloquants)} avertissement(s) | {stats}")
        print("VERDICT: OK" if not bloquants else "VERDICT: À CORRIGER")
    sys.exit(1 if bloquants else 0)


if __name__ == "__main__":
    main()
