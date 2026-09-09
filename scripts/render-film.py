"""Render the captured film edit. Requires ffmpeg; run compose-film-score.py first."""
import subprocess,json,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[1];work=root/'docs/app-preview/film-frames';cuts=json.loads((work/'cuts.json').read_text());fmt=sys.argv[1];assert fmt in ('landscape','portrait');width,height=(1280,720) if fmt=='landscape' else (480,800)
# Each shot keeps its editorial duration. A short outgoing dissolve occupies the
# opening of the next shot, so the time-to-app mapping stays exactly aligned.
for i,cut in enumerate(cuts):
 seconds=cut['duration']+(.25 if i<len(cuts)-1 else 0);frames=round(seconds*30)
 out=work/fmt/f'{i:02}-{cuts[i]["key"]}.mp4'
 vf=f"crop={width}:{height}:0:0,scale={width*2}:{height*2},zoompan=z='1+0.018*on/{frames}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={frames}:s={width}x{height}:fps=30,format=yuv420p"
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(work/fmt/(cut['key']+'.png')),'-vf',vf,'-frames:v',str(frames),'-c:v','libx264','-preset','fast','-crf','20','-threads','2',str(out)],check=True)
 print(fmt,cut['key'],flush=True)
inputs=[]
for i in range(len(cuts)):inputs+=['-i',str(work/fmt/f'{i:02}-{cuts[i]["key"]}.mp4')]
filters=[];last='0:v'
for i in range(1,len(cuts)):
 label=f'v{i}';filters.append(f'[{last}][{i}:v]xfade=transition=fade:duration=0.25:offset={cuts[i]["time"]}[{label}]');last=label
filters.append(f'[{last}]trim=duration=90,format=yuv420p[outv]')
output=root/'assets/app-preview/media'/f'friendly-trader-film-{fmt}.mp4'
candidate=work/fmt/'finished.mp4'
subprocess.run(['ffmpeg','-v','error','-y','-filter_complex_threads','2',*inputs,'-i',str(work/'original-score.wav'),'-filter_complex',';'.join(filters),'-map','[outv]','-map',f'{len(cuts)}:a','-c:v','libx264','-preset','fast','-crf','21','-threads','2','-c:a','aac','-b:a','128k','-ar','48000','-af','loudnorm=I=-20:TP=-2:LRA=7','-t','90','-movflags','+faststart',str(candidate)],check=True)
candidate.replace(output)
print('READY',output,output.stat().st_size,flush=True)
