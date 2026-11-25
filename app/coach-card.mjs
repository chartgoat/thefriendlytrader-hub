// A Crown Trader's card: their photo, name, line, sessions and prices, and the way to book. Used by
// scripts/crown-links/generate.mjs to write each coach's page (/app/<coach-id>/), by those pages to refresh their prices,
// and by the invitation page (/app/?ref=<coach-id>) to show the same card. The rules for who is listed and what can be
// booked follow friendly-trader-web lib/coaching/model.ts (bookable, sessionName, money, duration).

export const SITE = "https://thefriendlytrader.com";
export const WEB = "https://app.thefriendlytrader.com";
export const CATALOG_URL = WEB + "/api/coaching/catalog";
export const COACHING = WEB + "/coaching";
export const APP_STORE = "https://apps.apple.com/us/app/friendly-trader-learn-trading/id6802470823";
export const COACH_ID = /^[a-z0-9-]{1,64}$/;
// A class's time id as coaching-api writes it (the SLOT rule in friendly-trader-web lib/coaching/arrival.ts).
export const CLASS_ID = /^s[0-9a-f]{32}$/;

const object = (v) => !!v && typeof v === "object" && !Array.isArray(v);
const text = (v) => (typeof v === "string" ? v.trim() : "");

// The catalog's own shape check (friendly-trader-web isCatalog), so a bad answer never empties a card.
export const isCatalog = (v) => object(v) && Number.isInteger(v.version) && Array.isArray(v.coaches) &&
  v.coaches.every((c) => object(c) && typeof c.id === "string" && typeof c.name === "string" && Array.isArray(c.offerings));

export function listed(catalog) {
  if (!object(catalog) || !Array.isArray(catalog.coaches)) return [];
  return catalog.coaches
    .filter((c) => object(c) && COACH_ID.test(c.id) && text(c.name) && c.paused !== true && Array.isArray(c.offerings))
    .sort((a, b) => (a.sort ?? 999) - (b.sort ?? 999));
}

export function money(price) {
  if (!object(price) || !Number.isSafeInteger(price.amount_cents) || !/^[a-z]{3}$/i.test(price.currency ?? "")) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: price.currency, minimumFractionDigits: price.amount_cents % 100 ? 2 : 0,
  }).format(price.amount_cents / 100);
}

export function duration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60), rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

const KINDS = ["one_on_one", "masterclass"];
const bookable = (o) => object(o) && o.status === "bookable" && !o.gift_only && o.price?.amount_cents > 0 &&
  !!o.duration_minutes && !!text(o.policy?.summary) && KINDS.includes(o.kind) && o.payment?.provider === "whop";

export function offers(coach) {
  const all = Array.isArray(coach?.offerings) ? coach.offerings : [];
  const single = all.filter((o) => o?.kind === "one_on_one").length === 1;
  return all.filter(bookable)
    .sort((a, b) => KINDS.indexOf(a.kind) - KINDS.indexOf(b.kind))
    .map((o) => ({
      kind: o.kind,
      name: o.kind === "one_on_one" && single ? "1-on-1" : text(o.title),
      length: duration(o.duration_minutes),
      price: money(o.price),
    }))
    .filter((o) => o.name && o.price);
}

export const bookingURL = (id, classId) =>
  `${WEB}/coaching/coach/${id}` + (typeof classId === "string" && CLASS_ID.test(classId) ? `?class=${classId}` : "");

export function classFrom(search) {
  const value = new URLSearchParams(search ?? "").get("class");
  return value && CLASS_ID.test(value) ? value : null;
}

// What a card needs, as app/coaches.json keeps it.
export const summary = (coach, photo) => ({
  id: coach.id,
  name: text(coach.name),
  role: coach.role === "founder" ? "Founder" : "Crown Trader",
  headline: text(coach.headline),
  photo: photo ?? null,
  offers: offers(coach),
});

export const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

export const offersHTML = (list) => list.map((o) =>
  `<li><span class="cc-what">${esc(o.name)}<small>${esc(o.length)}</small></span><b>${esc(o.price)}</b></li>`).join("");

export function cardHTML(card, { heading = "h1", appStore = true, classId = null } = {}) {
  const h = heading === "h2" ? "h2" : "h1";
  const face = card.photo
    ? `<img class="cc-face" src="${esc(card.photo)}" width="750" height="750" alt="${esc(card.name)}">`
    : "";
  return `<article class="cc${face ? "" : " cc-no-face"}" data-coach="${esc(card.id)}">
  ${face}
  <div class="cc-body">
    <p class="cc-role">${esc(card.role)}</p>
    <${h} class="cc-name">${esc(card.name)}</${h}>
    ${card.headline ? `<p class="cc-line">${esc(card.headline)}</p>` : ""}
    <ul class="cc-offers"${card.offers.length ? "" : " hidden"}>${offersHTML(card.offers)}</ul>
    <p class="cc-closed" hidden>${esc(card.name)} is not taking bookings right now.</p>
    <a class="cc-book" href="${esc(bookingURL(card.id, classId))}">See times and book</a>
    ${appStore ? `<a class="cc-get" href="${APP_STORE}">Get Friendly Trader</a>` : ""}
  </div>
</article>`;
}

// What the live catalog says about one coach: their sessions now, gone (paused or no longer listed), or null when the
// answer can't be read, in which case the card keeps what the page was made with.
export function decideLive(catalog, id) {
  if (!isCatalog(catalog)) return null;
  const coach = listed(catalog).find((c) => c.id === id);
  return coach ? { state: "listed", offers: offers(coach) } : { state: "gone" };
}

export function applyLive(card, decision) {
  if (!card || !decision) return;
  const list = card.querySelector(".cc-offers"), closed = card.querySelector(".cc-closed"), book = card.querySelector(".cc-book");
  if (decision.state === "gone") {
    list.hidden = true;
    closed.hidden = false;
    book.href = COACHING;
    book.textContent = "See all coaches";
    return;
  }
  list.innerHTML = offersHTML(decision.offers);
  list.hidden = decision.offers.length === 0;
}

// Prices on the page come from the catalog when it was made; this brings them up to date. The website lets this site
// read its catalog (GET only, no cookies). Anything that goes wrong leaves the card as it was.
export async function refreshCard(card, id, { fetch: get = globalThis.fetch, timeout = 8000 } = {}) {
  if (!card || !COACH_ID.test(id ?? "") || typeof get !== "function") return null;
  const stop = typeof AbortController === "function" ? new AbortController() : null;
  const timer = stop ? setTimeout(() => stop.abort(), timeout) : null;
  try {
    const res = await get(CATALOG_URL, { credentials: "omit", cache: "no-store", signal: stop?.signal });
    if (!res.ok) return null;
    const decision = decideLive(await res.json(), id);
    applyLive(card, decision);
    return decision;
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
