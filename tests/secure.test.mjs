import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), "utf8");
const js = read("../assets/secure.js");
const home = read("../index.html");

// Where the script sends a visitor who opened `url`, or null when it leaves them where they are.
function sentFrom(url) {
  const u = new URL(url);
  let to = null;
  const location = { protocol: u.protocol, hostname: u.hostname, pathname: u.pathname, search: u.search, hash: u.hash, replace: (next) => { to = next; } };
  vm.runInNewContext(js, { window: { location } });
  return to;
}

// November 25 2026: GitHub would not enforce HTTPS (its certificate request had not started since November 19), and
// over plain http the sign-up server answers the email box 403 origin_not_allowed.
test("a visitor on plain http is sent to the secure address, with the rest of the link kept", () => {
  assert.equal(sentFrom("http://thefriendlytrader.com/"), "https://thefriendlytrader.com/");
  assert.equal(sentFrom("http://thefriendlytrader.com/?ref=reel-1#main"), "https://thefriendlytrader.com/?ref=reel-1#main");
  assert.equal(sentFrom("http://www.thefriendlytrader.com/?ref=tiktok-2"), "https://thefriendlytrader.com/?ref=tiktok-2");
});

test("a secure visitor, a local preview and any other address are left alone", () => {
  for (const url of ["https://thefriendlytrader.com/", "https://thefriendlytrader.com/?ref=reel-1", "http://127.0.0.1:5540/", "http://localhost:5546/?ref=a", "http://chartgoat.github.io/thefriendlytrader-hub/", "http://evil-thefriendlytrader.com/"])
    assert.equal(sentFrom(url), null, url);
});

test("the home page runs it first, from its own files, and it reads nothing else", () => {
  const head = home.slice(0, home.indexOf("</head>"));
  assert.match(head, /<script src="assets\/secure\.js"><\/script>/, "not deferred: it runs before the page is drawn");
  assert.ok(head.indexOf('src="assets/secure.js"') < head.indexOf('rel="stylesheet"'), "before the styles");
  assert.match(head, /script-src 'self' /, "the page's own rules allow its own scripts");
  assert.doesNotMatch(js, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|document\.cookie|navigator\./);
  assert.doesNotMatch(js, /—/);
});
