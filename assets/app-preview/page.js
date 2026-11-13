// The garden film plays only while it can be seen. Reduced motion and Data Saver keep the still.
(() => {
  const loop = document.querySelector('#g-loop'), hero = document.querySelector('.g-hero');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches || !!navigator.connection?.saveData;
  let seen = true;

  function sync() {
    if (still) return;
    if (seen && !document.body.classList.contains('preview-open')) {
      if (!loop.getAttribute('src')) loop.src = 'assets/home/garden.mp4';
      loop.play().catch(() => {});
    } else loop.pause();
  }

  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync(); }).observe(hero);
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  sync();
})();
