import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import type {Orientation} from '../Film';
import {theme} from '../theme';
import {Phone, useCamera} from '../components/Devices';
import {Pulse, Spotlight} from '../components/Overlays';
import {KineticPhrases} from '../components/Caption';
import {wordStart, words} from '../timing';
import {T} from '../edit';
import {phoneHero} from '../layout';

/**
 * 25.50 to 35.72 s. "And when the chart needs a translator? Meet Pip. Ask the basic question. Get a plain-English explanation. No judgment."
 * Real recording captures/pip.mp4 (10.2 s): the question types at 3.6 to 4.6 s, the answer writes itself at 6.0 to 7.7 s, matching the
 * voice ("Ask the basic question" at about 3.6 s, "Get a plain-English explanation" at about 5.8 s). Overlays: pulse the Pip header on "Meet Pip",
 * spotlight the finished answer through "No judgment." Light humor lives in the caption line "THE CHART NEEDS A TRANSLATOR?".
 * Geometry measured on captures/ios-pip.jpg (390x844).
 */
export const Pip: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const cam = useCamera({from: 1.0, to: 1.04});
  const s0 = T.pip.start;
  const tMeet = wordStart('pip', 'meet') - s0;
  const tNo = wordStart('pip', 'no') - s0;
  const hero = phoneHero(o, W, H);
  const emph = new Set(['translator?', 'pip.', 'plain-english', 'judgment.']);
  const ws = words('pip').map((w) => ({text: w.text, at: w.start - s0, emphasis: emph.has(w.text.toLowerCase())}));
  return (
    <AbsoluteFill style={{background: theme.cream}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: o === 'portrait' ? '50% 60%' : '68% 55%'}}>
        <Phone capture="ios-pip" video="pip" heightPx={hero.h} x={hero.x} y={hero.y}>
          <Pulse x={12} y={92} w={200} h={60} at={tMeet} radius={14} />
          <Spotlight x={12} y={592} w={366} h={82} at={7.8} until={tNo + 1.6} radius={16} strength={0.28} />
        </Phone>
      </div>
      <KineticPhrases words={ws} phraseStarts={[0, 4, 7, 9, 13, 17]} o={o} pos={o === 'portrait' ? 'top' : 'left'} size={o === 'portrait' ? 72 : 64} maxWidth={o === 'portrait' ? undefined : W * 0.4} />
    </AbsoluteFill>
  );
};
