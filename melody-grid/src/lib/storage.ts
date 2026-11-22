import { decodeGrid } from './grid'
import { MAX_BPM, MAX_STEPS, MIN_BPM, type Composition } from './types'

const KEY = 'melody-grid:composition:v1'

export function saveComposition(c: Composition): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(c))
    return true
  } catch {
    return false
  }
}

export function hasSavedComposition(): boolean {
  try {
    return localStorage.getItem(KEY) !== null
  } catch {
    return false
  }
}

export function loadComposition(): Composition | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const c = JSON.parse(raw) as Partial<Composition>
    const grid = decodeGrid(c.grid)
    if (!grid || c.v !== 1) return null
    const presets = ['piano', 'synth', 'bell', 'retro']
    return {
      v: 1,
      mode: c.mode === 'free' ? 'free' : 'step',
      steps: [8, 16, 32].includes(c.steps ?? 0) ? (c.steps as number) : 16,
      grid: c.grid as string[],
      free: Array.isArray(c.free)
        ? c.free
            .filter((x) => x && Number.isInteger(x.row) && Number.isInteger(x.col) && x.row >= 0 && x.row < 8 && x.col >= 0 && x.col < MAX_STEPS)
            .slice(0, 256)
        : [],
      bpm: Math.max(MIN_BPM, Math.min(MAX_BPM, Number(c.bpm) || 120)),
      preset: presets.includes(c.preset as string) ? (c.preset as Composition['preset']) : 'piano',
      loop: c.loop !== false,
      volume: Math.max(0, Math.min(1, Number(c.volume ?? 0.7))),
    }
  } catch {
    return null
  }
}
