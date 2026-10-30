import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../faq/index.html", import.meta.url), "utf8");
const text = (fragment) => fragment.replace(/<[^>]+>/g, "").trim();

test("the answers search engines read match the answers members read", () => {
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const visible = [...html.matchAll(/<div class="qa"[^>]*><h3>(.*?)<\/h3><p>(.*?)<\/p><\/div>/g)]
    .map(([, question, answer]) => [text(question), text(answer)]);
  const indexed = data.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]);
  assert.ok(visible.length > 0);
  assert.deepEqual(visible, indexed);
});

test("old links into the FAQ still land somewhere", () => {
  for (const id of ["basics", "access", "community", "video", "billing"])
    assert.ok(html.includes(`id="${id}"`), id);
});

test("the FAQ keeps the brand and house style", () => {
  assert.doesNotMatch(html, /—/);
  assert.doesNotMatch(html, /ccb167|ffff8a|fonts\.googleapis/);
});
