import { Gauge, Music2, Volume1 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { AudioEngine } from './audio/AudioEngine'
import { renderWav } from './audio/wav'
import { FreeStrip } from './components/FreeStrip'
import { Intro } from './components/Intro'
import { ModeToggle } from './components/ModeToggle'
import { MusicalGrid } from './components/MusicalGrid'
import { SequencerControls } from './components/SequencerControls'
import { Slider } from './components/Slider'
import { SongTools } from './components/SongTools'
import { SoundSelector } from './components/SoundSelector'
import { Toast } from './components/Toast'
import { usePlayer } from './hooks/usePlayer'
import { DEMOS } from './lib/demos'
import { cloneGrid, decodeGrid, emptyGrid, encodeGrid, gridIsEmpty, randomFree, randomGrid } from './lib/grid'
import { hasSavedComposition, loadComposition, saveComposition } from './lib/storage'
import {
  DEFAULT_STEPS,
  MAX_BPM,
  MIN_BPM,
  STEP_OPTIONS,
  type Cell,
  type Composition,
  type Grid,
  type Mode,
  type PresetId,
} from './lib/types'

export default function App() {
  const [engine] = useState(() => new AudioEngine())
  const [mode, setMode] = useState<Mode>('step')
  const [steps, setSteps] = useState(DEFAULT_STEPS)
  const [grid, setGrid] = useState<Grid>(() => DEMOS[0].grid())
  const [free, setFree] = useState<Cell[]>([])
  const [bpm, setBpm] = useState(DEMOS[0].bpm)
  const [preset, setPreset] = useState<PresetId>(DEMOS[0].preset)
  const [volume, setVolume] = useState(0.7)
  const [loop, setLoop] = useState(true)
  const [demo, setDemo] = useState<string | null>(DEMOS[0].id)
  const [intro, setIntro] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [saved, setSaved] = useState(hasSavedComposition)
  const [exporting, setExporting] = useState(false)

  const player = usePlayer(engine, { mode, steps, grid, free, bpm, preset, loop })
  const { status, step } = player

  useEffect(() => {
    engine.setVolume(volume)
  }, [engine, volume])
  useEffect(() => () => engine.dispose(), [engine])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(t)
  }, [toast])

  const say = useCallback((m: string) => setToast(m), [])

  // ── editing ──────────────────────────────────────────────────────────
  const setCell = useCallback(
    (row: number, col: number, on: boolean) => {
      setIntro(false)
      setDemo(null)
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

  const tapFree = useCallback(
    (row: number, col: number) => {
      setIntro(false)
      setFree((f) => [...f, { row, col }].slice(-256))
      engine.preview(row, preset)
    },
    [engine, preset],
  )

  // ── transport ────────────────────────────────────────────────────────
  const play = () => {
    setIntro(false)
    engine.ensure()
    if (!player.play()) say('Tap some squares first — or press Random')
  }

  const changeMode = (m: Mode) => {
    if (m === mode) return
    player.stop()
    setMode(m)
  }

  const clear = () => {
    if (mode === 'step') setGrid(emptyGrid())
    else setFree([])
    setDemo(null)
  }

  const random = () => {
    engine.ensure()
    setIntro(false)
    setDemo(null)
    if (mode === 'step') setGrid(randomGrid(steps))
    else setFree(randomFree())
  }

  const changePreset = (p: PresetId) => {
    setPreset(p)
    engine.ensure()
    engine.preview(2, p)
  }

  const changeSteps = (n: number) => {
    setSteps(n)
    if (step !== null && step >= n) player.stop()
  }

  // ── songs ────────────────────────────────────────────────────────────
  const apply = (c: Pick<Composition, 'mode' | 'steps' | 'bpm' | 'preset' | 'loop' | 'volume'> & { grid: Grid; free: Cell[] }) => {
    player.stop()
    setMode(c.mode)
    setSteps(c.steps)
    setGrid(c.grid)
    setFree(c.free)
    setBpm(c.bpm)
    setPreset(c.preset)
    setLoop(c.loop)
    setVolume(c.volume)
  }

  const loadDemo = (id: string) => {
    const d = DEMOS.find((x) => x.id === id)
    if (!d) return
    engine.ensure()
    setIntro(false)
    if (mode === 'free') {
      player.stop()
      setMode('step')
    }
    setSteps(16)
    setGrid(d.grid())
    setBpm(d.bpm)
    setPreset(d.preset)
    setDemo(id)
    say(`Loaded “${d.name}”`)
  }

  const save = () => {
    const ok = saveComposition({ v: 1, mode, steps, grid: encodeGrid(grid), free, bpm, preset, loop, volume })
    setSaved(ok || saved)
    say(ok ? 'Composition saved' : 'Could not save (storage unavailable)')
  }

  const load = () => {
    const c = loadComposition()
    const g = c && decodeGrid(c.grid)
    if (!c || !g) return say('Nothing saved yet')
    apply({ ...c, grid: g })
    setDemo(null)
    say('Composition loaded')
  }

  const reset = () => {
    apply({ mode: 'step', steps: DEFAULT_STEPS, grid: emptyGrid(), free: [], bpm: 120, preset: 'piano', loop: true, volume: 0.7 })
    setDemo(null)
    say('Reset to defaults')
  }

  const exportWav = async () => {
    if (mode === 'step' ? gridIsEmpty(grid, steps) : free.length === 0) return say('Nothing to export yet')
    setExporting(true)
    try {
      const blob = await renderWav({ mode, steps, grid: cloneGrid(grid), free, bpm, preset, loop }, volume)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'melody-grid.wav'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 10_000)
      say('WAV exported')
    } catch {
      say('Export failed in this browser')
    } finally {
      setExporting(false)
    }
  }

  // ── Space = Play / Pause ─────────────────────────────────────────────
  useEffect(() => {
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') && (t as HTMLInputElement).type !== 'range'
    const down = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || isField(e.target)) return
      e.preventDefault()
      if (e.repeat) return
      setIntro(false)
      engine.ensure()
      if (!player.toggle()) say('Tap some squares first — or press Random')
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isField(e.target)) e.preventDefault()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [engine, player, say])

  return (
    <>
      <div className="backdrop" />
      <main className="mx-auto min-w-0 w-full max-w-[1120px] px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-24 sm:px-6 sm:pt-8">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-[0_0_28px_-4px_rgba(168,85,247,0.9)]">
              <Music2 size={22} />
            </div>
            <div>
              <h1 className="text-xl leading-none font-bold tracking-tight sm:text-2xl">
                Melody <span className="bg-gradient-to-r from-cyan-300 via-violet-400 to-pink-400 bg-clip-text text-transparent">Grid</span>
              </h1>
              <p className="mt-1 text-xs text-white/45">
                Step sequencer · <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.65rem]">Space</kbd> play / pause
              </p>
            </div>
          </div>
          <ModeToggle mode={mode} onChange={changeMode} />
        </header>

        {intro && <Intro onClose={() => setIntro(false)} />}

        <section className="panel p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="label">{mode === 'step' ? 'Step sequencer · C4 – C5' : 'Free play · tap in any order'}</div>
            <div className="flex items-center gap-1.5" role="group" aria-label="Number of steps">
              <span className="label mr-1 hidden sm:inline">Steps</span>
              {STEP_OPTIONS.map((n) => (
                <button key={n} className={`chip !min-h-8 !px-3 font-mono${steps === n ? ' sel' : ''}`} onClick={() => changeSteps(n)} aria-pressed={steps === n}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <MusicalGrid mode={mode} steps={steps} grid={grid} free={free} step={step} onSet={setCell} onTapFree={tapFree} />
          {mode === 'free' && <FreeStrip free={free} step={step} onUndo={() => setFree((f) => f.slice(0, -1))} />}
        </section>

        <section className="panel mt-4 p-3 sm:p-4">
          <SequencerControls
            status={status}
            loop={loop}
            onPlay={play}
            onPause={player.pause}
            onStop={player.stop}
            onLoop={() => setLoop((l) => !l)}
            onClear={clear}
            onRandom={random}
          />
        </section>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
          <section className="panel space-y-3 p-4 sm:p-5">
            <Slider
              label="Tempo"
              icon={<Gauge size={14} />}
              value={bpm}
              min={MIN_BPM}
              max={MAX_BPM}
              display={`${bpm} BPM`}
              onChange={setBpm}
            />
            <Slider
              label="Volume"
              icon={<Volume1 size={14} />}
              value={Math.round(volume * 100)}
              min={0}
              max={100}
              display={`${Math.round(volume * 100)}%`}
              onChange={(v) => setVolume(v / 100)}
            />
            <div className="label pt-1">Sound</div>
            <SoundSelector value={preset} onChange={changePreset} />
          </section>

          <section className="panel p-4 sm:p-5">
            <SongTools
              activeDemo={demo}
              hasSaved={saved}
              exporting={exporting}
              onDemo={loadDemo}
              onSave={save}
              onLoad={load}
              onReset={reset}
              onExport={exportWav}
            />
          </section>
        </div>
      </main>
      <Toast message={toast} />
    </>
  )
}
