# App-first website and full interactive preview

## Native reference revision

The iOS app is the design reference. The earlier approximation is superseded by source-derived screen hierarchy, typography, colors and behavior. Reference checkout: `swj-macd-ios`, HEAD `93a19e6`, inspected September 8, 2026. Its concurrent native work was not edited.

The website keeps an app-first hero, a readable phone, compact tour controls and a directory of all 14 destinations. The browser implementation remains dependency-free, with deterministic simulated data and no production services.

| Preview surface | Native reference | Browser implementation |
| --- | --- | --- |
| Theme and identity | Theme.swift, Brand.swift | Native light/dark tokens, system typography, vector Pip, original bull/bear MP4 assets |
| Home | HomeView.swift, HomeLayout.swift | Centered title, Pip/Today hero, A+ first, four tool tiles, calendar cards, Chat and Live |
| Navigation | HomeChrome.swift, ToolTabBar.swift | Home chevron on tool roots, detail sheets, six shortcuts, 3–6 configurable shortcuts and reordering |
| MACD | MACDStoryBoard.swift and card/detail views | Morning Play, Freshest Signal, journey rails, completed/ended examples, watchlist, classic board and guide |
| A+ | AplusView.swift | 1M/2M/5M, four scenarios, entry/T1/T2/T3 track, target-hit states, charts and watches |
| Patterns | PatternsView.swift | Compact latest setups, forming/confirmed/failed examples, details, levels and history |
| Screener | Native screener views | Top mover, peak gain, board accordions, sortable board details and sample feed |
| Stop Finder | Embedded Stop Finder and native handoff reference | Swing/scalp, long/short, tappable chart levels, explanation, risk sizing, saving and sharing |
| Calendars | Earnings/Economy views | This week/Reported, grouped day cards, event details, fictional reports and reminders |
| Live | Native live-calendar sheet | Day/time cards, next session and sample lesson |
| Community | ChatRoomView.swift, WinsChannelView.swift, ChatWins.swift | Persistent scrolling room chips, native Chat header, messages/threads, saved messages, sample profiles, Wins cards, milestones and composer |
| Profile and Pip | ProfileSheetView.swift, ChatAssistant.swift | Sheets, native Pip, profile identity, appearance, shortcuts and contextual prewritten answers |
| Onboarding | QuizWelcomeView.swift, QuizData.swift, QuizModels.swift | Native welcome copy, exact question/answer branching and four persona outcomes |

The browser is a recreation of the main app surfaces and principal flows. It is not the SwiftUI binary or a claim of pixel-perfect equivalence. Some secondary sheets reuse the existing browser components, company marks are placeholders, and OS services are simulated.

## Demo data and plan behavior

Eight fictional trade records drive current quotes, recorded entries/stops, target outcomes, price extrema and example Wins. Completed examples include multiple targets, a short plan and a pullback after a target hit. Moving and invalidated plans remain available. Pattern direction and failed states agree with the corresponding sample trade.

Recorded story plans use illustrative target distances of 2.5R, 4R and 5.5R. These demonstrate the UI and do not reproduce production-engine calculations. Chart candles are synthetic sequences, identified by bar number; displayed confirmation times are scenario copy, not historical bar timestamps. Pattern labels are interface examples, not validated detections.

Wins distinguish an underlying price move from a member's reported trade. The three initial trade examples calculate $900, $960 and $720 before fees from their sample entry, exit, direction and quantity. Other wins celebrate following a stop and learning. Visitor-created trade cards calculate their own dollar result. All participants and results are explicitly simulated.

Stop Finder creates a new prospective plan from the current sample quote. Its levels may therefore differ from an earlier recorded signal. Whole-share sizing stays within the entered risk budget under the illustrated stop assumption; fees, slippage and gaps are excluded.

## Interaction and boundaries

The 16-chapter guided tour can be paused, scrubbed and taken over at any point. Resuming restores its screen and chart position while retaining visitor profile, watchlist, drafts, saved messages and Wins changes. All 14 main destinations are independently accessible.

No live API, AI service, notification request, camera upload, membership mutation, trading action or real community post occurs in the preview. State remains in tab memory and resets on reload. Pip answers are prewritten. The lesson is an illustrative slideshow. Membership/TestFlight links remain explicit external destinations. The page states that public beta enrollment was closed when checked September 8, 2026.

The isolated Vercel review project is the deployment destination. The existing `thefriendlytrader.com` production site is outside this release boundary.
