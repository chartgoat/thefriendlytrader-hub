# App-first website and complete browser preview

The memorable element is the usable iPhone, with Friendly Trader's actual icon and app arrangement. Forest #0B5D3F, cream #EDE6D8, white #FFFFFF, mint #DDEADF, ink #172A22 and risk red #CD343C. System rounded display typography and native system text keep the site related to the iOS product. Left-aligned large headline; phone and tour controls alongside it. Mobile opens the same preview as a full-height panel.

The initial concept was reviewed against the brief: a three-screen demo was explicitly rejected. All ten AppTab destinations, live-calendar entry, profile/settings, onboarding, Pip and their principal child screens must be navigable. Use a screen directory so visitors are not trapped on the tour's route.

Implementation is a static, dependency-free browser simulation. One in-memory state holds tickers, scenario, favorites, alerts, drafts, profile, chart viewport and navigation. The tour snapshots its location on takeover and restores that position on resume without deleting visitor changes. Every number is synthetic, deterministic and labeled. No live APIs, notifications, account creation, checkout or community posts occur inside the preview. Marketing links to existing external destinations remain explicit links.

Native references: Sources/AppTab.swift, HomeLayout.swift, HomeWalkthrough.swift, ProfileSheetView.swift, docs/CONTEXT-LEDGER.md, and docs/macd-story/home-scalps-first.png in swj-macd-ios, inspected 2026-09-08. Preview values do not replicate production calculations or assert historical performance.

Scope: Home, Today, A+ board/detail/scenarios/alerts, MACD board/detail/timeframes/watchlist, Patterns/list/detail/history/filter, Screener/boards/detail/sort, Stop Finder/long-short/swing-scalp/risk sizing/saved plans, Earnings/week/detail, Economy/week/detail, live schedule/session preview, Chat/rooms/threads/reactions/search/share/Wins/member, Pip contextual canned replies, profile/name/avatar/appearance/notifications/quick-menu/membership, onboarding and reset.
