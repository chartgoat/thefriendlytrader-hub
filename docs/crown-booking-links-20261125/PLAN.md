# Crown Trader booking links: hub lane plan

Lane brief: `~/SWJ/planning/crown-booking-links-20261125/brief-hub.md` (MacBook). Whole plan: `PLAN.md` beside it.

**Goal:** `https://thefriendlytrader.com/app/<coach-id>` is a page for that coach: their photo, name, line, 1-on-1 and
masterclass prices, "See times and book" to the website's booking, "Get Friendly Trader" to the App Store, and a link
preview with their photo and name. The old `/app/?ref=<coach-id>` shows the same coach card above today's invitation.
Apple's association file lets a later app claim `/app/*`.

**Base:** `chartgoat/thefriendlytrader-hub` main `85887a0` (GitHub Pages source: main, `/`; the live
`/app/index.html` and `/.well-known/apple-app-site-association` were byte-identical to it on 2026-11-25 03:40Z).
Branch `claude/crown-links-hub-20261125`. Tests: `npm test` (`node --test`, no dependencies).

## Files

| File | What |
|---|---|
| `app/coach-card.mjs` | Shared by the generator (Node) and both pages (browser): id rules, listed coaches, offers, prices, the card's HTML, the live price refresh |
| `scripts/crown-links/generate.mjs` | Reads the catalog, writes `app/<id>/index.html`, `app/coaches.json`, `assets/coaching/<id>.jpg`; removes pages it made for coaches no longer listed |
| `app/<id>/index.html` | Generated, one per listed coach |
| `app/coaches.json` | Generated, the cards' data for the old link |
| `assets/coaching/<id>.jpg` | The web's bundled photos (750 by 750) |
| `app/coach-page.mjs` | Coach page script: keeps `?class=`, refreshes prices |
| `app/coach.css` | The card and the coach page, scoped to `.cc` and `.coach-page` so the invite page's own rules are untouched |
| `app/invite.mjs` | Today's behaviour, plus the card for a listed coach |
| `.well-known/apple-app-site-association` | `/app/*` for the app after today's `/app/` + `ref`; files under `/app/` excluded; `appclips` unchanged |
| `404.html`, `app/not-found.js` | A missing page under `/app/` (an unknown or removed coach) goes to Coaching's start on the website instead of GitHub's bare 404; other missing pages get a plain page with a link home |
| `tests/crown-links.test.mjs` | The tests below |

## Interfaces

`app/coach-card.mjs`:
- `COACH_ID = /^[a-z0-9-]{1,64}$/`, `CLASS_ID = /^s[0-9a-f]{32}$/` (PLAN: class ids are `s` + 32 hex).
- `listed(catalog) -> Coach[]`: valid id, a name, `paused !== true`, sorted by `sort`.
- `offers(coach) -> {kind,name,length,price}[]`: the web's `bookable()` rule (status bookable, not gift only, a price,
  a length, a policy, Whop), kinds `one_on_one` then `masterclass`; name "1-on-1" when there is one 1-on-1 (as the
  web's `sessionName`), else the title; `money()` and `duration()` as the web formats them.
- `bookingURL(id, classId?)`: `https://app.thefriendlytrader.com/coaching/coach/<id>` plus `?class=<id>` only when
  `CLASS_ID` matches.
- `cardHTML(summary, {heading, appStore, classId})`: escaped HTML for one card.
- `decideLive(catalog, id) -> {state:"listed", offers} | {state:"gone"} | null` (null: catalog unreadable, keep the
  static card). `refreshCard(card, id, {fetch})`: fetches the live catalog without credentials, applies the decision.
  Gone: the offers hide, one plain line says the coach is not taking bookings, the button reads "See all coaches" and
  goes to `https://app.thefriendlytrader.com/coaching`.

`scripts/crown-links/generate.mjs`: `node scripts/crown-links/generate.mjs [--catalog FILE] [--photos DIR] [--root DIR]`.
Default catalog is the live one; default photos come from `https://app.thefriendlytrader.com/coaching/<photo>.jpg`
(the same files as friendly-trader-web `public/coaching/`). A coach's upload (`photo_url`, https) wins, as the web's
`facePhoto` does. Exports `build(catalog, photos)` for the tests. Refuses an unreadable catalog or one with no listed
coach. Removes only `app/<id>/index.html` files that carry its own marker.

## Tasks (test first)

1. **Shared rules.** Test: listed() drops paused coaches and bad ids; offers() matches the web's rule and words;
   bookingURL keeps a valid class and drops anything else; cardHTML escapes names. Then `app/coach-card.mjs`.
2. **Generator.** Test with a fixture catalog in a temp folder: a page per listed coach with its own og:image, title
   `Book <name> · Friendly Trader`, absolute links, the Smart App Banner exactly as the invite page has it; a paused
   coach and a bad id get no page; a page it made for a coach who left is removed, a hand-made page is not. Then the
   script, run against the live catalog and the web's photos.
3. **Committed output.** Test: every coach in `app/coaches.json` has a page and a photo, nothing else under `app/` is a
   coach page, no dashes or tracking, the roster's unlisted traders get no page.
4. **Old link.** Test: invite.mjs keeps today's inviter line and sign-up link, shows the card only for a coach in
   `coaches.json`. Then invite.mjs.
5. **Association file.** Test: valid JSON, today's `/app/` + `ref` first, the file exclusion before `/app/*`, appclips
   unchanged. Then the file.
6. **404.** Test: `/app/` paths go to Coaching's start, others stay on a plain page, no tracking. Then the files.
7. **Look.** Serve locally, look at a coach page, a class link, the old link for a listed coach, an unlisted roster
   trader and no ref, and the 404, at 320 px, 390 px and desktop; the site has no dark theme, so check a dark-mode
   browser keeps the light page.

Each task is its own commit. No tracking, no Pixel, no change to the home page, DNS or Pages settings.
