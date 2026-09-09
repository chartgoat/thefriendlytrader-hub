// Stages inputs for the composition:
// 1. copies public/audio/narration-timing.json into src/ (falls back to the planned timing if absent)
// 2. writes src/available.json so missing footage/audio render as labeled placeholders
import {readFileSync, writeFileSync, existsSync, copyFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => resolve(root, 'public', p);
const timingSrc = pub('audio/narration-timing.json');
if (existsSync(timingSrc)) copyFileSync(timingSrc, resolve(root, 'src/narration-timing.json'));
else if (!existsSync(resolve(root, 'src/narration-timing.json'))) {
  console.error('No narration timing found; run Codex voice generation first.'); process.exit(1);
}
const wanted = ['brand/app-icon.png', ...['observer','another-opinion','reaction'].map(n=>`footage/${n}-last.jpg`), ...['home','plan','size','pip','macd','patterns','room','mac'].map(n=>`captures/${n}-last.jpg`), 'audio/narration.wav','audio/music.wav','audio/sfx.wav','audio/film-mix.wav','footage/observer.mp4','footage/another-opinion.mp4','footage/reaction.mp4',
  ...['home','plan','size','pip','macd','patterns','room','mac'].map(n=>`captures/${n}.mp4`),
  ...['ios-home','ios-plan','ios-plan-chart','ios-stops','ios-sizing','ios-pip','ios-pip-empty','ios-wins','ios-macd','ios-patterns','mac-home','mac-plan','mac-stops','mac-sizing','mac-chat'].map(n=>`captures/${n}.jpg`)];
const available = Object.fromEntries(wanted.map((a) => [a, existsSync(pub(a))]));
writeFileSync(resolve(root, 'src/available.json'), JSON.stringify(available, null, 2) + '\n');
const missing = wanted.filter((a) => !available[a]);
console.log(`assets: ${wanted.length} wanted, ${wanted.length - missing.length} present, ${missing.length} missing`);
if (missing.length) throw new Error('Missing production assets: ' + missing.join(', '));
