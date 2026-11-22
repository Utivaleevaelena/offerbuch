import { Grid3x3, MousePointerClick } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Mode } from '../lib/types'

interface Props {
  mode: Mode
  onChange: (m: Mode) => void
}

export function ModeToggle({ mode, onChange }: Props) {
  const opts: Array<{ id: Mode; label: string; icon: ReactNode }> = [
    { id: 'step', label: 'Sequencer', icon: <Grid3x3 size={16} /> },
    { id: 'free', label: 'Free Play', icon: <MousePointerClick size={16} /> },
  ]
  return (
    <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1" role="tablist" aria-label="Mode">
      {opts.map((o) => (
        <button
          key={o.id}
          role="tab"
          aria-selected={mode === o.id}
          onClick={() => onChange(o.id)}
          className={`flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition sm:px-4 ${
            mode === o.id
              ? 'bg-gradient-to-br from-violet-500/80 to-pink-500/80 text-white shadow-[0_0_20px_-4px_rgba(168,85,247,0.9)]'
              : 'text-white/55 hover:text-white'
          }`}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}
