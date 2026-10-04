import { servicesInCategory } from '../data/offer'
import { Icon, type IconName } from './Icon'
import { OptionCard } from './OptionCard'
import { ExclusiveNote } from './Stages'
import { ProcessFlow, StageHeader } from './ui'

const TARGETING = [
  'PKD',
  'region / województwo',
  'przychody / obroty',
  'wielkość firmy',
  'forma prawna',
  'aktywność przetargowa',
  'aktywna rekrutacja',
  'inne uzgodnione kryteria',
]

const DECISION_MAKERS = [
  'Prezes Zarządu',
  'właściciel',
  'CFO',
  'Dyrektor Finansowy',
  'Członek Zarządu',
  'inne wybrane stanowiska',
]

const INCLUDED: { icon: IconName; title: string; text: string }[] = [
  { icon: 'database', title: 'Baza firm', text: 'Tworzenie bazy według ustalonych kryteriów.' },
  { icon: 'sparkle', title: 'Segmentacja i AI', text: 'Analiza i wzbogacanie danych.' },
  { icon: 'globe', title: 'Domeny i skrzynki', text: 'Dedykowana infrastruktura mailingowa.' },
  { icon: 'flame', title: 'Warming', text: 'Przygotowanie skrzynek przed kampanią.' },
  { icon: 'shield', title: 'Walidacja', text: 'Weryfikacja danych i adresów email.' },
  { icon: 'pen', title: 'Copywriting', text: 'Przygotowanie całej sekwencji.' },
  { icon: 'layers', title: 'Sekwencja', text: '1 wiadomość + 2 follow-upy.' },
  { icon: 'rocket', title: 'Uruchomienie', text: 'Konfiguracja i start kampanii.' },
  { icon: 'inbox', title: 'Przekazywanie leadów', text: 'Zainteresowane kontakty trafiają do wskazanego kanału.' },
]

function ChipList({ title, icon, items }: { title: string; icon: IconName; items: string[] }) {
  return (
    <div className="card p-6">
      <h3 className="flex items-center gap-2.5 font-sans text-base font-semibold text-navy-900">
        <Icon name={icon} size={20} className="text-gold" />
        {title}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-full border border-line bg-ivory px-3 py-1.5 text-sm text-graphite">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function OutreachStage() {
  return (
    <section id="outreach" aria-label="Etap 5: B2B Email Outreach pod klucz" className="scroll-mt-24 py-16 sm:py-20">
      <StageHeader
        stage={5}
        eyebrow="B2B Email Outreach pod klucz"
        title={
          <>
            Nie czekamy, aż właściwa firma znajdzie kancelarię.{' '}
            <span className="text-gold-ink">Docieramy bezpośrednio do właściwych osób.</span>
          </>
        }
        intro={
          <>
            <p>
              Budujemy precyzyjną bazę potencjalnych klientów, identyfikujemy właściwe osoby decyzyjne i prowadzimy
              spersonalizowaną komunikację email.
            </p>
            <p className="mt-3">
              To szczególnie skuteczne, gdy chcecie dotrzeć do konkretnych, wybranych spółek — zamiast polegać wyłącznie na social
              media czy ruchu organicznym i czekać, aż właściwy klient sam trafi na stronę.
            </p>
          </>
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        <ChipList title="Możliwe kryteria doboru firm" icon="target" items={TARGETING} />
        <ChipList title="Osoby decyzyjne" icon="users" items={DECISION_MAKERS} />
      </div>

      <div className="mt-10 rounded-2xl bg-navy-900 p-6 sm:p-8">
        <p className="mb-5 text-xs font-semibold tracking-[0.22em] text-gold-light uppercase">Jak działa kampania</p>
        <ProcessFlow
          tone="dark"
          size="sm"
          label="Proces kampanii outreach"
          steps={['Selekcja firm', 'Baza i kontakty', 'Personalizacja', 'Email', 'Follow-up', 'Zainteresowany lead']}
        />
      </div>

      {/* Co obejmuje usługa */}
      <div className="mt-14">
        <h3 className="text-[1.9rem]">Co obejmuje usługa?</h3>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {INCLUDED.map((item) => (
            <li key={item.title} className="flex gap-4 rounded-xl border border-line bg-white p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-ink">
                <Icon name={item.icon} size={19} />
              </span>
              <span>
                <span className="block font-semibold text-navy-900">{item.title}</span>
                <span className="block text-sm text-ink-muted">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <p className="flex gap-3 rounded-xl bg-white/70 p-4 text-sm text-ink-muted ring-1 ring-line">
            <Icon name="inbox" size={18} className="mt-0.5 shrink-0 text-gold" />
            <span>
              <strong className="font-semibold text-navy-900">Gdzie trafiają leady?</strong> CRM, email lub inne uzgodnione
              narzędzie.
            </span>
          </p>
          <p className="flex gap-3 rounded-xl bg-white/70 p-4 text-sm text-ink-muted ring-1 ring-line">
            <Icon name="info" size={18} className="mt-0.5 shrink-0 text-gold" />
            <span>
              Aktywne wysyłki rozpoczynają się po przygotowaniu infrastruktury, orientacyjnie od 15. dnia projektu.
            </span>
          </p>
        </div>
      </div>

      {/* Pozycjonowanie */}
      <aside
        aria-labelledby="positioning-title"
        className="relative mt-14 overflow-hidden rounded-[1.75rem] border border-gold/40 bg-gradient-to-br from-gold-soft via-ivory to-white p-7 sm:p-10"
      >
        <p className="eyebrow">Ważne</p>
        <h3 id="positioning-title" className="mt-3 text-[2rem] sm:text-[2.4rem]">
          Do czego prowadzimy klienta?
        </h3>
        <p className="mt-5 inline-block rounded-xl bg-navy-900 px-5 py-3 text-sm font-semibold tracking-[0.12em] text-ivory uppercase sm:text-base">
          Do wstępnej rozmowy / diagnozy obecnego modelu księgowości
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white/80 p-5">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">
              <Icon name="close" size={16} className="text-[#a0524a]" />
              Nie komunikujemy
            </p>
            <p className="mt-3 font-serif text-xl text-ink-muted line-through decoration-[#a0524a]/50">
              „Zmień księgowość na naszą.”
            </p>
          </div>
          <div className="rounded-2xl border border-gold/40 bg-white p-5 shadow-soft">
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-gold-ink uppercase">
              <Icon name="check" size={16} />
              Komunikujemy
            </p>
            <p className="mt-3 font-serif text-xl leading-snug text-navy-900">
              „Sprawdźmy, czy obecny model księgowości nadal odpowiada skali i potrzebom Twojej firmy.”
            </p>
          </div>
        </div>
        <p className="mt-6 border-l-2 border-gold pl-5 text-graphite">
          Nie proponujemy zmiany księgowości w ciemno.
          <br />
          Najpierw chcemy sprawdzić, czy istnieje biznesowe uzasadnienie do dalszej rozmowy.
        </p>
      </aside>

      {/* Pakiety */}
      <div className="mt-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Pakiety miesięczne · B2B Email Outreach</p>
            <h3 className="mt-3 text-[1.9rem] sm:text-[2.2rem]">Wybierz skalę kampanii</h3>
          </div>
          <ExclusiveNote>Można wybrać jeden pakiet.</ExclusiveNote>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {servicesInCategory('outreach').map((s) => (
            <OptionCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </section>
  )
}
