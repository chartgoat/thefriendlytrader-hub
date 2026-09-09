import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing, OffthreadVideo, Img, Sequence, staticFile} from 'remotion';
import {theme} from '../theme';
import type {Orientation} from '../Film';
import {has} from '../Film';

/** The film's only fine print: a small chip wherever a price, size, message or outcome is on screen. */
export const Chip: React.FC<{text: string; o: Orientation; at?: number}> = ({text, o, at = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const a = interpolate(t, [at, at + 0.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fs = o === 'portrait' ? 26 : 22;
  return (
    <div style={{position: 'absolute', left: o === 'portrait' ? 72 : 120, bottom: o === 'portrait' ? 120 : 64, padding: `${fs * 0.35}px ${fs * 0.7}px`, borderRadius: 999, background: theme.mint, color: theme.forest, fontFamily: theme.text, fontWeight: 600, fontSize: fs, opacity: a, letterSpacing: '0.01em'}}>
      {text}
    </div>
  );
};

/** The app's supplied brand asset, shared with the website. */
export const BotMark: React.FC<{size: number; onCream?: boolean}> = ({size}) => (
  <Img src={staticFile('brand/app-icon.png')} width={size} height={size} />
);

const HumanVideo: React.FC<{file: string; startFrom: number; portrait: boolean}> = ({file, startFrom, portrait}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const duration = {'observer.mp4': 3.4, 'another-opinion.mp4': 86 / 30, 'reaction.mp4': 52 / 30}[file] ?? 0;
  const style: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: portrait ? '74% center' : 'center'};
  if (duration && startFrom + frame / fps >= duration - 1 / 30) {
    return <Img src={staticFile('footage/' + file.replace('.mp4', '-last.jpg'))} style={style} />;
  }
  return <OffthreadVideo src={staticFile('footage/' + file)} muted startFrom={Math.round(startFrom * fps)} style={style} />;
};

/**
 * Human b-roll (public/footage/<file>, silent clips supplied by Codex from Don't FOMO with provenance) or a labeled
 * warm placeholder when the clip is absent. `startFrom` in seconds. Clips shorter than the shot hold their last frame.
 */
export const Footage: React.FC<{file: string; label: string; scale?: number; startFrom?: number; children?: React.ReactNode; grade?: number; from?: number}> = ({file, label, scale = 1, startFrom = 0, children, grade = 1, from = 0}) => {
  const {width: W, height: H, fps} = useVideoConfig();
  // The supplied clips carry the source's small logo in the bottom right corner; scale from the upper left so it leaves the frame.
  const crop = W > H ? 1.16 : 1.0;
  const path = `footage/${file}`;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#1a2420'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${scale * crop})`, transformOrigin: '18% 22%', filter: grade === 1 ? undefined : `saturate(${grade}) brightness(${0.85 + grade * 0.15})`}}>
        {has(path) ? (
          <Sequence from={Math.round(from * fps)} layout="none"><HumanVideo file={file} startFrom={startFrom} portrait={W < H} /></Sequence>
        ) : (
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 30% 40%, #3a4a41 0%, #1a2420 60%, #101815 100%)'}}>
            <div style={{position: 'absolute', right: 40, bottom: 40, fontFamily: theme.text, fontSize: Math.round(W * 0.014), color: 'rgba(237,230,216,0.55)'}}>placeholder: {label} ({file})</div>
          </div>
        )}
      </div>
      {children}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 55%)', pointerEvents: 'none'}} />
    </div>
  );
};
