import type {Orientation} from './Film';

/** Where the hero phone sits per orientation. Device never below 60 percent of frame height in landscape. */
export const phoneHero = (o: Orientation, W: number, H: number, opts?: {x?: number; h?: number}) => {
  if (o === 'portrait') return {x: W / 2, y: H * 0.58, h: H * 0.66};
  return {x: W * (opts?.x ?? 0.68), y: H * 0.53, h: H * (opts?.h ?? 0.82)};
};
export const captionPos = (o: Orientation): 'left' | 'top' => (o === 'portrait' ? 'top' : 'left');
