import React from 'react';
import {AbsoluteFill, useVideoConfig, interpolate, Easing} from 'remotion';
import type {Orientation} from '../Film';
import {theme} from '../theme';
import {Phone, MacWindow} from '../components/Devices';
import {Card} from '../components/Caption';
import {BotMark} from '../components/Chrome';
import {useLocal, ease, Pop} from '../components/Overlays';
import {wordStart} from '../timing';
import {T} from '../edit';

/**
 * 60.53 s to the end. "Friendly Trader. Never trade alone. Pause here. Step inside. Try it for yourself."
 * Cream end card in the reference grammar: mark, slogan, one action, an arrow, both devices. The action is the site's
 * Step inside the app control; the film's own button mirrors it. No prices, no offers.
 */
export const Action: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const t = useLocal();
  const s0 = T.action.start;
  const tNever = wordStart('action', 'never') - s0;
  const tPause = wordStart('action', 'pause') - s0;
  const tStep = wordStart('action', 'step') - s0;
  const wipe = ease(t / 0.5);
  const portrait = o === 'portrait';
  const markA = ease((t - 0.1) / 0.5);
  const devicesA = ease((t - tNever - 0.3) / 0.7);
  const bob = Math.sin(t * 3.2) * 6;
  const arrowA = interpolate(t, [tStep + 0.5, tStep + 1.0], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: '#141d19'}}>
      <AbsoluteFill style={{background: theme.cream, clipPath: `circle(${wipe * 120}% at 50% 50%)`}} />
      <div style={{position: 'absolute', left: W / 2 - (portrait ? 110 : 90), top: portrait ? H * 0.12 : H * 0.09, opacity: markA, transform: `translateY(${(1 - markA) * 16}px)`}}>
        <BotMark size={portrait ? 220 : 180} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: portrait ? H * 0.12 + 240 : H * 0.09 + 196, textAlign: 'center', fontFamily: theme.display, fontWeight: 800, fontSize: portrait ? 56 : 48, color: theme.forest, opacity: markA}}>Friendly Trader</div>
      <Card text="Never trade alone." at={tNever} o={o} top={portrait ? H * 0.36 : H * 0.33} size={portrait ? 112 : 124} />
      {/* both devices, small, under the slogan */}
      <div style={{position: 'absolute', inset: 0, opacity: devicesA, transform: `translateY(${(1 - devicesA) * 30}px)`}}>
        <MacWindow capture="mac-stops" video="mac" startFrom={4.0} widthPx={portrait ? W * 0.78 : W * 0.34} x={portrait ? W * 0.56 : W * 0.6} y={portrait ? H * 0.66 : H * 0.7} />
        <Phone capture="ios-home" video="home" startFrom={4.0} heightPx={portrait ? H * 0.26 : H * 0.36} x={portrait ? W * 0.2 : W * 0.34} y={portrait ? H * 0.7 : H * 0.74} />
      </div>
      <Pop at={tPause} style={{position: 'absolute', left: 0, right: 0, top: portrait ? H * 0.83 : H * 0.88, display: 'flex', justifyContent: 'center', gap: portrait ? 22 : 28, alignItems: 'center', flexDirection: portrait ? 'column' : 'row'}}>
        <div style={{background: theme.forest, color: theme.cream, fontFamily: theme.display, fontWeight: 800, fontSize: portrait ? 44 : 40, padding: portrait ? '26px 54px' : '22px 48px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 18px 44px rgba(11,93,63,0.28)'}}>Step inside the app</div>
        <div style={{fontFamily: theme.text, fontWeight: 600, fontSize: portrait ? 32 : 30, color: theme.neutral, whiteSpace: 'nowrap', textAlign: 'center'}}>Try it for yourself · iPhone and Mac</div>
      </Pop>
      <div style={{position: 'absolute', left: W / 2 - 18, top: (portrait ? H * 0.83 + 200 : H * 0.95) + bob, opacity: arrowA, fontFamily: theme.display, fontSize: 40, color: theme.forest}}>↓</div>
    </AbsoluteFill>
  );
};
