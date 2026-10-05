import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AVAILABLE_LANGS, getProposal } from '../content/localize'
import type { Proposal } from '../content/types'
import { DEFAULT_LANG, UI, formatPrice, isLang, type Lang, type UiStrings } from './ui'

const STORAGE_KEY = 'offer-lang'

interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  /** Teksty interfejsu w bieżącym języku. */
  t: UiStrings
  /** Oferta w bieżącym języku. */
  proposal: Proposal
  /** Cena w formacie bieżącego języka. */
  price: (value: number) => string
}

const I18nContext = createContext<I18nValue | null>(null)

/** Język startowy: ?lang=en w adresie → ostatni wybór → polski. */
function initialLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (isLang(fromUrl) && AVAILABLE_LANGS.includes(fromUrl)) return fromUrl
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLang(stored) && AVAILABLE_LANGS.includes(stored)) return stored
  } catch {
    /* brak dostępu do localStorage */
  }
  return DEFAULT_LANG
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    const proposal = getProposal(lang)
    document.documentElement.lang = lang
    document.title = proposal.meta.title
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* ignorujemy */
    }
    // Adres z ?lang=… można wysłać klientowi — otworzy się od razu w tym języku.
    const url = new URL(window.location.href)
    if (lang === DEFAULT_LANG) url.searchParams.delete('lang')
    else url.searchParams.set('lang', lang)
    window.history.replaceState(null, '', url)
  }, [lang])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang,
      t: UI[lang],
      proposal: getProposal(lang),
      price: (v) => formatPrice(v, lang),
    }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n musi być użyty wewnątrz I18nProvider')
  return ctx
}
