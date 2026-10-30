import {
  createState,
  SCREENS,
  SYMBOLS,
  NAMES,
  BASE,
  tourPosition,
  restoreTour,
  HIDDEN_TOOLS,
  escapeHTML as esc,
  price,
  storyPlan,
  plan,
  positionSize,
} from "./core.mjs";
import { META, fixtures } from "./ui.mjs";
import { renderNativeView, nativeHeader, nativeIcon as icon, sheetStyle } from "./native.mjs";
import { QUIZ } from "./native-quiz.mjs";
import { attachChart } from "./chart.mjs";
import { createFilm } from "./film.mjs";
import { PLATFORMS, changePlatform, MAC_SHORTCUTS, renderMacFrame } from "./platform.mjs";
let state = createState(),
  history = [],
  chartHandle = null,
  toastTimer = null;
const root = document.querySelector("#app-root"),
  phone = document.querySelector("#phone"),
  stage = document.querySelector("#preview-stage"),
  player = document.querySelector("#tour-player");
let focusBeforeFullscreen = null;
let film;
function takeOver() { film?.pause(); }
function showFilmFrame(frame) {
  Object.assign(state, {
    screen:frame.screen, detail:frame.detail||null, platform:frame.platform,
    macSection:MAC_SHORTCUTS.includes(frame.screen)?frame.screen:'home',
    macMenuOpen:false, macSidebarCollapsed:matchMedia('(max-width:800px)').matches,
    symbol:'NVDA', timeframe:frame.screen==='aplus'?'1m':frame.screen==='patterns'?'1d':'15m',
    direction:'long', mode:'swing', scenario:'Breakout', session:'Morning',
    room:frame.room||'Trading Floor', search:'', lookup:null, levelInfo:null,
    chart:{offset:0,count:frame.id==='plan'?48:42}, assistantContext:'stops', day:null, calendarTab:'This week',
  });
  // The initial demo budget already matches the film. Keep edits made while exploring.
  if(frame.id==='pip' && !state.pipQuestion){
    state.pipQuestion='What does a stop mean?';
    state.pipAnswer='A stop is where you plan to exit if the trade moves against you. Think about it before you enter.';
  }
  history=[];
  render();
  if (frame.focal === 'size') root.querySelector('.n-size')?.closest('details')?.setAttribute('open','');
  const content=root.querySelector('.app-content');
  const focalSelector=frame.focal==='size'?'.n-size':{plan:'.n-candle-panel',risk:'.n-size',pip:'.n-pip-question',momentum:'.n-story-card',patterns:'.n-chart'}[frame.id];
  const focal=frame.focal==='room'||['community','room'].includes(frame.id)?[...root.querySelectorAll('.n-win-message')].find(el=>el.querySelector('.n-win-kind')?.textContent.includes('FOLLOWED')):focalSelector?root.querySelector(focalSelector):frame.platform==='macos'&&frame.screen==='stops'?root.querySelector('.stop-chart'):null;
  if(content&&focal)content.scrollTop=Math.max(0,content.scrollTop+focal.getBoundingClientRect().top-content.getBoundingClientRect().top-(frame.id==='community'?84:16));
}
function renderPlayer() {
  player.innerHTML=`<div class="preview-next"><strong>Everything here is sample data.</strong><p>Tap anything. Nothing is posted or traded.</p><a class="button" href="https://app.thefriendlytrader.com/learn" target="_blank" rel="noopener">Start the free options course <span aria-hidden="true">↗</span></a><button class="button secondary" data-site="membership">See membership</button></div>`;
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
  chartHandle?.destroy?.();
  const scroll = keepScroll
    ? root.querySelector(".app-content")?.scrollTop || 0
    : 0;
  phone.classList.toggle("dark", state.dark);
  const isHome = state.screen === "home", sheet=sheetStyle(state), mac=state.platform==="macos";
  phone.classList.toggle("mac",mac);
  document.body.dataset.platform=state.platform;
  stage.dataset.platform=state.platform;
  phone.setAttribute("aria-label",mac?"Friendly Trader macOS preview":"Friendly Trader iOS preview");
  stage.querySelector('.preview-label').textContent=PLATFORMS[state.platform].previewLabel;
  phone.classList.add("native");
  root.classList.toggle("native-sheet",sheet&&!mac);
  root.dataset.view=state.screen;
  const floating= !sheet && !["home","menu","onboarding"].includes(state.screen);
  const pageHTML = `${nativeHeader(state)}<div class="app-content ${isHome ? "home-content" : ""}" data-screen-content="${state.screen}">${renderNativeView(state)}</div>${floating?`<div class="n-floating">${["macd","patterns","screener","stops","aplus"].includes(state.screen)?`<button data-action="share" aria-label="Share sample screen">${icon("share")}</button>`:""}<button class="n-float-pip" data-action="open-pip" aria-label="Ask Pip about this screen">${icon("pip")}</button></div>`:""}${!mac&&!sheet&&state.screen!=="onboarding"?`<nav class="app-nav" aria-label="App quick menu">${state.quick.map(id=>{
    const meta=SCREENS.find(x=>x[0]===id);
    return `<button class="${state.screen===id?"active":""}" data-screen="${id}" aria-label="${label(id)}" ${state.screen===id?'aria-current="page"':""}>${icon(meta?.[3])}<span>${id==="stops"?"Stops":label(id)}</span></button>`;
  }).join("")}</nav>`:""}`;
  root.innerHTML=mac?renderMacFrame(state,pageHTML,sheet):pageHTML;
  root.querySelectorAll("video").forEach(video=>{
    video.muted=true;
    if(matchMedia("(prefers-reduced-motion: reduce)").matches)video.pause();
    else video.play().catch(()=>{});
  });
  root.querySelector(".app-content").scrollTop = scroll;
  const selectedRoom=root.querySelector('.n-chat-tabs [aria-selected="true"]');
  if(selectedRoom){const strip=selectedRoom.parentElement;strip.scrollLeft=selectedRoom.offsetLeft-strip.clientWidth/2+selectedRoom.offsetWidth/2;}

  chartHandle = attachChart(
    root.querySelector(".candlestick-chart"),
    state,
    takeOver,
    (level)=>{state.levelInfo=state.levelInfo===level?null:level;render({keepScroll:true});},
  );
}
function go(screen, detail = null, extra = {}, fromTour = false) {
  // A switched-off tool opens Home, as AppNavigation.go does in the app.
  if (!fromTour && HIDDEN_TOOLS.includes(screen)) { screen = "home"; detail = null; extra = {}; }
  if (!META[screen]) return;
  document.querySelector("#app-toast").classList.remove("visible");
  if (!fromTour) takeOver();
  history.push(tourPosition(state));
  if (history.length > 50) history.shift();
  const switching=screen!==state.screen;
  state.macMenuOpen=false;
  if(MAC_SHORTCUTS.includes(screen))state.macSection=screen;
  if(state.platform==="macos"&&matchMedia("(max-width:800px)").matches)state.macSidebarCollapsed=true;
  Object.assign(state, { screen, detail, search: "", levelInfo: null, lookup:null }, extra);
  if(switching && screen==="aplus" && !extra.timeframe)state.timeframe="1m";
  if(switching && screen==="macd" && !extra.timeframe)state.timeframe="15m";
  if(screen==="patterns" && detail==="pattern")state.timeframe="1d";

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
  } else go(state.detail ? state.screen : "home");
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
    chartHandle?.draw();
    root.querySelector("button")?.focus();
  } else {
    document.body.classList.remove("preview-open");
    // The film's Mac shot can open the Mac preview; the page itself only shows the iPhone.
    if(state.platform==="macos"){changePlatform(state,"ios");render({keepScroll:true});}
    stage.removeAttribute("role");
    stage.removeAttribute("aria-modal");
    stage.removeAttribute("aria-label");
    document.querySelector(".site-header").inert = false;
    document
      .querySelectorAll("main>section:not(.hero),.site-footer,.hero-copy")
      .forEach((e) => (e.inert = false));
    chartHandle?.draw();
    focusBeforeFullscreen?.focus();
  }
}
function bringPreview() {
  fullscreen(true);
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
    state.pipAnswer = `The stop is the red line on the ${state.symbol} example. For a long idea it sits below entry; for a short idea it sits above. Gaps can carry price past it.`;
  else if (/next|explore/.test(q))
    state.pipAnswer =
      "Try Stop Finder: pick a ticker, then change long to short and tap a line to see why it sits there. After that, check the calendars, start the Options course or say hello in the demo community.";
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
      "Home brings the five trading tools together with Today, calendars, sessions and chat. Tap a card to explore. Use the top-left arrow to return Home.";
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
let shortcutHold=null, heldShortcut=false, holdOrigin=null;
root.addEventListener("pointerdown",e=>{
  if(!e.target.closest(".app-nav"))return;
  holdOrigin={x:e.clientX,y:e.clientY};
  shortcutHold=setTimeout(()=>{heldShortcut=true;go("profile","quick-menu");},550);
});
root.addEventListener("pointermove",e=>{if(holdOrigin&&Math.hypot(e.clientX-holdOrigin.x,e.clientY-holdOrigin.y)>8)clearTimeout(shortcutHold);});
["pointerup","pointercancel"].forEach(type=>root.addEventListener(type,()=>{clearTimeout(shortcutHold);holdOrigin=null;}));
root.addEventListener("click",e=>{if(heldShortcut){heldShortcut=false;e.stopImmediatePropagation();}},true);
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
    case "mac-sidebar":
      state.macSidebarCollapsed=!state.macSidebarCollapsed;render({keepScroll:true});
      root.querySelector('[data-action="mac-sidebar"]')?.focus();
      break;
    case "mac-menu":
      state.macMenuOpen=!state.macMenuOpen;render({keepScroll:true});
      root.querySelector('[data-action="mac-menu"]')?.focus();
      break;
    case "mac-notifications":
      go("profile","notifications");
      break;
    case "chat-search-toggle":
      state.showChatSearch=!state.showChatSearch;render();root.querySelector('[name="query"]')?.focus();
      break;
    case "chat-option":
      if(v==="profile")go("profile");
      else if(v==="notifications")go("profile","notifications");
      else go("chat",v);
      break;
    case "save-message":
      state.savedMessages=state.savedMessages.includes(b.dataset.id)?state.savedMessages.filter(x=>x!==b.dataset.id):[...state.savedMessages,b.dataset.id];
      render({keepScroll:true});
      break;
    case "home":
      go("home");
      break;
    case "native-menu":
      go("menu",null,{menuFor:v});
      break;
    case "native-detail":
      go(state.screen,v||null);
      break;
    case "macd-option":
      go("macd",v);
      break;
    case "edit-quick":
      go("profile","quick-menu");
      break;
    case "clear-search":
      state.lookup=null;render();
      break;
    case "patterns-all":
      state.showAllPatterns=!state.showAllPatterns;
      state.patternFilter="All";render();
      break;
    case "toggle-board":
      state.expandedBoards=state.expandedBoards.includes(v)?state.expandedBoards.filter(x=>x!==v):[...state.expandedBoards,v];
      render({keepScroll:true});
      break;
    case "share-stock":
      go("chat","share",{symbol:t});
      break;
    case "choose-win":
      go("chat","win-compose",{winKind:v});
      break;
    case "milestones":
      go("chat","milestones");
      break;
    case "photo":
      state.choosePhoto=!state.choosePhoto;render({keepScroll:true});
      break;
    case "quick-up": {
      const i=state.quick.indexOf(v);
      if(i>0)[state.quick[i-1],state.quick[i]]=[state.quick[i],state.quick[i-1]];
      render({keepScroll:true});
      break;
    }
    case "quiz-start":
      state.quizStage="questions";state.quizNode="q1";state.quizAnswers=[];state.quizResult=null;render();
      break;
    case "back":
      back();
      break;
    case "set":
      if (b.dataset.key === "stopMode") state.mode = v.toLowerCase();
      else if (b.dataset.key === "stopDirection")
        state.direction = v.toLowerCase();
      else state[b.dataset.key] = v;
      if(b.dataset.key === "profileAppearance")state.dark=v==="Dark"||(v==="System"&&matchMedia("(prefers-color-scheme: dark)").matches);
      if(b.dataset.key === "horizon")state.timeframe=v==="Longer term"?"1d":"15m";
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
      go(state.screen, "stock", { symbol: t, direction:storyPlan(t).side });
      break;
    case "pattern-detail":
      go("patterns", "pattern", {
        symbol: t, timeframe:"1d",
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
      go("chat","win-compose");
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
      if (state.quick.includes(v) && state.quick.length>3)
        state.quick = state.quick.filter((x) => x !== v);
      else if(state.quick.includes(v))toast("Keep at least three shortcuts.");
      else if (state.quick.length < 6) state.quick.push(v);
      else toast("Choose up to six shortcuts. Turn one off first.");
      render({ keepScroll: true });
      break;
    case "quiz-answer": {
      const answer=QUIZ[state.quizNode]?.answers[Number(v)];
      if(!answer)break;
      state.quizAnswers.push({node:state.quizNode,answer:Number(v)});
      if(answer.type==="outcome")state.quizResult=answer.to;
      else state.quizNode=answer.to;
      render();break;
    }
    case "quiz-reset":
      state.quizStage="welcome";state.quizResult=null;state.quizNode="q1";state.quizAnswers=[];render();
      break;
    case "membership-site":
      openExternalSection("#membership");
      break;
    case "replay-tour":
      film.start();
      break;
    case "reset":
      state = {...createState(),platform:state.platform,macSidebarCollapsed:state.macSidebarCollapsed};
      history = [];
      film.pause();
      render();
      renderPlayer();
      toast("Fresh start. All demo changes have been reset.");
      break;
  }
});
root.addEventListener("input", (e) => {
  if(e.target.dataset.change==='riskBudget'){
    const budget=Number(e.target.value);
    if(Number.isFinite(budget)&&budget>0&&budget<=1000000){
      state.riskBudget=budget;
      const p=plan(state.symbol,state.direction,state.mode),shares=positionSize(budget,p.risk);
      root.querySelector('.n-size>div strong').textContent=shares.toLocaleString()+' shares';
      root.querySelector('.n-size>p').innerHTML=`Target 1: ${price(shares*Math.abs(p.target-p.entry))} potential move<br>Stop: ${price(shares*p.risk)} planned risk`;
    }
  }
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
    state.lookup = t;
    state.chart = { offset: 0, count: 42 };
    if (state.screen === "patterns") {
      if (!fixtures.patterns.some((p) => p.symbol === t)) {
        toast(
          "This sample ticker has no pattern example. Try NVDA, AAPL, TSLA, MSFT, META or GOOGL.",
        );
        return;
      }
      go("patterns", "pattern");
    } else render();
  }
  if(kind==="win") {
    const kind=state.winKind, symbol=String(data.get("symbol")||"NVDA");
    const note=String(data.get("note")||"").trim();
    const entry=Number(data.get("entry")),exit=Number(data.get("exit")),quantity=Number(data.get("quantity")),side=String(data.get("side"));
    if(!note)return toast("Add a short note about your win.");
    if(kind==="Trade win"&&(!SYMBOLS.includes(symbol)||![entry,exit].every(n=>Number.isFinite(n)&&n>0&&n<=1000000)||!Number.isInteger(quantity)||quantity<1||quantity>100000||!["long","short"].includes(side)))return toast("Use valid sample prices and 1–100,000 whole shares.");
    state.wins.unshift({id:"win-"+Date.now(),name:state.name,avatar:state.avatar,time:"10:42 AM",kind,note:note.slice(0,500),...(kind==="Trade win"?{symbol,entry,exit,quantity,side}:{})});
    go("chat","room",{room:"Wins"});toast("Your sample win was added to this preview only.");
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
function setPreviewPlatform(platform, expand=false) {
  // Keep unfinished form input when the same page changes its platform frame.
  const pendingForms = [...root.querySelectorAll('form[data-form]')].map(form => ({
    kind: form.dataset.form,
    fields: [...form.elements].filter(field => field.name && field.type !== 'file').map(field => [field.name, field.value]),
  }));
  takeOver();
  changePlatform(state,platform);
  state.macMenuOpen=false;
  state.macSidebarCollapsed=matchMedia("(max-width:800px)").matches;
  render({keepScroll:true});
  for (const {kind, fields} of pendingForms) {
    const form = root.querySelector(`form[data-form="${CSS.escape(kind)}"]`);
    for (const [name, value] of fields) {
      const field = form?.elements.namedItem(name);
      if (field) field.value = value;
    }
  }
  if(expand)fullscreen(true);
}
document.addEventListener("click", (e) => {
  const switcher=e.target.closest('button[data-platform],button[data-preview-platform]');
  if(switcher){setPreviewPlatform(switcher.dataset.platform||switcher.dataset.previewPlatform,!!switcher.dataset.previewPlatform);return;}
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
      film.start();
      break;
    case "resume-film":
      film.resume();
      break;
    case "fullscreen":
      fullscreen();
      break;
    case "close-fullscreen":
      fullscreen(false);
      break;
    case "membership":
      openExternalSection("#membership");
      break;
  }
});
document.addEventListener("keydown", (e) => {
  if (!document.body.classList.contains("preview-open")) return;
  if(state.platform==="macos"&&(e.metaKey||e.ctrlKey)&&phone.contains(document.activeElement)){
    const digit=/^[0-9]$/.test(e.key)?Number(e.key):null;
    if(digit!==null){e.preventDefault();go(MAC_SHORTCUTS[digit===0?9:digit-1]);return;}
    if(e.key===","){e.preventDefault();go("profile");return;}
    if(e.shiftKey&&e.key.toLowerCase()==="n"){e.preventDefault();go("profile","notifications");return;}
  }
  if (e.key === "Escape") {
    if(state.macMenuOpen){state.macMenuOpen=false;render({keepScroll:true});return;}
    if(state.platform==="macos"&&sheetStyle(state)){back();return;}
    if(state.platform==="macos"&&!state.macSidebarCollapsed&&matchMedia("(max-width:800px)").matches){state.macSidebarCollapsed=true;render({keepScroll:true});return;}
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
film=createFilm({phone,showFrame:showFilmFrame,openApp:()=>fullscreen(true),closeApp:()=>fullscreen(false),onStatus:({started})=>{
  if(started&&!player.querySelector('.film-return')){const button=document.createElement('button');button.className='film-return';button.dataset.site='resume-film';button.textContent='Resume film ↗';player.append(button);}
}});
render();
renderPlayer();
// A deterministic capture surface uses the same renderer and interactions as
// the public preview. It never loads a live feed or writes to an account.
if (new URLSearchParams(location.search).has('product-capture')) {
  const { prepareCapture } = await import('./capture.mjs');
  prepareCapture({ state, render, showFilmFrame, fullscreen, root, phone, stage });
}
