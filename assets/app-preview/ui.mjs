import {
  escapeHTML as esc,
  price,
  SCREENS,
  SYMBOLS,
  NAMES,
  BASE,
  plan,
  positionSize,
} from "./core.mjs";
const paths = {
  home: "M3 10 12 3l9 7v11h-6v-7H9v7H3Z",
  trend: "M3 3v18h18M6 15l5-6 4 4 6-9M16 4h5v5",
  pulse: "M2 12h5l3-9 4 18 3-9h5",
  list: "M8 5h13M8 12h13M8 19h13M3 4v2M2 5h2M3 11v2M2 12h2M3 18v2M2 19h2",
  stop: "M8 2h8l6 6v8l-6 6H8l-6-6V8Z",
  bolt: "m13 2-9 12h7l-1 8 10-13h-8Z",
  chat: "M3 4h14v11H8l-5 4ZM17 9h5v12l-4-4h-6",
  calendar: "M4 5h16v16H4ZM4 10h16M8 2v6M16 2v6M8 14h1M14 14h1M8 17h1M14 17h1",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c-5 6-5 12 0 18M12 3c5 6 5 12 0 18",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l4 2",
  play: "m8 4 12 8-12 8Z",
  pause: "M8 4v16M16 4v16",
  person: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 22v-2a8 8 0 0 1 16 0v2",
  spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z",
  back: "m14 5-7 7 7 7",
  next: "m9 5 7 7-7 7",
  search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6",
  bell: "M5 17h14l-2-4V9a5 5 0 0 0-10 0v4ZM10 21h4",
  star: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
  share: "M12 16V2m-5 5 5-5 5 5M5 12H3v10h18V12h-2",
  expand: "M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6",
  close: "m5 5 14 14M19 5 5 19",
  check: "m4 12 5 5L20 6",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2",
  menu: "M4 6h16M4 12h16M4 18h16",
  pip: "M5 7h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3ZM7 12h1M16 12h1M8 16q4 4 8 0M7 4V2M12 4V1M17 4V0",
};
export const icon = (name, cls = "") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.spark}"/></svg>`;
export const btn = (text, action, extra = "", cls = "app-button") =>
  `<button class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
export const nav = (screen, text, cls = "app-link") =>
  `<button class="${cls}" data-screen="${screen}">${text}</button>`;
export const pill = (text, type = "gray") =>
  `<span class="pill ${type}">${text}</span>`;
export const section = (name, sub = "") =>
  `<h3 class="app-section-title">${name}${sub ? `<small>${sub}</small>` : ""}</h3>`;
export const stat = (label, value, cls = "") =>
  `<div class="stat"><span>${label}</span><strong class="${cls}">${value}</strong></div>`;
export const seg = (values, key, selected) =>
  `<div class="segment" aria-label="${key}">${values.map((v) => btn(v, "set", `data-key="${key}" data-value="${v}" aria-pressed="${v === selected}"`, v === selected ? "selected" : "")).join("")}</div>`;
export const chart = (expanded = false) =>
  `<div class="chart-card"><div class="chart-wrap"><svg class="candlestick-chart" role="img" aria-label="Interactive simulated candlestick chart. Use the zoom and pan buttons below, or drag and pinch the chart." tabindex="0"></svg><div class="chart-data" hidden></div></div><div class="chart-toolbar"><div>${btn("−", "zoom-out", 'aria-label="Zoom chart out"', "")}${btn("+", "zoom-in", 'aria-label="Zoom chart in"', "")}${btn("‹", "pan-back", 'aria-label="Pan chart earlier"', "")}${btn("›", "pan-forward", 'aria-label="Pan chart later"', "")}</div><span class="chart-readout">Drag to explore</span><div>${btn("↺", "chart-reset", 'aria-label="Reset chart"', "")}${expanded ? "" : btn("⤢", "expand-chart", 'aria-label="Expand chart"', "")}</div></div></div>`;
export const ticker = (s) =>
  `<form class="search-form" data-form="ticker">${icon("search")}<input name="symbol" aria-label="Search sample ticker" placeholder="Search sample ticker" value="${s.symbol}" maxlength="8" autocomplete="off"><button type="submit">Analyze</button></form><div class="ticker-chips">${SYMBOLS.map((t) => btn(t, "ticker", `data-value="${t}" aria-pressed="${s.symbol === t}"`, s.symbol === t ? "selected" : "")).join("")}</div>`;
export const symbolRow = (
  symbol,
  subtitle,
  trail,
  action = "open-stock",
  extras = "",
) =>
  `<button class="list-row" data-action="${action}" data-symbol="${symbol}" ${extras}><span class="symbol-logo">${symbol === "NVDA" ? "N" : symbol === "AAPL" ? "A" : symbol.slice(0, 2)}</span><span class="grow"><strong>${symbol}</strong><small>${subtitle}</small></span><span class="trailing">${trail}</span>${icon("next")}</button>`;
export const META = {
  home: ["Home", "Your daily starting point"],
  stream: ["Today", "The demo day, at a glance"],
  aplus: ["A+ Scalps", "Which level just broke?"],
  macd: ["MACD", "Read the momentum"],
  patterns: ["Patterns", "What’s setting up?"],
  screener: ["Screener", "What’s running today?"],
  stops: ["Stop Finder", "Find your exit"],
  earnings: ["Earnings", "Who reports this week?"],
  economy: ["Economy", "What could move the market?"],
  live: ["Sessions", "Learn together"],
  chat: ["Chat", "Your trading community"],
  assistant: ["Pip", "Your Friendly Assistant"],
  profile: ["Your profile", "Make yourself at home"],
  onboarding: ["Welcome", "Find your starting point"],
  menu: ["Quick menu", "Every corner of the app"],
};
export const fixtures = {
  patterns: [
    {
      symbol: "NVDA",
      name: "Ascending triangle",
      status: "Forming",
      bias: "Bullish",
      text: "Higher lows are approaching a resistance area. This example is still forming.",
    },
    {
      symbol: "AAPL",
      name: "Bull flag",
      status: "Confirmed",
      bias: "Bullish",
      text: "The example has closed above the flag. Confirmation describes the structure, not a guaranteed outcome.",
    },
    {
      symbol: "GOOGL",
      name: "Bull flag",
      status: "Failed",
      bias: "Bullish",
      text: "Price closed below the example’s invalidation level. A failed idea is part of the story.",
    },
    {
      symbol: "MSFT",
      name: "Bearish engulfing",
      status: "Confirmed",
      bias: "Bearish",
      text: "The red candle’s body covers the prior green body in this illustrative example.",
    },
    {
      symbol: "META",
      name: "Support bounce",
      status: "Forming",
      bias: "Bullish",
      text: "Price is testing support. A bounce has not yet been confirmed.",
    },
    {
      symbol: "TSLA", name: "Resistance breakout", status: "Confirmed", bias: "Bullish",
      text: "The example has closed above resistance. Its first target was reached before price pulled back.",
    },
  ],
  events: [
    {
      id: "earn-1",
      day: 1,
      symbol: "AAPL",
      title: "Apple",
      time: "After close",
      actual: "$1.62",
      expected: "$1.55",
      detail:
        "Earnings per share describes a company’s profit divided by its share count. These numbers are simulated.",
    },
    {
      id: "earn-2",
      day: 2,
      symbol: "NVDA",
      title: "NVIDIA",
      time: "After close",
      actual: "Pending",
      expected: "$0.94",
      detail:
        "Watch the report and guidance. A company can beat an estimate and still move lower. This event is fictional.",
    },
    {
      id: "earn-3",
      day: 3,
      symbol: "MSFT",
      title: "Microsoft",
      time: "After close",
      actual: "Pending",
      expected: "$3.18",
      detail:
        "Cloud growth, revenue and forward guidance are common parts of this earnings discussion. Simulated example.",
    },
    {
      id: "earn-4",
      day: 4,
      symbol: "AMZN",
      title: "Amazon",
      time: "After close",
      actual: "Pending",
      expected: "$1.25",
      detail:
        "Look beyond the headline earnings number to revenue and guidance. Simulated example.",
    },
  ],
  economy: [
    {
      id: "econ-1",
      day: 1,
      title: "Consumer Price Index",
      time: "8:30 AM ET",
      actual: "2.8%",
      expected: "2.9%",
      detail:
        "CPI tracks changes in prices paid by consumers. Markets compare the release with expectations. This demo does not attribute the whole market move to one release.",
    },
    {
      id: "econ-2",
      day: 2,
      title: "Federal Reserve remarks",
      time: "2:00 PM ET",
      actual: "Upcoming",
      expected: "—",
      detail:
        "Central-bank commentary can change expectations about interest rates. This is a fictional calendar event.",
    },
    {
      id: "econ-3",
      day: 3,
      title: "Initial jobless claims",
      time: "8:30 AM ET",
      actual: "Upcoming",
      expected: "225K",
      detail:
        "New applications for unemployment benefits provide one view of the labor market. This is a simulated example.",
    },
    {
      id: "econ-4",
      day: 4,
      title: "Consumer sentiment",
      time: "10:00 AM ET",
      actual: "Upcoming",
      expected: "62.0",
      detail:
        "A survey of how households feel about the economy. Survey results do not predict a specific stock move.",
    },
  ],
  rooms: [
    ["GOAT Alerts", "Sample setup alerts from the team", "bolt"],
    ["Announcements", "Updates and things to know", "bell"],
    ["Trading Floor", "Share ideas and ask questions", "chat"],
    ["Wins", "Celebrate progress and discipline", "star"],
  ],
  messages: [
    {
      id: "m1",
      room: "Trading Floor",
      name: "Maya",
      avatar: "M",
      time: "10:32",
      text: "Watching NVDA at the upper level. Waiting for the candle to close before I make a plan.",
      replies: 2,
    },
    {
      id: "m2",
      room: "Trading Floor",
      name: "Theo",
      avatar: "T",
      time: "10:35",
      text: "That’s what I like about seeing the stop on the chart. I know where the idea stops making sense.",
      replies: 1,
    },
    {
      id: "m3",
      room: "Trading Floor",
      name: "Sam",
      avatar: "S",
      time: "10:39",
      text: "Reminder to check the calendar too. There’s an example Fed event tomorrow.",
      replies: 0,
    },
    {
      id: "m4",
      room: "GOAT Alerts",
      name: "Friendly Team",
      avatar: "F",
      time: "10:15",
      text: "Demo alert: NVDA closed above its sample breakout level. Open the setup to explore the plan.",
      replies: 1,
    },
    {
      id: "m5",
      room: "Announcements",
      name: "Friendly Team",
      avatar: "F",
      time: "09:00",
      text: "Welcome to the preview. All members and messages here are fictional. Try a thread, a reaction, or a sample message.",
      replies: 0,
    },
    {
      id: "m6",
      room: "Wins",
      name: "Riley",
      avatar: "R",
      time: "10:20",
      text: "Today’s win: followed my stop instead of moving it. Keeping the plan was the progress.",
      replies: 2,
    },
  ],
};
function home(s) {
  return `<button class="home-greeting" data-screen="stream"><img src="assets/app-preview/pip.png" alt="Pip"><span class="greeting-copy"><span class="greeting-title">Morning, ${esc(s.name)}.<span class="today-chip">Today ›</span></span><p>Your morning, at a glance. Setups, movers and what’s ahead.</p></span></button><div class="home-tools"><button class="tool-tile wide" data-screen="aplus">${icon("bolt")}<strong>A+ Scalps</strong><small>NVDA · Breakout</small></button>${[
    ["macd", "MACD", "trend", "Read the momentum"],
    ["patterns", "Patterns", "pulse", "NVDA · Forming"],
    ["screener", "Screener", "list", "Find today’s movers"],
    ["stops", "Stop Finder", "stop", "Find your exit"],
  ]
    .map(
      ([id, title, i, sub]) =>
        `<button class="tool-tile" data-screen="${id}">${icon(i)}<strong>${title}</strong><small>${sub}</small></button>`,
    )
    .join("")}</div><div class="home-calendars">${[
    ["earnings", "Earnings", "calendar"],
    ["economy", "Economy", "globe"],
  ]
    .map(
      ([id, t, i]) =>
        `<button class="tool-tile calendar-tile" data-screen="${id}">${icon(i)}<strong>${t}</strong></button>`,
    )
    .join(
      "",
    )}</div><button class="home-row" data-screen="chat">${icon("chat")}<strong>Chat</strong><small>Say hello ›</small></button><button class="home-row" data-screen="live">${icon("play")}<strong>Sessions</strong><small>View schedule ›</small></button>${nav("menu", "Explore all app screens", "app-link all-screens")}`;
}
function stream(s) {
  return `<p class="app-kicker">Tuesday · Demo day · 10:42 AM ET</p><div class="card"><div class="card-title"><img src="assets/app-preview/pip.png" width="42" alt=""><div><strong>Here’s your morning.</strong><small>Sample market brief</small></div></div><p>Momentum is mixed across the board. Start with the levels, then check what’s on the calendar.</p></div>${seg(["All", "Setups", "Calendar"], "streamFilter", s.streamFilter || "All")}<div class="timeline">${[
    [
      "10:30 AM",
      "NVDA is above its sample level",
      "The A+ plan has a confirmed breakout.",
      "aplus",
      "Setups",
    ],
    [
      "10:15 AM",
      "AAPL pattern confirmed",
      "Open the sample chart to see the structure.",
      "patterns",
      "Setups",
    ],
    [
      "9:45 AM",
      "Movers are taking shape",
      "Explore the three screener boards.",
      "screener",
      "Setups",
    ],
    [
      "8:30 AM",
      "Inflation example released",
      "A simulated CPI result is on the calendar.",
      "economy",
      "Calendar",
    ],
    [
      "8:00 AM",
      "Make a little time to learn",
      "A demo chart-reading session is on the schedule.",
      "live",
      "Calendar",
    ],
  ]
    .filter(
      (x) =>
        !s.streamFilter || s.streamFilter === "All" || x[4] === s.streamFilter,
    )
    .map(
      ([time, title, desc, screen]) =>
        `<article class="timeline-item"><time>${time}</time><button class="card clickable" data-screen="${screen}"><h3>${title}</h3><p>${desc}</p></button></article>`,
    )
    .join("")}</div>`;
}
function aplus(s) {
  if (s.detail === "setup") return setup(s);
  return `<p class="app-kicker">Daily levels for the Mag 7 and more</p>${seg(["Morning", "Afternoon"], "session", s.session)}${section(s.session === "Morning" ? "Morning levels" : "Afternoon range", s.session === "Morning" ? "9–11:30 AM ET" : "3–4 PM ET")}${SYMBOLS.slice(
    0,
    7,
  )
    .map((t, i) =>
      symbolRow(
        t,
        [
          "Breakout confirmed",
          "Watching resistance",
          "Breakdown confirmed",
          "Target reached",
          "Watching support",
          "Setup failed",
          "Waiting for a close",
        ][i],
        pill(
          [
            "Breakout",
            "Watching",
            "Breakdown",
            "Target hit",
            "Watching",
            "Failed",
            "Waiting",
          ][i],
          ["up", "gray", "down", "gold", "gray", "down", "gray"][i],
        ),
        "aplus-detail",
      ),
    )
    .join(
      "",
    )}${section("Your watches")}${s.alerts.length ? s.alerts.map((a) => `<div class="list-row"><div class="grow"><strong>${a.symbol} · ${a.scenario}</strong><small>${a.session} · ${a.timeframe} · demo only</small></div>${btn("Remove", "remove-alert", `data-id="${esc(a.id)}"`, "app-link")}</div>`).join("") : '<p class="empty-state">Open a setup and tap the bell to try a watch.</p>'}`;
}
function setup(s) {
  const p = plan(s.symbol, s.direction, "scalp"),
    armed = s.alerts.some(
      (a) =>
        a.symbol === s.symbol &&
        a.scenario === s.scenario &&
        a.timeframe === s.timeframe &&
        a.session === s.session,
    );
  return `<div class="row"><div><h3 style="margin:0;font-size:28px">${s.symbol}</h3><p class="app-kicker">${NAMES[s.symbol]} · ${s.session} example</p></div>${btn(icon("bell"), "alert", `aria-label="${armed ? "Remove" : "Save"} demo alert" aria-pressed="${armed}"`, "icon-button")}</div>${seg(["Breakout", "Breakdown", "Bounce", "Rejection"], "scenario", s.scenario)}${seg(["5m", "15m", "30m"], "timeframe", s.timeframe)}${pill(s.scenario + " example", s.direction === "long" ? "up" : "down")}${chart()}<div class="stats">${stat("Entry", price(p.entry))}${stat("Stop", price(p.stop), "negative")}${stat("Target 1", price(p.target), "positive")}</div><div class="highlight-note">${s.scenario === "Breakout" ? "A candle close above resistance is the confirmation in this example." : s.scenario === "Breakdown" ? "A candle close below support is the confirmation in this example." : s.scenario === "Bounce" ? "This example watches a support test followed by a move back up." : "This example watches a resistance test followed by a move back down."} The plan can still fail.</div><div class="detail-actions">${btn(icon("stop") + " Plan a stop", "to-stops")}${btn(icon("share") + " Share example", "share", "", "app-button secondary")}</div><details class="app-disclosure"><summary>About these sample levels</summary><p class="tool-explanation">These are fixed teaching levels. In the actual app, morning structure and afternoon-range plans use their own rules. Demo targets do not reproduce the production engine.</p></details>`;
}
function macd(s) {
  if (s.detail === "stock") return stockDetail(s, "Momentum");
  return `${ticker(s)}${seg(["15m", "30m", "1h", "4h", "1d"], "timeframe", s.timeframe)}<button class="card clickable" data-action="stock-detail" data-symbol="${s.symbol}"><div class="row"><div><span class="small-muted">Freshest sample</span><h3 style="margin-top:5px">${s.symbol} · Buyers leaning in</h3></div>${icon("trend")}</div><p>The sample plan is moving toward its target. Open it to see the full chart.</p><div class="progress-track"><span style="width:58%"></span></div><div class="progress-caption"><span>Entry</span><span>Target</span></div></button>${section("Your watchlist", `${s.watchlist.length} saved`)}${s.watchlist.length ? s.watchlist.map((t) => symbolRow(t, NAMES[t], price(BASE[t]), "stock-detail")).join("") : '<p class="empty-state">Star a ticker to put it here.</p>'}${section("The Mag 7 board", s.timeframe + " examples")}${SYMBOLS.slice(
    0,
    7,
  )
    .map((t, i) =>
      symbolRow(
        t,
        [
          "Buyers leaning in",
          "Momentum fading",
          "Sellers leaning in",
          "Target reached",
        ][i % 4],
        pill(
          ["Bullish", "Fading", "Bearish", "Complete"][i % 4],
          ["up", "gray", "down", "gold"][i % 4],
        ),
        "stock-detail",
      ),
    )
    .join("")}`;
}
function stockDetail(s, label) {
  const p = plan(s.symbol, s.direction, s.mode);
  return `<div class="row"><div><h3 style="font-size:27px;margin:0">${s.symbol}</h3><p class="app-kicker">${NAMES[s.symbol]}</p></div><div class="row"><strong>${price(BASE[s.symbol])}</strong>${btn(icon("star"), "watch", `aria-label="${s.watchlist.includes(s.symbol) ? "Remove from" : "Add to"} watchlist" aria-pressed="${s.watchlist.includes(s.symbol)}"`, "icon-button")}</div></div>${seg(["15m", "30m", "1h", "4h", "1d"], "timeframe", s.timeframe)}${pill(label + " example", "up")}${chart()}<div class="stats">${stat("Entry", price(p.entry))}${stat("Invalidation", price(p.stop), "negative")}${stat("Target", price(p.target), "positive")}</div><div class="card"><h3>The story so far</h3><p>This example shows improving momentum after a pullback. A momentum signal is a description of the market, not a promise of what comes next.</p></div><div class="detail-actions">${btn("Open Stop Finder", "to-stops")}${btn("Share example", "share", "", "app-button secondary")}</div>`;
}
function patterns(s) {
  if (s.detail === "pattern") {
    const f =
      fixtures.patterns.find((x) => x.symbol === s.symbol) ||
      fixtures.patterns[0];
    return `<div class="row"><div><h3 style="font-size:25px;margin-bottom:5px">${s.symbol}</h3><p class="app-kicker">Illustrative ${f.name.toLowerCase()}</p></div>${pill(f.status, f.status === "Confirmed" ? "up" : f.status === "Failed" ? "down" : "gray")}</div>${seg(["15m", "1h", "1d"], "timeframe", s.timeframe)}${chart()}<div class="card"><h3>What you’re looking for</h3><p>${f.text} The preview chart illustrates interaction, not a validated historical detection.</p></div>${seg(["Overview", "History"], "patternTab", s.patternTab || "Overview")}${s.patternTab === "History" ? `<p class="app-kicker">Fictional examples. Not a backtest or a win rate.</p>${["Target reached", "Invalidated", "Still forming"].map((x, i) => `<button class="list-row" data-action="history-example" data-value="${i}"><span class="grow"><strong>Example ${i + 1}</strong><small>Explore a different chart window</small></span>${pill(x, ["gold", "down", "gray"][i])}</button>`).join("")}` : `<div class="stats">${stat("Bias", f.bias)}${stat("State", f.status)}${stat("Sample", s.timeframe)}</div>`}<div class="detail-actions">${btn("Plan a stop", "to-stops")}${btn("Share example", "share", "", "app-button secondary")}</div>`;
  }
  return `${ticker(s)}${seg(["All", "Forming", "Confirmed", "Failed"], "patternFilter", s.patternFilter)}${fixtures.patterns
    .filter((f) => s.patternFilter === "All" || s.patternFilter === f.status)
    .map(
      (f) =>
        `<button class="card clickable" data-action="pattern-detail" data-symbol="${f.symbol}"><div class="row"><strong>${f.symbol}</strong>${pill(f.status, f.status === "Confirmed" ? "up" : f.status === "Failed" ? "down" : "gray")}</div><h3 class="pattern-name">${f.name}</h3><div class="row"><span class="small-muted">${f.bias} example</span>${icon("next")}</div></button>`,
    )
    .join(
      "",
    )}<p class="small-muted">Pattern names and candles demonstrate the interface. They are not live detections or historical performance claims.</p>`;
}
function screener(s) {
  if (s.detail === "stock") return stockDetail(s, "Mover");
  if (s.detail === "board") {
    let rows = [...SYMBOLS.slice(0, 7)].map((symbol, i) => ({
      symbol,
      move: [8.2, 5.4, -2.1, 4.6, 1.8, -1.4, 3.2][i],
      volume: [4.2, 2.8, 3.1, 5.6, 1.4, 2.1, 1.9][i],
    }));
    if (s.sort === "move") rows.sort((a, b) => b.move - a.move);
    if (s.sort === "volume") rows.sort((a, b) => b.volume - a.volume);
    if (s.sort === "symbol")
      rows.sort((a, b) => a.symbol.localeCompare(b.symbol));
    return `<h3>${s.screenerBoard}</h3><p class="app-kicker">Sample movers · the percentages are fictional</p><div class="row"><strong style="font-size:12px">${rows.length} stocks</strong><label class="small-muted">Sort <select aria-label="Sort screener" data-change="sort"><option value="move" ${s.sort === "move" ? "selected" : ""}>Move</option><option value="volume" ${s.sort === "volume" ? "selected" : ""}>Relative volume</option><option value="symbol" ${s.sort === "symbol" ? "selected" : ""}>Ticker</option></select></label></div>${rows.map((r) => symbolRow(r.symbol, `${r.volume}× relative volume`, `<span class="${r.move > 0 ? "positive" : "negative"}">${r.move > 0 ? "+" : ""}${r.move}%</span>`, "stock-detail")).join("")}`;
  }
  return `<p class="app-kicker">A quieter way to find the movers</p><div class="card"><span class="small-muted">Sample top mover</span><div class="row" style="margin-top:9px"><h3>NVDA</h3><strong class="positive">+8.2%</strong></div><p>A simulated move for exploring the screener.</p></div>${[
    [
      "Overnight gappers",
      "Stocks starting the day above the prior close.",
      "sun",
    ],
    ["Live runners", "Stocks making a move during the session.", "bolt"],
    ["Breakouts", "Stocks approaching or moving through key levels.", "trend"],
  ]
    .map(
      ([t, d, i]) =>
        `<button class="card clickable" data-action="screener-board" data-value="${t}"><div class="card-title">${icon(i)}<div><h3>${t}</h3><p>${d}</p></div>${icon("next")}</div></button>`,
    )
    .join("")}`;
}
function stops(s) {
  const p = plan(s.symbol, s.direction, s.mode),
    shares = positionSize(Number(s.riskBudget), p.risk);
  return `${ticker(s)}${seg(["Swing", "Scalp"], "stopMode", s.mode === "swing" ? "Swing" : "Scalp")}${chart()}<h3 style="text-align:center;font-size:23px;margin:16px 0 3px">${s.symbol}</h3><p class="app-kicker center">${NAMES[s.symbol]}</p>${seg(["Long", "Short"], "stopDirection", s.direction === "long" ? "Long" : "Short")}<div class="stats">${stat("Entry", price(p.entry))}${stat("Stop", price(p.stop), "negative")}${stat("Target 1", price(p.target), "positive")}</div><div class="feature-keys">${btn("Why this stop?", "explain-level", 'data-value="stop"', "")}${btn("Target 1", "explain-level", 'data-value="target"', "")}${btn("Target 2", "explain-level", 'data-value="target2"', "")}</div>${s.levelInfo ? `<div class="level-explainer">${s.levelInfo === "stop" ? "The simulated stop marks where this example is invalidated. A stop order does not guarantee an execution price." : `This demo target is ${s.levelInfo === "target" ? 2 : 3} times the entry-to-stop distance. Actual app targets use the tool’s own rules.`}</div>` : ""}<div class="card"><h3>Size the example</h3><label class="field">Amount at risk ($)<input name="riskBudget" data-change="riskBudget" type="number" min="1" max="1000000" step="1" value="${s.riskBudget}" inputmode="decimal"></label><div class="row"><span class="small-muted">${price(p.risk)} risk per share</span><strong>${shares.toLocaleString()} shares</strong></div><p>Whole shares rounded down. Excludes fees, slippage and gaps.</p></div><div class="detail-actions">${btn("Save demo plan", "save-plan")}${btn("Share example", "share", "", "app-button secondary")}</div>${section("Saved plans")}${s.plans.length ? s.plans.map((p, i) => `<div class="list-row"><button class="app-link grow" data-action="load-plan" data-index="${i}">${p.symbol} · ${p.direction} · ${p.mode}</button>${btn("Remove", "remove-plan", `data-index="${i}"`, "app-link")}</div>`).join("") : '<p class="small-muted">Your saved demo plans appear here.</p>'}`;
}
function calendar(s, type) {
  const list = type === "earnings" ? fixtures.events : fixtures.economy;
  if (s.detail === "event") {
    const e = list.find((x) => x.id === s.event) || list[0],
      saved = s.reminders.includes(e.id);
    return `<div class="card"><span class="small-muted">Fictional ${type === "earnings" ? "earnings report" : "economic event"}</span><h3 style="font-size:23px;margin:10px 0">${e.title}</h3><p>${e.time} · Demo week ${s.week + 1}</p><div class="stats">${stat("Expected", e.expected)}${stat("Actual", e.actual)}${stat("Status", e.actual === "Pending" || e.actual === "Upcoming" ? "Upcoming" : "Reported")}</div></div><div class="card"><h3>What does it mean?</h3><p>${e.detail}</p></div>${btn(saved ? "Remove demo reminder" : "Save demo reminder", "reminder", `data-value="${e.id}"`, "app-button full")}${e.symbol ? btn("Explore " + e.symbol, "event-stock", `data-symbol="${e.symbol}"`, "app-button secondary full") : nav("stream", "Back to Today", "app-button secondary full")}`;
  }
  return `<div class="row">${btn("‹", "week-back", 'aria-label="Previous demo week"', "icon-button")}<strong style="font-size:13px">Demo week ${s.week + 1}</strong>${btn("›", "week-forward", 'aria-label="Next demo week"', "icon-button")}</div><div class="week-strip">${["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => btn(`${d}<strong>${7 + s.week * 7 + i}</strong>`, "calendar-day", `data-value="${i}" aria-pressed="${s.day === i}"`, s.day === i ? "selected" : "")).join("")}</div>${btn(s.day === null || s.day === undefined ? "Showing the whole week" : "Show the whole week", "calendar-all", "", "app-link")}<p class="app-kicker">Sample calendar · fictional events</p>${s.week > 0 ? `<div class="card"><h3>Next demo week</h3><p>Explore another week using the same teaching events. No dates here represent scheduled releases.</p></div>` : ""}${
    list
      .filter((e) => s.day == null || s.day === e.day)
      .map(
        (e) =>
          `<button class="card clickable" data-action="event" data-value="${e.id}"><div class="row"><div><h3>${e.symbol ? e.symbol + " · " : ""}${e.title}</h3><p>${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][e.day]} · ${e.time}</p></div>${icon("next")}</div><div style="margin-top:10px">${pill(e.actual === "Pending" || e.actual === "Upcoming" ? "Upcoming" : "Reported", e.actual === "Pending" || e.actual === "Upcoming" ? "gray" : "up")}</div></button>`,
      )
      .join("") ||
    '<div class="empty-state">No sample events on this day. Choose another day or show the whole week.</div>'
  }`;
}
function live(s) {
  if (s.detail === "session")
    return `<div class="session-art"><div class="session-slide">${icon("play")}<h3>${["Read the chart", "Start with structure", "Know your invalidation", "Keep the plan visible"][s.slide || 0]}</h3><p>${["A short interactive lesson preview.", "Look for the areas where price reacted before.", "Your stop belongs where the idea no longer makes sense.", "Entry, stop and target belong in the same view."][s.slide || 0]}</p></div></div><p class="app-kicker">Demo lesson · ${Number(s.slide || 0) + 1} of 4 · no live broadcast</p><div class="row">${btn("Previous", "slide-back", "", "app-button secondary")}${btn("Next", "slide-next")}</div>${section("Session notes")}<div class="card"><p>This short preview explains the lesson format. In the app, sessions and their availability follow the actual community schedule.</p></div>${nav("stops", "Try it in Stop Finder", "app-button full")}`;
  return `<p class="app-kicker">Sample schedule · all sessions are fictional</p><div class="session-art">${icon("play")}<h3>Read the chart, together.</h3><p>A friendly walkthrough of structure, stops and planning.</p>${btn("Preview the lesson", "session", "", "app-button secondary")}</div>${[
    ["morning", "Morning preparation", "9:00 AM ET"],
    ["charts", "Chart reading workshop", "12:00 PM ET"],
    ["close", "Closing session review", "4:15 PM ET"],
  ]
    .map(
      ([id, t, time]) =>
        `<div class="card"><h3>${t}</h3><p>${time} · Sample session</p>${btn(s.reminders.includes(id) ? "Reminder saved ✓" : "Remind me in demo", "reminder", `data-value="${id}"`, "app-button secondary full")}</div>`,
    )
    .join("")}`;
}
export function messageHTML(m, s, thread = false) {
  return `<article class="message"><button class="avatar" data-action="member" data-name="${esc(m.name)}" aria-label="View ${esc(m.name)} demo profile">${esc(m.avatar)}</button><div class="message-body"><div class="message-meta"><strong>${esc(m.name)}</strong><time>${m.time}</time></div><p>${esc(m.text)}</p><div class="message-actions">${btn(`${s.reactions.includes(m.id) ? "♥ 1" : "♡"}`, "reaction", `data-id="${m.id}" aria-label="React to message by ${esc(m.name)}" aria-pressed="${s.reactions.includes(m.id)}"`, "")}${btn(s.savedMessages?.includes(m.id)?"Saved ✓":"Save","save-message",`data-id="${m.id}" aria-pressed="${s.savedMessages?.includes(m.id)||false}"`,"")}${thread ? "" : btn(`${(m.replies || 0) + s.messages.filter((x) => x.parent === m.id).length} replies`, "thread", `data-id="${m.id}"`, "")}${m.id === "m4" ? btn("Open setup", "alert-setup", "", "") : ""}</div></div></article>`;
}
function chat(s) {
  if (s.detail === "member")
    return `<div class="center"><div class="avatar profile-avatar">${esc(s.member?.slice(0, 1) || "M")}</div><h3>${esc(s.member || "Member")}</h3>${pill("Fictional demo member", "up")}</div><div class="card"><h3>A friendly place to learn</h3><p>This profile is part of the demonstration. No real member details are shown.</p></div>${nav("chat", "Back to community", "app-button full")}`;
  if (!s.detail)
    return `<p class="app-kicker">All people and conversations here are fictional.</p>${fixtures.rooms.map(([t, d, i]) => `<button class="home-row" data-action="room" data-value="${t}">${icon(i)}<span class="grow"><strong>${t}</strong><small style="display:block;margin-top:4px">${d}</small></span>${icon("next")}</button>`).join("")}<div class="card" style="margin-top:20px"><h3>Learn out loud.</h3><p>Open a room, explore a thread, or write a demo message. It stays in this preview.</p></div>`;
  if (s.detail === "share")
    return `<div class="card"><h3>Share a Friendly Trader snapshot</h3><p>${s.symbol} · ${s.timeframe} · ${price(BASE[s.symbol])}</p><p>Demo snapshot. Simulated data.</p></div><form data-form="share"><label class="field">Add a note<textarea name="note" maxlength="500" placeholder="What are you watching?"></textarea></label><button class="app-button full" type="submit">Share to demo Trading Floor</button></form>`;
  let msgs = [...fixtures.messages, ...s.messages].filter(
    (m) => m.room === s.room && !m.parent,
  );
  const query = s.search.toLowerCase();
  if (query)
    msgs = msgs.filter((m) =>
      (m.text + " " + m.name).toLowerCase().includes(query),
    );
  if (s.detail === "thread") {
    const m = [...fixtures.messages, ...s.messages].find(
      (m) => m.id === s.thread,
    );
    return `${m ? messageHTML(m, s, true) : ""}${section("Thread")}<div class="message"><span class="avatar">J</span><div class="message-body"><strong style="font-size:11px">Jamie</strong><p>Helpful way to think about it. The chart makes the plan easier to follow.</p><span class="small-muted">Fictional reply</span></div></div>${s.messages
      .filter((m) => m.parent === s.thread)
      .map((m) => messageHTML(m, s, true))
      .join("")}${composer(s)}`;
  }
  return `<h3 style="font-size:19px;margin:2px 0 8px">${s.room}</h3>${s.room === "Wins" ? `<div class="card center"><div class="badge-art">✦</div><h3>Progress counts.</h3><p>Celebrate a thoughtful plan, a good question or sticking to your stop.</p>${btn("Share a demo win", "compose-win", "", "app-link")}</div>` : ""}${s.room === "Announcements" ? '<div class="app-notice">Team updates appear here. Members can explore the threads below.</div>' : ""}<form class="search-form" data-form="chat-search">${icon("search")}<input name="query" aria-label="Search this room" placeholder="Search this room" value="${esc(s.search)}"><button type="submit">Find</button></form>${msgs.map((m) => messageHTML(m, s)).join("") || '<p class="empty-state">No matching messages. Try a different search.</p>'}${["Trading Floor", "Wins"].includes(s.room) ? composer(s) : '<p class="small-muted">Team posts lead this room. Open a thread to join the demo discussion.</p>'}`;
}
function composer(s) {
  const key = s.detail === "thread" ? "thread:" + s.thread : s.room;
  return `<form class="composer" data-form="message"><input name="message" aria-label="Demo message" placeholder="Write a demo message…" value="${esc(s.drafts[key] || "")}" maxlength="1000" autocomplete="off"><button class="app-button" type="submit">Send</button></form><p class="small-muted">Only visible in this preview. Nothing is sent.</p>`;
}
function assistant(s) {
  return `<div class="pip-hero"><img src="assets/app-preview/pip.png" alt="Pip"><div><h3>Hey, I’m Pip.</h3><p>Let’s make this a little clearer.</p></div></div><p class="app-kicker">Demo answers are prewritten. No message is sent to an AI service.</p><div class="card"><h3>${META[s.assistantContext || "home"]?.[0] || "Your app"}, in plain English.</h3><p>Choose a question or try your own. I’ll help explain the sample screen you came from.</p></div>${["What am I looking at?", "How do I use the stop?", "Does confirmed mean a winning trade?", "What should I explore next?"].map((q) => btn(q, "ask-pip", `data-value="${q}"`, "pip-question")).join("")}${s.pipQuestion ? `<p class="small-muted">You asked: ${esc(s.pipQuestion)}</p>` : ""}${s.pipAnswer ? `<div class="pip-answer" role="status">${esc(s.pipAnswer)}</div>` : ""}<form class="composer" data-form="pip"><input name="question" aria-label="Question for Pip" placeholder="Ask about the example…" maxlength="250"><button class="app-button" type="submit">Ask</button></form>${s.assistantContext ? nav(s.assistantContext, "Return to " + META[s.assistantContext][0], "app-button secondary full") : ""}`;
}
function profile(s) {
  if (s.detail === "membership")
    return `<div class="card"><h3>Explore every tool</h3><p>Your preview has sample access to every screen. It does not create a membership or change an existing one.</p></div><div class="app-notice">The actual app’s access depends on your membership. Current plans and prices are shown on the website’s membership section.</div>${btn("View website membership", "membership-site", "", "app-button full")}`;
  if (s.detail === "notifications")
    return `<p class="app-kicker">These settings affect the demo only.</p>${[
      ["Setup alerts", "setups"],
      ["Replies and mentions", "replies"],
      ["Calendar reminders", "calendar"],
      ["Session reminders", "sessions"],
    ]
      .map(
        ([t, k]) =>
          `<div class="list-row"><span class="grow"><strong>${t}</strong><small>Sample notification preference</small></span><button class="switch" role="switch" aria-label="${t}" aria-checked="${s.notificationPrefs?.[k] !== false}" data-action="notification-pref" data-value="${k}"></button></div>`,
      )
      .join(
        "",
      )}<div class="app-notice">The preview never asks your browser for notification permission or sends a real notification.</div>`;
  if (s.detail === "quick-menu")
    return `<p class="app-kicker">Choose up to six shortcuts. Home is always available.</p>${SCREENS.filter(
      (x) => !["home", "profile", "onboarding", "assistant"].includes(x[0]),
    )
      .map(
        ([id, t, d, i]) =>
          `<div class="list-row">${icon(i)}<span class="grow"><strong>${t}</strong></span><button class="switch" role="switch" aria-label="${t} shortcut" aria-checked="${s.quick.includes(id)}" data-action="quick-toggle" data-value="${id}"></button></div>`,
      )
      .join("")}`;
  return `<div class="profile-identity"><div class="avatar profile-avatar">${esc(s.avatar)}</div><h3>${esc(s.name)}</h3><p class="small-muted">Your preview profile</p></div><details class="app-disclosure"><summary>Edit profile</summary><div class="avatar-choices">${["A", "✦", "☀", "☘"].map((a) => btn(a, "avatar", `data-value="${a}" aria-label="Choose ${a} avatar"`, "")).join("")}</div><form data-form="profile"><label class="field">Display name<input name="name" aria-label="Demo display name" value="${esc(s.name)}" minlength="3" maxlength="20" pattern="[A-Za-z0-9_]{3,20}" required></label><p class="small-muted">3–20 letters, numbers or underscores.</p><button class="app-button full" type="submit">Save demo profile</button></form></details><div class="list-row"><div class="grow"><strong>Dark mode</strong><small>Try the app’s other appearance</small></div><button class="switch" role="switch" aria-label="Dark mode" aria-checked="${s.dark}" data-action="dark"></button></div>${[
    ["membership", "Membership", "Your preview access"],
    ["notifications", "Notifications", "Alerts and reminders"],
    ["quick-menu", "Quick menu", "Choose your shortcuts"],
  ]
    .map(
      ([id, t, d]) =>
        `<button class="list-row" data-action="profile-detail" data-value="${id}"><span class="grow"><strong>${t}</strong><small>${d}</small></span>${icon("next")}</button>`,
    )
    .join(
      "",
    )}${nav("onboarding", "Find your starting point", "list-row settings-action")}${btn("Replay the guided tour", "replay-tour", "", "list-row settings-action")}${btn("Reset all demo changes", "reset", "", "list-row settings-action danger")}<p class="small-muted center">Your changes stay in memory in this tab.<br>Reloading resets the preview.</p>`;
}
function onboarding(s) {
  const questions = [
    [
      "What brings you here?",
      [
        "I want to understand charts",
        "I want a clearer trade plan",
        "I want to find what’s moving",
      ],
    ],
    [
      "What would help the most?",
      [
        "Seeing a setup visually",
        "Knowing where to get out",
        "A simple daily starting point",
      ],
    ],
    [
      "How do you like to learn?",
      ["Show me on a chart", "Let me explore", "Walk me through it"],
    ],
  ];
  if (s.quizStep >= 3) {
    const tool =
      s.quizAnswers[1] === 1
        ? "stops"
        : s.quizAnswers[0] === 2
          ? "screener"
          : "patterns";
    return `<div class="pip-hero"><img src="assets/app-preview/pip.png" alt="Pip"><h3>You’re in the right place.</h3></div><div class="card"><h3>Start with ${META[tool][0]}.</h3><p>${tool === "stops" ? "See your exit on the same chart as your entry." : tool === "screener" ? "Explore the sample movers, then open a chart." : "Open a setup and see its shape on a chart."} Every other tool is still one tap away.</p></div>${nav(tool, "Let’s explore", "app-button full")}${btn("Retake the introduction", "quiz-reset", "", "app-button secondary full")}`;
  }
  const [q, choices] = questions[s.quizStep];
  return `<div class="onboarding-progress">${questions.map((_, i) => `<span class="${i <= s.quizStep ? "done" : ""}"></span>`).join("")}</div><p class="app-kicker">A friendly introduction · ${s.quizStep + 1} of 3</p><h3 class="onboarding-question">${q}</h3>${choices.map((c, i) => btn(c, "quiz-answer", `data-value="${i}"`, "choice")).join("")}${nav("home", "Skip and explore", "app-link")}`;
}
export function renderView(s) {
  if (s.detail === "chart")
    return `<div class="chart-expanded"><h3>${s.symbol} · ${s.timeframe}</h3>${chart(true)}<div class="app-notice">Drag to pan. Pinch or use +/− to zoom. Arrow keys pan; +/− keys zoom. Reset brings you back to the latest sample candles.</div></div>`;
  const views = {
    home,
    stream,
    aplus,
    macd,
    patterns,
    screener,
    stops,
    earnings: (s) => calendar(s, "earnings"),
    economy: (s) => calendar(s, "economy"),
    live,
    chat,
    assistant,
    profile,
    onboarding,
    menu: (s) =>
      SCREENS.map(
        ([id, t, d, i]) =>
          `<button class="list-row" data-screen="${id}">${icon(i)}<span class="grow"><strong>${t}</strong><small>${d}</small></span>${icon("next")}</button>`,
      ).join(""),
  };
  return (views[s.screen] || home)(s);
}
