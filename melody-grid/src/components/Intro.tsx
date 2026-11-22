import { Sparkles, X } from 'lucide-react'

export function Intro({ onClose }: { onClose: () => void }) {
  return (
    <div className="fade-up mb-4 flex items-center gap-3 rounded-2xl border border-violet-400/30 bg-gradient-to-r from-violet-500/15 via-cyan-400/10 to-pink-500/15 px-4 py-3">
      <Sparkles className="flex-none text-cyan-300" size={20} />
      <p className="flex-1 text-sm font-medium text-white/90 sm:text-base">Tap squares to create your melody. Press Play to hear your music.</p>
      <button onClick={onClose} aria-label="Dismiss" className="flex-none rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white">
        <X size={18} />
      </button>
    </div>
  )
}
