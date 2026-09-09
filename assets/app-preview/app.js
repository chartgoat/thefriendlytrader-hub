import {
  createState,
  SCREENS,
  SYMBOLS,
  NAMES,
  BASE,
  TOUR,
  tourPosition,
  restoreTour,
  escapeHTML as esc,
  price,
} from "./core.mjs";
import { renderView, META, icon, fixtures } from "./ui.mjs";
import { attachChart } from "./chart.mjs";
let state = createState(),
  history = [],
  chartHandle = null,
  toastTimer = null;
const root = document.querySelector("#app-root"),
  phone = document.querySelector("#phone"),
  stage = document.querySelector("#preview-stage"),
  player = document.querySelector("#tour-player");
const tour = {
  playing: false,
  index: 0,
  snapshot: null,
  remaining: 5500,
  started: 0,
  timer: null,
  hasStarted: false,
  completed: false,
};
let focusBeforeFullscreen = null,
  progressFrame = null;
function tourHighlight() {
  root
    .querySelectorAll(".tour-focus")
    .forEach((e) => e.classList.remove("tour-focus"));
  if (tour.playing)
    root
      .querySelector(".home-greeting,.card,.chart-card,.home-row,.pip-question")
      ?.classList.add("tour-focus");
}
function tickProgress() {
  cancelAnimationFrame(progressFrame);
  const update = () => {
    const elapsed = tour.playing
      ? Math.min(tour.remaining, performance.now() - tour.started)
      : 0;
    const within = 5500 - tour.remaining + elapsed;
    const fill = player.querySelector(".tour-progress>span");
    if (fill)
      fill.style.width =
        ((tour.index * 5500 + within) / (TOUR.length * 5500)) * 100 + "%";
    if (tour.playing) progressFrame = requestAnimationFrame(update);
  };
  update();
}
function label(screen) {
  return META[screen]?.[0] || screen;
}
function toast(text) {
  const el = document.querySelector("#app-toast");
  el.textContent = text;
  el.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("visible"), 3200);
}
function render({ keepScroll = false } = {}) {
  const scroll = keepScroll
    ? root.querySelector(".app-content")?.scrollTop || 0
    : 0;
  phone.classList.toggle("dark", state.dark);
  const isHome = state.screen === "home";
  const contextHelp = ![
    "home",
    "assistant",
    "profile",
    "onboarding",
    "menu",
  ].includes(state.screen);
  root.innerHTML = `<header class="app-header ${isHome ? "home-header" : ""}">${isHome ? "" : `<button class="icon-button back-button" data-action="back" aria-label="Back">${icon("back")}</button>`}<h2>${isHome ? "Friendly Trader" : state.detail === "chart" ? "Chart" : state.detail === "thread" ? "Thread" : label(state.screen)}</h2>${isHome ? `<button class="avatar" data-screen="profile" aria-label="Open your profile">${esc(state.avatar)}</button>` : `${contextHelp ? `<button class="icon-button pip-help" data-action="open-pip" aria-label="Ask Pip about this screen">${icon("pip")}</button>` : ""}<button class="icon-button" data-screen="menu" aria-label="Open all app screens">${icon("menu")}</button>`}</header><div class="app-content ${isHome ? "home-content" : ""}" data-screen-content="${state.screen}">${renderView(state)}</div><nav class="app-nav" aria-label="App quick menu">${state.quick
    .map((id) => {
      const meta = SCREENS.find((x) => x[0] === id);
      return `<button class="${state.screen === id ? "active" : ""}" data-screen="${id}" aria-label="${label(id)}" ${state.screen === id ? 'aria-current="page"' : ""}>${icon(meta?.[3])}<span>${id === "stops" ? "Stops" : label(id)}</span></button>`;
    })
    .join("")}</nav>`;
  root.querySelector(".app-content").scrollTop = scroll;
  chartHandle = attachChart(
    root.querySelector(".candlestick-chart"),
    state,
    takeOver,
  );
}
function go(screen, detail = null, extra = {}, fromTour = false) {
  if (!META[screen]) return;
  document.querySelector("#app-toast").classList.remove("visible");
  if (!fromTour) takeOver();
  history.push(tourPosition(state));
  if (history.length > 50) history.shift();
  Object.assign(state, { screen, detail, search: "", levelInfo: null }, extra);
  if (screen === "assistant" && !extra.assistantContext)
    state.assistantContext =
      history.at(-1)?.screen === "assistant"
        ? "home"
        : history.at(-1)?.screen || "home";
  render();
}
function back() {
  takeOver();
  if (history.length) {
    restoreTour(state, history.pop());
    render();
  } else go("home");
}
function renderPlayer() {
  const step = TOUR[tour.index];
  player.innerHTML = `<div class="tour-heading"><p class="tour-caption"><strong>${tour.hasStarted ? (tour.playing ? "" : tour.completed ? "Complete · " : "Paused · ") + step.title : "Take a look around"}</strong></p><span class="tour-count">${tour.index + 1}/${TOUR.length}</span></div><div class="tour-controls"><button class="tour-toggle" data-tour="toggle" aria-label="${tour.playing ? "Pause tour" : tour.hasStarted && !tour.completed ? "Resume tour" : "Play tour"}">${icon(tour.playing ? "pause" : "play")}</button><button data-tour="previous" aria-label="Previous tour chapter" ${tour.index === 0 ? "disabled" : ""}>${icon("back")}</button><input type="range" aria-label="Tour chapter" min="0" max="${TOUR.length - 1}" value="${tour.index}" step="1"><button data-tour="next" aria-label="Next tour chapter" ${tour.index === TOUR.length - 1 ? "disabled" : ""}>${icon("next")}</button><button class="replay" data-tour="restart" aria-label="Restart tour">↺</button></div><div class="tour-progress" aria-hidden="true"><span></span></div><p class="tour-hint">${tour.hasStarted ? step.text : "Play the tour. Tap inside the app to take over."}</p>`;
}
function loadStep(index, keepPlayer = false) {
  tour.index = Math.max(0, Math.min(TOUR.length - 1, index));
  const step = TOUR[tour.index];
  Object.assign(state, {
    screen: step.screen,
    detail: step.detail || null,
    symbol: "NVDA",
    timeframe: "15m",
    direction: "long",
    mode: "swing",
    scenario: "Breakout",
    session: "Morning",
    room: "Trading Floor",
    chart: { offset: 0, count: 42 },
    search: "",
    day: null,
  });
  if (step.screen === "assistant") state.assistantContext = "stops";
  history = [];
  tour.remaining = 5500;
  tour.snapshot = tourPosition(state);
  tour.hasStarted = true;
  render();
  if (!keepPlayer) renderPlayer();
}
function schedule() {
  clearTimeout(tour.timer);
  if (!tour.playing) return;
  tour.started = performance.now();
  tourHighlight();
  tickProgress();
  tour.timer = setTimeout(() => {
    if (tour.index >= TOUR.length - 1) {
      tour.playing = false;
      tour.completed = true;
      tour.snapshot = null;
      renderPlayer();
      tourHighlight();
      cancelAnimationFrame(progressFrame);
      return;
    }
    loadStep(tour.index + 1);
    schedule();
  }, tour.remaining);
}
function play() {
  if (tour.completed) {
    tour.completed = false;
    loadStep(0);
  } else if (!tour.hasStarted) loadStep(0);
  else if (tour.snapshot) {
    restoreTour(state, tour.snapshot);
    history = [];
    render();
  }
  tour.playing = true;
  renderPlayer();
  schedule();
}
function takeOver() {
  if (!tour.playing) return;
  tour.remaining = Math.max(
    200,
    tour.remaining - (performance.now() - tour.started),
  );
  tour.snapshot = tourPosition(state);
  tour.playing = false;
  clearTimeout(tour.timer);
  renderPlayer();
  tourHighlight();
  tickProgress();
}
function fullscreen(open = true) {
  if (open) {
    focusBeforeFullscreen = document.activeElement;
    document.body.classList.add("preview-open");
    stage.setAttribute("role", "dialog");
    stage.setAttribute("aria-modal", "true");
    stage.setAttribute("aria-label", "Full interactive app preview");
    document.querySelector(".site-header").inert = true;
    document
      .querySelectorAll("main>section:not(.hero),.site-footer,.hero-copy")
      .forEach((e) => (e.inert = true));
    root.querySelector("button")?.focus();
  } else {
    document.body.classList.remove("preview-open");
    stage.removeAttribute("role");
    stage.removeAttribute("aria-modal");
    stage.removeAttribute("aria-label");
    document.querySelector(".site-header").inert = false;
    document
      .querySelectorAll("main>section:not(.hero),.site-footer,.hero-copy")
      .forEach((e) => (e.inert = false));
    focusBeforeFullscreen?.focus();
  }
}
function bringPreview() {
  if (matchMedia("(max-width:800px)").matches) fullscreen(true);
  else
    document.querySelector("#try-app").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion:reduce)").matches
        ? "instant"
        : "smooth",
    });
}
function openExternalSection(id) {
  takeOver();
  fullscreen(false);
  document.querySelector(id).scrollIntoView({ behavior: "smooth" });
}
function toggleAlert() {
  const id = `${state.symbol}:${state.scenario}:${state.timeframe}:${state.session}`;
  const found = state.alerts.find((a) => a.id === id);
  if (found) state.alerts = state.alerts.filter((a) => a.id !== id);
  else {
    state.alerts = state.alerts.filter((a) => a.symbol !== state.symbol);
    state.alerts.push({
      id,
      symbol: state.symbol,
      scenario: state.scenario,
      timeframe: state.timeframe,
      session: state.session,
    });
  }
  toast(
    found
      ? "Demo watch removed."
      : "Demo watch saved. No notification will be sent.",
  );
  render({ keepScroll: true });
}
function askPip(question) {
  state.pipQuestion = question;
  const q = question.toLowerCase(),
    context = state.assistantContext || "home";
  if (/confirm|win|profit|guarantee/.test(q))
    state.pipAnswer =
      "Confirmed means a setup met its confirmation rule. It does not mean the trade will win. Price can reverse, and the stop marks where the example stops making sense.";
  else if (/stop|risk|exit|size/.test(q))
    state.pipAnswer = `The stop is the red line on the ${state.symbol} example. For a long idea it sits below entry; for a short idea it sits above. The sizing box divides your sample risk budget by the entry-to-stop distance and rounds down to whole shares. Fees, slippage and gaps can change the actual risk.`;
  else if (/next|explore/.test(q))
    state.pipAnswer =
      "Try opening A+ Scalps, choosing a ticker, and then tapping Plan a stop. You can pan the chart, change long to short, and save the example. After that, check the calendars or say hello in the demo community.";
  else if (/looking|screen|what|explain/.test(q))
    state.pipAnswer =
      {
        aplus:
          "A+ Scalps brings a ticker’s levels, scenario and candle size together. Open an example, inspect the chart, then tap the bell to try saving a watch.",
        macd: "MACD describes momentum. This board lets you compare sample signals across timeframes. A changing signal is information, not a guarantee of a future price.",
        patterns:
          "Patterns helps you explore shapes in the candles. Forming, confirmed and failed are different states. These demo charts teach the interface; they are not historical detector results.",
        screener:
          "The screener groups movers into overnight gappers, session runners and breakouts. Open a board and sort the fictional examples by move or relative volume.",
        economy:
          "The economy calendar puts releases and expectations together. An actual number and an estimate can differ, but a whole market move cannot be attributed to a single event.",
        earnings:
          "The earnings calendar shows sample company reports. Expected EPS is an estimate, while actual EPS is the reported number. In this preview both are fictional.",
        chat: "These are fictional community rooms. You can open a thread, react, or write a message. It stays inside this browser preview.",
      }[context] ||
      "Home brings the five trading tools together with Today, calendars, sessions and chat. Tap a card to explore. You can return home at any time from the quick menu.";
  else
    state.pipAnswer =
      "I have a small set of prewritten demo answers here. Try asking about the screen, a stop, confirmation or what to explore next. The actual assistant can use the current app context.";
  render({ keepScroll: true });
  root.querySelector(".pip-answer")?.scrollIntoView({ block: "nearest" });
}
root.addEventListener("pointerdown", () => takeOver(), { capture: true });
root.addEventListener(
  "keydown",
  (e) => {
    if (e.key !== "Tab") takeOver();
  },
  { capture: true },
);
root.addEventListener("wheel", () => takeOver(), {
  capture: true,
  passive: true,
});
root.addEventListener("click", (event) => {
  const b = event.target.closest("button");
  if (!b) return;
  if (b.dataset.screen) {
    go(b.dataset.screen);
    return;
  }
  const a = b.dataset.action;
  if (!a) return;
  takeOver();
  const v = b.dataset.value,
    t = b.dataset.symbol;
  switch (a) {
    case "back":
      back();
      break;
    case "set":
      if (b.dataset.key === "stopMode") state.mode = v.toLowerCase();
      else if (b.dataset.key === "stopDirection")
        state.direction = v.toLowerCase();
      else state[b.dataset.key] = v;
      if (b.dataset.key === "scenario")
        state.direction = ["Breakdown", "Rejection"].includes(v)
          ? "short"
          : "long";
      render({ keepScroll: true });
      break;
    case "ticker":
      state.symbol = v;
      state.chart = { offset: 0, count: 42 };
      render();
      break;
    case "aplus-detail":
      go("aplus", "setup", {
        symbol: t,
        scenario: t === "MSFT" ? "Breakdown" : "Breakout",
        direction: t === "MSFT" ? "short" : "long",
      });
      break;
    case "stock-detail":
    case "open-stock":
      go(state.screen, "stock", { symbol: t });
      break;
    case "pattern-detail":
      go("patterns", "pattern", {
        symbol: t,
        direction:
          fixtures.patterns.find((p) => p.symbol === t)?.bias === "Bearish"
            ? "short"
            : "long",
      });
      break;
    case "screener-board":
      go("screener", "board", { screenerBoard: v });
      break;
    case "to-stops":
      go("stops", null, { symbol: state.symbol });
      break;
    case "watch":
      state.watchlist = state.watchlist.includes(state.symbol)
        ? state.watchlist.filter((t) => t !== state.symbol)
        : [...state.watchlist, state.symbol];
      toast(
        state.watchlist.includes(state.symbol)
          ? "Added to your demo watchlist."
          : "Removed from your demo watchlist.",
      );
      render({ keepScroll: true });
      break;
    case "alert":
      toggleAlert();
      break;
    case "remove-alert":
      state.alerts = state.alerts.filter((a) => a.id !== b.dataset.id);
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
    case "pan-back":
      state.chart.offset += 8;
      chartHandle?.draw();
      break;
    case "pan-forward":
      state.chart.offset -= 8;
      chartHandle?.draw();
      break;
    case "chart-reset":
      state.chart = { offset: 0, count: 42 };
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
      const p = {
        symbol: state.symbol,
        direction: state.direction,
        mode: state.mode,
      };
      if (!state.plans.some((x) => JSON.stringify(x) === JSON.stringify(p)))
        state.plans.push(p);
      toast("Plan saved in this preview.");
      render({ keepScroll: true });
      break;
    }
    case "load-plan":
      Object.assign(state, state.plans[Number(b.dataset.index)]);
      state.chart = { offset: 0, count: 42 };
      render();
      break;
    case "remove-plan":
      state.plans.splice(Number(b.dataset.index), 1);
      render({ keepScroll: true });
      break;
    case "history-example":
      state.chart = { offset: 20 + Number(v) * 20, count: 35 };
      chartHandle?.draw();
      toast(
        [
          "Target-reached teaching example",
          "Invalidated teaching example",
          "Still-forming teaching example",
        ][Number(v)],
      );
      break;
    case "week-back":
      state.week = Math.max(0, state.week - 1);
      state.day = null;
      render();
      break;
    case "week-forward":
      state.week = Math.min(3, state.week + 1);
      state.day = null;
      render();
      break;
    case "calendar-day":
      state.day = Number(v);
      render();
      break;
    case "calendar-all":
      state.day = null;
      render();
      break;
    case "event":
      go(state.screen, "event", { event: v });
      break;
    case "reminder":
      state.reminders = state.reminders.includes(v)
        ? state.reminders.filter((x) => x !== v)
        : [...state.reminders, v];
      toast(
        state.reminders.includes(v)
          ? "Demo reminder saved. No real notification is scheduled."
          : "Demo reminder removed.",
      );
      render({ keepScroll: true });
      break;
    case "event-stock":
      go("macd", "stock", { symbol: t });
      break;
    case "session":
      go("live", "session", { slide: 0 });
      break;
    case "slide-back":
      state.slide = Math.max(0, (state.slide || 0) - 1);
      render();
      break;
    case "slide-next":
      state.slide = Math.min(3, (state.slide || 0) + 1);
      render();
      break;
    case "room":
      go("chat", "room", { room: v, search: "" });
      break;
    case "thread":
      go("chat", "thread", { thread: b.dataset.id });
      break;
    case "member":
      go("chat", "member", { member: b.dataset.name });
      break;
    case "reaction":
      state.reactions = state.reactions.includes(b.dataset.id)
        ? state.reactions.filter((x) => x !== b.dataset.id)
        : [...state.reactions, b.dataset.id];
      render({ keepScroll: true });
      break;
    case "alert-setup":
      go("aplus", "setup", { symbol: "NVDA" });
      break;
    case "compose-win":
      root.querySelector("[name=message]")?.focus();
      break;
    case "share":
      go("chat", "share");
      break;
    case "open-pip":
      go("assistant", null, {
        assistantContext: state.screen,
        pipAnswer: null,
        pipQuestion: null,
      });
      break;
    case "ask-pip":
      askPip(v);
      break;
    case "profile-detail":
      go("profile", v);
      break;
    case "dark":
      state.dark = !state.dark;
      render({ keepScroll: true });
      break;
    case "avatar":
      state.avatar = v;
      render({ keepScroll: true });
      break;
    case "notification-pref":
      state.notificationPrefs ??= {};
      state.notificationPrefs[v] = state.notificationPrefs[v] === false;
      render({ keepScroll: true });
      break;
    case "quick-toggle":
      if (state.quick.includes(v))
        state.quick = state.quick.filter((x) => x !== v);
      else if (state.quick.length < 6) state.quick.push(v);
      else toast("Choose up to six shortcuts. Turn one off first.");
      render({ keepScroll: true });
      break;
    case "quiz-answer":
      state.quizAnswers[state.quizStep] = Number(v);
      state.quizStep++;
      render();
      break;
    case "quiz-reset":
      state.quizStep = 0;
      state.quizAnswers = [];
      render();
      break;
    case "membership-site":
      openExternalSection("#membership");
      break;
    case "replay-tour":
      tour.completed = false;
      loadStep(0);
      play();
      break;
    case "reset":
      state = createState();
      history = [];
      clearTimeout(tour.timer);
      Object.assign(tour, {
        playing: false,
        index: 0,
        snapshot: null,
        remaining: 5500,
        hasStarted: false,
        completed: false,
      });
      render();
      renderPlayer();
      toast("Fresh start. All demo changes have been reset.");
      break;
  }
});
root.addEventListener("input", (e) => {
  if (e.target.name === "message") {
    const key =
      state.detail === "thread" ? "thread:" + state.thread : state.room;
    state.drafts[key] = e.target.value;
  }
});
root.addEventListener("change", (e) => {
  const key = e.target.dataset.change;
  if (!key) return;
  takeOver();
  if (key === "riskBudget") {
    const n = Number(e.target.value);
    if (!Number.isFinite(n) || n <= 0 || n > 1000000) {
      toast("Enter a sample risk amount from $1 to $1,000,000.");
      render({ keepScroll: true });
      return;
    }
    state.riskBudget = n;
  } else state[key] = e.target.value;
  render({ keepScroll: true });
});
root.addEventListener("submit", (e) => {
  e.preventDefault();
  takeOver();
  const form = e.target,
    kind = form.dataset.form,
    data = new FormData(form);
  if (kind === "ticker") {
    const t = String(data.get("symbol")).trim().toUpperCase();
    if (!SYMBOLS.includes(t)) {
      toast("Choose a sample ticker: " + SYMBOLS.join(", ") + ".");
      return;
    }
    state.symbol = t;
    state.chart = { offset: 0, count: 42 };
    if (state.screen === "patterns") {
      if (!fixtures.patterns.some((p) => p.symbol === t)) {
        toast(
          "This sample ticker has no pattern example. Try NVDA, AAPL, TSLA, MSFT or META.",
        );
        return;
      }
      go("patterns", "pattern");
    } else render();
  }
  if (kind === "profile") {
    const name = String(data.get("name")).trim();
    if (!/^[A-Za-z0-9_]{3,20}$/.test(name)) {
      toast("Use 3–20 letters, numbers or underscores.");
      return;
    }
    state.name = name;
    toast("Demo profile saved.");
    render({ keepScroll: true });
  }
  if (kind === "message") {
    const text = String(data.get("message")).trim();
    if (!text) return;
    const id = "demo-" + Date.now();
    state.messages.push({
      id,
      room: state.room,
      name: state.name,
      avatar: state.avatar,
      time: "10:42",
      text: text.slice(0, 1000),
      parent: state.detail === "thread" ? state.thread : null,
      replies: 0,
    });
    state.drafts[
      state.detail === "thread" ? "thread:" + state.thread : state.room
    ] = "";
    render({ keepScroll: true });
    root.querySelector(".app-content").scrollTop = 99999;
    toast("Added to the demo only.");
  }
  if (kind === "chat-search") {
    state.search = String(data.get("query")).trim();
    render();
  }
  if (kind === "share") {
    const note = String(data.get("note")).trim();
    state.messages.push({
      id: "share-" + Date.now(),
      room: "Trading Floor",
      name: state.name,
      avatar: state.avatar,
      time: "10:42",
      text: `Friendly Trader demo snapshot\n${state.symbol} · ${state.timeframe} · ${price(BASE[state.symbol])}\nSimulated data.${note ? "\n" + note : ""}`,
      replies: 0,
    });
    go("chat", "room", { room: "Trading Floor" });
    toast("Snapshot added to the demo Trading Floor.");
  }
  if (kind === "pip") {
    const q = String(data.get("question")).trim();
    if (q) askPip(q);
  }
});
player.addEventListener("click", (e) => {
  const b = e.target.closest("[data-tour]");
  if (!b) return;
  const a = b.dataset.tour;
  if (a === "toggle") {
    tour.playing ? takeOver() : play();
    return;
  }
  const was = tour.playing;
  takeOver();
  if (a === "restart") {
    tour.completed = false;
    loadStep(0);
    play();
  } else {
    loadStep(tour.index + (a === "next" ? 1 : -1));
    if (was) play();
  }
});
player.addEventListener("input", (e) => {
  if (e.target.type === "range") {
    // Keep the range element mounted throughout a drag or keyboard sequence.
    clearTimeout(tour.timer);
    cancelAnimationFrame(progressFrame);
    tour.playing = false;
    tour.completed = false;
    loadStep(Number(e.target.value), true);
    const step = TOUR[tour.index];
    player.querySelector(".tour-caption").innerHTML =
      `<strong>Paused · ${step.title}</strong>`;
    const toggle = player.querySelector(".tour-toggle");
    toggle.setAttribute("aria-label", "Resume tour");
    toggle.innerHTML = icon("play");
    player.querySelector(".tour-count").textContent =
      `${tour.index + 1}/${TOUR.length}`;
    player.querySelector('[data-tour="previous"]').disabled = tour.index === 0;
    player.querySelector('[data-tour="next"]').disabled =
      tour.index === TOUR.length - 1;
    player.querySelector(".tour-hint").textContent = step.text;
    tickProgress();
  }
});
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-site],[data-open]");
  if (!b) return;
  if (b.dataset.open) {
    go(b.dataset.open);
    bringPreview();
    return;
  }
  switch (b.dataset.site) {
    case "explore":
      takeOver();
      fullscreen(true);
      break;
    case "tour":
      play();
      bringPreview();
      break;
    case "fullscreen":
      fullscreen();
      break;
    case "close-fullscreen":
      fullscreen(false);
      break;
  }
});
document.addEventListener("keydown", (e) => {
  if (!document.body.classList.contains("preview-open")) return;
  if (e.key === "Escape") {
    fullscreen(false);
    return;
  }
  if (e.key === "Tab") {
    const nodes = [
      ...stage.querySelectorAll(
        'button:not(:disabled),input,select,textarea,a[href],[tabindex="0"]',
      ),
    ].filter((n) => n.offsetParent !== null);
    const first = nodes[0],
      last = nodes.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) takeOver();
});
const directoryGroups = [
  ["Your tools", ["aplus", "macd", "patterns", "screener", "stops"]],
  ["Your day", ["home", "stream", "earnings", "economy", "live"]],
  ["Your space", ["chat", "assistant", "profile", "onboarding"]],
];
document.querySelector("#screen-directory").innerHTML = directoryGroups
  .map(
    ([group, ids]) =>
      `<div class="directory-group"><h3>${group}</h3>${ids
        .map((id) => {
          const [, title, description, i] = SCREENS.find(
            (screen) => screen[0] === id,
          );
          return `<button data-open="${id}"><span class="directory-icon">${icon(i)}</span><span class="grow"><strong>${title}</strong><small>${description}</small></span>${icon("next")}</button>`;
        })
        .join("")}</div>`,
  )
  .join("");

render();
renderPlayer();
