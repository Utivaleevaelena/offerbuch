import { useId } from 'react'
import type { ScopeConfigurator as Config, ScopeSelection, Service } from '../content/types'
import { useI18n } from '../i18n/I18nContext'
import {
  formatHours,
  fullSelection,
  matchingPreset,
  resolveScope,
  ruleMessages,
  selectionForHours,
  selectionForPreset,
  selectionForTasks,
} from '../lib/scope'
import { useOffer } from '../state/OfferContext'
import { Icon } from './Icon'

const sameSelection = (a: ScopeSelection, b: ScopeSelection) =>
  a.hours === b.hours && a.taskIds.length === b.taskIds.length && a.taskIds.every((id) => b.taskIds.includes(id))

/**
 * Konfigurator zakresu pracy strategicznej.
 * Suwak i lista elementów sterują sobą nawzajem:
 *  • suwak → wybiera pełne elementy w kolejności priorytetu, resztę pokazuje jako czas dodatkowy,
 *  • elementy → suwak ustawia się na sumę ich czasu.
 */
export function ScopeConfigurator({ cfg, service }: { cfg: Config; service: Service }) {
  const { t, price, lang } = useI18n()
  const { drafts, scopes, setDraft, isSelected } = useOffer()
  const rate = service.hourlyRateNet ?? 0
  const selection = drafts[service.id] ?? scopes[service.id] ?? fullSelection(cfg)
  const resolved = resolveScope(cfg, selection, rate)
  const activePreset = matchingPreset(cfg, selection)
  const hours = (h: number) => t.scope.hours(formatHours(h, lang))
  const update = (sel: ScopeSelection) => setDraft(service.id, sel)

  const committed = scopes[service.id]
  const inOffer = isSelected(service.id)
  const status: CtaStatus =
    selection.hours <= 0 ? 'empty' : !inOffer ? 'add' : committed && !sameSelection(committed, selection) ? 'update' : 'added'

  return (
    <div className="space-y-10">
      {/* Gotowe zakresy */}
      <section aria-labelledby={`${service.id}-presets`}>
        <div className="mb-4">
          <h3 id={`${service.id}-presets`} className="font-sans text-base font-semibold text-navy-900">
            {t.scope.presetsTitle}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">{t.scope.presetsHint}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {cfg.presets.map((preset) => {
            const active = activePreset?.id === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={active}
                onClick={() => update(selectionForPreset(preset))}
                className={`group relative flex min-h-28 flex-col rounded-2xl border p-4 text-left transition-all duration-200 sm:p-5 ${
                  active
                    ? 'border-gold bg-white shadow-lift ring-1 ring-gold/60'
                    : 'border-line bg-white/70 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-white hover:shadow-soft'
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-serif text-[1.15rem] leading-tight text-navy-900 sm:text-[1.35rem]">{preset.title}</span>
                  <span
                    className={`mt-1 grid size-6 shrink-0 place-items-center rounded-full border transition-colors ${
                      active ? 'border-navy-900 bg-navy-900 text-gold-light' : 'border-line text-transparent'
                    }`}
                    aria-hidden="true"
                  >
                    <Icon name="check" size={14} />
                  </span>
                </span>
                {preset.badge && (
                  <span className="mt-2 inline-flex w-fit rounded-full bg-navy-900 px-2.5 py-0.5 text-[0.62rem] font-bold tracking-[0.16em] text-gold-light uppercase">
                    {preset.badge}
                  </span>
                )}
                <span className="mt-2 text-sm font-semibold text-gold-ink">
                  {hours(preset.hours)} · {price(preset.hours * rate)} {t.net}
                </span>
                <span className="mt-2 hidden text-sm leading-snug text-ink-muted sm:block">{preset.description}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Suwak + podsumowanie */}
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_17rem] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <HoursSlider
          cfg={cfg}
          value={selection.hours}
          rate={rate}
          extraHours={resolved.extraHours}
          extraLabel={resolved.extraLabel}
          onChange={(h) => update(selectionForHours(cfg, h))}
        />
        <ScopeSummary service={service} resolved={resolved} status={status} />
      </div>

      {/* Elementy pracy */}
      <section aria-labelledby={`${service.id}-tasks`}>
        <div className="mb-4">
          <h3 id={`${service.id}-tasks`} className="text-[1.75rem]">
            {t.scope.tasksTitle}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">{t.scope.tasksHint}</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {cfg.tasks.map((task) => {
            const checked = selection.taskIds.includes(task.id)
            const hints = checked ? ruleMessages(cfg, task.id, selection.taskIds) : []
            return (
              <li key={task.id}>
                <label
                  className={`flex h-full cursor-pointer gap-3.5 rounded-2xl border p-4 transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold ${
                    checked ? 'border-gold/70 bg-white shadow-soft' : 'border-line bg-white/60 hover:border-gold/40 hover:bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => {
                      const ids = checked ? selection.taskIds.filter((id) => id !== task.id) : [...selection.taskIds, task.id]
                      update(selectionForTasks(cfg, ids))
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border transition-colors ${
                      checked ? 'border-gold bg-gold text-white' : 'border-beige-deep bg-white text-transparent'
                    }`}
                  >
                    <Icon name="check" size={14} strokeWidth={2.2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="font-semibold leading-snug text-navy-900">{task.title}</span>
                      <span className="text-xs font-semibold whitespace-nowrap text-gold-ink">
                        {hours(task.hours)} · {price(task.hours * rate)}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-sm leading-snug text-ink-muted">{task.description}</span>
                    {task.example && (
                      <span className="mt-2 block text-sm text-ink-muted">
                        <span className="text-xs font-semibold tracking-[0.08em] text-gold-ink uppercase">
                          {t.scope.inspiration}
                        </span>{' '}
                        <em className="font-serif text-[1.05rem] text-navy-900">{task.example}</em>
                      </span>
                    )}
                    {hints.map((hint) => (
                      <span key={hint} className="mt-2.5 flex gap-2 rounded-lg bg-ivory px-3 py-2 text-xs leading-snug text-ink-muted">
                        <Icon name="info" size={15} className="mt-px shrink-0 text-gold" />
                        {hint}
                      </span>
                    ))}
                  </span>
                </label>
              </li>
            )
          })}
        </ul>

        {/* Pasek z bieżącym zakresem pod listą — widoczny po zaznaczaniu elementów */}
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-muted">
            <span className="font-semibold text-navy-900">{t.scope.summaryTitle}:</span>{' '}
            {resolved.tasks.length} · {hours(selection.hours)} ·{' '}
            <strong className="font-semibold text-navy-900">
              {price(selection.hours * rate)} {t.net}
            </strong>
          </p>
          <ScopeCta serviceId={service.id} status={status} compact />
        </div>
      </section>
    </div>
  )
}

function HoursSlider({
  cfg,
  value,
  rate,
  extraHours,
  extraLabel,
  onChange,
}: {
  cfg: Config
  value: number
  rate: number
  extraHours: number
  extraLabel: string
  onChange: (hours: number) => void
}) {
  const { t, price, lang } = useI18n()
  const id = useId()
  const hours = (h: number) => t.scope.hours(formatHours(h, lang))
  const fill = `${(value / cfg.maxHours) * 100}%`

  return (
    <section aria-labelledby={id} className="card p-6 sm:p-7">
      <p id={id} className="eyebrow">
        {t.scope.sliderTitle}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-ink-muted">{t.scope.selectedTime}</p>
          <p className="mt-1 font-serif text-[2.4rem] leading-none font-semibold text-navy-900" aria-live="polite">
            {hours(value)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-ink-muted">{t.scope.estimatedCost}</p>
          <p className="mt-1 font-serif text-[2.4rem] leading-none font-semibold text-navy-900">
            {price(value * rate)}
          </p>
          <p className="text-xs text-ink-muted">{t.net}</p>
        </div>
      </div>

      <div className="mt-7">
        <input
          type="range"
          min={0}
          max={cfg.maxHours}
          step={cfg.step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-labelledby={id}
          aria-valuetext={`${hours(value)}, ${price(value * rate)} ${t.net}`}
          className="scope-range"
          style={{ '--fill': fill } as React.CSSProperties}
        />
        {/* Znaczniki 4 / 8 / 12 / 16 h */}
        <div className="relative mt-2 h-6" aria-hidden="true">
          {cfg.marks.map((mark) => {
            const left = (mark / cfg.maxHours) * 100
            const reached = value >= mark
            return (
              <span
                key={mark}
                className={`absolute top-0 flex -translate-x-1/2 flex-col items-center text-xs font-semibold whitespace-nowrap ${
                  reached ? 'text-navy-900' : 'text-ink-muted/70'
                } ${left === 100 ? '!-translate-x-full items-end' : ''}`}
                style={{ left: `${left}%` }}
              >
                <span className={`mb-1 h-1.5 w-px ${reached ? 'bg-gold' : 'bg-beige-deep'}`} />
                {hours(mark)}
              </span>
            )
          })}
        </div>
      </div>

      <p className="mt-5 text-sm text-ink-muted">{t.scope.sliderHint}</p>
      {extraHours > 0 && (
        <p className="mt-3 flex gap-2.5 rounded-xl bg-gold-soft/60 px-3.5 py-2.5 text-sm text-graphite">
          <Icon name="sparkle" size={17} className="mt-0.5 shrink-0 text-gold-ink" />
          <span>
            <strong className="font-semibold text-navy-900">
              {t.scope.remaining}: {hours(extraHours)}
            </strong>{' '}
            — {extraLabel}
          </span>
        </p>
      )}
    </section>
  )
}

type CtaStatus = 'empty' | 'add' | 'update' | 'added'

function ScopeSummary({
  service,
  resolved,
  status,
}: {
  service: Service
  resolved: ReturnType<typeof resolveScope>
  status: CtaStatus
}) {
  const { t, price, lang } = useI18n()
  const hours = (h: number) => t.scope.hours(formatHours(h, lang))

  return (
    <aside aria-label={t.scope.summaryTitle} className="flex flex-col rounded-2xl bg-navy-900 p-6 text-ivory shadow-lift">
      <h3 className="text-[1.45rem] !text-ivory">{t.scope.summaryTitle}</h3>
      <dl className="mt-4 space-y-2 border-b border-white/10 pb-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-ivory/65">{t.scope.areas}</dt>
          <dd className="font-semibold">{resolved.tasks.length}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ivory/65">{t.scope.workTime}</dt>
          <dd className="font-semibold">{hours(resolved.hours)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-ivory/65">{t.scope.cost}</dt>
          <dd className="font-serif text-2xl font-semibold text-gold-light">
            {price(resolved.hours * resolved.rateNet)} <span className="font-sans text-xs text-ivory/65">{t.net}</span>
          </dd>
        </div>
      </dl>

      {resolved.tasks.length > 0 || resolved.extraHours > 0 ? (
        <ul className="mt-4 flex-1 space-y-2 text-sm">
          {resolved.tasks.map((task) => (
            <li key={task.id} className="flex gap-2.5">
              <Icon name="check" size={16} className="mt-0.5 shrink-0 text-gold-light" />
              <span className="flex-1 leading-snug">{task.title}</span>
              <span className="text-xs whitespace-nowrap text-ivory/60">{hours(task.hours)}</span>
            </li>
          ))}
          {resolved.extraHours > 0 && (
            <li className="mt-3 rounded-xl border border-gold-light/25 bg-white/5 p-3">
              <p className="flex justify-between gap-3 font-semibold">
                <span>{t.scope.extraTime}</span>
                <span className="text-gold-light">{hours(resolved.extraHours)}</span>
              </p>
              <p className="mt-1 text-xs leading-snug text-ivory/65">{resolved.extraLabel}</p>
            </li>
          )}
        </ul>
      ) : (
        <p className="mt-4 flex-1 text-sm text-ivory/65">{t.scope.empty}</p>
      )}

      <div className="mt-5">
        <ScopeCta serviceId={service.id} status={status} dark />
      </div>
    </aside>
  )
}

function ScopeCta({
  serviceId,
  status,
  dark = false,
  compact = false,
}: {
  serviceId: string
  status: CtaStatus
  dark?: boolean
  compact?: boolean
}) {
  const { t } = useI18n()
  const { commitScope, remove } = useOffer()
  const base = compact ? 'w-full sm:w-auto' : 'w-full'

  if (status === 'added') {
    return (
      <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${compact ? '' : 'justify-between'}`}>
        <span className={`inline-flex items-center gap-2 text-sm font-semibold ${dark ? 'text-gold-light' : 'text-gold-ink'}`}>
          <Icon name="check" size={18} />
          {t.scope.added}
        </span>
        <button
          type="button"
          onClick={() => remove(serviceId)}
          className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium underline-offset-4 hover:underline ${
            dark ? 'text-ivory/70 hover:text-ivory' : 'text-ink-muted hover:text-navy-900'
          }`}
        >
          <Icon name="close" size={16} />
          {t.remove}
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => commitScope(serviceId)}
      disabled={status === 'empty'}
      className={`${dark ? 'btn-gold px-4 text-sm' : 'btn-primary'} ${base}`}
    >
      <Icon name={status === 'update' ? 'check' : 'plus'} size={18} />
      {status === 'update' ? t.scope.update : t.scope.add}
    </button>
  )
}
