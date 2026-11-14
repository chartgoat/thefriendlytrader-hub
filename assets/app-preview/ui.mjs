// Shared pieces of the preview: marks, buttons and the sample records every screen reads.
// Every person, message, price and event here is made up for the preview.
import { escapeHTML as esc } from "./core.mjs";
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
  house: "M3 11 12 3l9 8v10h-6v-6H9v6H3Z",
  envelope: "M3 5h18v14H3ZM3 6l9 7 9-7",
  help: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.500 9.300a2.600 2.600 0 1 1 3.900 2.200c-.900.600-1.400 1.100-1.400 2.100M12 17.200v.100",
  gear: "M12 15.500a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7ZM19 12l2-1.500-2-3.500-2.400 1a7 7 0 0 0-1.700-1L14.500 4.500h-5L9.100 7a7 7 0 0 0-1.700 1L5 7 3 10.500 5 12l-2 1.500L5 17l2.400-1a7 7 0 0 0 1.700 1l.400 2.500h5l.400-2.500a7 7 0 0 0 1.700-1l2.400 1 2-3.500Z",
  moon: "M20 14.500A8.500 8.500 0 0 1 9.500 4 8.500 8.500 0 1 0 20 14.500Z",
  phone: "M7 2h10v20H7ZM11 18.500h2",
  signout: "M14 4h5v16h-5M4 12h11m-4-4 4 4-4 4",
  lock: "M6 11h12v10H6ZM8.500 11V7.500a3.500 3.500 0 0 1 7 0V11",
  plus: "M12 5v14M5 12h14",
  camera: "M3 8h4l2-3h6l2 3h4v11H3ZM12 16.500a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7Z",
  arrowup: "M12 20V5m-6 6 6-6 6 6",
  brain: "M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 0V7a3 3 0 0 0-3-3ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 0M9 10H7M15 14h2",
  columns: "M3 21h18M4 10h16M12 3l9 5H3ZM6 10v8M10 10v8M14 10v8M18 10v8",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2ZM9 4v14M15 6v14",
  pip: "M5 7h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3ZM7 12h1M16 12h1M8 16q4 4 8 0M7 4V2M12 4V1M17 4V0",
};
export const icon = (name, cls = "") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.spark}"/></svg>`;
export const btn = (text, action, extra = "", cls = "app-button") =>
  `<button class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
export const nav = (screen, text, cls = "app-link") =>
  `<button class="${cls}" data-screen="${screen}">${text}</button>`;
export const META = {
  home: ["Home"], stream: ["Today"], aplus: ["A+ Scalps"], macd: ["MACD"], patterns: ["Patterns"], screener: ["Screener"],
  stops: ["Stop Finder"], earnings: ["Earnings"], economy: ["Economy"], bigmoney: ["Big Money"], pipbrain: ["Pip Brain"],
  course: ["Options Course"], coaching: ["Coaching"], live: ["Live calendar"], chat: ["Chat"], assistant: ["Pip"],
  profile: ["Settings"], quick: ["Quick menu"], welcome: ["Welcome"],
};
export const fixtures = {
  patterns: [
    {
      symbol: "NVDA", name: "Symmetrical Triangle", status: "Measured move", bias: "Bullish", recent: true,
      text: "Closed above the triangle, confirmed, and reached its measured move.",
    },
    {
      symbol: "PLTR", name: "Double Bottom", status: "Formed", bias: "Bullish", recent: true,
      text: "Formed. Awaiting a retest and a close above $89.30 to confirm.",
    },
    {
      symbol: "META", name: "Falling Wedge", status: "Confirmed", bias: "Bullish", recent: true,
      text: "A second close above the wedge confirmed the break. The measured move is still ahead.",
    },
    {
      symbol: "AMD", name: "Ascending Channel", status: "Retest", bias: "Bullish", recent: true,
      text: "Came back to the channel line and held. The measured move is still ahead.",
    },
    {
      symbol: "GOOGL", name: "Bull Flag", status: "Failed", bias: "Bullish",
      text: "A close below the fail price ended this one. A failed setup stays on the record.",
    },
    {
      symbol: "AAPL", name: "Bull Flag", status: "Measured move", bias: "Bullish", frame: "Weekly", recent: true,
      text: "Closed above the flag, confirmed, and reached its measured move.",
    },
    {
      symbol: "MSFT", name: "Evening Star", status: "Measured move", bias: "Bearish", candle: true, frame: "Monthly", recent: true,
      text: "The evening star closed, the next close confirmed it, and it reached its measured move.",
    },
    {
      symbol: "TSLA", name: "Inverse Head & Shoulders", status: "Measured move", bias: "Bullish", frame: "Weekly",
      text: "Closed above the neckline, confirmed, and reached its measured move.",
    },
  ],
  // day: 0 is the sample week's Monday; the preview's day is its Tuesday.
  events: [
    { id: "earn-0", day: 0, symbol: "GOOGL", title: "Alphabet", session: "After close", out: "4:05 PM ET", actual: "$2.12", expected: "$2.05" },
    { id: "earn-1", day: 1, symbol: "AAPL", title: "Apple", session: "After close", actual: "Pending", expected: "$1.55", major: true },
    { id: "earn-2", day: 2, symbol: "NVDA", title: "NVIDIA", session: "After close", actual: "Pending", expected: "$0.94" },
    { id: "earn-3", day: 3, symbol: "MSFT", title: "Microsoft", session: "After close", actual: "Pending", expected: "$3.18" },
    { id: "earn-4", day: 4, symbol: "AMZN", title: "Amazon", session: "Before open", actual: "Pending", expected: "$1.25" },
  ],
  economy: [
    { id: "econ-1", day: 1, title: "CPI Inflation Report", short: "CPI", time: "8:30 AM ET", minute: 510, actual: "2.8%", expected: "2.9%", last: "3.0%", spy: "+0.54%" },
    { id: "econ-3", day: 3, title: "Jobless Claims", short: "Claims", time: "8:30 AM ET", minute: 510, actual: "Upcoming", expected: "225K", last: "221K" },
    { id: "econ-4", day: 4, title: "PPI Wholesale Inflation", short: "PPI", time: "8:30 AM ET", minute: 510, actual: "Upcoming", expected: "0.2%", last: "0.3%" },
  ],
  // The app's six rooms, in its order, each with the line the app shows under a room nobody has posted in. The pictures are
  // from the app's own set; which room wears which is the staff's choice in the app and is not copied here.
  rooms: [
    ["Trading Floor", "Share ideas and ask questions", "floor"],
    ["Options Chat", "Calls, puts and options questions.", "bulb"],
    ["Dividend Chat", "Dividend stocks and income, with AirTuan.", "cash"],
    ["Asian Cafe", "With Ms. Mary and AirTuan.", "hands"],
    ["Girls Army vs. Wall Street", "Girls Army, taking on Wall Street.", "bull"],
    ["Wins", "A trade, a plan you kept, a lesson.", "wins"],
  ],
  messages: [
    { id: "m1", room: "Trading Floor", name: "Maya", avatar: "M", time: "10:32 AM", text: "Watching NVDA at the upper level. Waiting for the candle to close before I make a plan.", replies: 2 },
    { id: "m2", room: "Trading Floor", name: "Theo", avatar: "T", time: "10:35 AM", text: "That’s what I like about seeing the stop on the chart. I know where the idea stops making sense.", replies: 1 },
    { id: "m3", room: "Trading Floor", name: "Sam", avatar: "S", time: "10:39 AM", text: "Reminder to check the calendar too. CPI was out this morning.", replies: 0 },
    { id: "m4", room: "Options Chat", name: "Jordan", avatar: "J", time: "10:21 AM", text: "Still learning what a strike is. The course's third level helped.", replies: 0 },
  ],
};
export function messageHTML(m, s, thread = false) {
  const mine = m.name === "You";
  return `<article class="message"><span class="avatar" aria-hidden="true">${esc(m.avatar)}</span><div class="message-body"><div class="message-meta"><strong>${esc(m.name)}</strong><time>${m.time}</time></div><p>${esc(m.text)}</p><div class="message-actions">${btn(`${s.reactions.includes(m.id) ? "♥ 1" : "♡"}`, "reaction", `data-id="${m.id}" aria-label="React to message by ${esc(m.name)}" aria-pressed="${s.reactions.includes(m.id)}"`, "")}${btn(s.savedMessages.includes(m.id) ? "Saved" : "Save", "save-message", `data-id="${m.id}" aria-pressed="${s.savedMessages.includes(m.id)}"`, "")}${thread || mine ? "" : btn(`${(m.replies || 0) + s.messages.filter((x) => x.parent === m.id).length} replies`, "thread", `data-id="${m.id}"`, "")}</div></div></article>`;
}
