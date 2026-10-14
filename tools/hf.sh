#!/usr/bin/env bash
# The HyperFrames CLI, the way Loom runs it: telemetry off.
#
#   <loom>/tools/hf.sh <command> [args…]          e.g. hf.sh check --json
#
# LOOM_HYPERFRAMES_VERSION=0.8.140 pins one CLI version for a whole run (set it
# in every window of the run, or none). LOOM_HYPERFRAMES_CLI replaces the
# command entirely, e.g. the plugin's own launcher:
#   LOOM_HYPERFRAMES_CLI="node <plugin>/skills/hyperframes/scripts/plugin-cli.mjs"
# Never render from here directly: use render.sh, which holds the machine lock.

export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1

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
