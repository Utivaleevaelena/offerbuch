import type { PresetId } from '../lib/types'

/** A single sounding note. All envelopes start and end at 0 so there are no clicks. */
export interface Voice {
  start: number
  end: number
  out: GainNode
  sources: AudioScheduledSourceNode[]
}

export interface MasterChain {
  input: GainNode
  master: GainNode
}

export const volumeToGain = (v: number) => Math.max(0, Math.min(1, v)) ** 2

/** voices → bus → compressor (keeps chords clean) → master volume → destination */
export function createMasterChain(ctx: BaseAudioContext, volume: number): MasterChain {
  const input = ctx.createGain()
  input.gain.value = 1.5
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -16
  comp.knee.value = 22
  comp.ratio.value = 5
  comp.attack.value = 0.004
  comp.release.value = 0.2
  const master = ctx.createGain()
  master.gain.value = volumeToGain(volume)
  input.connect(comp)
  comp.connect(master)
  master.connect(ctx.destination)
  return { input, master }
}

function osc(
  ctx: BaseAudioContext,
  type: OscillatorType,
  freq: number,
  dest: AudioNode,
  gain: number,
  t0: number,
  t1: number,
  detune = 0,
): OscillatorNode {
  const o = ctx.createOscillator()
  o.type = type
  o.frequency.value = freq
  o.detune.value = detune
  const g = ctx.createGain()
  g.gain.value = gain
  o.connect(g)
  g.connect(dest)
  o.start(t0)
  o.stop(t1)
  return o
}

function lowpass(ctx: BaseAudioContext, q: number): BiquadFilterNode {
  const f = ctx.createBiquadFilter()
  f.type = 'lowpass'
  f.Q.value = q
  return f
}

type Builder = (
  ctx: BaseAudioContext,
  out: GainNode,
  f: number,
  t0: number,
  gate: number,
  vel: number,
) => { end: number; sources: AudioScheduledSourceNode[] }

/** Soft electric piano: triangle + harmonics, two-stage decay, darkening filter. */
const piano: Builder = (ctx, out, f, t0, _gate, vel) => {
  const peak = 0.3 * vel
  const end = t0 + 2.4 * Math.pow(261.63 / f, 0.35)
  const g = out.gain
  g.setValueAtTime(0, t0)
  g.linearRampToValueAtTime(peak, t0 + 0.005)
  g.exponentialRampToValueAtTime(peak * 0.38, t0 + 0.35)
  g.exponentialRampToValueAtTime(0.0001, end)
  g.setValueAtTime(0, end)
  const filt = lowpass(ctx, 0.5)
  filt.frequency.setValueAtTime(Math.min(f * 9, 10000), t0)
  filt.frequency.exponentialRampToValueAtTime(f * 2.4, t0 + 0.6)
  filt.connect(out)
  const stop = end + 0.02
  return {
    end,
    sources: [
      osc(ctx, 'triangle', f, filt, 0.5, t0, stop),
      osc(ctx, 'triangle', f, filt, 0.3, t0, stop, 6),
      osc(ctx, 'sine', f * 2, filt, 0.34, t0, stop),
      osc(ctx, 'sine', f * 3, filt, 0.14, t0, stop),
    ],
  }
}

/** Detuned saw pad with a resonant filter sweep. */
const synth: Builder = (ctx, out, f, t0, gate, vel) => {
  const peak = 0.19 * vel
  const relStart = t0 + Math.max(gate, 0.1)
  const end = relStart + 0.24
  const decayEnd = Math.min(t0 + 0.15, relStart)
  const g = out.gain
  g.setValueAtTime(0, t0)
  g.linearRampToValueAtTime(peak, t0 + 0.012)
  g.exponentialRampToValueAtTime(peak * 0.65, decayEnd)
  g.setValueAtTime(peak * 0.65, relStart)
  g.exponentialRampToValueAtTime(0.0001, end)
  g.setValueAtTime(0, end)
  const filt = lowpass(ctx, 6)
  filt.frequency.setValueAtTime(Math.min(f * 12, 7000), t0)
  filt.frequency.exponentialRampToValueAtTime(f * 2.5, t0 + 0.3)
  filt.connect(out)
  const stop = end + 0.02
  return {
    end,
    sources: [
      osc(ctx, 'sawtooth', f, filt, 0.5, t0, stop, 9),
      osc(ctx, 'sawtooth', f, filt, 0.5, t0, stop, -9),
      osc(ctx, 'triangle', f / 2, filt, 0.45, t0, stop),
    ],
  }
}

/** Inharmonic sine partials with independent decays – glassy bell. */
const bell: Builder = (ctx, out, f, t0, _gate, vel) => {
  const partials: Array<[number, number, number]> = [
    [1, 1, 2.6],
    [2, 0.42, 1.8],
    [2.76, 0.3, 1.3],
    [4.07, 0.18, 0.85],
    [5.4, 0.12, 0.55],
    [8.93, 0.05, 0.3],
  ]
  const scale = Math.pow(261.63 / f, 0.3)
  out.gain.value = 1
  const sources: AudioScheduledSourceNode[] = []
  let end = t0
  for (const [ratio, amp, decay] of partials) {
    const d = decay * scale
    const stop = t0 + d + 0.02
    end = Math.max(end, stop)
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.value = f * ratio
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(0.17 * amp * vel, t0 + 0.003)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d)
    g.gain.setValueAtTime(0, t0 + d)
    o.connect(g)
    g.connect(out)
    o.start(t0)
    o.stop(stop)
    sources.push(o)
  }
  return { end, sources }
}

/** Warm wooden mallet: soft fundamental plus a short, quickly fading overtone. */
const marimba: Builder = (ctx, out, f, t0, _gate, vel) => {
  const peak = 0.34 * vel
  const end = t0 + 1.3 * Math.pow(261.63 / f, 0.25)
  const g = out.gain
  g.setValueAtTime(0, t0)
  g.linearRampToValueAtTime(peak, t0 + 0.003)
  g.exponentialRampToValueAtTime(peak * 0.3, t0 + 0.12)
  g.exponentialRampToValueAtTime(0.0001, end)
  g.setValueAtTime(0, end)
  const filt = lowpass(ctx, 0.5)
  filt.frequency.setValueAtTime(Math.min(f * 7, 8000), t0)
  filt.frequency.exponentialRampToValueAtTime(f * 2, t0 + 0.25)
  filt.connect(out)
  const stop = end + 0.02
  // the 4th-partial "click" of a bar dies almost immediately
  const click = ctx.createGain()
  click.gain.setValueAtTime(0.35, t0)
  click.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09)
  click.gain.setValueAtTime(0, t0 + 0.09)
  click.connect(filt)
  return {
    end,
    sources: [
      osc(ctx, 'sine', f, filt, 1, t0, stop),
      osc(ctx, 'sine', f * 3.97, click, 1, t0, t0 + 0.1),
      osc(ctx, 'triangle', f * 2, filt, 0.12, t0, t0 + 0.4),
    ],
  }
}

const BUILDERS: Record<PresetId, Builder> = { piano, synth, bell, marimba }

export function createVoice(
  ctx: BaseAudioContext,
  dest: AudioNode,
  preset: PresetId,
  freq: number,
  when: number,
  gate: number,
  velocity = 1,
): Voice {
  const out = ctx.createGain()
  out.gain.value = 0
  out.connect(dest)
  const { end, sources } = BUILDERS[preset](ctx, out, freq, when, gate, velocity)
  return { start: when, end, out, sources }
}
