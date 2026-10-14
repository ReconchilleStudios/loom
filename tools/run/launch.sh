#!/usr/bin/env bash
# Open one version of a run in its own terminal window: a full Claude Code
# session that reads the version's prompt and makes the film end to end.
# This is how the line's four parallel demo films were made: one window per
# film, one render at a time through tools/render.sh.
#
#   <loom>/tools/run/launch.sh <project>/prompts/<slug>.md [title]
#
# The window starts at the project root (the folder with loom.json); the
# session creates films/<slug> itself with `hyperframes init`, which refuses
# a folder that already exists. It asks the person for permissions as any
# Claude Code session does. Exit 3: no window could be opened from here; the
# command to paste into a new terminal is printed.

set -euo pipefail
prompt="$(cd "$(dirname "${1:?prompt file}")" && pwd)/$(basename "$1")"
[[ -f "$prompt" ]] || { echo "launch.sh: no such prompt: $1" >&2; exit 2; }
title="${2:-$(basename "$prompt" .md)}"
dir="$(dirname "$prompt")"
until [[ -f "$dir/loom.json" || "$dir" == "/" ]]; do dir="$(dirname "$dir")"; done
[[ -f "$dir/loom.json" ]] || { echo "launch.sh: $1 is not inside a Loom project (no loom.json above it)" >&2; exit 2; }
claude_bin="$(command -v claude || true)"
[[ -n "$claude_bin" ]] || { echo "launch.sh: claude is not on PATH" >&2; exit 3; }

ask="Read $prompt and execute it end to end."
run_line="cd \"$dir\" && printf '\\033]0;%s\\007' \"Loom · $title\" && \"$claude_bin\" \"$ask\""

case "$(uname -s)" in
  Darwin)
    tmp="$(mktemp -t loom-run)"
    cmd="$tmp.command"
    mv "$tmp" "$cmd"
    { echo '#!/bin/bash'; echo 'rm -f -- "$0"'; echo "$run_line"; } > "$cmd"
    chmod 700 "$cmd"
    open -a Terminal "$cmd"
    echo "opened: $title"
    exit 0
    ;;
  Linux)
    for term in x-terminal-emulator gnome-terminal konsole xfce4-terminal kitty alacritty wezterm xterm; do
      command -v "$term" >/dev/null 2>&1 || continue
      case "$term" in
        gnome-terminal) "$term" -- bash -c "$run_line; exec bash" & ;;
        wezterm) "$term" start -- bash -c "$run_line; exec bash" & ;;
        kitty) "$term" bash -c "$run_line; exec bash" & ;;
        *) "$term" -e bash -c "$run_line; exec bash" & ;;
      esac
      echo "opened: $title ($term)"
      exit 0
    done
    ;;
esac
echo "Could not open a window from here. In a new terminal, run:"
echo "  $run_line"
exit 3
