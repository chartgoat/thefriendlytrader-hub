# Friendly Trader website

App-first marketing site. The page opens inside the app's garden and scrolling pulls the camera back until the garden is the real Home screen on a phone. Then it walks through the questions the app answers and closes on the night garden, the plans and the fee line. Try the app opens a working iPhone preview that covers the main Friendly Trader iOS screens and their primary workflows. The site is static HTML, CSS and JavaScript with no runtime dependencies. Young Serif and Figtree are served from `assets/fonts/` under the SIL Open Font License.

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
- `assets/app-preview/garden.css`, `garden.js`: the public page and its one continuous camera move, loaded last. Reduced motion cuts between states and keeps stills. Data Saver keeps stills too.
- `assets/home/`: the garden films and stills, the wall, and the phone captures. `stop.jpg` and `pip.jpg` are edited: the greyed TradingView row and Pip's old label are painted out, so retake them once the app drops both.
- `assets/app-preview/home.css`: the app's Home look inside the opened preview.
- `assets/app-preview/site.css`: responsive app appearance. It still holds some rules for the old page sections.

Keep the preview true to the app. `HIDDEN_TOOLS` in `core.mjs` mirrors the owner's live tool switches, so a tool turned back on comes out of that list. The film "What now?" lives in `assets/film/` and is self-contained (`what-now.css`, `what-now.mjs`, two encodes, posters, captions, and the `#watch` section in `index.html`); `garden.css` sets its look on this page. Its source is the local project `~/SWJ/projects/ft-app-ads`, ad `whatnow`. The older interactive film in `assets/app-preview/film*` stays off.

All market data, people, events and conversations are simulated, except the coach names and specialties, which match the public coaching page. State stays in memory in the browser tab and resets on reload. The preview has no API calls, real community posts, notifications, account actions or orders. Pip uses contextual prewritten answers. Eight sample tickers support consistent data across the tools. The session preview is an interactive lesson, not a live stream.

See `docs/app-preview/PREVIEW-SCOPE.md` and `docs/app-preview/VALIDATION.md` for coverage and verification. App icon and Pip assets come from the existing iOS project.

## Publication

The original website uses GitHub Pages from the `chartgoat/thefriendlytrader-hub` main branch. The app-preview work is isolated on `codex/app-site-preview`; changing that branch does not update the public domain. Existing tool, FAQ and affiliate doorway pages are retained.

The independent review deployment contains only `index.html` and `assets/app-preview/`, with the existing Options and FAQ paths redirected to the public domain. iPhone public-beta availability must be checked again before launch; the existing TestFlight public link was closed to new testers on September 8, 2026.
