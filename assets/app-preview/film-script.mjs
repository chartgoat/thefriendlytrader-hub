// The film and interactive handoff share this edit. All app data is simulated.
export const FILM = [
  {id:'noise',start:0,end:6,screen:'home',kind:'title',chapter:'The feeling',title:'So much market.\nWhere do you start?',body:'Another chart. Another opinion. Another open tab.',beats:[{at:0,title:'Another chart.',body:'Another opinion. Another open tab.'},{at:2,title:'So much market.',body:'And you’re still wondering…'},{at:4,title:'What’s my\nnext step?',body:'Let’s make that feel a little clearer.'}]},
  {id:'friendly',start:6,end:12,screen:'home',kind:'brand',chapter:'Meet Friendly Trader',title:'Big market.\nFriendly company.',body:'Meet Friendly Trader.',beats:[{at:0,title:'Meet Friendly\nTrader.',body:'Your tools. Your plan. Your people.'},{at:3,title:'A clearer way\nto approach your day.',body:'On iPhone and Mac.'}]},
  {id:'plan',start:12,end:22,screen:'aplus',detail:'setup',kind:'product',chapter:'See the whole plan',title:'An idea is good.\nA plan is better.',body:'Your entry. Your stop. Your targets.',cue:'One chart. The whole plan.',beats:[{at:0,cue:'Entry · where you start'},{at:3,cue:'Stop · your planned exit'},{at:6,cue:'Targets · what you’re aiming for'}]},
  {id:'risk',start:22,end:30,screen:'stops',kind:'product',chapter:'Think through your risk',title:'Think it through.\nBefore you’re in.',body:'Choose your risk. See a sample trade size.',cue:'Your risk belongs in the plan.',beats:[{at:0},{at:4,focal:'size',cue:'A sample size. Built around your risk.'}]},
  {id:'pip',start:30,end:38,screen:'assistant',kind:'pip',chapter:'Meet Pip',title:'No question\ntoo basic.',body:'Pip helps the chart make sense.',cue:'A friendly explanation, right here.',beats:[{at:0,cue:'“What does a stop mean?”'},{at:4,cue:'Plain words. A clearer picture.'}]},
  {id:'momentum',start:38,end:46,screen:'macd',kind:'product',chapter:'Get some context',title:'See the move.\nGet the context.',body:'Read momentum with the chart beside you.',cue:'Start with context.'},
  {id:'patterns',start:46,end:54,screen:'patterns',detail:'pattern',kind:'product',chapter:'Make the chart click',title:'Those shapes?\nThey tell a story.',body:'See the pattern. Take a closer look.',cue:'Zoom in. Get curious.'},
  {id:'discover',start:54,end:61,screen:'screener',kind:'product',chapter:'Find your starting point',title:'Find your focus.',body:'Bring the day’s moving stocks into one view.',cue:'Less hunting. A place to start.'},
  {id:'calendar',start:61,end:68,screen:'earnings',kind:'product',chapter:'Keep the bigger picture',title:'Keep the bigger\npicture close.',body:'Earnings. Economic reports. The dates that matter.',cue:'Make room for what’s coming.',beats:[{at:0,screen:'earnings',cue:'Company earnings'},{at:3.5,screen:'economy',cue:'The economic calendar'}]},
  {id:'community',start:68,end:76,screen:'chat',detail:'room',room:'Wins',kind:'product',chapter:'Find your people',title:'Good habits.\nGood company.',body:'Talk it through. Ask. Learn. Celebrate discipline.',cue:'Good habits deserve good company.'},
  {id:'mac',start:76,end:84,screen:'home',platform:'macos',kind:'desktop',chapter:'Your space, on both devices',title:'In your pocket.\nAt your desk.',body:'Friendly Trader for iPhone and Mac.',cue:'Room for your whole trading day.',beats:[{at:0,screen:'home'},{at:4,screen:'stops',cue:'A wider view. The same friendly feeling.'}]},
  {id:'invitation',start:84,end:90,screen:'home',kind:'end',chapter:'Make yourself at home',title:'Your next step\nstarts here.',body:'Pause the film. Step inside. Make yourself at home.',cue:'Friendly Trader · iPhone and Mac'}
];
export const FILM_DURATION=90;
export function filmFrame(seconds){
  const time=Math.max(0,Math.min(FILM_DURATION,Number(seconds)||0));
  const index=Math.max(0,FILM.findIndex(s=>time<s.end));
  const scene=time===FILM_DURATION?FILM.at(-1):FILM[index];
  const local=time-scene.start;
  const beat=(scene.beats||[]).filter(b=>b.at<=local).at(-1)||{};
  return {...scene,...beat,index:FILM.indexOf(scene),time,local,platform:scene.platform||'ios',key:scene.id+':'+(beat.at??0)};
}
export function filmCuts(){return FILM.flatMap(s=>(s.beats||[{at:0}]).map((b,i,a)=>({time:s.start+b.at,duration:(a[i+1]?.at??(s.end-s.start))-b.at,key:s.id+'-'+i})));}
export function filmTime(seconds){const s=Math.max(0,Math.floor(seconds));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
