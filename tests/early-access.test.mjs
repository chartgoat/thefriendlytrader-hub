import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SERVER, SIGNUP_URL, UNSUBSCRIBE_URL, CONSENT_VERSION, SAID, looksLikeEmail, refFrom, signupBody, replyFor, unsubscribeParts } from "../assets/early-access/core.mjs";

const read = (p) => fs.readFileSync(new URL(p, import.meta.url), "utf8");
const home = read("../index.html");
const heroAt = home.indexOf('class="g-hero"');
const hero = home.slice(heroAt, home.indexOf("</section>", heroAt));
const note = hero.match(/<p class="g-hero-soon" id="early-note"[^>]*>([^<]+)<\/p>/)[1];

test("the first screen has the launch day, one email box and the demo", () => {
  assert.match(hero, /On the App Store Sunday, November 22\./);
  assert.match(hero, /<form class="g-early" id="early-access" novalidate>/);
  assert.equal((hero.match(/type="email"/g) || []).length, 1);
  assert.match(hero, /<label class="g-early-label" for="early-email">/, "the box has a name for screen readers");
  assert.match(hero, /<button class="g-btn g-primary" type="submit">Get early access<\/button>/);
  assert.match(hero, /<button class="g-btn g-plain" type="button" data-site="explore">Try the app<\/button>/);
  assert.match(home, /<script type="module" src="assets\/early-access\/form\.mjs"><\/script>/);
});

test("the words under the box say what the address is for, and the privacy page quotes them exactly", () => {
  assert.equal(note, "We'll email your links on launch day, plus news and offers now and then. Unsubscribe anytime.");
  assert.ok(note.length <= 300, "the server stores at most 300 characters of consent wording");
  const privacy = read("../privacy/index.html");
  assert.ok(privacy.includes(`"${note}"`));
  assert.ok(privacy.includes('<h3 id="early-access">The early access list</h3>'));
  assert.match(privacy, /Every email to this list has an unsubscribe link/);
  assert.match(privacy, /whether you sign up for early access \(not your address\)/);
});

test("both pages may reach our own sign-up server and nothing else new", () => {
  assert.match(SERVER, /^https:\/\/[a-z0-9]{20}\.supabase\.co\/functions\/v1\/email-signup$/);
  assert.equal(SIGNUP_URL, `${SERVER}/early-access`);
  assert.equal(UNSUBSCRIBE_URL, `${SERVER}/unsubscribe`);
  const origin = new URL(SERVER).origin;
  const cspOf = (html) => html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  assert.ok(cspOf(home).includes(`connect-src https://www.facebook.com https://connect.facebook.net ${origin};`));
  assert.match(cspOf(home), /form-action 'none'/, "the box sends through the script, never as a plain form post");
  const unsub = read("../unsubscribe/index.html");
  assert.ok(cspOf(unsub).includes(`connect-src ${origin};`));
  assert.match(cspOf(unsub), /default-src 'none'; script-src 'self';/);
  assert.match(unsub, /<meta name="robots" content="noindex,nofollow" \/>/);
  assert.match(unsub, /<meta name="referrer" content="no-referrer" \/>/, "the link's code is not passed on to other sites");
  assert.doesNotMatch(unsub, /meta-pixel|facebook/);
  assert.doesNotMatch(read("../sitemap.xml"), /unsubscribe/);
});

test("the scripts keep nothing on the device and send only the sign-up", () => {
  for (const file of ["core.mjs", "form.mjs", "unsubscribe.mjs"]) {
    const js = read(`../assets/early-access/${file}`);
    assert.doesNotMatch(js, /localStorage|sessionStorage|document\.cookie|navigator\.userAgent|XMLHttpRequest/, file);
    assert.doesNotMatch(js, /—/, file);
  }
  const form = read("../assets/early-access/form.mjs");
  assert.equal((form.match(/\bfetch\(/g) || []).length, 1);
  assert.match(form, /fetch\(SIGNUP_URL,/);
  assert.match(form, /window\.fbq\("track", "CompleteRegistration", \{ content_name: "Early access" \}\)/, "the ad event carries no address");
  const unsub = read("../assets/early-access/unsubscribe.mjs");
  assert.equal((unsub.match(/\bfetch\(/g) || []).length, 1);
  assert.match(unsub, /button\.addEventListener\("click"/, "opening the link alone unsubscribes nobody");
});

test("an address is checked before it is sent", () => {
  for (const good of ["person@example.com", "  Person.Name+tag@mail.example.co  ", "a@b.io"]) assert.ok(looksLikeEmail(good), good);
  for (const bad of ["", "notanemail", "person@", "@example.com", "person@example", "per son@example.com", "person@@example.com", "person@example..com", `${"a".repeat(250)}@example.com`]) assert.ok(!looksLikeEmail(bad), bad);
});

test("the sign-up sends the address, the words agreed to, and the link's tag only", () => {
  const body = signupBody({ email: "  Person@Example.com ", consentText: `  ${note}\n `, trap: "", elapsedMs: 4321.6, search: "?ref=TikTok-1&utm_source=x" });
  assert.deepEqual(body, { email: "Person@Example.com", consentVersion: CONSENT_VERSION, consentText: note, website: "", elapsedMs: 4322, ref: "tiktok-1" });
  assert.equal(CONSENT_VERSION, "web-early-access-v1");
  assert.deepEqual(Object.keys(signupBody({ email: "a@b.io", consentText: note, trap: "", elapsedMs: 2000, search: "" })), ["email", "consentVersion", "consentText", "website", "elapsedMs"]);
  assert.equal(signupBody({ email: "a@b.io", consentText: note, trap: "filled by a bot", elapsedMs: -5, search: "" }).website, "filled by a bot");
  assert.equal(signupBody({ email: "a@b.io", consentText: note, trap: "", elapsedMs: -5, search: "" }).elapsedMs, 0);
});

test("a link's tag is kept only when it is short and plain", () => {
  assert.equal(refFrom("?ref=reel_2"), "reel_2");
  assert.equal(refFrom("?ref=YT-Short-3"), "yt-short-3");
  for (const bad of ["", "?ref=", "?ref=a b", "?ref=person@example.com", `?ref=${"a".repeat(41)}`, "?other=1"]) assert.equal(refFrom(bad), "", bad);
});

test("each answer from the server gets words a person can act on", () => {
  assert.deepEqual(replyFor(200, { ok: true }), { ok: true, text: SAID.done });
  assert.match(SAID.done, /Sunday, November 22/);
  assert.equal(replyFor(400, { ok: false, error: "invalid_email" }).text, SAID.badEmail);
  assert.equal(replyFor(429, { ok: false, error: "rate_limited" }).text, SAID.tooMany);
  for (const [status, body] of [[503, { ok: false, error: "unavailable" }], [403, { ok: false, error: "origin_not_allowed" }], [200, null], [200, { ok: false }], [400, { ok: false, error: "invalid_consent" }]]) {
    const reply = replyFor(status, body);
    assert.equal(reply.ok, false, `${status}`);
    assert.equal(reply.text, SAID.failed, `${status}`);
  }
  for (const text of Object.values(SAID)) assert.doesNotMatch(text, /—|error|oops/i);
});

test("an unsubscribe link needs both of its parts", () => {
  assert.deepEqual(unsubscribeParts("?i=0f3c2a9e-1b7d-4c55-9e21-7a1c2d3e4f50&t=AbC_def-1234567890xyz"), { id: "0f3c2a9e-1b7d-4c55-9e21-7a1c2d3e4f50", token: "AbC_def-1234567890xyz" });
  for (const bad of ["", "?i=12", "?t=AbC_def-1234567890xyz", "?i=12&t=short", "?i=a b&t=AbC_def-1234567890xyz", "?i=12&t=has.dots.in.it.1234567890"]) assert.equal(unsubscribeParts(bad), null, bad);
});
