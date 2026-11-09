# studio-ugc-ad
Type: ad with real footage. Beat-synced cuts mixing real clips with UI and type. Prepend studio-base.
Use when: paid/boosted ad, leads, social proof. Needs owned real clips (people, product in use).
Default: 15-20 s | 9:16 (4:5 feed variant). Subtitles mandatory. A/B: 2 hooks.
Inspired by: prompt-motion.com/twoclipping-6dd14e.

~~~~text
<inputs>
Ask for: offer, one-line promise, 3-5 UI moments, accent color, 10-20 owned vertical clips, royalty-free
song with a drop (license allows commercial use), CTA, 2 hook variants for A/B.
</inputs>

<structure>
Bars at 120 BPM, 2 s each.
Bar 1: hook word by word on the beats. Bar 2: hook word morphs into the UI, cursor types and clicks.
Drop: a shape opens out of the button into the clips. Then one move per bar: a wall of clips with 3 winners
highlighted, the key result as big type, a hero clip inside a phone next to the result, big stats on push
cuts, CTA, logo, fade to black.
</structure>

<build_extra>
Clips: extract to frame sequences, swap per frame, wait for decode before each frame. Analyze the song
(tempo, beat grid, drop) and put every cut on a downbeat, every UI hit on a beat. Sound effects placed by
their measured peak. Loudness -14 LUFS. Burned-in subtitles inside safe zones.
</build_extra>

<start>
Ask for the inputs, then show the storyboard on the beat grid for both hook variants before code.
</start>
~~~~
