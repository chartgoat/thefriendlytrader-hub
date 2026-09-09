import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  candles,
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
import { renderView, fixtures } from "../assets/app-preview/ui.mjs";

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
        assert.ok(Math.abs(Math.abs(p.target - p.entry) / p.risk - 2) < 1e-8);
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
  ];
  for (const [screen, detail] of variants) {
    const s = { ...createState(), screen, detail, thread: "m1" };
    assert.ok(!/undefined|NaN/.test(renderView(s)), screen + "/" + detail);
  }
  assert.match(
    renderView({ ...createState(), screen: "earnings", day: 0 }),
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
      quizStep: 3,
      quizAnswers: [0, 1, 0],
    }),
    /Start with Stop Finder/,
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
  const code = ["app.js", "core.mjs", "ui.mjs", "chart.mjs"]
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
