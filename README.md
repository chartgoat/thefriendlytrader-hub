# Friendly Trader website

The marketing site is one plain page with two parts (owner, November 13, 2026): the garden with a headline that says what the app is, the launch day, an email box for early access and Try the app; then the app's real screens. A three-link footer follows. It scrolls like any page; nothing is pinned or driven by scrolling. Try the app, or tapping a phone, opens a working iPhone preview of the app on sample data. Nothing on the site calls the options course free, and nothing is offered twice; tests hold both.

## Run locally

```sh
npm run serve
```

Open http://127.0.0.1:5539. `npm test` runs the data integrity, navigation, rendering and isolation checks. `node scripts/preview-early-access.mjs` serves the site at http://127.0.0.1:5540 with a stand-in for the sign-up server, so the email box can be tried without touching the real list.

## Preview implementation

- `assets/app-preview/core.mjs`: deterministic synthetic candles, demo plans, the screens list, the live tool switches (`HIDDEN_TOOLS`), the sample day and shared state.
- `assets/app-preview/native.mjs`: the iPhone app's screens, ported by hand from its SwiftUI source. Its first comment names the TestFlight build it matches.
- `assets/app-preview/ui.mjs`: marks, buttons and the sample records (patterns, calendars, chat rooms and messages).
- `assets/app-preview/chart.mjs`: interactive candle charts, mouse/touch gestures and keyboard controls.
- `assets/app-preview/app.js`: navigation, the preview's actions, and the one button beside it (Get early access), which closes the preview and puts the cursor in the page's email box.
- `assets/app-preview/page.css`, `page.js`: the public page, loaded last. The script only plays the garden film while it can be seen. Reduced motion and Data Saver keep the still.
- `assets/early-access/`: the email box, its rules and the unsubscribe page's script. `docs/early-access/README.md` has the server contract, the launch-day edit and how the pictures were taken.
- `assets/home/`: the garden film and still, the wall, and the four phone captures, retaken November 13 from TestFlight 202611132217. They are unedited apart from one line covered on `pip.jpg` (the sheet's "AI assistant" label).
- `assets/app-preview/home.css`: the opened preview's layout, the side panel, Home's garden and Coaching. `native.css` holds the app's look; its rules named `c-` are the November 13 port.
- `assets/app-preview/site.css`: responsive app appearance.

Keep the preview true to the app, for a signed-in member. `HIDDEN_TOOLS` in `core.mjs` mirrors the owner's live tool switches (read November 13, 2026: every tool the preview has is on), so a tool the owner turns off goes into that list and leaves Home, the quick menu and every route. Home's order in `native.mjs` is the owner's published layout.

All market data, people, events and conversations are simulated, except the coach names, photos and specialties, which match the public coaching page. State stays in memory in the browser tab and resets on reload. The live calendar's titles are the app's own weekly plan. The preview has no API calls, real community posts, notifications, account actions, bookings or orders, and no link out. It shows no results of trades or alerts: MACD's recap and board, A+ Scalps' result tiles and the Screener's after-the-alert figures are left out for that reason. Big Money shows made-up funds only. Pip uses answers written ahead. Ten sample tickers keep prices the same across the tools.

App icon and Pip assets come from the iOS project.

## Publication

The site is served by GitHub Pages from the `chartgoat/thefriendlytrader-hub` main branch, a minute or two after a push. The FAQ, privacy policy and unsubscribe page are their own folders. Older doorway pages (`hub/`, `options/`, `hogue/`, `daniel/`, `kenan/`) remain at their addresses and are not linked from the home page.


## Crown Trader booking pages

Each listed Crown Trader has a page at `/app/<coach-id>` (`app/<coach-id>/index.html`): their photo, name, line, 1-on-1 and masterclass prices, "See times and book" to their booking on the website (`?class=<class-id>` rides along for one class, with `&at=<start in epoch seconds>` when the link has it) and "Get Friendly Trader" to the App Store. A pasted link shows their photo and name. The invitation page, `/app/?ref=<coach-id>`, shows the same card for a listed coach. Prices on both refresh from the live catalog when the page opens; what the page was made with stays if that fails. A missing page under `/app/` is handled by `404.html`: `/app/<coach-id>` for a coach with no page yet (listed before the generator ran, or not listed) goes to `https://app.thefriendlytrader.com/coaching/coach/<coach-id>` with a valid `?class=` and `&at=`, and the website decides what to show; anything else under `/app/` opens Coaching there.

The pages, `app/coaches.json` and the photos in `assets/coaching/` are made from the live catalog. When a coach is added, paused, removed or changes a price:

```sh
node scripts/crown-links/generate.mjs
npm test
```

then commit what changed. It removes only pages it made for coaches no longer listed. `--catalog FILE` uses a saved catalog and `--photos DIR` copies from friendly-trader-web `public/coaching/` instead of the website's copies.
