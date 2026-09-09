// Builds a 1 fps contact sheet from a rendered film for review. Requires ffmpeg on PATH.
import {execSync} from 'node:child_process';
const input = process.argv[2] || 'out/friendly-trader-film-landscape.mp4';
const output = process.argv[3] || 'out/contact-sheet.jpg';
execSync(`ffmpeg -v error -y -i "${input}" -vf "fps=1,scale=320:-1,drawtext=text='%{pts\\:hms}':x=6:y=6:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.5,tile=8x8" "${output}"`, {stdio: 'inherit'});
console.log('wrote', output);
