# Early access sign-up on the home page

Owner, November 13, 2026: teaser videos run November 15 to 21, the app is on the App Store on Sunday, November 22, and Josh does a live stream only for people who signed up by email. The site collects the addresses; on the 22nd one email goes out from the no-reply box with the stream link, the download link and the steps to get started.

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

## Launch day, once the App Store link exists

1. In `index.html`, replace the `<form class="g-early">…</form>` with `<a class="g-btn g-primary" href="APP_STORE_LINK">Download on the App Store</a>`, change the line above it to say the app is on the App Store, and remove the `#early-note` paragraph and the `form.mjs` script tag. The first screen still has two things to press.
2. In `assets/app-preview/page.css`, the `.g-early*` rules can go; the first screen's `--words` heights can return to `clamp(210px,8vw + 112px,330px)` and `clamp(198px,10vw + 134px,260px)`.
3. The button beside the demo (`assets/app-preview/app.js`, "Get early access", action `early-access`) becomes the same App Store link, and its test in `tests/preview.test.mjs` changes with it.
4. Update `tests/early-access.test.mjs` to the new first screen, and keep the unsubscribe page, its script and `core.mjs`: emails already sent link to it.
5. Leave the privacy page's early access section in place while the list exists.

## Not done here

- The page was tried in the Browser pane at phone, tablet and desktop sizes against the stand-in. It has not been tried on a real iPhone or against the deployed server.
- No confirmation email is sent at sign-up. The page says "You're in" and nothing else is promised.
