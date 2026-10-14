#!/usr/bin/env bash
# The HyperFrames CLI, the way Loom runs it: telemetry off.
#
#   <loom>/tools/hf.sh <command> [args…]          e.g. hf.sh check --json
#
# LOOM_HYPERFRAMES_VERSION=0.8.140 pins one CLI version for a whole run (set it
# in every window of the run, or none); with Loom's bundled skills installed it
# is pinned to the bundle automatically. LOOM_HYPERFRAMES_CLI replaces the
# command entirely, e.g. the plugin's own launcher:
#   LOOM_HYPERFRAMES_CLI="node <plugin>/skills/hyperframes/scripts/plugin-cli.mjs"
# Never render from here directly: use render.sh, which holds the machine lock.

export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1

# When Loom installed the bundled skills (tools/hyperframes/install.mjs), pin
# the CLI to their version and keep HyperFrames from refreshing them: the
# skills and the CLI stay the pair Loom was verified with.
marker="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/hyperframes/.loom-bundled"
if [[ -z "${LOOM_HYPERFRAMES_VERSION:-}" && -f "$marker" ]]; then
  LOOM_HYPERFRAMES_VERSION="$(sed -n 's/.*"hyperframes": *"\([^"]*\)".*/\1/p' "$marker" | head -1)"
  export HYPERFRAMES_SKIP_SKILLS=1
fi

if [[ "${1:-}" == "render" && -z "${LOOM_RENDER_LOCKED:-}" ]]; then
  echo "hf.sh: render through tools/render.sh (it holds the one-render-at-a-time lock)" >&2
  exit 2
fi

if [[ -n "${LOOM_HYPERFRAMES_CLI:-}" ]]; then
  # shellcheck disable=SC2086
  exec $LOOM_HYPERFRAMES_CLI "$@"
fi
if [[ -n "${LOOM_HYPERFRAMES_VERSION:-}" ]]; then
  exec npx --yes "hyperframes@${LOOM_HYPERFRAMES_VERSION}" "$@"
fi
exec npx --yes hyperframes "$@"
