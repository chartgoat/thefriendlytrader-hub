// Meta Pixel for the home page of thefriendlytrader.com only (the FAQ and privacy pages run no scripts).
// It tells Meta about a page view and a tap on Try the app; the early access box
// (assets/early-access/form.mjs) adds one event when a sign-up succeeds, with no address in it,
// so we can see whether Facebook and Instagram ads bring visitors. Nothing typed on the page is read.
// It is added to the page by assets/consent.js only after the visitor presses Accept, and it
// stays off when the browser sends Global Privacy Control. Described on /privacy/#web.
(function () {
  var PIXEL_ID = "1062856350106416";
  if (!/^\d{10,20}$/.test(PIXEL_ID)) return;
  if (navigator.globalPrivacyControl === true) return;
  var w = window;
  if (w.fbq) return;
  var q = (w.fbq = function () {
    q.callMethod ? q.callMethod.apply(q, arguments) : q.queue.push(arguments);
  });
  if (!w._fbq) w._fbq = q;
  q.push = q;
  q.loaded = true;
  q.version = "2.0";
  q.queue = [];
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  // No automatic events: Meta would otherwise record the text of every button tapped.
  // Only the two events below, and the sign-up event from the early access box, are sent, as the privacy page says.
  w.fbq("set", "autoConfig", false, PIXEL_ID);
  w.fbq("init", PIXEL_ID);
  w.fbq("track", "PageView");

  document.addEventListener(
    "click",
    function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-site="explore"]') : null;
      if (el) w.fbq("track", "ViewContent", { content_name: "Try the app" });
    },
    true
  );
})();
