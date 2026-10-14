#!/usr/bin/env bash
# Render one HyperFrames project under Loom's machine-wide lock: one full
# render at a time on this machine, across every window and every run.
#
#   <loom>/tools/render.sh <project dir> <out.mp4> [extra `hyperframes render` args, e.g. --fps 30]
#
# Waits (up to LOOM_RENDER_WAIT seconds, default 3600) while another render
# holds the lock, takes over a lock whose owner process is gone, refuses with
# under 10 GB free, always releases the lock, logs to <project>/renders-log.txt
# and exits with the render's own status. Draft snapshots need no lock.
# Rendering from the Studio UI bypasses the lock: don't.

set -uo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
proj="$(cd "${1:?project dir}" && pwd)"
out="${2:?out.mp4}"
shift 2
[[ "$out" = /* ]] || out="$proj/$out"

lock="${LOOM_RENDER_LOCK:-$HOME/.loom/render.lock}"
mkdir -p "$(dirname "$lock")" "$(dirname "$out")"

avail_kb=$(df -Pk "$proj" | awk 'NR==2 {print $4}')
if (( avail_kb < 10 * 1024 * 1024 )); then
  echo "render.sh: only $(( avail_kb / 1024 / 1024 )) GB free; free 10 GB first" >&2
  exit 4
fi

waited=0
until mkdir "$lock" 2>/dev/null; do
  pid="$(cat "$lock/pid" 2>/dev/null || true)"
  owner="$(cat "$lock/owner" 2>/dev/null || echo unknown)"
  if [[ -n "$pid" ]] && ! kill -0 "$pid" 2>/dev/null; then
    echo "render.sh: the lock's owner ($owner, pid $pid) is gone; taking it"
    rm -rf "$lock"
    continue
  fi
  (( waited == 0 )) && echo "render.sh: waiting, $owner is rendering"
  if (( waited >= ${LOOM_RENDER_WAIT:-3600} )); then
    echo "render.sh: still locked after ${waited} s by $owner" >&2
    exit 3
  fi
  sleep 15
  waited=$(( waited + 15 ))
done
echo "$$" > "$lock/pid"
echo "$(basename "$proj") since $(date '+%F %T')" > "$lock/owner"
trap 'rm -rf "$lock"' EXIT INT TERM

start=$(date +%s)
cd "$proj"
LOOM_RENDER_LOCKED=1 "$here/hf.sh" render --quality delivery -o "$out" "$@" 2>&1 | tee "$proj/renders-log.txt"
rc=${PIPESTATUS[0]}
echo "render.sh: exit $rc after $(( $(date +%s) - start )) s → $out"
exit "$rc"
