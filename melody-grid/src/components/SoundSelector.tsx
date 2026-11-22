import { AudioWaveform, Bell, Piano, Waves } from 'lucide-react'
import type { ReactNode } from 'react'
import type { PresetId } from '../lib/types'

const SOUNDS: Array<{ id: PresetId; name: string; icon: ReactNode }> = [
  { id: 'piano', name: 'Piano', icon: <Piano size={20} /> },
  { id: 'synth', name: 'Synth', icon: <Waves size={20} /> },
  { id: 'bell', name: 'Bell', icon: <Bell size={20} /> },
  { id: 'retro', name: 'Retro', icon: <AudioWaveform size={20} /> },
]

interface Props {
  value: PresetId
  onChange: (id: PresetId) => void
}

export function SoundSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Sound">
      {SOUNDS.map((s) => (
        <button key={s.id} role="radio" aria-checked={value === s.id} className={`sound${value === s.id ? ' sel' : ''}`} onClick={() => onChange(s.id)}>
          {s.icon}
          <span className="text-xs font-semibold">{s.name}</span>
        </button>
      ))}
    </div>
  )
}
