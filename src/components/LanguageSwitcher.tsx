import { AVAILABLE_LANGS } from '../content/localize'
import { useI18n } from '../i18n/I18nContext'
import { LANG_NAMES } from '../i18n/ui'

/** Przełącznik języka: PL / EN / RU. */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n()
  if (AVAILABLE_LANGS.length < 2) return null
  return (
    <div role="group" aria-label={t.language} className={`inline-flex rounded-full border border-line bg-white/70 p-0.5 ${className}`}>
      {AVAILABLE_LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          onClick={() => setLang(l)}
          aria-pressed={l === lang}
          title={LANG_NAMES[l]}
          className={`min-h-9 min-w-10 rounded-full px-2.5 text-xs font-bold tracking-[0.08em] uppercase transition-colors ${
            l === lang ? 'bg-navy-900 text-ivory' : 'text-ink-muted hover:text-navy-900'
          }`}
        >
          <span aria-hidden="true">{l}</span>
          <span className="sr-only">{LANG_NAMES[l]}</span>
        </button>
      ))}
    </div>
  )
}
