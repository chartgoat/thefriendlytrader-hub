// The film's small player: a play button over the poster, real next steps at the end,
// and it stops when the app preview opens. The video works with native controls alone.
const root = document.getElementById("watch");
if (root) {
  const video = root.querySelector("video");
  const play = root.querySelector(".film-play");
  const end = root.querySelector(".film-end");
  if (matchMedia("(max-width: 700px)").matches) video.poster = video.dataset.posterPortrait;
  // Native controls stay in the markup for no-script visitors; with script they wait for the first press.
  video.controls = false;
  play.hidden = false;
  const start = () => {
    play.hidden = true;
    end.hidden = true;
    video.controls = true;
    video.play().catch(() => { play.hidden = false; video.controls = false; });
  };
  play.addEventListener("click", start);
  video.addEventListener("play", () => { play.hidden = true; end.hidden = true; video.controls = true; });
  video.addEventListener("ended", () => { end.hidden = false; });
  root.querySelector("[data-film-replay]").addEventListener("click", () => { video.currentTime = 0; start(); });
  for (const link of document.querySelectorAll("[data-watch]")) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      root.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
      start();
    });
  }
  new MutationObserver(() => {
    if (document.body.classList.contains("preview-open")) video.pause();
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
}
