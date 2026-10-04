/**
 * Pomocnicze funkcje nad treścią oferty (src/content/proposal.ts).
 * Wspólne dla interfejsu i funkcji serwerowej.
 */
import { PROPOSAL } from '../content/proposal.js'
import type { Service, Stage } from '../content/types.js'

export type { Billing, Block, Service, Stage } from '../content/types.js'

export const SERVICES: Service[] = PROPOSAL.services
export const STAGES: Stage[] = PROPOSAL.stages

const SERVICE_MAP = new Map(SERVICES.map((s) => [s.id, s]))

export function getService(id: string): Service | undefined {
  return SERVICE_MAP.get(id)
}

export function getStage(id: string): Stage {
  const stage = STAGES.find((s) => s.id === id)
  if (!stage) throw new Error(`Nieznany etap: ${id}`)
  return stage
}

/** Numer etapu (1, 2, 3…) — wynika z kolejności w `stages`. */
export function stageNumber(id: string): number {
  return STAGES.findIndex((s) => s.id === id) + 1
}

export function servicesInStage(id: string): Service[] {
  return SERVICES.filter((s) => s.category === id)
}

/** Zakres cen w etapie, np. 1 500–3 500 zł. */
export function priceRange(id: string): { min: number; max: number } {
  const prices = servicesInStage(id).map((s) => s.priceNet)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

/** Komunikat przy zmianie wariantu w grupie wykluczającej się. */
export function groupChangeMessage(service: Service): string {
  return getStage(service.category).options?.changeMessage ?? 'Zmieniono wariant'
}
