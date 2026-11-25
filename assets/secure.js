// A visitor who opens the site over plain http is sent to the secure address.
// GitHub Pages normally does this itself ("Enforce HTTPS"). It has refused to since November 19, 2026, while its
// certificate request for thefriendlytrader.com and www.thefriendlytrader.com sits unstarted, and over http the
// sign-up server turns the email box away. Once GitHub enforces HTTPS again this never runs.
(function () {
  var at = window.location;
  if (at.protocol !== "http:") return;
  if (at.hostname !== "thefriendlytrader.com" && at.hostname !== "www.thefriendlytrader.com") return;
  at.replace("https://thefriendlytrader.com" + at.pathname + at.search + at.hash);
})();
