import { Dices, Eraser, Pause, Play } from 'lucide-react'
import type { Status } from '../hooks/usePlayer'

interface Props {
  status: Status
  onPlay: () => void
  onPause: () => void
  onClear: () => void
  onRandom: () => void
}

export function SequencerControls(p: Props) {
  const playing = p.status === 'playing'
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5" role="group" aria-label="Odtwarzacz">
      <button className={`btn btn-play${playing ? ' is-active' : ''}`} onClick={p.onPlay} disabled={playing} aria-label="Odtwórz">
        <Play size={22} fill="currentColor" />
      </button>
      <button className="btn" onClick={p.onPause} disabled={!playing} aria-label="Pauza">
        <Pause size={20} fill="currentColor" />
      </button>
      <button className="btn" onClick={p.onRandom} aria-label="Losowa melodia">
        <Dices size={20} />
      </button>
      <button className="btn" onClick={p.onClear} aria-label="Wyczyść">
        <Eraser size={20} />
      </button>
    </div>
  )
}
