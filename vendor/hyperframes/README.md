# HyperFrames, bundled with Loom

These are HeyGen's [HyperFrames](https://github.com/heygen-com/hyperframes) agent skills at **v0.8.140** (commit `5c7f631`, 2026-10-07), the version the reference films in `examples/affilimates/` were made with. They are copied **unmodified** from the repository's `skills/` folder and are distributed under HyperFrames' own licence, the Apache License 2.0 (`LICENSE` here; `CREDITS.md` is the project's own). They are not covered by Loom's MIT licence.

Included: the core set (`hyperframes`, `hyperframes-animation`, `-audio`, `-cli`, `-core`, `-creative`, `-keyframes`, `-registry`, `-studio`, `media-use`) and the `general-video` workflow, which is everything a Loom run uses. Other HyperFrames workflows install themselves on demand, as HyperFrames normally does.

`tools/hyperframes/install.mjs` installs them into `~/.claude/skills/` on a machine that has no HyperFrames. It never replaces an install Loom did not make, whether standalone or the plugin. Each skill it installs carries a `.loom-bundled` marker. While the marker is there, `tools/hf.sh` runs the matching CLI (`npx hyperframes@0.8.140`) and sets `HYPERFRAMES_SKIP_SKILLS=1`, so the skills and the CLI stay the pair Loom was verified with.

To move Loom to a newer HyperFrames:

1. Replace `skills/` from the new tag.
2. Update `VERSION.json`.
3. Run a film through it.
4. Run `install.mjs --upgrade` on machines that use the bundle.
