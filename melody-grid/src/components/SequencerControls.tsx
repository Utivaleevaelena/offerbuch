import { Dices, Download, Eraser, FolderOpen, Pause, Play, Save } from 'lucide-react'
import type { Status } from '../hooks/usePlayer'

interface Props {
  status: Status
  hasSaved: boolean
  exporting: boolean
  onPlay: () => void
  onPause: () => void
  onClear: () => void
  onRandom: () => void
  onSave: () => void
  onLoad: () => void
  onExport: () => void
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
      <span className="mx-1 hidden h-6 w-px bg-[#d98aa9] sm:block" />
      <button className="btn" onClick={p.onSave} aria-label="Zapisz">
        <Save size={19} />
      </button>
      <button className="btn" onClick={p.onLoad} disabled={!p.hasSaved} aria-label="Wczytaj">
        <FolderOpen size={19} />
      </button>
      <button className="btn" onClick={p.onExport} disabled={p.exporting} aria-label="Eksportuj WAV">
        <Download size={19} />
      </button>
    </div>
  )
}
