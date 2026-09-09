import timing from './narration-timing.json';
type Word = {text: string; start: number; end: number};
type Segment = {id: string; text: string; start: number; end: number; words: Word[]};
const segments = (timing as {segments: Segment[]}).segments;
export const VOICE_DURATION = (timing as {duration: number}).duration;
export const seg = (id: string): Segment => {
  const s = segments.find((x) => x.id === id);
  if (!s) throw new Error('missing narration segment ' + id);
  return s;
};
export const words = (id: string, from = 0, to?: number): Word[] => seg(id).words.slice(from, to);
/** onset of the first word in a segment whose text starts with `prefix` */
export const wordStart = (id: string, prefix: string, nth = 0): number => {
  const hits = seg(id).words.filter((w) => w.text.toLowerCase().replace(/[^a-z0-9']/g, '').startsWith(prefix.toLowerCase()));
  const w = hits[nth];
  if (!w) throw new Error(`word ${prefix} not in ${id}`);
  return w.start;
};
