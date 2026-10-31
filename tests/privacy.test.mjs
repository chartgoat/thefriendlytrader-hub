import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../privacy/index.html", import.meta.url), "utf8");
const text = html.replace(/<style>[\s\S]*?<\/style>/, "").replace(/<[^>]+>/g, " ");
const isDraft = html.includes("data-draft");

test("the policy keeps the house style and loads nothing from elsewhere", () => {
  assert.doesNotMatch(text, /[—–]/);
  assert.doesNotMatch(html, /<script|fonts\.googleapis|ccb167|ffff8a/);
});

test("the policy gives no street address", () => {
  const streets = text.match(/\b\d{1,5}\s+(?:[NSEW]\.?\s+)?[\w.]+(?:\s[\w.]+)?\s+(?:Street|St|Drive|Dr|Road|Rd|Avenue|Ave|Lane|Ln|Court|Ct|Boulevard|Blvd|Way|Parkway)\b/g);
  assert.deepEqual([...new Set(streets)], []);
});

test("the policy names its company, contacts and the facts Apple asks for", () => {
  for (const fact of ["Nala Financial LLC", "legal@thefriendlytrader.com", "support@stockswithjosh.com",
    "Whop", "Pip", "voice notes", "30 days", "Delete account", "does not cancel", "six-digit code", "IP address"]) assert.ok(text.includes(fact), fact);
  for (const id of ["signature", "whop", "chat", "pip", "notifications", "email", "deleting-your-account", "how-long-we-keep-it"])
    assert.ok(html.includes(`id="${id}"`), id);
});

test("every open question a note points to exists, and the other way round", () => {
  const pointed = new Set([...html.matchAll(/href="#(q\d+)"/g)].map((m) => m[1]));
  const listed = new Set([...html.matchAll(/<li id="(q\d+)"/g)].map((m) => m[1]));
  assert.deepEqual([...pointed].sort(), [...listed].sort());
});

test("the home page and FAQ link to this page", () => {
  for (const page of ["../index.html", "../faq/index.html"]) {
    const source = fs.readFileSync(new URL(page, import.meta.url), "utf8");
    assert.match(source, /<a href="\/privacy\/">Privacy<\/a>/, page);
    assert.doesNotMatch(source, /stockswithjosh\.com\/privacy/, page);
  }
});

test("a draft says so and stays out of search", () => {
  if (!isDraft) return;
  assert.match(html, /<meta name="robots" content="noindex,nofollow" data-draft \/>/);
  assert.match(text, /Draft for attorney review\. Not in effect\./);
});

test("a published policy carries no draft notes", () => {
  if (isDraft) return;
  assert.doesNotMatch(html, /noindex|class="open"|Open question|Draft for attorney|data-draft/);
  assert.match(fs.readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8"), /thefriendlytrader\.com\/privacy\//);
});
