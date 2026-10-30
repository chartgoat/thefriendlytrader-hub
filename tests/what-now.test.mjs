import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), "utf8");
const size = (p) => fs.statSync(new URL(p, import.meta.url)).size / 1048576;

test("the film ships everything it references, small enough to stream", () => {
  const home = read("../index.html");
  const refs = [...home.matchAll(/(?:src|href|poster|data-poster-portrait)="(assets\/film\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(new Set(refs).size >= 7, "css, player, both films, both posters, captions");
  for (const ref of refs) assert.ok(fs.existsSync(new URL(`../${ref}`, import.meta.url)), ref);
  assert.ok(size("../assets/film/what-now-16x9.mp4") < 30);
  assert.ok(size("../assets/film/what-now-9x16.mp4") < 30);
  assert.ok(size("../assets/film/what-now-poster-16x9.jpg") < 0.4);
});

test("the film stays inside the page's privacy and copy rules", () => {
  const home = read("../index.html");
  const js = read("../assets/film/what-now.mjs");
  const vtt = read("../assets/film/what-now.en.vtt");
  assert.match(home, /media-src 'self'/);
  assert.match(home, /connect-src 'none'/);
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|localStorage|sendBeacon/);
  assert.match(home, /<video controls playsinline preload="none"/, "nothing downloads until someone presses play");
  assert.match(vtt, /^WEBVTT/);
  assert.match(vtt, /no account needed/i);
  assert.doesNotMatch(vtt, /plain English|—|–/);
});

test("the film's end offers the two real next steps, and only claims what is live", () => {
  const home = read("../index.html");
  const end = home.slice(home.indexOf('class="film-end"'), home.indexOf('</section>', home.indexOf('class="film-end"')));
  assert.match(end, /data-site="explore"/);
  assert.match(end, /app\.thefriendlytrader\.com\/learn/);
  assert.doesNotMatch(home, /Download on the App Store/, "the app is not listed yet");
});
