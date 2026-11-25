import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { arrivalFrom, bookingURL } from "../app/coach-card.mjs";

const read = (p) => fs.readFileSync(new URL(p, new URL("../", import.meta.url)), "utf8");

// GitHub Pages answers a missing address with /404.html. A coach link for someone not listed must not be a dead end.

test("the 404 page is plain, loads its script first and shows no coach", () => {
  const html = read("404.html"), js = read("app/not-found.js");
  assert.match(html, /<script src="\/app\/not-found\.js"><\/script>/);
  assert.ok(html.indexOf("not-found.js") < html.indexOf("<body"), "the script decides before the page draws");
  assert.match(html, /name="robots" content="noindex"/);
  assert.match(html, /script-src 'self'/);
  assert.match(html, /href="\/"/);
  assert.doesNotMatch(html + js, /money-mike|ms-mary|coaching\/[a-z-]+\.jpg/, "never a coach's face");
  assert.doesNotMatch(html + js, /[–—]|facebook|fbq|gtag|consent\.js/);
});

// Runs app/not-found.js as the browser would for one missing address; answers where it sends the visitor, or null.
function landOn(address) {
  const url = new URL(address, "https://thefriendlytrader.com");
  let to = null;
  const location = { pathname: url.pathname, search: url.search, replace: (next) => { to = next; } };
  vm.runInNewContext(read("app/not-found.js"), { location, URLSearchParams });
  return to;
}

const CLASS = "s" + "0123456789abcdef".repeat(2), AT = "1795578075";
const WEB = "https://app.thefriendlytrader.com";

// Coordinator, 2026-11-25: a coach can be listed (and copy their link in the studio) before the generator has made their
// page. Their /app/<coach-id> link goes to their booking on the website, which handles an id it does not list.
test("a coach link without a page yet goes to that coach's booking on the website", () => {
  const cases = {
    "/app/new-coach": `${WEB}/coaching/coach/new-coach`,
    "/app/new-coach/": `${WEB}/coaching/coach/new-coach`,
    [`/app/new-coach?class=${CLASS}&at=${AT}`]: `${WEB}/coaching/coach/new-coach?class=${CLASS}&at=${AT}`,
    [`/app/new-coach/?at=${AT}&class=${CLASS}`]: `${WEB}/coaching/coach/new-coach?class=${CLASS}&at=${AT}`,
    [`/app/new-coach?class=${CLASS}`]: `${WEB}/coaching/coach/new-coach?class=${CLASS}`,
    [`/app/new-coach?class=${CLASS}&at=0123456789`]: `${WEB}/coaching/coach/new-coach?class=${CLASS}`,
    [`/app/new-coach?at=${AT}`]: `${WEB}/coaching/coach/new-coach`,
    [`/app/new-coach?class=s123&at=${AT}`]: `${WEB}/coaching/coach/new-coach`,
    "/app/new-coach?ref=x&class=%3Cb%3E": `${WEB}/coaching/coach/new-coach`,
    ["/app/" + "a".repeat(64)]: `${WEB}/coaching/coach/${"a".repeat(64)}`,
  };
  for (const [address, expected] of Object.entries(cases)) {
    assert.equal(landOn(address), expected, address);
    const url = new URL(address, "https://thefriendlytrader.com"), id = url.pathname.split("/")[2];
    const { classId, at } = arrivalFrom(url.search);
    assert.equal(landOn(address), bookingURL(id, classId, at), `${address} follows the coach pages' own rule`);
  }
});

test("anything else under /app/ goes to Coaching's start, and other missing pages stay put", () => {
  for (const address of ["/app/Money-Mike", "/app/bad_id", "/app/new-coach/more", "/app/x.html", "/app/" + "a".repeat(65),
    "/app/%3Cscript%3E", "/app//new-coach", `/app/a b?class=${CLASS}`])
    assert.equal(landOn(address), `${WEB}/coaching`, address);
  for (const address of ["/nothing-here", "/apps/new-coach", "/faq/old", "/application"])
    assert.equal(landOn(address), null, address);
});
