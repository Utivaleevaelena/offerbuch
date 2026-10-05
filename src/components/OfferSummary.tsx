import { getStage, stageNumber } from '../lib/offer'
import { useI18n } from '../i18n/I18nContext'
import { formatHours } from '../lib/scope'
import type { OfferSummary as Summary } from '../lib/summary'
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
  const { proposal, t, price, lang } = useI18n()
  const hours = (h: number) => formatHours(h, lang)
  return (
    <ul className="divide-y divide-line">
      {summary.items.map((s) => {
        const stage = getStage(s.category, proposal)
        return (
          <li key={s.id} className="animate-fade-up flex items-start gap-3 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="text-[0.68rem] font-bold tracking-[0.16em] text-gold-ink uppercase">
                {t.stage} {stageNumber(s.category)} · {stage.navLabel}
              </p>
              <p className="mt-0.5 leading-snug font-semibold text-navy-900">{s.summaryTitle}</p>
              {s.variant && (
                <p className="text-sm text-ink-muted">
                  {t.variant}: {s.variant}
                  {onNavigate && (
                    <>
                      {' · '}
                      <a
                        href={`#${stage.anchor}`}
                        onClick={onNavigate}
                        className="font-medium text-gold-ink underline-offset-4 hover:underline"
                      >
                        {t.change}
                      </a>
                    </>
                  )}
                </p>
              )}
              {s.scope && (
                <>
                  <p className="text-sm text-ink-muted">
                    {t.scope.hoursTimesRate(hours(s.scope.hours), price(s.scope.rateNet))}
                  </p>
                  <details className="group mt-1.5">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
                      {t.scope.details} ({s.scope.tasks.length})
                      <Icon name="chevronDown" size={14} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="mt-2 space-y-1 text-xs text-ink-muted">
                      {s.scope.tasks.map((task) => (
                        <li key={task.id} className="flex gap-1.5">
                          <Icon name="check" size={13} className="mt-0.5 shrink-0 text-gold" />
                          {task.title}
                        </li>
                      ))}
                      {s.scope.extraHours > 0 && (
                        <li className="flex gap-1.5">
                          <Icon name="sparkle" size={13} className="mt-0.5 shrink-0 text-gold" />
                          {t.scope.extraTime}: {t.scope.hours(hours(s.scope.extraHours))}
                        </li>
                      )}
                    </ul>
                  </details>
                  {(onNavigate || onRemove) && (
                    <p className="mt-1.5 flex flex-wrap gap-x-3 text-xs font-semibold">
                      {onNavigate && (
                        <a href={`#${stage.anchor}`} onClick={onNavigate} className="text-gold-ink underline-offset-4 hover:underline">
                          {t.scope.edit}
                        </a>
                      )}
                      {onRemove && (
                        <button
                          type="button"
                          onClick={() => onRemove(s.id)}
                          className="text-ink-muted underline-offset-4 hover:text-navy-900 hover:underline"
                        >
                          {t.remove}
                        </button>
                      )}
                    </p>
                  )}
                </>
              )}
            </div>
            <p className="text-right text-[0.95rem] font-semibold whitespace-nowrap text-navy-900">
              {price(s.priceNet)}
              {s.billing === 'monthly' && <span className="block text-xs font-medium text-ink-muted">{t.perMonthShort}</span>}
            </p>
            {onRemove && !s.scope && (
              <button
                type="button"
                onClick={() => onRemove(s.id)}
                className="-mt-1.5 -mr-2 grid size-9 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-ivory-deep hover:text-navy-900"
                aria-label={t.removeFromOffer(s.summaryTitle)}
                title={t.remove}
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
  const { proposal, t, price } = useI18n()
  const hasMonthly = summary.monthlyItems.length > 0
  return (
    <div className="space-y-3">
      {!hasMonthly ? (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-xs font-bold tracking-[0.18em] text-ink-muted uppercase">{t.netTotal}</span>
          <span className="font-serif text-[2rem] leading-none font-semibold text-navy-900" aria-live="polite">
            {price(summary.oneTimeTotal)}
          </span>
        </div>
      ) : (
        <>
          {summary.oneTimeItems.length > 0 && (
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-ink-muted uppercase">{t.oneTimeServices}</p>
              <p className="mt-1 font-serif text-[1.85rem] leading-none font-semibold text-navy-900" aria-live="polite">
                {price(summary.oneTimeTotal)} <span className="font-sans text-sm font-medium text-ink-muted">{t.net}</span>
              </p>
            </div>
          )}
          {summary.monthlyItems.map((s) => (
            <div key={s.id} className="rounded-xl border border-gold/30 bg-gold-soft/60 p-3.5">
              <p className="text-xs font-bold tracking-[0.18em] text-gold-ink uppercase">{getStage(s.category, proposal).label}</p>
              <p className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="font-semibold text-navy-900">{s.variant ?? s.summaryTitle}</span>
                <span className="font-semibold text-navy-900" aria-live="polite">
                  {price(s.priceNet)} <span className="text-sm font-medium text-ink-muted">{t.perMonthShort}</span>
                </span>
              </p>
            </div>
          ))}
        </>
      )}
      <p className="text-xs text-ink-muted">{t.pricesAreNet}</p>
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
  const { t } = useI18n()
  const empty = summary.items.length === 0

  return (
    <div className="flex h-full flex-col">
      <h2 id={headingId} className="pr-12 text-[1.75rem]">
        {t.yourOffer}
      </h2>
      <p className="mt-1 text-sm text-ink-muted">
        {t.selectedScope}
        {!empty && (
          <>
            {' · '}
            <span className="font-semibold text-navy-900">
              {summary.items.length} {t.modules(summary.items.length)}
            </span>
          </>
        )}
      </p>

      <div className="mt-4 flex-1">
        {empty ? (
          <div className="rounded-xl border border-dashed border-beige-deep bg-ivory/60 p-5 text-sm text-ink-muted">
            <p className="font-semibold text-navy-900">{t.emptyTitle}</p>
            <p className="mt-1.5">{t.emptyText}</p>
          </div>
        ) : (
          <SummaryLines summary={summary} onRemove={remove} onNavigate={onNavigate} />
        )}
      </div>

      <div className="mt-5 border-t border-line pt-5">
        <Totals summary={summary} />
        <button type="button" onClick={onSend} disabled={empty} className="btn-primary mt-5 w-full">
          <Icon name="send" size={18} />
          {t.sendOffer}
        </button>
      </div>
    </div>
  )
}
