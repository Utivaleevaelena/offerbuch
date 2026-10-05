/**
 * Struktura treści oferty. Każda nowa oferta = nowy plik `proposal.ts`
 * zgodny z tymi typami. Komponenty i funkcja wysyłająca email nie zawierają
 * żadnych tekstów konkretnego klienta.
 *
 * Konwencja: fragment tekstu w *gwiazdkach* zostanie wyróżniony (kursywa, złoty kolor).
 */

export type IconName =
  | 'check' | 'plus' | 'close' | 'chevronDown' | 'chevronUp' | 'arrowRight' | 'trash' | 'menu' | 'send'
  | 'database' | 'sparkle' | 'globe' | 'flame' | 'shield' | 'pen' | 'layers' | 'rocket' | 'inbox'
  | 'compass' | 'camera' | 'monitor' | 'mail' | 'palette' | 'info' | 'target' | 'users' | 'document'

/** one_time — jednorazowo, monthly — co miesiąc, hourly — wg wybranego czasu pracy (jednorazowo). */
export type Billing = 'one_time' | 'monthly' | 'hourly'

export interface Service {
  /** Wewnętrzny identyfikator (trafia również do emaila). Unikalny w całej ofercie. */
  id: string
  /** Id etapu (`Stage.id`), do którego należy usługa. */
  category: string
  /** Pełna nazwa usługi. */
  title: string
  /** Krótka nazwa w podsumowaniu i emailu. */
  summaryTitle: string
  /** Krótszy nagłówek karty (gdy pełna nazwa jest zbyt długa). */
  cardTitle?: string
  /** Nazwa wariantu (dla usług w grupie wykluczającej się). */
  variant?: string
  /** Cena netto. Dla `hourly` — cena pełnego zakresu (wartość referencyjna). */
  priceNet: number
  billing: Billing
  /** Stawka godzinowa netto (tylko dla `billing: 'hourly'`). */
  hourlyRateNet?: number
  /** Usługi z tą samą grupą wykluczają się nawzajem (można wybrać tylko jedną). */
  exclusiveGroup: string | null
  tag?: string
  /** Wyróżnienie karty (ciemny tag). */
  recommended?: boolean
  description: string
  /** Mała notka pod ceną, np. o VAT. */
  priceNote?: string
  /** Tekst nad listą „Co obejmuje?”. */
  includesLead?: string
  includes: string[]
  /** Dodatkowa lista „pigułek”, np. sugerowane sekcje strony. */
  extraList?: { label: string; items: string[] }
  /** Tekst przycisku dodania. */
  cta: string
  /** Wybrany zakres (tylko w podsumowaniu, dla usług `hourly`) — nie wpisuj w treści oferty. */
  scope?: ResolvedScope
}

/** Element pracy w konfiguratorze zakresu (np. „Analiza konkurencji”). */
export interface ScopeTask {
  id: string
  title: string
  /** Szacowany czas w godzinach (wielokrotność 0,5). */
  hours: number
  description: string
  /** Krótka inspiracja pod opisem (np. przykładowy komunikat). */
  example?: string
}

/** Gotowy zakres — skrót, który ustawia czas i elementy (nie osobny produkt). */
export interface ScopePreset {
  id: string
  title: string
  hours: number
  description: string
  /** Elementy wchodzące w zakres. */
  taskIds: string[]
  /** Opis pozostałego czasu w tym zakresie. */
  remainderLabel?: string
  badge?: string
}

/** Rekomendacja zależności: gdy wybrano `when`, a brakuje któregoś z `requires`. */
export interface ScopeRule {
  when: string
  requires: string[]
  message: string
}

/** Konfigurator zakresu pracy dla usługi rozliczanej godzinowo. */
export interface ScopeConfigurator {
  /** Id usługi `hourly`, której dotyczy konfigurator. */
  serviceId: string
  maxHours: number
  step: number
  defaultHours: number
  /** Znaczniki na suwaku, np. [4, 8, 12, 16]. */
  marks: number[]
  /** Elementy pracy w kolejności priorytetu (suwak wybiera je po kolei). */
  tasks: ScopeTask[]
  presets: ScopePreset[]
  rules: ScopeRule[]
  /** Opis czasu, który nie mieści się w kolejnym pełnym elemencie. */
  extraLabel: string
}

/** Zakres zapisany w ofercie: czas + wybrane elementy. */
export interface ScopeSelection {
  hours: number
  taskIds: string[]
}

/** Zakres po walidacji — z policzonym czasem dodatkowym. */
export interface ResolvedScope {
  hours: number
  rateNet: number
  tasks: ScopeTask[]
  /** Czas niewykorzystany przez pełne elementy. */
  extraHours: number
  /** Opis czasu dodatkowego (z gotowego zakresu lub ogólny). */
  extraLabel: string
}

/** Bloki treści, z których składa się etap. */
export type Block =
  | {
      /** Wyróżniony koncept: cytat + opis + mini-proces. */
      type: 'highlight'
      eyebrow: string
      icon?: IconName
      quote: string
      text?: string
      flow?: string[]
      flowLabel?: string
    }
  | { type: 'process'; label: string; steps: string[] }
  | { type: 'chips'; groups: { title: string; icon: IconName; items: string[] }[] }
  | { type: 'features'; title?: string; items: { icon: IconName; title: string; text: string }[] }
  | { type: 'notes'; items: { icon: IconName; title?: string; text: string }[] }
  | { type: 'media'; label: string; items: { icon: IconName; label: string }[] }
  | { type: 'note'; icon?: IconName; lines: string[] }
  | {
      /** Porównanie „nie komunikujemy / komunikujemy”. */
      type: 'compare'
      eyebrow: string
      title: string
      badge?: string
      dont: { label: string; text: string }
      do: { label: string; text: string }
      conclusion?: string[]
    }

export interface Stage {
  /** Id etapu — na nie wskazuje `Service.category`. */
  id: string
  /** Kotwica w adresie (#strategia). */
  anchor: string
  /** Nazwa w menu i w podsumowaniu („Etap 1 · Strategia”). */
  navLabel: string
  /** Pełna nazwa etapu w mapie współpracy. */
  label: string
  /** Jedno zdanie w mapie współpracy. */
  roadmapLine: string
  /** Mały nadtytuł obok numeru etapu. */
  eyebrow: string
  /** Nagłówek etapu (fragment w *gwiazdkach* zostanie wyróżniony). */
  title: string
  intro?: string[]
  /** Bloki między nagłówkiem a usługami. */
  blocks?: Block[]
  /** Bloki wewnątrz karty (tylko gdy etap ma jedną usługę). */
  cardBlocks?: Block[]
  /** Bloki wewnątrz karty, pod listą „Co obejmuje?” (tylko gdy etap ma jedną usługę). */
  cardAfter?: Block[]
  /** Interaktywny konfigurator zakresu (zastępuje kartę usługi godzinowej). */
  configurator?: ScopeConfigurator
  /** Ustawienia dla etapu z wariantami (kilka usług). */
  options?: {
    eyebrow?: string
    title?: string
    /** Np. „Wybierz jeden z dwóch wariantów.” */
    hint?: string
    /** Pokaż „Szacunkowy budżet: min–max”. */
    showPriceRange?: boolean
    /** Toast przy zmianie wariantu, np. „Zmieniono wariant strony”. */
    changeMessage?: string
  }
}

export interface Proposal {
  /** Krótki identyfikator oferty (np. „gawin-wojnowska”) — klucz zapisu wyboru w przeglądarce. */
  id: string
  meta: { title: string; description: string }
  /** Marka klienta, dla którego jest oferta. */
  client: {
    /** Logo tekstowe; znaki „&” i „×” są wyróżniane kolorem. */
    logo: string
    tagline: string
    /** Pełna nazwa w treściach („Kancelaria Gawin & Wojnowska”). */
    fullName: string
  }
  /** Agencja przygotowująca ofertę. */
  agency: { name: string }
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    body: string
    primaryCta: string
    secondaryCta: string
    reassurance: string
  }
  goal: {
    navLabel: string
    eyebrow: string
    title: string
    paragraphs: string[]
    /** Wyróżnione zdanie (wstawiane po pierwszym akapicie). */
    quote?: string
    process: string[]
  }
  roadmap: { eyebrow: string; title: string; intro: string }
  headerCta: string
  stages: Stage[]
  services: Service[]
  recommended?: {
    /** Id etapu, po którym pojawia się sekcja. */
    afterStage: string
    eyebrow: string
    title: string
    text: string
    serviceIds: string[]
    /** Opcjonalne nazwy pozycji (domyślnie `summaryTitle`). */
    labels?: Record<string, string>
    cta: string
    footnote?: string
  }
  closing: { eyebrow: string; title: string; text: string; journey: string[] }
  emails: {
    adminSubject: string
    clientSubject: string
    /** Akapity potwierdzenia dla klienta. */
    clientIntro: string[]
    signature: string
  }
}
