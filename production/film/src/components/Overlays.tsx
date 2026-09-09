import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing, spring} from 'remotion';
import {theme} from '../theme';

/** Frame-local seconds since the start of the current Sequence. */
export const useLocal = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const ease = (t: number) => Easing.out(Easing.cubic)(clamp01(t));
export const easeInOut = (t: number) => Easing.inOut(Easing.cubic)(clamp01(t));

/** Reveals a rectangle of the underlying capture left to right (candles drawing) by shrinking a cover. */
export const RevealX: React.FC<{x: number; y: number; w: number; h: number; from: number; to: number; cover?: string}> = ({x, y, w, h, from, to, cover = '#ffffff'}) => {
  const t = useLocal();
  const p = interpolate(t, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear});
  return <div style={{position: 'absolute', left: x + w * p, top: y, width: w * (1 - p) + 1, height: h, background: cover}} />;
};

/** Reveals a rectangle top to bottom (typed answer, arriving card). */
export const RevealY: React.FC<{x: number; y: number; w: number; h: number; from: number; to: number; cover?: string}> = ({x, y, w, h, from, to, cover = theme.paper}) => {
  const t = useLocal();
  const p = ease((t - from) / Math.max(0.001, to - from));
  return <div style={{position: 'absolute', left: x, top: y + h * p, width: w, height: h * (1 - p) + 1, background: cover}} />;
};

/** Traces a line over the capture's own line geometry: a bright head sweeps left to right, the line stays. */
export const TraceLine: React.FC<{x1: number; x2: number; y: number; from: number; to: number; color: string; thickness?: number; dashed?: boolean}> = ({x1, x2, y, from, to, color, thickness = 2.5, dashed}) => {
  const t = useLocal();
  const p = interpolate(t, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  if (p <= 0) return null;
  const len = (x2 - x1) * p;
  return (
    <>
      <div style={{position: 'absolute', left: x1, top: y - thickness / 2, width: len, height: thickness, background: dashed ? `repeating-linear-gradient(90deg, ${color} 0 6px, transparent 6px 10px)` : color, borderRadius: thickness}} />
      {p < 1 && <div style={{position: 'absolute', left: x1 + len - 5, top: y - 5, width: 10, height: 10, borderRadius: 5, background: color, boxShadow: `0 0 12px 3px ${color}`}} />}
    </>
  );
};

/** Pulses a rounded highlight ring around a region of the capture. */
export const Pulse: React.FC<{x: number; y: number; w: number; h: number; at: number; color?: string; radius?: number; times?: number}> = ({x, y, w, h, at, color = theme.forest, radius = 10, times = 1}) => {
  const t = useLocal();
  const {fps} = useVideoConfig();
  if (t < at) return null;
  const local = (t - at) % 0.9;
  const cycle = Math.floor((t - at) / 0.9);
  if (cycle >= times) return null;
  const p = local / 0.9;
  const grow = 1 + p * 0.08;
  void fps;
  return <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: radius, boxShadow: `0 0 0 3px ${color}`, opacity: (1 - p) * 0.9, transform: `scale(${grow})`}} />;
};

/** Dims everything except a rectangle (spotlight). Fades in over `fade` seconds from `at`; optional `until` fades out. */
export const Spotlight: React.FC<{x: number; y: number; w: number; h: number; at: number; until?: number; fade?: number; radius?: number; strength?: number; W?: number; H?: number}> = ({x, y, w, h, at, until, fade = 0.35, radius = 12, strength = 0.42, W = 390, H = 844}) => {
  const t = useLocal();
  let a = ease((t - at) / fade);
  if (until !== undefined) a *= 1 - ease((t - until) / fade);
  if (a <= 0) return null;
  const dim = `rgba(23,37,30,${strength * a})`;
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: y, background: dim}} />
      <div style={{position: 'absolute', left: 0, top: y + h, width: W, height: H - y - h, background: dim}} />
      <div style={{position: 'absolute', left: 0, top: y, width: x, height: h, background: dim}} />
      <div style={{position: 'absolute', left: x + w, top: y, width: W - x - w, height: h, background: dim}} />
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: radius, boxShadow: `0 0 0 2px rgba(11,93,63,${0.9 * a})`}} />
    </>
  );
};

/** Types text into a region of the capture, covering whatever the capture shows there. */
export const TypeInto: React.FC<{x: number; y: number; w: number; h: number; text: string; from: number; cps?: number; font?: string; size?: number; color?: string; cover?: string; padLeft?: number; cursor?: boolean}> = ({x, y, w, h, text, from, cps = 22, font = theme.text, size = 15, color = theme.ink, cover = '#f3f5f2', padLeft = 12, cursor = true}) => {
  const t = useLocal();
  const n = Math.max(0, Math.min(text.length, Math.floor((t - from) * cps)));
  const done = n >= text.length;
  const blink = Math.floor(t * 2.4) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: cover, display: 'flex', alignItems: 'center', paddingLeft: padLeft, boxSizing: 'border-box', fontFamily: font, fontSize: size, color, whiteSpace: 'nowrap', overflow: 'hidden'}}>
      {text.slice(0, n)}
      {cursor && t >= from && (!done || blink) && <span style={{display: 'inline-block', width: 2, height: size * 1.1, background: theme.forest, marginLeft: 1}} />}
    </div>
  );
};

/** Rolls a number in a region of the capture from `start` to `end` between `from` and `to` seconds. */
export const Counter: React.FC<{x: number; y: number; w: number; h: number; from: number; to: number; start: number; end: number; suffix?: string; prefix?: string; size?: number; weight?: number; align?: 'left' | 'right'; cover?: string; font?: string; color?: string}> = ({x, y, w, h, from, to, start, end, suffix = '', prefix = '', size = 17, weight = 700, align = 'right', cover = '#f3f5f2', font = theme.text, color = theme.ink}) => {
  const t = useLocal();
  const p = interpolate(t, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const v = Math.round(start + (end - start) * p);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: cover, display: 'flex', alignItems: 'center', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', fontFamily: font, fontSize: size, fontWeight: weight, color, whiteSpace: 'nowrap'}}>
      {prefix}{v.toLocaleString()}{suffix}
    </div>
  );
};

/** A soft progress sweep along a bar region (MACD plan progress). */
export const Sweep: React.FC<{x: number; y: number; w: number; h: number; from: number; to: number; color?: string}> = ({x, y, w, h, from, to, color = theme.forest}) => {
  const t = useLocal();
  const p = interpolate(t, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  return <div style={{position: 'absolute', left: x, top: y, width: w * p, height: h, background: color, borderRadius: h}} />;
};

/** Generic spring pop for a child. */
export const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number}> = ({at, children, style, from = 0.85}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < at) return null;
  const s = spring({frame: frame - Math.round(at * fps), fps, config: {damping: 14, stiffness: 160, mass: 0.7}});
  return <div style={{...style, transform: `${style?.transform ?? ''} scale(${from + (1 - from) * s})`, opacity: Math.min(1, s * 1.4)}}>{children}</div>;
};
