// Prints the chapter map derived from the narration timing, for FILM in film-script.mjs.
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const t = JSON.parse(readFileSync(resolve(root, 'src/narration-timing.json'), 'utf8'));
const seg = (id) => t.segments.find((s) => s.id === id);
const ws = (id, p) => seg(id).words.find((w) => w.text.toLowerCase().startsWith(p)).start;
const lead = 0.15, END = Math.ceil(t.duration) + 1;
const rows = [
  ['hook', 0, seg('noise').start - lead, 'aplus/setup'], ['noise', seg('noise').start - lead, seg('turn').start - 0.25, 'home'],
  ['turn', seg('turn').start - 0.25, seg('plan').start - lead, 'home'], ['plan', seg('plan').start - lead, seg('size').start - lead, 'aplus/setup'],
  ['size', seg('size').start - lead, seg('pip').start - lead, 'stops'], ['pip', seg('pip').start - lead, seg('checks').start - lead, 'assistant'],
  ['checks', seg('checks').start - lead, seg('room').start - lead, `macd, patterns beat at +${(ws('checks','explore') - 0.1 - (seg('checks').start - lead)).toFixed(2)}`],
  ['room', seg('room').start - lead, seg('mac').start - lead, 'chat/Wins'], ['mac', seg('mac').start - lead, seg('payoff').start - lead, 'stops macos'],
  ['payoff', seg('payoff').start - lead, seg('action').start - 0.2, 'aplus/setup'], ['action', seg('action').start - 0.2, END, 'home'],
];
console.log(`FILM_DURATION = ${END}`);
for (const [id, s, e, screen] of rows) console.log(`${id.padEnd(8)} ${s.toFixed(2).padStart(6)} -> ${e.toFixed(2).padStart(6)}  ${screen}`);
