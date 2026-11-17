// The ad choice for the home page of thefriendlytrader.com.
// The Meta Pixel (assets/meta-pixel.js) is not on the page until the visitor presses Accept here.
// No answer means no: nothing from Meta loads, and no cookie is set.
// The answer is kept in this browser's local storage under "ft-ads" ("yes" or "no") and goes nowhere.
// A browser that sends Global Privacy Control has already answered no, so it is not asked.
// /?ads=ask (linked from the privacy page) forgets the answer and asks again.
(function () {
  var KEY = "ft-ads";
  var bar = document.getElementById("ads-ask");
  if (!bar || navigator.globalPrivacyControl === true) return;

  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(value) {
    try { value ? window.localStorage.setItem(KEY, value) : window.localStorage.removeItem(KEY); } catch (e) {}
  }
  function loadPixel() {
    if (document.querySelector('script[data-ads="meta"]')) return;
    var s = document.createElement("script");
    s.src = "assets/meta-pixel.js";
    s.async = true;
    s.setAttribute("data-ads", "meta");
    document.head.appendChild(s);
  }

  if (/[?&]ads=ask(&|$)/.test(window.location.search)) write(null);

  var answer = read();
  if (answer === "yes") return loadPixel();
  if (answer === "no") return;

  bar.hidden = false;
  bar.addEventListener("click", function (e) {
    var button = e.target && e.target.closest ? e.target.closest("[data-ads]") : null;
    if (!button) return;
    var yes = button.getAttribute("data-ads") === "yes";
    write(yes ? "yes" : "no");
    bar.hidden = true;
    if (yes) loadPixel();
  });
})();
