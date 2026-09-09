// Conformed to the continuous narrator take and the 72-second Fable edit.
// All app data is simulated. The same timeline drives playback and app handoff.
export const FILM = [
  {
    "id": "hook",
    "start": 0,
    "end": 3.35,
    "screen": "aplus",
    "kind": "title",
    "chapter": "Now what?",
    "title": "Now what?",
    "body": "You find a stock you like. It’s moving. Now what?",
    "detail": "setup"
  },
  {
    "id": "noise",
    "start": 3.35,
    "end": 7.952,
    "screen": "home",
    "kind": "title",
    "chapter": "Still no plan",
    "title": "Another chart.\nStill no plan.",
    "body": "Another opinion. Another question."
  },
  {
    "id": "turn",
    "start": 7.952,
    "end": 12.406,
    "screen": "home",
    "kind": "brand",
    "chapter": "Meet Friendly Trader",
    "title": "Let’s make\nthis friendlier.",
    "body": "Meet Friendly Trader."
  },
  {
    "id": "plan",
    "start": 12.406,
    "end": 19.489,
    "screen": "aplus",
    "kind": "product",
    "chapter": "Together, on the chart",
    "title": "Together,\non the chart.",
    "body": "Your entry. Your exit if you’re wrong. Your target.",
    "detail": "setup",
    "beats": [
      {
        "at": 0,
        "cue": "Entry · where you start"
      },
      {
        "at": 1.4,
        "cue": "Stop · your planned exit"
      },
      {
        "at": 3.85,
        "cue": "Target · what you’re aiming for"
      }
    ]
  },
  {
    "id": "size",
    "start": 19.489,
    "end": 25.503,
    "screen": "stops",
    "kind": "product",
    "chapter": "Size it",
    "title": "Choose your risk.",
    "body": "See a sample share count before you enter.",
    "focal": "size",
    "riskBudget": 250
  },
  {
    "id": "pip",
    "start": 25.503,
    "end": 35.72,
    "screen": "assistant",
    "kind": "pip",
    "chapter": "Meet Pip",
    "title": "Meet Pip.",
    "body": "A plain-English explanation. No judgment."
  },
  {
    "id": "checks",
    "start": 35.72,
    "end": 41.153,
    "screen": "macd",
    "kind": "product",
    "chapter": "Check the signals",
    "title": "Make sense\nof the signals.",
    "body": "Check the momentum. Explore the pattern.",
    "beats": [
      {
        "at": 0
      },
      {
        "at": 1.814,
        "screen": "patterns",
        "detail": "pattern"
      }
    ]
  },
  {
    "id": "room",
    "start": 41.153,
    "end": 49.478,
    "screen": "chat",
    "kind": "product",
    "chapter": "Talk it through",
    "title": "Talk it through.",
    "body": "Ask. Learn. Celebrate following your plan.",
    "detail": "room",
    "room": "Wins"
  },
  {
    "id": "mac",
    "start": 49.478,
    "end": 53.506,
    "screen": "stops",
    "kind": "desktop",
    "chapter": "On your Mac",
    "title": "On your iPhone.\nOn your Mac.",
    "body": "The same tools, with room to think.",
    "platform": "macos"
  },
  {
    "id": "payoff",
    "start": 53.506,
    "end": 60.526,
    "screen": "aplus",
    "kind": "product",
    "chapter": "Your plan, your tools",
    "title": "Your plan. Your tools.\nSomewhere to ask.",
    "body": "The market will keep moving. Bring your plan and a little backup.",
    "detail": "setup",
    "beats": [
      {"at": 0},
      {"at": 4.004, "screen": "stops", "detail": null, "platform": "macos"},
      {"at": 6.14, "screen": "chat", "detail": "room", "room": "Wins", "focal": "room", "platform": "ios"}
    ]
  },
  {
    "id": "action",
    "start": 60.526,
    "end": 72,
    "screen": "home",
    "kind": "end",
    "chapter": "Never trade alone",
    "title": "Never trade alone.",
    "body": "Pause here. Step inside. Try it for yourself."
  }
];
export const FILM_DURATION=72;
export function filmFrame(seconds){
  const time=Math.max(0,Math.min(FILM_DURATION,Number(seconds)||0));
  const index=Math.max(0,FILM.findIndex(s=>time<s.end));
  const scene=time===FILM_DURATION?FILM.at(-1):FILM[index];
  const local=time-scene.start;
  const beat=(scene.beats||[]).filter(b=>b.at<=local+1e-9).at(-1)||{};
  return {...scene,...beat,index:FILM.indexOf(scene),time,local,platform:beat.platform||scene.platform||'ios',key:scene.id+':'+(beat.at??0)};
}
export function filmCuts(){return FILM.flatMap(s=>(s.beats||[{at:0}]).map((b,i,a)=>({time:s.start+b.at,duration:(a[i+1]?.at??(s.end-s.start))-b.at,key:s.id+'-'+i})));}
export function filmTime(seconds){const s=Math.max(0,Math.floor(seconds));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
