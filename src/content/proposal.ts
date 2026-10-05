/**
 * ════════════════════════════════════════════════════════════════
 *  TREŚĆ OFERTY — jedyny plik do edycji przy tworzeniu nowej oferty.
 * ════════════════════════════════════════════════════════════════
 *
 * Tu są wszystkie teksty, etapy, usługi, ceny i treść emaili.
 * Instrukcja: TEMPLATE.md. Kolory: src/theme.css.
 */
import type { Proposal, Service, Stage } from './types.js'

const services: Service[] = [
  // ───────────────────────── ETAP 1 ─────────────────────────
  {
    id: 'strategy',
    category: 'strategy',
    title: 'Audyt + strategia + pozycjonowanie',
    summaryTitle: 'Audyt + strategia',
    // Cena zależy od wybranego czasu: godziny × stawka. priceNet = pełny zakres (16 h).
    priceNet: 1280,
    billing: 'hourly',
    hourlyRateNet: 80,
    exclusiveGroup: null,
    tag: 'Fundament projektu',
    recommended: true,
    description:
      'Strategia pozwoli nam zbudować wszystkie kolejne elementy projektu wokół jednego, spójnego kierunku biznesowego.',
    includes: [],
    cta: 'Dodaj wybrany zakres do oferty',
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
    priceNote: 'VAT zostanie doliczony zgodnie z obowiązującymi zasadami.',
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
    id: 'landing-campaign',
    category: 'website',
    title: 'Landing page kampanijny',
    summaryTitle: 'Landing page kampanijny',
    variant: 'Landing page',
    priceNet: 1500,
    billing: 'one_time',
    exclusiveGroup: 'website',
    tag: 'Obecna strona bez zmian',
    description:
      'Jedna strona przygotowana pod konkretną grupę docelową i konkretną kampanię. Obecna strona Kancelarii pozostaje bez zmian.',
    includes: [
      'analiza grupy docelowej i celu kampanii',
      'struktura pod jedną ofertę i jedno działanie (CTA)',
      'copywriting dopasowany do wybranej grupy odbiorców',
      'projekt wizualny spójny z marką',
      'wdrożenie i wersja mobilna',
      'formularz kontaktowy / zapis na diagnozę',
      'podstawowe SEO i podpięcie analityki',
      'przygotowanie pod kampanię B2B Email Outreach lub reklamy',
    ],
    extraList: {
      label: 'Przykładowe sekcje landing page',
      items: ['Nagłówek z obietnicą', 'Problem klienta', 'Jak pomagamy', 'Dlaczego my', 'Case study', 'FAQ', 'Formularz'],
    },
    cta: 'Wybieram landing page',
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
    includes: [
      'nowa struktura UX całej strony',
      'projekt wizualny i wdrożenie',
      'wersja mobilna',
      'formularz kontaktowy',
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

const stages: Stage[] = [
  {
    id: 'strategy',
    anchor: 'strategia',
    navLabel: 'Strategia',
    label: 'Audyt + strategia + pozycjonowanie',
    roadmapLine: 'Zakres pracy dopasowany do potrzeb — od szybkiego audytu po pełną strategię.',
    eyebrow: 'Etap 1',
    title: 'Audyt + strategia + pozycjonowanie',
    intro: [
      'Wybierz zakres pracy strategicznej dopasowany do aktualnych potrzeb kancelarii.',
      'Każdy projekt może wymagać innego poziomu analizy. Możecie wybrać gotowy zakres lub samodzielnie zaznaczyć elementy, na których mamy się skupić.',
    ],
    configurator: {
      serviceId: 'strategy',
      maxHours: 16,
      step: 0.5,
      defaultHours: 16,
      marks: [4, 8, 12, 16],
      extraLabel: 'Czas na dodatkową analizę, konsultację lub dopracowanie rekomendacji.',
      // Kolejność = priorytet, w jakim suwak dobiera elementy.
      tasks: [
        {
          id: 'strategy-situation',
          title: 'Analiza obecnej sytuacji i materiałów',
          hours: 1,
          description:
            'Analiza materiałów z rozmowy, obecnej sytuacji firmy, celów biznesowych oraz najważniejszych priorytetów projektu.',
        },
        {
          id: 'strategy-audit',
          title: 'Audyt strony i komunikacji',
          hours: 2,
          description:
            'Analiza obecnej strony internetowej, social media, Google Business Profile oraz spójności komunikacji i wizerunku.',
        },
        {
          id: 'strategy-competition',
          title: 'Analiza konkurencji',
          hours: 2,
          description:
            'Analiza 4–6 istotnych konkurentów: oferta, pozycjonowanie, komunikacja, CTA, strony internetowe, mocne i słabe strony.',
        },
        {
          id: 'strategy-icp',
          title: 'Profil idealnego klienta',
          hours: 1.5,
          description:
            'Określenie typu firmy, wielkości biznesu, osób decyzyjnych, potrzeb, problemów i powodów, dla których klient może rozważyć zmianę obecnego modelu księgowości.',
        },
        {
          id: 'strategy-positioning',
          title: 'Pozycjonowanie i USP',
          hours: 2,
          description:
            'Określenie, czym Gawin & Wojnowska powinny wyróżniać się na tle klasycznych biur rachunkowych i jaką wartość komunikować większym spółkom i ich zarządom.',
        },
        {
          id: 'strategy-offer',
          title: 'Główny offer sprzedażowy',
          hours: 1.5,
          description: 'Opracowanie głównego komunikatu sprzedażowego oraz koncepcji produktu wejściowego / lead magnetu.',
          example: '„Zanim zmienisz księgowość, sprawdź, czy naprawdę warto.”',
        },
        {
          id: 'strategy-website',
          title: 'Koncepcja nowej strony',
          hours: 2,
          description:
            'Rekomendacja struktury strony, najważniejszych sekcji, hero, CTA, hierarchii informacji oraz sposobu komunikowania usług.',
        },
        {
          id: 'strategy-funnel',
          title: 'Koncepcja lejka B2B',
          hours: 1.5,
          description:
            'Określenie, jak połączyć stronę, ofertę, diagnozę, B2B outreach, social media i kontakt sprzedażowy w jeden logiczny proces.',
        },
        {
          id: 'strategy-roadmap',
          title: 'Roadmap i dokument końcowy',
          hours: 1.5,
          description: 'Podsumowanie rekomendacji, kolejność działań i zebranie całej strategii w spójny dokument.',
        },
        {
          id: 'strategy-consultation',
          title: 'Konsultacja i korekta',
          hours: 1,
          description: 'Jedna konsultacja po prezentacji strategii oraz jeden etap doprecyzowania / korekty rekomendacji.',
        },
      ],
      presets: [
        {
          id: 'quick-audit',
          title: 'Szybki audyt',
          hours: 4,
          description: 'Dla firm, które chcą szybko zobaczyć najważniejsze problemy, błędy i priorytety.',
          taskIds: ['strategy-situation', 'strategy-audit'],
          remainderLabel: 'Dodatkowa analiza / rekomendacje',
        },
        {
          id: 'audit-direction',
          title: 'Audyt + kierunek strategiczny',
          hours: 8,
          description: 'Audyt obecnej sytuacji plus pierwsze strategiczne rekomendacje dotyczące rynku i klienta.',
          taskIds: ['strategy-situation', 'strategy-audit', 'strategy-competition', 'strategy-icp'],
          remainderLabel: 'Dodatkowe rekomendacje strategiczne',
        },
        {
          id: 'brand-offer',
          title: 'Strategia marki i oferty',
          hours: 12,
          description: 'Pełne określenie klienta, pozycjonowania, USP i głównego offeru sprzedażowego.',
          taskIds: [
            'strategy-situation',
            'strategy-audit',
            'strategy-competition',
            'strategy-icp',
            'strategy-positioning',
            'strategy-offer',
          ],
          remainderLabel: 'Czas na dopracowanie rekomendacji',
        },
        {
          id: 'full-strategy',
          title: 'Pełna strategia marketingowa',
          hours: 16,
          badge: 'Rekomendowane',
          description:
            'Pełny zakres: audyt, konkurencja, klient, pozycjonowanie, oferta, koncepcja strony, lejek B2B, roadmap i konsultacja.',
          taskIds: [
            'strategy-situation',
            'strategy-audit',
            'strategy-competition',
            'strategy-icp',
            'strategy-positioning',
            'strategy-offer',
            'strategy-website',
            'strategy-funnel',
            'strategy-roadmap',
            'strategy-consultation',
          ],
        },
      ],
      rules: [
        {
          when: 'strategy-positioning',
          requires: ['strategy-icp'],
          message:
            'Rekomendujemy również „Profil idealnego klienta”, ponieważ stanowi podstawę skutecznego pozycjonowania.',
        },
        {
          when: 'strategy-funnel',
          requires: ['strategy-icp', 'strategy-offer'],
          message: 'Dla skutecznego lejka rekomendujemy wcześniej określić idealnego klienta i główny offer sprzedażowy.',
        },
        {
          when: 'strategy-website',
          requires: ['strategy-positioning', 'strategy-offer'],
          message:
            'Strona będzie skuteczniejsza, jeśli wcześniej określimy pozycjonowanie i główny komunikat sprzedażowy.',
        },
      ],
    },
  },
  {
    id: 'branding',
    anchor: 'branding',
    navLabel: 'Branding',
    label: 'Branding',
    roadmapLine: 'Spójny system wizualny marki.',
    eyebrow: 'Identyfikacja wizualna',
    title: 'Branding',
    intro: [
      'Spójny system wizualny pozwoli połączyć stronę internetową, sesję, social media i materiały sprzedażowe w jedną rozpoznawalną markę.',
    ],
    options: { hint: 'Wybierz jeden z dwóch wariantów.', changeMessage: 'Zmieniono wariant brandingu' },
  },
  {
    id: 'session',
    anchor: 'sesja',
    navLabel: 'Sesja',
    label: 'Sesja wizerunkowa',
    roadmapLine: 'Autentyczne zdjęcia i video założycielek.',
    eyebrow: 'Sesja wizerunkowa',
    title: 'Profesjonalny wizerunek marki',
    cardBlocks: [
      {
        type: 'media',
        label: 'Rodzaje materiałów',
        items: [
          { icon: 'camera', label: 'Fotografia' },
          { icon: 'monitor', label: 'Video i B-roll' },
          { icon: 'users', label: 'Portrety i zdjęcia wspólne' },
        ],
      },
    ],
    cardAfter: [
      {
        type: 'note',
        lines: ['Surowe materiały video są przekazywane klientowi.', 'Montaż video może zostać wyceniony osobno.'],
      },
    ],
  },
  {
    id: 'website',
    anchor: 'strona',
    navLabel: 'Strona',
    label: 'Landing page lub nowa strona',
    roadmapLine: 'Landing pod kampanię albo nowa strona sprzedażowa.',
    eyebrow: 'Landing page lub nowa strona',
    title: 'Strona, która nie tylko prezentuje kancelarię, ale prowadzi potencjalnego klienta do kontaktu.',
    intro: [
      'Do wyboru są dwie drogi: kampanijny landing page, który działa obok obecnej strony, albo nowa, rozbudowana strona sprzedażowa.',
    ],
    blocks: [
      {
        type: 'notes',
        items: [
          {
            icon: 'target',
            title: 'Czym jest landing page?',
            text: 'To osobna, jednostronicowa strona przygotowana pod jedną kampanię i jedną grupę odbiorców — np. zarządy spółek z wybranej branży lub regionu. Ma jeden cel: doprowadzić odbiorcę do kontaktu lub zapisu na diagnozę księgowości.',
          },
          {
            icon: 'shield',
            title: 'Obecna strona zostaje bez zmian.',
            text: 'Landing działa obok istniejącej strony Kancelarii — pod osobnym adresem lub subdomeną. Nie przebudowujemy obecnej witryny; to na landing kierujemy ruch z kampanii (np. B2B Email Outreach).',
          },
        ],
      },
    ],
    options: {
      hint: 'Wybierz jeden z dwóch wariantów.',
      showPriceRange: true,
      changeMessage: 'Zmieniono wariant strony',
    },
  },
  {
    id: 'outreach',
    anchor: 'outreach',
    navLabel: 'B2B Outreach',
    label: 'B2B Email Outreach pod klucz',
    roadmapLine: 'Docieramy bezpośrednio do osób decyzyjnych.',
    eyebrow: 'B2B Email Outreach pod klucz',
    title: 'Nie czekamy, aż właściwa firma znajdzie kancelarię. *Docieramy bezpośrednio do właściwych osób.*',
    intro: [
      'Budujemy precyzyjną bazę potencjalnych klientów, identyfikujemy właściwe osoby decyzyjne i prowadzimy spersonalizowaną komunikację email.',
      'To szczególnie skuteczne, gdy chcecie dotrzeć do konkretnych, wybranych spółek — zamiast polegać wyłącznie na social media czy ruchu organicznym i czekać, aż właściwy klient sam trafi na stronę.',
    ],
    blocks: [
      {
        type: 'chips',
        groups: [
          {
            title: 'Możliwe kryteria doboru firm',
            icon: 'target',
            items: [
              'PKD',
              'region / województwo',
              'przychody / obroty',
              'wielkość firmy',
              'forma prawna',
              'aktywność przetargowa',
              'aktywna rekrutacja',
              'inne uzgodnione kryteria',
            ],
          },
          {
            title: 'Osoby decyzyjne',
            icon: 'users',
            items: ['Prezes Zarządu', 'właściciel', 'CFO', 'Dyrektor Finansowy', 'Członek Zarządu', 'inne wybrane stanowiska'],
          },
        ],
      },
      {
        type: 'process',
        label: 'Jak działa kampania',
        steps: ['Selekcja firm', 'Baza i kontakty', 'Personalizacja', 'Email', 'Follow-up', 'Zainteresowany lead'],
      },
      {
        type: 'features',
        title: 'Co obejmuje usługa?',
        items: [
          { icon: 'database', title: 'Baza firm', text: 'Tworzenie bazy według ustalonych kryteriów.' },
          { icon: 'sparkle', title: 'Segmentacja i AI', text: 'Analiza i wzbogacanie danych.' },
          { icon: 'globe', title: 'Domeny i skrzynki', text: 'Dedykowana infrastruktura mailingowa.' },
          { icon: 'flame', title: 'Warming', text: 'Przygotowanie skrzynek przed kampanią.' },
          { icon: 'shield', title: 'Walidacja', text: 'Weryfikacja danych i adresów email.' },
          { icon: 'pen', title: 'Copywriting', text: 'Przygotowanie całej sekwencji.' },
          { icon: 'layers', title: 'Sekwencja', text: '1 wiadomość + 2 follow-upy.' },
          { icon: 'rocket', title: 'Uruchomienie', text: 'Konfiguracja i start kampanii.' },
          { icon: 'inbox', title: 'Przekazywanie leadów', text: 'Zainteresowane kontakty trafiają do wskazanego kanału.' },
        ],
      },
      {
        type: 'notes',
        items: [
          { icon: 'inbox', title: 'Gdzie trafiają leady?', text: 'CRM, email lub inne uzgodnione narzędzie.' },
          {
            icon: 'info',
            text: 'Aktywne wysyłki rozpoczynają się po przygotowaniu infrastruktury, orientacyjnie od 15. dnia projektu.',
          },
        ],
      },
      {
        type: 'compare',
        eyebrow: 'Ważne',
        title: 'Do czego prowadzimy klienta?',
        badge: 'Do wstępnej rozmowy / diagnozy obecnego modelu księgowości',
        dont: { label: 'Nie komunikujemy', text: '„Zmień księgowość na naszą.”' },
        do: {
          label: 'Komunikujemy',
          text: '„Sprawdźmy, czy obecny model księgowości nadal odpowiada skali i potrzebom Twojej firmy.”',
        },
        conclusion: [
          'Nie proponujemy zmiany księgowości w ciemno.',
          'Najpierw chcemy sprawdzić, czy istnieje biznesowe uzasadnienie do dalszej rozmowy.',
        ],
      },
    ],
    options: {
      eyebrow: 'Pakiety miesięczne · B2B Email Outreach',
      title: 'Wybierz skalę kampanii',
      hint: 'Można wybrać jeden pakiet.',
      changeMessage: 'Zmieniono pakiet B2B Outreach',
    },
  },
]

export const PROPOSAL: Proposal = {
  id: 'gawin-wojnowska',
  meta: {
    title: 'Gawin & Wojnowska × PiXEL EXPERTS TEAM — Propozycja współpracy',
    description:
      'Interaktywna propozycja współpracy: strategia, branding, sesja wizerunkowa, strona internetowa i B2B Email Outreach dla Kancelarii Gawin & Wojnowska.',
  },
  client: {
    logo: 'GAWIN & WOJNOWSKA',
    tagline: 'KSIĘGOWOŚĆ • FINANSE • ROZWÓJ',
    fullName: 'Kancelaria Gawin & Wojnowska',
  },
  agency: { name: 'PiXEL EXPERTS TEAM' },
  headerCta: 'Skonfiguruj ofertę',
  hero: {
    eyebrow: 'Propozycja współpracy',
    title: 'Zbudujmy markę, która przyciąga *właściwych* klientów.',
    subtitle:
      'Strategia, branding, strona internetowa, profesjonalny wizerunek i aktywne pozyskiwanie klientów B2B — połączone w jeden spójny system.',
    body: 'Proponujemy współpracę etapami. Możecie wybrać tylko te elementy, które są Wam potrzebne, a aktualny koszt wybranego zakresu zobaczycie od razu.',
    primaryCta: 'Skonfiguruj swoją ofertę',
    secondaryCta: 'Zobacz etapy współpracy',
    reassurance: 'Każdy moduł można wybrać niezależnie.',
  },
  goal: {
    navLabel: 'Cel',
    eyebrow: 'Cel projektu',
    title: 'Od dobrego wizerunku do systemowego pozyskiwania klientów',
    paragraphs: [
      'Celem projektu jest stworzenie spójnego wizerunku Kancelarii Gawin & Wojnowska oraz systemu marketingowego, który pozwoli docierać do większych spółek, właścicieli firm i członków zarządów.',
      'Chcemy pokazać Kancelarię jako partnera, któremu zarząd może powierzyć jeden z najważniejszych obszarów biznesu: księgowość, procesy finansowe, raportowanie i bezpieczeństwo.',
    ],
    quote: 'Nie chcemy budować kolejnego wizerunku „biura rachunkowego”.',
    process: ['Strategia', 'Marka', 'Wizerunek', 'Strona', 'Pozyskiwanie klientów'],
  },
  roadmap: {
    eyebrow: 'Etapy współpracy',
    title: 'Pięć modułów, jeden spójny kierunek',
    intro:
      'Rekomendujemy realizację w poniższej kolejności — każdy etap wzmacnia kolejny. Nie narzucamy jednak pakietu: wybierzcie moduły, które odpowiadają Waszym potrzebom.',
  },
  stages,
  services,
  recommended: {
    afterStage: 'website',
    eyebrow: 'Nie wiesz, od czego zacząć?',
    title: 'Rekomendowany zestaw',
    text: 'Fundament marki w jednym kroku: strategia, pełna identyfikacja, profesjonalne materiały i strona przygotowana pod klientów B2B.',
    serviceIds: ['strategy', 'branding-pro', 'session', 'website-pro'],
    cta: 'Dodaj rekomendowany zestaw',
    footnote: 'Po przygotowaniu marki i strony możemy uruchomić B2B Email Outreach jako kolejny etap.',
  },
  closing: {
    eyebrow: 'Kolejny krok',
    title: 'Wybraliście zakres? Prześlijcie go nam.',
    text: 'Otrzymamy gotową konfigurację i skontaktujemy się, aby potwierdzić szczegóły oraz zaplanować start współpracy.',
    journey: [
      'Czytam propozycję',
      'Rozumiem logikę współpracy',
      'Wybieram potrzebne moduły',
      'Widzę aktualną sumę netto',
      'Wysyłam wybrany zakres',
    ],
  },
  emails: {
    adminSubject: 'Nowa konfiguracja oferty — Gawin & Wojnowska',
    clientSubject: 'Dziękujemy — otrzymaliśmy wybrany zakres współpracy',
    clientIntro: [
      'Dziękujemy za przesłanie konfiguracji.',
      'Otrzymaliśmy wybrany przez Was zakres współpracy i skontaktujemy się, aby potwierdzić szczegóły oraz ustalić kolejne kroki.',
    ],
    signature: 'PiXEL EXPERTS TEAM',
  },
}
