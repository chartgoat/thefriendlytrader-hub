import { createState, SCREENS, SYMBOLS, HIDDEN_TOOLS, QUICK_DEFAULT, placeOf, returnTo, storyPlan } from "./core.mjs";
import { META, fixtures } from "./ui.mjs";
import { renderNativeView, nativeHeader, nativeIcon as icon, sheetStyle, coverStyle } from "./native.mjs";
import { attachChart } from "./chart.mjs";

// The working preview: one sample member's iPhone, kept in memory. It calls no service and stores nothing.
let state = createState(),
  history = [],
  chartHandle = null,
  toastTimer = null,
  focusBeforeOpen = null;
const root = document.querySelector("#app-root"),
  phone = document.querySelector("#phone"),
  stage = document.querySelector("#preview-stage"),
  side = document.querySelector("#preview-side");

function toast(text) {
  const el = document.querySelector("#app-toast");
  el.textContent = text;
  el.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("visible"), 3200);
}
function render({ keepScroll = false } = {}) {
  chartHandle?.destroy?.();
  const scroll = keepScroll ? root.querySelector(".app-content")?.scrollTop || 0 : 0;
  const sheet = sheetStyle(state), cover = coverStyle(state), inRoom = state.screen === "chat" && ["room", "thread"].includes(state.detail);
  phone.classList.toggle("dark", state.dark);
  phone.classList.add("native");
  root.classList.toggle("native-sheet", sheet);
  root.dataset.view = state.screen;
  root.dataset.detail = state.detail || "";
  const bar = sheet || cover || inRoom ? "" : `<nav class="app-nav" aria-label="Quick menu">${state.quick.filter((id) => !HIDDEN_TOOLS.includes(id)).map((id) => {
    const [, , word, mark] = SCREENS.find((x) => x[0] === id);
    return `<button class="${state.screen === id ? "active" : ""}" data-screen="${id}" ${state.screen === id ? 'aria-current="page"' : ""}>${icon(mark)}<span>${word}</span></button>`;
  }).join("")}</nav>`;
  root.innerHTML = `${nativeHeader(state)}<div class="app-content ${state.screen === "home" ? "home-content" : ""}" data-screen-content="${state.screen}">${renderNativeView(state)}</div>${bar}`;
  root.querySelector(".app-content").scrollTop = scroll;
  const day = root.querySelector(".n-day.selected");
  if (day && !keepScroll) day.parentElement.scrollLeft = day.offsetLeft - 16;
  chartHandle = attachChart(root.querySelector(".candlestick-chart"), state, () => {}, (level) => {
    state.levelInfo = state.levelInfo === level ? null : level;
    render({ keepScroll: true });
  });
}
function go(screen, detail = null, extra = {}) {
  // A switched-off tool opens Home, as it does in the app.
  if (HIDDEN_TOOLS.includes(screen)) { screen = "home"; detail = null; extra = {}; }
  if (!META[screen]) return;
  document.querySelector("#app-toast").classList.remove("visible");
  history.push(placeOf(state));
  if (history.length > 50) history.shift();
  Object.assign(state, { screen, detail, search: "", levelInfo: null, lookup: null, rules: false, coachMenu: false, showChatSearch: false }, extra);
  if (screen === "patterns" && detail === "pattern") state.timeframe = "1d";
  if (screen === "assistant" && !extra.assistantContext) state.assistantContext = "home";
  render();
}
function back() {
  if (history.length) {
    returnTo(state, history.pop());
    Object.assign(state, { search: "", levelInfo: null, coachMenu: false, showChatSearch: false });
    render();
  } else go(state.detail ? state.screen : "home");
}
function goHome() {
  history = [];
  Object.assign(state, { screen: "home", detail: null });
  render();
}
function openPreview(open = true) {
  const rest = document.querySelectorAll(".site-header,main>section:not(.g-preview)");
  document.body.classList.toggle("preview-open", open);
  rest.forEach((el) => (el.inert = open));
  if (open) {
    focusBeforeOpen = document.activeElement;
    stage.setAttribute("role", "dialog");
    stage.setAttribute("aria-modal", "true");
    stage.setAttribute("aria-label", "The app preview, with sample data");
    chartHandle?.draw();
    root.querySelector("button")?.focus();
  } else {
    for (const name of ["role", "aria-modal", "aria-label"]) stage.removeAttribute(name);
    focusBeforeOpen?.focus();
  }
}
// The one thing the preview asks of a visitor: back to the page's email box.
function earlyAccess() {
  openPreview(false);
  const box = document.querySelector("#early-email");
  box.scrollIntoView({ block: "center" });
  box.focus({ preventScroll: true });
}
function openSetup(symbol) {
  go("patterns", "pattern", { symbol, chart: { offset: 0, count: 42 }, direction: fixtures.patterns.find((p) => p.symbol === symbol)?.bias === "Bearish" ? "short" : "long" });
}
const ANSWERS = [
  [/which tool/, "Stop Finder shows where a stop and two targets could go for any stock. Patterns shows setups as they form and confirm. MACD shows a Buy or Sell call from the open. Earnings and Economy show what is coming up."],
  [/stop finder for/, "Stop Finder puts a stop and two targets on a stock's chart, so you can see your exit before you buy."],
  [/find a stop/, "Type any ticker in the search box. The chart shows its stop and its two targets."],
  [/long and short/, "Long plans a trade that wants the stock up, with the stop below. Short plans one that wants it down, with the stop above."],
  [/patterns for/, "Patterns shows a setup once it forms. Then it can confirm, retest, reach its measured move or fail."],
  [/macd for/, "MACD shows a Buy or Sell call from the 9:30 AM ET open for a short list of stocks. A call is information, not a promise."],
  [/a\+ scalps for/, "A+ Scalps posts the morning's lines for each ticker. A close through a line is the trade; a wick through it is nothing."],
  [/screener for/, "Screener shows the stocks making the day's biggest moves, on three boards."],
  [/earnings for/, "Earnings shows who reports this week, and what was expected."],
  [/economy for/, "Economy shows the week's reports that can move the market, with what was expected."],
  [/today for/, "Today is the day in one scroll: what is coming up, and what happened earlier."],
  [/big money for/, "Big Money shows what large funds bought and sold, from their public filings."],
  [/pip brain for/, "Pip Brain has two tools: Time Trend for the bigger price trend, and Open Interest Leaders for where option positions grew."],
  [/chat for/, "Chat is where members talk trades in rooms. In this preview every person and message is a sample."],
  [/stop|exit|risk/, "A stop is where you plan to get out if the trade goes against you. Decide it before you buy."],
];
function askPip(question) {
  const q = question.toLowerCase();
  state.pipQuestion = question;
  state.pipAnswer = ANSWERS.find(([test]) => test.test(q))?.[1] || "I have a few written answers in this preview. Try one of the questions above. In the app, Pip answers from what the page shows.";
  render({ keepScroll: true });
  root.querySelector(".pip-answer")?.scrollIntoView({ block: "nearest" });
}
const SETTERS = {
  stopMode: (v) => (state.mode = v.toLowerCase()),
  stopDirection: (v) => (state.direction = v.toLowerCase()),
  theme: (v) => { state.theme = v; state.dark = v === "Dark" || (v === "System" && matchMedia("(prefers-color-scheme: dark)").matches); },
};

// Holding the quick menu opens its editor, as in the app.
let hold = null, held = false, holdAt = null;
root.addEventListener("pointerdown", (e) => {
  if (!e.target.closest(".app-nav")) return;
  holdAt = { x: e.clientX, y: e.clientY };
  hold = setTimeout(() => { held = true; go("quick"); }, 450);
});
root.addEventListener("pointermove", (e) => { if (holdAt && Math.hypot(e.clientX - holdAt.x, e.clientY - holdAt.y) > 8) clearTimeout(hold); });
// The press that opened the editor must not also press what lands under the finger; the next press is the visitor's own.
["pointerup", "pointercancel"].forEach((type) => root.addEventListener(type, () => { clearTimeout(hold); holdAt = null; setTimeout(() => (held = false)); }));
root.addEventListener("click", (e) => { if (held) { held = false; e.stopImmediatePropagation(); } }, true);

root.addEventListener("click", (event) => {
  const b = event.target.closest("button");
  if (!b) return;
  if (b.dataset.screen) return b.dataset.screen === "home" ? goHome() : go(b.dataset.screen);
  const a = b.dataset.action, v = b.dataset.value, t = b.dataset.symbol;
  switch (a) {
    case "home":
      goHome();
      break;
    case "back":
    case "close":
      back();
      break;
    case "open-pip":
      go("assistant", null, { assistantContext: state.screen, pipAnswer: null, pipQuestion: null });
      break;
    case "open-profile":
      go("profile");
      break;
    case "help":
      go("profile", "support");
      break;
    case "announcements":
      go("chat", "room", { room: "Announcements" });
      break;
    case "native-detail":
      go(state.screen, v || null);
      break;
    case "profile-detail":
      go("profile", v);
      break;
    case "set":
      if (SETTERS[b.dataset.key]) SETTERS[b.dataset.key](v);
      else state[b.dataset.key] = v;
      render({ keepScroll: true });
      break;
    case "ticker":
      state.symbol = v;
      render({ keepScroll: true });
      break;
    case "remove-ticker":
      state.macdAdded = (state.macdAdded || []).filter((x) => x !== v);
      render({ keepScroll: true });
      break;
    case "aplus-detail":
      go("aplus", "setup", { symbol: t, scenario: "Breakout", direction: storyPlan(t).side, chart: { offset: 0, count: 42 } });
      break;
    case "play":
      go("screener", "play", { symbol: t, chart: { offset: 0, count: 60 } });
      break;
    case "pattern-detail":
      openSetup(t);
      break;
    case "to-stops":
      go("stops", null, { symbol: state.symbol });
      break;
    case "toggle-rules":
      state.rules = !state.rules;
      render({ keepScroll: true });
      break;
    case "clear-search":
      state.lookup = null;
      render();
      break;
    case "toggle-board":
      state.expandedBoards = state.expandedBoards.includes(v) ? state.expandedBoards.filter((x) => x !== v) : [...state.expandedBoards, v];
      render({ keepScroll: true });
      break;
    case "zoom-in":
      state.chart.count -= 6;
      chartHandle?.draw();
      break;
    case "zoom-out":
      state.chart.count += 6;
      chartHandle?.draw();
      break;
    case "expand-chart":
      go(state.screen, "chart");
      break;
    case "explain-level":
      state.levelInfo = state.levelInfo === v ? null : v;
      render({ keepScroll: true });
      break;
    case "save-plan": {
      const p = { symbol: state.symbol, direction: state.direction, mode: state.mode };
      if (!state.plans.some((x) => JSON.stringify(x) === JSON.stringify(p))) state.plans.push(p);
      render({ keepScroll: true });
      break;
    }
    case "load-plan":
      Object.assign(history.at(-1) || {}, state.plans[Number(b.dataset.index)], { chart: { offset: 0, count: 42 } });
      back();
      break;
    case "remove-plan":
      state.plans.splice(Number(b.dataset.index), 1);
      render({ keepScroll: true });
      break;
    case "event":
      go(state.screen, "event", { event: v });
      break;
    case "event-tool":
      if (v === "earnings") go("earnings");
      else go(v, null, SYMBOLS.includes(t) ? { symbol: t } : {});
      break;
    case "open-oi":
      go("pipbrain", "oi");
      break;
    case "time-trend":
      toast("Time Trend is in the app. This preview opens Open Interest Leaders.");
      break;
    case "station":
      go("course", "station", { courseLevel: Number(v) });
      break;
    case "play-level":
      if (Number(v) !== 1) return toast("This preview plays level 1. The other levels are in the app.");
      go("course", "lesson", { courseLevel: 1, lessonStep: 0 });
      state.lessonMiss = false;
      break;
    case "lesson-next":
      state.lessonStep = 1;
      render();
      break;
    case "lesson-answer":
      state.lessonMiss = v !== "up";
      if (v === "up") state.lessonStep = 2;
      render();
      break;
    case "lesson-finish":
      state.courseDone = Math.max(1, state.courseDone || 0);
      history = history.filter((place) => place.screen !== "course");
      Object.assign(state, { screen: "course", detail: null, courseLevel: null, lessonStep: 0 });
      history.push({ ...placeOf(state), screen: "home" });
      render();
      break;
    case "coach-day":
      state.coachDay = Number(v);
      render({ keepScroll: true });
      break;
    case "coach-more":
      state.coachSpan = 28;
      render({ keepScroll: true });
      break;
    case "coach-topic-menu":
      state.coachMenu = !state.coachMenu;
      render({ keepScroll: true });
      break;
    case "coach-topic":
      state.coachTopic = v;
      state.coachMenu = false;
      render();
      break;
    case "coach-time":
      go("coaching", "book", { bookCoach: b.dataset.coach, bookTime: Number(v), bookDay: Number(b.dataset.day) });
      break;
    case "pay":
      toast("Nothing is booked or charged in this preview. Members pay in the app.");
      break;
    case "room":
      go("chat", "room", { room: v });
      break;
    case "thread":
      go("chat", "thread", { thread: b.dataset.id });
      break;
    case "chat-search-toggle":
      state.showChatSearch = !state.showChatSearch;
      state.search = "";
      render();
      root.querySelector('[name="query"]')?.focus();
      break;
    case "chat-option":
      if (v === "mark-read") { state.chatRead = true; back(); }
      else if (v === "profile") go("profile");
      else if (v === "notifications") go("profile", "notifications");
      else go("chat", v);
      break;
    case "mark-read":
      state.chatRead = true;
      render({ keepScroll: true });
      break;
    case "compose-win":
      go("chat", "win-compose");
      break;
    case "reaction":
      state.reactions = state.reactions.includes(b.dataset.id) ? state.reactions.filter((x) => x !== b.dataset.id) : [...state.reactions, b.dataset.id];
      render({ keepScroll: true });
      break;
    case "save-message":
      state.savedMessages = state.savedMessages.includes(b.dataset.id) ? state.savedMessages.filter((x) => x !== b.dataset.id) : [...state.savedMessages, b.dataset.id];
      render({ keepScroll: true });
      break;
    case "ask-pip":
      askPip(v);
      break;
    case "notification-pref":
      state.notificationPrefs ??= {};
      state.notificationPrefs[v] = state.notificationPrefs[v] === false;
      render({ keepScroll: true });
      break;
    case "quick-toggle":
      if (state.quick.includes(v)) {
        if (state.quick.length <= 3) return toast("Pick 3 to 6.");
        state.quick = state.quick.filter((x) => x !== v);
      } else {
        if (state.quick.length >= 6) return toast("Pick 3 to 6.");
        state.quick.push(v);
      }
      state.quickChanged = true;
      render({ keepScroll: true });
      break;
    case "quick-up": {
      const i = state.quick.indexOf(v);
      if (i > 0) [state.quick[i - 1], state.quick[i]] = [state.quick[i], state.quick[i - 1]];
      state.quickChanged = true;
      render({ keepScroll: true });
      break;
    }
    case "quick-default":
      state.quick = [...QUICK_DEFAULT];
      state.quickChanged = false;
      render({ keepScroll: true });
      break;
    case "sign-out":
      history = [];
      Object.assign(state, { screen: "welcome", detail: null });
      render();
      break;
    case "sign-in":
      goHome();
      toast("Signed in as a sample member.");
      break;
    case "reset":
      state = createState();
      history = [];
      render();
      toast("The preview is back to how it started.");
      break;
  }
});
root.addEventListener("input", (e) => {
  if (e.target.name === "message" && e.target.form?.dataset.form === "message") state.drafts[state.detail === "thread" ? "thread:" + state.thread : state.room] = e.target.value;
});
root.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target, kind = form.dataset.form, data = new FormData(form), text = (name) => String(data.get(name) || "").trim();
  if (kind === "ticker" || kind === "add-ticker") {
    const t = text("symbol").toUpperCase();
    const samples = state.screen === "patterns" ? fixtures.patterns.map((p) => p.symbol) : SYMBOLS;
    if (!samples.includes(t)) return toast("The preview has these sample tickers: " + samples.join(", ") + ".");
    if (kind === "add-ticker") {
      const mine = state.macdAdded || [];
      if (t !== "SPY") return toast("Already on the board. SPY is the sample ticker to add.");
      if (!mine.includes(t)) state.macdAdded = [...mine, t].slice(0, 5);
      return render();
    }
    state.symbol = t;
    state.chart = { offset: 0, count: 42 };
    if (state.screen === "patterns") { state.lookup = t; render(); }
    else render();
  }
  if (kind === "win") {
    const note = text("note");
    if (!note) return;
    state.wins.unshift({ id: "win-" + Date.now(), name: "You", avatar: "Y", time: "10:42 AM", kind: state.winKind, note: note.slice(0, 500), cheers: 0 });
    history = history.filter((place) => place.detail !== "win-compose");
    back();
    toast("Shared in this preview only.");
  }
  if (kind === "message") {
    const body = text("message");
    if (!body) return;
    if (state.room === "Wins" && state.detail !== "thread") return toast("In Wins, share a win with the plus button, or cheer one.");
    state.messages.push({ id: "you-" + Date.now(), room: state.room, name: "You", avatar: "Y", time: "10:42 AM", text: body.slice(0, 1000), parent: state.detail === "thread" ? state.thread : null, replies: 0 });
    state.drafts[state.detail === "thread" ? "thread:" + state.thread : state.room] = "";
    render({ keepScroll: true });
    root.querySelector(".app-content").scrollTop = 99999;
    toast("Kept in this preview only. Nothing is posted.");
  }
  if (kind === "help") {
    const body = text("message");
    if (!body) return;
    state.helpMessages = [...(state.helpMessages || []), body.slice(0, 1000)];
    render();
  }
  if (kind === "chat-search") {
    state.search = text("query");
    render();
  }
  if (kind === "pip") {
    const q = text("question");
    if (q) askPip(q);
  }
});
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-site],[data-open]");
  if (!b) return;
  if (b.dataset.open) {
    goHome();
    go(b.dataset.open);
    return openPreview(true);
  }
  if (b.dataset.site === "explore") { goHome(); openPreview(true); }
  if (b.dataset.site === "close-preview") openPreview(false);
  if (b.dataset.site === "early-access") earlyAccess();
});
document.addEventListener("keydown", (e) => {
  if (!document.body.classList.contains("preview-open")) return;
  if (e.key === "Escape") return openPreview(false);
  if (e.key !== "Tab") return;
  const nodes = [...stage.querySelectorAll('button:not(:disabled),input,select,textarea,a[href],[tabindex="0"]')].filter((n) => n.offsetParent !== null);
  const first = nodes[0], last = nodes.at(-1);
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
// Beside the app: one line and one button. What the data is, is said once, under the phone.
side.innerHTML = `<div class="preview-next"><strong>Tap anything.</strong><button class="button" data-site="early-access">Get early access</button></div>`;
render();
