import { useEffect, useState } from 'react'
import type { Proposal } from '../content/types'
import { useI18n } from '../i18n/I18nContext'
import { Icon } from './Icon'
import { LanguageSwitcher } from './LanguageSwitcher'

const navItems = (p: Proposal) => [
  { href: '#cel', label: p.goal.navLabel },
  ...p.stages.map((s) => ({ href: `#${s.anchor}`, label: s.navLabel })),
]

/** Logo tekstowe — znaki „&” i „×” wyróżnione kolorem. */
function LogoText({ text }: { text: string }) {
  return (
    <>
      {text.split(/([&×])/).map((part, i) =>
        part === '&' || part === '×' ? (
          <span key={i} className="text-gold">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  const { proposal, t } = useI18n()
  return (
    <a href="#top" className="group flex flex-col leading-none" aria-label={`${proposal.client.logo} — ${t.backToTop}`}>
      <span
        className={`font-serif text-[1.15rem] font-semibold tracking-[0.08em] whitespace-nowrap sm:text-2xl sm:tracking-[0.12em] ${light ? 'text-ivory' : 'text-navy-900'}`}
      >
        <LogoText text={proposal.client.logo} />
      </span>
      <span
        className={`mt-1.5 text-[0.56rem] font-semibold tracking-[0.2em] whitespace-nowrap sm:text-[0.62rem] sm:tracking-[0.3em] ${light ? 'text-gold-light' : 'text-gold-ink'}`}
      >
        {proposal.client.tagline}
      </span>
    </a>
  )
}

export function Header() {
  const { proposal, t } = useI18n()
  const NAV = navItems(proposal)
  const FIRST_STAGE = `#${proposal.stages[0]?.anchor ?? 'oferta'}`
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled || menuOpen ? 'border-b border-line bg-ivory/92 shadow-soft backdrop-blur-md' : 'border-b border-transparent bg-ivory'
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label={t.sections} className="hidden lg:block">
          <ul className="flex items-center">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-2.5 py-2 text-sm font-medium whitespace-nowrap text-ink-muted transition-colors hover:bg-white hover:text-navy-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <a href={FIRST_STAGE} className="btn-primary hidden min-h-11 px-5 text-sm whitespace-nowrap xl:inline-flex">
            {proposal.headerCta}
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line text-navy-900 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label={t.sections} className="animate-fade-up border-t border-line px-4 pb-6 lg:hidden">
          <div className="flex items-center justify-between gap-3 pt-4 sm:hidden">
            <span className="text-sm text-ink-muted">{t.language}</span>
            <LanguageSwitcher />
          </div>
          <ul className="divide-y divide-line">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between py-3.5 text-base font-medium text-navy-900"
                >
                  {item.label}
                  <Icon name="arrowRight" size={16} className="text-gold" />
                </a>
              </li>
            ))}
          </ul>
          <a href={FIRST_STAGE} onClick={() => setMenuOpen(false)} className="btn-primary mt-4 w-full">
            {proposal.headerCta}
          </a>
        </nav>
      )}
    </header>
  )
}
