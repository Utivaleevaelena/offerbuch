import { Fragment, memo, useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from 'react'
import { NOTES } from '../audio/notes'
import { ROWS, type Grid } from '../lib/types'

interface Props {
  steps: number
  grid: Grid
  step: number | null
  onSet: (row: number, col: number, on: boolean) => void
}

interface CellProps {
  row: number
  col: number
  on: boolean
  beat: boolean
  colCur: boolean
  hit: boolean
}

const GridCell = memo(function GridCell({ row, col, on, beat, colCur, hit }: CellProps) {
  const note = NOTES[row]
  return (
    <button
      type="button"
      tabIndex={-1}
      data-row={row}
      data-col={col}
      aria-pressed={on}
      aria-label={`${note.name}, step ${col + 1}`}
      className={`cell${on ? ' on' : ''}${beat ? ' beat' : ''}${colCur ? ' col-cur' : ''}${hit ? ' hit' : ''}`}
      style={{ '--h': note.hue } as CSSProperties}
    >
      {on && <span className="face" />}
    </button>
  )
})

const cellAt = (x: number, y: number): { row: number; col: number } | null => {
  const el = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>('[data-row]')
  return el ? { row: Number(el.dataset.row), col: Number(el.dataset.col) } : null
}

export function MusicalGrid({ steps, grid, step, onSet }: Props) {
  const painting = useRef<{ value: boolean; last: string } | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const flashTimer = useRef<number | undefined>(undefined)
  const gridRef = useRef(grid)
  useEffect(() => {
    gridRef.current = grid
  })

  const doFlash = useCallback((row: number, col: number) => {
    setFlash(`${row}:${col}`)
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlash(null), 330)
  }, [])
  useEffect(() => () => window.clearTimeout(flashTimer.current), [])

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const c = cellAt(e.clientX, e.clientY)
    if (!c || c.col >= steps) return
    const value = !gridRef.current[c.row][c.col]
    onSet(c.row, c.col, value)
    if (value) doFlash(c.row, c.col)
    if (e.pointerType !== 'touch') {
      painting.current = { value, last: `${c.row}:${c.col}` }
      e.currentTarget.setPointerCapture(e.pointerId)
    }
  }

  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    const p = painting.current
    if (!p) return
    const c = cellAt(e.clientX, e.clientY)
    if (!c || c.col >= steps) return
    const key = `${c.row}:${c.col}`
    if (key === p.last) return
    p.last = key
    if (gridRef.current[c.row][c.col] !== p.value) {
      onSet(c.row, c.col, p.value)
      if (p.value) doFlash(c.row, c.col)
    }
  }

  const endPaint = () => {
    painting.current = null
  }

  // keyboard activation (Enter/Space on a focused cell → click with detail 0)
  const onClick = (e: RMouseEvent<HTMLDivElement>) => {
    if (e.detail !== 0) return
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-row]')
    if (!el) return
    const row = Number(el.dataset.row)
    const col = Number(el.dataset.col)
    onSet(row, col, !grid[row][col])
  }

  const prevStep = useRef<number | null>(null)
  const jump = step !== null && prevStep.current !== null && step < prevStep.current
  useEffect(() => {
    prevStep.current = step
  }, [step])

  const rows = Array.from({ length: ROWS }, (_, i) => ROWS - 1 - i)

  return (
    <div
      className="relative select-none"
      style={{ touchAction: 'manipulation' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPaint}
      onPointerCancel={endPaint}
      onClick={onClick}
    >
      {step !== null && step < steps && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className={`beam${jump ? ' jump' : ''}`}
            style={{
              left: `calc(${step} * (100% + var(--gap)) / ${steps})`,
              width: `calc((100% - ${steps - 1} * var(--gap)) / ${steps})`,
            }}
          />
        </div>
      )}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${steps}, minmax(0, 1fr))`, gap: 'var(--gap)' }}>
        {rows.map((r) => (
          <Fragment key={r}>
            {Array.from({ length: steps }, (_, c) => (
              <GridCell
                key={c}
                row={r}
                col={c}
                on={grid[r][c]}
                beat={c % 4 === 0}
                colCur={step === c}
                hit={(grid[r][c] && step === c) || flash === `${r}:${c}`}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
