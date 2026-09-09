import {FILM,FILM_DURATION,filmFrame,filmTime} from './film-script.mjs';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createFilm({phone,showFrame,openApp,closeApp,onStatus}){
  const capture=new URLSearchParams(location.search).has('film-capture');
  const home=phone.parentElement,anchor=phone.nextSibling;
  const film=document.createElement('section');
  film.className='marketing-film';film.hidden=true;film.setAttribute('role','dialog');film.setAttribute('aria-modal','true');film.setAttribute('aria-label','Friendly Trader marketing film');
  film.innerHTML=`<div class="film-heading"><span><img src="/assets/app-preview/app-icon.png" alt=""> Friendly Trader</span><button data-film="close" aria-label="Close film">Close ×</button></div><div class="film-picture"><div class="film-canvas"><div class="film-brandline"><img src="/assets/app-preview/app-icon.png" alt="">Friendly Trader</div><div class="film-copy"><div class="film-pip"><img src="/assets/app-preview/pip.png" alt="Pip"></div><h2></h2><p></p><div class="film-cue"></div></div><div class="film-device"></div><div class="film-signature">Simulated app examples</div></div><video class="film-video" playsinline preload="metadata" aria-label="Friendly Trader 90-second product film"></video><div class="film-ended" hidden><h2>Make yourself at home.</h2><button data-film="explore">Step inside the app</button><button data-film="restart">Watch again</button></div></div><p class="film-accessible-copy" aria-live="polite"></p><div class="film-controls"><div class="film-transport"><button data-film="play" aria-label="Pause film">Ⅱ</button><label class="film-time" aria-label="Film time">0:00 / 1:30</label><input type="range" min="0" max="90" step="0.5" value="0" aria-label="Film timeline"><button data-film="sound" aria-label="Mute film" aria-pressed="false">Sound on</button></div><div class="film-actions"><select aria-label="Film chapter">${FILM.map(s=>`<option value="${s.start}">${escape(s.chapter)}</option>`).join('')}</select><span class="film-hint">Like what you see? Try it.</span><button class="film-explore" data-film="explore">Pause and explore ↗</button></div></div>`;
  document.body.append(film);
  const video=film.querySelector('video'),canvas=film.querySelector('.film-canvas'),slot=film.querySelector('.film-device'),timeline=film.querySelector('input'),chapters=film.querySelector('select'),playButton=film.querySelector('[data-film=play]'),soundButton=film.querySelector('[data-film=sound]');
  canvas.inert=!capture;canvas.setAttribute('aria-hidden',String(!capture));
  const portraitQuery=matchMedia('(max-width:700px)');
  let time=0,playing=false,opened=false,started=false,lastKey='',origin=null,muted=false,fallback=false,lastTick=0,raf=0;
  const inertSite=enabled=>[...document.body.children].filter(el=>el!==film&&!['SCRIPT','LINK'].includes(el.tagName)).forEach(el=>el.inert=enabled);
  function restorePhone(){if(phone.parentElement!==home)home.insertBefore(phone,anchor);}
  function compose(force=false){
    const f=filmFrame(time);
    if(force||lastKey!==f.key){
      lastKey=f.key;canvas.dataset.kind=f.kind;canvas.dataset.scene=f.id;canvas.dataset.platform=f.platform;
      canvas.querySelector('h2').innerHTML=escape(f.title).replace(/\n/g,'<br>');canvas.querySelector('.film-copy>p').textContent=f.body;canvas.querySelector('.film-cue').textContent=f.cue||'';
      showFrame(f);canvas.dataset.frame=f.key;film.querySelector('.film-accessible-copy').textContent=f.title.replace(/\n/g,' ')+' '+f.body;
    }
    canvas.style.setProperty('--film-phase',Math.min(1,f.local/(f.end-f.start)));
    chapters.value=String(FILM[f.index].start);
    timeline.value=String(time);timeline.setAttribute('aria-valuetext',`${filmTime(time)} of 1:30. ${f.chapter}`);
    film.querySelector('.film-time').textContent=`${filmTime(time)} / 1:30`;
    film.querySelector('.film-ended').hidden=time<FILM_DURATION;
    playButton.textContent=playing?'Ⅱ':'▶';playButton.setAttribute('aria-label',playing?'Pause film':time>=FILM_DURATION?'Replay film':'Play film');
    film.dataset.playing=String(playing);onStatus({started,playing,time});
  }
  function stop(){playing=false;video.pause();cancelAnimationFrame(raf);compose();}
  function tick(now){if(!playing)return;if(fallback||capture){time=Math.min(FILM_DURATION,time+(now-lastTick)/1000);}else if(!video.seeking&&video.readyState>=2)time=Math.min(FILM_DURATION,video.currentTime);lastTick=now;compose();if(time>=FILM_DURATION){stop();return;}raf=requestAnimationFrame(tick);}
  function run(){
    if(time>=FILM_DURATION)seek(0);
    playing=true;started=true;lastTick=performance.now();
    if(!capture&&!fallback){video.currentTime=time;video.muted=muted;video.play().catch(()=>{if(!opened||!playing)return;fallback=true;film.classList.add('film-fallback');});}
    compose();cancelAnimationFrame(raf);raf=requestAnimationFrame(tick);
  }
  function seek(next){time=Math.max(0,Math.min(FILM_DURATION,Number(next)||0));if(!capture&&!fallback&&video.readyState)video.currentTime=time;compose();}
  function enter(resume=true){
    closeApp();origin=document.activeElement;opened=true;started=true;film.hidden=false;document.body.classList.add('film-open');inertSite(true);
    slot.append(phone);film.classList.toggle('film-capture',capture);
    if(!capture){const portrait=portraitQuery.matches;const src=`/assets/app-preview/media/friendly-trader-film-${portrait?'portrait':'landscape'}.mp4`;if(video.getAttribute('src')!==src){video.src=src;video.load();}}
    compose(true);playButton.focus();if(resume)run();
  }
  function leave(explore=false){
    stop();opened=false;film.hidden=true;document.body.classList.remove('film-open');inertSite(false);restorePhone();
    if(explore){showFrame(filmFrame(Math.min(time,FILM_DURATION-.1)));openApp();}else origin?.focus();
    onStatus({started,playing,time});
  }
  film.addEventListener('click',e=>{
    const action=e.target.closest('[data-film]')?.dataset.film;
    if(action==='close')leave();
    if(action==='explore')leave(true);
    if(action==='play')playing?stop():run();
    if(action==='restart'){seek(0);run();}
    if(action==='sound'){muted=!muted;video.muted=muted;soundButton.textContent=muted?'Sound off':'Sound on';soundButton.setAttribute('aria-label',muted?'Unmute film':'Mute film');soundButton.setAttribute('aria-pressed',String(muted));}
    if(e.target===video)leave(true);
  });
  timeline.addEventListener('input',()=>{const value=timeline.value;stop();seek(value);});
  chapters.addEventListener('change',()=>{const value=chapters.value;stop();seek(value);});
  video.addEventListener('loadedmetadata',()=>{video.currentTime=time;});
  video.addEventListener('ended',()=>{time=FILM_DURATION;stop();});
  video.addEventListener('error',()=>{if(capture)return;fallback=true;film.classList.add('film-fallback');soundButton.hidden=true;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&opened)stop();});
  portraitQuery.addEventListener('change',()=>{if(!opened||capture)return;const was=playing;stop();video.src=`/assets/app-preview/media/friendly-trader-film-${portraitQuery.matches?'portrait':'landscape'}.mp4`;fallback=false;film.classList.remove('film-fallback');soundButton.hidden=false;video.load();if(was)run();});
  film.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();leave();return;}
    if(e.key===' '&&!['INPUT','SELECT','BUTTON'].includes(e.target.tagName)){e.preventDefault();playing?stop():run();}
    if(e.key==='Tab'){const nodes=[...film.querySelectorAll('button,input,select')].filter(el=>el.offsetParent!==null&&!el.disabled&&!el.closest('[inert]')),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
  return {start(){time=0;enter();},resume(){enter();},pause(){if(opened)stop();},started:()=>started,capture,seek,enter};
}
