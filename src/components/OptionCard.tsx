import type { Service } from '../data/offer'
import { useOffer } from '../state/OfferContext'
import { CheckList, Expandable, Price, ServiceAction, Tag } from './ui'

/** Karta wariantu w grupie wykluczających się opcji (branding, strona, outreach). */
export function OptionCard({ service }: { service: Service }) {
  const { isSelected } = useOffer()
  const selected = isSelected(service.id)

  return (
    <article
      aria-label={service.title}
      className={`relative flex flex-col rounded-2xl border bg-white p-6 transition-all duration-300 sm:p-7 ${
        selected
          ? 'border-gold shadow-lift ring-1 ring-gold/60'
          : 'border-line shadow-soft hover:-translate-y-0.5 hover:shadow-lift'
      }`}
    >
      <div className="mb-4 flex min-h-7 flex-wrap items-center gap-2">
        {service.tag && <Tag tone={service.recommended ? 'navy' : 'gold'}>{service.tag}</Tag>}
        {selected && (
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-gold-ink">Wybrany wariant</span>
        )}
      </div>

      <h3 className="text-[1.75rem]">
        {service.cardTitle ? (
          <>
            <span className="sr-only">{service.title}</span>
            <span aria-hidden="true">{service.cardTitle}</span>
          </>
        ) : (
          service.title
        )}
      </h3>
      <div className="mt-3">
        <Price service={service} />
      </div>
      <p className="mt-3 text-[0.98rem] text-ink-muted">{service.description}</p>

      <div className="mt-6 flex-1">
        <Expandable>
          {service.includesLead && <p className="mb-3 text-sm font-semibold text-gold-ink">{service.includesLead}</p>}
          <CheckList items={service.includes} columns={1} />
          {service.extraList && (
            <div className="mt-5 rounded-xl bg-ivory p-4">
              <p className="mb-2.5 text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">{service.extraList.label}</p>
              <ul className="flex flex-wrap gap-2">
                {service.extraList.items.map((item) => (
                  <li key={item} className="rounded-full border border-line bg-white px-3 py-1 text-sm text-navy-900">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Expandable>
      </div>

      <div className="mt-4">
        <ServiceAction service={service} full />
      </div>
    </article>
  )
}
