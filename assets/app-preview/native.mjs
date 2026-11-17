import { BASE, NAMES, SCREENS, HIDDEN_TOOLS, QUICK_CHOICES, SYMBOLS, DEMO_TRADES, storyPlan, patternLevels, plan, price, sampleDay, escapeHTML as esc } from './core.mjs';
import { icon as lineIcon, fixtures, messageHTML, btn, nav } from './ui.mjs';

// The iPhone app's screens, ported by hand from its SwiftUI source as delivered in TestFlight 202611132217
// (source commit f4a0db230, November 13, 2026), for a signed-in member with the tools switched on that day.
// Every price, person, fund, message and event is made up for the preview, except the coaches' names, photos and
// specialties (the public coaching page's) and the weekly live schedule's titles, which are the app's own.
export function nativeIcon(name, cls='') {
  if(name==='pip') return pipMark(cls);
  if(name==='bolt') return `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.5 1 3 14h7l-1 9L21 9h-8Z"/></svg>`;
  if(name==='stop') return `<svg class="${cls} c-stop-mark" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 1h10l6 6v10l-6 6H7l-6-6V7Z" fill="currentColor"/><path d="M7.8 3h8.4l4.8 4.8v8.4L16.2 21H7.8L3 16.2V7.8Z" fill="none" stroke="var(--app-bg)" stroke-width=".8"/></svg>`;
  if(name==='person') return `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2Z"/></svg>`;
  if(name==='more') return `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>`;
  if(name==='live') return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M7.500 8q-3 4 0 8M16.500 8q3 4 0 8M4.500 5q-5 7 0 14M19.500 5q5 7 0 14"/></svg>`;
  if(name==='people') return `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="8.500" cy="8" r="3.600"/><circle cx="16.800" cy="8.600" r="3"/><path d="M1.500 20c0-4 3-6.400 7-6.400s7 2.400 7 6.400Z"/><path d="M17.200 20h5.300c0-3.400-2.200-5.500-5.700-5.700 1.400 1.400 2.100 3.300 2.100 5.700Z" opacity=".8"/></svg>`;
  if(name==='house') return `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.500 1.500 11.500h3V21h5.500v-6h4v6h5.500v-9.500h3Z"/></svg>`;
  if(name==='envelope') return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.500" y="5" width="19" height="14" rx="2.500" fill="currentColor"/><path d="m3.500 7 8.500 6.500L20.500 7" fill="none" stroke="var(--app-bg)" stroke-width="1.600" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return lineIcon(name,cls);
}
export function pipMark(cls='') {
  return `<svg class="pip-mark ${cls}" viewBox="0 0 200 200" fill="none" aria-hidden="true"><g fill="currentColor"><rect x="66" y="52" width="18" height="16" rx="4"/><rect x="92" y="40" width="18" height="28" rx="4"/><rect x="118" y="26" width="18" height="42" rx="4"/></g><rect x="36" y="76" width="130" height="96" rx="32" stroke="currentColor" stroke-width="14"/><g stroke="currentColor" stroke-width="8" stroke-linecap="round"><path class="pip-eyes" d="M68 124Q80 106 92 124M110 124Q122 106 134 124"/><path d="M78 142Q101 164 124 142"/></g></svg>`;
}
const I=nativeIcon;
const tag=(label,kind='')=>`<span class="n-tag ${kind}">${label}</span>`;
const label=(text,sub='')=>`<div class="n-section"><h3>${text}</h3>${sub?`<span>${sub}</span>`:''}</div>`;
const pct=(n,digits=1)=>`${n>=0?'+':'−'}${Math.abs(n).toFixed(digits)}%`;
const segment=(values,key,selected,cls='')=>`<div class="n-segment ${cls}" role="group" aria-label="${key}">${values.map(v=>btn(v,'set',`data-key="${key}" data-value="${v}" aria-pressed="${selected===v}"`,selected===v?'selected':'')).join('')}</div>`;
const logo=(t)=>`<span class="n-logo logo-${t.toLowerCase()}">${t==='AAPL'?'●':t==='MSFT'?'<i></i><i></i><i></i><i></i>':t==='NVDA'?'◉':t==='TSLA'?'T':t==='META'?'∞':t.slice(0,2)}</span>`;
const meta=id=>SCREENS.find(x=>x[0]===id);
const on=id=>!HIDDEN_TOOLS.includes(id);

// The preview's clock: a sample Tuesday, 10:42 AM ET, the market open.
const NOW=10*60+42;
const clock=m=>`${(Math.floor(m/60)+11)%12+1}:${String(m%60).padStart(2,'0')} ${m<720?'AM':'PM'}`;
const until=(day,minute)=>{const d=day*1440+minute-NOW;return d<=0?null:d<60?`${d}m`:d<1440?`${Math.floor(d/60)}h ${d%60}m`:`${Math.floor(d/1440)}d ${Math.floor(d%1440/60)}h`;};
const dayName=o=>{const d=sampleDay(o);return `${d.short}, ${d.month} ${d.day}`;};

// Tool pages share one top: the house, the page's mark and name, then Pip.
function top(mark,title,{gold=false,extra=''}={}) {
  return `<header class="app-header c-top">${btn(I('house'),'home','aria-label="Home"','c-disc')}<h2 class="${gold?'gold':''}">${I(mark)}<span>${title}</span></h2><div class="c-top-end">${extra}${btn(pipMark(),'open-pip','aria-label="Pip, your Friendly Assistant"','c-top-pip')}</div></header>`;
}
const sheetTop=(title,{back=false,done=true,sub=''}={})=>`<div class="sheet-handle" aria-hidden="true"></div><header class="app-header c-sheet-top">${back?btn(I('back'),'back','aria-label="Back"','c-disc'):''}<h2>${title}${sub?`<small>${sub}</small>`:''}</h2>${done?btn('Done','close','','c-done'):''}</header>`;
export function sheetStyle(s) {
  return ['profile','assistant','live','quick'].includes(s.screen)||['setup','pattern','event','chart','details','plans','play','add-ticker','book','win-compose','here','saved','menu'].includes(s.detail);
}
// Full screens of their own: no quick menu under them.
export const coverStyle=s=>['coaching','course','welcome'].includes(s.screen);
export function nativeHeader(s) {
  if(s.screen==='welcome'||s.screen==='course') return '';
  if(s.screen==='home') return `<header class="app-header c-home-top"><h2>Friendly Trader</h2><div class="c-top-end">${btn(`${I('envelope')}<b>1</b>`,'announcements','aria-label="Announcements, 1 new"','c-ring')}${btn(`${I('help')}<span>Help</span>`,'help','','c-help')}${btn(I('person'),'open-profile','aria-label="Your profile"','c-ring')}</div></header>`;
  if(s.screen==='coaching') return coachingHeader(s);
  if(s.screen==='chat') return chatHeader(s);
  if(s.detail==='chart') return sheetTop(`${s.symbol}`);
  if(s.detail==='setup'||s.detail==='pattern'||s.detail==='details'||s.detail==='event') return sheetTop('');
  if(s.detail==='play') return sheetTop(`${PLAY_BOARD[s.symbol]||'Live Runners'} · ${sampleDay().month} ${sampleDay().day}`);
  if(s.detail==='plans') return sheetTop('My plans');
  if(s.detail==='add-ticker') return sheetTop('Add ticker');
  if(s.screen==='live') return sheetTop('Live calendar',{sub:'All times ET'});
  if(s.screen==='assistant') return sheetTop(`${pipMark()}Pip`);
  if(s.screen==='quick') return sheetTop('Quick menu');
  if(s.screen==='profile') return s.detail?sheetTop(({account:'Account',appearance:'Appearance',notifications:'Notifications',help:'Help',support:'Help',signout:'Settings'})[s.detail]||'Settings',{back:true,done:false}):`<div class="sheet-handle" aria-hidden="true"></div><header class="app-header c-sheet-top">${btn(I('close'),'close','aria-label="Close"','c-disc')}<h2>Settings</h2></header>`;
  if(s.screen==='pipbrain'&&s.detail==='oi') return `<header class="app-header c-top">${btn(I('back'),'back','aria-label="Back"','c-disc')}<h2>${oiMark()}<span>Open Interest Leaders</span></h2><div class="c-top-end"></div></header>`;
  const [,name,,mark]=meta(s.screen)||[];
  return top(mark,({patterns:'Friendly Patterns'})[s.screen]||name,{gold:['aplus','macd'].includes(s.screen)});
}

// ---------- Home, in the order the owner published it ----------
const LIVE_WEEK={
  1:[[555,'Daily Scalp Setups','SWJ',15],[570,'Live Trade w/ Money Mike','Money Mike',60],[900,'Power Live Stream w/ Daniel','Daniel',60]],
  2:[[540,'Morning Huddle w/ Ms. Mary','Ms. Mary',60],[555,'Daily Scalp Setups','SWJ',15],[570,'Live Trade w/ Money Mike','Money Mike',60],[810,'Afternoon Breakouts w/ Guppy','Guppy',85],[900,'Power HR Trading w/ Ms.Mary','Ms. Mary',60]],
  3:[[555,'Daily Scalp Setups','SWJ',15],[570,'Live Trade w/ Josh','Josh',60],[900,'Power Live Stream w/ Daniel','Daniel',60]],
  5:[[555,'Daily Scalp Setups','SWJ',15],[570,'Live Trade w/ Josh','Josh',60],[870,'Weekend Swings w/ Parker','Parker',90],[900,'Power Live Stream w/ Daniel','Daniel',60]],
};
LIVE_WEEK[4]=LIVE_WEEK[2];
const liveDays=()=>[0,1,2,3].map(o=>({offset:o,rows:LIVE_WEEK[2+o]}));
const liveNext=()=>{for(const {offset,rows} of liveDays())for(const row of rows)if(until(offset,row[0]))return {offset,row,later:rows.filter(r=>r[0]>row[0]).length};};
function topMover() { const t='NVDA',open=DEMO_TRADES[t].open; return [t,(storyPlan(t).peak/open-1)*100]; }
function home(s) {
  const next=liveNext(),[mover,move]=topMover();
  const tile=(id,line)=>on(id)?`<button class="c-tile" data-screen="${id}">${I(meta(id)[3])}<strong>${meta(id)[1]}</strong>${line?`<small>${line}</small>`:''}</button>`:'';
  const bar=(id,line='',extra='')=>on(id)?`<button class="c-bar" data-screen="${id}">${I(meta(id)[3])}<strong>${meta(id)[1]}</strong>${line?`<small>${line}</small>`:''}${extra}</button>`:'';
  const row=(...tiles)=>{const shown=tiles.filter(Boolean);return shown.length?`<div class="c-tiles" style="--tiles:${shown.length}">${shown.join('')}</div>`:'';};
  return `<div class="n-home-scene"><button class="n-home-thought" data-action="open-pip">CPI is out</button><button class="c-home-pip" data-action="open-pip" aria-label="Pip, your Friendly Assistant"></button></div>
  <section class="c-now"><button class="c-now-today" data-screen="stream">${I('clock')}<span><small>Today<em>Buyers leaning in.</em></small><strong>Market’s open.</strong></span></button>
  <button class="c-now-live" data-screen="live">${I('live')}<span><strong>${next.row[1]}</strong><small>Today ${clock(next.row[0])} ET${next.later?` · ${next.later} more today`:''}</small></span><b><i>in</i>${until(next.offset,next.row[0])}</b></button></section>
  ${row(tile('earnings','1 today'),tile('stops','Your exit'),tile('economy','CPI'))}
  ${bar('aplus','<b>META</b> <em>BREAKOUT</em>')}
  ${row(tile('macd'),tile('patterns','<b>META</b> <em>Confirmed</em>'),tile('bigmoney','Northgate · AAPL'))}
  ${bar('pipbrain','Overnight call &amp; put ΔOI')}
  ${bar('screener',`<b>${mover}</b> <em>${pct(move)}</em>`)}
  ${bar('course',`Level ${Math.min(28,(s.courseDone||0)+1)} of 28`)}
  ${bar('coaching',`${COACHES.length} coaches`)}
  ${bar('chat','48 today',s.chatRead?'':'<i class="c-count">6</i>')}`;
}

// ---------- Today ----------
function stream() {
  const item=(time,words,toolId)=>{const [t,half]=time.split(' ');return `<button class="c-stream-row" data-screen="${toolId}"><time>${t}<small>${half} ET</small></time><span><strong>${words}</strong>${on(toolId)?`<em>${I(meta(toolId)[3])}${meta(toolId)[1].toUpperCase()}</em>`:''}</span></button>`;};
  return `<p class="c-status">MARKET OPEN · CLOSES 4:00 PM ET</p>
  <section class="c-hello"><div class="c-hello-pip">${pipMark()}<p><strong>Morning.</strong>Market’s open, and buyers are leaning in.</p></div>
  ${on('aplus')?`<div class="c-lead"><h3>META · A+ BUY entry signal</h3><p>META closed above the Breakout line at ${price(storyPlan('META').entry)} on the 5M chart.</p><div><em>${I('bolt')}A+ SCALPS</em><span>42m ago</span>${nav('aplus','Open','c-open')}</div></div>`:''}
  <div class="n-chip-row">${tag('SPY +0.5%','up')}${tag('Buyers leaning in')}${tag('VIX 16.2 · Calm')}</div></section>
  ${label('COMING UP')}<div class="c-stream c-ahead"><div class="c-stream-row"><time>3:00<small>PM ET</small></time><span><strong>Power hour starts at 3:00 PM ET.</strong>${on('aplus')?`<em>${I('bolt')}A+ SCALPS</em>`:''}</span></div><div class="c-stream-row"><time>4:00<small>PM ET</small></time><span><strong>Market closes at 4:00 PM ET.</strong></span></div></div>
  <div class="c-nowline"><b>Now · ${clock(NOW)} ET</b></div>
  ${label('EARLIER TODAY')}<div class="c-stream">${item('10:06 AM','NVDA Symmetrical Triangle reached its measured move.','patterns')}${on('screener')?item('9:35 AM','NVDA spotted on Live Runners.','screener'):''}${item('8:30 AM','CPI came in at 2.8%. Expected 2.9%.','economy')}</div>`;
}

// ---------- Charts ----------
export function nativeChart(s,expanded=false) {
  return `<div class="chart-card n-chart ${s.screen==='stops'?'stop-chart':''}"><div class="chart-wrap"><svg class="candlestick-chart" role="img" aria-label="Sample candlestick chart. Drag to move; use plus and minus to zoom." tabindex="0"></svg><div class="chart-data" hidden></div></div><div class="chart-toolbar c-chart-tools">${btn('−','zoom-out','aria-label="Zoom chart out"','')}${btn('+','zoom-in','aria-label="Zoom chart in"','')}${expanded?'':btn(I('expand'),'expand-chart','aria-label="Expand chart"','')}<span class="chart-readout" hidden></span></div></div>`;
}

// ---------- Stop Finder ----------
const WHY={stop:'STOP · This is where the sample idea is wrong.',target:'TARGET 1 · Two and a half times the distance to the stop.',target2:'TARGET 2 · Four times the distance to the stop.'};
function stops(s) {
  const p=plan(s.symbol,s.direction,s.mode),saved=s.plans.some(x=>x.symbol===s.symbol&&x.direction===s.direction&&x.mode===s.mode);
  if(s.detail==='details') return `<div class="c-sheet-head"><strong>${s.symbol}</strong><span>${NAMES[s.symbol]}</span><b>${price(BASE[s.symbol])}</b></div>
  ${label('Risk / Reward')}<dl class="c-facts"><div><dt>${s.direction==='short'?'Cover':'Stop'}</dt><dd class="down">${price(p.stop)}</dd></div><div><dt>Risk / share</dt><dd>${price(p.risk)}</dd></div><div><dt>Risk %</dt><dd>${(p.risk/p.entry*100).toFixed(1)}%</dd></div><div><dt>Target 1</dt><dd class="up">${price(p.target)}</dd></div><div><dt>Reward %</dt><dd>${(Math.abs(p.target-p.entry)/p.entry*100).toFixed(1)}%</dd></div><div><dt>Reward : Risk</dt><dd>${p.rr.toFixed(1)} : 1</dd></div></dl>
  ${label('Price Ladder')}<dl class="c-facts c-ladder">${[['Target 2',p.target2,'up'],['Target 1',p.target,'up'],['CURRENT PRICE',p.entry,''],['YOUR STOP LOSS',p.stop,'down']].sort((a,b)=>b[1]-a[1]).map(([t,v,c])=>`<div><dt>${t}</dt><dd class="${c}">${price(v)}</dd></div>`).join('')}</dl>`;
  if(s.detail==='plans') return `${label('Saved plans')}${s.plans.length?s.plans.map((x,i)=>`<div class="list-row">${btn(`${x.symbol} · ${x.direction==='long'?'Long':'Short'} · ${x.mode==='swing'?'Swing':'Scalp'}`,'load-plan',`data-index="${i}"`,'app-link grow')}${btn('Remove','remove-plan',`data-index="${i}"`,'app-link')}</div>`).join(''):'<p class="n-demo-note">No saved plans.</p>'}<p class="n-demo-note">Kept in this preview until you reload.</p>`;
  return `<form class="c-search" data-form="ticker">${I('stop')}<input name="symbol" aria-label="Search any stock" placeholder="Search any stock…" value="${s.symbol}" maxlength="8" autocomplete="off"><button type="submit" aria-label="Search">${I('search')}</button></form>
  <div class="n-stop-mode">${segment(['Swing','Scalp'],'stopMode',s.mode==='swing'?'Swing':'Scalp')}</div>
  <h3 class="n-stop-symbol">${s.symbol}</h3><p class="n-stop-company">${NAMES[s.symbol]}</p>
  ${segment(['Long','Short'],'stopDirection',s.direction==='long'?'Long':'Short','stop-direction')}
  ${nativeChart(s)}${s.levelInfo?`<div class="n-chart-why">${WHY[s.levelInfo]}${btn('×','explain-level',`data-value="${s.levelInfo}" aria-label="Close"`,'')}</div>`:''}
  <div class="n-setup-quality">${tag('Good reward/risk','up')}<span>${p.rr.toFixed(1)}x reward to risk</span></div>
  <div class="c-pills">${btn('ⓘ Details','native-detail','data-value="details"','c-pill')}${saved?btn('My plans','native-detail','data-value="plans"','c-pill'):btn('Save plan','save-plan','','c-pill')}</div>`;
}

// ---------- Earnings and Economy ----------
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday'];
const weekOf=()=>{const m=sampleDay(-1);return `Week of ${m.monthLong} ${m.day}, ${m.year}`;};
const pending=e=>['Pending','Upcoming'].includes(e.actual);
const sessionMark=e=>`<span class="c-session" aria-label="${e.session}">${e.session==='Before open'?'☀':'☾'}</span>`;
function earnings(s) {
  const events=fixtures.events;
  if(s.detail==='event') {
    const e=events.find(x=>x.id===s.event)||events[1],d=sampleDay(e.day-1),when=`${DAYS[e.day]}, ${d.monthLong} ${d.day}`;
    const tools=[['stops','Stop Finder'],['patterns','Patterns'],['macd','MACD']].filter(([id])=>on(id));
    return `<div class="c-sheet-head">${logo(e.symbol)}<strong>$${e.symbol}</strong><span>${e.title}</span></div><p class="c-when">${pending(e)?`Reports ${when}, ${e.session.toLowerCase()}`:`Reported ${when}, after the close`}</p>
    <div class="c-tiles c-tool-tiles" style="--tiles:${tools.length}">${tools.map(([id,t])=>btn(`${I(meta(id)[3])}<strong>${t}</strong>`,'event-tool',`data-value="${id}" data-symbol="${e.symbol}"`,'c-tile')).join('')}</div>
    ${pending(e)?`<dl class="c-facts"><div><dt>EPS EXPECTED</dt><dd>${e.expected}</dd></div></dl>`:`${label('EPS vs estimate')}<p class="n-body-copy">Beat: ${e.actual} vs ${e.expected} expected</p>`}<p class="n-demo-note">Sample report.</p>`;
  }
  const row=e=>`<button class="n-event-row" data-action="event" data-value="${e.id}">${logo(e.symbol)}<span><strong>$${e.symbol}</strong><small>${e.title}${pending(e)?'':` · Out at ${e.out} · ${e.actual} vs ${e.expected} expected`}</small></span>${pending(e)?sessionMark(e):tag('BEAT','up')}</button>`;
  const major=events.find(e=>e.major);
  const card=i=>{const d=sampleDay(i-1),es=events.filter(e=>e.day===i);return es.length?`<section class="n-day-card ${i===1?'today':''}"><div class="n-day-heading"><strong>${DAYS[i]}${i===1?tag('TODAY','gold'):''}</strong><span>${d.month} ${d.day}</span></div>${i===1?`<p class="c-day-line">${es.length} reporting after today’s close</p>`:''}${es.map(row).join('')}</section>`:'';};
  return `${segment(['This week','Reported'],'calendarTab',s.calendarTab)}
  ${s.calendarTab==='Reported'?`<p class="c-week">${weekOf()}</p>${card(0)}`:`<button class="c-major" data-action="event" data-value="${major.id}"><span class="n-eyebrow">MAJOR REPORT</span><h3>$${major.symbol}</h3><p>${major.title}</p><p>After the close</p><b>EXPECTED ${major.expected}</b></button>
  <p class="c-week">${weekOf()}</p><p class="c-legend">☀ Before open · ☾ After close · ◷ Time TBD</p>${[1,2,3,4].map(card).join('')}
  <div class="c-week-end">${pipMark()}<p>That’s the week. Next week’s reports land on Sunday.</p></div>`}<p class="n-demo-note">Sample calendar.</p>`;
}
function economy(s) {
  const events=fixtures.economy;
  if(s.detail==='event') {
    const e=events.find(x=>x.id===s.event)||events[0],d=sampleDay(e.day-1),day=`${d.short}, ${d.month} ${d.day}`;
    return `<div class="c-sheet-head">${I('globe')}<strong>${e.title}</strong></div><p class="c-when">${pending(e)?`${day} · ${e.time} ${tag(until(e.day-1,e.minute))}`:`${day} · Released ${e.time}`}</p>
    ${label(pending(e)?'WHAT MOVES THE MARKET':'Where it landed')}<dl class="c-facts">${pending(e)?'':`<div><dt>Actual</dt><dd class="up">${e.actual}</dd></div>`}<div><dt>Expected</dt><dd>${e.expected}</dd></div><div><dt>Last</dt><dd>${e.last}</dd></div></dl>
    ${pending(e)?'':`${label('How the market took it')}<dl class="c-facts"><div><dt>SPY</dt><dd class="up">${e.spy}</dd></div></dl>`}<p class="n-demo-note">Sample release.</p>`;
  }
  const next=events.find(pending),nd=sampleDay(next.day-1);
  const row=e=>`<button class="n-event-row c-econ-row" data-action="event" data-value="${e.id}"><span class="c-econ-mark">${I('globe')}</span><span><strong>${e.title}</strong><small>${pending(e)?e.time:`Out · ${e.time}`}</small>${pending(e)?'':`<span class="c-econ-pills">${tag('EXPECTED '+e.expected)}${tag('ACTUAL '+e.actual,'up')}${tag('SPY '+e.spy,'up')}</span>`}</span>${I('next')}</button>`;
  const shown=s.calendarTab==='Reported'?[1]:[1,2,3,4];
  return `${segment(['This week','Reported'],'calendarTab',s.calendarTab)}<p class="c-week">${weekOf()}</p>
  ${s.calendarTab==='Reported'?'':`<section class="c-read"><h3>This week’s read</h3><div><span>Next catalyst</span><strong>${nd.short}, ${nd.month} ${nd.day} · ${next.time}</strong></div></section>`}
  ${shown.map(i=>{const d=sampleDay(i-1),es=events.filter(e=>e.day===i&&(s.calendarTab!=='Reported'||!pending(e)));return `<section class="n-day-card ${i===1?'today':''}"><div class="n-day-heading"><strong>${DAYS[i].toUpperCase()} · ${d.month.toUpperCase()} ${d.day}${i===1?tag('TODAY','gold'):''}</strong></div>${es.map(row).join('')||'<p class="c-day-line">Quiet day</p>'}</section>`;}).join('')}<p class="n-demo-note">Sample calendar.</p>`;
}

// ---------- A+ Scalps: the morning's lines, with nothing claimed about how they went ----------
const aplusWord=p=>p.state==='hit'?'T1 touched':p.state==='invalidated'?'Ended before T1':'Tracking';
const road=p=>`<div class="c-road"><span>${price(p.entry)}</span><i></i><span>T1</span><i></i><span>T2</span><i></i><span>T3</span></div>`;
function aplus(s) {
  if(s.detail==='setup') {
    const p=storyPlan(s.symbol),own=(p.side==='short'?'Breakdown':'Breakout')===s.scenario||s.scenario==='Breakout';
    const head=!own?'WAITING FOR CONFIRMATION':p.state==='hit'?`T1 REACHED · ${p.hitAt}`:p.state==='invalidated'?'TRACKING ENDED':`CONFIRMED · ${p.at}`;
    return `<div class="c-sheet-head">${logo(s.symbol)}<strong>${s.symbol}</strong><b>${price(p.current)}</b></div><div class="n-chip-row">${tag('MORNING')}${tag(p.side==='short'?'BEARISH':'BULLISH',p.side==='short'?'down':'up')}</div>
    ${segment(['1M','2M','5M'],'aplusFrame',s.aplusFrame||'5M','timeframes')}${segment(['Breakout','Rejection','Bounce'],'scenario',s.scenario)}
    <div class="n-scenario-card"><strong>${head}</strong><p>${!own?'Waiting for a close through a line':`Confirmed at ${price(p.entry)}; first target ${price(p.target)}.`}</p></div>
    ${label(`${parseInt(s.aplusFrame||'5M')} MINUTE CANDLES · MORNING`)}${nativeChart(s)}
    <details class="n-disclosure"><summary>Progress track</summary><p>Close through the line: confirmed. Star: first target. Close back through: ended.</p></details>
    ${label('THE FOUR MORNING LINES')}<dl class="c-facts">${[['Breakout',p.entry],['Breakdown',p.stop],['Rejection',p.target],['Bounce',p.stop-p.risk]].map(([t,v])=>`<div><dt>${t}</dt><dd>${price(v)}</dd></div>`).join('')}</dl><p class="n-demo-note">Sample levels.</p>`;
  }
  const lead=storyPlan('META'),openBoard=s.expandedBoards.includes('aplus');
  return `<p class="c-status">Morning Setups Posted 9:15 AM ET</p><div class="n-window"><i class="n-dot"></i>Trading window · 9 to 11:30 AM ET</div>
  ${segment(['1M','2M','5M'],'aplusFrame',s.aplusFrame||'5M','timeframes')}
  <button class="c-active" data-action="aplus-detail" data-symbol="META"><div class="n-card-label"><span>ACTIVE</span>${tag('CONFIRMED','gold')}</div><div class="n-symbol-side"><strong>META</strong>${tag(s.aplusFrame||'5M')}<b class="up">▲</b></div>${road(lead)}<p>Confirmed at ${price(lead.entry)}; first target ${price(lead.target)}.</p><small>Leading · 1 of 3 active</small></button>
  <section class="n-board"><button class="n-board-heading" data-action="toggle-board" data-value="aplus" aria-expanded="${openBoard}"><span><strong>THE MORNING LEVELS</strong></span><b>7 tickers</b>${I('next')}</button>
  ${openBoard?`<p class="c-order">Order: biggest move first<br>Strongest setup per ticker</p>${SYMBOLS.slice(0,7).map(t=>{const p=storyPlan(t);return `<button class="c-level-row" data-action="aplus-detail" data-symbol="${t}"><strong>${t}</strong>${tag(s.aplusFrame||'5M')}<span>${p.side==='short'?'Breakdown':'Breakout'}</span><em>${aplusWord(p)}</em><b class="${p.side==='short'?'down':'up'}">${p.side==='short'?'▼':'▲'}</b></button>`;}).join('')}`:''}</section><p class="n-demo-note">Sample levels.</p>`;
}

// ---------- MACD: the new page. Its recap and board are per-share results, which the preview does not make up. ----------
const CALLS={NVDA:['Buy','9:35'],AAPL:['Buy','9:40'],MSFT:['Sell','9:45'],TSLA:['Buy','9:50'],META:['Buy','10:00'],AMZN:['–',''],GOOGL:['Done','9:55']};
function macdLines(sell) {
  const pts=Array.from({length:24},(_,i)=>{const x=i/23,m=(sell?-1:1)*(Math.sin(x*3.1-1.2)*.55+x*.35),sig=(sell?-1:1)*(Math.sin(x*3.1-1.7)*.45+x*.25);return [8+x*284,36-m*24,36-sig*24];});
  const cross=pts[5];
  return `<svg class="c-macd-chart" viewBox="0 0 300 78" role="img" aria-label="Sample MACD and signal lines since the open"><line x1="8" x2="292" y1="36" y2="36" stroke="var(--app-border)"/><polyline fill="none" stroke="var(--app-dim)" stroke-width="1.6" points="${pts.map(p=>`${p[0].toFixed(1)},${p[2].toFixed(1)}`).join(' ')}"/><polyline fill="none" stroke="var(--app-green)" stroke-width="2" points="${pts.map(p=>`${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}"/><line x1="${cross[0]}" x2="${cross[0]}" y1="8" y2="62" stroke="var(--app-gold)" stroke-dasharray="3 3"/><text x="${cross[0]+4}" y="14" fill="var(--app-gold)" font-size="10" font-weight="700">ENTRY</text><text x="8" y="75" fill="var(--app-dim)" font-size="10">9:30</text><text x="292" y="75" text-anchor="end" fill="var(--app-dim)" font-size="10">now</text></svg>`;
}
function macd(s) {
  const mine=s.macdAdded||[];
  if(s.detail==='add-ticker') return `<form class="c-search" data-form="add-ticker">${I('search')}<input name="symbol" aria-label="Search any stock" placeholder="Search any stock…" maxlength="8" autocomplete="off"><button type="submit" aria-label="Add">${I('plus')}</button></form><p class="n-demo-note">Up to 5, kept on this phone</p>${label('YOUR TICKERS')}${mine.length?mine.map(t=>`<div class="list-row"><strong class="grow">${t}</strong>${btn('Remove','remove-ticker',`data-value="${t}"`,'app-link')}</div>`).join(''):'<p class="n-demo-note">None yet.</p>'}`;
  const tickers=[...Object.keys(CALLS),...mine],t=tickers.includes(s.symbol)?s.symbol:'NVDA',[word,at]=CALLS[t]||['–',''],p=storyPlan(t),sell=word==='Sell';
  const called=word==='Buy'||sell,frame=s.macdFrame==='5 min'?'5':'1';
  return `<div class="c-macd-head"><div><h3>Open Side</h3><p>${frame}-min from the 9:30 AM ET open</p></div>${btn('+ Add ticker','native-detail','data-value="add-ticker"','c-gold-button')}</div>
  ${segment(['1 min','5 min'],'macdFrame',s.macdFrame)}
  <div class="c-banner"><strong>Mixed day</strong><span>4 above zero, 3 below</span></div>
  <section class="c-call"><div class="n-card-label"><span></span>${tag(word==='Buy'?'LONG · LIVE':sell?'SHORT · LIVE':word==='Done'?'CLOSED':'WATCHING',called?(sell?'down':'up'):'')}</div>
  <div class="c-call-chips" role="group" aria-label="Ticker">${tickers.map(x=>btn(`<strong>${x}</strong><small>${(CALLS[x]||['–'])[0]}</small>`,'ticker',`data-value="${x}" aria-pressed="${x===t}"`,x===t?'selected':'')).join('')}</div>
  <h3 class="c-call-word ${sell?'down':called?'up':''}">${word==='Done'?'Done for today':word==='–'?'No signal':word}${sell?tag('SHORT','down'):''}</h3>
  ${called?`<p class="c-call-line">${sell?'Enter on a rally':'Enter on a dip'}</p><p class="c-call-sub">${t} · ${sell?'short':'long'} · called ${at} AM ET</p>`:''}<p class="c-call-sub">Updated ${clock(NOW)} ET</p>
  ${called?`<dl class="c-facts c-call-stats"><div><dt>${sell?'SHORTED AT':'CALLED AT'}</dt><dd>${price(p.entry)}</dd></div><div><dt>LAST</dt><dd>${price(p.current)}</dd></div></dl>
  <div class="c-why"><strong>WHY · ${sell?'BELOW 0, WIDENING':'ABOVE 0, WIDENING'}</strong><span>${frame}-minute chart</span></div>${macdLines(sell)}`:''}</section><p class="n-demo-note">Sample signals.</p>`;
}

// ---------- Patterns ----------
const stageTone=f=>f.status==='Retest'?'retest':f.status==='Measured move'?'up':f.status==='Failed'?'':f.bias==='Bearish'?'down':'up';
const stageWords=f=>{const way=f.bias==='Bearish'?'Down':'Up';return ({Formed:`${way} formed`,Confirmed:`${way} confirmed`,Retest:`${way} retest held`,'Measured move':`${way} measured move reached`,Failed:`${way} break failed`})[f.status];};
const stageHead=f=>({Formed:'Formed · awaiting confirmation',Confirmed:`✓ ${f.bias==='Bearish'?'Downward':'Upward'} break confirmed`,Retest:'Retest held','Measured move':'Measured move reached',Failed:'Setup failed'})[f.status];
const frameOf=f=>f.frame||'Daily';
const since=()=>{const d=sampleDay(-1);return `since ${d.month} ${d.day}`;};
const along=p=>Math.max(0,Math.min(100,Math.round(p.progress/Math.abs(p.target-p.entry)*100)));
// The road on a setup: what happened, where it stands, what has not happened. A failure ends the road.
function patternRoad(f){
  const steps=f.status==='Failed'?['Formed','Confirmed','Failed']:f.candle?['Formed','Confirmed','Measured move']:['Formed','Confirmed','Retest','Measured move'],at=steps.indexOf(f.status);
  return `<ol class="n-stage-road ${f.bias==='Bearish'?'down':''}">${steps.map((step,i)=>{const state=i===at?'now':i>at?'next':step==='Retest'?'passed':'done',d=sampleDay(-1);return `<li class="${state} ${step==='Retest'?'retest':step==='Measured move'?'move':step==='Failed'?'failed':''}"><i></i><b>${step}</b><small>${({now:'Now',next:'Waiting',passed:'Skipped',done:`${d.month} ${d.day}`})[state]}</small></li>`;}).join('')}</ol>`;
}
const ladderName=(name,f)=>{const side=f.bias==='Bearish'?'BELOW':'ABOVE';return ({Move:[f.status==='Measured move'?'REACHED':'MEASURED MOVE','up'],Confirm:[`CONFIRM ${side}`,''],Entry:[`CONFIRMED ${side}`,''],Retest:['RETEST','retest'],Fail:['INVALIDATION','down']})[name];};
function patterns(s) {
  if(s.detail==='pattern') {
    const f=fixtures.patterns.find(x=>x.symbol===s.symbol)||fixtures.patterns[0],p=storyPlan(s.symbol),d=sampleDay(-1);
    const rungs=[['NOW',p.current,''],...patternLevels(f.status,p).filter(([,name])=>name!=='Line').map(([v,name])=>{const [t,c]=ladderName(name,f);return [t,v,c];})],finished=f.status==='Measured move'||f.status==='Failed';
    return `<div class="c-sheet-head"><strong>${s.symbol}</strong><span>${NAMES[s.symbol]}</span>${tag(frameOf(f))}</div><h3 class="c-stage-head ${stageTone(f)}">${stageHead(f)}</h3><p class="c-when">${f.name} · ${d.month} ${d.day}, ${d.year}</p>
    ${patternRoad(f)}${nativeChart(s)}
    <div class="c-tiles c-tool-tiles" style="--tiles:3">${btn(`${I('stop')}<strong>Plan Your Stop</strong>`,'to-stops',finished?'disabled':'','c-tile')}${btn(`${I('list')}<strong>Prices &amp; Rules</strong>`,'toggle-rules',`aria-expanded="${!!s.rules}"`,'c-tile')}${btn(`${I('calendar')}<strong>Earnings Calendar</strong>`,'event-tool','data-value="earnings"','c-tile')}</div>
    ${s.rules?`<dl class="c-facts c-ladder">${rungs.sort((a,b)=>b[1]-a[1]).map(([t,v,c])=>`<div><dt>${t}</dt><dd class="${c}">${price(v)}</dd></div>`).join('')}</dl>`:''}<p class="n-demo-note">Sample setup.</p>`;
  }
  const board=s.patternBoard==='Everything'?'Everything':'Recent',frame=['Daily','Weekly','Monthly'].includes(s.patternFrame)?s.patternFrame:'Daily';
  const rows=fixtures.patterns.filter(f=>s.lookup?s.lookup===f.symbol:frameOf(f)===frame&&(board==='Everything'||f.recent));
  const line=f=>`${f.status==='Confirmed'?'✓ ':''}${stageWords(f)} · R:R 2.5 · ${f.name}`;
  const lead=rows.find(f=>f.status==='Confirmed')||rows[0],scan=sampleDay(-1);
  const card=f=>{const p=storyPlan(f.symbol);return `<button class="c-setup" data-action="pattern-detail" data-symbol="${f.symbol}"><div><strong>${f.symbol}</strong>${tag(frameOf(f))}${I('next')}</div><span>${NAMES[f.symbol]}</span><p class="${stageTone(f)||'failed'}">${line(f)}</p><small>${f.status==='Failed'?'Ended':along(p)+'%'} · ${since()}</small></button>`;};
  return `<p class="c-status">1,000 stocks · scanned ${scan.month} ${scan.day}, 9:46 PM ET</p>${segment(['Recent','Everything'],'patternBoard',board)}
  <form class="c-search" data-form="ticker">${I('search')}<input name="symbol" aria-label="Look up a stock or coin" placeholder="Look up a stock or coin" maxlength="8" autocomplete="off" value="${esc(s.lookup||'')}"><button type="submit">Check</button></form>
  ${s.lookup?btn('Clear search','clear-search','','app-link'):segment(['Daily','Weekly','Monthly'],'patternFrame',frame,'c-frames')}
  ${lead&&!s.lookup?(()=>{const p=storyPlan(lead.symbol);return `${label('TOP SETUP','Ranked by stage, track record and freshness')}<button class="c-setup c-setup-lead" data-action="pattern-detail" data-symbol="${lead.symbol}"><div><strong>${lead.symbol}</strong>${tag(frameOf(lead))}${I('next')}</div><p class="${stageTone(lead)||'failed'}">${line(lead)}</p><div class="c-progress"><span style="width:${along(p)}%"></span></div><small>${along(p)}% of the way to the measured move · ${since()}</small><dl class="c-facts"><div><dt>Measured move</dt><dd class="up">${price(p.target)}</dd></div><div><dt>Confirmed ${lead.bias==='Bearish'?'below':'above'}</dt><dd>${price(p.entry)}</dd></div><div><dt>Invalidation</dt><dd class="down">${price(p.stop)}</dd></div></dl></button>`;})():''}
  ${label(`SETUPS · ${rows.length}`,'Ranked')}${rows.map(card).join('')||'<p class="n-demo-note">No setups here in the sample.</p>'}<p class="n-demo-note">Sample setups.</p>`;
}

// ---------- Screener ----------
const BOARDS=[['Overnight Gappers','sun',['AAPL','TSLA']],['Live Runners','bolt',['NVDA','AMZN']],['Breakout In-Play','trend',['META','SPY']]];
const PLAY_BOARD=Object.fromEntries(BOARDS.flatMap(([name,,tickers])=>tickers.map(t=>[t,name])));
const run=t=>{const d=DEMO_TRADES[t],hi=Math.max(d.peak,d.open,d.current);return (hi/d.open-1)*100;};
function screener(s) {
  if(s.detail==='play') {
    const d=DEMO_TRADES[s.symbol];
    return `<div class="c-sheet-head"><strong>${s.symbol}</strong><span>${NAMES[s.symbol]}</span><b class="up">${pct(run(s.symbol))}<small>open → high</small></b></div>${nativeChart(s)}
    <details class="n-disclosure" open><summary>Play details</summary><dl class="c-facts"><div><dt>Price at the open</dt><dd>${price(d.open)}</dd></div><div><dt>Last price</dt><dd>${price(d.current)}</dd></div><div><dt>First spotted</dt><dd>${d.at} ET</dd></div><div><dt>Volume vs normal</dt><dd>${({NVDA:5.8,AAPL:3.7,MSFT:4.1,TSLA:6.2,META:2.8,AMZN:2.1,SPY:2.3})[s.symbol]||2}× usual</dd></div></dl></details><p class="n-demo-note">Sample play.</p>`;
  }
  const [t,move]=topMover(),d=DEMO_TRADES[t],p=storyPlan(t);
  const row=x=>{const dx=DEMO_TRADES[x],hi=Math.max(dx.peak,dx.open,dx.current);return `<button class="n-mover-row" data-action="play" data-symbol="${x}"><span><strong>${x}</strong><small>${price(dx.open)} → peak ${price(hi)}</small><small>${dx.at} ET</small></span><span><em class="up">${pct(run(x))}</em><small>open to high</small></span></button>`;};
  return `<div class="n-window"><i class="n-dot"></i>Live · updated ${clock(NOW)}</div>
  <button class="n-mover-hero" data-action="play" data-symbol="${t}"><span class="n-eyebrow">TODAY’S TOP MOVER</span><div><strong>${t}</strong><span><b>${pct(move)}</b><small>open → high</small></span></div><p>${price(d.open)} at the open → peak ${price(p.peak)}</p><small>${I('bolt')} Found by Live Runners at ${p.at}</small></button>
  ${BOARDS.map(([name,mark,tickers])=>{const open=s.expandedBoards.includes(name);return `<section class="n-board"><button class="n-board-heading" data-action="toggle-board" data-value="${name}" aria-expanded="${open}">${I(mark)}<span><strong>${name}</strong><small>${tickers.length} plays today · tap to open</small></span><b class="up">${pct(Math.max(...tickers.map(run)))}<small>best open → high</small></b></button>${open?`<div class="n-board-rows">${tickers.map(row).join('')}</div>`:''}</section>`;}).join('')}
  ${label('LIVE FEED')}<p class="c-mood">Market mood: Buyers leaning in</p><div class="n-feed">${[['10:30 AM','META','Breakout In-Play'],['10:15 AM','AMZN','Live Runners'],['9:50 AM','TSLA','Overnight Gappers'],['9:35 AM','NVDA','Live Runners']].map(([time,x,b])=>`<button data-action="play" data-symbol="${x}"><time>${time}</time><span>${x} spotted on ${b}</span></button>`).join('')}</div><p class="n-demo-note">Sample plays.</p>`;
}

// ---------- Big Money: made-up funds only. No politician, insider or real filer is shown. ----------
const FUNDS=[['Northgate Partners','Northgate','N','Bought more','Apple','AAPL','83% more shares','24 days','Just now'],['Harbor Lane Capital','Harbor Lane','H','Now owns','NVIDIA','NVDA','1.2M shares','45+ days','1h ago'],['Blue Mesa Fund','Blue Mesa','B','Sold some','Tesla','TSLA','12% fewer shares','Same day','3h ago']];
const verbTone=v=>/Sold|No longer/.test(v)?'down':'up';
function bigmoney(s) {
  const face=x=>`<span class="avatar" aria-hidden="true">${x}</span>`;
  const filed=sampleDay(-1);
  return `<section class="c-justin">${label('JUST IN')}${FUNDS.slice(0,2).map(([,short,f,verb,co,,,,ago])=>`<div class="c-justin-row">${face(f)}<p>${short} <b class="${verbTone(verb)}">${verb.toLowerCase()}</b> ${co}</p><time>${ago}</time></div>`).join('')}</section>
  ${segment(['People','Latest'],'moneyTab',s.moneyTab)}
  ${s.moneyTab==='People'?FUNDS.map(([name,,f,verb,co])=>`<article class="c-fund">${face(f)}<div><strong>${name}</strong><p><b class="${verbTone(verb)}">${verb}</b> ${co}</p><small>Filed ${filed.month} ${filed.day}, 24 days later</small></div></article>`).join(''):`<p class="c-legend">traded, then filed</p>${FUNDS.map(([name,,f,verb,co,,size,gap,ago])=>`<article class="c-move">${face(f)}<div><small>${name}<time>${ago}</time></small><strong><b class="${verbTone(verb)}">${verb}</b> ${co}</strong><span>${size}</span><em>${gap}</em></div></article>`).join('')}`}
  <p class="n-demo-note">Sample funds. Not real filings.</p>`;
}

// ---------- Pip Brain ----------
const trendMark=()=>`<svg class="c-brain-mark" viewBox="0 0 48 48" fill="none" stroke="var(--app-green)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 36 18 24l8 6 16-18"/><path d="M33 12h9v9"/></svg>`;
const oiMark=()=>`<svg class="c-brain-mark" viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="22" width="8" height="18" rx="2" fill="var(--app-green)"/><rect x="20" y="10" width="8" height="30" rx="2" fill="var(--app-green)"/><rect x="32" y="26" width="8" height="14" rx="2" fill="var(--app-red)"/></svg>`;
const OI={Calls:[['SPY','565 call','48,210'],['NVDA','190 call','31,450'],['TSLA','350 call','22,180'],['AAPL','240 call','15,020'],['AMZN','225 call','9,870']],Puts:[['SPY','550 put','39,640'],['TSLA','320 put','18,300'],['NVDA','175 put','12,760'],['META','600 put','8,410'],['MSFT','410 put','6,950']]};
function pipbrain(s) {
  if(s.detail==='oi') {
    const settled=sampleDay(-1),expiry=sampleDay(10);
    return `<h3 class="c-big">Where positions grew.</h3><div class="c-split"><span>Settled <b>${settled.month} ${settled.day}</b></span><span>Prior session</span></div><p class="c-rule">Ranked by increase in open interest.</p>
    ${segment(['Calls','Puts'],'oiSide',s.oiSide)}<div class="c-split c-cols"><span>Contract</span><span>OI increase</span></div>
    ${OI[s.oiSide==='Puts'?'Puts':'Calls'].map(([t,c,n],i)=>`<div class="c-oi-row"><i>${i+1}</i><span><strong>${t}</strong><small>${c} · ${expiry.month} ${expiry.day}</small></span><b>+${n}</b></div>`).join('')}
    <div class="c-foot"><strong>Two sides to every contract.</strong><p>Every open contract has a buyer and a seller.</p></div><p class="n-demo-note">Sample contracts.</p>`;
  }
  const door=(action,mark,name,line)=>btn(`${mark}<span><strong>${name}</strong><small>${line}</small></span>${I('next')}`,action,'','c-door');
  return `<h3 class="c-big">Choose a tool.</h3><p class="c-big-sub">Two ways to read the market.</p>${door('time-trend',trendMark(),'Time Trend','The bigger price trend, updated monthly.')}${door('open-oi',oiMark(),'Open Interest Leaders','Explore the biggest increases in open option positions.')}<p class="c-rule">Choose a tool to explore its readings.</p>`;
}

// ---------- Options Course: 28 levels in the app's four sections. A member's course; nothing here leaves the preview. ----------
// Owner, November 16 2026: a visitor sees the whole course and plays level 1 only. Levels 2 to 28 stay locked here.
export const COURSE=[['Follow along',['Calls','Puts','Strike and date','The price times 100','Sell it back','The most you can lose','Solo: read the alert']],['First trade',['Find the contract','Which strike','Bid and ask','Limit or market','Size to the loss','Solo: first trade']],['Manage it',['A stop on everything','Half at 20%','Stop at your entry','Time decay','Same-day options','Earnings','Solo: manage it']],['Strategies',['The payoff line','A call spread','Covered call','Cash-secured put','A hedge','Straddle','LEAPS','Solo: pick the tool']]];
const LEVELS=COURSE.flatMap(([,titles])=>titles);
const PLACES=['Bike Shop','Phone Repair','Corner Store','Bulk Store','Box Office','Arcade','Footbridge'];
function course(s) {
  const done=s.courseDone||0,current=done+1,level=s.courseLevel||current,close=btn(I('close'),'home','aria-label="Close"','c-disc');
  if(s.detail==='lesson') {
    const bar=`<header class="c-lesson-top">${btn(I('close'),'back','aria-label="Close"','c-disc')}<div class="c-progress"><span style="width:${[20,60,100][s.lessonStep||0]}%"></span></div><b>★★★</b></header>`;
    if(s.lessonStep===2) return `<div class="c-lesson c-win"><p class="c-stars">★★★</p><h3>Level 1 done</h3><div class="c-hello-pip">${pipMark()}<p>A call is a bet that the stock goes up.</p></div>${btn('Continue','lesson-finish','','app-button full')}</div>`;
    if(s.lessonStep===1) return `${bar}<div class="c-lesson"><div class="c-alert">${I('bell')}SPY $665 call · today</div><h3>The alert says call. Which way do you want SPY to go?</h3><div class="c-choices">${btn('Up','lesson-answer','data-value="up"','choice')}${btn('Down','lesson-answer','data-value="down"','choice')}</div>${s.lessonMiss?'<p class="n-demo-note" role="status">Try again.</p>':''}</div>`;
    return `${bar}<div class="c-lesson"><h3>A call is a bet that the stock goes up.</h3><svg class="c-lesson-art" viewBox="0 0 300 120" aria-hidden="true"><path d="M10 100 80 84l50 6 60-34 50-8 40-28" fill="none" stroke="var(--app-green)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="c-hello-pip">${pipMark()}<p>As the stock rises, the call’s price rises with it.</p></div>${btn('Next','lesson-next','','app-button full')}</div>`;
  }
  // A station's card rises over the map; a tap on the map behind it puts it away.
  const again=done?' again':'',locked=level>1,station=s.detail==='station'?`${btn('','back','aria-label="Close"','c-scrim')}<div class="c-station"><div class="sheet-handle" aria-hidden="true"></div><h3>${LEVELS[level-1]}</h3><p>Level ${level}${PLACES[level-1]?` · ${PLACES[level-1]}`:''}</p>${locked?`<p class="c-locked">${I('lock')}Levels 2 to 28 are in the app</p>${btn(`Play level 1${again}`,'play-level','data-value="1"','app-button secondary full')}`:btn(`Play level 1${again}`,'play-level','data-value="1"','app-button full')}</div>`:'';
  let number=0,start=0;
  const sections=COURSE.map(([name,titles],i)=>{const from=start;start+=titles.length;const got=Math.max(0,Math.min(titles.length,done-from));return {name,titles,i,got};});
  const here=sections.find(x=>x.got<x.titles.length)||sections[3];
  return `<header class="c-course-top">${close}<span class="c-course-stars">★ ${done*3}</span></header>
  <div class="c-course-progress"><strong>${done} of 28</strong>${sections.map(x=>`<span><i class="${x===here?'on':''}">${x.i+1}</i><em><b style="width:${x.got/x.titles.length*100}%"></b></em></span>`).join('')}</div>
  <div class="c-course-map">${done?'':`<p class="c-course-pip">${pipMark()}<span>Learn options in 28 short levels.</span></p>`}${sections.map(x=>`<h3>${x.i+1} · ${x.name}<small>${x.got} of ${x.titles.length}</small></h3><ol>${x.titles.map(title=>{const n=++number,state=n<=done?'done':n===1?'now':'ahead';return `<li>${btn(`<b>${n}</b><span>${title}</span>${state==='done'?'<em>★★★</em>':state==='ahead'?I('lock'):''}`,'station',`data-value="${n}" aria-label="Level ${n}, ${title}"`,`c-level ${state}`)}</li>`;}).join('')}</ol>`).join('')}<p class="c-next-course">${I('lock')}Next course</p></div>
  <footer class="c-course-foot"><div><i>${here.i+1}</i><strong>${here.name}</strong><span>${here.got} of ${here.titles.length}</span></div>${btn(`<strong>Play level 1${again}</strong><small>${done?'Levels 2 to 28 are in the app':LEVELS[0]}</small>`,'play-level','data-value="1"','app-button full')}</footer>${station}`;
}

// ---------- Coaching ----------
// Names, photos and specialties are the public coaching page's; the times are sample data. Josh is the founder: on the
// Coaches list, with no bookable times here. No giveaway or practice wheel: that stays off the site while its legal hold stands.
const COACHES=[
  ['josh','Josh','Chart reading, Day trading',['Getting started','Chart reading'],[]],
  ['money-mike','Money Mike','Discipline, Structure, Swing trading',['Swing trading','Risk & discipline'],[480,780,840]],
  ['ms-mary','Ms. Mary','Scalping, Fibonacci, Levels and stops',['Scalping','Chart reading'],[240,300,360,540,600]],
  ['airtuan','AirTuan','Premium selling, Covered calls and puts',['Options'],[240,360,480,600]],
  ['charles','Charles','Chart clarity, Stewardship, Patience',['Chart reading','Risk & discipline'],[420,540,660]],
  ['guppy','Turbo Trader Guppy','Entries and exits, Risk, Psychology',['Risk & discipline','Getting started'],[720,780,840]],
  ['parker','Profits with Parker','Clean setups, Live trading, Consistency',['Chart reading','Getting started'],[390,450,510]],
  ['tom','Turtle Trader Tom','Watchlists, Triggers, Risk management',['Swing trading','Risk & discipline'],[330,660]],
  ['wolf-of-gatsby','Wolf of Gatsby','Mechanical system, Indicators, Structure',['Chart reading'],[900,960]],
  ['daniel','Daniel','Trader tools, Scalping, Alpha indicator',['Scalping'],[270,360,750]],
].map(([id,name,line,topics,hours])=>({id,name,line,topics,hours}));
const COACH_TOPICS=['All topics','Getting started','Scalping','Swing trading','Options','Chart reading','Risk & discipline'];
const coachPhoto=(c,cls='')=>`<img class="n-coach-photo ${cls}" src="assets/app-preview/media/coaches/${c.id}.jpg" alt="" loading="lazy" decoding="async">`;
const coachOf=s=>String(s.detail||'').startsWith('coach-')?COACHES.find(c=>c.id===s.detail.slice(6)):null;
function coachDays(span=14,from=new Date()) {
  return Array.from({length:span},(_,i)=>{const d=new Date(from.getFullYear(),from.getMonth(),from.getDate()+i);return {index:i,name:i?d.toLocaleDateString('en-US',{weekday:'short'}).toUpperCase():'TODAY',date:d.getDate(),full:d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})};});
}
const coachTimes=(c,day)=>c.hours.filter((_,k)=>c.hours.length<3||(k+day)%3!==2);
const coachOnDay=(c,i,day)=>c.hours.length>0&&(i+day)%4!==3;
// "4–5 AM", "11:30 AM–12:30 PM": an hour, said the way the app says it.
export function hourRange(m) {
  const part=x=>{const h=(Math.floor(x/60)+11)%12+1,mm=x%60;return `${h}${mm?':'+String(mm).padStart(2,'0'):''}`;},half=x=>x%1440<720?'AM':'PM';
  return `${part(m)}${half(m)===half(m+60)?'':' '+half(m)}–${part(m+60)} ${half(m+60)}`;
}
const coachChips=(c,day)=>`<div class="n-coach-times">${coachTimes(c,day).map(t=>btn(hourRange(t),'coach-time',`data-coach="${c.id}" data-value="${t}" data-day="${day}" aria-label="${esc(c.name)}, ${hourRange(t)}"`,'n-coach-time')).join('')}</div>`;
function coachZone() {
  try { return new Intl.DateTimeFormat('en-US',{timeZoneName:'longGeneric'}).formatToParts(new Date()).find(p=>p.type==='timeZoneName')?.value||'your time zone'; }
  catch { return 'your time zone'; }
}
function coachingCalendar(s) {
  const days=coachDays(s.coachSpan||14),shown=days[s.coachDay??0]?s.coachDay??0:0;
  const topic=s.coachTopic||'All topics',all=topic==='All topics';
  const rows=COACHES.filter((c,i)=>coachOnDay(c,i,shown)&&(all||c.topics.includes(topic)));
  const has=d=>COACHES.some((c,i)=>coachOnDay(c,i,d.index));
  return `${btn(`See all coaches ${I('next')}`,'native-detail','data-value="coaches"','app-button full c-all-coaches')}
  <div class="n-days" role="group" aria-label="Day">${days.map(d=>`<button class="n-day ${d.index===shown?'selected':''}" data-action="coach-day" data-value="${d.index}" aria-pressed="${d.index===shown}"><small>${d.name}</small><strong>${d.date}</strong><i class="${has(d)?'':'none'}"></i></button>`).join('')}${(s.coachSpan||14)<28?btn('More','coach-more','','n-day c-more-days'):''}</div>
  <div class="n-topic-wrap">${btn(`${esc(topic)}<svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1.500 1.500 6 6l4.500-4.500" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round"/></svg>`,'coach-topic-menu',`aria-expanded="${!!s.coachMenu}"`,`n-topic ${all?'':'on'}`)}${s.coachMenu?`<button class="n-topic-scrim" data-action="coach-topic-menu" aria-label="Close topics"></button><div class="n-topic-menu">${COACH_TOPICS.map(t=>btn(t,'coach-topic',`data-value="${esc(t)}" aria-pressed="${t===topic}"`,t===topic?'on':'')).join('')}</div>`:''}</div>
  <p class="n-coach-kind">1-on-1, 1 hr, $200</p>
  ${rows.length?rows.map(c=>`<article class="n-coach-row"><button class="n-coach-who" data-action="native-detail" data-value="coach-${c.id}">${coachPhoto(c)}<strong>${esc(c.name)}</strong>${I('next')}</button>${coachChips(c,shown)}</article>`).join(''):'<p class="n-coach-none">Nothing open this day.</p>'}
  <p class="n-coach-zone">Times in ${esc(coachZone())}</p>`;
}
function coachesList() {
  return COACHES.map(c=>`<button class="n-coach-listed" data-action="native-detail" data-value="coach-${c.id}">${coachPhoto(c)}<span><strong>${esc(c.name)}${c.id==='josh'?tag('Founder','gold'):''}</strong><small>${esc(c.line)}</small></span>${I('next')}</button>`).join('');
}
function coachPage(c) {
  const days=coachDays(),i=COACHES.indexOf(c),next=days.find(d=>coachOnDay(c,i,d.index));
  return `<div class="c-coach-hero">${coachPhoto(c,'large')}<div><h3>${esc(c.name)}</h3><p>${c.id==='josh'?'Founder':'Crown Trader'}</p></div></div>${label('Teaches')}<div class="n-chip-row">${c.line.split(', ').map(t=>tag(t,'up')).join('')}</div>
  ${label('Sessions')}<dl class="c-facts"><div><dt>1-on-1 coaching · 1 hr</dt><dd>$200</dd></div></dl>
  ${next?`${label(`Next open · ${next.full}`)}${coachChips(c,next.index)}`:'<p class="n-coach-none">Not taking bookings right now</p>'}`;
}
function booking(s) {
  const c=COACHES.find(x=>x.id===s.bookCoach)||COACHES[1],day=coachDays(28)[s.bookDay||0];
  return `<div class="c-sheet-head">${coachPhoto(c)}<strong>${esc(c.name)}</strong><span>${esc(c.line)}</span></div><p class="n-coach-zone">Times in ${esc(coachZone())}</p>
  <dl class="c-facts"><div><dt>Session</dt><dd>1-on-1 coaching</dd></div><div><dt>When</dt><dd>${day.full} · ${clock(s.bookTime||480)}</dd></div><div><dt>Length</dt><dd>1 hr</dd></div><div><dt>Price</dt><dd>$200</dd></div></dl>
  ${btn('Pay $200','pay','','app-button full')}<p class="n-demo-note">Sample times. Nothing is booked or charged here.</p>`;
}
function coaching(s) {
  const coach=coachOf(s);
  return s.detail==='book'?booking(s):coach?coachPage(coach):s.detail==='coaches'?coachesList():coachingCalendar(s);
}
function coachingHeader(s) {
  const coach=coachOf(s);
  if(s.detail==='book') return sheetTop('Book',{done:false}).replace('</header>',`${btn('Close','back','','c-done')}</header>`);
  if(coach||s.detail==='coaches') return `<header class="app-header c-top">${btn(I('back'),'back','aria-label="Back"','c-disc')}<h2><span>${coach?esc(coach.name):'Coaches'}</span></h2><div class="c-top-end"></div></header>`;
  return `<header class="app-header c-top">${btn(I('close'),'home','aria-label="Close Coaching"','c-disc')}<h2><span>Coaching</span></h2><div class="c-top-end"></div></header>`;
}

// ---------- Live calendar ----------
function live() {
  const next=liveNext();
  return liveDays().map(({offset,rows})=>`${label(`${offset===0?'TODAY · ':offset===1?'TOMORROW · ':''}${dayName(offset).toUpperCase()}`)}<section class="n-live-day">${rows.map(row=>{const [minute,title,host,length]=row,left=until(offset,minute),isNext=next.row===row&&next.offset===offset;const [t,half]=clock(minute).split(' ');return `<div class="c-live-row ${left?'':'ended'} ${isNext?'next':''}"><time>${t} ${half}<small>ET</small></time><span><strong>${title}</strong><small>${host} · ${length} min</small></span>${left?`<b>${isNext?tag('NEXT','up'):''}in ${left}</b>`:''}</div>`;}).join('')}</section>`).join('')+'<p class="n-demo-note">The app’s weekly plan on a sample day. No live broadcast here.</p>';
}

// ---------- Chat ----------
export const SAMPLE_WINS = [
  {id:'w1',name:'Riley',avatar:'R',time:'10:18 AM',kind:'Followed my plan',note:'GOOGL closed past my line. I got out at my planned stop instead of moving it. That counts as progress.'},
  {id:'w2',name:'Casey',avatar:'C',time:'10:12 AM',kind:'Followed my plan',note:'Waited for the close. My stop was set before the entry.'},
  {id:'w3',name:'Sam',avatar:'S',time:'10:06 AM',kind:'Learned something',note:'I finally understand why a stop goes on the chart before I buy.'},
  {id:'w4',name:'Jordan',avatar:'J',time:'9:58 AM',kind:'Learned something',note:'Asked what a stop was. Got a straight answer.'}
];
const WIN_KINDS=['Followed my plan','Learned something'];
const ROOM_PICTURE=Object.fromEntries(fixtures.rooms.map(([name,,picture])=>[name,picture]));
const roomPicture=(name,size=48)=>`<img src="assets/app-preview/${name==='SWJ Alerts'?'media/coaches/josh.jpg':ROOM_PICTURE[name]?`media/rooms/chat-room-${ROOM_PICTURE[name]}.jpg`:'app-icon.png'}" alt="" width="${size}" height="${size}">`;
const TEAM_POST={id:'a1',room:'Announcements',name:'Friendly Trader',avatar:'F',time:'9:00 AM',text:'Welcome to the preview. Every person and message in Chat here is a sample.'};
const TALKED=[['NVDA',1.8,'41 mentions',[3,5,4,9,8,12,11,16]],['TSLA',-0.9,'18 mentions',[16,14,15,11,12,8,9,5]],['AAPL',0.4,'In the news',[7,8,6,9,8,11,10,13]]];
function spark(values,down){const low=Math.min(...values),span=Math.max(...values)-low||1;return `<svg class="n-talked-spark ${down?'is-down':''}" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><polyline fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" points="${values.map((v,i)=>`${i/(values.length-1)*100},${19-(v-low)/span*18}`).join(' ')}"/></svg>`;}
const roomPosts=(s,room)=>[...fixtures.messages,...s.messages].filter(m=>m.room===room&&!m.parent);
function chatHeader(s) {
  if(s.detail==='menu') return sheetTop('Chat');
  if(s.detail==='win-compose') return sheetTop('Share a win');
  if(s.detail==='here') return sheetTop('Here now');
  if(s.detail==='saved') return sheetTop('Saved');
  if(s.detail==='thread') return `<header class="app-header c-top">${btn(I('back'),'back','aria-label="Back"','c-disc')}<h2><span>Thread</span></h2><div class="c-top-end"></div></header>`;
  if(s.detail==='room') {
    const room=fixtures.rooms.find(([name])=>name===s.room),sub=s.room==='Wins'?(s.wins.length?`You’ve shared ${s.wins.length} ${s.wins.length===1?'win':'wins'}`:'Share your first win'):s.room==='Announcements'?'Team posts only':room?.[1]||'';
    return `<header class="app-header c-top c-room-top">${btn(I('back'),'back','aria-label="Chat"','c-disc')}<h2>${roomPicture(s.room,32)}<span>${esc(s.room)}<small>${sub}</small></span></h2><div class="c-top-end">${btn(I('search'),'chat-search-toggle','aria-label="Search messages"','c-disc')}${btn(I('more'),'native-detail','data-value="menu" aria-label="More"','c-disc')}</div></header>`;
  }
  return top('chat','Chat',{extra:btn(I('more'),'native-detail','data-value="menu" aria-label="More"','c-disc')});
}
function winCard(w,s) {
  const cheered=s.reactions.includes(w.id),count=(w.cheers??8)+(cheered?1:0);
  return `<article class="n-win-message"><span class="avatar" aria-hidden="true">${esc(w.avatar)}</span><div><div class="n-message-meta"><strong>${esc(w.name)}</strong><time>${w.time}</time></div><div class="n-win-bubble"><span class="n-win-kind">${I(w.kind==='Followed my plan'?'check':'spark')}${esc(w.kind.toUpperCase())}</span><p>${esc(w.note)}</p><div class="n-win-reactions">${btn(`${cheered?'Cheered':'Cheer'}${count?` · ${count}`:''}`,'reaction',`data-id="${w.id}" aria-pressed="${cheered}"`,'')}</div></div></div></article>`;
}
function chatList(s){
  const unread=s.chatRead?{}:{'Trading Floor':3,'Options Chat':1,'Wins':2};
  const talked=TALKED.map(([t,move,why,values])=>{const down=move<0;return `<div class="n-talked-tile"><span class="n-talked-symbol">${t}</span><span class="n-talked-move ${down?'is-down':''}">${down?'▼':'▲'} ${Math.abs(move).toFixed(1)}%</span><span class="n-talked-why">${why}</span>${spark(values,down)}</div>`;}).join('');
  const rooms=fixtures.rooms.map(([name,blurb])=>{const m=name==='Wins'?[...s.wins,...SAMPLE_WINS].map(w=>({name:w.name,text:w.note}))[0]:roomPosts(s,name).pop();return `<button class="n-chat-row" data-action="room" data-value="${name}">${roomPicture(name)}<span class="n-chat-words"><strong>${name}</strong><small>${m?`${esc(m.name)}: ${esc(m.text)}`:blurb}</small></span>${m?`<span class="c-chat-end"><time>now</time>${unread[name]?`<i class="c-count">${unread[name]}</i>`:''}</span>`:''}</button>`;}).join('');
  return `<div class="c-newline">${s.chatRead?'<span>All read</span>':`<span><b>6</b> new</span>${btn('Mark all read','mark-read','','app-link')}`}</div>
  <section class="n-talked" aria-labelledby="n-talked-head"><h3 id="n-talked-head">Talked about now</h3><div class="n-talked-tiles">${talked}</div></section>
  <section class="c-crowned"><h3>Crowned Traders</h3><button class="c-crown-card" data-action="room" data-value="SWJ Alerts">${coachPhoto(COACHES[0])}<span><strong>SWJ Alerts<time>now</time></strong><small>Sample alert. In the app, Josh’s own posts land here.</small></span></button></section>
  <nav class="n-chat-rooms" aria-label="Rooms">${rooms}</nav><p class="n-demo-note">Everything here is sample data.</p>`;
}
function composer(s,placeholder) {
  const key=s.detail==='thread'?'thread:'+s.thread:s.room;
  return `<form class="composer c-composer" data-form="message">${s.room==='Wins'?btn(I('plus'),'compose-win','aria-label="Share a win"','c-disc'):''}<input name="message" aria-label="${placeholder}" placeholder="${placeholder}" value="${esc(s.drafts[key]||'')}" maxlength="1000" autocomplete="off"><button class="c-send" type="submit" aria-label="Send">${I('arrowup')}</button></form>`;
}
function chat(s) {
  if(!s.detail) return chatList(s);
  if(s.detail==='menu') return [['mark-read','Mark all read','check'],['saved','Saved','star'],['here','Here now','person'],['notifications','Notifications','bell'],['profile','Your profile','person']].filter(([id])=>id!=='mark-read'||!s.chatRead).map(([id,t,i])=>btn(`${I(i)}<span>${t}</span>${I('next')}`,'chat-option',`data-value="${id}"`,'n-setting-row')).join('');
  if(s.detail==='here') return `<p class="n-demo-note">Sample members.</p>${['Jordan','Casey','Maya','Riley','Sam','Theo'].map(name=>`<div class="n-setting-row"><span class="avatar">${name[0]}</span><span><strong>${name}</strong></span><i class="n-dot"></i></div>`).join('')}`;
  if(s.detail==='saved') return [...fixtures.messages,...s.messages].filter(m=>s.savedMessages.includes(m.id)).map(m=>messageHTML(m,s)).join('')||'<div class="n-empty">Nothing saved yet.<br>Tap Save on a message to keep it here.</div>';
  if(s.detail==='win-compose') return `${segment(WIN_KINDS,'winKind',s.winKind)}<form data-form="win"><label class="field">A trade, a plan you kept, a lesson.<textarea name="note" rows="4" maxlength="500" required></textarea></label><button type="submit" class="app-button full">Share</button></form><p class="n-demo-note">Shared in this preview only.</p>`;
  if(s.detail==='thread') { const m=[...fixtures.messages,...s.messages].find(x=>x.id===s.thread);return `${m?messageHTML(m,s,true):''}${s.messages.filter(x=>x.parent===s.thread).map(x=>messageHTML(x,s,true)).join('')}${composer(s,'Reply')}`; }
  const query=s.search.toLowerCase(),searchBox=s.showChatSearch?`<form class="n-chat-search" data-form="chat-search"><input name="query" aria-label="Search messages" placeholder="Search messages" value="${esc(s.search)}"><button type="submit" aria-label="Search">${I('search')}</button></form>`:'';
  if(s.room==='Wins') { const wins=[...s.wins,...SAMPLE_WINS].filter(w=>!query||[w.name,w.note,w.kind].join(' ').toLowerCase().includes(query));return `${searchBox}<div class="n-conversation"><div class="n-chat-date">Today</div>${wins.map(w=>winCard(w,s)).join('')||'<p class="n-demo-note">No matching messages.</p>'}</div>${composer(s,'Cheer someone on')}`; }
  const team=['Announcements','SWJ Alerts'].includes(s.room),posts=(s.room==='Announcements'?[TEAM_POST]:roomPosts(s,s.room)).filter(m=>!query||(m.text+' '+m.name).toLowerCase().includes(query));
  return `${searchBox}<div class="n-conversation">${posts.length?`<div class="n-chat-date">Today</div>${posts.map(m=>messageHTML(m,s,team)).join('')}`:`<p class="n-demo-note">${query?'No matching messages.':s.room==='SWJ Alerts'?'No sample alerts. In the app, Josh’s own posts land here.':'No sample messages in this room.'}</p>`}</div>${team?`<p class="c-team-only">${I('lock')}Team posts only</p>`:composer(s,`Message ${esc(s.room)}`)}`;
}

// ---------- Pip ----------
const PIP_CHIPS={stops:['What is Stop Finder for?','How do I find a stop for a stock?','What do Long and Short do?','Which tool should I use for what?']};
function assistant(s) {
  const from=s.assistantContext||'home',name=meta(from)?.[1]||'Home',atHome=from==='home';
  const chips=PIP_CHIPS[from]||(atHome?['Which tool should I use for what?']:[`What is ${name} for?`,'Which tool should I use for what?']);
  return `${atHome?`<section class="c-lead c-pip-lead"><em>JUST OUT</em><h3>CPI Inflation Report</h3><p>CPI came in at 2.8%. Expected 2.9%.</p><div>${nav('economy','Open in Economy','c-open')}</div></section>`:from==='stops'?`<section class="c-lead c-pip-lead"><em>START HERE</em><p>Type any ticker in the search box to see its stop and targets on the chart.</p></section>`:''}
  <form class="composer c-composer" data-form="pip"><input name="question" aria-label="${atHome?'Ask Pip anything':'Ask anything about the app'}" placeholder="${atHome?'Ask Pip anything':'Ask anything about the app'}" maxlength="250"><button class="c-send" type="submit" aria-label="Ask">${I('arrowup')}</button></form>
  ${label('OR TAP A QUESTION')}<div class="n-pip-prompts">${chips.map(q=>btn(q,'ask-pip',`data-value="${esc(q)}"`,'')).join('')}</div>
  ${s.pipQuestion?`<p class="n-pip-question">${esc(s.pipQuestion)}</p>`:''}${s.pipAnswer?`<div class="n-pip-bubble pip-answer" role="status"><p>${esc(s.pipAnswer)}</p></div>`:''}<p class="n-demo-note">Sample answers, written ahead for this preview.</p>`;
}

// ---------- Settings, as a member opens them from Home ----------
const switchRow=(s,key,text)=>`<div class="n-setting-row"><span>${text}</span><button class="switch" role="switch" aria-label="${text}" aria-checked="${s.notificationPrefs?.[key]!==false}" data-action="notification-pref" data-value="${key}"></button></div>`;
function profile(s) {
  if(s.detail==='account') return `<section class="c-plan">${pipMark()}<strong>Trader Tier</strong><span><i class="n-dot"></i>Active</span>${['Every tool','Community chats','Live with Josh','Crown Traders live'].map(t=>`<p>${I('check')}${t}</p>`).join('')}</section><p class="n-demo-note">A sample member. Nothing here is an account.</p>`;
  if(s.detail==='appearance') return `${label('Theme')}${['System','Light','Dark'].map(t=>btn(`<span>${t}</span>${s.theme===t?I('check'):''}`,'set',`data-key="theme" data-value="${t}" aria-pressed="${s.theme===t}"`,'n-setting-row')).join('')}`;
  if(s.detail==='notifications') return `${label('On screen')}${switchRow(s,'catalyst','Catalyst alerts')}${label('Market alerts')}${on('aplus')?switchRow(s,'aplus','A+ Scalps'):''}${switchRow(s,'live','Live sessions')}${switchRow(s,'brief','Morning brief')}${on('bigmoney')?switchRow(s,'bigmoney','Big Money'):''}${label('Community')}${switchRow(s,'team','Team posts to all')}${switchRow(s,'announcements','Announcements')}${switchRow(s,'holiday','Holiday greetings')}<p class="n-demo-note">The preview never asks for notifications or sends one.</p>`;
  if(s.detail==='help') return btn(`${I('chat')}<span><strong>Contact support</strong></span>${I('next')}`,'profile-detail','data-value="support"','n-setting-row');
  if(s.detail==='support') { const sent=s.helpMessages||[];return `${sent.length?`<div class="n-chat-date">Today</div>${sent.map(text=>`<p class="c-help-mine">${esc(text)}</p>`).join('')}<p class="n-demo-note">Nothing was sent. This is a sample of the app’s Help chat, where Admin replies.</p>`:`<div class="c-help-empty">${I('chat')}<h3>How can we help?</h3><p>Our team will reply here.</p></div>`}<form class="composer c-composer" data-form="help"><input name="message" aria-label="Message" placeholder="Message" maxlength="1000" autocomplete="off"><button class="c-send" type="submit" aria-label="Send">${I('arrowup')}</button></form>`; }
  if(s.detail==='signout') return `<div class="c-confirm"><h3>Sign out?</h3><p>Your membership stays on Whop. Sign back in any time.</p>${btn('Sign out','sign-out','','app-button full')}${btn('Cancel','back','','app-button secondary full')}</div>`;
  const row=(id,t,d,i)=>`<button class="n-setting-row" data-action="profile-detail" data-value="${id}">${I(i)}<span><strong>${t}</strong>${d?`<small>${d}</small>`:''}</span>${I('next')}</button>`;
  return `<button class="c-account" data-action="profile-detail" data-value="account"><span class="avatar">${I('person')}</span><span><strong>Your account</strong><small><i class="n-dot"></i>Active</small></span>${I('next')}</button>
  <div class="n-settings">${on('coaching')?`<button class="n-setting-row" data-screen="coaching">${I('calendar')}<span><strong>My sessions</strong></span>${I('next')}</button>`:''}${row('support','Help chat','Message us','chat')}${row('appearance','Appearance','Theme and reading size','moon')}${row('notifications','Notifications','Push alerts and catalyst chips','bell')}${row('help','Help','Tours and support','phone')}${row('signout','Sign out','','signout')}</div>
  <div class="c-settings-foot">${pipMark()}<span>Friendly Trader</span>${btn('Reset the preview','reset','','app-link')}</div>`;
}
function quick(s) {
  const name=id=>meta(id)[1],inBar=s.quick.filter(on),more=QUICK_CHOICES.filter(id=>on(id)&&!s.quick.includes(id));
  return `<p class="n-body-copy">Pick 3 to 6. Drag to reorder.</p>${label('In your bar')}${inBar.map((id,i)=>`<div class="n-setting-row">${btn(I('check'),'quick-toggle',`data-value="${id}" aria-label="Remove ${name(id)}"`,'c-pick on')}${I(meta(id)[3])}<span>${name(id)}</span>${i?btn('↑','quick-up',`data-value="${id}" aria-label="Move ${name(id)} earlier"`,'icon-button'):''}</div>`).join('')}
  ${more.length?`${label('Add more')}${more.map(id=>`<div class="n-setting-row">${btn(I('plus'),'quick-toggle',`data-value="${id}" aria-label="Add ${name(id)}"`,'c-pick')}${I(meta(id)[3])}<span>${name(id)}</span></div>`).join('')}`:''}
  ${s.quickChanged?btn('Back to the default six','quick-default','','app-link full'):''}`;
}
function welcome() {
  return `<div class="c-welcome">${pipMark()}<strong>Friendly Trader</strong><h3>Trading tools,<br>free to start</h3><p>Earnings, Stop Finder and Economy are free.</p><p><b>No account needed.</b></p>${nav('home','Open the app','app-button full')}${btn('Already a member? Sign in','sign-in','','app-button secondary full')}</div>`;
}
export function renderNativeView(s) {
  if(s.detail==='chart') return `<div class="chart-expanded">${nativeChart(s,true)}<p class="n-demo-note">Drag to move. Pinch or use + and − to zoom.</p></div>`;
  return ({home,stream,macd,aplus,patterns,screener,stops,bigmoney,pipbrain,course,coaching,earnings,economy,live,chat,assistant,profile,quick,welcome}[s.screen]||home)(s);
}
