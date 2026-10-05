import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { PROPOSAL } from '../content/proposal'
import { useI18n } from '../i18n/I18nContext'
import { getService, getStage } from '../lib/offer'
import type { ScopeSelection } from '../content/types'
import { fullSelection, getConfigurator } from '../lib/scope'
import { orderSelection, sanitizeScopes, sanitizeSelection, summarize, type OfferSummary, type Scopes } from '../lib/summary'

const STORAGE_KEY = `offer-selection:${PROPOSAL.id}`
const SCOPES_KEY = `offer-scopes:${PROPOSAL.id}`

interface Toast {
  id: number
  message: string
}

interface OfferContextValue {
  selected: string[]
  summary: OfferSummary
  isSelected: (id: string) => boolean
  add: (id: string) => void
  remove: (id: string) => void
  addRecommendedSet: () => void
  /** Zakresy usług godzinowych zapisane w ofercie. */
  scopes: Scopes
  /** Robocze zakresy w konfiguratorze (przed dodaniem do oferty). */
  drafts: Scopes
  setDraft: (serviceId: string, selection: ScopeSelection) => void
  /** Dodaje / aktualizuje usługę godzinową z bieżącym zakresem z konfiguratora. */
  commitScope: (serviceId: string) => void
  toast: Toast | null
  notify: (message: string) => void
}

const OfferContext = createContext<OfferContextValue | null>(null)

function readStored(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? sanitizeSelection(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

function readStoredScopes(): { scopes: Scopes; drafts: Scopes } {
  try {
    const raw = JSON.parse(window.localStorage.getItem(SCOPES_KEY) ?? '{}')
    return { scopes: sanitizeScopes(raw.scopes), drafts: sanitizeScopes(raw.drafts) }
  } catch {
    return { scopes: {}, drafts: {} }
  }
}

/** Zakres domyślny usługi godzinowej: roboczy z konfiguratora albo pełny. */
function defaultScope(serviceId: string, drafts: Scopes): ScopeSelection | undefined {
  const cfg = getConfigurator(serviceId)
  return cfg ? (drafts[serviceId] ?? fullSelection(cfg)) : undefined
}

/** Dodaje usługę, usuwając inne warianty z tej samej grupy. */
function withService(current: string[], id: string): { next: string[]; replaced: boolean } {
  const service = getService(id)
  if (!service || current.includes(id)) return { next: current, replaced: false }
  let replaced = false
  const next = current.filter((otherId) => {
    const other = getService(otherId)
    const conflict = !!service.exclusiveGroup && other?.exclusiveGroup === service.exclusiveGroup
    if (conflict) replaced = true
    return !conflict
  })
  return { next: orderSelection([...next, id]), replaced }
}

export function OfferProvider({ children }: { children: ReactNode }) {
  const { t, proposal } = useI18n()
  const [selected, setSelected] = useState<string[]>(readStored)
  const [{ scopes, drafts }, setScopeState] = useState(readStoredScopes)
  const [toast, setToast] = useState<Toast | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected))
    } catch {
      /* brak dostępu do localStorage — wybór działa do końca sesji */
    }
  }, [selected])

  useEffect(() => {
    try {
      window.localStorage.setItem(SCOPES_KEY, JSON.stringify({ scopes, drafts }))
    } catch {
      /* ignorujemy */
    }
  }, [scopes, drafts])

  /** Usługa godzinowa w ofercie musi mieć zakres — jeśli go brak, ustawiamy domyślny. */
  const ensureScopes = useCallback(
    (ids: string[]) => {
      setScopeState((prev) => {
        let changed = false
        const next = { ...prev.scopes }
        for (const id of ids) {
          if (next[id]) continue
          const sel = defaultScope(id, prev.drafts)
          if (sel) {
            next[id] = sel
            changed = true
          }
        }
        return changed ? { ...prev, scopes: next } : prev
      })
    },
    [],
  )

  const notify = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const add = useCallback(
    (id: string) => {
      const service = getService(id)
      if (!service || selected.includes(id)) return
      const { next, replaced } = withService(selected, id)
      setSelected(next)
      ensureScopes([id])
      notify(
        replaced ? (getStage(service.category, proposal).options?.changeMessage ?? t.toastVariantChanged) : t.toastAdded,
      )
    },
    [selected, notify, proposal, t, ensureScopes],
  )

  const remove = useCallback(
    (id: string) => {
      if (!selected.includes(id)) return
      setSelected(selected.filter((s) => s !== id))
      setScopeState((prev) => {
        if (!prev.scopes[id]) return prev
        const { [id]: _removed, ...rest } = prev.scopes
        return { ...prev, scopes: rest }
      })
      notify(t.toastRemoved)
    },
    [selected, notify, t],
  )

  const addRecommendedSet = useCallback(() => {
    const ids = PROPOSAL.recommended?.serviceIds ?? []
    const next = ids.reduce((acc, id) => withService(acc, id).next, selected)
    setSelected(next)
    ensureScopes(ids)
    notify(t.toastSetAdded)
  }, [selected, notify, t, ensureScopes])

  const setDraft = useCallback((serviceId: string, selection: ScopeSelection) => {
    setScopeState((prev) => ({ ...prev, drafts: { ...prev.drafts, [serviceId]: selection } }))
  }, [])

  const commitScope = useCallback(
    (serviceId: string) => {
      const sel = defaultScope(serviceId, drafts)
      if (!sel || sel.hours <= 0) return
      const wasSelected = selected.includes(serviceId)
      setScopeState((prev) => ({ ...prev, scopes: { ...prev.scopes, [serviceId]: sel } }))
      if (!wasSelected) setSelected(withService(selected, serviceId).next)
      notify(wasSelected ? t.scope.toastUpdated : t.scope.toastAdded)
    },
    [drafts, selected, notify, t],
  )

  const value = useMemo<OfferContextValue>(
    () => ({
      selected,
      summary: summarize(selected, proposal, scopes),
      isSelected: (id) => selected.includes(id),
      add,
      remove,
      addRecommendedSet,
      scopes,
      drafts,
      setDraft,
      commitScope,
      toast,
      notify,
    }),
    [selected, add, remove, addRecommendedSet, scopes, drafts, setDraft, commitScope, toast, notify, proposal],
  )

  return <OfferContext.Provider value={value}>{children}</OfferContext.Provider>
}

export function useOffer(): OfferContextValue {
  const ctx = useContext(OfferContext)
  if (!ctx) throw new Error('useOffer musi być użyty wewnątrz OfferProvider')
  return ctx
}
