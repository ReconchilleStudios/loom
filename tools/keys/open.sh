#!/usr/bin/env bash
# Opens the key wizard in its own terminal window, so keys are typed where
# Claude cannot see them. Claude runs this, waits for the person to say they
# are done, then runs check.mjs.
#
#   tools/keys/open.sh [en|tr]
#
# Exit 0: a window was opened. Exit 3: no terminal could be opened from here;
# the command to run by hand is printed instead.

set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
wizard="$here/wizard.mjs"
lang="${1:-en}"
node_bin="$(command -v node || true)"

if [[ -z "$node_bin" ]]; then
  echo "node is not on PATH; install Node 18 or newer first" >&2
  exit 3
fi

run_line="\"$node_bin\" \"$wizard\" --lang $lang"

case "$(uname -s)" in
  Darwin)
    tmp="$(mktemp -t loom-keys)"
    cmd="$tmp.command"
    mv "$tmp" "$cmd"
    {
      echo '#!/bin/bash'
      echo "$run_line"
      echo 'rm -f -- "$0"'
    } > "$cmd"
    chmod 700 "$cmd"
    open -a Terminal "$cmd"
    echo "opened: Terminal"
    exit 0
    ;;
  Linux)
    for term in x-terminal-emulator gnome-terminal konsole xfce4-terminal kitty alacritty wezterm xterm; do
      command -v "$term" >/dev/null 2>&1 || continue
      case "$term" in
        gnome-terminal) "$term" -- bash -c "$run_line" & ;;
        wezterm) "$term" start -- bash -c "$run_line" & ;;
        kitty) "$term" bash -c "$run_line" & ;;
        *) "$term" -e bash -c "$run_line" & ;;
      esac
      echo "opened: $term"
      exit 0
    done
    ;;
esac

echo "Could not open a terminal window from here. Run this in a new terminal:"
echo "  $run_line"
exit 3
