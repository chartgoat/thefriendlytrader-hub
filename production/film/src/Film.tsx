import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import available from './available.json';
import {theme} from './theme';
import {T} from './edit';
import {Hook} from './shots/Hook';
import {Noise} from './shots/Noise';
import {Turn} from './shots/Turn';
import {Plan} from './shots/Plan';
import {Size} from './shots/Size';
import {Pip} from './shots/Pip';
import {Macd, Patterns} from './shots/Checks';
import {Room} from './shots/Room';
import {Mac} from './shots/Mac';
import {Payoff} from './shots/Payoff';
import {Action} from './shots/Action';

export type Orientation = 'landscape' | 'portrait';
export const has = (p: string) => Boolean((available as Record<string, boolean>)[p]);

const order: Array<[keyof typeof T, React.FC<{o: Orientation}>]> = [
  ['hook', Hook], ['noise', Noise], ['turn', Turn], ['plan', Plan], ['size', Size], ['pip', Pip],
  ['macd', Macd], ['patterns', Patterns], ['room', Room], ['mac', Mac], ['payoff', Payoff], ['action', Action],
];

/**
 * Audio: Codex's final mix (audio/film-mix.wav) is used alone when present. Otherwise the stems are summed:
 * narration on top, music at 0.7, sfx at 1.0.
 */
const Sound: React.FC = () => {
  if (has('audio/film-mix.wav')) return <Audio src={staticFile('audio/film-mix.wav')} />;
  return (
    <>
      {has('audio/narration.wav') && <Audio src={staticFile('audio/narration.wav')} />}
      {has('audio/music.wav') && <Audio src={staticFile('audio/music.wav')} volume={0.7} />}
      {has('audio/sfx.wav') && <Audio src={staticFile('audio/sfx.wav')} />}
    </>
  );
};

export const Film: React.FC<{orientation: Orientation}> = ({orientation}) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: theme.cream, fontFamily: theme.display, overflow: 'hidden'}}>
      {order.map(([id, Shot]) => {
        const {start, end} = T[id];
        return (
          <Sequence key={id} name={id} from={Math.round(start * fps)} durationInFrames={Math.max(1, Math.round(end * fps) - Math.round(start * fps))}>
            <Shot o={orientation} />
          </Sequence>
        );
      })}
      <Sound />
    </AbsoluteFill>
  );
};
