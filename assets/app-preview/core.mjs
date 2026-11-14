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
  AMD: "Advanced Micro Devices",
  PLTR: "Palantir",
};
// Curated fictional sessions. Entry, stop, targets and candles all use these same records on every screen.
// They are interface examples, never production results.
export const DEMO_TRADES = {
  NVDA: {entry:181.20, stop:179.70, current:188.10, peak:188.80, side:"long", state:"hit", at:"9:35 AM", hitAt:"10:06 AM", open:160.00},
  AAPL: {entry:228.40, stop:226.90, current:234.85, peak:235.10, side:"long", state:"hit", at:"9:40 AM", hitAt:"10:14 AM", open:221.80},
  MSFT: {entry:424.80, stop:427.20, current:416.10, peak:414.90, side:"short", state:"hit", at:"9:45 AM", hitAt:"10:20 AM", open:432.30},
  TSLA: {entry:331.40, stop:327.80, current:340.75, peak:342.95, side:"long", state:"hit", at:"9:50 AM", hitAt:"10:31 AM", open:310.25},
  META: {entry:610.50, stop:605.80, current:618.20, peak:619.40, side:"long", state:"moving", at:"10:00 AM", open:596.10},
  AMZN: {entry:220.50, stop:218.90, current:221.90, peak:222.35, side:"long", state:"moving", at:"10:15 AM", open:217.30},
  GOOGL: {entry:208.60, stop:207.60, current:207.20, peak:209.50, side:"long", state:"invalidated", at:"9:55 AM", open:206.50},
  SPY: {entry:559.80, stop:558.60, current:562.80, peak:563.40, side:"long", state:"hit", at:"9:40 AM", hitAt:"10:25 AM", open:555.90},
  // Patterns' live stages. AMD ran, came back to its line and held. PLTR just closed through its line, and its peak is that candle's high.
  AMD: {entry:142.00, stop:139.60, current:142.25, peak:146.80, side:"long", state:"moving", at:"10:05 AM", open:136.40},
  PLTR: {entry:88.40, stop:86.90, current:88.95, peak:89.30, side:"long", state:"moving", at:"10:10 AM", open:85.20, anchors:[[0,85.10],[60,87.30],[116,87.95],[118,88.15],[119,88.95]]},
};
export const BASE = Object.fromEntries(Object.entries(DEMO_TRADES).map(([symbol, trade]) => [symbol, trade.current]));
export function storyPlan(symbol="NVDA") {
  const t=DEMO_TRADES[symbol] || DEMO_TRADES.NVDA;
  const sign=t.side==="long"?1:-1, risk=Math.abs(t.entry-t.stop);
  return {...t, risk, target:t.entry+sign*risk*2.5, target2:t.entry+sign*risk*4, target3:t.entry+sign*risk*5.5, rr:2.5, progress:sign*(t.current-t.entry), best:sign*(t.peak-t.entry)};
}
export function activePlan(state) {
  if(["macd","patterns","screener","aplus"].includes(state.screen)) return storyPlan(state.symbol);
  return plan(state.symbol,state.direction,state.mode);
}
// The lines a setup still has on Patterns, as in the app: after the measured move nothing fails it, and a failed setup has no move left.
export function patternLevels(status,p) {
  return ({
    Formed:[[p.target,"Move"],[p.peak,"Confirm"],[p.entry,"Line"],[p.stop,"Fail"]],
    Confirmed:[[p.target,"Move"],[p.entry,"Entry"],[p.stop,"Fail"]],
    Retest:[[p.target,"Move"],[p.entry,"Retest"],[p.stop,"Fail"]],
    "Measured move":[[p.target,"Move"],[p.entry,"Entry"]],
    Failed:[[p.entry,"Entry"],[p.stop,"Fail"]],
  })[status]||[];
}
// Mirrors the app's live tool switches (the tool-switches function, read 2026-11-13: A+ Scalps, Screener, Big Money and
// Pip Brain are on; the older course, the old MACD and the New Screener are off and have no screen here).
// A tool the owner turns off goes in this list: it leaves Home, the quick menu and every route.
export const HIDDEN_TOOLS = [];
// id, the door's name, the quick menu's word, its mark. Home's order is in native.mjs, as the owner published it.
export const SCREENS = [
  ["home", "Home", "Home", "home"],
  ["stream", "Today", "Today", "clock"],
  ["earnings", "Earnings", "Earnings", "calendar"],
  ["stops", "Stop Finder", "Stops", "stop"],
  ["economy", "Economy", "Economy", "globe"],
  ["aplus", "A+ Scalps", "A+ Scalps", "bolt"],
  ["macd", "MACD", "MACD", "trend"],
  ["patterns", "Patterns", "Patterns", "pulse"],
  ["bigmoney", "Big Money", "Big Money", "columns"],
  ["pipbrain", "Pip Brain", "Pip Brain", "brain"],
  ["screener", "Screener", "Screener", "list"],
  ["course", "Options Course", "Course", "map"],
  ["coaching", "Coaching", "Coaching", "people"],
  ["chat", "Chat", "Chat", "chat"],
  ["live", "Live calendar", "Live", "live"],
  ["assistant", "Pip", "Pip", "pip"],
  ["profile", "Settings", "Settings", "person"],
  ["quick", "Quick menu", "Quick menu", "menu"],
  ["welcome", "Welcome", "Welcome", "spark"],
];
// The quick menu, as a member first has it, and what may go in it.
export const QUICK_DEFAULT = ["macd", "patterns", "screener", "stops", "aplus", "chat"];
export const QUICK_CHOICES = ["macd", "patterns", "screener", "stops", "aplus", "chat", "earnings", "economy", "stream"];
// The preview's day is a sample Tuesday at 10:42 AM ET: the Tuesday of the week (from its Sunday) it is opened in, so dates never look old.
export function sampleDay(offset = 0, from = new Date()) {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() - from.getDay() + 2 + offset);
  return { date: d, weekday: d.toLocaleDateString("en-US", { weekday: "long" }), short: d.toLocaleDateString("en-US", { weekday: "short" }),
    month: d.toLocaleDateString("en-US", { month: "short" }), monthLong: d.toLocaleDateString("en-US", { month: "long" }), day: d.getDate(), year: d.getFullYear() };
}
export const price = (n) => "$" + Number(n).toFixed(2);
export function candles(symbol="NVDA", timeframe="15m") {
  const t=storyPlan(symbol), sign=t.side==="long"?1:-1;
  let seed=Array.from(symbol+timeframe).reduce((a,c)=>a+c.charCodeAt(0),0);
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const anchors=t.anchors||[[0,t.entry-sign*t.risk*1.7],[25,t.entry-sign*t.risk*.3],[38,t.entry],[57,t.entry+sign*t.best*.23],[76,t.entry+sign*t.best*.65],[99,t.peak],[119,t.current]];
  let last=anchors[0][1];
  return Array.from({length:120},(_,i)=>{
    let k=0;while(k<anchors.length-2 && i>anchors[k+1][0])k++;
    const [x0,y0]=anchors[k],[x1,y1]=anchors[k+1];
    const interpolated=y0+(y1-y0)*(i-x0)/(x1-x0);
    const rawClose=i===119?t.current:!t.anchors&&i===38?t.entry:!t.anchors&&i===99?t.peak:interpolated+(random()-.5)*t.risk*.32;
    const close=sign===1?Math.min(t.peak,rawClose):Math.max(t.peak,rawClose);
    const open=last;last=close;
    return {time:i,open,close,high:t.anchors&&i===119?t.peak:sign===1?Math.min(t.peak,Math.max(open,close)+random()*t.risk*.12):Math.max(open,close)+random()*t.risk*.12,low:sign===-1?Math.max(t.peak,Math.min(open,close)-random()*t.risk*.12):Math.min(open,close)-random()*t.risk*.12,volume:Math.round(220000+random()*2400000)};
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
export function createState() {
  return {
    screen: "home",
    detail: null,
    symbol: "NVDA",
    timeframe: "15m",
    direction: "long",
    mode: "swing",
    scenario: "Breakout",
    patternBoard: "Recent",
    patternFrame: "Daily",
    calendarTab: "This week",
    macdFrame: "1 min",
    oiSide: "Calls",
    moneyTab: "Latest",
    room: "Trading Floor",
    thread: null,
    search: "",
    chart: { offset: 0, count: 42 },
    plans: [],
    messages: [],
    savedMessages: [],
    showChatSearch: false,
    chatRead: false,
    drafts: {},
    reactions: [],
    dark: false,
    theme: "Light",
    quick: [...QUICK_DEFAULT],
    expandedBoards: [],
    wins: [],
    winKind: "Followed my plan",
    courseLevel: null,
    lessonStep: 0,
    coachSpan: 14,
  };
}
// What Back returns to: where the visitor was, never what they made (messages, plans, the quick menu, the theme).
const PLACE = ["screen", "detail", "symbol", "timeframe", "direction", "mode", "scenario", "room", "chart", "event", "thread", "member",
  "patternBoard", "patternFrame", "calendarTab", "macdFrame", "oiSide", "moneyTab", "assistantContext", "courseLevel", "lessonStep",
  "coachDay", "coachTopic", "bookCoach", "bookTime", "openRow"];
export function placeOf(state) {
  return Object.fromEntries(PLACE.map((k) => [k, structuredClone(state[k])]));
}
export function returnTo(state, place) {
  Object.assign(state, structuredClone(place));
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
