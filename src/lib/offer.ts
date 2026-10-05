/**
 * Pomocnicze funkcje nad treścią oferty. Każda przyjmuje opcjonalnie ofertę w danym
 * języku (domyślnie polska wersja bazowa) — ceny i identyfikatory są wspólne.
 */
import { PROPOSAL } from '../content/proposal.js'
import type { Proposal, Service, Stage } from '../content/types.js'

export type { Billing, Block, Proposal, Service, Stage } from '../content/types.js'

export const SERVICES: Service[] = PROPOSAL.services
export const STAGES: Stage[] = PROPOSAL.stages

export function getService(id: string, p: Proposal = PROPOSAL): Service | undefined {
  return p.services.find((s) => s.id === id)
}

export function getStage(id: string, p: Proposal = PROPOSAL): Stage {
  const stage = p.stages.find((s) => s.id === id)
  if (!stage) throw new Error(`Nieznany etap: ${id}`)
  return stage
}

/** Numer etapu (1, 2, 3…) — wynika z kolejności w `stages`. */
export function stageNumber(id: string): number {
  return STAGES.findIndex((s) => s.id === id) + 1
}

export function servicesInStage(id: string, p: Proposal = PROPOSAL): Service[] {
  return p.services.filter((s) => s.category === id)
}

/** Zakres cen w etapie, np. 1 500–3 500 zł. */
export function priceRange(id: string): { min: number; max: number } {
  const prices = servicesInStage(id).map((s) => s.priceNet)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}
