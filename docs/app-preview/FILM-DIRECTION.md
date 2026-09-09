# Friendly Trader interactive product film

The requested deliverable is the marketing film inside the preview. The previous website-copy pass did not address that deliverable.

## Creative plan

A 90-second film opens on the feeling of too many market inputs, then resolves into a clear next step. The actual reconstructed app supplies product proof. The edit moves through a plan, risk, Pip, chart context, discovery, calendar, community and the two devices before inviting the viewer inside. Large, short titles carry the story without requiring narration. An original instrumental bed supplies pace. No profitability promises or invented endorsements.

Palette: forest #0b5d3f, paper #fafbf9, ink #17251e, mint #ddeade, risk #bd5151. Use the existing rounded system display and native app typography. Oversized left-aligned film titles; centered opening and closing cards. Product scenes have a live app on one side and a few words on the other. Native screens remain faithful and examples remain simulated.

```
Opening:               Product proof:             Finish:
[one huge thought]     [big benefit] [app]        [Pip + invitation]
[moving market words] [simple cue ] [app]        [explore / replay]
[      timeline and play / sound / explore controls       ]
```

The film has a timed edit, camera movement, scene cuts and an original soundtrack. Pause-and-explore transfers to the same scene's full interactive app. Resume restores the film position and scene without erasing the visitor's saved demo changes. A time scrubber, chapter selection and keyboard controls make it behave like a film player. Mobile has its own portrait composition with readable type.

## Review against the request

A larger paragraph beneath a phone is still a tool walkthrough. Replace that presentation with a dedicated cinematic stage and an actual encoded film, rather than adding more marketing copy around the old player. Keep all 14 app destinations available after entering the app; the film's edit can concentrate on its strongest product story. Make the passage from film to interactive app explicit and reversible.

## Final production

The film has 12 chapters and 21 edited shots, 90 seconds in both 1280×720 landscape and 480×800 portrait. H.264 picture and AAC 48 kHz stereo audio play as real MP4 media. The original synthesized instrumental score uses a soft keyboard motif and pads; there is no voiceover. Camera push-ins and 250ms dissolves preserve the shared edit timestamps. All on-screen data is simulated.

Rebuild after capturing updated frames with the visible browser capture view (`?film-capture=1`): verify 1280×820 or 480×900 viewport, capture the selected chapter/beat, then crop off the 100px export controls. `python3 scripts/compose-film-score.py` writes the original WAV. `python3 scripts/render-film.py portrait` and `python3 scripts/render-film.py landscape` assemble the videos. Input PNGs and `cuts.json` are retained in `docs/app-preview/film-frames/`; generated intermediate videos and WAV are ignored. The capture view is an authoring surface and never requests the finished film.
