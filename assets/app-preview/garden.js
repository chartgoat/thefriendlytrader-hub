// The page opens inside the app's garden. Scrolling pulls the camera back until the
// garden is the real Home screen on a phone, then walks through the questions.
(() => {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = !!navigator.connection?.saveData;
  // With reduced motion the shot cuts between states instead of moving.
  const ease = (t) => (reduce ? (t >= .5 ? 1 : 0) : smooth(t));

  const story = $('#g-story'), stage = $('#g-stage'), world = $('#g-world'), clip = $('#g-clip'), film = $('#g-film'), shot = $('#g-shot'), bezel = $('#g-bezel'), scrim = $('#g-scrim');
  const heroCopy = $('#g-hero-copy'), carved = $('#g-carved'), lead = $('#g-lead'), device = $('#g-device'), lift = $('#g-lift'), bar = $('#g-bar'), loop = $('#g-loop'), night = $('#g-night'), closing = $('#membership');
  const copies = $$('[data-c]'), shots = $$('[data-s]'), edge = $('#g-edge'), themeColor = $('meta[name="theme-color"]');

  // Measured on the Home capture (1320 by 2868): the film fills its width and starts 345 px down, with Pip here in it.
  const FILM = { x: 0, y: 345, size: 1320 }, PIP = { x: .465, y: .577 }, PIP_BELOW = .084;
  // The same crops the App Store frames lift out of the phone.
  const LIFTS = { 1: { src: 'assets/home/stop.jpg', x: 48, y: 1178, x2: 1272, y2: 2030, scale: 1.08 }, 4: { src: 'assets/home/pip.jpg', x: 40, y: 1575, x2: 1280, y2: 2640, scale: 1.06 } };
  const LAST = 4, ZOOM_END = .22, SPAN = LAST + .55, STATUS = .06;
  const narrowQuery = matchMedia('(max-width:800px),(max-aspect-ratio:1/1)'), BAR_CLEAR = 62;
  let g, liftAt = null, wasNight = null;

  function measure() {
    const vw = innerWidth, vh = stage.clientHeight, narrow = narrowQuery.matches;
    const w = device.offsetWidth, h = device.offsetHeight, inset = w * .027;
    const x = narrow ? (vw - w) / 2 : vw * .71 - w / 2;
    // On a phone the device sits below the tallest question.
    const copyBottom = Math.max(...copies.map((c) => c.offsetTop + c.offsetHeight));
    const y = narrow ? Math.max(vh * .4, copyBottom + 10) : Math.max((vh - h) / 2, BAR_CLEAR);
    const sw = w - inset * 2, sh = h - inset * 2, sx = x + inset, sy = y + inset;
    const filmL = FILM.size / 1320 * sw, fx0 = FILM.x / 1320 * sw, fy0 = FILM.y / 2868 * sh;
    Object.assign(world.style, { width: `${sw}px`, height: `${sh}px` });
    Object.assign(film.style, { left: `${fx0}px`, top: `${fy0}px`, width: `${filmL}px`, height: `${filmL}px` });
    Object.assign(bezel.style, { left: `${-inset}px`, top: `${-inset}px`, width: `${w}px`, height: `${h}px` });
    // The opening frames the film so Pip stands just above the headline, without showing the film's edges.
    const L0 = narrow ? Math.max(vh * 1.2, vw) : Math.max(vw, vh * 1.3);
    const k0 = L0 / filmL, fx = fx0 + PIP.x * filmL, fy = fy0 + PIP.y * filmL;
    const textTop = heroCopy.offsetTop + carved.offsetTop, lowest = vh - (1 - PIP.y) * L0, highest = PIP.y * L0;
    const P0x = narrow ? vw / 2 : (vw - L0) / 2 + PIP.x * L0;
    const P0y = clamp(Math.min(narrow ? lowest : vh * .44, textTop - 4 - PIP_BELOW * L0), lowest, highest);
    g = { vw, vh, narrow, w, h, inset, sw, sh, k0, fx, fy, P0x, P0y, P1x: sx + fx, P1y: sy + fy };
    device.style.transform = `translate3d(${x}px,${y}px,0)`;
    liftAt = null;
    update();
  }
  function setLift(k) {
    if (liftAt === k) return;
    liftAt = k;
    const L = LIFTS[k], { sw, sh, inset } = g;
    Object.assign(lift.style, {
      left: `${inset + L.x / 1320 * sw}px`, top: `${inset + L.y / 2868 * sh}px`,
      width: `${(L.x2 - L.x) / 1320 * sw}px`, height: `${(L.y2 - L.y) / 2868 * sh}px`,
      backgroundImage: `url(${L.src})`, backgroundSize: `${sw}px ${sh}px`,
      backgroundPosition: `${-L.x / 1320 * sw}px ${-L.y / 2868 * sh}px`,
    });
  }
  const show = (el, o) => { el.style.opacity = o; el.style.visibility = o > .01 ? 'visible' : 'hidden'; };

  function update() {
    if (!g) return;
    const r = story.getBoundingClientRect(), max = r.height - g.vh, px = clamp(-r.top / max);
    const z = clamp(px / ZOOM_END), s = clamp((px - ZOOM_END) / (1 - ZOOM_END)) * SPAN;
    const zz = ease(clamp((z - .05) / .95));

    // One camera move: Pip's path and the zoom share the same clock.
    const k = Math.pow(g.k0, 1 - zz), Px = lerp(g.P0x, g.P1x, zz), Py = lerp(g.P0y, g.P1y, zz);
    world.style.transform = `translate3d(${Px - k * g.fx}px,${Py - k * g.fy}px,0) scale(${k})`;
    clip.style.clipPath = `inset(${-(1 - ease(clamp(zz / .34))) * g.sw * 3}px round ${g.w * .132}px)`;

    const fade = 1 - ease(clamp(z / .26));
    show(carved, fade); show(lead, fade); scrim.style.opacity = fade;
    carved.style.transform = `translate3d(0,${(1 - fade) * 26}px,0)`;
    shot.style.opacity = ease(clamp((zz - .03) / .2));
    // The bezel is on from the start of the move, so its edges come into frame like a real phone pulling away.
    bezel.style.opacity = ease(clamp(zz / .1));
    device.style.visibility = z >= 1 ? 'visible' : 'hidden';

    const atNight = closing.getBoundingClientRect().top < g.vh * .06;
    bar.style.setProperty('--g-bar', (z < .2 && !g.narrow) || atNight ? '#F4EFE6' : '#123527');
    if (atNight !== wasNight) {
      wasNight = atNight;
      document.documentElement.classList.toggle('at-night', atNight);
      themeColor.content = atNight ? '#111D22' : '#CFC8BA';
    }
    bar.classList.toggle('is-past', z > .85);
    bar.classList.toggle('on-night', atNight);
    // From the moment the wall scrolls off until the night, the bar steps aside: nothing sits on top of the film.
    bar.classList.toggle('is-away', !atNight && r.bottom < g.vh - 1);

    // Each question holds, then hands over to the next one.
    const handover = (i) => ease(clamp((s - i + .4) / .4));
    copies.forEach((c, i) => {
      const inn = i === 0 ? ease(clamp((z - .72) / .28)) : handover(i), out = i === LAST ? 0 : handover(i + 1);
      const o = clamp(inn * 2 - 1) * (1 - clamp(out * 2.2));
      show(c, o);
      c.style.pointerEvents = o > .5 ? 'auto' : 'none';
      c.style.transform = `${g.narrow ? '' : 'translateY(-50%)'} translateY(${(1 - inn) * 26 - out * 26}px)`;
    });
    // The next screen comes up under the phone's status bar, which stays put, and takes it over as it lands.
    let rising = null;
    shots.forEach((img) => {
      const t = handover(+img.dataset.s);
      img.style.transform = `translate3d(0,${(1 - t) * 104}%,0)`;
      img.style.clipPath = `inset(${t < 1 ? STATUS * 100 : 0}% 0 0)`;
      img.style.visibility = t > 0 ? 'visible' : 'hidden';
      if (t > 0 && t < 1) rising = t;
    });
    edge.style.opacity = rising == null ? 0 : clamp((1 - rising) / .12);
    if (rising != null) edge.style.transform = `translate3d(0,${(STATUS + (1 - rising) * 1.04) * g.sh}px,0)`;

    // The part of the screen a question is about comes off the glass.
    let lk = null, lt = 0;
    for (const key of Object.keys(LIFTS).map(Number)) {
      const t = clamp((s - key + .08) / .24) * (1 - clamp((s - key - .55) / .14));
      if (t > lt) { lt = t; lk = key; }
    }
    if (lk != null) {
      setLift(lk);
      lift.style.opacity = lt > .02 ? 1 : 0;
      lift.style.transform = `scale(${lerp(1, LIFTS[lk].scale, ease(lt))})`;
    } else lift.style.opacity = 0;
  }

  // Film plays only while it can be seen. Reduced motion and Data Saver keep the still.
  const playing = { loop: true, night: false };
  function syncFilms() {
    const open = document.body.classList.contains('preview-open');
    const run = (video, wanted, src) => {
      if (reduce || saveData) return;
      if (wanted && !open) {
        if (!video.getAttribute('src')) video.src = src;
        video.play().catch(() => {});
      } else video.pause();
    };
    run(loop, playing.loop, 'assets/home/garden.mp4');
    run(night, playing.night, 'assets/home/garden-night.mp4');
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { playing.loop = e.isIntersecting; syncFilms(); }, { rootMargin: '-2px' }).observe(story);
    new IntersectionObserver(([e]) => { playing.night = e.isIntersecting; syncFilms(); }, { rootMargin: '300px' }).observe(closing);
  }
  new MutationObserver(syncFilms).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  let tick = false;
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; update(); }); } }, { passive: true });
  addEventListener('resize', measure);
  measure();
  document.fonts?.ready.then(measure);
  syncFilms();
})();
