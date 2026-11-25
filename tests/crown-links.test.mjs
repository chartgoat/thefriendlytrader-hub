import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  APP_STORE, CLASS_ID, COACH_ID, bookingURL, cardHTML, classFrom, decideLive, listed, offers, summary,
} from "../app/coach-card.mjs";

const root = new URL("../", import.meta.url);
const read = (p) => fs.readFileSync(new URL(p, root), "utf8");
const CLASS = "s" + "0123456789abcdef".repeat(2);

const offering = (coach, kind, cents, extra = {}) => ({
  id: `${coach}.${kind === "one_on_one" ? "1on1" : kind}`, coach_id: coach, kind,
  title: kind === "one_on_one" ? "1-on-1 coaching" : "Masterclass", status: "bookable", gift_only: false,
  price: { currency: "usd", amount_cents: cents }, duration_minutes: kind === "one_on_one" ? 60 : 120,
  policy: { summary: "One free reschedule until 24 hours before." }, payment: { provider: "whop" }, ...extra,
});
const coach = (id, name, extra = {}) => ({
  id, name, headline: "Patience and clarity", role: "crown_trader", sort: 1, bundled_photo: id, photo_url: null,
  paused: false, goals: [], teaches: [], links: [], sources: [],
  offerings: [offering(id, "one_on_one", 20000), offering(id, "masterclass", 13000)], ...extra,
});
const catalog = (coaches) => ({ version: 1, goals: [], coaches });

// 1. Shared rules

test("only listed coaches with a usable id count", () => {
  const list = listed(catalog([
    coach("ms-mary", "Ms. Mary", { sort: 2 }),
    coach("money-mike", "Money Mike", { sort: 1 }),
    coach("paused-pat", "Pat", { paused: true }),
    coach("Bad Id", "Nobody"),
    coach("../etc", "Nobody"),
    { ...coach("no-name", ""), name: "" },
  ]));
  assert.deepEqual(list.map((c) => c.id), ["money-mike", "ms-mary"]);
  assert.equal(listed(null).length, 0);
  assert.equal(listed({ coaches: "nope" }).length, 0);
  assert.ok(COACH_ID.test("wolf-of-gatsby"));
  assert.ok(!COACH_ID.test("a".repeat(65)));
});

test("offers follow the website's bookable rule and words", () => {
  assert.deepEqual(offers(coach("tom", "Tom")), [
    { kind: "one_on_one", name: "1-on-1", length: "1 hr", price: "$200" },
    { kind: "masterclass", name: "Masterclass", length: "2 hr", price: "$130" },
  ]);
  const odd = coach("tom", "Tom", { offerings: [
    offering("tom", "masterclass", 13050, { duration_minutes: 90 }),
    offering("tom", "one_on_one", 20000, { status: "paused" }),
    offering("tom", "one_on_one", 0),
    offering("tom", "one_on_one", 20000, { gift_only: true }),
    offering("tom", "one_on_one", 20000, { payment: { provider: "storekit" } }),
    offering("tom", "one_on_one", 20000, { policy: { summary: " " } }),
    offering("tom", "workshop", 5000),
  ] });
  assert.deepEqual(offers(odd), [{ kind: "masterclass", name: "Masterclass", length: "1 hr 30 min", price: "$130.50" }]);
  const two = coach("tom", "Tom", { offerings: [
    offering("tom", "one_on_one", 20000, { title: "Quick call", duration_minutes: 30 }),
    offering("tom", "one_on_one", 30000, { title: "Deep dive" }),
  ] });
  assert.deepEqual(offers(two).map((o) => o.name + " " + o.length), ["Quick call 30 min", "Deep dive 1 hr"]);
});

test("the booking link is absolute and keeps only a real class id", () => {
  assert.equal(bookingURL("money-mike"), "https://app.thefriendlytrader.com/coaching/coach/money-mike");
  assert.equal(bookingURL("money-mike", CLASS), `https://app.thefriendlytrader.com/coaching/coach/money-mike?class=${CLASS}`);
  for (const bad of ["s123", CLASS.toUpperCase(), CLASS + "0", "t1795578075", "<script>", "", null])
    assert.equal(bookingURL("money-mike", bad), "https://app.thefriendlytrader.com/coaching/coach/money-mike", String(bad));
  assert.ok(CLASS_ID.test(CLASS));
  assert.equal(classFrom(`?class=${CLASS}`), CLASS);
  assert.equal(classFrom(`?ref=tom&class=${CLASS}`), CLASS);
  assert.equal(classFrom("?class=nope"), null);
  assert.equal(classFrom(""), null);
});

test("the card escapes what the catalog says and links out absolutely", () => {
  const card = summary(coach("tom", `Tom "<b>" & Co`, { headline: "<img src=x onerror=alert(1)>" }), "/assets/coaching/tom.jpg");
  const html = cardHTML(card, { heading: "h1", appStore: true, classId: CLASS });
  assert.doesNotMatch(html, /"<b>"|<img src=x/);
  assert.match(html, /Tom &quot;&lt;b&gt;&quot; &amp; Co/);
  assert.match(html, new RegExp(`class="cc-book" href="https://app\\.thefriendlytrader\\.com/coaching/coach/tom\\?class=${CLASS}"`));
  assert.match(html, /class="cc-get" href="https:\/\/apps\.apple\.com\/us\/app\/friendly-trader-learn-trading\/id6802470823"/);
  assert.match(html, /<h1 class="cc-name">/);
  const quiet = cardHTML(card, { heading: "h2", appStore: false });
  assert.match(quiet, /<h2 class="cc-name">/);
  assert.doesNotMatch(quiet, /cc-get/);
  assert.match(quiet, /\$200/);
  assert.match(quiet, /\$130/);
});

test("the live catalog replaces the prices, and a coach who left closes the card", () => {
  const live = catalog([coach("tom", "Tom", { offerings: [offering("tom", "one_on_one", 25000)] })]);
  assert.deepEqual(decideLive(live, "tom"), { state: "listed", offers: [{ kind: "one_on_one", name: "1-on-1", length: "1 hr", price: "$250" }] });
  assert.deepEqual(decideLive(live, "ms-mary"), { state: "gone" });
  assert.deepEqual(decideLive(catalog([coach("tom", "Tom", { paused: true })]), "tom"), { state: "gone" });
  for (const unreadable of [null, "x", {}, { version: 1, coaches: "x" }, { version: "1", goals: [], coaches: [] }])
    assert.equal(decideLive(unreadable, "tom"), null, JSON.stringify(unreadable));
});

// 2. Generator

const { build, writeSite } = await import("../scripts/crown-links/generate.mjs");
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1]);
const photos = async (id) => (id === "no-photo" ? null : JPEG);
const meta = (html, key) => html.match(new RegExp(`<meta (?:name|property)="${key.replace(/[.:]/g, "\\$&")}" content="([^"]*)"`))?.[1];

test("the generator makes one page per listed coach, with its own preview", async () => {
  const site = await build(catalog([
    coach("money-mike", "Money Mike", { headline: "Discipline and structure" }),
    coach("ms-mary", "Ms. Mary", { sort: 2 }),
    coach("paused-pat", "Pat", { paused: true }),
    coach("Bad Id", "Nobody"),
  ]), photos);
  assert.deepEqual([...site.files.keys()].sort(), [
    "app/coaches.json", "app/money-mike/index.html", "app/ms-mary/index.html",
    "assets/coaching/money-mike.jpg", "assets/coaching/ms-mary.jpg",
  ]);
  const html = site.files.get("app/money-mike/index.html");
  assert.match(html, /<title>Book Money Mike · Friendly Trader<\/title>/);
  for (const key of ["og:title", "twitter:title"]) assert.equal(meta(html, key), "Book Money Mike · Friendly Trader");
  for (const key of ["og:image", "twitter:image"]) assert.equal(meta(html, key), "https://thefriendlytrader.com/assets/coaching/money-mike.jpg");
  assert.equal(meta(html, "twitter:card"), "summary_large_image");
  assert.equal(meta(html, "og:url"), "https://thefriendlytrader.com/app/money-mike/");
  assert.equal(meta(html, "og:description"), "Discipline and structure. 1-on-1 $200, Masterclass $130.");
  assert.equal(meta(html, "apple-itunes-app"), read("app/index.html").match(/name="apple-itunes-app" content="([^"]+)"/)[1]);
  assert.match(html, /class="cc-book" href="https:\/\/app\.thefriendlytrader\.com\/coaching\/coach\/money-mike"/);
  assert.match(html, /<script type="module" src="\/app\/coach-page\.mjs"><\/script>/);
  assert.equal(meta(site.files.get("app/ms-mary/index.html"), "og:image"), "https://thefriendlytrader.com/assets/coaching/ms-mary.jpg");
  const data = JSON.parse(site.files.get("app/coaches.json"));
  assert.deepEqual(Object.keys(data.coaches), ["money-mike", "ms-mary"]);
  assert.equal(data.coaches["money-mike"].photo, "/assets/coaching/money-mike.jpg");
});

test("a coach's upload wins over the bundled photo, and no photo never borrows a face", async () => {
  const site = await build(catalog([
    coach("tom", "Tom", { photo_url: "https://cdn.example.org/faces/tom.png" }),
    coach("no-photo", "New Coach", { sort: 2 }),
  ]), photos);
  const tom = site.files.get("app/tom/index.html");
  assert.equal(meta(tom, "og:image"), "https://cdn.example.org/faces/tom.png");
  assert.match(tom, /img-src 'self' https:\/\/cdn\.example\.org;/);
  assert.ok(!site.files.has("assets/coaching/tom.jpg"));
  const fresh = site.files.get("app/no-photo/index.html");
  assert.equal(meta(fresh, "og:image"), "https://thefriendlytrader.com/assets/og.jpg");
  assert.doesNotMatch(fresh, /assets\/coaching\//);
});

test("the generator refuses a catalog it cannot read or one with nobody listed", async () => {
  await assert.rejects(build({ nope: true }, photos), /catalog/);
  await assert.rejects(build(catalog([coach("tom", "Tom", { paused: true })]), photos), /no listed coach/);
});

test("writing the site removes only pages the generator made for coaches who left", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "crown-links-"));
  const page = (id) => path.join(dir, "app", id, "index.html");
  for (const id of ["gone-coach", "hand-made"]) fs.mkdirSync(path.dirname(page(id)), { recursive: true });
  const first = await build(catalog([coach("gone-coach", "Gone")]), photos);
  writeSite(dir, first);
  fs.writeFileSync(page("hand-made"), "<!doctype html><title>Kept</title>");
  const second = await build(catalog([coach("tom", "Tom")]), photos);
  const removed = writeSite(dir, second);
  assert.deepEqual(removed, ["app/gone-coach/index.html", "assets/coaching/gone-coach.jpg"]);
  assert.ok(!fs.existsSync(page("gone-coach")));
  assert.ok(!fs.existsSync(path.dirname(page("gone-coach"))));
  assert.ok(fs.existsSync(page("hand-made")));
  assert.ok(fs.existsSync(page("tom")));
  assert.ok(fs.existsSync(path.join(dir, "assets", "coaching", "tom.jpg")));
  if (path.basename(dir).startsWith("crown-links-") && dir.startsWith(fs.realpathSync(os.tmpdir())) || dir.startsWith(os.tmpdir()))
    fs.rmSync(dir, { recursive: true });
});

// 3. Committed output

const coaches = JSON.parse(read("app/coaches.json")).coaches;
const pageIds = fs.readdirSync(new URL("app/", root), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

test("every listed coach has a page with its own preview image and title", () => {
  assert.ok(Object.keys(coaches).length >= 1);
  assert.deepEqual(pageIds.sort(), Object.keys(coaches).sort(), "a page exists for exactly the listed coaches");
  const images = new Set();
  for (const [id, c] of Object.entries(coaches)) {
    const html = read(`app/${id}/index.html`);
    assert.match(html, new RegExp(`<title>Book ${c.name.replace(/[.]/g, "\\.")} · Friendly Trader</title>`), id);
    const image = meta(html, "og:image");
    assert.equal(meta(html, "twitter:image"), image, id);
    assert.ok(image.startsWith("https://"), id);
    assert.ok(!images.has(image), `${id} has its own picture`);
    images.add(image);
    if (image.startsWith("https://thefriendlytrader.com/assets/coaching/")) {
      const file = fs.readFileSync(new URL(image.replace("https://thefriendlytrader.com/", ""), root));
      assert.deepEqual([...file.subarray(0, 3)], [0xff, 0xd8, 0xff], `${id} photo is a JPEG`);
    }
    for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g))
      assert.ok(href === "/" || href.startsWith("https://"), `${id}: ${href}`);
    assert.match(html, new RegExp(`href="https://app\\.thefriendlytrader\\.com/coaching/coach/${id}"`));
    assert.match(html, new RegExp(`href="${APP_STORE.replace(/[./]/g, "\\$&")}"`));
  }
});

test("coach pages carry no tracking and keep the house style", () => {
  for (const id of pageIds) {
    const html = read(`app/${id}/index.html`);
    assert.doesNotMatch(html, /facebook|fbq|meta-pixel|gtag|googletagmanager|analytics|consent\.js/i, id);
    assert.doesNotMatch(html, /[\u2013\u2014]/, id);
    assert.match(html, /http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self';[^"]*connect-src https:\/\/app\.thefriendlytrader\.com;/, id);
  }
  for (const file of ["app/coach-card.mjs", "app/coach-page.mjs", "app/coach.css", "app/invite.mjs"])
    assert.doesNotMatch(read(file), /[\u2013\u2014]|facebook|fbq|gtag/, file);
});

test("unknown and unlisted coach ids get no page", async () => {
  const { traders } = await import("../app/traders.mjs");
  for (const [id] of traders) assert.equal(fs.existsSync(new URL(`app/${id}/index.html`, root)), id in coaches, id);
  assert.ok([...traders.keys()].some((id) => !(id in coaches)), "the roster has traders who are not listed today");
  assert.ok(!fs.existsSync(new URL("app/nobody/", root)));
});

// 4. Old link

test("the old invite link keeps its behaviour and adds the card only for a listed coach", () => {
  const js = read("app/invite.mjs");
  assert.match(js, /document\.querySelector\("#inviter"\)\.textContent = traders\.get\(coach\) \+ " invited you";/);
  assert.match(js, /document\.querySelector\("#signup"\)\.href = "\/\?ref=ct-app-" \+ encodeURIComponent\(coach\);/);
  assert.match(js, /fetch\("\/app\/coaches\.json"\)/);
  assert.match(js, /COACH_ID\.test\(coach\)/);
  assert.match(js, /appStore: false/, "the invitation already has its App Store button");
  assert.doesNotMatch(read("app/index.html"), /coach/i, "today's page itself is unchanged");
});

// 5. Association file

test("Apple's association file is valid and keeps today's link and the App Clip", () => {
  const aasa = JSON.parse(read(".well-known/apple-app-site-association"));
  assert.deepEqual(aasa.appclips, { apps: ["7BG5349U63.com.stockswithjosh.macdrecap.CrownedInvite"] });
  assert.equal(aasa.applinks.details.length, 1);
  const { appIDs, components } = aasa.applinks.details[0];
  assert.deepEqual(appIDs, ["7BG5349U63.com.stockswithjosh.macdrecap"]);
  assert.deepEqual(components[0], { "/": "/app/", "?": { ref: "?*" } });
  const files = components.findIndex((c) => c["/"] === "/app/*.*" && c.exclude === true);
  const coachPath = components.findIndex((c) => c["/"] === "/app/*" && !c.exclude);
  assert.ok(files > 0 && coachPath > files, "files under /app/ are excluded before /app/* is claimed");
  assert.equal(components.length, 3);
});
