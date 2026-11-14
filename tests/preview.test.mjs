import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { candles, storyPlan, activePlan, plan, patternLevels, SYMBOLS, BASE, createState, SCREENS, placeOf, returnTo, sampleDay, escapeHTML } from "../assets/app-preview/core.mjs";
import { fixtures, META } from "../assets/app-preview/ui.mjs";
import { renderNativeView as renderView, nativeHeader, sheetStyle, coverStyle, SAMPLE_WINS } from "../assets/app-preview/native.mjs";

const CODE = ["app.js", "core.mjs", "ui.mjs", "chart.mjs", "native.mjs"];
const read = (file) => fs.readFileSync(new URL("../assets/app-preview/" + file, import.meta.url), "utf8");
const page = (state) => nativeHeader(state) + renderView(state);
// Every screen and every place inside one that the preview can show.
const PLACES = [
  ...SCREENS.map(([screen]) => [screen]),
  ["stops", "details"], ["stops", "plans"], ["stops", "chart"], ["earnings", "event"], ["economy", "event"], ["aplus", "setup"],
  ["macd", "add-ticker"], ["patterns", "pattern"], ["screener", "play"], ["pipbrain", "oi"], ["course", "station"], ["course", "lesson"],
  ["coaching", "coaches"], ["coaching", "coach-money-mike"], ["coaching", "coach-josh"], ["coaching", "book"],
  ["chat", "room"], ["chat", "thread"], ["chat", "menu"], ["chat", "here"], ["chat", "saved"], ["chat", "win-compose"],
  ["profile", "account"], ["profile", "appearance"], ["profile", "notifications"], ["profile", "help"], ["profile", "support"], ["profile", "signout"],
].map(([screen, detail = null]) => ({ ...createState(), screen, detail, thread: "m1" }));

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

test("long and short Stop Finder plans put the stop and targets on the right sides, in whole cents", () => {
  for (const t of SYMBOLS)
    for (const mode of ["swing", "scalp"])
      for (const direction of ["long", "short"]) {
        const p = plan(t, direction, mode);
        assert.ok(p.risk > 0);
        assert.ok(Math.abs(Math.abs(p.entry - p.stop) - p.risk) < 1e-8);
        assert.ok(Math.abs(Math.abs(p.target - p.entry) - p.risk * 2.5) <= 0.005000001);
        for (const value of [p.entry, p.stop, p.target, p.target2, p.risk]) assert.ok(Math.abs(value * 100 - Math.round(value * 100)) < 1e-8);
        assert.ok(direction === "long" ? p.stop < p.entry && p.entry < p.target : p.target < p.entry && p.entry < p.stop);
      }
  assert.equal(plan("NVDA").stop, 184.71);
  assert.match(renderView({ ...createState(), screen: "stops" }), /2\.5x reward to risk/);
});

test("one made-up session a ticker: every tool reads the same prices, and the candles agree with it", () => {
  for (const symbol of SYMBOLS) {
    const p = storyPlan(symbol), bars = candles(symbol, "1m");
    const favorable = p.side === "long" ? Math.max(...bars.map((b) => b.high)) : Math.min(...bars.map((b) => b.low));
    assert.ok(Math.abs(favorable - p.peak) < 1e-8, symbol + " peak");
    assert.equal(p.state === "hit", p.best >= Math.abs(p.target - p.entry) - 1e-8, symbol + " target");
    for (const screen of ["macd", "screener", "patterns", "aplus"]) assert.equal(activePlan({ ...createState(), screen, symbol }).entry, p.entry);
  }
  for (const f of fixtures.patterns) {
    const p = storyPlan(f.symbol);
    assert.equal(f.bias === "Bullish" ? "long" : "short", p.side);
    if (f.status === "Failed") assert.equal(p.state, "invalidated");
  }
});

test("Back returns to where the visitor was and keeps what they made", () => {
  const s = createState();
  Object.assign(s, { screen: "chat", detail: "thread", room: "Wins", thread: "m1", chart: { count: 24, offset: 17 } });
  const place = placeOf(s);
  Object.assign(s, { screen: "profile", detail: null, room: "Trading Floor", thread: null, dark: true, theme: "Dark" });
  s.chart.count = 80;
  s.quick.pop();
  s.messages.push({ text: "Mine" });
  returnTo(s, place);
  assert.deepEqual([s.screen, s.detail, s.room, s.thread], ["chat", "thread", "Wins", "m1"]);
  assert.deepEqual(s.chart, { count: 24, offset: 17 });
  assert.equal(s.dark, true);
  assert.equal(s.quick.length, 5);
  assert.equal(s.messages.length, 1);
  s.chart.count = 40;
  assert.equal(place.chart.count, 24);
});

test("every screen and every place inside one renders, with a name and with no missing data", () => {
  for (const state of PLACES) {
    const html = page(state), where = state.screen + "/" + state.detail;
    assert.ok(html.length > 150, where);
    assert.doesNotMatch(html, /undefined|NaN|\[object/, where);
    assert.ok(META[state.screen], where);
  }
  assert.match(renderView({ ...createState(), screen: "chat", detail: "room", search: "not-found-abc" }), /No matching messages/);
  assert.match(renderView({ ...createState(), screen: "chat", detail: "room", room: "Dividend Chat" }), /Message Dividend Chat/);
});

test("the preview's dates follow the week it is opened in", () => {
  for (const from of [new Date(2026, 10, 9), new Date(2026, 10, 13), new Date(2026, 10, 15)]) {
    const d = sampleDay(0, from);
    assert.equal(d.weekday, "Tuesday");
    assert.equal(d.day, from.getDay() === 0 ? 17 : 10, String(from));
  }
  assert.equal(sampleDay(-1, new Date(2026, 10, 13)).weekday, "Monday");
});

test("a sheet has a way to close and a full screen has a way out", () => {
  for (const state of PLACES) {
    const html = page(state), where = state.screen + "/" + state.detail;
    if (state.screen === "home") continue;
    assert.match(html, /data-action="(back|close|home|sign-in|lesson-finish)"|data-screen="home"/, where);
    if (sheetStyle(state)) assert.match(html, /sheet-handle/, where);
  }
  assert.ok(coverStyle({ screen: "coaching" }) && coverStyle({ screen: "course" }) && !coverStyle({ screen: "stops" }));
});

test("what a visitor types is escaped wherever it is shown", () => {
  const attack = "<img src=x onerror=alert(1)>";
  assert.equal(escapeHTML(attack), "&lt;img src=x onerror=alert(1)&gt;");
  const mine = { id: "x", room: "Trading Floor", name: "You", avatar: "Y", time: "10:42 AM", text: attack };
  const states = [
    { screen: "chat", detail: "room", messages: [mine], drafts: { "Trading Floor": attack }, search: attack, showChatSearch: true },
    { screen: "chat", messages: [mine] },
    { screen: "chat", detail: "room", room: "Wins", wins: [{ id: "w", name: "You", avatar: "Y", time: "10:42 AM", kind: "Learned something", note: attack }] },
    { screen: "assistant", pipQuestion: attack, pipAnswer: attack },
    { screen: "profile", detail: "support", helpMessages: [attack] },
    { screen: "patterns", lookup: attack },
  ];
  for (const extra of states) assert.ok(!page({ ...createState(), ...extra }).includes(attack), JSON.stringify(extra).slice(0, 60));
});

test("the preview calls no service, stores nothing, asks for no notification and links nowhere", () => {
  const code = CODE.map(read).join("\n");
  assert.doesNotMatch(code, /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|Notification\.requestPermission|serviceWorker|import\s*\(/);
  assert.doesNotMatch(code, /https?:\/\/|href=|window\.open|location\.(href|assign|replace)|whop\.com/i);
  for (const state of PLACES) assert.doesNotMatch(page(state), /<a\b|href=|https?:\/\//, state.screen + "/" + state.detail);
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /connect-src https:\/\/www\.facebook\.com https:\/\/connect\.facebook\.net https:\/\/grbywbmbiewrxqbfsxpf\.supabase\.co;/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /All data is simulated/);
});

test("every button and form the screens draw is wired, and every shipped file is used", () => {
  const app = read("app.js");
  for (const state of [...PLACES, { ...createState(), screen: "quick", quickChanged: true, quick: ["macd", "stops", "chat"] }, { ...createState(), screen: "chat", detail: "menu", chatRead: false }, { ...createState(), screen: "course", detail: "lesson", lessonStep: 1 }, { ...createState(), screen: "course", detail: "lesson", lessonStep: 2 }, { ...createState(), screen: "stops", plans: [{ symbol: "NVDA", direction: "long", mode: "swing" }] }]) {
    const html = page(state);
    for (const [, a] of html.matchAll(/data-action="([a-z-]+)"/g)) assert.ok(app.includes(`case "${a}"`), a);
    for (const [, f] of html.matchAll(/data-form="([a-z-]+)"/g)) assert.ok(app.includes(`"${f}"`), f);
    for (const [, id] of html.matchAll(/data-screen="([a-z]+)"/g)) assert.ok(META[id], id);
    for (const [, key] of html.matchAll(/data-action="set"[^>]*data-key="(\w+)"/g)) assert.ok(key in createState() || /stopMode|stopDirection|aplusFrame/.test(key), key);
    for (const [, src] of html.matchAll(/src="(assets\/[^"]+)"/g)) assert.ok(fs.existsSync(new URL("../" + src, import.meta.url)), src);
  }
  const used = CODE.map(read).join("\n") + read("home.css") + read("native.css") + fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const walk = (dir) => fs.readdirSync(new URL(dir, import.meta.url), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(dir + e.name + "/") : [dir + e.name]));
  for (const file of walk("../assets/app-preview/")) {
    const name = file.split("/").pop();
    if (name === "LICENSE.txt") continue;
    const stem = name.replace(/^chat-room-/, "").replace(/\.jpg$/, "");
    assert.ok(used.includes(name) || /media\/(coaches|rooms)\//.test(file) && used.includes(stem), file + " is used");
  }
});

test("Patterns shows the app's stages and a setup keeps only the lines the app keeps at its stage", () => {
  const p = storyPlan("NVDA"), names = (status) => patternLevels(status, p).map(([, name]) => name);
  assert.deepEqual(names("Formed"), ["Move", "Confirm", "Line", "Fail"]);
  assert.deepEqual(names("Retest"), ["Move", "Retest", "Fail"]);
  assert.ok(!names("Measured move").includes("Fail"));
  assert.ok(!names("Failed").includes("Move"));
  const pltr = storyPlan("PLTR"), last = candles("PLTR", "1d").at(-1);
  assert.equal(last.close, pltr.current);
  assert.equal(last.high, pltr.peak);
  const detail = (symbol, extra = {}) => renderView({ ...createState(), screen: "patterns", detail: "pattern", symbol, ...extra });
  assert.match(detail("META"), /✓ Upward break confirmed/);
  assert.match(detail("PLTR"), /Formed · awaiting confirmation/);
  assert.match(detail("AMD"), /Retest held/);
  assert.match(detail("GOOGL"), /Setup failed/);
  assert.match(detail("MSFT", { rules: true }), /CONFIRMED BELOW/);
  assert.match(detail("AAPL", { rules: true }), /REACHED/);
  assert.match(detail("AMD", { rules: true }), /INVALIDATION/);
  assert.doesNotMatch(detail("MSFT"), /Retest/, "a candle setup has no retest");
  // A finished setup plans no stop, as in the app; a live one does.
  for (const symbol of ["NVDA", "GOOGL"]) assert.match(detail(symbol), /data-action="to-stops" disabled/, symbol);
  for (const symbol of ["PLTR", "META", "AMD"]) assert.doesNotMatch(detail(symbol), /disabled/, symbol);
  for (const file of CODE) assert.doesNotMatch(read(file), /forming/i, file);
});

test("the sample wins claim no trade", () => {
  for (const win of SAMPLE_WINS) {
    assert.ok(["Followed my plan", "Learned something"].includes(win.kind));
    assert.doesNotMatch(win.note, /\$\d|%|profit|gain/i);
  }
});
