import { useI18n } from '../i18n/I18nContext'
import { servicesInStage, stageNumber } from '../lib/offer'
import { Icon } from './Icon'
import { Emphasis } from './ui'

export function Hero() {
  const { proposal, t, price } = useI18n()
  const { hero, client, agency, stages } = proposal

  const fromPrice = (stageId: string) => {
    const services = servicesInStage(stageId)
    const min = Math.min(...services.map((s) => s.priceNet))
    const monthly = services[0]?.billing === 'monthly'
    return `${services.length > 1 ? `${t.from} ` : ''}${price(min)}${monthly ? ` / ${t.perMonthShort.split(' / ')[1]}` : ''}`
  }

  return (
    <section id="top" className="relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] size-[36rem] rounded-full bg-gold-soft/70 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8">
        <div className="animate-fade-up">
          <p className="eyebrow flex flex-wrap items-center gap-3">
            {hero.eyebrow}
            <span className="h-px w-8 bg-gold/60" aria-hidden="true" />
            <span className="tracking-[0.18em] text-ink-muted">{agency.name}</span>
          </p>
          <h1 id="hero-title" className="mt-6 text-[2.6rem] sm:text-6xl lg:text-[4.1rem]">
            <Emphasis text={hero.title} />
          </h1>
          <p className="mt-6 max-w-xl text-lg text-graphite sm:text-xl sm:leading-relaxed">{hero.subtitle}</p>
          <p className="mt-5 max-w-xl text-ink-muted">{hero.body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={`#${stages[0]?.anchor ?? 'oferta'}`} className="btn-primary px-7">
              {hero.primaryCta}
              <Icon name="arrowRight" size={18} />
            </a>
            <a href="#etapy" className="btn-outline px-7">
              {hero.secondaryCta}
            </a>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-ink-muted">
            <Icon name="check" size={18} className="text-gold" />
            {hero.reassurance}
          </p>
        </div>

        {/* Okładka propozycji */}
        <aside
          aria-label={t.proposalSummary}
          className="animate-fade-up relative rounded-[1.75rem] bg-navy-900 p-7 text-ivory shadow-lift sm:p-9"
        >
          <div aria-hidden="true" className="absolute inset-3 rounded-[1.25rem] border border-gold-light/20" />
          <div className="relative">
            <p className="text-[0.68rem] font-semibold tracking-[0.26em] text-gold-light uppercase">{t.preparedFor}</p>
            <p className="mt-2 font-serif text-2xl leading-tight">{client.fullName}</p>
            <p className="mt-4 text-[0.68rem] font-semibold tracking-[0.26em] text-gold-light uppercase">{t.preparedBy}</p>
            <p className="mt-1.5 text-sm font-semibold tracking-[0.12em]">{agency.name}</p>

            <ol className="mt-8 space-y-0 border-t border-white/10">
              {stages.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.anchor}`}
                    className="group flex items-center gap-4 border-b border-white/10 py-3.5 transition-colors hover:text-gold-light"
                  >
                    <span className="w-6 font-serif text-lg text-gold-light">{stageNumber(s.id)}</span>
                    <span className="flex-1 text-[0.95rem]">{s.navLabel}</span>
                    <span className="text-right text-xs whitespace-nowrap text-ivory/60 group-hover:text-gold-light">
                      {fromPrice(s.id)}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-xs text-ivory/60">{t.allPricesNet}</p>
          </div>
        </aside>
      </div>
    </section>
  )
}
