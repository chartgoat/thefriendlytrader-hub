import React from 'react';
import {Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {theme} from '../theme';
import {has} from '../Film';
import durations from '../video-durations.json';

/** Coordinates inside a capture are in the capture's own pixels (iPhone 390x844, Mac 1440x900). */
export const PHONE = {w: 390, h: 844, radius: 32, bezel: 12};
export const MAC = {w: 1440, h: 900, radius: 14};

type Cam = {from: number; to: number; ease?: 'out' | 'inout'};
export const useCamera = (cam?: Cam) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  if (!cam) return 1;
  const e = cam.ease === 'inout' ? Easing.inOut(Easing.cubic) : Easing.out(Easing.cubic);
  return interpolate(frame, [0, durationInFrames], [cam.from, cam.to], {easing: e, extrapolateRight: 'clamp'});
};

/**
 * Screen content: a real product recording (captures/<video>.mp4, 2x pixel density) when present, otherwise the matching still.
 * `startFrom` is in seconds into the recording. When the shot outlasts the clip, the recording's own last frame
 * (captures/<video>-last.jpg, from scripts/extract-last-frames.sh) holds, so there is never a clip-edge flash.
 */
export const Screen: React.FC<{video?: string; still: string; w: number; h: number; startFrom?: number}> = ({video, still, w, h, startFrom = 0}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const style: React.CSSProperties = {position: 'absolute', left: 0, top: 0, width: w, height: h, objectFit: 'cover'};
  if (video && has(`captures/${video}.mp4`)) {
    const dur = (durations as Record<string, number>)[video] ?? 0;
    const pos = startFrom + frame / fps;
    if (dur && pos >= dur - 2 / fps && has(`captures/${video}-last.jpg`)) {
      return <Img src={staticFile(`captures/${video}-last.jpg`)} style={style} />;
    }
    return <OffthreadVideo src={staticFile(`captures/${video}.mp4`)} muted startFrom={Math.round(startFrom * fps)} style={style} />;
  }
  return <Img src={staticFile(`captures/${still}.jpg`)} style={style} />;
};

/**
 * Phone frame. `heightPx` is the rendered device height in composition pixels.
 * Children are overlays laid out in the 390x844 capture space (position absolute).
 * No status bar or island is drawn over the capture: the app header must stay readable (Codex QA note).
 */
export const Phone: React.FC<{
  capture: string;
  video?: string;
  startFrom?: number;
  heightPx: number;
  x: number; // centre x in composition px
  y: number; // centre y in composition px
  tilt?: number;
  scale?: number;
  opacity?: number;
  children?: React.ReactNode;
}> = ({capture, video, startFrom, heightPx, x, y, tilt = 0, scale = 1, opacity = 1, children}) => {
  const s = (heightPx / (PHONE.h + PHONE.bezel * 2)) * scale;
  const W = PHONE.w + PHONE.bezel * 2, H = PHONE.h + PHONE.bezel * 2;
  return (
    <div style={{position: 'absolute', left: x - (W * s) / 2, top: y - (H * s) / 2, width: W * s, height: H * s, opacity, transform: `rotate(${tilt}deg)`}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${s})`, transformOrigin: '0 0', width: W, height: H}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: PHONE.radius + PHONE.bezel, background: '#111614', boxShadow: '0 40px 90px rgba(23,37,30,0.28), 0 6px 18px rgba(23,37,30,0.18)'}} />
        <div style={{position: 'absolute', left: PHONE.bezel, top: PHONE.bezel, width: PHONE.w, height: PHONE.h, borderRadius: PHONE.radius, overflow: 'hidden', background: theme.paper}}>
          <Screen video={video} still={capture} w={PHONE.w} h={PHONE.h} startFrom={startFrom} />
          <div style={{position: 'absolute', left: 0, top: 0, width: PHONE.w, height: PHONE.h}}>{children}</div>
        </div>
      </div>
    </div>
  );
};

/** Mac window. `widthPx` is the rendered window width in composition pixels. Children in 1440x900 space. */
export const MacWindow: React.FC<{
  capture: string;
  video?: string;
  startFrom?: number;
  widthPx: number;
  x: number;
  y: number;
  opacity?: number;
  children?: React.ReactNode;
}> = ({capture, video, startFrom, widthPx, x, y, opacity = 1, children}) => {
  const s = widthPx / MAC.w;
  return (
    <div style={{position: 'absolute', left: x - (MAC.w * s) / 2, top: y - (MAC.h * s) / 2, width: MAC.w * s, height: MAC.h * s, opacity}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${s})`, transformOrigin: '0 0', width: MAC.w, height: MAC.h}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: MAC.radius, overflow: 'hidden', background: theme.paper, boxShadow: '0 40px 100px rgba(23,37,30,0.26), 0 0 0 1px rgba(23,37,30,0.12)'}}>
          <Screen video={video} still={capture} w={MAC.w} h={MAC.h} startFrom={startFrom} />
          <div style={{position: 'absolute', left: 0, top: 0, width: MAC.w, height: MAC.h}}>{children}</div>
        </div>
      </div>
    </div>
  );
};
