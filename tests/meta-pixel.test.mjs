import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), "utf8");

test("only the home page loads the Meta Pixel, and it may reach Meta and nothing else", () => {
  const home = read("../index.html");
  const csp = home.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  assert.match(csp, /script-src 'self' https:\/\/connect\.facebook\.net;/);
  assert.match(csp, /connect-src https:\/\/www\.facebook\.com https:\/\/connect\.facebook\.net;/);
  assert.match(csp, /img-src 'self' data: blob: https:\/\/www\.facebook\.com;/);
  assert.match(home, /<script src="assets\/meta-pixel\.js" defer><\/script>/);
  assert.match(home.slice(0, home.indexOf("</head>")), /<meta name="facebook-domain-verification" content="qm5mkzmefy6w80w81k5eafgqnjt7pn" \/>/);
  for (const page of ["../faq/index.html", "../privacy/index.html"]) {
    const html = read(page);
    assert.match(html, /script-src 'none'/, page);
    assert.doesNotMatch(html, /meta-pixel|facebook\.net/, page);
  }
});

test("the Pixel stays off under Global Privacy Control and never reads what people type", () => {
  const js = read("../assets/meta-pixel.js");
  assert.match(js, /navigator\.globalPrivacyControl === true\) return;/);
  assert.match(js, /fbq\("track", "PageView"\)/);
  assert.match(js, /fbq\("set", "autoConfig", false, PIXEL_ID\);\s*\n\s*w\.fbq\("init"/, "automatic button events stay off and are set before init");
  assert.doesNotMatch(js, /\.value\b|input\[|textarea|localStorage|document\.cookie/);
  assert.match(js, /PIXEL_ID = "\d{10,20}"/, "the real Pixel ID must be filled in before publishing");
});

test("the privacy page says what the Pixel sends and how to stop it", () => {
  const html = read("../privacy/index.html");
  assert.match(html, /uses the Meta Pixel/);
  assert.match(html, /Global Privacy Control/);
  assert.match(html, /Updated November 4, 2026\./);
  assert.doesNotMatch(html, /The home page and FAQ on thefriendlytrader\.com set no cookies/);
});
