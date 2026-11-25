import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (p) => fs.readFileSync(new URL(p, new URL("../", import.meta.url)), "utf8");

// GitHub Pages answers a missing address with /404.html. A coach link for someone not listed must not be a dead end.

test("a missing page under /app/ goes to Coaching's start, others get a plain page", () => {
  const html = read("404.html"), js = read("app/not-found.js");
  assert.match(html, /<script src="\/app\/not-found\.js"><\/script>/);
  assert.match(html, /name="robots" content="noindex"/);
  assert.match(html, /script-src 'self'/);
  assert.match(html, /href="\/"/);
  assert.match(js, /\/\^\\\/app\\\//);
  assert.match(js, /location\.replace\("https:\/\/app\.thefriendlytrader\.com\/coaching"\)/);
  assert.doesNotMatch(html + js, /money-mike|ms-mary|coaching\/[a-z-]+\.jpg/, "never a coach's face");
  assert.doesNotMatch(html + js, /[\u2013\u2014]|facebook|fbq|gtag|consent\.js/);
});
