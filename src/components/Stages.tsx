import { getCategory, getService, priceRange, servicesInCategory, type CategoryId } from '../data/offer'
import { formatPLN } from '../lib/summary'
import { Icon } from './Icon'
import { OptionCard } from './OptionCard'
import { CheckList, Expandable, Price, ProcessFlow, ServiceAction, StageHeader, Tag } from './ui'

function Section({ id, children }: { id: CategoryId; children: React.ReactNode }) {
  const category = getCategory(id)
  return (
    <section id={category.anchor} aria-label={`Etap ${category.stage}: ${category.label}`} className="scroll-mt-24 py-16 sm:py-20">
      {children}
    </section>
  )
}

// ───────────────────────── ETAP 1 ─────────────────────────
export function StrategyStage() {
  const service = getService('strategy')!
  return (
    <Section id="strategy">
      <StageHeader
        stage={1}
        eyebrow="Audyt + strategia + pozycjonowanie"
        title="Najpierw ustalamy, co, komu i dlaczego chcemy sprzedawać."
      />
      <article aria-label={service.title} className="card overflow-hidden">
        <div className="p-6 sm:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Tag tone="navy">{service.tag}</Tag>
              <h3 className="mt-4 text-[1.85rem] sm:text-[2.1rem]">{service.title}</h3>
            </div>
            <div className="sm:text-right">
              <Price service={service} large />
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-[1.02rem] text-ink-muted">{service.description}</p>

          {/* Kierunek komunikacji */}
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold-soft/80 to-ivory p-6 sm:p-8">
            <p className="eyebrow flex items-center gap-2">
              <Icon name="compass" size={16} />
              Kierunek komunikacji
            </p>
            <blockquote className="mt-4 font-serif text-[1.65rem] leading-snug text-navy-900 sm:text-[2rem]">
              „Zanim zmienisz księgowość, sprawdź, czy naprawdę warto.”
            </blockquote>
            <p className="mt-4 max-w-2xl text-graphite">
              Zamiast namawiać firmę od razu do zmiany biura rachunkowego, rozpoczynamy relację od diagnozy obecnego modelu
              księgowości.
            </p>
            <div className="mt-6">
              <ProcessFlow
                tone="soft"
                size="sm"
                label="Obszary diagnozy"
                steps={['Procesy', 'Raportowanie', 'Ryzyka', 'Koszty', 'Usprawnienia']}
              />
            </div>
          </div>

          <div className="mt-8">
            <Expandable>
              <CheckList items={service.includes} />
            </Expandable>
          </div>
        </div>
        <div className="border-t border-line bg-ivory/60 px-6 py-5 sm:px-9">
          <ServiceAction service={service} full />
        </div>
      </article>
    </Section>
  )
}

// ───────────────────────── ETAP 2 ─────────────────────────
export function BrandingStage() {
  return (
    <Section id="branding">
      <StageHeader
        stage={2}
        eyebrow="Identyfikacja wizualna"
        title="Branding"
        intro="Spójny system wizualny pozwoli połączyć stronę internetową, sesję, social media i materiały sprzedażowe w jedną rozpoznawalną markę."
        aside={<ExclusiveNote>Wybierz jeden z dwóch wariantów.</ExclusiveNote>}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {servicesInCategory('branding').map((s) => (
          <OptionCard key={s.id} service={s} />
        ))}
      </div>
    </Section>
  )
}

// ───────────────────────── ETAP 3 ─────────────────────────
export function SessionStage() {
  const service = getService('session')!
  return (
    <Section id="session">
      <StageHeader stage={3} eyebrow="Sesja wizerunkowa" title="Profesjonalny wizerunek marki" />
      <article aria-label={service.title} className="card overflow-hidden">
        <div className="p-6 sm:p-9">
            <div className="flex flex-wrap items-center gap-3">
              <Tag>{service.tag}</Tag>
            </div>
            <h3 className="mt-4 text-[1.85rem] sm:text-[2.1rem]">{service.title}</h3>
            <div className="mt-3">
              <Price service={service} large />
              <p className="mt-1 text-sm text-ink-muted">VAT zostanie doliczony zgodnie z obowiązującymi zasadami.</p>
            </div>
            <p className="mt-5 max-w-2xl text-[1.02rem] text-ink-muted">{service.description}</p>

            <ul className="mt-7 grid grid-cols-3 gap-3 text-center" aria-label="Rodzaje materiałów">
              {[
                { icon: 'camera', label: 'Fotografia' },
                { icon: 'monitor', label: 'Video i B-roll' },
                { icon: 'users', label: 'Portrety i zdjęcia wspólne' },
              ].map((m) => (
                <li key={m.label} className="rounded-xl border border-line bg-ivory/70 px-2 py-4">
                  <Icon name={m.icon as 'camera'} size={22} className="mx-auto text-gold" />
                  <span className="mt-2 block text-[0.8rem] leading-tight font-semibold text-navy-900">{m.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Expandable>
                <CheckList items={service.includes} />
              </Expandable>
            </div>

            <p className="mt-2 flex gap-3 rounded-xl bg-ivory p-4 text-sm text-ink-muted">
              <Icon name="info" size={18} className="mt-0.5 shrink-0 text-gold" />
              <span>
                Surowe materiały video są przekazywane klientowi.
                <br />
                Montaż video może zostać wyceniony osobno.
              </span>
            </p>
        </div>
        <div className="border-t border-line bg-ivory/60 px-6 py-5 sm:px-9">
          <ServiceAction service={service} full />
        </div>
      </article>
    </Section>
  )
}

// ───────────────────────── ETAP 4 ─────────────────────────
export function WebsiteStage() {
  const range = priceRange('website')
  return (
    <Section id="website">
      <StageHeader
        stage={4}
        eyebrow="Nowa strona internetowa"
        title="Strona, która nie tylko prezentuje kancelarię, ale prowadzi potencjalnego klienta do kontaktu."
        aside={
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm">
              <span className="text-ink-muted">Szacunkowy budżet:</span>
              <strong className="font-semibold text-navy-900">
                {formatPLN(range.min).replace(' zł', '')}–{formatPLN(range.max)} netto
              </strong>
            </span>
            <ExclusiveNote>Wybierz jeden z dwóch wariantów.</ExclusiveNote>
          </div>
        }
      />
      <div className="grid gap-6 md:grid-cols-2">
        {servicesInCategory('website').map((s) => (
          <OptionCard key={s.id} service={s} />
        ))}
      </div>
    </Section>
  )
}

export function ExclusiveNote({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
      <Icon name="layers" size={16} className="text-gold" />
      {children}
    </span>
  )
}
