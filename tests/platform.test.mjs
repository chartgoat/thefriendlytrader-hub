import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, tourPosition, restoreTour, SCREENS, TOUR } from '../assets/app-preview/core.mjs';
import { changePlatform, renderMacFrame, MAC_SHORTCUTS } from '../assets/app-preview/platform.mjs';
import { renderNativeView, nativeHeader, sheetStyle } from '../assets/app-preview/native.mjs';
import { attachChart } from '../assets/app-preview/chart.mjs';

test('switching platforms and resuming a tour retain visitor work and platform preference', () => {
  const state = createState();
  Object.assign(state, {screen:'stops', symbol:'AAPL', direction:'short', riskBudget:400, chart:{offset:17,count:28}});
  state.drafts.Wins = 'I followed my plan';
  state.messages.push({text:'Sample post'});
  const before = structuredClone(state), position = tourPosition(state);
  assert.equal(changePlatform(state, 'macos'), state);
  assert.deepEqual(state, {...before, platform:'macos'});
  changePlatform(state, 'unknown');
  assert.equal(state.platform,'macos');
  state.screen='chat';
  restoreTour(state,position);
  assert.equal(state.platform,'macos');
  assert.equal(state.screen,'stops');
  assert.deepEqual(state.chart,before.chart);
  assert.deepEqual(state.drafts,before.drafts);
  assert.deepEqual(state.messages,before.messages);
  changePlatform(state,'ios');
  for (const key of Object.keys(before)) assert.deepEqual(state[key],before[key],key);
});

test('both platforms render every root and tour chapter; Mac uses native destination order', () => {
  assert.deepEqual(MAC_SHORTCUTS,['home','macd','patterns','screener','stops','aplus','earnings','economy','stream','chat']);
  for(const platform of ['ios','macos']) for(const destination of [...SCREENS.map(([screen])=>({screen})), ...TOUR]) {
    const state={...createState(),...destination,platform};
    const page=nativeHeader(state)+renderNativeView(state);
    const html=platform==='macos'?renderMacFrame(state,page,sheetStyle(state)):page;
    assert.doesNotMatch(html,/undefined|NaN/);
    assert.ok(html.length>200);
  }
  const profile={...createState(),screen:'profile'};
  assert.match(renderNativeView(profile),/Choose and reorder your tools/);
  assert.doesNotMatch(renderNativeView({...profile,platform:'macos'}),/Choose and reorder your tools/);
  const escaped=renderMacFrame({...profile,platform:'macos',name:'<script>example</script>'},'page',true);
  assert.doesNotMatch(escaped,/<script>/);
});

test('chart drawing adapts to Mac window resizing without resetting its position and releases its observer', () => {
  const previous=globalThis.ResizeObserver;
  let resize,disconnected=false;
  globalThis.ResizeObserver=class {
    constructor(callback){resize=callback;}
    observe(){}
    disconnect(){disconnected=true;}
  };
  try {
    const readout={},tooltip={};
    const svg={clientWidth:886,clientHeight:360,attrs:{},innerHTML:'',
      closest:()=>({querySelector:()=>readout}),parentElement:{querySelector:()=>tooltip},
      addEventListener(){},setAttribute(key,value){this.attrs[key]=value;}};
    const state={...createState(),platform:'macos',screen:'stops',chart:{offset:12,count:28}};
    const handle=attachChart(svg,state,()=>{},()=>{});
    assert.equal(svg.attrs.viewBox,'0 0 886 360');
    svg.clientWidth=620;resize();
    assert.equal(svg.attrs.viewBox,'0 0 620 360');
    assert.deepEqual(state.chart,{offset:12,count:28});
    assert.match(readout.textContent,/28 bars · Earlier/);
    state.platform='ios';svg.clientWidth=300;resize();
    assert.equal(svg.attrs.viewBox,'0 0 340 408');
    assert.match(svg.innerHTML,/Explain stop line/);
    handle.destroy();assert.equal(disconnected,true);
  } finally {globalThis.ResizeObserver=previous;}
});
