import { formatPLN } from '../lib/summary'
import { useOffer } from '../state/OfferContext'
import { Icon } from './Icon'
import { pluralModules } from './OfferSummary'

/** Przyklejony pasek „Twoja oferta” na telefonach i tabletach. */
export function MobileOfferBar({ onOpen, expanded }: { onOpen: () => void; expanded: boolean }) {
  const { summary } = useOffer()
  const count = summary.items.length
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ivory/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_-18px_rgb(19_35_58/0.35)] backdrop-blur-md lg:hidden">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-navy-900 px-5 text-left text-ivory transition-transform active:scale-[0.99]"
      >
        <span className="min-w-0">
          <span className="block truncate text-[0.95rem] font-semibold">
            Twoja oferta • {formatPLN(summary.oneTimeTotal)} netto
          </span>
          <span className="block truncate text-xs text-ivory/70">
            {count === 0
              ? 'Nie wybrano jeszcze modułów'
              : `${count} ${pluralModules(count)}${
                  summary.monthlyTotal ? ` • + ${formatPLN(summary.monthlyTotal)} netto / mies.` : ''
                }`}
          </span>
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-light text-navy-950">
          <Icon name="chevronUp" size={18} />
        </span>
      </button>
    </div>
  )
}
