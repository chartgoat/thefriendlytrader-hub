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
// Curated fictional sessions. Entry, stop, targets, candles and Wins all use
// these same records. They are interface examples, never production results.
export const DEMO_TRADES = {
  NVDA: {entry:181.20, stop:179.70, current:188.10, peak:188.80, side:"long", state:"hit", at:"9:35 AM", hitAt:"10:06 AM", open:160.00},
  AAPL: {entry:228.40, stop:226.90, current:234.85, peak:235.10, side:"long", state:"hit", at:"9:40 AM", hitAt:"10:14 AM", open:221.80},
  MSFT: {entry:424.80, stop:427.20, current:416.10, peak:414.90, side:"short", state:"hit", at:"9:45 AM", hitAt:"10:20 AM", open:432.30},
  TSLA: {entry:331.40, stop:327.80, current:340.75, peak:342.95, side:"long", state:"hit", at:"9:50 AM", hitAt:"10:31 AM", open:310.25},
  META: {entry:610.50, stop:605.80, current:618.20, peak:619.40, side:"long", state:"moving", at:"10:00 AM", open:596.10},
  AMZN: {entry:220.50, stop:218.90, current:221.90, peak:222.35, side:"long", state:"moving", at:"10:15 AM", open:217.30},
  GOOGL: {entry:208.60, stop:207.60, current:207.20, peak:209.50, side:"long", state:"invalidated", at:"9:55 AM", open:206.50},
  SPY: {entry:559.80, stop:558.60, current:562.80, peak:563.40, side:"long", state:"hit", at:"9:40 AM", hitAt:"10:25 AM", open:555.90},
};
export const BASE = Object.fromEntries(Object.entries(DEMO_TRADES).map(([symbol, trade]) => [symbol, trade.current]));
export function storyPlan(symbol="NVDA") {
  const t=DEMO_TRADES[symbol] || DEMO_TRADES.NVDA;
  const sign=t.side==="long"?1:-1, risk=Math.abs(t.entry-t.stop);
  return {...t, risk, target:t.entry+sign*risk*2.5, target2:t.entry+sign*risk*4, target3:t.entry+sign*risk*5.5, rr:2.5, progress:sign*(t.current-t.entry), best:sign*(t.peak-t.entry)};
}
export function scenarioPlan(symbol="NVDA", direction="long") {
  const p=storyPlan(symbol);
  if(p.side===direction) return p;
  const sign=direction==="long"?1:-1, entry=BASE[symbol]+sign*p.risk*.5;
  return {...p,side:direction,state:"watching",entry,stop:entry-sign*p.risk,target:entry+sign*p.risk*2.5,target2:entry+sign*p.risk*4,target3:entry+sign*p.risk*5.5,progress:sign*(p.current-entry),best:0};
}
export function activePlan(state) {
  if(["macd","patterns","screener"].includes(state.screen)) return storyPlan(state.symbol);
  if(state.screen==="aplus") return scenarioPlan(state.symbol,state.direction);
  return plan(state.symbol,state.direction,state.mode);
}
export function demoProfit(symbol, quantity, exit=BASE[symbol]) {
  const p=storyPlan(symbol);
  return Math.round((exit-p.entry)*(p.side==="long"?1:-1)*quantity*100)/100;
}
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
  ["live", "Live calendar", "Learn alongside the community", "play"],
  ["chat", "Chat", "Talk it through", "chat"],
  ["assistant", "Pip", "A little help on every screen", "pip"],
  ["profile", "Your profile", "Make yourself at home", "person"],
  ["onboarding", "Find your starting point", "A short introduction", "spark"],
];
export const price = (n) => "$" + Number(n).toFixed(2);
export function candles(symbol="NVDA", timeframe="15m") {
  const t=storyPlan(symbol), sign=t.side==="long"?1:-1;
  let seed=Array.from(symbol+timeframe).reduce((a,c)=>a+c.charCodeAt(0),0);
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const anchors=[[0,t.entry-sign*t.risk*1.7],[25,t.entry-sign*t.risk*.3],[38,t.entry],[57,t.entry+sign*t.best*.23],[76,t.entry+sign*t.best*.65],[99,t.peak],[119,t.current]];
  let last=anchors[0][1];
  return Array.from({length:120},(_,i)=>{
    let k=0;while(k<anchors.length-2 && i>anchors[k+1][0])k++;
    const [x0,y0]=anchors[k],[x1,y1]=anchors[k+1];
    const interpolated=y0+(y1-y0)*(i-x0)/(x1-x0);
    const rawClose=i===119?t.current:i===38?t.entry:i===99?t.peak:interpolated+(random()-.5)*t.risk*.32;
    const close=sign===1?Math.min(t.peak,rawClose):Math.max(t.peak,rawClose);
    const open=last;last=close;
    return {time:i,open,close,high:sign===1?Math.min(t.peak,Math.max(open,close)+random()*t.risk*.12):Math.max(open,close)+random()*t.risk*.12,low:sign===-1?Math.max(t.peak,Math.min(open,close)-random()*t.risk*.12):Math.min(open,close)-random()*t.risk*.12,volume:Math.round(220000+random()*2400000)};
  });
}
export function plan(symbol = "NVDA", direction = "long", mode = "swing") {
  // Size the example against the same cent prices shown on the chart.
  const entryCents = Math.round((BASE[symbol] ?? BASE.NVDA) * 100),
    riskCents = Math.max(1, Math.round(entryCents * (mode === "scalp" ? 0.006 : 0.018))),
    entry = entryCents / 100, risk = riskCents / 100,
    sign = direction === "long" ? 1 : -1;
  const target = (entryCents + sign * Math.round(riskCents * 2.5)) / 100;
  return {
    entry,
    stop: (entryCents - sign * riskCents) / 100,
    target,
    target2: (entryCents + sign * riskCents * 4) / 100,
    target3: (entryCents + sign * Math.round(riskCents * 5.5)) / 100,
    risk,
    rr: Math.abs(target - entry) / risk,
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
    platform: "ios",
    macSection: "home",
    macSidebarCollapsed: false,
    macMenuOpen: false,
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
    savedMessages: [],
    showChatSearch:false,
    drafts: {},
    reactions: [],
    reminders: [],
    name: "Alex",
    avatar: "A",
    dark: false,
    notifications: true,
    quick: ["macd", "patterns", "screener", "stops", "aplus", "chat"],
    riskBudget: 250,
    horizon: "Day trades",
    calendarTab: "This week",
    profileAppearance: "Light",
    expandedBoards: [],
    wins: [],
    winKind: "Trade win",
    quizStage: "welcome",
    quizNode: "q1",
    quizResult: null,
    menuFor: null,
    quizStep: 0,
    quizAnswers: [],
    persona: null,
  };
}
export { FILM as TOUR } from "./film-script.mjs";
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
      "calendarTab",
      "horizon",
      "menuFor",
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
