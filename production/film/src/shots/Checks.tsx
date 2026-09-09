import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import type {Orientation} from '../Film';
import {theme} from '../theme';
import {Phone, useCamera} from '../components/Devices';
import {Pulse, Spotlight} from '../components/Overlays';
import {KineticPhrases} from '../components/Caption';
import {Chip} from '../components/Chrome';
import {wordStart, words} from '../timing';
import {T} from '../edit';
import {phoneHero} from '../layout';

/**
 * 35.72 to ~37.9 s. "Check the momentum." Real recording captures/macd.mp4 (2.3 s: the analyzer renders in over its first 0.5 s).
 * Overlays: spotlight the NVDA morning-play card, pulse the COMPLETED badge. Reference: Sept 8 checklist ticking to the voice (20 to 25 s).
 * Geometry measured on captures/ios-macd.jpg (390x844).
 */
export const Macd: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const cam = useCamera({from: 1.0, to: 1.04});
  const s0 = T.macd.start;
  const tCheck = wordStart('checks', 'check') - s0;
  const hero = phoneHero(o, W, H);
  const ws = words('checks', 0, 3).map((w) => ({text: w.text, at: w.start - s0, emphasis: w.text.toLowerCase().startsWith('momentum')}));
  return (
    <AbsoluteFill style={{background: theme.cream}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: o === 'portrait' ? '50% 60%' : '68% 55%'}}>
        <Phone capture="ios-macd" video="macd" heightPx={hero.h} x={hero.x} y={hero.y}>
          <Spotlight x={15} y={262} w={360} h={372} at={Math.max(tCheck, 0.6)} radius={18} strength={0.3} />
          <Pulse x={258} y={276} w={104} h={26} at={Math.max(tCheck, 0.6) + 0.7} radius={13} color="#8a6d1f" />
        </Phone>
      </div>
      <KineticPhrases words={ws} o={o} pos={o === 'portrait' ? 'top' : 'left'} />
      <Chip text="Simulated example" o={o} />
    </AbsoluteFill>
  );
};

/**
 * ~37.9 to 41.15 s. "Explore the pattern. See what the signals mean." Real recording captures/patterns.mp4 (3.6 s, NVDA forming-pattern example with its
 * illustrative target, entry and stop levels). Overlay: spotlight the plain-English sentence at the top on "See what the signals mean."
 * Geometry measured on captures/ios-patterns.jpg (390x844).
 */
export const Patterns: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const cam = useCamera({from: 1.0, to: 1.04});
  const s0 = T.patterns.start;
  const tSee = wordStart('checks', 'see') - s0;
  const hero = phoneHero(o, W, H);
  const ws = words('checks', 3).map((w) => ({text: w.text, at: w.start - s0, emphasis: ['pattern.', 'mean.'].includes(w.text.toLowerCase())}));
  return (
    <AbsoluteFill style={{background: theme.cream}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: o === 'portrait' ? '50% 60%' : '68% 55%'}}>
        <Phone capture="ios-patterns" video="patterns" heightPx={hero.h} x={hero.x} y={hero.y}>
          <Spotlight x={10} y={22} w={370} h={50} at={tSee} radius={12} strength={0.3} />
        </Phone>
      </div>
      <KineticPhrases words={ws} o={o} pos={o === 'portrait' ? 'top' : 'left'} />
      <Chip text="Simulated example" o={o} />
    </AbsoluteFill>
  );
};
