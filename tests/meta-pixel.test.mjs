import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), "utf8");

test("only the home page loads the Meta Pixel, and it may reach Meta and nothing else", () => {
  const home = read("../index.html");
  const csp = home.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  assert.match(csp, /script-src 'self' https:\/\/connect\.facebook\.net;/);
  assert.match(csp, /connect-src https:\/\/www\.facebook\.com https:\/\/connect\.facebook\.net https:\/\/grbywbmbiewrxqbfsxpf\.supabase\.co;/, "Meta, and our own sign-up server for the early access box");
  assert.match(csp, /img-src 'self' data: blob: https:\/\/www\.facebook\.com;/);
  assert.doesNotMatch(home, /<script[^>]*meta-pixel/, "the Pixel is never in the page's own markup; consent.js adds it after Accept");
  assert.match(home, /<script src="assets\/consent\.js" defer><\/script>/);
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
  assert.deepEqual([...js.matchAll(/fbq\("track", "(\w+)"/g)].map((m) => m[1]), ["PageView", "ViewContent"], "a page view and Try the app; no course or checkout taps, those links left the page");
});

test("the privacy page says what the Pixel sends and how to stop it", () => {
  const html = read("../privacy/index.html");
  assert.match(html, /asks whether we may use the Meta Pixel/);
  assert.match(html, /Global Privacy Control/);
  assert.match(html, /Updated November 17, 2026\./);
  assert.doesNotMatch(html, /The home page and FAQ on thefriendlytrader\.com set no cookies/);
});

test("nothing from Meta loads until the visitor presses Accept", () => {
  const home = read("../index.html");
  const js = read("../assets/consent.js");
  assert.match(home, /<aside class="g-ask" id="ads-ask" aria-label="Ad measurement" hidden>/, "the question is hidden until the script decides to ask");
  assert.match(home, /data-ads="no">No thanks<\/button>\s*<button[^>]*data-ads="yes">Accept<\/button>/);
  assert.match(home, /<p>We use cookies to understand how people find us\. <a href="\/privacy\/#web">Learn more<\/a><\/p>/);
  assert.equal((js.match(/loadPixel\(\)/g) || []).length, 3, "defined once, called for a stored yes and for a press on Accept");
  assert.match(js, /if \(answer === "yes"\) return loadPixel\(\);\s*\n\s*if \(answer === "no"\) return;/);
  assert.match(js, /if \(yes\) loadPixel\(\);/);
  assert.match(js, /navigator\.globalPrivacyControl === true\) return;/, "Global Privacy Control is a no, and is not asked");
  assert.doesNotMatch(js, /facebook|fbq|document\.cookie|fetch\(|XMLHttpRequest|sendBeacon/, "the choice itself goes nowhere");
  assert.doesNotMatch(js + home, /\u2014/);
  const privacy = read("../privacy/index.html");
  assert.match(privacy, /It loads only after you press Accept\./);
  assert.match(privacy, /<a href="\/\?ads=ask">change it here<\/a>/);
});
