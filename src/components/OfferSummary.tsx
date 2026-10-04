import { getStage, stageNumber } from '../lib/offer'
import { formatPLN, type OfferSummary as Summary } from '../lib/summary'
import { useOffer } from '../state/OfferContext'
import { Icon } from './Icon'

/** Lista wybranych usług z sumami — wspólna dla panelu, szuflady mobilnej i ekranu sukcesu. */
export function SummaryLines({
  summary,
  onRemove,
  onNavigate,
}: {
  summary: Summary
  onRemove?: (id: string) => void
  /** Gdy podane — pokazuje link „Zmień wariant” przy usługach z wariantami. */
  onNavigate?: () => void
}) {
  return (
    <ul className="divide-y divide-line">
      {summary.items.map((s) => {
        const stage = getStage(s.category)
        return (
          <li key={s.id} className="animate-fade-up flex items-start gap-3 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-[0.68rem] font-bold tracking-[0.16em] text-gold-ink uppercase">
                Etap {stageNumber(s.category)} · {stage.navLabel}
              </p>
              <p className="mt-0.5 leading-snug font-semibold text-navy-900">{s.summaryTitle}</p>
              {s.variant && (
                <p className="text-sm text-ink-muted">
                  Wariant: {s.variant}
                  {onNavigate && (
                    <>
                      {' · '}
                      <a
                        href={`#${stage.anchor}`}
                        onClick={onNavigate}
                        className="font-medium text-gold-ink underline-offset-4 hover:underline"
                      >
                        zmień
                      </a>
                    </>
                  )}
                </p>
              )}
            </div>
            <p className="text-right text-[0.95rem] font-semibold whitespace-nowrap text-navy-900">
              {formatPLN(s.priceNet)}
              {s.billing === 'monthly' && <span className="block text-xs font-medium text-ink-muted">netto / mies.</span>}
            </p>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(s.id)}
                className="-mt-1.5 -mr-2 grid size-9 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-ivory-deep hover:text-navy-900"
                aria-label={`Usuń z oferty: ${s.summaryTitle}`}
                title="Usuń"
              >
                <Icon name="trash" size={17} />
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export function Totals({ summary }: { summary: Summary }) {
  const hasMonthly = summary.monthlyItems.length > 0
  return (
    <div className="space-y-3">
      {!hasMonthly ? (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-bold tracking-[0.18em] text-ink-muted uppercase">Suma netto</span>
          <span className="font-serif text-[2rem] leading-none font-semibold text-navy-900" aria-live="polite">
            {formatPLN(summary.oneTimeTotal)}
          </span>
        </div>
      ) : (
        <>
          {summary.oneTimeItems.length > 0 && (
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-ink-muted uppercase">Usługi jednorazowe</p>
              <p className="mt-1 font-serif text-[1.85rem] leading-none font-semibold text-navy-900" aria-live="polite">
                {formatPLN(summary.oneTimeTotal)} <span className="font-sans text-sm font-medium text-ink-muted">netto</span>
              </p>
            </div>
          )}
          {summary.monthlyItems.map((s) => (
            <div key={s.id} className="rounded-xl border border-gold/30 bg-gold-soft/60 p-3.5">
              <p className="text-xs font-bold tracking-[0.18em] text-gold-ink uppercase">{getStage(s.category).label}</p>
              <p className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="font-semibold text-navy-900">{s.variant ?? s.summaryTitle}</span>
                <span className="font-semibold text-navy-900" aria-live="polite">
                  {formatPLN(s.priceNet)} <span className="text-sm font-medium text-ink-muted">netto / mies.</span>
                </span>
              </p>
            </div>
          ))}
        </>
      )}
      <p className="text-xs text-ink-muted">Podane ceny są cenami netto.</p>
    </div>
  )
}

/** Zawartość panelu „Twoja oferta”. */
export function OfferPanel({
  onSend,
  headingId,
  onNavigate = () => {},
}: {
  onSend: () => void
  headingId: string
  onNavigate?: () => void
}) {
  const { summary, remove } = useOffer()
  const empty = summary.items.length === 0

  return (
    <div className="flex h-full flex-col">
      <h2 id={headingId} className="pr-12 text-[1.75rem]">
        Twoja oferta
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        Wybrany zakres współpracy
        {!empty && (
          <>
            {' · '}
            <span className="font-semibold text-navy-900">
              {summary.items.length} {pluralModules(summary.items.length)}
            </span>
          </>
        )}
      </p>

      <div className="mt-4 flex-1">
        {empty ? (
          <div className="rounded-xl border border-dashed border-beige-deep bg-ivory/60 p-5 text-sm text-ink-muted">
            <p className="font-semibold text-navy-900">Nie wybrano jeszcze żadnego modułu.</p>
            <p className="mt-1.5">Dodawajcie elementy propozycji — zakres i suma netto zaktualizują się automatycznie.</p>
          </div>
        ) : (
          <SummaryLines summary={summary} onRemove={remove} onNavigate={onNavigate} />
        )}
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <Totals summary={summary} />
        <button type="button" onClick={onSend} disabled={empty} className="btn-primary mt-5 w-full">
          <Icon name="send" size={18} />
          Wyślij wybraną ofertę
        </button>
      </div>
    </div>
  )
}

export function pluralModules(n: number): string {
  if (n === 1) return 'moduł'
  const last = n % 10
  const lastTwo = n % 100
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'moduły'
  return 'modułów'
}
