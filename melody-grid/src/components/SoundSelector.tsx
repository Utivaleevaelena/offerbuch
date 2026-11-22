import { Bell, Drum, Piano, Waves } from 'lucide-react'
import type { ReactNode } from 'react'
import type { PresetId } from '../lib/types'

const SOUNDS: Array<{ id: PresetId; name: string; icon: ReactNode }> = [
  { id: 'piano', name: 'Pianino', icon: <Piano size={16} /> },
  { id: 'synth', name: 'Syntezator', icon: <Waves size={16} /> },
  { id: 'bell', name: 'Dzwonek', icon: <Bell size={16} /> },
  { id: 'marimba', name: 'Marimba', icon: <Drum size={16} /> },
]

interface Props {
  value: PresetId
  onChange: (id: PresetId) => void
}

export function SoundSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Brzmienie">
      {SOUNDS.map((s) => (
        <button key={s.id} role="radio" aria-checked={value === s.id} className={`sound${value === s.id ? ' sel' : ''}`} onClick={() => onChange(s.id)}>
          {s.icon}
          <span className="text-[0.68rem] font-semibold">{s.name}</span>
        </button>
      ))}
    </div>
  )
}
