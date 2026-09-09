// All numbers and people in this module are synthetic. No production data is imported.
export const SYMBOLS = [
  "NVDA",
  "AAPL",
  "MSFT",
  "TSLA",
  "META",
  "AMZN",
  "GOOGL",
  "SPY",
];
export const NAMES = {
  NVDA: "NVIDIA",
  AAPL: "Apple",
  MSFT: "Microsoft",
  TSLA: "Tesla",
  META: "Meta Platforms",
  AMZN: "Amazon",
  GOOGL: "Alphabet",
  SPY: "S&P 500 ETF",
};
export const BASE = {
  NVDA: 176.35,
  AAPL: 232.14,
  MSFT: 418.6,
  TSLA: 338.75,
  META: 618.2,
  AMZN: 221.9,
  GOOGL: 205.42,
  SPY: 562.8,
};
export const SCREENS = [
  ["home", "Home", "Your daily starting point", "home"],
  ["stream", "Today", "The day, at a glance", "clock"],
  ["aplus", "A+ Scalps", "Levels and confirmed breaks", "bolt"],
  ["macd", "MACD", "Read the momentum", "trend"],
  ["patterns", "Patterns", "See what is taking shape", "pulse"],
  ["screener", "Screener", "Find the day’s movers", "list"],
  ["stops", "Stop Finder", "Put your exit on the chart", "stop"],
  ["earnings", "Earnings", "Know who is reporting", "calendar"],
  ["economy", "Economy", "Follow the bigger picture", "globe"],
  ["live", "Sessions", "Learn alongside the community", "play"],
  ["chat", "Chat", "Talk it through", "chat"],
  ["assistant", "Pip", "A little help on every screen", "pip"],
  ["profile", "Your profile", "Make yourself at home", "person"],
  ["onboarding", "Find your starting point", "A short introduction", "spark"],
];
export const price = (n) => "$" + Number(n).toFixed(2);
export function candles(symbol = "NVDA", timeframe = "15m") {
  const base = BASE[symbol] ?? BASE.NVDA;
  let seed = Array.from(symbol + timeframe).reduce(
    (a, c) => a + c.charCodeAt(0),
    0,
  );
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  let last = base * 0.975;
  const bars = Array.from({ length: 120 }, (_, i) => {
    const open = last;
    const wave = Math.sin(i / 6) * base * 0.00055;
    const close = open + (random() - 0.43) * base * 0.003 + wave;
    last = close;
    return {
      time: i,
      open,
      close,
      high: Math.max(open, close) + random() * base * 0.0018,
      low: Math.min(open, close) - random() * base * 0.0018,
      volume: Math.round(100000 + random() * 1600000),
    };
  });
  const shift = base - bars.at(-1).close;
  return bars.map((b) => ({
    ...b,
    open: b.open + shift,
    high: b.high + shift,
    low: b.low + shift,
    close: b.close + shift,
  }));
}
export function plan(symbol = "NVDA", direction = "long", mode = "swing") {
  const entry = BASE[symbol] ?? BASE.NVDA,
    risk = entry * (mode === "scalp" ? 0.006 : 0.018),
    sign = direction === "long" ? 1 : -1;
  return {
    entry,
    stop: entry - sign * risk,
    target: entry + sign * risk * 2,
    target2: entry + sign * risk * 3,
    risk,
    rr: 2,
  };
}
export function positionSize(budget, risk) {
  return Number.isFinite(budget) && budget > 0 && risk > 0
    ? Math.floor(budget / risk)
    : 0;
}
export function createState() {
  return {
    screen: "home",
    detail: null,
    symbol: "NVDA",
    timeframe: "15m",
    direction: "long",
    mode: "swing",
    scenario: "Breakout",
    session: "Morning",
    patternFilter: "All",
    screenerBoard: "Overnight gappers",
    sort: "move",
    week: 0,
    room: "Trading Floor",
    thread: null,
    search: "",
    chart: { offset: 0, count: 42 },
    watchlist: ["NVDA", "AAPL"],
    alerts: [],
    plans: [],
    messages: [],
    drafts: {},
    reactions: [],
    reminders: [],
    name: "Alex",
    avatar: "A",
    dark: false,
    notifications: true,
    quick: ["macd", "patterns", "screener", "stops", "aplus", "chat"],
    riskBudget: 100,
    quizStep: 0,
    quizAnswers: [],
    persona: null,
  };
}
export const TOUR = [
  {
    screen: "home",
    title: "Make yourself at home",
    text: "Five trading tools, your calendars and your community. Tap anything to take over.",
  },
  {
    screen: "stream",
    title: "Catch up with Today",
    text: "Pip brings the day’s market moments into one easy-to-follow stream.",
  },
  {
    screen: "aplus",
    title: "Find a setup",
    text: "A+ Scalps puts the levels and their current state together. These are simulated examples.",
  },
  {
    screen: "aplus",
    detail: "setup",
    title: "Look inside the plan",
    text: "Open the chart, inspect the candles and choose the scenario you want to watch.",
  },
  {
    screen: "stops",
    title: "Plan the exit",
    text: "Switch long or short, explore the stop and targets, and size a sample position.",
  },
  {
    screen: "macd",
    title: "Read the momentum",
    text: "Explore the board, change the timeframe and save a ticker to your watchlist.",
  },
  {
    screen: "patterns",
    title: "See what is forming",
    text: "Browse forming, confirmed and failed examples, then open a pattern’s chart.",
  },
  {
    screen: "patterns",
    detail: "pattern",
    title: "Understand the structure",
    text: "Pan and zoom the candles. The chart and its explanation stay together.",
  },
  {
    screen: "screener",
    title: "Explore the movers",
    text: "Open a board, sort its sample stocks and take a closer look at a ticker.",
  },
  {
    screen: "earnings",
    title: "Know what is ahead",
    text: "Browse the week’s sample earnings and open an event for the details.",
  },
  {
    screen: "economy",
    title: "See the bigger picture",
    text: "Economic releases sit in their own calendar, with the terms explained simply.",
  },
  {
    screen: "live",
    title: "Make time to learn",
    text: "Browse sessions and save a demo reminder. Nothing leaves this preview.",
  },
  {
    screen: "chat",
    title: "Find your community",
    text: "Explore rooms, open threads and write a demo message. Every person here is fictional.",
  },
  {
    screen: "assistant",
    title: "Ask Pip",
    text: "Try a suggested question for a contextual explanation. Demo answers are prewritten.",
  },
  {
    screen: "profile",
    title: "Make it yours",
    text: "Try dark mode, edit your demo profile and choose your quick-menu shortcuts.",
  },
  {
    screen: "home",
    title: "Your turn",
    text: "You have the whole preview. Explore any screen, replay the tour or check iPhone access.",
  },
];
export function tourPosition(state) {
  return Object.fromEntries(
    [
      "screen",
      "detail",
      "symbol",
      "timeframe",
      "direction",
      "mode",
      "scenario",
      "session",
      "room",
      "chart",
      "week",
      "event",
      "day",
      "thread",
      "member",
      "slide",
      "screenerBoard",
      "sort",
      "patternFilter",
      "patternTab",
      "streamFilter",
    ].map((k) => [k, structuredClone(state[k])]),
  );
}
export function restoreTour(state, snapshot) {
  Object.assign(state, structuredClone(snapshot));
  return state;
}
export function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
