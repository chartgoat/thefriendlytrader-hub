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

The film, the four screens and the plans are unchanged. "Start the free course" left the first screen (it is still under the film and beside the plans), so the first screen keeps two things to press.

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
3. Update `tests/early-access.test.mjs` to the new first screen, and keep the unsubscribe page, its script and `core.mjs`: emails already sent link to it.
4. Leave the privacy page's early access section in place while the list exists.

## Not done here

- The page was tried in the Browser pane at phone, tablet and desktop sizes against the stand-in. It has not been tried on a real iPhone or against the deployed server.
- No confirmation email is sent at sign-up. The page says "You're in" and nothing else is promised.
