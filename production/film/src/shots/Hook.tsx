import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {Orientation} from '../Film';
import {Footage} from '../components/Chrome';
import {useCamera} from '../components/Devices';
import {KineticPhrases} from '../components/Caption';
import {words} from '../timing';
import {T} from '../edit';

/**
 * 0 to 3.35 s. footage/observer.mp4 (3.4 s, Don't FOMO frames 326 to 428: the observer at his desk, hand on chin, then to the keyboard).
 * No product on screen yet: the human reaction carries the opening and the app is revealed at the turn (Codex creative note).
 * Voice: "You find a stock you like. It's moving. Now what?" Reference: A+ Scalp 0 to 3 s (person plus word-by-word caption).
 */
export const Hook: React.FC<{o: Orientation}> = ({o}) => {
  const cam = useCamera({from: 1.0, to: 1.06});
  const ws = words('hook').map((w, i) => ({text: w.text, at: w.start - T.hook.start, emphasis: i === 5 || i === 9}));
  return (
    <AbsoluteFill>
      <Footage file="observer.mp4" label="observer at desk" scale={cam} />
      <KineticPhrases words={ws} o={o} pos={o === 'portrait' ? 'top' : 'left'} dark />
    </AbsoluteFill>
  );
};
