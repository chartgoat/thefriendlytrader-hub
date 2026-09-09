# iOS and macOS app preview validation

Latest verification: September 9, 2026 (Hawaii time). Earlier passes below are retained with their own evidence.

## Deployment

- Review: https://friendly-trader-app-preview.vercel.app/
- Final deployment: `dpl_CwvQBkQBgaoCS4cYCF6bDPweX1yY`
- Immutable URL: https://friendly-trader-app-preview-jgomv20gx-clancy-bonds-projects.vercel.app
- Status: READY, production target of the isolated `friendly-trader-app-preview` Vercel project in `clancy-bonds-projects`.
- The existing `thefriendlytrader.com` site was not deployed by this work.
- Only index.html, app-preview assets and the explicit review routing configuration were staged. No repository metadata, tests, source docs, native source or unrelated files were uploaded.
- All 29 public content files, including 8 existing animation videos, 2 finished product films and the caption track, returned HTTP 200 and matched local source SHA-256 hashes. See `deployed-files.json`.

## Automated checks

`npm test`: 17 passing groups. JS syntax and `git diff --check` pass.

Coverage includes repeatable candles, OHLC bounds/continuity/current-quote parity, both stop directions and sizing modes, whole-share risk rounding, tour restore while preserving user changes, all 14 roots and the current film destinations, principal detail/empty states, HTML escaping, service-call/storage prohibition, action wiring, exact price extrema and recorded target outcomes, pattern direction/failed-state consistency, calculated sample Wins, and all four reachable native quiz outcomes without routing cycles.

## Current narrated marketing film

- A 72-second edit based on a detailed study of seven supplied SWJ ads, with Fable 5.1 creative work, one continuous 138-word narration, original instrumental and UI sound. The source study covers 12,882 extracted native frames and 429.4 seconds of full soundtracks. See `REFERENCE-STUDY.md` and `reference-coverage.json` for methods and limits.
- Landscape: 1920×1080, 25,424,350 bytes. Portrait: 1080×1920, 30,669,561 bytes. Both are H.264 at 60 fps, 4,320 frames, AAC stereo at 48 kHz, exactly 72.000 seconds, with fast-start metadata. Both decode fully without errors. See `film-72s-media.json`.
- The final soundtrack is muxed directly from the approved full mix. Correlation exceeds 0.9997 over the whole track and the ending, at zero sample offset. This removed a 42.7 ms encoder offset found in the initial Remotion mux. The complete closing invitation is retained. See `film-72s-audio-integrity.json`.
- The exact app logo, human portrait crop, native app header visibility, Mac window bounds, short replacing captions, phrase boundaries, spotlight coordinates, final-frame holds and adjacent shot boundaries were reviewed and corrected. The film uses eight recordings of the interactive preview; the iOS/macOS apps themselves were not changed.
- Full-duration visual review includes 144 sampled frames per orientation, complete video input at 8 fps for an independent audiovisual review, plus detailed full-resolution checks. `film-72s-landscape-00.jpg` through `05` and the matching portrait sheets cover the entire edit. See `film-72s-review-notes.md` for corrections to the model's report.
- All 11 chapters passed local handoffs at 1440×1000, 390×844 and 320×568: 33 observations. The wide local pass preceded the last audio mux; final hosted verification covers that delivered asset. Every tested handoff opened the expected app/platform, stopped playback, and had no app-content horizontal overflow. Small-phone player controls fit the viewport. See `film-72s-handoffs.json`.
- All 11 chapters passed on the final hosted version at 390×844 and 1440×1000: 22 observations. Both sources report 72 seconds. Rotation at 34 seconds retained the paused time and mute state, selected the landscape source, and retained the loaded captions. See `film-hosted-checks.json`.
- Thirty-eight nonoverlapping WebVTT cues end at 69.034 seconds. The server returns `text/vtt; charset=utf-8`, and the hosted track reaches readyState 2. CC was visually checked. Both video files return HTTP 206 for byte-range requests. All 29 public files match local SHA-256 hashes.
- Changing the example risk budget to $500 gives 147 shares and $498.33 planned risk; it survives returning to the film. Pip answers already entered during exploration are retained. The recorded first-use example remains $250, 73 shares and $247.47 planned risk. See `film-72s-visitor-edits.json`.
- Playback from the final seconds reached exactly 72, stopped and exposed the end action. Keyboard traversal moves from replay to timeline; Escape closes the film and restores focus to Resume film. See `film-72s-ending-keyboard.json`.
- Reproducible final composition source and a hashed input manifest are retained in `production/film/`. Production inputs, node_modules, original source ads, study reports and rendering intermediates are excluded from website uploads.

## Earlier 90-second film (superseded)

- The former narrated-by-text screen rotation is replaced by a real 90-second product film: 12 chapters, 21 shots, camera push-ins, 250ms dissolves and an original instrumental score. There is no voiceover; large on-screen copy carries the story. Both MP4s are H.264, 30fps/2,700 frames and AAC 48kHz stereo. Landscape is 1280×720; portrait is 480×800. Both probe at exactly 90.000 seconds. See `film-media-checks.json`.
- Forty-two captured compositions cover both edits. Copy/device placement and app horizontal overflow were checked, and the rendered landscape contact sheet was visually reviewed. See `film-composition-checks.json`, `film-contact-sheet.jpg` and `film-frames/`.
- All 12 chapters passed film → matching app → film at 1280×900, 402×874 and 320×568 (36 handoffs): correct app screen and platform, stopped media during exploration, visible resume control and no app horizontal overflow. See `film-handoff-checks.json`.
- Seeking to 15.5s opened the A+ chart at 42 bars. Zooming changed it to 36 bars; resume returned to the saved film time. Byte-range serving was required for valid local seek QA; `scripts/serve-review.py` supplies it.
- A $500 risk input recalculated to 147 sample shares; the value and saved plan survived leaving and resuming the film. Risk sizing now responds to input while preserving the input element and focus. See `film-saved-work-check.json`.
- Changing from portrait to landscape at 46s retained time, mute and paused status. Keyboard traversal cycles through play, timeline, sound, chapters, explore and close; the underlying app is inert. The ending exposes its step-inside/replay controls. No error logs were recorded in the final local flows. See `film-keyboard-checks.json`.
- Hosted verification repeated all 12 chapters in portrait and landscape: 24 successful handoffs, exact selected times, 90-second duration, paused audio during exploration and visible resume controls. Both MP4s return HTTP 206 for byte-range requests; all 27 public assets match local SHA-256 hashes. No error logs were recorded. See `archive/90-second-film/film-hosted-checks.json`, `archive/90-second-film/film-hosted-range-checks.json`, `archive/90-second-film/film-hosted-desktop.png` and `archive/90-second-film/film-hosted-mobile.png`.
- Source scenes, score recipe and assembler are retained for future edits. Composition PNGs, scripts, tests, docs and intermediates are excluded from the isolated review upload. No native binary or production service changed.

## Earlier benefit-first story and typography

- At 1440×1000 the introduction is 22px, inline explanation is 20px, and compact phone remains 257px wide. At 320×568 the main introduction is 18px; page, header, benefit stories and directory have no horizontal overflow.
- All 16 chapters in both platforms passed at 1440×1000, 402×874 and 320×568: 96 observations with captions and controls inside the viewport, no app-content/page horizontal overflow, and no caption scrolling required. Expanded captions measure 22px for desktop iOS, 20px for desktop Mac, 18px at 402px and 17px at 320px. See `story-browser-checks.json`.
- The first five chapters demonstrate the problem, plan, risk, friendly help and community before the how-to. All 14 automated groups continue to pass.
- At 1280×720 the opened iOS preview uses zoom 1. Chart interaction pauses the tour at 36 bars; resume restores 42 bars. A benefit link opens the full reading view directly. Chart labels measure 12px on the SVG axis with 11px level labels and reserved label space.
- No warning/error logs were recorded in the tested local flows. Browser checks do not constitute native Dynamic Type or VoiceOver acceptance.
- The deployed version repeated all 16 chapters on both platforms at 402×874: 32 passing observations with 18px captions, visible controls, no caption scrolling and no page horizontal overflow. Hosted desktop introduction is 22px and the compact phone remains 257px wide. No warning/error logs appeared. See `story-hosted-checks.json`. All 22 deployed public files match source SHA-256 hashes.
- New visual references: `story-hero.png`, `story-benefits.png`, `story-desktop-tour.png`, `story-mobile-tour.png`.

## Earlier compact phone and simple walkthrough

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
