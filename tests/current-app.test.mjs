import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createState } from "../assets/app-preview/core.mjs";
import { renderNativeView as render } from "../assets/app-preview/native.mjs";
import { QUIZ } from "../assets/app-preview/native-quiz.mjs";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const screen = (name, extra = {}) => render({ ...createState(), screen: name, ...extra });
const quizAnswers = Object.values(QUIZ).flatMap((q) => q.answers.map((a) => a.text));

test("tools the app has switched off stay out of Home, the quick bar and the menus", () => {
  assert.deepEqual(createState().quick, ["macd", "patterns", "stops", "chat"]);
  for (const html of [screen("home"), screen("menu"), screen("profile", { detail: "quick-menu" })]) {
    assert.doesNotMatch(html, /A\+ Scalps|Screener/);
  }
});

test("Home runs in the app's order with its current rows", () => {
  const html = screen("home");
  const order = ["Today", "Stop Finder", "Earnings", "Economy", "MACD", "Patterns", "Trading style quiz", "Options course", "Coaching", "Chat", "Live"];
  let at = -1;
  for (const label of order) {
    const next = html.indexOf(`>${label}<`, at + 1);
    assert.ok(next > at, `${label} is out of order or missing`);
    at = next;
  }
});

test("the Options course and Coaching screens open, and the course leads to the free web course", () => {
  const course = screen("course");
  assert.match(course, /0 of 28 lessons done/);
  assert.match(course, /href="https:\/\/app\.thefriendlytrader\.com\/learn"/);
  assert.equal((course.match(/class="n-lesson"/g) || []).length, 28);
  assert.match(screen("coaching"), /Money Mike/);
});

test("the preview shows no invented trade results", () => {
  const pages = [screen("home"), screen("stream"), screen("macd"), screen("chat", { room: "Wins" }), screen("chat", { detail: "win-compose" })];
  for (const html of pages) {
    assert.doesNotMatch(html, /Target hit|peak gain|Trade win|targets reached|n-win-move|underlying price move/);
    assert.doesNotMatch(html, /\+\$\d/);
  }
});

test("nothing promises a feature the app does not have", () => {
  assert.doesNotMatch(screen("stops"), /Position size|n-size/);
  assert.match(screen("stops"), /Good reward\/risk/);
  for (const html of [screen("live"), screen("earnings", { detail: "event", event: "earn-1" }), screen("economy", { detail: "event", event: "econ-1" })]) {
    assert.doesNotMatch(html, /Remind me|Preview lesson/);
  }
  assert.doesNotMatch(screen("macd"), /MORNING TRADES/);
  assert.doesNotMatch(screen("macd", { detail: "stock" }), /THE ROAD/);
  assert.doesNotMatch(screen("menu", { menuFor: "macd" }), /How to read MACD/);
  assert.doesNotMatch(screen("profile"), /Watch the film|Your trading profile/);
  assert.doesNotMatch(screen("economy"), /—/);
});

test("the quiz uses the app's wording", () => {
  for (const text of ["5-9%", "Under 5%", "Hold and hope it comes back"]) assert.ok(quizAnswers.includes(text), text);
  for (const text of ["5-10%", "1-5%", "HODL, hope it comes back"]) assert.ok(!quizAnswers.includes(text), text);
  const welcome = screen("onboarding");
  assert.match(welcome, /Trade smarter, free to start/);
  assert.match(welcome, /Take the 60-second quiz/);
  const result = screen("onboarding", { quizStage: "result", quizResult: "riskRoulettePlayer" });
  assert.match(result, /Your biggest weakness/);
  assert.match(result, /HOW WE FIX IT/);
  assert.match(result, /Open Stop Finder/);
});

test("the public pages keep to the copy rules and the old interactive film stays off", () => {
  const home = read("../index.html");
  const faq = read("../faq/index.html");
  for (const html of [home, faq]) {
    assert.doesNotMatch(html, /plain English|plain words|—/);
  }
  assert.doesNotMatch(home, /data-site="tour"/);
  assert.match(home, /href="https:\/\/app\.thefriendlytrader\.com\/learn"/);
  assert.match(home, /plan_0jiK0r8Agdru8/);
  assert.match(home, /plan_qPuvfVGzKgEPW/);
  assert.match(home, /id="membership"/, "the app's profile action scrolls here");
  assert.match(home, /data-site="explore"/, "Try the app must open the real preview");
  assert.match(home, /id="preview-stage"/);
  assert.doesNotMatch(home, /A\+ Scalps/);
  assert.doesNotMatch(read("../assets/app-preview/app.js"), /Try opening A\+ Scalps|film-launch|sizing box/);
});

test("the home page ships what it references and keeps the preview's content rules", () => {
  const home = read("../index.html");
  const js = read("../assets/app-preview/page.js");
  const refs = [...home.matchAll(/(?:src|href|poster)="(assets\/[^"]+)"/g), ...js.matchAll(/'(assets\/home\/[^']+)'/g)].map((m) => m[1]);
  assert.ok(refs.length > 8);
  for (const ref of refs) assert.ok(fs.existsSync(new URL(`../${ref}`, import.meta.url)), ref);
  assert.match(home, /connect-src 'none'/);
  assert.doesNotMatch(home, /fonts\.googleapis|fonts\.gstatic/);
  const css = read("../assets/app-preview/page.css");
  for (const font of ["young-serif", "figtree"]) assert.ok(css.includes(`url(../fonts/${font}.woff2)`), font);
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|localStorage/);
});

test("the home page stays plain: it says what the app is, offers two things, and scrolls like any page", () => {
  const home = read("../index.html");
  const js = read("../assets/app-preview/page.js");
  const css = read("../assets/app-preview/page.css");
  const heroAt = home.indexOf('class="g-hero"');
  const hero = home.slice(heroAt, home.indexOf("</section>", heroAt));
  assert.match(hero, /<h1[^>]*>The friendly trading&nbsp;app\.<\/h1>/);
  assert.equal((hero.match(/<(a|button)\b/g) || []).length, 2, "two things to press on the first screen");
  assert.doesNotMatch(css, /position:\s*(sticky|fixed)/, "nothing pinned to the screen");
  assert.doesNotMatch(js, /addEventListener\(\s*['"]scroll/, "nothing driven by scrolling");
});

test("each phone on the home page opens a screen the preview really has", () => {
  const home = read("../index.html");
  const opens = [...home.matchAll(/class="g-shot" data-open="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(opens, ["stops", "course", "assistant"]);
  for (const name of opens) assert.ok(screen(name).length > 200, name);
  assert.match(home, /class="g-shot" data-site="explore"/);
});
