import React from 'react';
import {AbsoluteFill, useVideoConfig, interpolate, Easing} from 'remotion';
import type {Orientation} from '../Film';
import {theme} from '../theme';
import {Phone} from '../components/Devices';
import {Spotlight, Pulse, useLocal, ease} from '../components/Overlays';
import {LowerThird} from '../components/Caption';
import {BotMark} from '../components/Chrome';
import {wordStart} from '../timing';
import {T} from '../edit';
import {phoneHero} from '../layout';

/**
 * 7.95 to 12.41 s. The turn. Cream wipes the dark world away, the bot mark lands, the phone rises with the real Home recording
 * (captures/home.mp4, 4.3 s: Home renders in over its first 0.8 s). "Let's make this friendlier." types on; "Meet Friendly Trader." on its onset.
 * Spotlight sweeps the Morning card, then the Live row. Music enters on the first cream frame (Don't FOMO 52 s, No Stink 21 s devices).
 */
export const Turn: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const t = useLocal();
  const s0 = T.turn.start;
  const tLets = wordStart('turn', "let's") - s0;
  const tMeet = wordStart('turn', 'meet') - s0;
  const wipe = ease(t / 0.45);
  const rise = interpolate(t, [tLets + 0.45, tLets + 1.35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const hero = phoneHero(o, W, H);
  const markSize = o === 'portrait' ? 220 : 200;
  const markA = ease((t - 0.15) / 0.5);
  const markShrink = interpolate(rise, [0, 1], [1, 0.42]);
  const markX = o === 'portrait' ? interpolate(rise, [0, 1], [W / 2 - markSize / 2, 72]) : interpolate(rise, [0, 1], [W * 0.5 - markSize / 2, 120]);
  const markY = o === 'portrait' ? interpolate(rise, [0, 1], [H * 0.3, 70]) : interpolate(rise, [0, 1], [H * 0.36, 56]);
  return (
    <AbsoluteFill style={{background: '#141d19'}}>
      <AbsoluteFill style={{background: theme.cream, clipPath: `circle(${wipe * 120}% at 50% 50%)`}} />
      <div style={{position: 'absolute', inset: 0, opacity: rise, transform: `translateY(${(1 - rise) * H * 0.12}px)`}}>
        <Phone capture="ios-home" video="home" heightPx={hero.h} x={hero.x} y={hero.y}>
          <Spotlight x={12} y={90} w={340} h={138} at={tMeet + 1.0} until={tMeet + 2.2} radius={18} />
          <Pulse x={12} y={90} w={340} h={138} at={tMeet + 1.1} radius={18} times={1} />
          <Spotlight x={12} y={660} w={340} h={62} at={tMeet + 2.3} until={tMeet + 3.3} radius={14} />
        </Phone>
      </div>
      <div style={{position: 'absolute', left: markX, top: markY, opacity: markA, transform: `scale(${markShrink})`, transformOrigin: 'top left'}}>
        <BotMark size={markSize} />
      </div>
      <div style={{position: 'absolute', left: (o === 'portrait' ? 72 : 120) + markSize * 0.42 + 18, top: (o === 'portrait' ? 70 : 56) + (markSize * 0.42) / 2 - 22, opacity: rise, fontFamily: theme.display, fontWeight: 800, fontSize: o === 'portrait' ? 44 : 40, color: theme.forest}}>
        Friendly Trader
      </div>
      <LowerThird text={t < tMeet ? "Let's make this friendlier." : "Let's make this friendlier.\nMeet Friendly Trader."} at={tLets} o={o} pos={o === 'portrait' ? 'top' : 'left'} cps={42} />
    </AbsoluteFill>
  );
};
