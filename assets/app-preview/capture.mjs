import { SCREENS } from './core.mjs';

export function prepareCapture({ state, render, showFilmFrame, fullscreen, root, phone, stage }) {
  const params = new URLSearchParams(location.search);
  const requested = params.get('product-capture');
  const screen = SCREENS.some(([id]) => id === requested) ? requested : 'home';
  const platform = params.get('platform') === 'macos' ? 'macos' : 'ios';
  const id = ({ aplus:'plan', stops:'risk', assistant:'pip', chat:'community' })[screen] || screen;
  showFilmFrame({ id, screen, platform, local:0,
    detail:params.get('detail') || null, room:params.get('room') || 'Trading Floor' });
  if (screen === 'assistant' && params.has('empty')) {
    state.pipQuestion = ''; state.pipAnswer = ''; render();
  }
  if (params.has('risk')) {
    state.riskBudget = Math.max(1, Math.min(1000000, Number(params.get('risk')) || 250));
    render();
  }
  fullscreen(true);
  document.body.classList.add('product-capture');
  const style = document.createElement('style');
  style.textContent = `
    html,body.product-capture{margin:0!important;padding:0!important;overflow:hidden!important;background:#fff!important}
    .product-capture #preview-stage{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;max-width:none!important;padding:0!important;margin:0!important;display:block!important;background:#fff!important}
    .product-capture #preview-stage>:not(#phone){display:none!important}
    .product-capture #phone{position:absolute!important;inset:0!important;width:100vw!important;height:100vh!important;max-height:none!important;max-width:none!important;min-height:0!important;margin:0!important;transform:none!important;zoom:1!important;border:0!important;border-radius:0!important;box-shadow:none!important}
    .product-capture #app-root{height:100%!important;border-radius:0!important}
    .product-capture #phone::before,.product-capture #phone::after{display:none!important}
    .product-capture .phone-status{display:none!important}
    .product-capture .marketing-film{display:none!important}
  `;
  document.head.append(style);
  phone.dataset.capture = screen;
  requestAnimationFrame(() => {
    const content = root.querySelector('.app-content');
    const focal = params.get('focal');
    if (focal === 'top') content.scrollTop = 0;
    if (focal === 'size') {
      root.querySelector('.n-size')?.closest('details')?.setAttribute('open', '');
    }
    const selector = { chart:'.candlestick-chart', size:'.n-size', answer:'.n-pip-question', wins:'.n-win-message' }[focal];
    const target = selector && root.querySelector(selector);
    if (target) content.scrollTop = Math.max(0, content.scrollTop + target.getBoundingClientRect().top - content.getBoundingClientRect().top - 16);
    stage.dataset.captureReady = 'true';
    if (params.has('motion')) {
      const begin = document.createElement('button');
      begin.textContent = 'Begin motion capture';
      begin.style.cssText = 'position:fixed;top:0;left:0;z-index:10000;padding:12px;background:#fff;color:#153c2b';
      document.body.append(begin);
      begin.onclick = () => {
        begin.remove();
        stage.dataset.motionStarted = String(Date.now());
        animateCapture(params.get('motion'), { state, render, root });
      };
    }
  });
}

function animateCapture(motion, { state, render, root }) {
  const animate = (el, delay = 0) => el?.animate([
    { opacity:0, transform:'translateY(14px)' },
    { opacity:1, transform:'translateY(0)' },
  ], { duration:500, delay, fill:'backwards', easing:'cubic-bezier(.2,.8,.2,1)' });
  if (motion === 'home') {
    [...root.querySelectorAll('.n-home-hero,.n-home-tile,.n-home-row,.n-home-calendars')].forEach((el,i) => animate(el,120+i*65));
  }
  if (motion === 'plan' || motion === 'mac') {
    const svg = root.querySelector('.candlestick-chart');
    const schedule = motion === 'plan' ? { Entry:250, Stop:1400, T1:3850, T2:5700, T3:6000 } : { Entry:700, Stop:1000, T1:1400, T2:1700 };
    for (const text of svg?.querySelectorAll('text') || []) {
      const label = text.textContent.split(' ')[0];
      if (!(label in schedule)) continue;
      const rect = text.previousElementSibling, line = rect.previousElementSibling;
      if (rect.tagName !== 'rect' || line.tagName !== 'line') continue;
      const end = line.getAttribute('x2'), start = line.getAttribute('x1');
      line.setAttribute('x2', start);
      animate(rect,schedule[label]+350); animate(text,schedule[label]+350);
      setTimeout(() => {
        const epoch = performance.now();
        const tick = now => {
          const p = Math.min(1,(now-epoch)/550);
          line.setAttribute('x2',String(Number(start)+(Number(end)-Number(start))*(1-(1-p)**3)));
          if (p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },schedule[label]);
    }
  }
  if (motion === 'size') {
    const set = budget => {
      state.riskBudget = budget; render({keepScroll:true});
      root.querySelector('.n-size')?.closest('details')?.setAttribute('open','');
      root.querySelector('[name="riskBudget"]')?.focus({preventScroll:true});
    };
    set(1);
    [[750,2],[1100,25],[1550,250]].forEach(([ms,value])=>setTimeout(()=>set(value),ms));
    setTimeout(()=>animate(root.querySelector('.n-size>div'),0),1650);
  }
  if (motion === 'pip') {
    const question = 'What does a stop mean?';
    const answer = 'A stop is where you plan to exit if the trade moves against you. Think about it before you enter.';
    state.pipQuestion = question; state.pipAnswer = answer; render();
    const q = root.querySelector('.n-pip-question');
    const a = root.querySelector('.n-pip-bubble[role="status"]');
    q.textContent = ''; a.style.opacity = '0';
    const content = root.querySelector('.app-content');
    content.scrollTop = Math.max(0,q.offsetTop-content.offsetTop-48);
    for (let i=1;i<=question.length;i++) setTimeout(()=>{q.textContent=question.slice(0,i);},3500+i*40);
    setTimeout(()=>{a.style.opacity='1';a.querySelector('p').textContent='';},5850);
    for (let i=1;i<=answer.length;i++) setTimeout(()=>{a.querySelector('p').textContent=answer.slice(0,i);},5850+i*22);
  }
  if (motion === 'room') {
    const content = root.querySelector('.app-content');
    const messages = [...root.querySelectorAll('.n-win-message')];
    messages.filter(el=>el.querySelector('.n-trade-win')).forEach(el=>el.remove());
    const remaining = [...root.querySelectorAll('.n-win-message')];
    content.scrollTop = 0;
    remaining.forEach((el,i)=>animate(el,1300+i*1900));
  }
  if (motion === 'checks') {
    const elements = root.querySelectorAll('.n-story-card,.n-pattern-card,.n-detail-heading,.n-candle-panel,.n-plan-timeline');
    [...elements].forEach((el,i)=>animate(el,100+i*180));
    if (state.screen === 'patterns') {
      root.querySelector('.candlestick-chart g[clip-path]')?.animate([
        { clipPath:'inset(0 100% 0 0)' }, { clipPath:'inset(0 0 0 0)' },
      ], { duration:1600, delay:120, fill:'backwards', easing:'cubic-bezier(.2,.7,.2,1)' });
    }
  }
}
