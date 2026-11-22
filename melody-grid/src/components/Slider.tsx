import type { CSSProperties, ReactNode } from 'react'

interface Props {
  label: string
  icon: ReactNode
  value: number
  min: number
  max: number
  step?: number
  display: string
  onChange: (v: number) => void
}

export function Slider({ label, icon, value, min, max, step = 1, display, onChange }: Props) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <span className="label flex items-center gap-2">
          {icon}
          {label}
        </span>
        <span className="font-mono text-sm font-semibold text-cyan-300">{display}</span>
      </div>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--pct': `${pct}%` } as CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}
