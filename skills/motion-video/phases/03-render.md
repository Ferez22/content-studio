# P3 Render
Work in remotion/ (cd remotion). Base: src/brand (theme, BrandFrame, formats, fonts), src/primitives.
1. Create src/videos/<id>/Video.tsx: React.FC<VideoProps> (src/videos/index.ts). Wrap in <BrandFrame> (mode, ratio,
   test, showSafeZones, background). Export `video: VideoEntry` (id, component, durationInFrames, fps, defaultProps): src/videos/index.ts finds it.
2. Code rules: everything from useCurrentFrame() (no CSS animation, timers, Math.random). Easing: primitives/ease
   (progress). Sizes scale with unit = min(width, height) / 1080. Layout must hold for each planned ratio.
   Reusable piece (used twice or brand-generic) -> src/primitives/, not copy-paste. Brand values via theme only.
   New font -> register in src/brand/fonts.ts (Google Fonts) or ask for the font file.
   Learned (T6 tests 2026-11-05):
   - UI/body text >= 40px at 1080 master (phone legibility); headlines 80-96px.
   - Between beats keep the frame alive: slow camera push (scale <= 1.03, small rotate), never push into text.
   - Tilted/pushed objects: keep corners inside safe zones (shrink width ~90%), measure, don't eyeball.
   - Overlays (signal arcs, highlights, cursors) render last (on top), positioned from the objects' computed coords.
   - Loops: every enter has its reverse at the end so last frame = first frame.
3. npx tsc --noEmit.
4. Stills first: npx remotion still <id> <out>/stills/f<frame>.png --frame=<n> at 8-10 frames across the timeline
   (each scene start, mid, end) + 1 still with --props='{...,"showSafeZones":true}'. Read them. Fix before full render.
5. Full render: npx remotion render <id> <campaign>/livrables/NN-motion/rendu/<id>.mp4
   Ratio variants: --props='{"ratio":"4:5","test":...,"showSafeZones":false}' -> rendu/<id>-4x5.mp4
Font fetch timeout on first render (delayRender) -> retry once; repeats -> move fonts local, tell the owner.
