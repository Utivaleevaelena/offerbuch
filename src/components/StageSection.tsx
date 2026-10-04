import { priceRange, servicesInStage, stageNumber, type Service, type Stage } from '../lib/offer'
import { formatPLN } from '../lib/summary'
import { Blocks } from './Blocks'
import { Icon } from './Icon'
import { OptionCard } from './OptionCard'
import { CheckList, Emphasis, Expandable, Price, ServiceAction, StageHeader, Tag } from './ui'

/** Jeden etap oferty — w całości budowany z danych w src/content/proposal.ts. */
export function StageSection({ stage }: { stage: Stage }) {
  const number = stageNumber(stage.id)
  const services = servicesInStage(stage.id)
  const single = services.length === 1
  const options = stage.options
  const range = priceRange(stage.id)

  const aside =
    !single && (options?.showPriceRange || (options?.hint && !options.title)) ? (
      <div className="flex flex-wrap items-center gap-3">
        {options?.showPriceRange && (
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm">
            <span className="text-ink-muted">Szacunkowy budżet:</span>
            <strong className="font-semibold text-navy-900">
              {formatPLN(range.min).replace(' zł', '')}–{formatPLN(range.max)} netto
            </strong>
          </span>
        )}
        {options?.hint && !options.title && <Hint>{options.hint}</Hint>}
      </div>
    ) : undefined

  return (
    <section
      id={stage.anchor}
      aria-label={`Etap ${number}: ${stage.label}`}
      className="scroll-mt-24 py-16 sm:py-20"
    >
      <StageHeader
        stage={number}
        eyebrow={stage.eyebrow}
        title={<Emphasis text={stage.title} />}
        intro={stage.intro?.map((p, i) => (
          <p key={i} className={i > 0 ? 'mt-3' : undefined}>
            {p}
          </p>
        ))}
        aside={aside}
      />

      {stage.blocks && <Blocks blocks={stage.blocks} />}

      {single ? (
        <SingleServiceCard service={services[0]} stage={stage} />
      ) : (
        <>
          {options?.title && (
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {options.eyebrow && <p className="eyebrow">{options.eyebrow}</p>}
                <h3 className="mt-3 text-[1.9rem] sm:text-[2.2rem]">{options.title}</h3>
              </div>
              {options.hint && <Hint>{options.hint}</Hint>}
            </div>
          )}
          <div className={`grid gap-6 ${services.length >= 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'}`}>
            {services.map((s) => (
              <OptionCard key={s.id} service={s} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function SingleServiceCard({ service, stage }: { service: Service; stage: Stage }) {
  return (
    <article aria-label={service.title} className="card overflow-hidden">
      <div className="p-6 sm:p-9">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {service.tag && <Tag tone={service.recommended ? 'navy' : 'gold'}>{service.tag}</Tag>}
            <h3 className="mt-4 text-[1.85rem] sm:text-[2.1rem]">{service.title}</h3>
          </div>
          <div className="sm:text-right">
            <Price service={service} large />
            {service.priceNote && <p className="mt-1 max-w-56 text-sm text-ink-muted sm:ml-auto">{service.priceNote}</p>}
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-[1.02rem] text-ink-muted">{service.description}</p>

        {stage.cardBlocks && <Blocks blocks={stage.cardBlocks} inCard />}

        <div className="mt-8">
          <Expandable>
            {service.includesLead && <p className="mb-3 text-sm font-semibold text-gold-ink">{service.includesLead}</p>}
            <CheckList items={service.includes} />
          </Expandable>
        </div>

        {stage.cardAfter && (
          <div className="-mt-6">
            <Blocks blocks={stage.cardAfter} inCard />
          </div>
        )}
      </div>
      <div className="border-t border-line bg-ivory/60 px-6 py-5 sm:px-9">
        <ServiceAction service={service} full />
      </div>
    </article>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
      <Icon name="layers" size={16} className="text-gold" />
      {children}
    </span>
  )
}
