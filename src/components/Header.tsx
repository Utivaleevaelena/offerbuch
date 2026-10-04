import { useEffect, useState } from 'react'
import { PROPOSAL } from '../content/proposal'
import { STAGES } from '../lib/offer'
import { Icon } from './Icon'

const NAV = [
  { href: '#cel', label: PROPOSAL.goal.navLabel },
  ...STAGES.map((s) => ({ href: `#${s.anchor}`, label: s.navLabel })),
]
const FIRST_STAGE = `#${STAGES[0]?.anchor ?? 'oferta'}`

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
  return (
    <a href="#top" className="group flex flex-col leading-none" aria-label={`${PROPOSAL.client.logo} — początek strony`}>
      <span
        className={`font-serif text-[1.15rem] font-semibold tracking-[0.08em] whitespace-nowrap sm:text-2xl sm:tracking-[0.12em] ${light ? 'text-ivory' : 'text-navy-900'}`}
      >
        <LogoText text={PROPOSAL.client.logo} />
      </span>
      <span
        className={`mt-1.5 text-[0.56rem] font-semibold tracking-[0.2em] whitespace-nowrap sm:text-[0.62rem] sm:tracking-[0.3em] ${light ? 'text-gold-light' : 'text-gold-ink'}`}
      >
        {PROPOSAL.client.tagline}
      </span>
    </a>
  )
}

export function Header() {
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
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-6 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Sekcje propozycji" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-white hover:text-navy-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={FIRST_STAGE} className="btn-primary hidden min-h-11 px-5 text-sm sm:inline-flex">
            {PROPOSAL.headerCta}
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line text-navy-900 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-nav" aria-label="Sekcje propozycji" className="animate-fade-up border-t border-line px-4 pb-6 lg:hidden">
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
            {PROPOSAL.headerCta}
          </a>
        </nav>
      )}
    </header>
  )
}
