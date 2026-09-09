import React from 'react';
import {AbsoluteFill, useVideoConfig, interpolate, Easing} from 'remotion';
import type {Orientation} from '../Film';
import {theme} from '../theme';
import {Footage} from '../components/Chrome';
import {Phone, MacWindow} from '../components/Devices';
import {useLocal, ease} from '../components/Overlays';
import {LowerThird} from '../components/Caption';
import {Chip} from '../components/Chrome';
import {wordStart} from '../timing';
import {T} from '../edit';

/**
 * 53.51 to 60.53 s. "The market will keep moving. You'll have your plan, your tools, and somewhere to ask."
 * Opens on footage/reaction.mp4 (1.73 s, Don't FOMO frames 806 to 858: the observer leaning back with a small smile, silent), then
 * dissolves to the product payoff: three real product states fan in on the three nouns. Your plan = the A+ chart (plan.mp4 final state),
 * your tools = the Mac Stop Finder (mac.mp4), somewhere to ask = the Wins room (room.mp4 final state). No human payoff footage with old
 * captions is used (Codex decision).
 */
export const Payoff: React.FC<{o: Orientation}> = ({o}) => {
  const {width: W, height: H} = useVideoConfig();
  const t = useLocal();
  const s0 = T.payoff.start;
  const tPlan = wordStart('payoff', 'plan') - s0;
  const tTools = wordStart('payoff', 'tools') - s0;
  const tAsk = wordStart('payoff', 'ask') - s0;
  const humanEnd = 1.7;
  const toProduct = interpolate(t, [humanEnd, humanEnd + 0.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const dissolveIn = interpolate(t, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'});
  const text = t < tPlan ? '' : t < tTools ? 'Your plan.' : t < tAsk ? 'Your plan. Your tools.' : 'Your plan. Your tools.\nSomewhere to ask.';
  const portrait = o === 'portrait';
  const pop = (at: number) => ease((t - at + 0.1) / 0.6);
  const aPlan = pop(tPlan), aTools = pop(tTools), aAsk = pop(tAsk);
  return (
    <AbsoluteFill style={{background: theme.cream, opacity: dissolveIn}}>
      {toProduct < 1 && (
        <AbsoluteFill style={{opacity: 1 - toProduct}}>
          <Footage file="reaction.mp4" label="observer, small smile" scale={1 + t * 0.02} />
        </AbsoluteFill>
      )}
      {toProduct > 0 && (
        <AbsoluteFill style={{opacity: toProduct}}>
          {/* your tools: Mac Stop Finder, centre back */}
          <div style={{position: 'absolute', inset: 0, opacity: aTools, transform: `translateY(${(1 - aTools) * 40}px)`}}>
            <MacWindow capture="mac-stops" video="mac" startFrom={3.0} widthPx={portrait ? W * 0.98 : W * 0.6} x={portrait ? W * 0.5 : W * 0.6} y={portrait ? H * 0.5 : H * 0.57} />
          </div>
          {/* your plan: phone with the A+ plan, front left */}
          <div style={{position: 'absolute', inset: 0, opacity: aPlan, transform: `translateY(${(1 - aPlan) * 40}px)`}}>
            <Phone capture="ios-plan-chart" video="plan" startFrom={6.8} heightPx={portrait ? H * 0.34 : H * 0.6} x={portrait ? W * 0.24 : W * 0.3} y={portrait ? H * 0.74 : H * 0.62} tilt={-4} />
          </div>
          {/* somewhere to ask: phone with the Wins room, front right */}
          <div style={{position: 'absolute', inset: 0, opacity: aAsk, transform: `translateY(${(1 - aAsk) * 40}px)`}}>
            <Phone capture="ios-wins" video="room" startFrom={8.0} heightPx={portrait ? H * 0.34 : H * 0.6} x={portrait ? W * 0.76 : W * 0.86} y={portrait ? H * 0.74 : H * 0.62} tilt={4} />
          </div>
          <Chip text="Simulated example" o={o} at={tPlan} />
        </AbsoluteFill>
      )}
      {text && <LowerThird text={text} at={0} o={o} cps={400} dark={toProduct < 0.5} pos="top" size={portrait ? 76 : 68} />}
    </AbsoluteFill>
  );
};
