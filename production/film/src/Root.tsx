import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
import {FPS, DURATION_FRAMES} from './edit';

export const Root: React.FC = () => (
  <>
    <Composition id="FriendlyTraderFilmLandscape" component={Film} durationInFrames={DURATION_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{orientation: 'landscape' as const}} />
    <Composition id="FriendlyTraderFilmPortrait" component={Film} durationInFrames={DURATION_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{orientation: 'portrait' as const}} />
  </>
);
