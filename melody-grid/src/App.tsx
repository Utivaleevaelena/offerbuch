import { useCallback, useEffect, useState } from 'react'
import { AudioEngine } from './audio/AudioEngine'
import { Intro } from './components/Intro'
import { MusicalGrid } from './components/MusicalGrid'
import { SequencerControls } from './components/SequencerControls'
import { Slider } from './components/Slider'
import { SoundSelector } from './components/SoundSelector'
import { usePlayer } from './hooks/usePlayer'
import { emptyGrid, gridFromSteps, randomGrid } from './lib/grid'
import { MAX_BPM, MIN_BPM, type Grid, type PresetId } from './lib/types'

const STEPS = 8
const VOLUME = 0.75

const starter = () => gridFromSteps(['C4 G4', 'E4', 'A4', 'E4', 'F4 C5', 'A4', 'G4 B4', 'D4'])

export default function App() {
  const [engine] = useState(() => new AudioEngine())
  const [grid, setGrid] = useState<Grid>(starter)
  const [bpm, setBpm] = useState(110)
  const [preset, setPreset] = useState<PresetId>('piano')
  const [intro, setIntro] = useState(true)

  const player = usePlayer(engine, { mode: 'step', steps: STEPS, grid, free: [], bpm, preset, loop: true })
  const { status, step } = player

  useEffect(() => {
    engine.setVolume(VOLUME)
  }, [engine])
  useEffect(() => () => engine.dispose(), [engine])

  const setCell = useCallback(
    (row: number, col: number, on: boolean) => {
      setIntro(false)
      setGrid((g) => {
        if (g[row][col] === on) return g
        const n = g.map((r) => [...r])
        n[row][col] = on
        return n
      })
      if (on) engine.preview(row, preset)
    },
    [engine, preset],
  )

  const play = () => {
    setIntro(false)
    engine.ensure()
    player.play()
  }

  const random = () => {
    engine.ensure()
    setIntro(false)
    setGrid(randomGrid(STEPS))
  }

  const changePreset = (p: PresetId) => {
    setPreset(p)
    engine.ensure()
    engine.preview(2, p)
  }

  // Space = Play / Pause
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || (e.target instanceof HTMLInputElement && e.target.type !== 'range')) return
      e.preventDefault()
      if (e.repeat) return
      setIntro(false)
      engine.ensure()
      player.toggle()
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space') e.preventDefault()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [engine, player])

  return (
    <>
      <div className="backdrop" />
      <main className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col justify-center px-4 py-8 sm:px-6">
        <h1 className="mb-4 text-center text-2xl font-bold tracking-tight text-[#5a1f3d] sm:text-3xl">Iana Utivaleeva 1b</h1>
        {intro && <Intro />}
        <section className="panel p-3 sm:p-5">
          <MusicalGrid steps={STEPS} grid={grid} step={step} onSet={setCell} />
        </section>
        <section className="mt-5 space-y-5">
          <SequencerControls
            status={status}
            onPlay={play}
            onPause={player.pause}
            onClear={() => setGrid(emptyGrid())}
            onRandom={random}
          />
          <Slider label="Tempo" value={bpm} min={MIN_BPM} max={MAX_BPM} onChange={setBpm} />
          <SoundSelector value={preset} onChange={changePreset} />
        </section>
      </main>
    </>
  )
}
