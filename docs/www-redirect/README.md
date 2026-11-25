# www.thefriendlytrader.com is a redirect on Vercel

Since November 25, 2026 the `www` name is not served by GitHub Pages. A small Vercel project, `thefriendlytrader-www` (team `clancy-bonds-projects`), sends every www visit to `https://thefriendlytrader.com` with the page and the `?ref` tag kept. Its two files are kept here as a copy: `vercel.json` (the redirect) and `index.html` (a fallback that is never reached while the redirect is in place). The working folder is `~/SWJ/projects/thefriendlytrader-www`; deploy from it with `vercel deploy --prod --yes --scope clancy-bonds-projects`.

DNS at GoDaddy: `www` is a CNAME to `cname.vercel-dns.com` (600 seconds). The bare domain's four A records point at GitHub Pages and are not part of this. Vercel holds and renews the certificate for `www`.

## Why

Owner, November 25: Chrome showed "This site doesn't support a secure connection" on the site. The cause was the www name: GitHub never issued a certificate that covers it, so a secure connection to www failed. GitHub's certificate request for both names has read "will begin shortly" since November 19, through three remove-and-add-back tries (November 19, and 19:13Z and 21:06Z on November 25), and it refuses Enforce HTTPS until a certificate is issued.

GoDaddy's own forwarding for the www subdomain was tried first that day (20:20Z to 21:29Z). It sent the bare www address on, but answered 404 for any www link with a page, dropped `?ref` tags, and had no certificate yet. It was removed.

## What is still open

- **GitHub does not enforce HTTPS on the bare domain.** `assets/secure.js` on the home page sends plain http visitors to https; the FAQ and privacy pages allow no scripts and stay on http when opened that way.
- **The bare domain's certificate at GitHub runs to February 6, 2027.** If GitHub's request stays stuck, check well before then that it renews. GitHub Support, from the chartgoat account, is the route.
- Never make www the primary address in GitHub's settings (the November 19 outage).

## Check it

```sh
curl -sI "https://www.thefriendlytrader.com/faq/?ref=reel-1" | grep -i -E "^(HTTP|location)"
```

It answers 301 with `location: https://thefriendlytrader.com/faq/?ref=reel-1`.
