# iOS and macOS app preview validation

Verified September 8, 2026 (Hawaii time).

## Deployment

- Review: https://friendly-trader-app-preview.vercel.app/
- Final deployment: `dpl_32MoQh7kt2CQ7yVR4uiJ9P24zXyi`
- Immutable URL: https://friendly-trader-app-preview-1osegpmhc-clancy-bonds-projects.vercel.app
- Status: READY, production target of the isolated `friendly-trader-app-preview` Vercel project in `clancy-bonds-projects`.
- The existing `thefriendlytrader.com` site was not deployed by this work.
- Only index.html, app-preview assets and the explicit review routing configuration were staged. No repository metadata, tests, source docs, native source or unrelated files were uploaded.
- All 21 public content files, including 8 original animation videos, returned HTTP 200 and matched local source SHA-256 hashes. See `deployed-files.json`.

## Automated checks

`npm test`: 14 passing groups. JS syntax and `git diff --check` pass.

Coverage includes repeatable candles, OHLC bounds/continuity/current-quote parity, both stop directions and sizing modes, whole-share risk rounding, tour restore while preserving user changes, all 14 roots and 16 chapters, principal detail/empty states, HTML escaping, service-call/storage prohibition, action wiring, exact price extrema and recorded target outcomes, pattern direction/failed-state consistency, calculated sample Wins, and all four reachable native quiz outcomes without routing cycles.

## Compact phone and simple walkthrough

- The inline desktop phone scales from the same native proportions: 257×556 at 1440×1000, compared with the prior 414×896. Shorter desktop viewports scale it further. Inline mobile previews remain compact, and expanded mobile app content stays unscaled.
- All 16 explanations in both platforms passed checks at 1440×1000, 402×874 and 320×568 (96 observations): captions and controls visible, no horizontal app-content overflow, and range focus retained. Each viewport/platform combination traversed chapters 1–16. See `walkthrough-browser-checks.json`.
- Watch the tour now opens the expanded walkthrough. Desktop iOS places plain-language explanation beside the device; other layouts show it below. Mobile no longer hides the explanation. Each chapter runs for 7.5 seconds, and the progress bar uses the same duration.
- At 1280×720 the expanded iOS phone measured 248×538 with the explanation beside it. Zooming took over the tour at 36 bars; resume restored the chapter at 42 bars. Previous/next/range captions update with the corresponding chapter, and scrubbing retains keyboard focus.
- The 14 automated test groups and JS syntax/diff checks pass. The final hosted version repeated all 16 steps in both platforms at 402×874 (32 observations, all captions and controls visible). The hosted inline phone matched 257×556 at 1440×1000, and all 21 public files matched source hashes. No browser warnings or errors appeared in the tested local or hosted flows. See `walkthrough-hosted-checks.json`.
- Current visual references: `compact-phone.png`, `walkthrough-desktop.png`, `walkthrough-mobile.png`.

## iOS/macOS platform verification

- All 14 roots in both versions were opened at 402×874 and 320×568: 56 checks with no missing content, horizontal overflow or offscreen close control. See `platform-browser-checks.json`.
- Desktop Mac Home, MACD, Stop Finder and profile were checked at 1440×1100. Sidebar grouping and selection, Go menu, Control+2 navigation, mobile sidebar collapse, light/dark appearance and platform-specific profile settings passed.
- Stop Finder kept 36 bars and its earlier position through Mac → iOS → Mac. The Mac plot used its full 886px width. Keyboard activation of the stop line opened its explanation. Unit coverage also verifies resize redraw and observer disposal.
- An unfinished profile name survived both switches and saved successfully. Both platform access buttons opened the chosen version in expanded mode.
- The final hosted version passed all 28 root checks (both platforms, 402×874); see `platform-hosted-checks.json`. The desktop Mac chart filled its 924px surface and expanded to 1080px. Escape closed the expanded chart while leaving the app open. Tour chapter 4 resumed in iOS after a Mac chart takeover and platform switch, restoring 42 bars. No warning/error logs were captured during the tested local or hosted flows.
- Screenshots: `mac-home.png`, `mac-chart.png`, `mac-dark.png`, `platform-access.png`.

## Earlier iOS browser verification

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
