import type { PlaybackSettings } from '../lib/types'
import { createMasterChain, createVoice } from './voices'
import { NOTES } from './notes'
import { stepSeconds } from './Sequencer'

function encodeWav(buffer: AudioBuffer): Blob {
  const channels = buffer.numberOfChannels
  const frames = buffer.length
  const data = new DataView(new ArrayBuffer(44 + frames * channels * 2))
  const write = (o: number, s: string) => [...s].forEach((c, i) => data.setUint8(o + i, c.charCodeAt(0)))
  write(0, 'RIFF')
  data.setUint32(4, 36 + frames * channels * 2, true)
  write(8, 'WAVE')
  write(12, 'fmt ')
  data.setUint32(16, 16, true)
  data.setUint16(20, 1, true)
  data.setUint16(22, channels, true)
  data.setUint32(24, buffer.sampleRate, true)
  data.setUint32(28, buffer.sampleRate * channels * 2, true)
  data.setUint16(32, channels * 2, true)
  data.setUint16(34, 16, true)
  write(36, 'data')
  data.setUint32(40, frames * channels * 2, true)
  const chans = Array.from({ length: channels }, (_, c) => buffer.getChannelData(c))
  let o = 44
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      const v = Math.max(-1, Math.min(1, chans[c][i]))
      data.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true)
      o += 2
    }
  }
  return new Blob([data], { type: 'audio/wav' })
}

/** Renders one pass of the composition offline with the very same voices. */
export async function renderWav(s: PlaybackSettings, volume: number): Promise<Blob> {
  const len = s.mode === 'step' ? s.steps : s.free.length
  const dur = stepSeconds(s.bpm)
  const rate = 44100
  const seconds = len * dur + 2.8
  const ctx = new OfflineAudioContext(2, Math.ceil(seconds * rate), rate)
  const { input } = createMasterChain(ctx, volume)
  for (let i = 0; i < len; i++) {
    const rows = s.mode === 'step' ? s.grid.flatMap((row, r) => (row[i] ? [r] : [])) : [s.free[i].row]
    const vel = Math.min(1, 1.15 / Math.sqrt(Math.max(1, rows.length)))
    for (const r of rows) createVoice(ctx, input, s.preset, NOTES[r].freq, 0.02 + i * dur, dur * 0.92, vel)
  }
  return encodeWav(await ctx.startRendering())
}
