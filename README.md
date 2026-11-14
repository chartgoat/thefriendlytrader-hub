# Friendly Trader website

App-first marketing site, and one plain page: the garden with a headline that says what the app is and two buttons, the app's real screens, the film, then the plans and the fee line in the night garden. It scrolls like any page; nothing is pinned or driven by scrolling. Try the app, or tapping a phone, opens a working iPhone preview that covers the main Friendly Trader iOS screens and their primary workflows. The site is static HTML, CSS and JavaScript with no runtime dependencies. Young Serif and Figtree are served from `assets/fonts/` under the SIL Open Font License.

## Run locally

```sh
npm run serve
```

Open http://127.0.0.1:5539. `npm test` runs the data integrity, navigation, rendering and isolation checks.

## Preview implementation

- `assets/app-preview/core.mjs`: deterministic synthetic candles, demo plans, the screens list, the live tool switches (`HIDDEN_TOOLS`), the sample day and shared state.
- `assets/app-preview/native.mjs`: the iPhone app's screens, ported by hand from its SwiftUI source. Its first comment names the TestFlight build it matches.
- `assets/app-preview/ui.mjs`: marks, buttons and the sample records (patterns, calendars, chat rooms and messages).
- `assets/app-preview/chart.mjs`: interactive candle charts, mouse/touch gestures and keyboard controls.
- `assets/app-preview/app.js`: navigation, the preview's actions, and the one button beside it (Get early access), which closes the preview and puts the cursor in the page's email box.
- `assets/app-preview/page.css`, `page.js`: the public page, loaded last. The script only plays the garden films while they can be seen. Reduced motion and Data Saver keep the stills.
- `assets/home/`: the garden films and stills, the wall, and the phone captures. `stop.jpg` and `pip.jpg` are edited: the greyed TradingView row and Pip's old label are painted out, so retake them once the app drops both.
- `assets/app-preview/home.css`: the opened preview's layout, the side panel, Home's garden and Coaching. `native.css` holds the app's look; its rules named `c-` are the November 13 port.
- `assets/app-preview/site.css`: responsive app appearance. It still holds some rules for the old page sections.

Keep the preview true to the app, for a signed-in member. `HIDDEN_TOOLS` in `core.mjs` mirrors the owner's live tool switches (read November 13, 2026: every tool the preview has is on), so a tool the owner turns off goes into that list and leaves Home, the quick menu and every route. Home's order in `native.mjs` is the owner's published layout. The film "What now?" lives in `assets/film/` and is self-contained (`what-now.css`, `what-now.mjs`, two encodes, posters, captions, and the `#watch` section in `index.html`); `page.css` sets its look on this page. Its source is the local project `~/SWJ/projects/ft-app-ads`, ad `whatnow`.

All market data, people, events and conversations are simulated, except the coach names, photos and specialties, which match the public coaching page. State stays in memory in the browser tab and resets on reload. The live calendar's titles are the app's own weekly plan. The preview has no API calls, real community posts, notifications, account actions, bookings or orders, and no link out. It shows no results of trades or alerts: MACD's recap and board, A+ Scalps' result tiles and the Screener's after-the-alert figures are left out for that reason. Big Money shows made-up funds only. Pip uses answers written ahead. Ten sample tickers keep prices the same across the tools.

See `docs/app-preview/PREVIEW-SCOPE.md` and `docs/app-preview/VALIDATION.md` for coverage and verification. App icon and Pip assets come from the existing iOS project.

## Publication

The original website uses GitHub Pages from the `chartgoat/thefriendlytrader-hub` main branch. The app-preview work is isolated on `codex/app-site-preview`; changing that branch does not update the public domain. Existing tool, FAQ and affiliate doorway pages are retained.

The independent review deployment contains only `index.html` and `assets/app-preview/`, with the existing Options and FAQ paths redirected to the public domain. iPhone public-beta availability must be checked again before launch; the existing TestFlight public link was closed to new testers on September 8, 2026.
