# App preview validation

Verified September 8, 2026 (Hawaii time).

## Review deployment

- URL: https://friendly-trader-app-preview.vercel.app/
- Deployment: dpl_9fYozcNB2ZjH8GVoA9cLFfAjtF88
- Isolated Vercel project: friendly-trader-app-preview, clancy-bonds-projects
- Status: READY
- Vercel target: production for the independent review project. This does not publish to thefriendlytrader.com or alter its GitHub Pages deployment.
- Only the homepage, its app-preview assets and review routing configuration were uploaded. Source docs, tests, repository metadata and unrelated files were excluded.
- Six served HTML/JS/CSS files returned HTTP 200 and matched the local source byte-for-byte. Evidence: deployed-files.json.

## Clean layout revision

The hosted review now uses a quieter app-first layout: native-sized phone without CSS zoom, six app shortcuts, contextual Pip in the header, profile editing in a disclosure, simpler chart labels, compact playback and a three-group directory. All fourteen destinations remain accessible.

This revision was checked in the browser at 1440×1000, 375×812 and 320×568. All fourteen app destinations had equal content/client widths at both mobile sizes (no horizontal content overflow). At 320×568, Close preview remained within x=209–308 and y=8–38; the app navigation remained within x=5–315 and y=394–456. The mobile preview fills the viewport without a nested decorative phone border.

Verified profile editing and dark appearance, continuous keyboard tour scrubbing with slider focus retained, chart-interaction takeover, navigation into Pip, and resume to the original chapter and chart viewport with profile appearance retained. Stop Finder Short selection, zoom from 42 to 36 bars and pan to Earlier worked. The hosted revision also passed fullscreen entry, six-shortcut navigation, manual takeover and resume back to Home. No warning/error logs appeared locally or on the hosted revision. Eight automated groups, syntax checks and diff whitespace checks passed again after the final code changes.

Current screenshots: desktop.png, mobile.png, mobile-chart.png. The checks below also describe the broader initial implementation regression coverage; the clean revision changes presentation and preserves those workflows.

## Automated checks

`npm test`: 8 passing test groups covering:

1. 8 tickers across 4 candle sizes: repeatable candles, high/low bounds, positive prices, candle-to-candle continuity and final-price parity with the cards.
2. Long and short stops/targets in both modes, risk distances and whole-share risk rounding.
3. Resume restores the tour's screen, ticker and viewport while retaining visitor profile, watchlist and message changes.
4. All 14 main destinations and all 16 tour chapters render.
5. 16 detail combinations, missing calendar events, missing search results and onboarding outcomes render.
6. Escaping of visitor input in chat, profile, Home and Pip.
7. No API calls, browser storage, push permission requests or live side effects. CSP prohibits connections and native form navigation.
8. Declared action handlers and fixture-room coverage.

JS syntax checks and `git diff --check` passed.

## Browser checks

The following were exercised through the Codex browser on the served site:

- All 14 main destinations locally and on the deployed URL.
- A+ board → NVDA detail → save watch → Stop Finder → Short → zoom/pan → save plan → share to demo Trading Floor.
- Tour play, automatic progress through all 16 chapters to completion, pause on chart interaction, manual navigation, and resume to the saved A+ detail and chart viewport. Dark appearance survives resume.
- Continuous keyboard scrubbing leaves focus on the range input and moves to the selected chapter. Manual next/previous navigation also exercised.
- Profile name, dark mode and notification preference changes.
- Onboarding → risk preference → Stop Finder recommendation.
- Unsupported ticker input produces an explicit sample-ticker message.
- Demo chat draft survives navigation; sending preserves input as text; thread reply remains in the correct thread and increments its count.
- Expanded chart navigation.
- 375×812 mobile fullscreen: no page overflow, Close preview bottom 805px within 812px viewport.
- 320×568 mobile fullscreen: page width 320px; app content scroll width equals client width (301px); Close preview bottom 561px within 568px viewport. App quick menu remains reachable.
- Default desktop layout and fullscreen entry/exit. Temporary viewport overrides reset after testing.
- No captured browser error or warning logs in the tested local and hosted flows.

Screenshots: desktop.png and mobile.png.

## Deliberate preview boundaries

This is a browser recreation of the app's main surfaces, not the native SwiftUI binary. Eight sample tickers, fictional people/events and synthetic candles keep the experience deterministic. Pattern names illustrate the interface and do not certify the generated candles as production detector output. Pip has contextual prewritten responses. The session preview is a short interactive lesson, not a live broadcast. Browser gestures were implemented; native-device Safari pinch and screen-reader testing were not performed in this pass.

Profile choices, saved plans, alerts, drafts and posts remain in tab memory and reset on reload. No camera, photo uploads, real membership changes, live notifications, order placement or production community posting occur. iPhone public-beta enrollment was independently checked and closed to new testers; the page states this instead of advertising an available App Store download.
