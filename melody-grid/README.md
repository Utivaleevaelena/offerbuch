# Melody Grid

A neon step sequencer in the browser. React + TypeScript + Vite + Tailwind CSS v4 + Web Audio API + lucide-react. No backend, no keys.

```bash
npm install
npm run dev      # local dev
npm run build    # type-check + production build into dist/
```

## Features
- 16×8 step sequencer (8/16/32 steps), notes C4–C5, chords, loop, live editing while playing
- Free Play mode: your tap order is recorded and played back in that order
- 4 synthesized sounds (Piano-like, Synth, Bell, Retro), tempo 60–180, volume
- Play / Pause / Stop / Loop / Clear / Random / Reset, Space = Play/Pause
- Save/Load (localStorage), 5 demo melodies, WAV export (offline render)

## Structure
- `src/audio/` – `AudioEngine` (single AudioContext, master compressor, safe stop), `voices` (synth presets), `Sequencer` (lookahead scheduler), `wav`
- `src/components/` – `MusicalGrid`, `SequencerControls`, `SoundSelector`, `ModeToggle`, `SongTools`, …
- `src/hooks/usePlayer.ts` – transport state

## Deploy to Vercel
Import the repo, set **Root Directory** to `melody-grid` (framework: Vite, build `npm run build`, output `dist`; see `vercel.json`).
