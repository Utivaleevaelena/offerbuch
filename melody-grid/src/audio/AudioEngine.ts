import type { PresetId } from '../lib/types'
import { NOTES } from './notes'
import { createMasterChain, createVoice, volumeToGain, type MasterChain, type Voice } from './voices'

type AudioCtor = typeof AudioContext

/**
 * Owns the single AudioContext of the app. The context is created lazily inside a
 * user gesture (required by mobile browsers) and closed in dispose() – no leaks.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null
  private chain: MasterChain | null = null
  private voices = new Set<Voice>()
  private volume = 0.7

  /** Create / resume the context. Must be called from a user gesture the first time. */
  ensure(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const Ctor: AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: AudioCtor }).webkitAudioContext
      this.ctx = new Ctor({ latencyHint: 'interactive' })
      this.chain = createMasterChain(this.ctx, this.volume)
      try {
        // iOS: keep sound audible even when the silent switch is on
        const nav = navigator as unknown as { audioSession?: { type: string } }
        if (nav.audioSession) nav.audioSession.type = 'playback'
      } catch {
        /* not supported */
      }
      // silent buffer unlocks audio on older iOS
      const buf = this.ctx.createBuffer(1, 1, 22050)
      const src = this.ctx.createBufferSource()
      src.buffer = buf
      src.connect(this.ctx.destination)
      src.start(0)
    }
    if (this.ctx.state !== 'running') void this.ctx.resume().catch(() => undefined)
    return this.ctx
  }

  get currentTime(): number {
    return this.ctx?.currentTime ?? 0
  }

  /** Time between a note being scheduled and it reaching the speakers. */
  get latency(): number {
    const c = this.ctx
    if (!c) return 0
    return (c.outputLatency || 0) + (c.baseLatency || 0)
  }

  setVolume(v: number): void {
    this.volume = v
    if (this.ctx && this.chain) {
      this.chain.master.gain.setTargetAtTime(volumeToGain(v), this.ctx.currentTime, 0.02)
    }
  }

  getVolume(): number {
    return this.volume
  }

  playNote(row: number, preset: PresetId, when: number, gate: number, velocity = 1): void {
    const ctx = this.ensure()
    if (!this.chain) return
    const voice = createVoice(ctx, this.chain.input, preset, NOTES[row].freq, Math.max(when, ctx.currentTime), gate, velocity)
    this.voices.add(voice)
    const last = voice.sources[voice.sources.length - 1]
    last.onended = () => {
      this.voices.delete(voice)
      voice.out.disconnect()
    }
  }

  /** Immediate sound for a tap/click. */
  preview(row: number, preset: PresetId): void {
    const ctx = this.ensure()
    this.playNote(row, preset, ctx.currentTime + 0.003, 0.4, 1)
  }

  /** Cancel notes that are scheduled but have not started yet (used by Pause). */
  cancelPending(): void {
    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime
    for (const v of this.voices) {
      if (v.start > now) this.kill(v, now)
    }
  }

  /** Fade out every sounding note quickly (used by Stop) – no clicks. */
  silence(): void {
    const ctx = this.ctx
    if (!ctx) return
    const now = ctx.currentTime
    for (const v of this.voices) this.kill(v, now)
  }

  private kill(v: Voice, now: number): void {
    v.out.gain.cancelScheduledValues(now)
    v.out.gain.setTargetAtTime(0, now, 0.012)
    for (const s of v.sources) {
      try {
        s.stop(now + 0.09)
      } catch {
        /* already stopped */
      }
    }
  }

  dispose(): void {
    const ctx = this.ctx
    this.voices.clear()
    this.chain = null
    this.ctx = null
    if (ctx && ctx.state !== 'closed') void ctx.close().catch(() => undefined)
  }
}
