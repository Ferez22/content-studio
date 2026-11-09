#!/usr/bin/env bash
# Links the studio's own skills (skills/<name>/SKILL.md) into the Claude skills folder(s).
# Usage: scripts/install-skills.sh [--check]   --check only reports, changes nothing.
set -euo pipefail
repo="$(cd "$(dirname "$0")/.." && pwd)"
check=0; [ "${1:-}" = "--check" ] && check=1
targets=("$HOME/.claude/skills")
if [ -n "${CLAUDE_CONFIG_DIR:-}" ] && [ "$CLAUDE_CONFIG_DIR/skills" != "$HOME/.claude/skills" ]; then
  targets+=("$CLAUDE_CONFIG_DIR/skills")
fi
missing=0
for dir in "$repo"/skills/*/; do
  [ -f "$dir/SKILL.md" ] || continue
  name="$(basename "$dir")"; src="${dir%/}"
  for t in "${targets[@]}"; do
    link="$t/$name"
    if [ -L "$link" ] && [ "$(readlink "$link")" = "$src" ]; then
      echo "ok       $link"
    elif [ -e "$link" ] || [ -L "$link" ]; then
      echo "conflict $link exists and is not a link to $src (left untouched)"; missing=1
    elif [ "$check" = 1 ]; then
      echo "missing  $link"; missing=1
    else
      mkdir -p "$t" && ln -s "$src" "$link" && echo "linked   $link -> $src"
    fi
  done
done
exit "$missing"
