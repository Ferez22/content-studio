#!/usr/bin/env python3
"""humanize check: flags what makes a text read as AI-written (or translated) before anyone sees it.

Usage: python3 check.py draft.txt [--lang en|fr] [--register vous|tu] [--fix] [--json]
  --lang      en (default) or fr: picks the lexicon and the typography rules
  --register  fr only: flag every form of the other register (default: flag a tu/vous mix)
  --fix       apply safe fixes in place (invisible characters, double spaces, French spaces before ? ! : ;)
Exit code 1 while a blocking issue remains. Standard library only.
"""
import argparse
import json
import re
import statistics
import sys
from pathlib import Path

HERE = Path(__file__).parent
INVISIBLE = "​‌‍⁠﻿­"
TU = re.compile(r"\b(tu|toi|ton|ta|tes)\b|\bt'", re.I)
VOUS = re.compile(r"(?<![-\w])(vous|votre|vos)\b", re.I)  # not "rendez-vous"
FR_PUNCT = re.compile(r"(?<=[\w)»\]])([?!;:])(?=\s|$|[A-Za-zÀ-ÿ])")


def load(lang):
    path = HERE / "lexicon" / f"{lang}.json"
    return json.loads(path.read_text(encoding="utf-8"))["patterns"]


def check(text, lang="en", register=None):
    issues = []

    def add(line_no, kind, severity, excerpt, fix):
        issues.append({"line": line_no, "kind": kind, "severity": severity, "excerpt": excerpt.strip()[:80], "fix": fix})

    patterns = load(lang)
    for n, line in enumerate(text.splitlines(), 1):
        if not line.strip():
            continue
        if "—" in line or "–" in line:
            add(n, "fingerprint", "blocking", line, "em/en dash: use a comma, a colon, a full stop, or rewrite")
        if any(c in line for c in INVISIBLE):
            add(n, "fingerprint", "blocking", line, "invisible character (--fix removes it)")
        if lang == "fr":
            for m in FR_PUNCT.finditer(line):
                if not line[:m.start()].endswith(("http", "https")):
                    add(n, "typography", "blocking", line[max(0, m.start() - 20):m.end() + 5],
                        f"French needs a space before « {m.group(1)} » (--fix adds it)")
            if re.search(r"\b\d{1,3},\d{3}\b", line):
                add(n, "typography", "blocking", line, "French thousands: 1 000, not 1,000")
            if re.search(r"\d%", line):
                add(n, "typography", "warning", line, "French percent: « 17 % »")
            if re.search(r'"[^"]{2,}"', line):
                add(n, "typography", "warning", line, "French quotes: « »")
        else:
            if re.search(r"\w\s+[?!;:](\s|$)", line):
                add(n, "typography", "blocking", line, "English: no space before ? ! ; :")
        if re.search(r"\s[,.](?!\.)", line):
            add(n, "typography", "blocking", line, "no space before a comma or a full stop")
        for p in patterns:
            m = re.search(p["pattern"], line, re.I)
            if m:
                add(n, p["kind"], p["severity"], m.group(0), p["fix"])

    if lang == "fr":
        tu, vous = len(TU.findall(text)), len(VOUS.findall(text))
        if register == "vous" and tu:
            add(0, "register", "blocking", f"{tu} tu form(s)", "expected register: vous")
        elif register == "tu" and vous:
            add(0, "register", "warning", f"{vous} vous form(s)", "expected register: tu (plural vous is fine)")
        elif not register and tu and vous:
            add(0, "register", "blocking", f"tu x{tu} and vous x{vous}", "pick one register (brand/voice.md)")

    sentences = [s for s in re.split(r"(?<=[.!?])\s+", re.sub(r"#.*", "", text)) if len(s.split()) >= 2]
    stats = {"sentences": len(sentences)}
    if len(sentences) >= 5:
        lengths = [len(s.split()) for s in sentences]
        variation = statistics.pstdev(lengths) / statistics.mean(lengths)
        stats["rhythm"] = round(variation, 2)
        if variation < 0.45:
            add(0, "rhythm", "warning", f"rhythm {variation:.2f} (aim for 0.45+)", "mix very short sentences with longer ones")
        starts = {}
        for s in sentences:
            w = s.split()[0].lower()
            starts[w] = starts.get(w, 0) + 1
        for w, c in starts.items():
            if c >= 3 and c / len(sentences) > 0.25:
                add(0, "rhythm", "warning", f"{c} sentences start with '{w}'", "vary how sentences start")
    return issues, stats


def fix(text, lang):
    text = "".join(c for c in text if c not in INVISIBLE)
    text = re.sub(r"(?<=\S) {2,}(?=\S)", " ", text)
    if lang == "fr":
        text = FR_PUNCT.sub(r" \1", text)
        text = re.sub(r" ([?!;:])(?=[A-Za-zÀ-ÿ])", r" \1 ", text)
    return text


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file", help="text file, or - for stdin")
    ap.add_argument("--lang", choices=["en", "fr"], default="en")
    ap.add_argument("--register", choices=["vous", "tu"])
    ap.add_argument("--fix", action="store_true")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    text = sys.stdin.read() if a.file == "-" else Path(a.file).read_text(encoding="utf-8")
    if a.fix:
        text = fix(text, a.lang)
        if a.file != "-":
            Path(a.file).write_text(text, encoding="utf-8")
    issues, stats = check(text, a.lang, a.register)
    blocking = [i for i in issues if i["severity"] == "blocking"]
    if a.json:
        print(json.dumps({"issues": issues, "stats": stats, "ok": not blocking}, ensure_ascii=False, indent=1))
    else:
        for i in issues:
            where = f"line {i['line']}" if i["line"] else "text"
            print(f"[{i['severity']}] {where} {i['kind']}: '{i['excerpt']}' -> {i['fix']}")
        print(f"\n{len(blocking)} blocking, {len(issues) - len(blocking)} warning(s) | {stats}")
        print("VERDICT: OK" if not blocking else "VERDICT: FIX FIRST")
    sys.exit(1 if blocking else 0)


if __name__ == "__main__":
    main()
