/**
 * Jedno źródło prawdy dla całej oferty.
 *
 * Wszystkie ceny, nazwy usług, warianty i grupy wykluczające się są
 * zdefiniowane wyłącznie tutaj. Komponenty UI, podsumowanie oferty
 * oraz funkcja serwerowa wysyłająca email korzystają z tych danych.
 */

export type Billing = 'one_time' | 'monthly'

export type CategoryId = 'strategy' | 'branding' | 'session' | 'website' | 'outreach'

export type ExclusiveGroup = 'branding' | 'website' | 'outreach'

export interface Service {
  /** Wewnętrzny identyfikator (trafia również do emaila). */
  id: string
  category: CategoryId
  /** Pełna nazwa usługi. */
  title: string
  /** Krótka nazwa używana w podsumowaniu i emailu. */
  summaryTitle: string
  /** Krótszy nagłówek karty (gdy pełna nazwa jest zbyt długa). */
  cardTitle?: string
  /** Nazwa wariantu (dla usług z wariantami). */
  variant?: string
  priceNet: number
  billing: Billing
  exclusiveGroup: ExclusiveGroup | null
  tag?: string
  description: string
  includes: string[]
  /** Dodatkowa lista, np. sugerowane sekcje strony. */
  extraList?: { label: string; items: string[] }
  /** Tekst poprzedzający listę „Co obejmuje?”. */
  includesLead?: string
  cta: string
  recommended?: boolean
}

export interface Category {
  id: CategoryId
  stage: number
  /** Kotwica sekcji (nawigacja). */
  anchor: string
  navLabel: string
  /** Nazwa etapu w mapie współpracy. */
  label: string
  /** Krótki opis etapu w mapie współpracy. */
  roadmapLine: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'strategy',
    stage: 1,
    anchor: 'strategia',
    navLabel: 'Strategia',
    label: 'Audyt + strategia + pozycjonowanie',
    roadmapLine: 'Ustalamy, co, komu i dlaczego chcemy sprzedawać.',
  },
  {
    id: 'branding',
    stage: 2,
    anchor: 'branding',
    navLabel: 'Branding',
    label: 'Branding',
    roadmapLine: 'Spójny system wizualny marki.',
  },
  {
    id: 'session',
    stage: 3,
    anchor: 'sesja',
    navLabel: 'Sesja',
    label: 'Sesja wizerunkowa',
    roadmapLine: 'Autentyczne zdjęcia i video założycielek.',
  },
  {
    id: 'website',
    stage: 4,
    anchor: 'strona',
    navLabel: 'Strona',
    label: 'Nowa strona internetowa',
    roadmapLine: 'Strona, która prowadzi klienta do kontaktu.',
  },
  {
    id: 'outreach',
    stage: 5,
    anchor: 'outreach',
    navLabel: 'B2B Outreach',
    label: 'B2B Email Outreach pod klucz',
    roadmapLine: 'Docieramy bezpośrednio do osób decyzyjnych.',
  },
]

export const SERVICES: Service[] = [
  // ───────────────────────── ETAP 1 ─────────────────────────
  {
    id: 'strategy',
    category: 'strategy',
    title: 'Audyt + strategia + pozycjonowanie',
    summaryTitle: 'Audyt + strategia',
    priceNet: 1200,
    billing: 'one_time',
    exclusiveGroup: null,
    tag: 'Fundament projektu',
    description:
      'Strategia pozwoli nam zbudować wszystkie kolejne elementy projektu wokół jednego, spójnego kierunku biznesowego.',
    includes: [
      'analiza obecnej strony internetowej',
      'analiza social media',
      'analiza Google Business Profile',
      'analiza obecnego wizerunku',
      'analiza wybranych konkurentów',
      'określenie grupy docelowej',
      'profil idealnego klienta',
      'identyfikacja potrzeb i problemów klienta',
      'pozycjonowanie marki',
      'USP',
      'główny komunikat sprzedażowy',
      'koncepcja produktu wejściowego / lead magnetu',
      'rekomendowana struktura nowej strony',
      'podstawowa koncepcja lejka sprzedażowego',
      'plan kolejnych działań',
    ],
    cta: 'Dodaj strategię do oferty',
  },

  // ───────────────────────── ETAP 2 ─────────────────────────
  {
    id: 'branding-mini',
    category: 'branding',
    title: 'Mini Brand Guide AI',
    summaryTitle: 'Mini Brand Guide AI',
    variant: 'Mini AI',
    priceNet: 200,
    billing: 'one_time',
    exclusiveGroup: 'branding',
    tag: 'Szybki start',
    description:
      'Szybkie uporządkowanie kierunku wizualnego marki z wykorzystaniem AI w procesie koncepcyjnym.',
    includes: [
      'kierunek wizualny',
      'paleta kolorów',
      'typografia',
      'moodboard',
      'styl fotografii',
      'podstawowe zasady komunikacji wizualnej',
      'rekomendacje dla strony',
      'rekomendacje dla social media',
    ],
    cta: 'Wybieram Mini Brand Guide',
  },
  {
    id: 'branding-pro',
    category: 'branding',
    title: 'Brand Guide PRO + Logo',
    summaryTitle: 'Brand Guide PRO + Logo',
    variant: 'PRO + Logo',
    priceNet: 2250,
    billing: 'one_time',
    exclusiveGroup: 'branding',
    tag: 'Rekomendowane',
    recommended: true,
    description: 'Pełna identyfikacja wizualna przygotowana wspólnie z projektantem.',
    includes: [
      'projekt lub redesign logo',
      'warianty logo',
      'paleta kolorystyczna',
      'typografia',
      'zasady stosowania identyfikacji',
      'styl fotografii',
      'elementy graficzne marki',
      'kierunek komunikacji wizualnej',
      'przygotowanie systemu do wykorzystania na stronie',
      'przygotowanie do social media',
      'przygotowanie do materiałów marketingowych',
    ],
    cta: 'Wybieram Brand Guide PRO',
  },

  // ───────────────────────── ETAP 3 ─────────────────────────
  {
    id: 'session',
    category: 'session',
    title: 'Sesja wizerunkowa',
    summaryTitle: 'Sesja wizerunkowa',
    priceNet: 1000,
    billing: 'one_time',
    exclusiveGroup: null,
    tag: 'Foto + video',
    description:
      'Tworzymy bank autentycznych materiałów fotograficznych i video przeznaczonych do strony internetowej, social media i dalszych działań marketingowych.',
    includes: [
      'przygotowanie moodboardu',
      'konsultacja stylizacji',
      'przygotowanie shot listy',
      'zdjęcia obu założycielek',
      'portrety indywidualne',
      'zdjęcia wspólne',
      'zdjęcia biznesowe',
      'materiały do sekcji „O nas”',
      'zdjęcia do strony',
      'zdjęcia pionowe',
      'zdjęcia poziome',
      'materiały do LinkedIn',
      'materiały do Instagram / Facebook',
      'B-roll',
      'krótkie nagrania video',
      'profesjonalne światło',
      'pomoc w pozowaniu',
      'obróbka fotografii',
    ],
    cta: 'Dodaj sesję do oferty',
  },

  // ───────────────────────── ETAP 4 ─────────────────────────
  {
    id: 'website-start',
    category: 'website',
    title: 'Strona START',
    summaryTitle: 'Strona START',
    variant: 'START',
    priceNet: 1500,
    billing: 'one_time',
    exclusiveGroup: 'website',
    tag: 'Wizerunkowo-sprzedażowa',
    description:
      'Nowoczesna strona wizerunkowo-sprzedażowa prezentująca najważniejsze elementy marki i oferty.',
    includes: [
      'struktura UX',
      'copywriting podstawowych sekcji',
      'projekt wizualny',
      'wdrożenie',
      'wersja mobilna',
      'formularz kontaktowy',
      'podstawowe SEO',
      'CTA',
      'przygotowanie pod dalszą komunikację B2B',
    ],
    extraList: {
      label: 'Sugerowane sekcje',
      items: ['Hero', 'Oferta', 'Dlaczego my', 'O nas', 'Jak pracujemy', 'Kontakt'],
    },
    cta: 'Wybieram START',
  },
  {
    id: 'website-pro',
    category: 'website',
    title: 'Strona PRO',
    summaryTitle: 'Strona PRO',
    variant: 'PRO',
    priceNet: 3500,
    billing: 'one_time',
    exclusiveGroup: 'website',
    tag: 'Rekomendowane dla B2B',
    recommended: true,
    description:
      'Rozbudowana strona sprzedażowa przygotowana pod większe spółki i dalsze kampanie outbound.',
    includesLead: 'Wszystko z wariantu START, a dodatkowo:',
    includes: [
      'rozbudowana struktura',
      'więcej podstron',
      'bardziej rozbudowany copywriting',
      'osobna sekcja / strona „Dla spółek”',
      'osobna strona „Przegląd księgowości”',
      'case studies',
      'FAQ',
      'rozbudowana struktura SEO',
      'landing page pod kampanie',
      'przygotowanie pod B2B Email Outreach',
    ],
    extraList: {
      label: 'Sugerowana nawigacja',
      items: [
        'Strona główna',
        'Dla spółek',
        'Przegląd księgowości',
        'Usługi',
        'Jak pracujemy',
        'O nas',
        'Case studies',
        'FAQ',
        'Kontakt',
      ],
    },
    cta: 'Wybieram PRO',
  },

  // ───────────────────────── ETAP 5 ─────────────────────────
  {
    id: 'outreach-micro',
    category: 'outreach',
    title: 'B2B Email Outreach MICRO',
    summaryTitle: 'B2B Outreach MICRO',
    cardTitle: 'MICRO',
    variant: 'MICRO',
    priceNet: 5880,
    billing: 'monthly',
    exclusiveGroup: 'outreach',
    tag: 'Rekomendowany na start',
    recommended: true,
    description: '1\u00a0200 odbiorców i 3\u00a0600 wiadomości miesięcznie.',
    includes: [
      '1\u00a0200 odbiorców',
      '3\u00a0600 wiadomości miesięcznie',
      '1 wiadomość + 2 follow-upy',
      'baza firm',
      'segmentacja',
      'walidacja',
      'domeny',
      'skrzynki',
      'warming',
      'copywriting',
      'konfiguracja',
      'uruchomienie',
      'przekazywanie leadów',
    ],
    cta: 'Wybieram MICRO',
  },
  {
    id: 'outreach-standard',
    category: 'outreach',
    title: 'B2B Email Outreach STANDARD',
    summaryTitle: 'B2B Outreach STANDARD',
    cardTitle: 'STANDARD',
    variant: 'STANDARD',
    priceNet: 9480,
    billing: 'monthly',
    exclusiveGroup: 'outreach',
    description: '3\u00a0800 odbiorców i 11\u00a0400 wiadomości miesięcznie.',
    includes: [
      '3\u00a0800 odbiorców',
      '11\u00a0400 wiadomości miesięcznie',
      '1 wiadomość + 2 follow-upy',
      'baza',
      'segmentacja',
      'infrastruktura mailingowa',
      'personalizacja',
      'obsługa kampanii',
      'przekazywanie leadów',
    ],
    cta: 'Wybieram STANDARD',
  },
  {
    id: 'outreach-growth',
    category: 'outreach',
    title: 'B2B Email Outreach GROWTH',
    summaryTitle: 'B2B Outreach GROWTH',
    cardTitle: 'GROWTH',
    variant: 'GROWTH',
    priceNet: 17880,
    billing: 'monthly',
    exclusiveGroup: 'outreach',
    description: '8\u00a0500 odbiorców i 25\u00a0500 wiadomości miesięcznie.',
    includes: [
      '8\u00a0500 odbiorców',
      '25\u00a0500 wiadomości miesięcznie',
      '1 wiadomość + 2 follow-upy',
      'rozbudowana infrastruktura',
      'baza',
      'segmentacja',
      'personalizacja',
      'obsługa kampanii',
      'przekazywanie leadów',
    ],
    cta: 'Wybieram GROWTH',
  },
]

/** Komunikaty wyświetlane przy zmianie wariantu w grupie. */
export const GROUP_CHANGE_MESSAGES: Record<ExclusiveGroup, string> = {
  branding: 'Zmieniono wariant brandingu',
  website: 'Zmieniono wariant strony',
  outreach: 'Zmieniono pakiet B2B Outreach',
}

/** Rekomendowany zestaw (bez B2B Outreach). */
export const RECOMMENDED_SET: string[] = ['strategy', 'branding-pro', 'session', 'website-pro']

/** Nazwy w zestawie rekomendowanym (mogą różnić się od nazw w podsumowaniu). */
export const RECOMMENDED_LABELS: Record<string, string> = {
  strategy: 'Audyt + strategia',
  'branding-pro': 'Brand Guide PRO + Logo',
  session: 'Sesja wizerunkowa',
  'website-pro': 'Strona PRO',
}

const SERVICE_MAP = new Map(SERVICES.map((s) => [s.id, s]))

export function getService(id: string): Service | undefined {
  return SERVICE_MAP.get(id)
}

export function getCategory(id: CategoryId): Category {
  const category = CATEGORIES.find((c) => c.id === id)
  if (!category) throw new Error(`Nieznana kategoria: ${id}`)
  return category
}

export function servicesInCategory(id: CategoryId): Service[] {
  return SERVICES.filter((s) => s.category === id)
}

/** Zakres cen dla kategorii, np. 1 500–3 500 zł. */
export function priceRange(id: CategoryId): { min: number; max: number } {
  const prices = servicesInCategory(id).map((s) => s.priceNet)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}
