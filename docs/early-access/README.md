# Early access sign-up on the home page

Owner, November 13, 2026: teaser videos run November 15 to 21, the app is on the App Store on Sunday, November 22, and Josh does a live stream only for people who signed up by email. The site collects the addresses; on the 22nd one email goes out from the no-reply box with the stream link, the download link and the steps to get started.

**Live since November 16, 2026.** Owner that day: "yes make it live immediately and get this all updated the best you can and the option course should be able to see the course but only be able to play level 1". The server route was deployed first (swj-chat `21a548a`, function `email-signup`, migration `20261113_email_early_access.sql` applied), then this branch went to `main` with that day's privacy change merged in. In the demo's Options Course every one of the 28 levels is on the map, level 1 plays, and levels 2 to 28 are locked before and after level 1 is finished; a test in `tests/current-app.test.mjs` holds it.

## What changed on the site

| Piece | Where |
| --- | --- |
| The first screen: launch day, one email box, "Get early access", "Try the app" | `index.html` (`.g-hero`), styles in `assets/app-preview/page.css` |
| The box's rules (address check, what is sent, what each answer says) | `assets/early-access/core.mjs` |
| The box itself | `assets/early-access/form.mjs` |
| Unsubscribe page, linked from every email as `/unsubscribe/?i=<row>&t=<signature>` | `unsubscribe/index.html`, `assets/early-access/unsubscribe.mjs` |
| Privacy policy: "The early access list", the Pixel's sign-up event, who sends the emails | `privacy/index.html` |
| Tests | `tests/early-access.test.mjs`; four older tests pin the page's allowed connections |

**Owner, November 13, later the same day:** "the options course is not free the only 2 parts of this site that I like and want to keep is everything above see how it works ... it needs to be fully updates to where things are at now with no duplicates". So the home page is now the first screen, "Tap any screen to try it." and a three-link footer (Help & FAQ, Terms, Privacy). The film and the plans left the page, and the film's files left the site (its captions said the course needed no account). Nothing on the home page or the FAQ calls the options course free or links to the web course, and tests hold all of this (`tests/current-app.test.mjs`). Prices now live in the FAQ only. The Pixel sends a page view, Try the app and the sign-up, nothing else.

The four phone pictures were retaken on November 13 from TestFlight 202611132217 (source `f4a0db230`); how, and what each shows, is in `~/SWJ/operations/early-access-20261113/captures/CAPTURES.md`. They are unedited apart from one thing: on `pip.jpg` the small line "AI assistant · Private" under the sheet's name is covered in white, as it was on the October picture (owner, October 30: no AI descriptors in marketing). Retake them when Home, Stop Finder, the course map or Pip's sheet changes.

The demo behind Try the app was ported again on November 13 from the same build (iOS source `f4a0db230`): Home in the owner's published layout, the new MACD, A+ Scalps, Screener, Big Money (made-up funds only), Pip Brain, the 28-level course with no link out, Coaching, Chat, the Live calendar, Settings and Help. The old tour, the Mac variant and the old film's records and scripts were removed. `HIDDEN_TOOLS` in `assets/app-preview/core.mjs` hides a tool everywhere when the owner switches it off. 194 pictures of its screens are in `~/SWJ/operations/early-access-20261113/demo-screens/`.

## The server

The box posts JSON to `https://grbywbmbiewrxqbfsxpf.supabase.co/functions/v1/email-signup/early-access` (repo `swj-chat`, branch `claude/early-access-20261113`, `docs/email-signups/README.md`). It sends the address, the exact words under the box with their version (`web-early-access-v1`), the hidden trap field, the time since the page opened, and `ref` when the link had `?ref=name`. Give each teaser its own link, such as `https://thefriendlytrader.com/?ref=reel-1`, to see which one brought people.

If the words under the box change, change `CONSENT_VERSION` in `core.mjs` and add the new version on the server first. The privacy page quotes the words, and a test holds the two together.

**The site must not go live before the server route is deployed**, or every sign-up answers "That didn't go through."

## Try it without touching the real list

```bash
node scripts/preview-early-access.mjs
```

It serves the site at http://127.0.0.1:5540 with a stand-in for the server (same answers, held in memory). `http://127.0.0.1:5540/__signups` shows what it received. The stand-in's unsubscribe token for row 1 is `preview-token-1-0000`.

## November 25, 2026: the App Store button, with the box kept

Owner that day: "we are going live with the app today so now there needs to be a direct download link to download the app". The app had been on the App Store since November 22 (id 6802470823, United States only).

The first screen now has **Download on the App Store** under the headline: the one dark button, the same address as `APP_STORE` in `app/coach-card.mjs` (a test holds the two together). The FAQ's "Is there an iPhone app?" answer and its closing button go there too, and the page's search and share words say so.

**The email box stayed.** That day it was still taking sign-ups (the newest an hour before the change) and no launch email had gone to the list. Taking the box away would have stopped a working sign-up and was not asked for. What changed around it:

- Its button is an outline (`.g-line`), so the page has one dark button.
- On phones the box and its button share one row. The App Store button's row is counted in the height kept for the words (`--store` in `page.css`), and on a phone every pixel the words grow makes the film three pixels taller and lifts Pip toward the top edge. With the shared row the gap between Pip and the headline is the same as before at the 17 window sizes measured (320 to 2560 wide).
- After a sign-up the page says "You're in. Watch your inbox." It used to name Sunday, November 22, which had passed.

Two things to press on the first screen are now the App Store button and the box's button. **Try the app is still commented out; bringing it back makes three, so one has to go first** (`tests/current-app.test.mjs` counts what is on the page).

Still the owner's to decide: whether the box goes, stays as it is or gets new words now that the app is out (its line still says "Get early access"), and the launch email itself. The steps below are for the day the box goes.

## Launch day, once the App Store link exists

1. In `index.html`, remove the `<form class="g-early">…</form>` (the App Store button is already above it, since November 25), change the line above it to say the app is on the App Store, and remove the `#early-note` paragraph and the `form.mjs` script tag.
2. In `assets/app-preview/page.css`, the `.g-early*` and `.g-line` rules can go; measure the first screen again and lower the two `--words` heights by what the box took.
3. The button beside the demo (`assets/app-preview/app.js`, "Get early access", action `early-access`) becomes the same App Store link, and its test in `tests/preview.test.mjs` changes with it.
4. Update `tests/early-access.test.mjs` to the new first screen, and keep the unsubscribe page, its script and `core.mjs`: emails already sent link to it.
5. Leave the privacy page's early access section in place while the list exists.

## Not done here

- The page was tried in the Browser pane at phone, tablet and desktop sizes against the stand-in. It has not been tried on a real iPhone or against the deployed server.
- No confirmation email is sent at sign-up. The page says "You're in" and nothing else is promised.
