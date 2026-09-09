# Fable reference study: the seven SWJ promo videos

Author: Fable 5.1. Date: 2026-09-09. Sources: the seven originals in `references/` (SHA-256 in `analysis/source-manifest.json`).

## Coverage and limitations (read this first)

What I actually did, per video, on this MacBook, with no remote model calls:

- Picture: a timestamped contact sheet at exactly 1 frame per second for the full duration of all seven (every second of every video was looked at). 10 fps strips of the first 4 seconds of all seven (hook mechanics). 5 fps strips of three key turns (No Stink 20 to 26 s, 2K to 10K 41 to 47 s, Screener 72 to 78 s). Two frame-exact 30 fps windows from Codex's every-frame sheets (Don't FOMO 52.0 to 53.97 s, A+ Scalp 34.0 to 35.97 s). Scene-cut detection at threshold 0.3 on all seven for shot counts and average shot length.
- Sound: full local speech-to-text of all seven with faster-whisper (small model, VAD on), read end to end. Integrated loudness, loudness range and true peak for all seven. Per-second momentary loudness curves for all seven, used to locate music entrances, drops and silences.
- Codex's layer: I read the Gemini audio ledgers for all seven and the Gemini audiovisual review for 2K to 10K. I did not re-run any model review.

What I did not do: I did not personally inspect all 12,882 frames one by one. Frame-exact claims below are limited to the two 30 fps windows and the 5 and 10 fps strips named above. Everything else is at 1 s resolution. I cannot hear; the transcript plus loudness curves plus Codex's listening ledger together stand in for listening, and I say so where it matters.

Conversion performance is unknown for all seven. Everything below is observed craft.

## Measurements

| Reference | Length | Frame | Cuts (0.3) | Avg shot | Integrated | LRA | Voice |
|---|---|---|---|---|---|---|---|
| 2K to 10K Challenge NEW | 50.9 s | 1920x1080 | 22 | 2.2 s | -15.1 LUFS | 9.7 | actors + narrator |
| 4th of July Promo | 57.7 s | 2560x1440 | 12 | 4.4 s | -17.3 LUFS | 9.0 | Josh on camera |
| A+ Scalp Levels Promo | 78.1 s | 2560x1440 | 4 | 15.6 s (continuous motion graphics) | -15.8 LUFS | 1.9 | Josh voiceover |
| Don't FOMO | 63.7 s | 3840x2160 | 15 | 4.0 s | -17.1 LUFS | 9.2 | Josh live audio + narrator |
| New Marketing Video Sept 8th | 48.3 s | 1920x1080 | 5 | 8.0 s (continuous 3D) | -16.1 LUFS | 4.7 | Josh voiceover |
| No Stink Non Copywright Music | 47.8 s | 3840x2160 | 16 | 2.8 s | -15.5 LUFS | 15.1 | actors + live audio + narrator |
| Stock Screener (Cryptocrew) Gambling | 83.0 s | 2560x1440 | 11 | 6.9 s | -11.4 LUFS | 2.3 | Josh voiceover, Josh on camera |

The old Friendly Trader site film for comparison: 90 s, 21 shots, 4.3 s average, -21.4 dB mean, no voice, no product events.

## Per-reference notes (timestamps)

### 1. 2K to 10K Challenge NEW (50.9 s)

- 0.0 to 1.8: young driver in a red polo holds a phone showing "Stocks With Josh 10K Challenge" on gold-on-black. Quiet car interior (momentary loudness around -42 LUFS). Line: "Man, what would I even do with ten thousand dollars?"
- 1.8 to 5.8: passenger at the window, "I'm visiting my grandma, you?" "Business meeting." Loudness jumps to -18 with a door slam and an EDM bed at 2 s (Codex ledger agrees).
- 6 to 24: daydream montage at 2 s per shot: crowd-surfing at a concert (6 to 8), first class beside an elderly couple (9 to 12), rooftop dinner (13 to 18), pool with a leather menu (19 to 22), then the snap back to a beige sedan in a driveway (23 to 24) with the music dropping to near silence (-40 to -50 LUFS at 24 to 27 s).
- 25 to 28: back in the car with the phone. 29 to 30: title "Every Great Trader Starts Somewhere" over a man at a desk, music returns hard at -12 LUFS.
- 31 to 35: laptop shows a countdown (13:19:54:27) and "$2,000 to $10,000"; title cards "The 10K Challenge $2,000 / $6,726 / $10,000" over a dark gold trade log.
- 36 to 39: options trade log rows with green WIN percentages (BABA CALL, UBER PUT, IREN, CEG, PFE).
- 40 to 41: "If We Don't Hit $10,000 You Get Refunded". 42 to 43: the desk guy spins to camera, huge grin, "Wait, what?" The music ducks for the reaction (Codex ledger: drop to near silence for the line). 44 to 45: "Yep. But Only if We Don't Hit Our Goal." 46 to 47: him again, "Yeah, that makes sense." 48 to 50: "Sign Up Today, click the link below" with a down arrow.
- Craft: the only reference with a real story shape (want, fantasy, reality, offer, objection, answer, action). The comedic objection at 42 s is the best-timed beat in all seven. Palette gold on black. Faces look synthesized or stock; the desk actor recurs, which sells continuity.
- Claims: the refund guarantee and the $2K to $10K target are offer claims we will not reuse.

### 2. 4th of July Promo (57.7 s)

- 0 to 3: Josh on camera, blue shirt, mic, gold "STOCKS WITH JOSH" backdrop; bold stacked captions "TRADE ALONGSIDE ME FOR FREE" appear word-group by word-group. Line: "For a full week, you get to trade alongside me for free."
- 3 to 5: "Our Biggest Promotion Ever" card beside Josh. 6 to 7: dark tool-tier collage (phone mockups). 8 to 11: Discord screenshots with "+47.33%" and "+$1,618.61" and a coin mascot.
- 12 to 17: tool cards with gold highlight boxes: "Custom TradingView Indicators", "The Friendly Screener", "The Friendly Options Tool", "The Discord Trade Tracker". 18 to 19: "You get" checklist. 20 to 23: Josh again.
- 24 to 27: "Tools Others Charge Hundreds For $48 / $199 / $300+" in red. 28 to 32: fireworks, "4th of July Promotion", "Filling Up Fast" over a grid of gold spots. 33 to 35: "Join the Waitlist". 36 to 39: calendar "7 Days On the House". 40 to 42: "$79.99 per month". 43 to 45: "Waitlist Closes July 4, 12 AM". 46 to 47: Josh. 48 to 54: Discord testimonials ("+110.76%", "+$368.69", "Best discord out there"). 55 to 57: "Limited Spots, link below".
- Craft: Josh's direct address is the trust device; every card has one gold or red emphasis word; the whole thing is a value ladder. Music is a constant synth bed at -16 to -18 with no drops (curve is flat), which is why it feels like an infomercial compared with 2K.
- Claims: percentages, dollar figures, pricing and the free week are legacy offer claims. Not for the app film.

### 3. A+ Scalp Levels Promo (78.1 s)

- 0.0 to 2.7 (10 fps strip): hands on a keyboard in front of charts; caps caption builds word by word: "HOW" (0.0), "HOW MANY" (0.3), "HOW MANY TIMES" (0.5), "HOW MANY TIMES HAS THIS" (0.9), then "HAPPENED" (1.1), "YOU TAKE A TRADE" (1.9 to 2.4). 2.7: cut to a man's face lit by monitors. Josh VO: "How many times has this happened? You take a trade, you feel good about it, and then the chart immediately rips the other way."
- 5 to 7: his face turns red-lit on "rips the other way". 8 to 12: a schematic chart animates: "CHOPS SIDEWAYS", "FAKES YOU OUT" with a red "STOPPED OUT" tag, "SHAKES YOU OUT OF YOUR POSITION". 13 to 14: the chart runs up "+36%", "+47%" after "YOU CLOSE". 15 to 16: a man alone at a desk at night, "GUESS WHAT? WE'VE ALL BEEN THERE" (empathy line, the exact "we" turn).
- 17 to 26: "KEY LEVEL", "GATEKEEPER", "TRIGGER" drawn as neon lines on a schematic with "+18%", "+47%" tags; "EITHER UP OR DOWN" in green and red. 27 to 29: a man with his head in his hands at a laptop, "AND IF YOU'RE NOT SURE WHERE IT IS".
- 30 to 33: "THE STOCKS WITH JOSH A+ SCALP INDICATOR" over neon candles with green and red price rails.
- 34.0 to 36.0 (30 fps window): pure black, a single green horizontal line draws in from the left (34.13 to 34.40), a small green candle rises from the line (34.47 to 34.80), particles burst at 34.80, a price tag slides out to the right "256.49" (34.93 to 35.30), the word "BREAKOUT" resolves under the candle at 35.60. One product event, 60 frames, every element arriving in sequence. Then "BREAKDOWN 254.37" red (36), "REJECTION 256.10" red (37), "BOUNCE 254.60" green (38).
- 40 to 41: "MARKET LEADERS" grid of tickers with logos. 42 to 50: the real-looking chart draws "BREAKOUT CONFIRMATION" then T1, T2, T3 "TARGETS" labels appear as the candle climbs (45 to 50). 51 to 55: a percent counter rolls "+0.0%" to "+6.0%" along a rising candle path with "TP1/TP2/TP3" rails: "SO YOU LOCK IN WINS".
- 56 to 60: S&P 500, Meta, Google, Microsoft, Apple logos beside mini charts. 61 to 63: Discord screenshots, "IT COMES INCLUDED IN YOUR STOCKS WITH JOSH DISCORD MEMBERSHIP". 64 to 70: Discord UI, "LIVE TRADING", "SESSIONS", "ALERTS", a Zoom tile. 71 to 72: a close eye with "A+ SCALP SETUPS". 73: "JOIN THE PROCESS". 74 to 77: "TTL Trust The Level / TTT Take The Trade", "LINK BELOW".
- Music: a constant synth bed at -15 to -17, LRA 1.9, one of the flattest curves. The energy comes from picture and caption rhythm, not from the mix.
- Craft: the strongest hook in the set (second person, a specific painful memory, captions synced to speech), the strongest product event (34 to 36 s), and a clear proof grammar: claim, then the picture draws the claim. Also the clearest example of the "empathy mirror then we" turn at 15 to 16 s.
- Claims: the percent gains on the schematic are illustrative but presented as outcomes. Not for the app film.

### 4. Don't FOMO (63.7 s)

- 0.0 to 2.7 (10 fps strip): black card, gold SWJ logo, a red "LIVE" pill glitches in at 0.2 to 0.6, "Wed. March 18th Trade Session", and a tiny "Actual footage" label at the bottom. 2.7: dissolve to a man in a warm home study at a monitor, arrow label "Non-Discord Member" in the top right corner.
- 3 to 7: he watches, hand on chin. 8 to 10: real live-session screen recording of a chart with a Discord message card "@RayMarx0831: 50% on Spy... Lot of patience Josh". Josh's live audio: "I just wanted to shout out a couple of wins from the Discord this morning." The non-member's inner voice (a second actor track) cuts in: "What could I possibly be missing?"
- 11 to 13: him again. 14 to 15: "@charlesrobinson3237... $1k on SPY put alone. I'm OUT!!!" 16 to 18: him. 19 to 21: "@richardroberts818, 72% on 80 contracts". 22 to 26: "@chikeegwuatu, 60% on 100 contracts". 27 to 28: him smiling, then "This has gotta be AI, right?" 29 to 36: "@Ntrade2, took spx at 14.00 sold around 31.00... 17k total profit for the day". 37 to 38: he leans back, head back. 39 to 40: "@Success1000xx, Sold at 50%" and Josh: "I'm not gonna, I'm not gonna FOMO." 41 to 44: "@sarakass1503 Took 20%", "@ambroseg.asante5275 22% on SPY puts". 45 to 46: arms crossed. 47 to 48: "@tomsnitchler8886, 26% spy put I paid with my nerves". 49 to 51: he sits up, smiles, "I'm signing up."
- 52.0 to 53.97 (30 fps window): "Hate FOMO?" is already on screen over him at 52.00; hard cut to the Friendly Stock Screener UI at 52.83 (frame 1585) with "Hate FOMO?" persisting; "So do we." types on letter by letter from 53.20 to 53.47 (frames 1596 to 1604). A typed-on second line, timed to the narrator.
- 54 to 60: "That's why we made The Friendly Stock Screener, Only in the Stocks With Josh Discord" as a two-line white lower third over the screener and him. 61 to 63: black card "Don't FOMO / Join Now" with a down arrow. 62: a member voice, "Oh, that's cool."
- Sound: no music at all until the solution. Codex's ledger and my curve agree: the first 52 s are raw live-session audio and typing; a clean synth bed enters with the narrator at 52 s and lifts the mood. The hook's silence is the device.
- Craft: the observer character is the viewer's surrogate; envy escalates through nine receipts in members' own words; the product is presented as the cure for a feeling, not as a feature list; the label "Actual footage" and "Non-Discord Member" are honest and funny at once.
- Claims: every receipt is a member profit claim. Structure yes, numbers no.

### 5. New Marketing Video Sept 8th (48.3 s)

- 0 to 2: 3D gold SWJ badge on black. 2 to 4: "The Indicators Josh Uses Every Day" over a dark chart. 5 to 9: neon candles with green and red price rails, "GOAT Scalp Levels, every morning". 10 to 12: chrome text "Updates every morning on TradingView" flying through.
- 13 to 16: a glass 3D ramp labelled "ENTRY, TAKE PROFIT, CUT LOSS" (the exact three decisions the VO names at 11 to 17 s).
- 17 to 19: "A+ Dashboard, checks five things" glass panel. 20 to 25: the checklist ticks one row per beat: OPENING RANGE (20), 9 EMA (21), VWAP, RSI, DAILY TREND (22 to 23), all five checked by 24, held to 25, exactly as the VO lists them.
- 26 to 29: "How Much Confirmation Your Trade Actually Has" with an A+ shield and three check marks. 30 to 33: two glass cubes "FRIENDLY TOOLS" and "TRADER TIER". 34 to 36: a grid of team headshots with weekday tabs (the "11 live sessions every week"). 37 to 40: "See What Josh Sees Before He Takes A Trade" over a man at monitors, then a man on a street. 41 to 43: "Link In The Description", "Join Us Today". 44 to 47: gold SWJ end card, "LINK IN DESCRIPTION" with an arrow.
- Craft: the product's logic is dramatised as a checklist that ticks in time with the voice. Premium glass 3D, one continuous motion world, few hard cuts. Voice is calm against energetic picture (Codex ledger notes the same contrast).
- Claims: none beyond tier names and session counts. The "before he takes a trade" open loop is the line I want to echo.

### 6. No Stink Non Copywright Music (47.8 s)

- 0 to 2.7: black card, "Based on a true story". 2.8 to 5: three construction workers walking on a site. 6 to 8: a Discord push notification mockup "Stocks With Josh LIVE TRADING SESSION, The markets are opening, Josh is live now! discord.gg/stockswithjosh" at 9:30 AM. 9 to 12: one worker peels off and jogs away; the others look. Live audio: "What is it?" "Hold on." "It's like clockwork."
- 13 to 17: the worker sits inside a portable toilet with his phone; Josh's live audio: "Good morning everybody. 9:30 a.m. Let's go!" then "22% on that one. Yes!"
- 18 to 20: the toilet from outside, the other two workers waiting. 21 to 25 (5 fps strip): the two co-workers look at each other (20.8 to 22.8), cut to the toilet wide at 23.2 and the caption types on "Want Live Trading Sessions that don't stink?" from 23.2 to 23.8. Narrator enters here. 27 to 31: a third worker, arms akimbo, laughing.
- 32 to 37: the team headshot grid with "LIVE TRADING SESSIONS EVERY WEEKDAY, MORNING SESSIONS, POWER HOUR" typed over it. 38 to 41: the worker steps out, grinning, "No Nonsense", "No Stink". 42 to 45: gold SWJ badge on a boardroom table over a skyline, "Learn to earn, and take your place on the Wall Street". 46 to 47: "Join Today, Link Below".
- Sound: quiet ambience for the first 15 s (curve -59 to -20), live audio at 13 to 20, a loud spike at 21 to 22 (-11.6) which is the narrator's entrance with music, then a steady bed. LRA 15.1, the widest dynamic range in the set.
- Craft: a joke that lands with the working-class audience, a real 9:30 ritual, members shown as people with jobs, and the honest "Based on a true story" label. The title line is the product name and the joke at once.
- Claims: "22% on that one" is a live result in the audio. Not for the app film.

### 7. Stock Screener (Cryptocrew) Gambling (83.0 s)

- 0.0 to 4.0 (10 fps strip): a wall of grey person icons, a white card flies in, "95%" appears at 0.5, a white flash at 1.2, "LOSE MONEY" in red 3D at 1.9 over a red-lit crowd, "ONLY 5%" in gold at 3.7. Loudest video in the set (-11.4 integrated, -9 in the first second).
- 5 to 9: stock traders at monitors, captions "ARE CONSISTENTLY... WITHOUT A... YOU'RE NOT". 10 to 11: a crossed-out chart and dice, "GAMBLING" stamped in red. 12 to 18: donut charts "40% QUIT BY MONTH 1", "80% GONE BY YEAR 2". 19 to 20: "THIS IS NOT INVESTING" with a no-symbol. 21 to 26: ticker tape and a man at night, "YOU'RE MORE LIKELY TO LOSE MONEY".
- 27 to 31: split card "MORE TRADES" (red explosion, X) versus "RIGHT TRADES" (green curve, check). 32 to 41: a man at a monitor wall; "THEN YOU MIGHT AS WELL BE DOING THIS" with a slot machine graphic and losing figures ("-$1,250"). 42 to 51: a woman at a desk, "SO YOU KNOW WHETHER THE BULLISH OR BEARISH BUCKET, WITHOUT NEEDING A MASTER'S DEGREE IN INDICATORS".
- 52 to 57: Josh, arms crossed, composited into a gold neon set with the Friendly Screener UI behind him: "EXACTLY WHY I MADE THE FRIENDLY STOCK SCREENER". 58 to 59: his YouTube thumbnails grid. 60 to 63: the real screener UI with arrow callouts "NEW ANALYZE TICKER". 64 to 72: "BUILT ON MY LOGIC, MY TECHNICALS, PROFESSIONAL STRATEGIES" beside a purple-accent screener report, "ANY STOCK ANYTIME ANYWHERE".
- 72 to 78 (5 fps strip): the screener UI fades at 73.0, a casino wide shot with a man in a sequined jacket at a slot machine at 73.4, "STOP" (73.6) then "STOP GAMBLING" (74.0 to 75.4) over him, hard cut to a navy card "Screen Your Risk." (75.6) then "Find Your Wins." (76.6), each with a coloured emphasis word (orange, green). 78 to 82: gold SWJ product box "The Friendly Stock Screener", "Clarity Over Activity", "Link Below".
- Craft: fear statistics as a hook, a dark to bright musical turn at the solution (Codex ledger; my curve is flat because it is compressed hard), the product shown as a real UI with callouts, and a two-line slogan with one emphasis word each. Josh appears late as the author of the solution.
- Claims: the statistics are unsourced on screen. The screener is the legacy web tool, not the app.

## What the seven have in common (observed)

1. A voice from the first second. Six of seven have narration or dialogue inside the first two seconds. The exception (Sept 8) is Josh's VO at 0.1 s. Silence is used only as a device (Don't FOMO's raw audio, No Stink's ambience, 2K's reality snap), never as a default.
2. A human in the frame early. Five of seven show a person's face before 3 s (2K, July 4, A+, FOMO, No Stink). Two open on graphics (Sept 8 logo, Screener statistic).
3. Large words on screen, always. Three caption grammars: kinetic caps word-by-word synced to the voice (A+, Screener), typed-on sentence lower thirds (FOMO, No Stink), and title cards with one gold or coloured emphasis word (2K, July 4, Sept 8, Screener end). Nothing is small and nothing is a paragraph.
4. The product performs a claim. Sept 8 ticks five checks as the voice lists them. A+ draws breakout, tags, targets and a counter. Screener shows the real UI with arrow callouts. The claim and the picture are the same sentence.
5. Receipts at the moment of claim. FOMO's nine Discord cards, July 4's screenshots, 2K's trade log, A+'s counters. They are the emotional climax in four of seven. The numbers are the part we cannot reuse; the timing is the part we can.
6. The empathy turn. A+ at 15 s ("Guess what? We've all been there"), Screener at 38 s ("But what if I told you"), FOMO at 52 s ("Hate FOMO? So do we"), 2K at 29 s ("Every great trader starts somewhere"). Each video has one sentence where the brand steps beside the viewer, and the music changes at that sentence.
7. Humor through a sketch. 2K, No Stink and FOMO are sketches with a surrogate character. They are the three that feel most like SWJ and least like a stock promo.
8. One slogan, one action, an arrow. Every ending: a short line ("Clarity over activity", "Trust the level, take the trade", "Don't FOMO, join now", "Learn to earn", "See what Josh sees before he takes a trade"), then "Link below" or "Join today", 3 to 6 s, gold logo.
9. Loudness -15 to -17 LUFS integrated with the voice on top and the bed ducked (Screener runs hot at -11.4). All beds are upbeat electronic. The old site film at -21 with no voice is quiet and empty by comparison.
10. Josh is the trust device, in three ways: on camera (July 4, Screener), as voice (A+, Sept 8, Screener), and as live audio over his own chart (FOMO, No Stink). Real Josh footage exists in the set; synthetic Josh is not needed and not allowed.

## What to adopt for the Friendly Trader film and what to leave

Adopt:
- A second-person problem hook with a human and a voice inside 2 s, captions built word by word to the voice (A+ 0 to 3 s).
- A surrogate character the beginner recognises (FOMO's non-member, 2K's driver, No Stink's worker), played warm, not mocked.
- Product events timed to the claim (Sept 8's checklist, A+'s tags and targets).
- The empathy turn with a music change (A+ 15 s, FOMO 52 s).
- Receipts at the climax, in the app's Wins room, in members' own words, with the numbers replaced by plans followed and stops honoured, and labelled simulated.
- Typed-on two-line lower thirds for the turn and the payoff (FOMO 52 to 54 s).
- A short slogan, one action, an arrow, 4 to 6 s.
- A dry honesty label in the corner where it is true ("Simulated example"), in the spirit of "Actual footage" and "Based on a true story".
- Loudness -16 LUFS, voice on top, bed ducked, at least one true drop.

Leave:
- Gold on black. The app's brand is the icon: forest green on cream. The film should feel like SWJ in rhythm and humour, and like Friendly Trader in colour and type.
- Profit percentages, dollar receipts, refund guarantees, quit statistics, tier pricing, free weeks.
- Fear as the primary hook (Screener). The app's audience is beginners who freeze; the hook should be recognition, not shame.
- Synthetic people in the uncanny range. If a surrogate character is used, it should be licensed real footage or a real shoot.

## Real Josh footage available in the set (for Codex and the owner)

- Don't FOMO 8 to 48 s: real live-session screen recordings of Josh's chart with member messages, labelled "Actual footage". Usable as a 2 to 3 s "live session" insert if the member messages are cropped out or replaced, and if the owner agrees the clip does not imply the legacy Discord offer.
- 4th of July 0 to 5, 20 to 23, 46 to 47 s: Josh on camera in the gold SWJ set. Off-palette for the app and tied to a legacy promotion. Not recommended.
- Screener 52 to 57 s: Josh composited on a gold set. Same issue. Not recommended.
- Live audio of Josh (No Stink 15 to 19 s, FOMO throughout) is real and could be used under a live-session beat with the results lines removed. Owner call.
