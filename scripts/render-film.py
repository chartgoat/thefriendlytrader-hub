"""Render the current 72-second Fable composition. See production/film/README.md."""
from pathlib import Path
import argparse,json,subprocess
root=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser()
p.add_argument('orientation',choices=['landscape','portrait'])
p.add_argument('--production-root',type=Path,default=root/'production/film')
a=p.parse_args();work=a.production_root.resolve()
cli=work/'node_modules/.bin/remotion'
if not cli.exists():raise SystemExit('Install local production dependencies first: cd production/film && npm ci')
if not (work/'public/audio/film-mix.wav').exists():raise SystemExit('Stage verified production inputs first; see production/film/README.md')
subprocess.run(['node','scripts/prepare-assets.mjs'],cwd=work,check=True)
master=work/'out'/f'friendly-trader-film-{a.orientation}.mp4'
master.parent.mkdir(exist_ok=True)
subprocess.run([str(cli),'render','src/index.ts','FriendlyTraderFilm'+a.orientation.title(),str(master),'--codec','h264','--crf','18','--concurrency','4','--audio-codec','aac','--audio-bitrate','192k','--pixel-format','yuv420p'],cwd=work,check=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-of','json',str(master)]))
if abs(float(probe['format']['duration'])-72)>.05:raise SystemExit('Unexpected film duration; update the edit and handoff map together.')
output=root/'assets/app-preview/media'/f'friendly-trader-film-{a.orientation}.mp4'
candidate=output.with_name(output.stem+'.pending.mp4')
subprocess.run(['ffmpeg','-v','error','-y','-i',str(master),'-i',str(work/'public/audio/film-mix.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-t','72','-movflags','+faststart',str(candidate)],check=True)
candidate.replace(output)
print('READY',output,output.stat().st_size)
