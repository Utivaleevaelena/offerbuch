import { PROPOSAL } from '../content/proposal.js'
import type { Proposal, Service } from '../content/types.js'
import { DEFAULT_LANG, UI, type Lang } from '../i18n/ui.js'
import { SERVICES, getService, getStage, stageNumber } from './offer.js'

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

/** Podsumowanie wyboru; usługi w języku przekazanej oferty. */
export function summarize(ids: string[], p: Proposal = PROPOSAL): OfferSummary {
  const items = sanitizeSelection(ids).map((id) => getService(id, p)!)
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

/** „Etap 2 · Branding” / „Stage 2 · Branding”. */
export function stageLabel(service: Service, p: Proposal = PROPOSAL, lang: Lang = DEFAULT_LANG): string {
  return `${UI[lang].stage} ${stageNumber(service.category)} · ${getStage(service.category, p).navLabel}`
}
