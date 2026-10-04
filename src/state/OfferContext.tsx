import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { GROUP_CHANGE_MESSAGES, RECOMMENDED_SET, getService } from '../data/offer'
import { orderSelection, sanitizeSelection, summarize, type OfferSummary } from '../lib/summary'

const STORAGE_KEY = 'gw-offer-selection-v1'

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
  const [selected, setSelected] = useState<string[]>(readStored)
  const [toast, setToast] = useState<Toast | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected))
    } catch {
      /* brak dostępu do localStorage — wybór działa do końca sesji */
    }
  }, [selected])

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
      notify(replaced && service.exclusiveGroup ? GROUP_CHANGE_MESSAGES[service.exclusiveGroup] : 'Dodano do oferty')
    },
    [selected, notify],
  )

  const remove = useCallback(
    (id: string) => {
      if (!selected.includes(id)) return
      setSelected(selected.filter((s) => s !== id))
      notify('Usunięto z oferty')
    },
    [selected, notify],
  )

  const addRecommendedSet = useCallback(() => {
    const next = RECOMMENDED_SET.reduce((acc, id) => withService(acc, id).next, selected)
    setSelected(next)
    notify('Dodano rekomendowany zestaw')
  }, [selected, notify])

  const value = useMemo<OfferContextValue>(
    () => ({
      selected,
      summary: summarize(selected),
      isSelected: (id) => selected.includes(id),
      add,
      remove,
      addRecommendedSet,
      toast,
      notify,
    }),
    [selected, add, remove, addRecommendedSet, toast, notify],
  )

  return <OfferContext.Provider value={value}>{children}</OfferContext.Provider>
}

export function useOffer(): OfferContextValue {
  const ctx = useContext(OfferContext)
  if (!ctx) throw new Error('useOffer musi być użyty wewnątrz OfferProvider')
  return ctx
}
