import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import type {Orientation} from '../Film';
import {theme} from '../theme';
import {Phone, useCamera} from '../components/Devices';
import {Pulse, useLocal} from '../components/Overlays';
import {LowerThird} from '../components/Caption';
import {Chip} from '../components/Chrome';
import {wordStart} from '../timing';
import {T} from '../edit';
import {phoneHero} from '../layout';

/**
 * 41.15 to 49.48 s. "Then talk it through with people learning alongside you. Ask. Learn. Celebrate following your plan."
 * Real recording captures/room.mp4 (8.3 s): the Wins room, Riley's "Followed my plan" card arrives at 1.3 s and Sam's
 * "Learned something" card at 3.3 s with the app's own animation. Structure from Don't FOMO (receipts arriving one by one);
 * content is the app's fictional members, labeled by the chip. Overlays: pulse each card as it lands, type the three words on their onsets.
 * Geometry measured on the recording (390x844 space): Riley card y 168-290, Sam card y 300-410.
 */
export const Room: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const cam = useCamera({from: 1.0, to: 1.05});
  const t = useLocal();
  const s0 = T.room.start;
  const tAsk = wordStart('room', 'ask') - s0;
  const tLearn = wordStart('room', 'learn') - s0;
  const tCelebrate = wordStart('room', 'celebrate') - s0;
  const hero = phoneHero(o, W, H);
  const lower = t < tAsk ? '' : t < tLearn ? 'Ask.' : t < tCelebrate ? 'Ask. Learn.' : 'Ask. Learn.\nCelebrate following your plan.';
  return (
    <AbsoluteFill style={{background: theme.cream}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: o === 'portrait' ? '50% 60%' : '68% 55%'}}>
        <Phone capture="ios-wins" video="room" heightPx={hero.h} x={hero.x} y={hero.y}>
          <Pulse x={12} y={168} w={366} h={124} at={1.7} radius={16} />
          <Pulse x={12} y={300} w={366} h={112} at={3.7} radius={16} />
        </Phone>
      </div>
      {lower && <LowerThird text={lower} at={0} o={o} cps={400} pos={o === 'portrait' ? 'top' : 'left'} />}
      <Chip text="Simulated members" o={o} />
    </AbsoluteFill>
  );
};
