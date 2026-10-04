import { CATEGORIES } from '../data/offer'
import { Icon } from './Icon'
import { ProcessFlow } from './ui'

export function Goal() {
  return (
    <>
      <section id="cel" aria-labelledby="cel-title" className="bg-navy-900 text-ivory">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="eyebrow !text-gold-light">Cel projektu</p>
              <h2 id="cel-title" className="mt-5 text-[2.2rem] !text-ivory sm:text-5xl">
                Od dobrego wizerunku do systemowego pozyskiwania klientów
              </h2>
            </div>
            <div className="space-y-5 text-[1.05rem] text-ivory/80 sm:text-lg">
              <p>
                Celem projektu jest stworzenie spójnego wizerunku Kancelarii Gawin &amp; Wojnowska oraz systemu marketingowego, który
                pozwoli docierać do większych spółek, właścicieli firm i członków zarządów.
              </p>
              <p className="border-l-2 border-gold pl-5 font-serif text-2xl leading-snug text-ivory sm:text-[1.7rem]">
                Nie chcemy budować kolejnego wizerunku „biura rachunkowego”.
              </p>
              <p>
                Chcemy pokazać Kancelarię jako partnera, któremu zarząd może powierzyć jeden z najważniejszych obszarów biznesu:
                księgowość, procesy finansowe, raportowanie i bezpieczeństwo.
              </p>
            </div>
          </div>

          <div className="mt-16 border-t border-white/10 pt-10">
            <ProcessFlow
              tone="dark"
              label="Proces budowy marki"
              steps={['Strategia', 'Marka', 'Wizerunek', 'Strona', 'Pozyskiwanie klientów']}
            />
          </div>
        </div>
      </section>

      <section id="etapy" aria-labelledby="etapy-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Etapy współpracy</p>
          <h2 id="etapy-title" className="mt-4 text-[2.2rem] sm:text-5xl">
            Pięć modułów, jeden spójny kierunek
          </h2>
          <p className="mt-4 text-[1.05rem] text-ink-muted">
            Rekomendujemy realizację w poniższej kolejności — każdy etap wzmacnia kolejny. Nie narzucamy jednak pakietu: wybierzcie
            moduły, które odpowiadają Waszym potrzebom.
          </p>
        </div>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <li key={c.id} className="bg-white">
              <a href={`#${c.anchor}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-ivory">
                <span className="font-serif text-4xl text-gold">{String(c.stage).padStart(2, '0')}</span>
                <span className="mt-4 font-serif text-[1.4rem] leading-tight text-navy-900">{c.label}</span>
                <span className="mt-2 flex-1 text-sm text-ink-muted">{c.roadmapLine}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 group-hover:text-gold-ink">
                  Zobacz etap
                  <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
