# Friendly Trader film source

The current edit is 72 seconds at 60 fps, with separate 1920×1080 and 1080×1920 compositions. Fable 5.1 created the treatment and motion composition after studying the seven supplied SWJ ads. Codex integrated the recordings and sound, revised the final framing and asset handling, and owns the website handoff and delivery.

The checked-in TypeScript and narration timings are the final composition source. Public production inputs and render intermediates are ignored here. Only the finished MP4s and captions are included by the website staging script.

## Reproduce

Run from this directory:

```sh
npm ci
node stage-assets.mjs /Users/clancybondnalallc/SWJ/planning/friendly-trader-marketing-film-2026-09-09/film-production/public
npm run prepare-assets
npx tsc --noEmit
```

The staging command checks each input against `asset-manifest.json` before copying it. On another machine, pass the directory containing the preserved production inputs. No credentials, original full-length source ads, or service connections are needed to render.

From the website root:

```sh
python3 scripts/render-film.py landscape
python3 scripts/render-film.py portrait
```

These commands render with four concurrent workers, verify the duration, and copy H.264/AAC output with fast-start metadata into `assets/app-preview/media/`. The earlier `compose-film-score.py` is retained only as the superseded 90-second score recipe; do not use it for this edit.

## Edit contract

- `src/edit.ts` and the site's `assets/app-preview/film-script.mjs` must stay in sync. A caption changing on screen does not require a new app handoff; a new tool or platform does.
- App screens come from recordings of the full browser preview. Recorded chart lines, sizing and messages use simulated data. No native service is called.
- `public/audio/film-mix.wav` contains the final narration, original instrumental and UI sounds. Use it once. The other stems are retained for future editing.
- Captions replace in short phrases at their spoken onsets. The separate WebVTT track supplies the complete optional transcript.
- The supplied app icon is the logo. Product recordings hold their own extracted ending frames when a shot lasts longer than the clip.
- Brand typography uses local Apple system fonts, with Helvetica/Arial fallbacks. Current acceptance images were rendered on macOS; review layout after rendering on another platform.

The complete study, source hashes, narration alignment, music provenance and frame/audio review evidence remain in the dated study workspace. See `docs/app-preview/REFERENCE-STUDY.md`, `reference-coverage.json` and `FILM-DIRECTION.md` for the durable study summary and its limits.
