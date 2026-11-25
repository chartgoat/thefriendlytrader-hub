// GitHub Pages answers every missing address with /404.html. Under /app/ that is a coach link with no page here: a coach
// listed before scripts/crown-links/generate.mjs made their page, or one who is not listed (never, paused or gone).
// /app/<coach-id> goes to that coach's booking on the website, keeping a class and its start, by the same rules as the
// coach pages (app/coach-card.mjs bookingURL); the website shows Coaching for an id it does not list. Anything else
// under /app/ opens Coaching's start. A plain script, so it decides before the page draws.
(function () {
  var path = location.pathname;
  if (!/^\/app\//.test(path)) return;
  var web = "https://app.thefriendlytrader.com/coaching";
  var coach = /^\/app\/([a-z0-9-]{1,64})\/?$/.exec(path);
  if (!coach) return location.replace(web);
  var query = new URLSearchParams(location.search), classId = query.get("class"), at = query.get("at");
  var to = web + "/coach/" + coach[1];
  if (classId && /^s[0-9a-f]{32}$/.test(classId)) {
    to += "?class=" + classId;
    if (at && /^[1-9]\d{8,10}$/.test(at)) to += "&at=" + at;
  }
  location.replace(to);
})();
