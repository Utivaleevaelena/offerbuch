import { AudioWaveform, Bell, Piano, Waves } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import type { PresetId } from '../lib/types'

const SOUNDS: Array<{ id: PresetId; name: string; hint: string; color: string; icon: ReactNode }> = [
  { id: 'piano', name: 'Piano-like', hint: 'Soft electric keys', color: '#a855f7', icon: <Piano size={18} /> },
  { id: 'synth', name: 'Synth', hint: 'Detuned saw lead', color: '#22d3ee', icon: <Waves size={18} /> },
  { id: 'bell', name: 'Bell', hint: 'Glassy chimes', color: '#ec4899', icon: <Bell size={18} /> },
  { id: 'retro', name: 'Retro', hint: '8-bit pulse', color: '#facc15', icon: <AudioWaveform size={18} /> },
]

interface Props {
  value: PresetId
  onChange: (id: PresetId) => void
}

export function SoundSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Sound preset">
      {SOUNDS.map((s) => (
        <button
          key={s.id}
          role="radio"
          aria-checked={value === s.id}
          className={`sound${value === s.id ? ' sel' : ''}`}
          style={{ '--c': s.color } as CSSProperties}
          onClick={() => onChange(s.id)}
        >
          <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: s.color }}>
            {s.icon}
            {s.name}
          </span>
          <span className="text-[0.7rem] text-white/45">{s.hint}</span>
        </button>
      ))}
    </div>
  )
}
