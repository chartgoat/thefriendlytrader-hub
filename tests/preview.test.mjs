import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  candles,
  storyPlan,
  scenarioPlan,
  activePlan,
  demoProfit,
  plan,
  positionSize,
  SYMBOLS,
  BASE,
  createState,
  SCREENS,
  TOUR,
  tourPosition,
  restoreTour,
  escapeHTML,
} from "../assets/app-preview/core.mjs";
import { fixtures } from "../assets/app-preview/ui.mjs";
import { renderNativeView as renderView, SAMPLE_WINS } from "../assets/app-preview/native.mjs";
import { QUIZ } from "../assets/app-preview/native-quiz.mjs";

test("sample candles preserve OHLC bounds, session continuity and cross-screen price parity", () => {
  for (const symbol of SYMBOLS)
    for (const tf of ["5m", "15m", "1h", "1d"]) {
      const bars = candles(symbol, tf);
      assert.deepEqual(bars, candles(symbol, tf));
      assert.equal(bars.length, 120);
      for (let i = 0; i < bars.length; i++) {
        const b = bars[i];
        assert.ok(b.low <= Math.min(b.open, b.close));
        assert.ok(b.high >= Math.max(b.open, b.close));
        assert.ok(b.low > 0);
        if (i) assert.ok(Math.abs(b.open - bars[i - 1].close) < 1e-8);
      }
      assert.ok(Math.abs(bars.at(-1).close - BASE[symbol]) < 1e-8);
    }
});
test("long and short demo plans invert risk and reward correctly in both modes", () => {
  for (const t of SYMBOLS)
    for (const mode of ["swing", "scalp"])
      for (const direction of ["long", "short"]) {
        const p = plan(t, direction, mode);
        assert.ok(p.risk > 0);
        assert.ok(Math.abs(Math.abs(p.entry - p.stop) - p.risk) < 1e-8);
        assert.ok(Math.abs(Math.abs(p.target - p.entry) / p.risk - 2.5) < 1e-8);
        assert.ok(
          direction === "long"
            ? p.stop < p.entry && p.entry < p.target
            : p.target < p.entry && p.entry < p.stop,
        );
        const shares = positionSize(100, p.risk);
        assert.ok(shares * p.risk <= 100);
        assert.ok((shares + 1) * p.risk > 100);
      }
  assert.equal(positionSize(-1, 3), 0);
  assert.equal(positionSize(NaN, 3), 0);
  assert.equal(positionSize(100, 0), 0);
});
test("tour resume restores navigation and chart position while retaining visitor changes", () => {
  const s = createState();
  Object.assign(s, {
    screen: "chat",
    detail: "thread",
    room: "Wins",
    thread: "m6",
    chart: { count: 24, offset: 17 },
  });
  const saved = tourPosition(s);
  Object.assign(s, {
    screen: "profile",
    detail: null,
    room: "Trading Floor",
    thread: null,
    dark: true,
    name: "Tester",
  });
  s.chart.count = 80;
  s.watchlist.push("TSLA");
  s.messages.push({ text: "My demo message" });
  restoreTour(s, saved);
  assert.equal(s.screen, "chat");
  assert.equal(s.thread, "m6");
  assert.equal(s.room, "Wins");
  assert.deepEqual(s.chart, { count: 24, offset: 17 });
  assert.equal(s.name, "Tester");
  assert.equal(s.dark, true);
  assert.ok(s.watchlist.includes("TSLA"));
  assert.equal(s.messages.length, 1);
  s.chart.count = 40;
  assert.equal(saved.chart.count, 24);
});
test("all main app destinations and tour destinations render meaningful content", () => {
  for (const [screen] of SCREENS) {
    const s = { ...createState(), screen };
    const html = renderView(s);
    assert.ok(html.length > 150, screen);
    assert.ok(!html.includes("undefined"), screen);
    assert.ok(!html.includes("NaN"), screen);
  }
  for (const step of TOUR) {
    const html = renderView({ ...createState(), ...step });
    assert.ok(html.length > 150, step.screen);
  }
});
test("detail branches and empty states render without missing data", () => {
  const variants = [
    ["aplus", "setup"],
    ["macd", "stock"],
    ["patterns", "pattern"],
    ["screener", "board"],
    ["screener", "stock"],
    ["earnings", "event"],
    ["economy", "event"],
    ["live", "session"],
    ["chat", "room"],
    ["chat", "thread"],
    ["chat", "member"],
    ["chat", "share"],
    ["profile", "membership"],
    ["profile", "notifications"],
    ["profile", "quick-menu"],
    ["stops", "chart"],
    ["chat","win-compose"],
    ["chat","milestones"],
    ["macd","watchlist"],
    ["macd","classic"],
    ["macd","guide"],
  ];
  for (const [screen, detail] of variants) {
    const s = { ...createState(), screen, detail, thread: "m1" };
    assert.ok(!/undefined|NaN/.test(renderView(s)), screen + "/" + detail);
  }
  assert.match(
    renderView({ ...createState(), screen: "earnings", week: 1 }),
    /No sample events/,
  );
  assert.match(
    renderView({
      ...createState(),
      screen: "chat",
      detail: "room",
      search: "not-found-abc",
    }),
    /No matching messages/,
  );
  assert.match(
    renderView({
      ...createState(),
      screen: "onboarding",
      quizStage:"questions",
      quizResult:"riskRoulettePlayer",
    }),
    /Explore Stop Finder/,
  );
});
test("visitor-authored content is escaped in chat, profile and Pip", () => {
  const attack = "<img src=x onerror=alert(1)>";
  assert.equal(escapeHTML(attack), "&lt;img src=x onerror=alert(1)&gt;");
  for (const screen of ["home", "profile", "assistant", "chat"]) {
    const s = {
      ...createState(),
      screen,
      name: attack,
      pipAnswer: attack,
      pipQuestion: attack,
      detail: screen === "chat" ? "room" : null,
      messages: [
        {
          id: "x",
          room: "Trading Floor",
          name: attack,
          avatar: "X",
          text: attack,
          time: "10:42",
        },
      ],
    };
    assert.ok(!renderView(s).includes(attack), screen);
  }
});
test("preview cannot make service calls, persist personal data or invoke notification APIs", () => {
  const code = ["app.js", "core.mjs", "ui.mjs", "chart.mjs", "native.mjs", "native-quiz.mjs", "platform.mjs"]
    .map((f) =>
      fs.readFileSync(
        new URL("../assets/app-preview/" + f, import.meta.url),
        "utf8",
      ),
    )
    .join("\n");
  assert.doesNotMatch(
    code,
    /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|Notification\.requestPermission|serviceWorker/,
  );
  const html = fs.readFileSync(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /All data is simulated/);
});
test("every declared action has a handler and every fixture room is reachable", () => {
  const ui = fs.readFileSync(
      new URL("../assets/app-preview/ui.mjs", import.meta.url),
      "utf8",
    ),
    app = fs.readFileSync(
      new URL("../assets/app-preview/app.js", import.meta.url),
      "utf8",
    );
  const actions = new Set(
    [...ui.matchAll(/data-action="([a-z-]+)"/g)].map((m) => m[1]),
  );
  for (const a of actions)
    assert.ok(new RegExp("case\\s*[\"']" + a + "[\"']").test(app), a);
  for (const [room] of fixtures.rooms)
    assert.ok(fixtures.messages.some((m) => m.room === room));
});

test("recorded targets, price extrema and Wins use one coherent simulated trade",()=>{
  for(const symbol of SYMBOLS){
    const p=storyPlan(symbol),bars=candles(symbol,"1m");
    const favorable=p.side==="long"?Math.max(...bars.map(b=>b.high)):Math.min(...bars.map(b=>b.low));
    assert.ok(Math.abs(favorable-p.peak)<1e-8,symbol+" peak");
    assert.equal(p.state==="hit",p.best>=Math.abs(p.target-p.entry)-1e-8,symbol+" target outcome");
    const direction=p.side==="long"?1:-1;
    if(p.state!=="invalidated")assert.ok(bars.slice(39).every(b=>direction*(b.close-p.stop)>0),symbol+" remains valid");
    else assert.ok(direction*(bars.at(-1).close-p.stop)<0,symbol+" invalidation");
    for(const screen of ["macd","screener","patterns"]){assert.equal(activePlan({...createState(),screen,symbol}).entry,p.entry);}
    assert.equal(scenarioPlan(symbol,p.side).target,p.target);
    assert.equal(scenarioPlan(symbol,p.side==="long"?"short":"long").state,"watching");
  }
  for(const f of fixtures.patterns){const p=storyPlan(f.symbol);assert.equal(f.bias==="Bullish"?"long":"short",p.side);if(f.status==="Failed")assert.equal(p.state,"invalidated");}
  for(const win of SAMPLE_WINS.filter(w=>w.symbol)){
    const p=storyPlan(win.symbol),sign=p.side==="long"?1:-1;
    assert.ok(sign*(win.exit-p.entry)>0);
    assert.ok(sign*(win.exit-p.peak)<=1e-8);
    assert.equal(demoProfit(win.symbol,win.quantity,win.exit),Math.round(sign*(win.exit-p.entry)*win.quantity*100)/100);
  }
});
test("native onboarding branches reach all four outcomes without dead ends",()=>{
 const outcomes=new Set();
 function visit(id,seen=[]){assert.ok(!seen.includes(id),"quiz cycle");const q=QUIZ[id];assert.ok(q?.answers.length);for(const a of q.answers){if(a.type==="question")visit(a.to,[...seen,id]);else outcomes.add(a.to);}}
 visit("q1");assert.deepEqual([...outcomes].sort(),["marketNewbie","emotionalRollerCoaster","riskRoulettePlayer","timeCruncher"].sort());
});
test("every native screen action is wired including dynamically declared buttons",()=>{
 const app=fs.readFileSync(new URL("../assets/app-preview/app.js",import.meta.url),"utf8");
 const states=SCREENS.map(([screen])=>({...createState(),screen}));
 for(const [screen,detail] of [["aplus","setup"],["macd","stock"],["macd","guide"],["macd","classic"],["patterns","pattern"],["chat","win-compose"],["chat","milestones"],["profile","quick-menu"],["stops","chart"]])states.push({...createState(),screen,detail});
 states.push({...createState(),screen:"chat",room:"Wins"},{...createState(),screen:"menu",menuFor:"macd"},{...createState(),screen:"menu",menuFor:"chat"});
 for(const s of states)for(const [,a] of renderView(s).matchAll(/data-action="([a-z-]+)"/g))assert.ok(app.includes('case "'+a+'"'),a);
});
