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

export type Billing = 'one_time' | 'monthly'

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
  priceNet: number
  billing: Billing
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
