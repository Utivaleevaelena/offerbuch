/**
 * Wersje językowe oferty.
 *
 * Polski (proposal.ts) jest wersją bazową: zawiera strukturę, ceny i identyfikatory.
 * Pliki w translations/ zawierają WYŁĄCZNIE teksty — brakujące pola zostają po polsku.
 */
import { DEFAULT_LANG, type Lang } from '../i18n/ui.js'
import { PROPOSAL } from './proposal.js'
import { TRANSLATIONS } from './translations/index.js'
import type { Proposal, Service, Stage } from './types.js'

type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

/** Teksty etapu (bez id i kotwicy — te są wspólne dla wszystkich języków). */
export type StageTranslation = DeepPartial<Omit<Stage, 'id' | 'anchor'>>
/** Teksty usługi (bez ceny i logiki — te są wspólne dla wszystkich języków). */
export type ServiceTranslation = DeepPartial<Omit<Service, 'id' | 'category' | 'priceNet' | 'billing' | 'exclusiveGroup'>>

export interface ProposalTranslation
  extends DeepPartial<Omit<Proposal, 'id' | 'stages' | 'services' | 'recommended'>> {
  recommended?: DeepPartial<Omit<NonNullable<Proposal['recommended']>, 'afterStage' | 'serviceIds'>>
  /** Klucz = id etapu. */
  stages?: Record<string, StageTranslation>
  /** Klucz = id usługi. */
  services?: Record<string, ServiceTranslation>
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * Nakłada tłumaczenie na wersję bazową. Obiekty są łączone rekurencyjnie, tablice obiektów
 * (np. bloki) — po indeksie, a tablice tekstów (np. „Co obejmuje?”) są zastępowane w całości.
 */
function deepMerge<T>(base: T, overlay: unknown): T {
  if (overlay === undefined || overlay === null) return base
  if (Array.isArray(base) && Array.isArray(overlay)) {
    if (base.some(isObject)) return base.map((item, i) => deepMerge(item, overlay[i])) as T
    return overlay as T
  }
  if (isObject(base) && isObject(overlay)) {
    const result: Record<string, unknown> = { ...base }
    for (const [key, value] of Object.entries(overlay)) result[key] = deepMerge(result[key], value)
    return result as T
  }
  return overlay as T
}

function translate(base: Proposal, tr: ProposalTranslation): Proposal {
  const { stages, services, ...rest } = tr
  const merged = deepMerge(base, rest)
  return {
    ...merged,
    id: base.id,
    recommended: base.recommended && {
      ...merged.recommended!,
      afterStage: base.recommended.afterStage,
      serviceIds: base.recommended.serviceIds,
    },
    stages: base.stages.map((s) => ({ ...deepMerge(s, stages?.[s.id]), id: s.id, anchor: s.anchor })),
    services: base.services.map((s) => ({
      ...deepMerge(s, services?.[s.id]),
      id: s.id,
      category: s.category,
      priceNet: s.priceNet,
      billing: s.billing,
      exclusiveGroup: s.exclusiveGroup,
    })),
  }
}

const cache = new Map<Lang, Proposal>()

/** Oferta w danym języku (brakujące tłumaczenia — po polsku). */
export function getProposal(lang: Lang = DEFAULT_LANG): Proposal {
  if (lang === DEFAULT_LANG) return PROPOSAL
  let localized = cache.get(lang)
  if (!localized) {
    const tr = TRANSLATIONS[lang]
    localized = tr ? translate(PROPOSAL, tr) : PROPOSAL
    cache.set(lang, localized)
  }
  return localized
}

/** Języki dostępne w przełączniku: polski + te, dla których istnieje tłumaczenie. */
export const AVAILABLE_LANGS: Lang[] = [
  DEFAULT_LANG,
  ...(Object.keys(TRANSLATIONS) as Lang[]).filter((l) => l !== DEFAULT_LANG),
]
