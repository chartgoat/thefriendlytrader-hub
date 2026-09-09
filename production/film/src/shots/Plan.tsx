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
 * 12.41 to 19.49 s. A+ Scalps NVDA, real recording captures/plan.mp4 (7.1 s): the app draws the entry line at 0.3 to 0.7 s,
 * the stop at 1.3 to 2.0 s, target 1 at 4.3 s and targets 2 and 3 at 6.0 to 6.7 s. The recording is cut to this segment, so it plays
 * from its first frame. Overlays only pulse the tags on the voice onsets and spotlight the Entry / Stop / Target 1 strip on "Together".
 * Reference: A+ Scalp 34 to 36 s (line draws, tag arrives). Geometry measured on captures/ios-plan-chart.jpg (390x844).
 */
export const Plan: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const cam = useCamera({from: 1.0, to: 1.05});
  const s0 = T.plan.start;
  const tEntry = wordStart('plan', 'entry') - s0;
  const tExit = wordStart('plan', 'exit') - s0;
  const tTarget = wordStart('plan', 'target') - s0;
  const tTogether = wordStart('plan', 'together') - s0;
  const hero = phoneHero(o, W, H);
  const emph = new Set(['entry.', 'wrong.', 'target.', 'together,']);
  const ws = words('plan').map((w) => ({text: w.text, at: w.start - s0, emphasis: emph.has(w.text.toLowerCase())}));
  return (
    <AbsoluteFill style={{background: theme.cream}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: o === 'portrait' ? '50% 60%' : '68% 55%'}}>
        <Phone capture="ios-plan-chart" video="plan" heightPx={hero.h} x={hero.x} y={hero.y}>
          <Pulse x={280} y={512} w={92} h={24} at={Math.max(tEntry + 0.5, 0.8)} radius={6} color={theme.ink} />
          <Pulse x={280} y={543} w={86} h={24} at={Math.max(tExit + 0.5, 2.1)} radius={6} color={theme.risk} />
          <Pulse x={280} y={434} w={92} h={24} at={Math.max(tTarget + 0.5, 4.5)} radius={6} color={theme.forest} />
          <Spotlight x={12} y={672} w={340} h={54} at={tTogether + 0.1} until={tTogether + 2.4} radius={12} strength={0.35} />
        </Phone>
      </div>
      <KineticPhrases words={ws} o={o} pos={o === 'portrait' ? 'top' : 'left'} size={o === 'portrait' ? 80 : 74} />
      <Chip text="Simulated example" o={o} at={tEntry} />
    </AbsoluteFill>
  );
};
