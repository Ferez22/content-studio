#!/usr/bin/env bash
# Automatic checks on a rendered video (motion-video P4). Visual review of the contact sheet is still required.
# Usage: scripts/check-render.sh <video.mp4> <W>x<H> <seconds> [out_dir] [--loop]
# --loop: seamless loop expected (studio-ui-moment): first vs last frame SSIM must be >= 0.99.
# Prints PASS/FAIL/WARN lines, writes <out_dir>/contact.png (12 frames, evenly spaced). Exit 1 on any FAIL.
set -euo pipefail
f=$1; size=$2; want_dur=$3; out=${4:-"$(dirname "$f")/check"}; loop=${5:-}
mkdir -p "$out"
fail=0
say() { echo "$1 $2"; [ "$1" = FAIL ] && fail=1 || true; }

w=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$f")
h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$f")
fps=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$f")
codec=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$f")
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
audio=$(ffprobe -v error -select_streams a -show_entries stream=codec_name -of csv=p=0 "$f" | head -1)

[ "${w}x${h}" = "$size" ] && say PASS "size ${w}x${h}" || say FAIL "size ${w}x${h}, want $size"
awk -v a="$dur" -v b="$want_dur" 'BEGIN{d=a-b; if (d<0) d=-d; exit !(d<=0.1)}' \
  && say PASS "duration ${dur}s" || say FAIL "duration ${dur}s, want ${want_dur}s"
[ "$codec" = h264 ] && say PASS "codec h264" || say WARN "codec $codec (platforms expect h264)"
say INFO "fps $fps"
[ -n "$audio" ] && say INFO "audio $audio" || say INFO "audio none (silent master: cue sheet required if music planned)"

# Empty frames: near-pure black below pixel threshold 0.02 (dark brand bg #0a0a0a is above it).
blacks=$(ffmpeg -v info -i "$f" -vf "blackdetect=d=0.2:pix_th=0.02" -an -f null - 2>&1 | grep -c black_start || true)
[ "$blacks" = 0 ] && say PASS "no empty black segments" || say WARN "$blacks empty black segment(s) >= 0.2s"

# Dead air: identical frames for >= 1.5 s (holds can be intended: end card, read time).
freezes=$(ffmpeg -v info -i "$f" -vf "freezedetect=n=0.001:d=1.5" -an -f null - 2>&1 | grep -o 'freeze_start: [0-9.]*' | awk '{printf "%ss ", $2}' || true)
[ -z "$freezes" ] && say PASS "no frozen segment >= 1.5s" || say WARN "frozen >= 1.5s starting at: $freezes(check intended)"

if [ "$loop" = --loop ]; then
  ffmpeg -v error -y -i "$f" -vf "select=eq(n\,0)" -frames:v 1 "$out/first.png"
  ffmpeg -v error -y -sseof -0.05 -i "$f" -frames:v 1 "$out/last.png"
  ssim=$(ffmpeg -v info -i "$out/first.png" -i "$out/last.png" -lavfi ssim -f null - 2>&1 | grep -o 'All:[0-9.]*' | cut -d: -f2)
  awk -v s="$ssim" 'BEGIN{exit !(s>=0.99)}' && say PASS "loop seam SSIM $ssim" || say FAIL "loop seam SSIM $ssim < 0.99"
fi
ffmpeg -v error -y -i "$f" -vf "fps=12/${dur},scale=360:-1,tile=4x3" -frames:v 1 "$out/contact.png"
say INFO "contact sheet $out/contact.png"
exit $fail
