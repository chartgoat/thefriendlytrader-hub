// Meta Pixel for the home page of thefriendlytrader.com only (the FAQ and privacy pages run no scripts).
// It tells Meta about a page view and three taps (Try the app, Start the free course, a Join button)
// so we can see whether Facebook and Instagram ads bring visitors. Nothing typed on the page is read.
// It stays off when the browser sends Global Privacy Control. Described on /privacy/#web.
(function () {
  var PIXEL_ID = "PIXEL_ID_HERE";
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
  w.fbq("init", PIXEL_ID);
  w.fbq("track", "PageView");

  document.addEventListener(
    "click",
    function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-site="explore"], a[href]') : null;
      if (!el) return;
      if (el.matches('[data-site="explore"]')) {
        w.fbq("track", "ViewContent", { content_name: "Try the app" });
        return;
      }
      var href = el.getAttribute("href") || "";
      if (href.indexOf("app.thefriendlytrader.com/learn") !== -1) {
        w.fbq("track", "Lead", { content_name: "Free course" });
      } else if (href.indexOf("whop.com/checkout/") !== -1) {
        var plan = (el.textContent || "").replace(/\s+/g, " ").replace(/\bJoin\b/, "").trim().slice(0, 60);
        w.fbq("track", "InitiateCheckout", { content_name: plan });
      }
    },
    true
  );
})();
