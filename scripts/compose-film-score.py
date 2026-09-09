"""Compose the original instrumental score. Requires NumPy."""
import numpy as np,wave
from pathlib import Path
sr=32000;duration=90;n=sr*duration;music=np.zeros((n,2),dtype=np.float32)
def note(start,length,midi,amp=.13,pan=0,kind='keys'):
 count=min(int(length*sr),n-int(start*sr))
 if count<=0:return
 t=np.arange(count,dtype=np.float32)/sr;f=440*2**((midi-69)/12)
 if kind=='pad':
  sig=(np.sin(2*np.pi*f*t)+.24*np.sin(2*np.pi*f*2*t)+.1*np.sin(2*np.pi*f*.998*t));env=np.minimum(t/.8,1)*np.minimum((length-t)/1.2,1)
 elif kind=='bass':
  sig=np.sin(2*np.pi*f*t)+.15*np.sin(2*np.pi*f*2*t);env=(1-np.exp(-t*55))*np.exp(-t*2.2)
 else:
  sig=np.sin(2*np.pi*f*t+1.3*np.sin(2*np.pi*f*2*t)*np.exp(-t*4))+.15*np.sin(2*np.pi*f*3*t);env=(1-np.exp(-t*90))*np.exp(-t*2.1)
 sig*=np.maximum(env,0)*amp;pos=int(start*sr);music[pos:pos+count,0]+=sig*np.sqrt((1-pan)/2);music[pos:pos+count,1]+=sig*np.sqrt((1+pan)/2)
beat=.625;bar=beat*4;chords=[[50,57,61,66],[47,54,59,62],[43,50,55,59],[45,52,57,61]]
for k,start in enumerate(np.arange(0,84,bar)):
 chord=chords[k%4]
 for j,p in enumerate(chord):note(float(start),bar+1.5,p+12,.037,(j-1.5)*.35,'pad')
 if start>=6:
  for j,p in enumerate([chord[1]+12,chord[2]+12,chord[3]+12,chord[2]+12]):note(float(start+j*beat),2.3,p,.12 if start>=12 else .08,(-.25,.3,-.1,.2)[j])
  for j in [0,2]:note(float(start+j*beat),1.6,chord[0],.16,0,'bass')
# Resolve warmly at the invitation. Delays give the simple original motif space.
for p in [50,57,61,66,73]:note(84,6,p,.075,(p-61)/40,'pad')
for i,p in enumerate([73,69,66,62]):note(84+i*.625,3,p,.09,.15)
for delay,gain in [(.1875,.18),(.375,.1)]:
 offset=int(delay*sr);music[offset:]+=music[:-offset,::-1]*gain
fade=np.minimum(np.arange(n)/sr/1.2,1)*np.minimum((n-np.arange(n))/sr/3,1)
music*=fade[:,None];music=np.tanh(music*1.15);music*=.73/max(float(np.abs(music).max()),.73)
with wave.open(str(Path(__file__).resolve().parents[1]/'docs/app-preview/film-frames/original-score.wav'),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((music*32767).astype('<i2').tobytes())
print('Original instrumental score: 90 seconds, stereo, 32000 Hz')
