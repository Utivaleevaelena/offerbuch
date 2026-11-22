import { Download, FolderOpen, RotateCcw, Save } from 'lucide-react'
import { DEMOS } from '../lib/demos'

interface Props {
  activeDemo: string | null
  hasSaved: boolean
  exporting: boolean
  onDemo: (id: string) => void
  onSave: () => void
  onLoad: () => void
  onReset: () => void
  onExport: () => void
}

export function SongTools({ activeDemo, hasSaved, exporting, onDemo, onSave, onLoad, onReset, onExport }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <div className="label mb-2">Demo melodies</div>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {DEMOS.map((d) => (
            <button key={d.id} className={`chip${activeDemo === d.id ? ' sel' : ''}`} onClick={() => onDemo(d.id)}>
              {d.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button className="btn" onClick={onSave}>
          <Save size={17} /> Save
        </button>
        <button className="btn" onClick={onLoad} disabled={!hasSaved}>
          <FolderOpen size={17} /> Load
        </button>
        <button className="btn" onClick={onExport} disabled={exporting}>
          <Download size={17} /> {exporting ? 'Rendering…' : 'Export WAV'}
        </button>
        <button className="btn" onClick={onReset}>
          <RotateCcw size={17} /> Reset
        </button>
      </div>
    </div>
  )
}
