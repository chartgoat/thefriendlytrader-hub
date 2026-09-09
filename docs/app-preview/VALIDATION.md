# Native app preview validation

Verified September 8, 2026 (Hawaii time).

## Deployment

- Review: https://friendly-trader-app-preview.vercel.app/
- Final deployment: `dpl_2vXK1NDfnbGNdp5qwgka4E7VW2ho`
- Immutable URL: https://friendly-trader-app-preview-9xdaumq26-clancy-bonds-projects.vercel.app
- Status: READY, production target of the isolated `friendly-trader-app-preview` Vercel project in `clancy-bonds-projects`.
- The existing `thefriendlytrader.com` site was not deployed by this work.
- Only index.html, app-preview assets and the explicit review routing configuration were staged. No repository metadata, tests, source docs, native source or unrelated files were uploaded.
- All 19 public content files, including 8 original animation videos, returned HTTP 200 and matched local source SHA-256 hashes. See `deployed-files.json`.

## Automated checks

`npm test`: 11 passing groups. JS syntax and `git diff --check` pass.

Coverage includes repeatable candles, OHLC bounds/continuity/current-quote parity, both stop directions and sizing modes, whole-share risk rounding, tour restore while preserving user changes, all 14 roots and 16 chapters, principal detail/empty states, HTML escaping, service-call/storage prohibition, action wiring, exact price extrema and recorded target outcomes, pattern direction/failed-state consistency, calculated sample Wins, and all four reachable native quiz outcomes without routing cycles.

## Browser verification

- All 14 roots were opened at 402×874 and 320×568 locally. Content scroll width equaled client width on every root; page width stayed within the viewport. Close preview remained within the viewport. `native-browser-checks.json` records all 28 observations.
- All 14 roots were reopened on the final hosted deployment at 402×874. No missing/NaN content or horizontal content overflow was observed. See `native-hosted-checks.json`.
- Visual checks cover Home, MACD, A+ detail, Stop Finder, Wins, dark appearance and native sheet navigation. Home scrolls on shorter viewports while the quick menu remains fixed.
- The native bull/bear animations loaded with readyState 4, no media errors, and playing status. Both light and dark assets are included. Reduced-motion code pauses the videos; OS reduced-motion/device testing was not performed.
- A+ detail: 1M/2M/5M controls, target progression, entry/stop/three plotted targets, zoom and plan handoff.
- Tour: keyboard scrubbing retained range focus; chapter 4 opened the 1M A+ detail. Playing then zooming took over and paused at 36 bars. After exploring Stop Finder/Short, Resume returned to the original A+ detail at 42 bars. Closing an independently opened tour detail returns to its tool root.
- Stop Finder: Long/Short, chart zoom, pointer tap on the stop line and keyboard Enter on the first-target line opened the correct explanation. Transparent level hit areas avoid requiring a pixel-perfect tap on a one-pixel line.
- Wins: simulated trade card submission, calculated result, milestones and community room navigation. On the hosted version, 100 NVDA shares from $181.20 to $188.10 displayed +$690.00. Saving a Trading Floor message made it appear in Saved messages. Initial cards contain $900, $960 and $720 simulated examples alongside discipline/learning wins.
- Profile: saved display name, dark appearance, shortcut editing and enforcement of at least three shortcuts. Native onboarding question/answer flow reached The Market Newbie and its Patterns destination.
- No warning/error logs were captured during the tested local or hosted flows.

## Screenshots

- `native-desktop.png`: website hero, 1440×1100.
- `native-home.png`: Home in desktop expanded preview.
- `native-macd.png`: current Morning Play/Freshest Signal board.
- `native-plan.png`: A+ detail and chart.
- `native-wins.png`: Wins, 402×874.
- `native-economy.png`: Economy calendar, 402×874.

Older `desktop.png`, `mobile.png`, and `mobile-chart.png` show the superseded design and are retained as earlier evidence, not acceptance references.

## Limits

This is a browser reconstruction informed by current native source and local reference screenshots, not an embedded native app. No simulator or native source was changed for this work. Browser UI checks do not establish real-device Safari pinch, VoiceOver or maximum Dynamic Type acceptance. Synthetic chart shapes are not production pattern-detector output; confirmation-time copy is not a historical bar timeline. Secondary OS/account behaviors, photos, AI responses and live sessions remain explicit simulations. No simulator was booted, so none required cleanup.
