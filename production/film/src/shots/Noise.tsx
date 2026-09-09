import React from 'react';
import {AbsoluteFill, useVideoConfig, interpolate} from 'remotion';
import type {Orientation} from '../Film';
import {theme} from '../theme';
import {Footage} from '../components/Chrome';
import {Phone} from '../components/Devices';
import {KineticPhrases} from '../components/Caption';
import {useLocal, ease} from '../components/Overlays';
import {words, wordStart} from '../timing';
import {T} from '../edit';

/**
 * 3.35 to 7.95 s. "Another chart. Another opinion. Still no plan."
 * Beat 1 on "Another chart": the MACD screen, tilted and desaturated, another tab in the noise.
 * Beat 2 on "Another opinion": footage/another-opinion.mp4 (2.87 s, frames 485 to 571, the observer turning to listen) with three clashing
 * opinion bubbles, no brand, no claims. Beat 3 on "Still no plan": the observer again (observer.mp4 from 1.7 s, hand to keyboard, unsure).
 * Reference: 2K to 10K montage pacing, A+ "chops sideways / fakes you out" schematic beats.
 */
export const Noise: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const t = useLocal();
  const s0 = T.noise.start;
  const tOpinion = wordStart('noise', 'another', 1) - s0 - 0.1;
  const tStill = wordStart('noise', 'still') - s0 - 0.1;
  const ws = words('noise').map((w, i) => ({text: w.text, at: w.start - s0, emphasis: i === 6}));
  const portrait = o === 'portrait';
  const bubble = (text: string, x: number, y: number, at: number, flip?: boolean) => {
    const a = ease((t - at) / 0.35);
    if (a <= 0) return null;
    const fs = portrait ? 44 : 40;
    return (
      <div style={{position: 'absolute', left: x, top: y, transform: `translateY(${(1 - a) * 24}px) rotate(${flip ? 2 : -2}deg)`, opacity: a, background: flip ? '#2b3a33' : '#f1ede4', color: flip ? theme.cream : theme.ink, fontFamily: theme.text, fontSize: fs, fontWeight: 600, padding: `${fs * 0.5}px ${fs * 0.8}px`, borderRadius: fs, boxShadow: '0 20px 60px rgba(0,0,0,0.35)', whiteSpace: 'nowrap'}}>
        {text}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: '#141d19'}}>
      {t < tOpinion && (
        <AbsoluteFill>
          <div style={{position: 'absolute', inset: 0, filter: 'saturate(0.35) brightness(0.8)', transform: `scale(${1 + interpolate(t, [0, 4], [0, 0.06])})`}}>
            <Phone capture="ios-macd" heightPx={portrait ? H * 0.62 : H * 0.95} x={portrait ? W * 0.5 : W * 0.72} y={portrait ? H * 0.62 : H * 0.58} tilt={8} />
          </div>
        </AbsoluteFill>
      )}
      {t >= tOpinion && t < tStill && (
        <Footage file="another-opinion.mp4" from={tOpinion} label="observer listens to opinions" grade={0.7}>
          {bubble('Buy the dip.', portrait ? W * 0.12 : W * 0.4, portrait ? H * 0.6 : H * 0.6, tOpinion)}
          {bubble('Wait for the pullback.', portrait ? W * 0.3 : W * 0.46, portrait ? H * 0.68 : H * 0.72, tOpinion + 0.35, true)}
          {bubble('Sell.', portrait ? W * 0.2 : W * 0.38, portrait ? H * 0.76 : H * 0.84, tOpinion + 0.7)}
        </Footage>
      )}
      {t >= tStill && (
        <Footage file="observer.mp4" from={tStill} label="observer, unsure" startFrom={1.7} scale={1 + (t - tStill) * 0.02} grade={0.7} />
      )}
      <KineticPhrases words={ws} o={o} pos={portrait ? 'top' : 'left'} dark />
    </AbsoluteFill>
  );
};
