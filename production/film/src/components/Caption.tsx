import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate, Easing} from 'remotion';
import {theme} from '../theme';
import type {Orientation} from '../Film';

export type TimedWord = {text: string; at: number; emphasis?: boolean};

/** Layout band for captions: left column (landscape) or top band (portrait), or explicit. */
export const band = (o: Orientation, W: number, H: number, pos: 'left' | 'top' | 'center' | 'right' = 'left') => {
  if (o === 'portrait') return {left: 72, top: 150, width: W - 144, height: 320, align: 'left' as const};
  if (pos === 'top') return {left: 120, top: 90, width: W - 240, height: 200, align: 'left' as const};
  if (pos === 'center') return {left: 160, top: H / 2 - 160, width: W - 320, height: 320, align: 'center' as const};
  if (pos === 'right') return {left: W * 0.55, top: H * 0.3, width: W * 0.4, height: H * 0.4, align: 'left' as const};
  return {left: 120, top: H * 0.28, width: W * 0.42, height: H * 0.5, align: 'left' as const};
};

/**
 * KINETIC: caps, letterspaced, words pop on their voice onsets (seconds, local to the Sequence).
 * One emphasis word per line in forest green. Dark variant for human footage (cream text with an ink shadow).
 */
export const Kinetic: React.FC<{words: TimedWord[]; o: Orientation; pos?: 'left' | 'top' | 'center' | 'right'; dark?: boolean; size?: number; maxWidth?: number}> = ({words, o, pos = 'left', dark, size, maxWidth}) => {
  const frame = useCurrentFrame();
  const {fps, width: W, height: H} = useVideoConfig();
  const t = frame / fps;
  const b = band(o, W, H, pos);
  const fs = size ?? (o === 'portrait' ? 92 : 84);
  return (
    <div style={{position: 'absolute', left: b.left, top: b.top, width: maxWidth ?? b.width, display: 'flex', flexWrap: 'wrap', gap: `0 ${fs * 0.28}px`, alignContent: 'flex-start', justifyContent: b.align === 'center' ? 'center' : 'flex-start', fontFamily: theme.display, fontWeight: 800, fontSize: fs, lineHeight: 1.08, letterSpacing: '0.04em', textTransform: 'uppercase', color: dark ? theme.cream : theme.ink, textShadow: dark ? '0 4px 26px rgba(0,0,0,0.55)' : 'none'}}>
      {words.map((w, i) => {
        if (t < w.at) return null;
        const s = spring({frame: frame - Math.round(w.at * fps), fps, config: {damping: 16, stiffness: 220, mass: 0.6}});
        const color = w.emphasis ? (dark ? '#9FD9B8' : theme.forest) : undefined;
        return (
          <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - s) * 18}px) scale(${0.92 + 0.08 * s})`, opacity: Math.min(1, s * 1.5), color}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/** LOWER THIRD: sentence case, typed on at `cps` characters per second, two lines max. */
export const LowerThird: React.FC<{text: string; at: number; o: Orientation; cps?: number; dark?: boolean; pos?: 'left' | 'bottom' | 'top'; size?: number}> = ({text, at, o, cps = 40, dark, pos = 'bottom', size}) => {
  const frame = useCurrentFrame();
  const {fps, width: W, height: H} = useVideoConfig();
  const t = frame / fps;
  const n = Math.max(0, Math.min(text.length, Math.floor((t - at) * cps)));
  if (n <= 0) return null;
  const fs = size ?? (o === 'portrait' ? 74 : 64);
  const lines = text.slice(0, n).split('\n');
  const style: React.CSSProperties = o === 'portrait'
    ? {left: 72, top: pos === 'top' ? 170 : H - 520, width: W - 144}
    : pos === 'left' ? {left: 120, top: H * 0.34, width: W * 0.42} : pos === 'top' ? {left: 120, top: 64, width: W * 0.6} : {left: 120, top: H - 260, width: W * 0.6};
  return (
    <div style={{position: 'absolute', ...style, fontFamily: theme.display, fontWeight: 700, fontSize: fs, lineHeight: 1.18, color: dark ? theme.cream : theme.ink, textShadow: dark ? '0 3px 20px rgba(0,0,0,0.55)' : 'none'}}>
      {lines.map((l, i) => <div key={i}>{l}{i === lines.length - 1 && n < text.length && <span style={{display: 'inline-block', width: 3, height: fs * 0.9, background: dark ? theme.cream : theme.forest, marginLeft: 4, verticalAlign: '-0.1em'}} />}</div>)}
    </div>
  );
};

/** CARD: a single display line, centred. */
export const Card: React.FC<{text: string; at: number; o: Orientation; size?: number; color?: string; top?: number}> = ({text, at, o, size, color, top}) => {
  const frame = useCurrentFrame();
  const {fps, width: W, height: H} = useVideoConfig();
  const t = frame / fps;
  if (t < at) return null;
  const s = spring({frame: frame - Math.round(at * fps), fps, config: {damping: 18, stiffness: 120}});
  const fs = size ?? (o === 'portrait' ? 120 : 132);
  const scale = interpolate(s, [0, 1], [0.96, 1], {easing: Easing.linear});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: top ?? H * 0.3, textAlign: 'center', fontFamily: theme.display, fontWeight: 800, fontSize: fs, letterSpacing: '-0.01em', color: color ?? theme.ink, transform: `scale(${scale})`, opacity: Math.min(1, s * 1.3), padding: `0 ${W * 0.06}px`}}>
      {text}
    </div>
  );
};

/**
 * KINETIC by phrase: the voice segment is split into short spoken groups (about 3 to 6 words, breaking on punctuation and commas,
 * never longer than `maxWords`). Only the group being spoken is on screen; it is cleared at the next group's onset.
 * Reference: A+ Scalp and Screener captions, which show a phrase at a time, never an accumulated paragraph.
 */
export const KineticPhrases: React.FC<{words: TimedWord[]; o: Orientation; pos?: 'left' | 'top' | 'center' | 'right'; dark?: boolean; size?: number; maxWidth?: number; maxWords?: number; phraseStarts?: number[]}> = ({words, maxWords = 6, phraseStarts, ...rest}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const groups: TimedWord[][] = [[]];
  for (const w of words) {
    const g = groups[groups.length - 1];
    g.push(w);
    const punct = /[.?!,]$/.test(w.text);
    if ((punct && g.length >= 2) || g.length >= maxWords) groups.push([]);
  }
  // merge a trailing one-word group into the previous group so a lone word never sits alone
  const merged: TimedWord[][] = [];
  for (const g of groups) {
    if (!g.length) continue;
    if (g.length === 1 && merged.length && merged[merged.length - 1].length < maxWords) merged[merged.length - 1].push(g[0]);
    else merged.push(g);
  }
  const phrases = phraseStarts ? phraseStarts.map((start, i) => words.slice(start, phraseStarts[i + 1])) : merged;
  const live = phrases.filter((g) => g.length && g[0].at <= t);
  const current = live[live.length - 1];
  if (!current) return null;
  return <Kinetic words={current} {...rest} />;
};
export const KineticSentences = KineticPhrases;
