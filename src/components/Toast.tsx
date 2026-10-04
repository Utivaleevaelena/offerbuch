import { useOffer } from '../state/OfferContext'
import { Icon } from './Icon'

export function Toast() {
  const { toast } = useOffer()
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4 lg:bottom-8"
    >
      {toast && (
        <div
          key={toast.id}
          className="animate-toast-in flex items-center gap-2.5 rounded-full bg-navy-900 px-5 py-3 text-sm font-semibold text-ivory shadow-lift"
        >
          <span className="grid size-6 place-items-center rounded-full bg-gold-light text-navy-950">
            <Icon name="check" size={14} />
          </span>
          {toast.message}
        </div>
      )}
    </div>
  )
}
