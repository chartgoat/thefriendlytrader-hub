import React from 'react';
import {AbsoluteFill, useVideoConfig, interpolate, Easing} from 'remotion';
import type {Orientation} from '../Film';
import {theme} from '../theme';
import {Phone, MacWindow} from '../components/Devices';
import {useLocal} from '../components/Overlays';
import {KineticPhrases} from '../components/Caption';
import {Chip} from '../components/Chrome';
import {wordStart, words} from '../timing';
import {T} from '../edit';

/**
 * 49.48 to 53.51 s. "On your iPhone. At your desk, on your Mac."
 * The phone (Stop Finder sizing, the real size.mp4 held on its final state) slides left and shrinks; the native Mac Stop Finder
 * recording (captures/mac.mp4, 4.3 s, 2880x1800) opens from the right on "desk". Both devices hold the same NVDA Stop Finder example.
 * Chapter hands off to stops on macOS. No reconstructed layouts.
 */
export const Mac: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const t = useLocal();
  const s0 = T.mac.start;
  const tDesk = wordStart('mac', 'desk') - s0;
  const p = interpolate(t, [tDesk - 0.3, tDesk + 0.7], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const ws = words('mac').map((w) => ({text: w.text, at: w.start - s0, emphasis: ['iphone.', 'mac.'].includes(w.text.toLowerCase())}));
  const portrait = o === 'portrait';
  const phone = portrait
    ? {x: interpolate(p, [0, 1], [W * 0.5, W * 0.28]), y: interpolate(p, [0, 1], [H * 0.58, H * 0.7]), h: interpolate(p, [0, 1], [H * 0.62, H * 0.4])}
    : {x: interpolate(p, [0, 1], [W * 0.5, W * 0.19]), y: H * 0.56, h: interpolate(p, [0, 1], [H * 0.82, H * 0.52])};
  const mac = portrait
    ? {x: W * 0.5, y: interpolate(p, [0, 1], [H * 1.3, H * 0.5]), w: W * 0.94}
    : {x: interpolate(p, [0, 1], [W * 1.4, W * 0.63]), y: H * 0.56, w: W * 0.68};
  return (
    <AbsoluteFill style={{background: theme.cream}}>
      {p > 0 && <MacWindow capture="mac-stops" video="mac" widthPx={mac.w} x={mac.x} y={mac.y} opacity={p} />}
      <Phone capture="ios-sizing" video="size" startFrom={5.0} heightPx={phone.h} x={phone.x} y={phone.y} />
      <KineticPhrases words={ws} o={o} pos="top" size={portrait ? 72 : 64} />
      <Chip text="Simulated example" o={o} />
    </AbsoluteFill>
  );
};
