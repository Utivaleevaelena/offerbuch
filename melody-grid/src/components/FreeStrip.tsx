import { Undo2 } from 'lucide-react'
import { useEffect, useRef, type CSSProperties } from 'react'
import { NOTES } from '../audio/notes'
import type { Cell } from '../lib/types'

interface Props {
  free: Cell[]
  step: number | null
  onUndo: () => void
}

export function FreeStrip({ free, step, onUndo }: Props) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const b = box.current
    if (!b) return
    const target = step !== null ? b.children[step] : b.lastElementChild
    ;(target as HTMLElement | null)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [free.length, step])

  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 p-2 pl-4">
      <div className="min-w-0 flex-1">
        <div className="label mb-1.5">Your sequence · {free.length}</div>
        {free.length === 0 ? (
          <p className="py-1 text-sm text-white/45">Tap squares in any order — Play repeats them exactly as you tapped.</p>
        ) : (
          <div ref={box} className="no-scrollbar flex gap-1.5 overflow-x-auto py-1">
            {free.map((c, i) => (
              <span
                key={i}
                className={`flex-none rounded-lg px-2 py-1 font-mono text-xs font-semibold transition ${
                  step === i ? 'scale-110 text-black' : 'text-white/90'
                }`}
                style={
                  {
                    background: step === i ? `hsl(${NOTES[c.row].hue} 95% 70%)` : `hsl(${NOTES[c.row].hue} 70% 45% / 0.35)`,
                    boxShadow: step === i ? `0 0 14px hsl(${NOTES[c.row].hue} 95% 60%)` : undefined,
                  } as CSSProperties
                }
              >
                {NOTES[c.row].name}
              </span>
            ))}
          </div>
        )}
      </div>
      <button className="btn" onClick={onUndo} disabled={free.length === 0} aria-label="Undo last tap">
        <Undo2 size={18} />
        <span className="hidden sm:inline">Undo</span>
      </button>
    </div>
  )
}
