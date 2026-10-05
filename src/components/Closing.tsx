import { useI18n } from '../i18n/I18nContext'
import { useOffer } from '../state/OfferContext'
import { Logo } from './Header'
import { Icon } from './Icon'

export function Closing({ onSend }: { onSend: () => void }) {
  const { summary } = useOffer()
  const empty = summary.items.length === 0
  const { proposal, t } = useI18n()
  const { closing } = proposal
  return (
    <section aria-labelledby="closing-title" className="py-16 sm:py-20">
      <div className="card p-7 text-center sm:p-12">
        <p className="eyebrow">{closing.eyebrow}</p>
        <h2 id="closing-title" className="mx-auto mt-4 max-w-xl text-[2.1rem] sm:text-[2.6rem]">
          {closing.title}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-ink-muted">
          {closing.text}
        </p>
        <ol className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2 text-sm text-ink-muted" aria-label={t.howItWorks}>
          {closing.journey.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-line bg-ivory px-3 py-1">{step}</span>
              {i < closing.journey.length - 1 && <Icon name="arrowRight" size={14} className="text-gold" />}
            </li>
          ))}
        </ol>
        <button type="button" onClick={onSend} disabled={empty} className="btn-primary mt-9 px-8">
          <Icon name="send" size={18} />
          {t.sendOffer}
        </button>
        {empty && <p className="mt-3 text-sm text-ink-muted">{t.addAtLeastOne}</p>}
      </div>
    </section>
  )
}

export function Footer() {
  const { proposal, t } = useI18n()
  return (
    <footer className="bg-navy-950 text-ivory/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 pb-32 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:pb-12">
        <Logo light />
        <div className="text-sm lg:text-right">
          <p>
            {t.preparedByFooter} <strong className="font-semibold text-ivory">{proposal.agency.name}</strong>
          </p>
          <p className="mt-1 text-ivory/50">
            {t.allPricesNet} © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}
