export type Mode = 'step' | 'free'
export type PresetId = 'piano' | 'synth' | 'bell' | 'retro'

export const ROWS = 8
export const STEP_OPTIONS = [8, 16, 32] as const
export const MAX_STEPS = 32
export const DEFAULT_STEPS = 16
export const MIN_BPM = 60
export const MAX_BPM = 180

/** grid[row][col]; row 0 = C4 … row 7 = C5 */
export type Grid = boolean[][]

export interface Cell {
  row: number
  col: number
}

export interface Composition {
  v: 1
  mode: Mode
  steps: number
  grid: string[]
  free: Cell[]
  bpm: number
  preset: PresetId
  loop: boolean
  volume: number
}

export interface PlaybackSettings {
  mode: Mode
  steps: number
  grid: Grid
  free: Cell[]
  bpm: number
  preset: PresetId
  loop: boolean
}
