// The edit, conformed to the continuous narrator take. All times in seconds.
import {seg, wordStart, VOICE_DURATION} from './timing';
export const FPS = 60;
export const FILM_END = Math.ceil(VOICE_DURATION) + 1; // 1 s tail after the last word for the end card to sit
const lead = 0.15; // picture arrives slightly before the voice line
export const T = {
  hook: {start: 0, end: seg('noise').start - lead},
  noise: {start: seg('noise').start - lead, end: seg('turn').start - 0.25},
  turn: {start: seg('turn').start - 0.25, end: seg('plan').start - lead},
  plan: {start: seg('plan').start - lead, end: seg('size').start - lead},
  size: {start: seg('size').start - lead, end: seg('pip').start - lead},
  pip: {start: seg('pip').start - lead, end: seg('checks').start - lead},
  macd: {start: seg('checks').start - lead, end: wordStart('checks', 'explore') - 0.1},
  patterns: {start: wordStart('checks', 'explore') - 0.1, end: seg('room').start - lead},
  room: {start: seg('room').start - lead, end: seg('mac').start - lead},
  mac: {start: seg('mac').start - lead, end: seg('payoff').start - lead},
  payoff: {start: seg('payoff').start - lead, end: seg('action').start - 0.2},
  action: {start: seg('action').start - 0.2, end: FILM_END},
};
export const DURATION_FRAMES = FILM_END * FPS;
/** Chapter handoff map for Codex (film-script.mjs schema). */
export const CHAPTERS = [
  {id: 'hook', ...T.hook, screen: 'aplus', detail: 'setup', platform: 'ios', title: 'Now what?'},
  {id: 'noise', ...T.noise, screen: 'home', platform: 'ios', title: 'Still no plan'},
  {id: 'turn', ...T.turn, screen: 'home', platform: 'ios', title: 'Meet Friendly Trader'},
  {id: 'plan', ...T.plan, screen: 'aplus', detail: 'setup', platform: 'ios', title: 'Together, on the chart'},
  {id: 'size', ...T.size, screen: 'stops', platform: 'ios', title: 'Size it', focal: 'size', riskBudget: 250},
  {id: 'pip', ...T.pip, screen: 'assistant', platform: 'ios', title: 'Meet Pip'},
  {id: 'checks', start: T.macd.start, end: T.patterns.end, screen: 'macd', platform: 'ios', title: 'Check the signals', beats: [{at: T.patterns.start - T.macd.start, screen: 'patterns', detail: 'pattern'}]},
  {id: 'room', ...T.room, screen: 'chat', detail: 'room', room: 'Wins', platform: 'ios', title: 'Talk it through'},
  {id: 'mac', ...T.mac, screen: 'stops', platform: 'macos', title: 'On your Mac'},
  {id: 'payoff', ...T.payoff, screen: 'aplus', detail: 'setup', platform: 'ios', title: 'Your plan, your tools', beats: [
    {at: 0},
    {at: wordStart('payoff', 'tools') - T.payoff.start, screen: 'stops', detail: null, platform: 'macos'},
    {at: wordStart('payoff', 'ask') - T.payoff.start, screen: 'chat', detail: 'room', room: 'Wins', focal: 'room', platform: 'ios'},
  ]},
  {id: 'action', ...T.action, screen: 'home', platform: 'ios', title: 'Never trade alone'},
];
