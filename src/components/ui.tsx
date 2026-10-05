import { useId, useState, type ReactNode } from 'react'
import type { Service } from '../lib/offer'
import { useI18n } from '../i18n/I18nContext'
import { useOffer } from '../state/OfferContext'
import { Icon } from './Icon'

/** Renderuje tekst, wyróżniając fragmenty w *gwiazdkach*. */
export function Emphasis({ text, className = 'text-gold-ink' }: { text: string; className?: string }) {
  const parts = text.split(/\*([^*]+)\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className={className}>
            {part}
          </em>
        ) : (
          part
        ),
      )}
    </>
  )
}

/** Wizualny proces: KROK → KROK → KROK. */
export function ProcessFlow({
  steps,
  tone = 'light',
  size = 'md',
  label,
}: {
  steps: string[]
  tone?: 'light' | 'dark' | 'soft'
  size?: 'sm' | 'md'
  label: string
}) {
  const pill = {
    light: 'border-line bg-white text-navy-900',
    soft: 'border-gold/30 bg-white/70 text-navy-900',
    dark: 'border-white/15 bg-white/5 text-ivory',
  }[tone]
  const arrow = tone === 'dark' ? 'text-gold-light' : 'text-gold'
  const text = size === 'sm' ? 'text-[0.8rem] px-3 py-1.5' : 'text-xs sm:text-[0.8rem] tracking-[0.14em] uppercase px-4 py-2.5'
  return (
    <ol aria-label={label} className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-2 rounded-full border font-semibold ${pill} ${text}`}>
            {size === 'md' && <span className={`font-serif text-base tracking-normal ${arrow}`}>{i + 1}</span>}
            {step}
          </span>
          {i < steps.length - 1 && <Icon name="arrowRight" size={16} className={arrow} />}
        </li>
      ))}
    </ol>
  )
}

/** Rozwijana sekcja „Co obejmuje?”. */
export function Expandable({
  title,
  children,
  defaultOpen = false,
}: {
  title?: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className="border-t border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-[0.95rem] font-semibold text-navy-900 transition-colors hover:text-gold-ink"
      >
        {title ?? t.whatsIncluded}
        <span
          className={`grid size-8 place-items-center rounded-full border border-line transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <Icon name="chevronDown" size={16} />
        </span>
      </button>
      <div
        id={id}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        inert={!open}
      >
        <div className="overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function CheckList({ items, columns = 2 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-x-6 gap-y-2.5 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[0.95rem] leading-snug text-graphite">
          <Icon name="check" size={18} className="mt-px shrink-0 text-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Tag({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'navy' | 'outline' }) {
  const cls = {
    gold: 'bg-gold-soft text-gold-ink',
    navy: 'bg-navy-900 text-gold-light',
    outline: 'border border-line text-ink-muted',
  }[tone]
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-[0.16em] uppercase ${cls}`}>
      {children}
    </span>
  )
}

export function Price({ service, large = false }: { service: Service; large?: boolean }) {
  const { t, price } = useI18n()
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5">
      <span className={`font-serif font-semibold text-navy-900 ${large ? 'text-4xl sm:text-[2.6rem]' : 'text-3xl'}`}>
        {price(service.priceNet)}
      </span>
      <span className="text-sm font-medium text-ink-muted">{service.billing === 'monthly' ? t.perMonth : t.net}</span>
    </p>
  )
}

/** Przycisk dodawania usługi + stan „Dodano” i możliwość usunięcia. */
export function ServiceAction({ service, full = false }: { service: Service; full?: boolean }) {
  const { isSelected, add, remove } = useOffer()
  const { t } = useI18n()
  const selected = isSelected(service.id)
  const width = full ? 'w-full sm:w-auto' : ''
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {selected ? (
        <>
          <span className="btn-selected px-5">
            <Icon name="check" size={18} className="text-gold-ink" />
            {t.addedToOffer}
          </span>
          <button
            type="button"
            onClick={() => remove(service.id)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-ink-muted underline-offset-4 hover:text-navy-900 hover:underline"
            aria-label={t.removeFromOffer(service.summaryTitle)}
          >
            <Icon name="close" size={16} />
            {t.remove}
          </button>
        </>
      ) : (
        <button type="button" onClick={() => add(service.id)} className={`btn-primary ${width}`}>
          <Icon name="plus" size={18} />
          {service.cta}
        </button>
      )}
    </div>
  )
}

export function StageHeader({
  stage,
  eyebrow,
  title,
  intro,
  aside,
}: {
  stage: number
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  aside?: ReactNode
}) {
  const { t } = useI18n()
  return (
    <header className="mb-8 sm:mb-10">
      <div className="mb-5 flex items-center gap-4">
        <span className="font-serif text-5xl leading-none text-gold sm:text-6xl" aria-hidden="true">
          {String(stage).padStart(2, '0')}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
        <span className="eyebrow">
          <span className="sr-only">
            {t.stage} {stage}:{' '}
          </span>
          {eyebrow}
        </span>
      </div>
      <h2 className="text-[2rem] sm:text-[2.6rem]">{title}</h2>
      {intro && <div className="mt-4 max-w-2xl text-[1.05rem] text-ink-muted">{intro}</div>}
      {aside && <div className="mt-5">{aside}</div>}
    </header>
  )
}
