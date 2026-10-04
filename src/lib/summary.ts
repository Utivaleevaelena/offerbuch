import { SERVICES, getService, getStage, stageNumber, type Service } from './offer.js'

export function formatPLN(value: number): string {
  // Polska notacja: spacja jako separator tysięcy (również dla liczb 4-cyfrowych).
  const digits = Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${digits} zł`
}

/** Usuwa nieznane identyfikatory i duplikaty, wymusza wykluczanie się wariantów. */
export function sanitizeSelection(ids: unknown): string[] {
  if (!Array.isArray(ids)) return []
  const result: string[] = []
  const usedGroups = new Set<string>()
  for (const id of ids) {
    if (typeof id !== 'string') continue
    const service = getService(id)
    if (!service || result.includes(id)) continue
    if (service.exclusiveGroup) {
      if (usedGroups.has(service.exclusiveGroup)) continue
      usedGroups.add(service.exclusiveGroup)
    }
    result.push(id)
  }
  return orderSelection(result)
}

/** Sortuje wybrane usługi w rekomendowanej kolejności etapów. */
export function orderSelection(ids: string[]): string[] {
  const order = new Map(SERVICES.map((s, i) => [s.id, i]))
  return [...ids].sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
}

export interface OfferSummary {
  items: Service[]
  oneTimeItems: Service[]
  monthlyItems: Service[]
  oneTimeTotal: number
  monthlyTotal: number
}

export function summarize(ids: string[]): OfferSummary {
  const items = sanitizeSelection(ids).map((id) => getService(id)!)
  const oneTimeItems = items.filter((s) => s.billing === 'one_time')
  const monthlyItems = items.filter((s) => s.billing === 'monthly')
  return {
    items,
    oneTimeItems,
    monthlyItems,
    oneTimeTotal: oneTimeItems.reduce((sum, s) => sum + s.priceNet, 0),
    monthlyTotal: monthlyItems.reduce((sum, s) => sum + s.priceNet, 0),
  }
}

export function stageLabel(service: Service): string {
  return `Etap ${stageNumber(service.category)} · ${getStage(service.category).navLabel}`
}

export function priceLabel(service: Service): string {
  return service.billing === 'monthly'
    ? `${formatPLN(service.priceNet)} netto / mies.`
    : `${formatPLN(service.priceNet)} netto`
}
