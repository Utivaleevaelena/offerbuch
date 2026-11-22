import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as RMouseEvent, type PointerEvent as RPointerEvent } from 'react'
import { NOTES } from '../audio/notes'
import { ROWS, type Cell, type Grid, type Mode } from '../lib/types'

interface Props {
  mode: Mode
  steps: number
  grid: Grid
  free: Cell[]
  step: number | null
  onSet: (row: number, col: number, on: boolean) => void
  onTapFree: (row: number, col: number) => void
}

interface CellProps {
  row: number
  col: number
  on: boolean
  beat: boolean
  colCur: boolean
  hit: boolean
  badge?: string
}

const GridCell = memo(function GridCell({ row, col, on, beat, colCur, hit, badge }: CellProps) {
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
      {badge && <span className="badge">{badge}</span>}
    </button>
  )
})

const cellAt = (x: number, y: number): { row: number; col: number } | null => {
  const el = (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>('[data-row]')
  return el ? { row: Number(el.dataset.row), col: Number(el.dataset.col) } : null
}

export function MusicalGrid({ mode, steps, grid, free, step, onSet, onTapFree }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const painting = useRef<{ value: boolean; last: string } | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const flashTimer = useRef<number | undefined>(undefined)
  const gridRef = useRef(grid)
  useEffect(() => {
    gridRef.current = grid
  })

  const doFlash = useCallback((row: number, col: number) => {
    setFlash(`${row}:${col}:${performance.now()}`)
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlash(null), 330)
  }, [])
  useEffect(() => () => window.clearTimeout(flashTimer.current), [])

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const c = cellAt(e.clientX, e.clientY)
    if (!c || c.col >= steps) return
    if (mode === 'free') {
      onTapFree(c.row, c.col)
      doFlash(c.row, c.col)
      return
    }
    const value = !gridRef.current[c.row][c.col]
    onSet(c.row, c.col, value)
    if (value) doFlash(c.row, c.col)
    // drag-to-paint with mouse / pen (touch keeps native horizontal scrolling)
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
    if (mode === 'free') onTapFree(row, col)
    else onSet(row, col, !grid[row][col])
  }

  // keep the travelling cursor visible when the grid scrolls (phones)
  useEffect(() => {
    const sc = scroller.current
    if (!sc || step === null || mode !== 'step' || sc.scrollWidth <= sc.clientWidth + 2) return
    const cell = sc.querySelector<HTMLElement>(`[data-row="0"][data-col="${step}"]`)
    if (!cell) return
    const labelW = 40
    const left = cell.offsetLeft
    const right = left + cell.offsetWidth
    if (left < sc.scrollLeft + labelW || right > sc.scrollLeft + sc.clientWidth) {
      sc.scrollTo({ left: Math.max(0, left - labelW - 30), behavior: 'smooth' })
    }
  }, [step, mode])

  const freeInfo = useMemo(() => {
    const m = new Map<string, { first: number; count: number }>()
    free.forEach((c, i) => {
      const k = `${c.row}:${c.col}`
      const cur = m.get(k)
      if (cur) cur.count++
      else m.set(k, { first: i + 1, count: 1 })
    })
    return m
  }, [free])

  const flashKey = flash?.split(':').slice(0, 2).join(':')
  const playingFree = mode === 'free' && step !== null ? free[step] : undefined
  const prevStep = useRef<number | null>(null)
  const jump = step !== null && prevStep.current !== null && step < prevStep.current
  useEffect(() => {
    prevStep.current = step
  }, [step])

  const rows = Array.from({ length: ROWS }, (_, i) => ROWS - 1 - i)

  return (
    <div
      ref={scroller}
      className="thin-scroll overflow-x-auto overflow-y-hidden rounded-2xl pb-1"
      style={{ '--steps': steps } as CSSProperties}
    >
      <div
        className="relative select-none"
        style={{ minWidth: `calc(var(--label) + ${steps} * (var(--min-cell) + var(--gap)))`, touchAction: 'pan-x pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPaint}
        onPointerCancel={endPaint}
        onClick={onClick}
      >
        {mode === 'step' && step !== null && step < steps && (
          <div className="pointer-events-none absolute top-0 bottom-0 right-0" style={{ left: 'calc(var(--label) + var(--gap))' }} aria-hidden>
            <div
              className={`beam${jump ? ' jump' : ''}`}
              style={{
                left: `calc(${step} * (100% + var(--gap)) / ${steps})`,
                width: `calc((100% - ${steps - 1} * var(--gap)) / ${steps})`,
              }}
            />
          </div>
        )}
        <div
          className="grid"
          style={{
            gridTemplateColumns: `var(--label) repeat(${steps}, minmax(var(--min-cell), 1fr))`,
            gap: 'var(--gap)',
          }}
        >
          {/* step numbers */}
          <div />
          {Array.from({ length: steps }, (_, c) => (
            <div
              key={c}
              className={`z-[1] pb-0.5 text-center font-mono text-[0.6rem] leading-none transition-colors ${
                mode === 'step' && step === c ? 'text-cyan-300' : c % 4 === 0 ? 'text-white/55' : 'text-white/20'
              }`}
            >
              {mode === 'step' ? (c % 4 === 0 ? c + 1 : '·') : '·'}
            </div>
          ))}

          {rows.map((r) => (
            <Fragment key={r}>
              <div
                className="sticky left-0 z-[4] flex items-center justify-start bg-[#13141c] pr-1 font-mono text-[0.68rem] font-semibold"
                style={{ color: `hsl(${NOTES[r].hue} 90% 72%)` }}
              >
                {NOTES[r].name}
              </div>
              {Array.from({ length: steps }, (_, c) => {
                const info = mode === 'free' ? freeInfo.get(`${r}:${c}`) : undefined
                const on = mode === 'free' ? !!info : grid[r][c]
                const isPlayingFree = !!playingFree && playingFree.row === r && playingFree.col === c
                const hit = (mode === 'step' && on && step === c) || isPlayingFree || flashKey === `${r}:${c}`
                return (
                  <GridCell
                    key={c}
                    row={r}
                    col={c}
                    on={on}
                    beat={mode === 'step' && c % 4 === 0}
                    colCur={mode === 'step' && step === c}
                    hit={hit}
                    badge={info ? (info.count > 1 ? `${info.first}+` : String(info.first)) : undefined}
                  />
                )
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
