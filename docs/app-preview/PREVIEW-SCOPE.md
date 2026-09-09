# App-first website and complete browser preview

## Clean design revision

The app is the visual focus. Keep its native system typography, six tool shortcuts, green identity and red Stop Finder. Use white #FFFFFF for the app, soft white #FAFBF9 for the site, ink #17251E, green #078763, subtle line #E1E8E2 and risk red #CD343C. Native text uses the system face; the site uses the same family with a restrained rounded headline. Align the desktop headline left beside one legible, unscaled phone; stack the same elements on mobile. The hierarchy is `headline + two actions | app + compact playback`, followed by three grouped screen lists. Remove the decorative oval, duplicate mascot pitch, redundant Home shortcut and floating assistant. Keep all destinations in the app menu, and place contextual Pip in the header. Use disclosure for supporting explanations, not for core chart controls.

Review against the brief: a generic device mockup with miniature content would miss the request. The phone must remain usable at native CSS size. Preserve the complete interactive workflows and pause/takeover behavior; simplify only their presentation. Grouping the directory into Tools, Your day and Your space makes the fourteen areas easier to scan without removing any of them.

The memorable element is the usable iPhone, with Friendly Trader’s actual icon and app arrangement. The page uses the clean revision’s palette and native typography. The phone remains legible at its CSS dimensions; mobile opens the same preview as a full-height panel.

The initial concept was reviewed against the brief: a three-screen demo was explicitly rejected. All ten AppTab destinations, live-calendar entry, profile/settings, onboarding, Pip and their principal child screens must be navigable. Use a screen directory so visitors are not trapped on the tour's route.

Implementation is a static, dependency-free browser simulation. One in-memory state holds tickers, scenario, favorites, alerts, drafts, profile, chart viewport and navigation. The tour snapshots its location on takeover and restores that position on resume without deleting visitor changes. Every number is synthetic, deterministic and labeled. No live APIs, notifications, account creation, checkout or community posts occur inside the preview. Marketing links to existing external destinations remain explicit links.

Native references: Sources/AppTab.swift, HomeLayout.swift, HomeWalkthrough.swift, ProfileSheetView.swift, docs/CONTEXT-LEDGER.md, and docs/macd-story/home-scalps-first.png in swj-macd-ios, inspected 2026-09-08. Preview values do not replicate production calculations or assert historical performance.

Scope: Home, Today, A+ board/detail/scenarios/alerts, MACD board/detail/timeframes/watchlist, Patterns/list/detail/history/filter, Screener/boards/detail/sort, Stop Finder/long-short/swing-scalp/risk sizing/saved plans, Earnings/week/detail, Economy/week/detail, live schedule/session preview, Chat/rooms/threads/reactions/search/share/Wins/member, Pip contextual canned replies, profile/name/avatar/appearance/notifications/quick-menu/membership, onboarding and reset.
