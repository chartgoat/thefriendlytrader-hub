import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createState, HIDDEN_TOOLS, QUICK_DEFAULT, SCREENS } from "../assets/app-preview/core.mjs";
import { fixtures } from "../assets/app-preview/ui.mjs";
import { renderNativeView as render, nativeHeader, COURSE, hourRange } from "../assets/app-preview/native.mjs";

// The preview shows a signed-in member's iPhone as the app was in TestFlight 202611132217 (November 13, 2026), with the
// tools the owner had switched on that day and Home in the order the owner published.
const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");
const screen = (name, extra = {}) => render({ ...createState(), screen: name, ...extra });
const header = (name, extra = {}) => nativeHeader({ ...createState(), screen: name, ...extra });
const text = (html) => html.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
const EVERY = [
  ...SCREENS.map(([id]) => [id]), ["stops", { detail: "details" }], ["earnings", { detail: "event" }], ["economy", { detail: "event" }], ["aplus", { detail: "setup" }],
  ["patterns", { detail: "pattern" }], ["screener", { detail: "play" }], ["pipbrain", { detail: "oi" }], ["course", { detail: "station" }], ["course", { detail: "lesson" }],
  ["coaching", { detail: "coaches" }], ["coaching", { detail: "book" }], ["chat", { detail: "room" }], ["chat", { detail: "room", room: "Wins" }],
  ["profile", { detail: "account" }], ["profile", { detail: "notifications" }], ["profile", { detail: "support" }], ["profile", { detail: "signout" }],
].map(([id, extra = {}]) => header(id, extra) + screen(id, extra));

test("Home runs in the order the owner published, each door once, with one live line and no door the app has dropped", () => {
  const html = screen("home");
  const order = ["Today", "Afternoon Breakouts w/ Guppy", "Earnings", "Stop Finder", "Economy", "A+ Scalps", "MACD", "Patterns", "Big Money", "Pip Brain", "Screener", "Options Course", "Coaching", "Chat"];
  let at = -1;
  for (const label of order) {
    const next = html.indexOf(`>${label}<`, at + 1);
    assert.ok(next > at, `${label} is out of order or missing`);
    at = next;
  }
  const doors = [...html.matchAll(/data-screen="([a-z]+)"/g)].map((m) => m[1]);
  assert.deepEqual(doors, ["stream", "live", "earnings", "stops", "economy", "aplus", "macd", "patterns", "bigmoney", "pipbrain", "screener", "course", "coaching", "chat"]);
  assert.doesNotMatch(html, /Trading style quiz|Explore all|Edit Home|Options course|Live calendar|Sessions/);
  assert.match(html, /Market’s open\./);
  assert.match(html, /Today 1:30 PM ET · 1 more today/);
  assert.match(html, /Your exit/);
  assert.match(html, /Level 1 of 28/);
  assert.match(html, /10 coaches/);
  assert.match(html, /Overnight call &amp; put ΔOI/);
  const top = header("home");
  assert.match(top, />Friendly Trader</);
  assert.match(top, /aria-label="Announcements, 1 new"[\s\S]*>Help<[\s\S]*aria-label="Your profile"/);
});

test("the quick menu is the member's default six, and a tool the owner switches off leaves Home and every list", () => {
  assert.deepEqual(createState().quick, ["macd", "patterns", "screener", "stops", "aplus", "chat"]);
  assert.deepEqual(QUICK_DEFAULT, createState().quick);
  assert.deepEqual(HIDDEN_TOOLS, [], "read from the app's live switches on November 13, 2026");
  const editor = screen("quick");
  assert.match(editor, /Pick 3 to 6\. Drag to reorder\./);
  assert.match(editor, /In your bar[\s\S]*Add more/);
  HIDDEN_TOOLS.push("aplus", "screener");
  try {
    for (const html of [screen("home"), screen("quick"), screen("stream"), screen("profile", { detail: "notifications" })]) assert.doesNotMatch(html, /A\+ S|Screener/i);
  } finally {
    HIDDEN_TOOLS.length = 0;
  }
  assert.match(screen("home"), /A\+ Scalps[\s\S]*Screener/);
  assert.match(read("../assets/app-preview/app.js"), /HIDDEN_TOOLS\.includes\(screen\)/, "a switched-off tool's route opens Home");
});

test("tool pages wear the app's top: the house, the page's mark and name, then Pip", () => {
  for (const [id, name] of [["stops", "Stop Finder"], ["stream", "Today"], ["macd", "MACD"], ["patterns", "Friendly Patterns"], ["aplus", "A+ Scalps"], ["screener", "Screener"], ["earnings", "Earnings"], ["economy", "Economy"], ["bigmoney", "Big Money"], ["pipbrain", "Pip Brain"], ["chat", "Chat"]]) {
    const top = header(id);
    assert.match(top, new RegExp(`aria-label="Home"[\\s\\S]*<span>${name.replace("+", "\\+")}</span>[\\s\\S]*aria-label="Pip, your Friendly Assistant"`), id);
    assert.equal(/class="gold"/.test(top), ["macd", "aplus"].includes(id), id + " gold");
  }
  assert.doesNotMatch(read("../assets/app-preview/app.js") + read("../assets/app-preview/native.mjs"), /n-floating|n-float-pip/, "Pip is in the top, not floating");
});

test("the Options Course is a member's 28 levels: not free, nothing to buy, no way out of the preview", () => {
  const course = header("course") + screen("course");
  assert.deepEqual(COURSE.map(([name, titles]) => [name, titles.length]), [["Follow along", 7], ["First trade", 6], ["Manage it", 7], ["Strategies", 8]]);
  assert.equal((course.match(/class="c-level /g) || []).length, 28);
  assert.match(course, /0 of 28/);
  assert.match(course, /Learn options in 28 short levels\./);
  assert.match(course, /Play level 1<\/strong><small>Calls</);
  const all = [course, screen("course", { detail: "station", courseLevel: 1 }), screen("course", { detail: "station", courseLevel: 5 }), ...[0, 1, 2].map((lessonStep) => screen("course", { detail: "lesson", lessonStep }))].join("");
  assert.doesNotMatch(all, /free|<a\b|href=|\/learn|Start lesson/i);
  assert.match(all, /Levels 2 to 28 are in the app/);
  assert.match(all, /A call is a bet that the stock goes up\./);
  assert.match(all, /Level 1 done/);
  for (const html of EVERY) assert.doesNotMatch(text(html), /free (options )?(course|lessons|levels)|course is free|Start the free/i);
});

// Owner, November 16 2026: "the option course should be able to see the course but only be able to play level 1".
test("a visitor sees all 28 levels and can play level 1 only, before and after finishing it", () => {
  for (const courseDone of [0, 1]) {
    const map = screen("course", { courseDone });
    assert.equal((map.match(/class="c-level /g) || []).length, 28, "every level is on the map");
    assert.equal((map.match(/class="c-level ahead"/g) || []).length, 27, "levels 2 to 28 are locked");
    assert.match(map, new RegExp(`class="c-level ${courseDone ? "done" : "now"}"[^>]*data-value="1"|data-value="1"[^>]*class="c-level ${courseDone ? "done" : "now"}"`));
    for (let level = 1; level <= 28; level++) {
      const html = map + screen("course", { courseDone, detail: "station", courseLevel: level });
      const plays = [...html.matchAll(/data-action="play-level"[^>]*data-value="(\d+)"|data-value="(\d+)"[^>]*data-action="play-level"/g)].map((m) => m[1] || m[2]);
      assert.ok(plays.length >= 1 && plays.every((n) => n === "1"), `level ${level}: the only level to play is 1`);
      assert.doesNotMatch(html, /Play level (?!1\b)\d+/, `level ${level}: no button names another level`);
      if (level > 1) assert.match(html, /Levels 2 to 28 are in the app/);
    }
  }
  const app = read("../assets/app-preview/app.js");
  assert.match(app, /case "play-level":\s*if \(Number\(v\) !== 1\) return/, "the action itself refuses any level but 1");
});

test("Coaching opens on a calendar: See all coaches, fourteen days, one row a coach with their own hours", () => {
  const html = screen("coaching");
  const rows = html.match(/class="n-coach-row"/g) || [];
  assert.ok(rows.length > 3, "several coaches on a day");
  const names = [...html.matchAll(/n-coach-who"[^>]*>.*?<strong>(.*?)<\/strong>/g)].map((m) => m[1]);
  assert.equal(new Set(names).size, names.length, "each coach once");
  assert.equal((html.match(/class="n-coach-photo /g) || []).length, rows.length);
  assert.equal((html.match(/data-action="coach-day"/g) || []).length, 14);
  assert.doesNotMatch(html, /data-action="coach-day"[^>]*disabled/, "no day is closed");
  assert.match(html, /See all coaches/);
  assert.match(html, /All topics/);
  assert.match(html, /1-on-1, 1 hr, \$200/);
  assert.equal(hourRange(240), "4–5 AM");
  assert.equal(hourRange(690), "11:30 AM–12:30 PM");
  assert.equal(hourRange(1110), "6:30–7:30 PM");
  assert.match(html, /class="n-coach-time"[^>]*>\d/);
  assert.doesNotMatch(html + screen("coaching", { detail: "coaches" }), /Spin|Giveaway|Practice|wheel|Have a code|Opens soon/i, "no giveaway while its legal hold stands");
  const top = header("coaching");
  assert.match(top, /aria-label="Close Coaching"[\s\S]*Coaching/);
  assert.doesNotMatch(top, /Coaches/);
  const book = header("coaching", { detail: "book" }) + screen("coaching", { detail: "book", bookCoach: "ms-mary", bookTime: 240 });
  assert.match(book, />Book<[\s\S]*Ms\. Mary[\s\S]*1-on-1 coaching[\s\S]*Pay \$200/);
});

test("the Coaches list holds all 10, with Josh as Founder, and every photo is on disk", () => {
  const html = screen("coaching", { detail: "coaches" });
  assert.equal((html.match(/class="n-coach-listed"/g) || []).length, 10);
  assert.doesNotMatch(html, /Tribal Trades|Stock Brotha/);
  assert.match(html, /<strong>Josh<span class="n-tag gold">Founder<\/span><\/strong>/);
  for (const [, id] of html.matchAll(/media\/coaches\/([\w-]+)\.jpg/g)) assert.ok(fs.existsSync(new URL(`../assets/app-preview/media/coaches/${id}.jpg`, import.meta.url)), id);
  assert.doesNotMatch(screen("coaching"), /<strong>Josh<\/strong>/, "no bookable times for the founder here");
  assert.match(screen("coaching", { detail: "coach-money-mike" }), /Money Mike[\s\S]*Crown Trader[\s\S]*Teaches/);
  const options = screen("coaching", { coachTopic: "Options", coachDay: 0 }) + screen("coaching", { coachTopic: "Options", coachDay: 1 });
  assert.match(options, /AirTuan/);
  assert.doesNotMatch(options, /Money Mike/);
});

test("the preview shows no results of trades, alerts or signals", () => {
  for (const html of EVERY) {
    assert.doesNotMatch(html, /Target hit|peak gain|Trade win|TRADE WIN|targets reached|after the alert|SINCE CALL|MAX MOVE|SINCE SIGNAL|Best move|reached T1|reached T2|Session recap|MAG7 board|n-win-move/);
    assert.doesNotMatch(text(html), /\+\$\d/);
  }
  const macd = screen("macd");
  assert.match(macd, /CALLED AT[\s\S]*LAST/);
  assert.doesNotMatch(screen("aplus"), /attempts/);
  const money = screen("bigmoney") + screen("bigmoney", { moneyTab: "People" });
  assert.match(money, /Sample funds\. Not real filings\./);
  assert.doesNotMatch(money, /Senat|Rep\.|Congress|President|Pelosi|Buffett|Berkshire|Cook\b|since \w+ est\./i, "made-up funds only");
});

test("nothing promises a feature the app does not have, and nothing sounds machine-written", () => {
  assert.doesNotMatch(screen("stops") + screen("stops", { detail: "details" }), /Position size|shares|n-size|Share plan|FRIENDLY TRADER TOOLS/);
  assert.match(screen("stops"), /Good reward\/risk/);
  assert.match(screen("stops"), /placeholder="Search any stock…"/);
  for (const html of EVERY) {
    assert.doesNotMatch(html, /Remind me|Preview lesson|Watch the film|Your trading profile|Replay|guided tour|See membership|View website membership/);
    assert.doesNotMatch(text(html), /—|seamless|unlock|empower|\bAI\b|artificial|assistant ·|chatbot/i);
  }
  assert.match(header("assistant"), />Pip</);
});

test("the welcome screen is the app's first screen, reached by signing out; there is no quiz", () => {
  const welcome = screen("welcome");
  assert.match(welcome, /Trading tools,<br>free to start/);
  assert.match(welcome, /Earnings, Stop Finder and Economy are free\./);
  assert.match(welcome, /No account needed\./);
  assert.match(welcome, />Open the app<[\s\S]*>Already a member\? Sign in</);
  assert.equal(nativeHeader({ ...createState(), screen: "welcome" }), "");
  assert.match(screen("profile", { detail: "signout" }), /Sign out\?[\s\S]*Your membership stays on Whop\. Sign back in any time\./);
  for (const file of ["app.js", "core.mjs", "native.mjs", "ui.mjs"]) assert.doesNotMatch(read("../assets/app-preview/" + file), /quiz|onboarding|persona/i, file);
  assert.equal(fs.existsSync(new URL("../assets/app-preview/native-quiz.mjs", import.meta.url)), false);
});

test("Settings, Help and Chat use the app's own words", () => {
  const settings = header("profile") + screen("profile");
  for (const words of ["Settings", "Your account", "Active", "My sessions", "Help chat", "Message us", "Appearance", "Theme and reading size", "Notifications", "Push alerts and catalyst chips", "Tours and support", "Sign out"]) assert.ok(settings.includes(`>${words}<`), words);
  assert.match(screen("profile", { detail: "account" }), /Trader Tier[\s\S]*Every tool[\s\S]*Community chats[\s\S]*Live with Josh[\s\S]*Crown Traders live/);
  const help = header("profile", { detail: "support" }) + screen("profile", { detail: "support" });
  assert.match(help, />Help<[\s\S]*How can we help\?[\s\S]*Our team will reply here\.[\s\S]*placeholder="Message"/);
  assert.match(screen("profile", { detail: "support", helpMessages: ["hi"] }), /Nothing was sent\./);
  const chat = header("chat") + screen("chat");
  assert.deepEqual(fixtures.rooms.map(([name]) => name), ["Trading Floor", "Options Chat", "Dividend Chat", "Asian Cafe", "Girls Army vs. Wall Street", "Wins"]);
  assert.match(chat, /<b>6<\/b> new[\s\S]*Mark all read[\s\S]*Talked about now[\s\S]*Crowned Traders[\s\S]*SWJ Alerts[\s\S]*Trading Floor/);
  assert.match(chat, /▲ 1\.8%[\s\S]*▼ 0\.9%/);
  assert.doesNotMatch(chat, /GOAT Alerts|>Announcements</);
  assert.match(screen("chat", { chatRead: true }), /All read/);
  assert.match(screen("chat", { detail: "room" }), /placeholder="Message Trading Floor"/);
  const wins = header("chat", { detail: "room", room: "Wins" }) + screen("chat", { detail: "room", room: "Wins" });
  assert.match(wins, /Share your first win[\s\S]*FOLLOWED MY PLAN[\s\S]*>Cheer · 8<[\s\S]*placeholder="Cheer someone on"/);
  assert.doesNotMatch(wins, /YOUR WINS|3 of 3/);
  assert.match(screen("chat", { detail: "room", room: "Announcements" }), /Team posts only/);
});

test("the Live calendar is a sheet of the app's weekly plan, every coming row counting down", () => {
  const html = header("live") + screen("live");
  assert.match(html, /Live calendar<small>All times ET<\/small>[\s\S]*>Done</);
  assert.match(html, /TODAY · TUE, [\s\S]*TOMORROW · WED, /);
  assert.match(html, /Afternoon Breakouts w\/ Guppy<\/strong><small>Guppy · 85 min<\/small><\/span><b><span class="n-tag up">NEXT<\/span>in 2h 48m<\/b>/);
  assert.equal((html.match(/>NEXT</g) || []).length, 1);
  assert.match(html, /class="c-live-row ended[\s\S]*Live Trade w\/ Money Mike/);
  assert.doesNotMatch(html, /Chart Reading Workshop|Friendly Trader team|Remind|Join/);
});

test("Today, Earnings and Economy read as the app's pages do", () => {
  const today = screen("stream");
  assert.match(today, /MARKET OPEN · CLOSES 4:00 PM ET[\s\S]*Morning\.[\s\S]*COMING UP[\s\S]*Power hour starts at 3:00 PM ET\.[\s\S]*Now · 10:42 AM ET[\s\S]*EARLIER TODAY/);
  const earnings = screen("earnings");
  assert.match(earnings, /MAJOR REPORT[\s\S]*\$AAPL[\s\S]*After the close[\s\S]*Week of \w+ \d+, 20\d\d[\s\S]*Before open · ☾ After close[\s\S]*TODAY[\s\S]*1 reporting after today’s close[\s\S]*Next week’s reports land on Sunday\./);
  assert.doesNotMatch(earnings + screen("economy"), /Who reports this week\.|The events that move markets\.|week-back|week-forward/);
  assert.match(screen("earnings", { calendarTab: "Reported" }), /Out at 4:05 PM ET · \$2\.12 vs \$2\.05 expected/);
  const economy = screen("economy");
  assert.match(economy, /This week’s read[\s\S]*Next catalyst[\s\S]*TUESDAY · \w+ \d+[\s\S]*CPI Inflation Report[\s\S]*Out · 8:30 AM ET[\s\S]*EXPECTED 2\.9%[\s\S]*ACTUAL 2\.8%[\s\S]*Quiet day[\s\S]*Jobless Claims/);
});

test("the public pages keep to the copy rules and the old interactive film stays off", () => {
  const home = read("../index.html");
  const faq = read("../faq/index.html");
  for (const html of [home, faq]) {
    assert.doesNotMatch(html, /plain English|plain words|—/);
  }
  assert.doesNotMatch(home, /data-site="tour"/);
  assert.match(home, /data-site="explore"/, "Try the app must open the real preview");
  assert.match(home, /id="preview-stage"/);
  assert.doesNotMatch(home, /A\+ Scalps/);
  assert.doesNotMatch(read("../assets/app-preview/app.js"), /Try opening A\+ Scalps|film-launch|sizing box/);
});

// Owner, November 13 2026: "the options course is not free the only 2 parts of this site that I like and want to keep
// is everything above see how it works ... fully updates to where things are at now with no duplicates".
test("the home page is the first screen and the app's screens, and nothing else", () => {
  const home = read("../index.html");
  const main = home.slice(home.indexOf("<main"), home.indexOf("</main>"));
  assert.deepEqual([...main.matchAll(/<section class="([\w-]+)"/g)].map((m) => m[1]), ["g-preview", "g-hero", "g-inside"]);
  assert.doesNotMatch(home, /film-watch|what-now|See how it works|id="membership"|g-plans|whop\.com\/checkout|Big market/);
  assert.equal(fs.existsSync(new URL("../assets/film", import.meta.url)), false, "the film is off the site, not only off the page");
});

test("nothing on the public pages calls the options course free", () => {
  for (const page of ["../index.html", "../faq/index.html"]) {
    const html = read(page);
    assert.doesNotMatch(html, /free (options )?(course|lessons)|course is free|Start the free/i, page);
    assert.doesNotMatch(html, /app\.thefriendlytrader\.com\/learn/, page);
  }
  assert.match(read("../index.html"), /Learn options<br \/>in 28 short levels\./);
});

test("nothing on the home page is offered twice", () => {
  const home = read("../index.html");
  const main = home.slice(home.indexOf('class="g-hero"'), home.indexOf("</main>"));
  const pressed = [...main.matchAll(/<(?:a|button)\b[^>]*>(?:\s*<[^>]+>)*([^<]+)/g)].map((m) => m[1].trim()).filter((t) => !/,$/.test(t));
  assert.deepEqual(pressed.filter((t, i) => pressed.indexOf(t) !== i), []);
  const links = [...home.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => m[1]).filter((h) => h !== "#main");
  assert.deepEqual(links.filter((h, i) => links.indexOf(h) !== i), []);
  assert.deepEqual([...home.matchAll(/<footer class="g-foot">[\s\S]*?<\/footer>/g)].length, 1);
  assert.deepEqual([...home.slice(home.indexOf('class="g-foot"')).matchAll(/<a href="[^"]+"[^>]*>([^<]+)<\/a>/g)].map((m) => m[1]), ["Help &amp; FAQ", "Terms", "Privacy"]);
});

test("the home page ships what it references and keeps the preview's content rules", () => {
  const home = read("../index.html");
  const js = read("../assets/app-preview/page.js");
  const refs = [...home.matchAll(/(?:src|href|poster)="(assets\/[^"]+)"/g), ...js.matchAll(/'(assets\/home\/[^']+)'/g)].map((m) => m[1]);
  assert.ok(refs.length > 8);
  for (const ref of refs) assert.ok(fs.existsSync(new URL(`../${ref}`, import.meta.url)), ref);
  for (const file of fs.readdirSync(new URL("../assets/home/", import.meta.url))) assert.ok(refs.includes(`assets/home/${file}`) || file === "wall.jpg", `assets/home/${file} is used`);
  assert.match(home, /connect-src https:\/\/www\.facebook\.com https:\/\/connect\.facebook\.net https:\/\/grbywbmbiewrxqbfsxpf\.supabase\.co;/);
  assert.doesNotMatch(home, /fonts\.googleapis|fonts\.gstatic/);
  const css = read("../assets/app-preview/page.css");
  for (const font of ["young-serif", "figtree"]) assert.ok(css.includes(`url(../fonts/${font}.woff2)`), font);
  assert.ok(css.includes("url(../home/wall.jpg)"));
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

test("MACD is the new page: Open Side from the open, one card, a call a ticker, no plan, stop or target", () => {
  const macd = (extra = {}) => screen("macd", extra);
  assert.match(header("macd"), /class="gold"[\s\S]*<span>MACD<\/span>/);
  assert.match(macd(), /Open Side[\s\S]*1-min from the 9:30 AM ET open[\s\S]*\+ Add ticker[\s\S]*>1 min<[\s\S]*>5 min<[\s\S]*Mixed day[\s\S]*4 above zero, 3 below/);
  assert.match(macd(), /LONG · LIVE[\s\S]*>Buy<[\s\S]*Enter on a dip[\s\S]*NVDA · long · called 9:35 AM ET[\s\S]*WHY · ABOVE 0, WIDENING[\s\S]*ENTRY/);
  assert.match(macd({ symbol: "MSFT" }), /SHORT · LIVE[\s\S]*>Sell<[\s\S]*Enter on a rally[\s\S]*SHORTED AT/);
  assert.match(macd({ symbol: "AMZN" }), /WATCHING[\s\S]*No signal/);
  assert.match(macd({ symbol: "GOOGL" }), /CLOSED[\s\S]*Done for today/);
  assert.equal((macd().match(/data-action="ticker"/g) || []).length, 7);
  assert.doesNotMatch(macd() + header("macd"), /MACD Analyzer|Scalp|Long term|Trading window|All signals|STOP|TARGET|watchlist|Mag 7|HOW IT WENT|>CALL</);
  assert.match(header("macd", { detail: "add-ticker" }) + macd({ detail: "add-ticker" }), /Add ticker[\s\S]*Search any stock…[\s\S]*Up to 5, kept on this phone[\s\S]*YOUR TICKERS/);
});

test("A+ Scalps, Patterns, Screener, Pip Brain and Big Money read as the app's pages do", () => {
  const aplus = screen("aplus");
  assert.match(aplus, /Morning Setups Posted 9:15 AM ET[\s\S]*Trading window · 9 to 11:30 AM ET[\s\S]*>1M<[\s\S]*>2M<[\s\S]*>5M<[\s\S]*ACTIVE[\s\S]*CONFIRMED[\s\S]*Confirmed at \$610\.50; first target \$622\.25\.[\s\S]*THE MORNING LEVELS[\s\S]*7 tickers/);
  assert.doesNotMatch(aplus, /Afternoon|HOW IT WENT|Your watches|c-level-row/);
  assert.match(screen("aplus", { expandedBoards: ["aplus"] }), /Order: biggest move first[\s\S]*Strongest setup per ticker[\s\S]*Tracking/);
  assert.match(screen("aplus", { detail: "setup", symbol: "META" }), /MORNING[\s\S]*BULLISH[\s\S]*CONFIRMED · 10:00 AM[\s\S]*5 MINUTE CANDLES · MORNING[\s\S]*Progress track[\s\S]*Close through the line: confirmed\. Star: first target\. Close back through: ended\.[\s\S]*THE FOUR MORNING LINES/);
  const patterns = screen("patterns");
  assert.match(patterns, /1,000 stocks · scanned \w+ \d+, 9:46 PM ET[\s\S]*>Recent<[\s\S]*>Everything<[\s\S]*Look up a stock or coin[\s\S]*>Daily<[\s\S]*>Weekly<[\s\S]*>Monthly<[\s\S]*TOP SETUP[\s\S]*Ranked by stage, track record and freshness[\s\S]*✓ Up confirmed · R:R 2\.5 · Falling Wedge[\s\S]*of the way to the measured move[\s\S]*SETUPS · 4/);
  assert.match(screen("patterns", { patternBoard: "Everything" }), /SETUPS · 5[\s\S]*Up break failed/);
  assert.match(screen("patterns", { patternFrame: "Weekly" }), /SETUPS · 1[\s\S]*AAPL/);
  assert.match(header("patterns"), /Friendly Patterns/);
  const screener = screen("screener", { expandedBoards: ["Live Runners"] });
  assert.match(screener, /Live · updated 10:42 AM[\s\S]*TODAY’S TOP MOVER[\s\S]*open → high[\s\S]*Found by Live Runners at 9:35 AM[\s\S]*Overnight Gappers[\s\S]*Live Runners[\s\S]*plays today · tap to open[\s\S]*Breakout In-Play[\s\S]*LIVE FEED[\s\S]*Market mood: Buyers leaning in/);
  assert.doesNotMatch(screener, /Open full board|Sort|tap to close/);
  assert.match(screen("pipbrain"), /Choose a tool\.[\s\S]*Two ways to read the market\.[\s\S]*Time Trend[\s\S]*The bigger price trend, updated monthly\.[\s\S]*Open Interest Leaders[\s\S]*Explore the biggest increases in open option positions\./);
  assert.match(screen("pipbrain", { detail: "oi" }), /Where positions grew\.[\s\S]*Ranked by increase in open interest\.[\s\S]*>Calls<[\s\S]*>Puts<[\s\S]*Two sides to every contract\.[\s\S]*Every open contract has a buyer and a seller\./);
  assert.match(header("bigmoney") + screen("bigmoney"), /Big Money[\s\S]*JUST IN[\s\S]*>People<[\s\S]*>Latest<[\s\S]*traded, then filed/);
});

// Owner, November 13 2026: the demo "needs to be fully updates to where things are at now with no duplicates".
test("the old tour, the Mac variant and their files are gone, and one button leaves the preview: Get early access", () => {
  const home = read("../index.html"), app = read("../assets/app-preview/app.js");
  for (const file of ["film.mjs", "film-script.mjs", "film.css", "story.css", "platform.mjs", "platform.css", "capture.mjs", "native-quiz.mjs", "pip.png"]) {
    assert.equal(fs.existsSync(new URL("../assets/app-preview/" + file, import.meta.url)), false, file);
    assert.ok(!home.includes(file), file + " is not linked");
  }
  assert.equal(fs.readdirSync(new URL("../assets/app-preview/media/", import.meta.url)).filter((f) => /\.(mp4|vtt)$/.test(f)).length, 0);
  assert.doesNotMatch(home, /tour-player|close-fullscreen|data-platform/);
  assert.match(home, /<div class="preview-side" id="preview-side"><\/div>/);
  assert.doesNotMatch(app, /film|tour|platform|macos|membership|Start the free|\/learn|openExternalSection|product-capture/i);
  const panel = app.match(/side\.innerHTML = `([^`]+)`/)[1];
  assert.deepEqual([...panel.matchAll(/<(?:button|a)\b[^>]*>([^<]+)</g)].map((m) => m[1]), ["Get early access"]);
  assert.match(panel, /<button class="button" data-site="early-access">/);
  assert.match(app, /function earlyAccess\(\) \{\s*openPreview\(false\);\s*const box = document\.querySelector\("#early-email"\);\s*box\.scrollIntoView\([^)]*\);\s*box\.focus\(/);
  assert.match(home, /id="early-email"/);
});

test("nothing in the preview is offered twice on a screen, unless the app does exactly that", () => {
  for (const [id] of SCREENS) {
    const html = screen(id);
    const pressed = [...html.matchAll(/<button\b[^>]*data-(?:screen|action)="([a-z-]+)"[^>]*?(?:data-value="([^"]*)")?[^>]*>/g)].map((m) => m[0]);
    const same = pressed.filter((b, i) => pressed.indexOf(b) !== i && !/coach-time|data-action="open-pip"/.test(b));
    assert.deepEqual(same, [], id);
  }
  // Home: Pip and his thought open the same sheet, as in the app; every other door is there once.
  assert.equal((screen("home").match(/data-action="open-pip"/g) || []).length, 2);
});
