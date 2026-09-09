# Friendly Trader website

App-first marketing site with a complete interactive browser preview of the main Friendly Trader iOS screens and their primary workflows. The site is static HTML, CSS and JavaScript with no runtime dependencies.

## Run locally

```sh
npm run serve
```

Open http://127.0.0.1:5539. `npm test` runs the data integrity, navigation, rendering and isolation checks.

## Preview implementation

- `assets/app-preview/core.mjs`: deterministic synthetic candles, demo plans, shared state and tour chapters.
- `assets/app-preview/ui.mjs`: screen and detail renderers.
- `assets/app-preview/chart.mjs`: interactive candle charts, mouse/touch gestures and keyboard controls.
- `assets/app-preview/app.js`: navigation, local demo actions, tour playback and pause/resume.
- `assets/app-preview/site.css`: responsive website and app appearance.

All market data, people, events and conversations are simulated. State stays in memory in the browser tab and resets on reload. The preview has no API calls, real community posts, notifications, account actions or orders. Pip uses contextual prewritten answers. Eight sample tickers support consistent data across the tools. The session preview is an interactive lesson, not a live stream.

See `docs/app-preview/PREVIEW-SCOPE.md` and `docs/app-preview/VALIDATION.md` for coverage and verification. App icon and Pip assets come from the existing iOS project.

## Publication

The original website uses GitHub Pages from the `chartgoat/thefriendlytrader-hub` main branch. The app-preview work is isolated on `codex/app-site-preview`; changing that branch does not update the public domain. Existing tool, FAQ and affiliate doorway pages are retained.

The independent review deployment contains only `index.html` and `assets/app-preview/`, with the existing Options and FAQ paths redirected to the public domain. iPhone public-beta availability must be checked again before launch; the existing TestFlight public link was closed to new testers on September 8, 2026.
