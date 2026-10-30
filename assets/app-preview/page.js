// The garden films play only while they can be seen. Reduced motion and Data Saver keep the stills.
(() => {
  const loop = document.querySelector('#g-loop'), night = document.querySelector('#g-night');
  const hero = document.querySelector('.g-hero'), closing = document.querySelector('#membership');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches || !!navigator.connection?.saveData;
  const seen = { loop: true, night: false };

  function sync() {
    if (still) return;
    const open = document.body.classList.contains('preview-open');
    const run = (video, wanted, src) => {
      if (wanted && !open) {
        if (!video.getAttribute('src')) video.src = src;
        video.play().catch(() => {});
      } else video.pause();
    };
    run(loop, seen.loop, 'assets/home/garden.mp4');
    run(night, seen.night, 'assets/home/garden-night.mp4');
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { seen.loop = e.isIntersecting; sync(); }).observe(hero);
    new IntersectionObserver(([e]) => { seen.night = e.isIntersecting; sync(); }, { rootMargin: '300px' }).observe(closing);
    // Once the night section reaches the top, Safari's bands turn to night with it.
    new IntersectionObserver(([e]) => { document.documentElement.classList.toggle('at-night', e.isIntersecting); }, { rootMargin: '-6% 0px -94% 0px' }).observe(closing);
  }
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  sync();
})();
