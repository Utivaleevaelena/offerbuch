import { Dices, Eraser, Pause, Play, Repeat, Square } from 'lucide-react'
import type { Status } from '../hooks/usePlayer'

interface Props {
  status: Status
  loop: boolean
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onLoop: () => void
  onClear: () => void
  onRandom: () => void
}

export function SequencerControls({ status, loop, onPlay, onPause, onStop, onLoop, onClear, onRandom }: Props) {
  const playing = status === 'playing'
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" role="group" aria-label="Player">
      <button className={`btn btn-play${playing ? ' is-active' : ''}`} onClick={onPlay} disabled={playing} aria-label="Play">
        <Play size={20} fill="currentColor" />
        {status === 'paused' ? 'Resume' : 'Play'}
      </button>
      <button className="btn" onClick={onPause} disabled={!playing} aria-label="Pause">
        <Pause size={19} fill="currentColor" />
        <span className="hidden sm:inline">Pause</span>
      </button>
      <button className="btn" onClick={onStop} disabled={status === 'stopped'} aria-label="Stop">
        <Square size={17} fill="currentColor" />
        <span className="hidden sm:inline">Stop</span>
      </button>
      <span className="mx-1 hidden h-7 w-px bg-white/10 sm:block" />
      <button className={`btn${loop ? ' on' : ''}`} onClick={onLoop} aria-pressed={loop} aria-label="Loop">
        <Repeat size={18} />
        <span className="hidden sm:inline">Loop</span>
      </button>
      <button className="btn" onClick={onRandom} aria-label="Random melody">
        <Dices size={19} />
        <span className="hidden sm:inline">Random</span>
      </button>
      <button className="btn" onClick={onClear} aria-label="Clear">
        <Eraser size={18} />
        <span className="hidden sm:inline">Clear</span>
      </button>
    </div>
  )
}
