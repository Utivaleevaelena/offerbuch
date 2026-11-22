import type { CSSProperties } from 'react'

interface Props {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}

export function Slider({ label, value, min, max, onChange }: Props) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        aria-label={label}
        className="slider"
        min={min}
        max={max}
        value={value}
        style={{ '--pct': `${pct}%` } as CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="w-8 flex-none text-right font-mono text-xs font-semibold text-[#8f2f5a]">{value}</span>
    </div>
  )
}
