import { MAX_STEPS, ROWS, type Cell, type Grid } from './types'
import { noteIndex } from '../audio/notes'

export const emptyGrid = (): Grid => Array.from({ length: ROWS }, () => Array<boolean>(MAX_STEPS).fill(false))

export const cloneGrid = (g: Grid): Grid => g.map((r) => [...r])

export const gridIsEmpty = (g: Grid, steps: number): boolean => g.every((r) => !r.slice(0, steps).some(Boolean))

/** "C4 E4 G4" per step → Grid. Empty string = rest. */
export function gridFromSteps(steps: string[]): Grid {
  const g = emptyGrid()
  steps.forEach((s, col) => {
    s.split(/\s+/)
      .filter(Boolean)
      .forEach((n) => {
        const row = noteIndex(n)
        if (row >= 0) g[row][col] = true
      })
  })
  return g
}

export const encodeGrid = (g: Grid): string[] => g.map((r) => r.map((v) => (v ? '1' : '0')).join(''))

export function decodeGrid(rows: unknown): Grid | null {
  if (!Array.isArray(rows) || rows.length !== ROWS) return null
  const g = emptyGrid()
  for (let r = 0; r < ROWS; r++) {
    const s = rows[r]
    if (typeof s !== 'string') return null
    for (let c = 0; c < Math.min(s.length, MAX_STEPS); c++) g[r][c] = s[c] === '1'
  }
  return g
}

const PENTA = [0, 1, 2, 4, 5, 7]

export function randomGrid(steps: number): Grid {
  const g = emptyGrid()
  let prev = 2
  for (let c = 0; c < steps; c++) {
    const onBeat = c % 4 === 0
    if (Math.random() < (onBeat ? 0.85 : 0.42)) {
      // random walk keeps the melody singable
      const idx = Math.max(0, Math.min(PENTA.length - 1, prev + Math.round((Math.random() - 0.5) * 4)))
      prev = idx
      g[PENTA[idx]][c] = true
      if (onBeat && Math.random() < 0.35) g[PENTA[Math.max(0, idx - 2)]][c] = true
    }
  }
  return g
}

export function randomFree(count = 12): Cell[] {
  let prev = 2
  return Array.from({ length: count }, () => {
    prev = Math.max(0, Math.min(PENTA.length - 1, prev + Math.round((Math.random() - 0.5) * 4)))
    return { row: PENTA[prev], col: Math.floor(Math.random() * 16) }
  })
}
