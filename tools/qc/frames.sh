#!/usr/bin/env bash
# Every half second of a film on tiled sheets, plus the list of hard picture
# changes, for the flash-and-jump pass of the closing.
#
#   <loom>/tools/qc/frames.sh <film.mp4> <out dir> [fps=2]
#
# Writes sheet-01.jpg … (8 × 6 cells: 24 s per sheet at fps 2, cells left to
# right, top to bottom) and scene-changes.txt (times where the picture jumps).
# Look at every sheet: a black or white cell, a cell from the wrong scene, a
# frame where something appears before its entrance.

set -euo pipefail
in="${1:?film}"; out="${2:?out dir}"; fps="${3:-2}"
mkdir -p "$out"
ffmpeg -v error -y -i "$in" -vf "fps=$fps,scale=320:-2,tile=8x6:padding=2:color=white" "$out/sheet-%02d.jpg"
ffmpeg -hide_banner -i "$in" -vf "select='gt(scene,0.35)',showinfo" -an -f null - 2>&1 \
  | grep -o "pts_time:[0-9.]*" | cut -d: -f2 > "$out/scene-changes.txt" || true
echo "$(ls "$out"/sheet-*.jpg | wc -l | tr -d ' ') sheets, $(wc -l < "$out/scene-changes.txt" | tr -d ' ') hard cuts → $out"
