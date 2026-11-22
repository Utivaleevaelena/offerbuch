import type { PlaybackSettings } from '../lib/types'
import type { AudioEngine } from './AudioEngine'

const LOOKAHEAD = 0.14 // seconds scheduled ahead of the audio clock
const TICK_MS = 25

interface Callbacks {
  onStep: (step: number | null) => void
  onEnded: () => void
}

interface QueueItem {
  step: number // -1 = end marker
  time: number
}

/** One step = an eighth note. */
export const stepSeconds = (bpm: number) => 60 / bpm / 2

/**
 * Lookahead scheduler: a short JS timer keeps the audio clock fed, every note is
 * placed on the AudioContext timeline (sample-accurate, independent of UI jank).
 * Settings are read live so the composition can be edited during playback.
 */
export class Sequencer {
  private timer: number | null = null
  private raf: number | null = null
  private nextStep = 0
  private nextTime = 0
  private finished = false
  private queue: QueueItem[] = []

  constructor(
    private engine: AudioEngine,
    private getSettings: () => PlaybackSettings,
    private cb: Callbacks,
  ) {}

  start(fromStep = 0): void {
    this.halt()
    const ctx = this.engine.ensure()
    this.nextStep = fromStep
    this.nextTime = ctx.currentTime + 0.06
    this.finished = false
    this.queue = []
    this.tick()
    this.timer = window.setInterval(this.tick, TICK_MS)
    this.raf = requestAnimationFrame(this.frame)
  }

  /** Pause: returns the step to resume from. */
  pause(): number {
    const now = this.engine.currentTime
    const s = this.getSettings()
    const len = s.mode === 'step' ? s.steps : s.free.length
    const pending = this.queue.find((q) => q.time > now)
    let resume = pending ? pending.step : this.nextStep
    if (resume < 0 || resume >= len) resume = 0
    this.halt()
    this.engine.cancelPending()
    return resume
  }

  stop(): void {
    this.halt()
    this.engine.silence()
    this.cb.onStep(null)
  }

  dispose(): void {
    this.halt()
  }

  private halt(): void {
    if (this.timer !== null) window.clearInterval(this.timer)
    if (this.raf !== null) cancelAnimationFrame(this.raf)
    this.timer = null
    this.raf = null
    this.queue = []
  }

  private tick = (): void => {
    if (this.finished) return
    const horizon = this.engine.currentTime + LOOKAHEAD
    while (!this.finished && this.nextTime < horizon) this.scheduleStep()
  }

  private scheduleStep(): void {
    const s = this.getSettings()
    const len = s.mode === 'step' ? s.steps : s.free.length
    if (len === 0) {
      this.queue.push({ step: -1, time: this.nextTime })
      this.finished = true
      return
    }
    if (this.nextStep >= len) this.nextStep = 0

    const dur = stepSeconds(s.bpm)
    const rows: number[] = []
    if (s.mode === 'step') {
      for (let r = 0; r < s.grid.length; r++) if (s.grid[r][this.nextStep]) rows.push(r)
    } else {
      rows.push(s.free[this.nextStep].row)
    }
    const vel = Math.min(1, 1.15 / Math.sqrt(Math.max(1, rows.length)))
    for (const r of rows) this.engine.playNote(r, s.preset, this.nextTime, dur * 0.92, vel)

    this.queue.push({ step: this.nextStep, time: this.nextTime })
    this.nextStep++
    this.nextTime += dur
    if (this.nextStep >= len) {
      if (s.loop) {
        this.nextStep = 0
      } else {
        this.queue.push({ step: -1, time: this.nextTime })
        this.finished = true
      }
    }
  }

  /** UI clock: shows a step when its sound actually reaches the speakers. */
  private frame = (): void => {
    const now = this.engine.currentTime - this.engine.latency
    while (this.queue.length && this.queue[0].time <= now) {
      const item = this.queue.shift()!
      if (item.step < 0) {
        this.halt()
        this.cb.onEnded()
        return
      }
      this.cb.onStep(item.step)
    }
    this.raf = requestAnimationFrame(this.frame)
  }
}
