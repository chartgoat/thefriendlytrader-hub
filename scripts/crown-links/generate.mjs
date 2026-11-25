#!/usr/bin/env node
// Writes a page for each listed Crown Trader at app/<coach-id>/index.html, the cards' data at app/coaches.json, and their
// photos at assets/coaching/<coach-id>.jpg, from the live coaching catalog. Run it again whenever a coach is added,
// paused, removed or changes a price, then run `npm test` and commit what changed:
//
//   node scripts/crown-links/generate.mjs
//
// Options: --catalog FILE (a saved catalog instead of the live one), --photos DIR (friendly-trader-web public/coaching
// instead of the website's copies), --root DIR (where to write; the repository by default), --dry-run.
// It removes only pages it made itself (they carry MARKER) for coaches the catalog no longer lists, and their photos.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  APP_STORE, CATALOG_URL, COACH_ID, SITE, WEB, cardHTML, esc, isCatalog, listed, summary,
} from "../../app/coach-card.mjs";

export const MARKER = "<!-- Made by scripts/crown-links/generate.mjs from the coaching catalog. Run it again rather than editing this file. -->";
// The Smart App Banner exactly as the invitation page (app/index.html) has it: the app, and the Crown Trader App Clip.
const BANNER = "app-id=6802470823, app-clip-bundle-id=com.stockswithjosh.macdrecap.CrownedInvite";
const FALLBACK_IMAGE = { url: `${SITE}/assets/og.jpg`, width: 1200, height: 630 };

// friendly-trader-web lib/coaching/model.ts https(): an https address with no user name or password, else nothing.
function https(raw) {
  try {
    const u = new URL(raw ?? "");
    return u.protocol === "https:" && !u.username && !u.password ? u.href : undefined;
  } catch {
    return undefined;
  }
}

const isJPEG = (buf) => Buffer.isBuffer(buf) && buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;

function description(card) {
  const lead = card.headline ? card.headline.replace(/[.\s]+$/, "") : `Coaching with ${card.name}`;
  const prices = card.offers.map((o) => `${o.name} ${o.price}`).join(", ");
  return `${lead}. ${prices || "Coaching on Friendly Trader"}.`;
}

export function pageHTML(card, image, imageOrigin) {
  const title = `Book ${card.name} · Friendly Trader`;
  const about = description(card);
  const url = `${SITE}/app/${card.id}/`;
  const size = image.width ? `\n  <meta property="og:image:width" content="${image.width}">\n  <meta property="og:image:height" content="${image.height}">` : "";
  const csp = `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'${imageOrigin ? " " + imageOrigin : ""}; ` +
    `connect-src ${WEB}; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`;
  return `<!doctype html>
${MARKER}
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="apple-itunes-app" content="${BANNER}">
  <meta name="referrer" content="no-referrer">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#EDE6D8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(about)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Friendly Trader">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(about)}">
  <meta property="og:image" content="${esc(image.url)}">${size}
  <meta property="og:image:alt" content="${esc(card.name)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(about)}">
  <meta name="twitter:image" content="${esc(image.url)}">
  <meta name="twitter:image:alt" content="${esc(card.name)}">
  <link rel="icon" href="/assets/favicon-32.png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/young-serif.woff2" crossorigin>
  <link rel="stylesheet" href="/app/coach.css">
  <script type="module" src="/app/coach-page.mjs"></script>
</head>
<body class="coach-page">
<header class="coach-bar"><a href="/"><img src="/assets/apple-touch-icon.png" width="32" height="32" alt="">Friendly Trader</a></header>
<main class="coach-main">
${cardHTML(card, { heading: "h1", appStore: true })}
</main>
</body>
</html>
`;
}

// photos(name) answers a JPEG's bytes for a bundled photo name, or null.
export async function build(catalog, photos) {
  if (!isCatalog(catalog)) throw new Error("The coaching catalog could not be read; nothing was written.");
  const coaches = listed(catalog);
  if (!coaches.length) throw new Error("The catalog has no listed coach; nothing was written.");
  const files = new Map(), cards = {}, warnings = [];
  for (const coach of coaches) {
    let image = FALLBACK_IMAGE, photo = null, origin = null;
    const upload = https(coach.photo_url);
    if (upload) {
      image = { url: upload };
      photo = upload;
      origin = new URL(upload).origin;
    } else {
      const name = typeof coach.bundled_photo === "string" && COACH_ID.test(coach.bundled_photo) ? coach.bundled_photo : coach.id;
      const bytes = await photos(name);
      if (isJPEG(bytes)) {
        photo = `/assets/coaching/${coach.id}.jpg`;
        image = { url: SITE + photo, width: 750, height: 750 };
        files.set(`assets/coaching/${coach.id}.jpg`, bytes);
      } else {
        warnings.push(`${coach.id}: no photo found for "${name}"; the page uses the site's picture`);
      }
    }
    const card = summary(coach, photo);
    cards[coach.id] = card;
    files.set(`app/${coach.id}/index.html`, pageHTML(card, image, origin));
  }
  files.set("app/coaches.json", JSON.stringify({ from: CATALOG_URL, appStore: APP_STORE, coaches: cards }, null, 2) + "\n");
  return { files, ids: Object.keys(cards), warnings };
}

// Writes the files under root and removes what the generator made for coaches who are no longer listed. Answers the
// removed paths, relative to root.
export function writeSite(root, site) {
  for (const [rel, content] of site.files) {
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
  const removed = [], keep = new Set(site.ids);
  const appDir = path.join(root, "app");
  for (const entry of fs.readdirSync(appDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || !COACH_ID.test(entry.name) || keep.has(entry.name)) continue;
    const page = path.join(appDir, entry.name, "index.html");
    if (!fs.existsSync(page) || !fs.readFileSync(page, "utf8").includes(MARKER)) continue;
    fs.unlinkSync(page);
    removed.push(`app/${entry.name}/index.html`);
    try { fs.rmdirSync(path.join(appDir, entry.name)); } catch { /* something else lives there: leave the folder */ }
  }
  const photoDir = path.join(root, "assets", "coaching");
  if (fs.existsSync(photoDir)) {
    for (const name of fs.readdirSync(photoDir)) {
      const id = name.replace(/\.jpg$/, "");
      if (id === name || !COACH_ID.test(id) || site.files.has(`assets/coaching/${name}`)) continue;
      fs.unlinkSync(path.join(photoDir, name));
      removed.push(`assets/coaching/${name}`);
    }
  }
  return removed.sort();
}

async function loadCatalog(source) {
  if (!source) {
    const res = await fetch(CATALOG_URL, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`The catalog answered ${res.status}; nothing was written.`);
    return res.json();
  }
  return JSON.parse(fs.readFileSync(source, "utf8"));
}

function photoSource(dir) {
  if (dir) return async (name) => {
    const file = path.join(dir, `${name}.jpg`);
    return fs.existsSync(file) ? fs.readFileSync(file) : null;
  };
  return async (name) => {
    const res = await fetch(`${WEB}/coaching/${name}.jpg`);
    return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
  };
}

async function main(argv) {
  const opt = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
  const root = path.resolve(opt("--root") ?? fileURLToPath(new URL("../../", import.meta.url)));
  const site = await build(await loadCatalog(opt("--catalog")), photoSource(opt("--photos")));
  for (const w of site.warnings) console.warn("warning: " + w);
  if (argv.includes("--dry-run")) {
    for (const rel of site.files.keys()) console.log("would write " + rel);
    return;
  }
  const removed = writeSite(root, site);
  console.log(`Pages for ${site.ids.length} coaches: ${site.ids.map((id) => "/app/" + id).join(", ")}`);
  for (const rel of removed) console.log("removed " + rel);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}
