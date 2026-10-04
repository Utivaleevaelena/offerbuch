import { PROPOSAL } from '../content/proposal'
import { getService } from '../lib/offer'
import { formatPLN } from '../lib/summary'
import { useOffer } from '../state/OfferContext'
import { Icon } from './Icon'

export function RecommendedSet() {
  const { addRecommendedSet, isSelected } = useOffer()
  const rec = PROPOSAL.recommended
  if (!rec) return null
  const items = rec.serviceIds.map((id) => getService(id)!)
  const total = items.reduce((sum, s) => sum + s.priceNet, 0)
  const allSelected = items.every((s) => isSelected(s.id))

  return (
    <section aria-labelledby="recommended-title" className="py-10">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-navy-900 p-7 text-ivory shadow-lift sm:p-10">
        <div aria-hidden="true" className="absolute -right-24 -bottom-24 size-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative grid gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-gold-light uppercase">{rec.eyebrow}</p>
            <h2 id="recommended-title" className="mt-4 text-[2.2rem] !text-ivory sm:text-[2.6rem]">
              {rec.title}
            </h2>
            <p className="mt-4 text-ivory/75">{rec.text}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <ul className="divide-y divide-white/10">
              {items.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="flex items-center gap-3">
                    <Icon
                      name="check"
                      size={18}
                      className={isSelected(s.id) ? 'text-gold-light' : 'text-ivory/30'}
                    />
                    {rec.labels?.[s.id] ?? s.summaryTitle}
                    {isSelected(s.id) && <span className="sr-only">(już w Twojej ofercie)</span>}
                  </span>
                  <span className="font-semibold whitespace-nowrap">{formatPLN(s.priceNet)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-gold-light/30 pt-4">
              <span className="text-xs font-semibold tracking-[0.18em] text-gold-light uppercase">Razem</span>
              <span className="font-serif text-3xl font-semibold">
                {formatPLN(total)} <span className="font-sans text-sm font-medium text-ivory/70">netto</span>
              </span>
            </div>
            <button
              type="button"
              onClick={addRecommendedSet}
              disabled={allSelected}
              className="btn-gold mt-6 w-full disabled:opacity-80"
            >
              <Icon name={allSelected ? 'check' : 'plus'} size={18} />
              {allSelected ? 'Zestaw jest w Twojej ofercie' : rec.cta}
            </button>
          </div>
        </div>
        {rec.footnote && (
          <p className="relative mt-8 flex gap-3 border-t border-white/10 pt-6 text-sm text-ivory/70">
            <Icon name="arrowRight" size={18} className="mt-0.5 shrink-0 text-gold-light" />
            {rec.footnote}
          </p>
        )}
      </div>
    </section>
  )
}
