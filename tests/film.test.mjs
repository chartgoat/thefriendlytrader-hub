import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {FILM,FILM_DURATION,filmFrame,filmCuts} from '../assets/app-preview/film-script.mjs';
import {createState,SCREENS} from '../assets/app-preview/core.mjs';
import {renderNativeView} from '../assets/app-preview/native.mjs';

test('film cuts form one continuous narrated edit with stable boundary handoffs',()=>{
 const cuts=filmCuts();let end=0;
 for(const cut of cuts){assert.ok(Math.abs(cut.time-end)<1e-8);assert.ok(cut.duration>0);const start=filmFrame(cut.time);const last=filmFrame(cut.time+cut.duration-.001);assert.equal(start.key,last.key);end+=cut.duration;}
 assert.ok(Math.abs(end-FILM_DURATION)<1e-8);
 assert.equal(filmFrame(-1).id,FILM[0].id);
 assert.equal(filmFrame(NaN).id,FILM[0].id);
 assert.equal(filmFrame(FILM_DURATION).id,FILM.at(-1).id);
 assert.equal(filmFrame(1000).id,FILM.at(-1).id);
 for(let i=1;i<FILM.length;i++){assert.equal(filmFrame(FILM[i].start-.001).id,FILM[i-1].id);assert.equal(filmFrame(FILM[i].start).id,FILM[i].id);}
});
test('every film beat hands off to a real native app screen on the matching platform',()=>{
 for(const cut of filmCuts()){
  const frame=filmFrame(cut.time);
  assert.ok(SCREENS.some(([screen])=>screen===frame.screen));
  const html=renderNativeView({...createState(),...frame,symbol:'NVDA',timeframe:frame.screen==='patterns'?'1d':'1m'});
  assert.ok(html.length>150);assert.doesNotMatch(html,/undefined|NaN/);
 }
 assert.equal(filmFrame(38).screen,'patterns');
 assert.equal(filmFrame(51).platform,'macos');
 assert.equal(filmFrame(51).screen,'stops');
 assert.equal(filmFrame(62).platform,'ios');
 assert.equal(filmFrame(58).screen,'stops');
 assert.equal(filmFrame(58).platform,'macos');
 assert.equal(filmFrame(60).screen,'chat');
 assert.equal(filmFrame(60).platform,'ios');
 assert.equal(filmFrame(23).riskBudget,250);
});
test('film media is local and does not introduce services or browser persistence',()=>{
 const code=['film.mjs','film-script.mjs'].map(f=>fs.readFileSync(new URL('../assets/app-preview/'+f,import.meta.url),'utf8')).join('\n');
 assert.doesNotMatch(code,/\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage/);
 assert.match(code,/friendly-trader-film-/);
});
