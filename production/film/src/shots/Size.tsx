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
 * 19.49 to 25.50 s. Stop Finder, NVDA swing example (its own labeled example: entry 188.10, stop 184.71, $3.39 risk per share).
 * Real recording captures/size.mp4 (5.9 s): the amount types 1, 25, 250 over 0 to 1.7 s and the app's own calculation lands on 73 shares.
 * Overlays: spotlight the Position size card while the voice names the Stop Finder, pulse the share count on "share count".
 * Geometry measured on captures/ios-sizing.jpg (390x844).
 */
export const Size: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const cam = useCamera({from: 1.0, to: 1.04});
  const s0 = T.size.start;
  const tStop = wordStart('size', 'stop') - s0;
  const tShare = wordStart('size', 'share') - s0;
  const tBefore = wordStart('size', 'before') - s0;
  const hero = phoneHero(o, W, H, {x: 0.66, h: 0.82});
  const ws = words('size').map((w) => ({text: w.text, at: w.start - s0, emphasis: ['risk.', 'count'].includes(w.text.toLowerCase())}));
  return (
    <AbsoluteFill style={{background: theme.cream}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: o === 'portrait' ? '50% 60%' : '66% 55%'}}>
        <Phone capture="ios-sizing" video="size" heightPx={hero.h} x={hero.x} y={hero.y}>
          <Pulse x={30} y={414} w={330} h={40} at={0.4} radius={10} times={1} />
          <Spotlight x={18} y={335} w={354} h={230} at={tStop} until={tBefore + 1.0} radius={16} strength={0.3} />
          <Pulse x={226} y={464} w={136} h={34} at={tShare} radius={8} times={2} />
        </Phone>
      </div>
      <KineticPhrases words={ws} phraseStarts={[0, 6, 9, 15]} o={o} pos={o === 'portrait' ? 'top' : 'left'} size={o === 'portrait' ? 72 : 64} maxWidth={o === 'portrait' ? undefined : W * 0.38} />
      <Chip text="Simulated example. Stop Finder swing stop." o={o} />
    </AbsoluteFill>
  );
};
