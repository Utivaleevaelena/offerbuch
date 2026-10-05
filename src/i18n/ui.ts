/**
 * Języki i teksty interfejsu (wspólne dla przeglądarki i serwera).
 * Teksty oferty (etapy, usługi, opisy) są w src/content — tu tylko elementy stałe aplikacji.
 */

export const LANGS = ['pl', 'en', 'ru'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'pl'

export const LANG_NAMES: Record<Lang, string> = { pl: 'Polski', en: 'English', ru: 'Русский' }

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value)
}

/** Cena: „1 200 zł” (pl, ru) lub „1,200 PLN” (en). */
export function formatPrice(value: number, lang: Lang = DEFAULT_LANG): string {
  const n = Math.round(value).toString()
  if (lang === 'en') return `${n.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} PLN`
  return `${n.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} zł`
}

/** Odmiana słowa „moduł” w zależności od liczby. */
function slavicPlural(n: number, one: string, few: string, many: string): string {
  const last = n % 10
  const lastTwo = n % 100
  if (n === 1) return one
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return few
  return many
}

export interface UiStrings {
  net: string
  perMonth: string
  perMonthShort: string
  from: string
  stage: string
  modules: (n: number) => string

  // nagłówek i nawigacja
  skipToConfigurator: string
  backToTop: string
  openMenu: string
  closeMenu: string
  language: string
  sections: string
  close: string

  // hero / mapa / etapy
  preparedFor: string
  preparedBy: string
  allPricesNet: string
  proposalSummary: string
  seeStage: string
  estimatedBudget: string
  whatsIncluded: string
  addedToOffer: string
  remove: string
  removeFromOffer: (name: string) => string
  selectedVariant: string

  // rekomendowany zestaw
  total: string
  setInOffer: string
  alreadyInOffer: string

  // panel „Twoja oferta”
  yourOffer: string
  selectedScope: string
  variant: string
  change: string
  emptyTitle: string
  emptyText: string
  netTotal: string
  oneTimeServices: string
  pricesAreNet: string
  sendOffer: string
  noModulesYet: string
  addAtLeastOne: string
  howItWorks: string
  preparedByFooter: string

  // toasty
  toastAdded: string
  toastRemoved: string
  toastSetAdded: string
  toastVariantChanged: string

  // formularz
  lastStep: string
  formTitle: string
  scopeCount: (n: number) => string
  fieldName: string
  fieldCompany: string
  fieldEmail: string
  fieldPhone: string
  fieldMessage: string
  messagePlaceholder: string
  consent: string
  requiredFields: string
  sending: string
  scopeKept: string
  errName: string
  errEmailEmpty: string
  errEmail: string
  errConsent: string
  errSend: string
  errNetwork: string

  // sukces
  thanks: string
  received: string
  willContact: string
  sentScope: string
  backToOffer: string

  // konfigurator zakresu (strategia)
  scope: {
    hours: (h: string) => string
    perHour: string
    rate: (price: string) => string
    presetsTitle: string
    presetsHint: string
    sliderTitle: string
    sliderHint: string
    selectedTime: string
    estimatedCost: string
    tasksTitle: string
    tasksHint: string
    summaryTitle: string
    areas: string
    workTime: string
    cost: string
    extraTime: string
    remaining: string
    add: string
    update: string
    added: string
    empty: string
    inspiration: string
    edit: string
    details: string
    hoursTimesRate: (hours: string, rate: string) => string
    toastAdded: string
    toastUpdated: string
  }

  // emaile i serwer
  email: {
    greeting: (name: string) => string
    scope: string
    oneTimeSum: string
    monthly: string
    perMonthLong: string
    regards: string
    preparedBy: (agency: string) => string
  }
  server: {
    invalid: string
    noServices: string
    unavailable: string
    sendFailed: string
  }
}

const pl: UiStrings = {
  net: 'netto',
  perMonth: 'netto / miesiąc',
  perMonthShort: 'netto / mies.',
  from: 'od',
  stage: 'Etap',
  modules: (n) => slavicPlural(n, 'moduł', 'moduły', 'modułów'),

  skipToConfigurator: 'Przejdź do konfiguratora',
  backToTop: 'początek strony',
  openMenu: 'Otwórz menu',
  closeMenu: 'Zamknij menu',
  language: 'Język',
  sections: 'Sekcje propozycji',
  close: 'Zamknij',

  preparedFor: 'Przygotowano dla',
  preparedBy: 'Przygotował',
  allPricesNet: 'Wszystkie ceny netto.',
  proposalSummary: 'Podsumowanie propozycji',
  seeStage: 'Zobacz etap',
  estimatedBudget: 'Szacunkowy budżet:',
  whatsIncluded: 'Co obejmuje?',
  addedToOffer: 'Dodano do oferty',
  remove: 'Usuń',
  removeFromOffer: (name) => `Usuń z oferty: ${name}`,
  selectedVariant: 'Wybrany wariant',

  total: 'Razem',
  setInOffer: 'Zestaw jest w Twojej ofercie',
  alreadyInOffer: '(już w Twojej ofercie)',

  yourOffer: 'Twoja oferta',
  selectedScope: 'Wybrany zakres współpracy',
  variant: 'Wariant',
  change: 'zmień',
  emptyTitle: 'Nie wybrano jeszcze żadnego modułu.',
  emptyText: 'Dodawajcie elementy propozycji — zakres i suma netto zaktualizują się automatycznie.',
  netTotal: 'Suma netto',
  oneTimeServices: 'Usługi jednorazowe',
  pricesAreNet: 'Podane ceny są cenami netto.',
  sendOffer: 'Wyślij wybraną ofertę',
  noModulesYet: 'Nie wybrano jeszcze modułów',
  addAtLeastOne: 'Dodajcie co najmniej jeden moduł, aby wysłać ofertę.',
  howItWorks: 'Jak to działa',
  preparedByFooter: 'Propozycja współpracy przygotowana przez',

  toastAdded: 'Dodano do oferty',
  toastRemoved: 'Usunięto z oferty',
  toastSetAdded: 'Dodano rekomendowany zestaw',
  toastVariantChanged: 'Zmieniono wariant',

  lastStep: 'Ostatni krok',
  formTitle: 'Wyślij nam wybrany zakres współpracy',
  scopeCount: (n) => `Wybrany zakres: ${n} ${pl.modules(n)}`,
  fieldName: 'Imię i nazwisko',
  fieldCompany: 'Firma',
  fieldEmail: 'Email',
  fieldPhone: 'Telefon',
  fieldMessage: 'Dodatkowa wiadomość',
  messagePlaceholder: 'Jeśli chcecie coś zmienić lub dodać do zakresu, napiszcie tutaj.',
  consent: 'Wyrażam zgodę na kontakt w sprawie przesłanej konfiguracji oferty.',
  requiredFields: '* pola wymagane',
  sending: 'Wysyłanie…',
  scopeKept: 'Wybrany zakres został zachowany.',
  errName: 'Podaj imię i nazwisko.',
  errEmailEmpty: 'Podaj adres email.',
  errEmail: 'Podaj poprawny adres email.',
  errConsent: 'Zaznacz zgodę, abyśmy mogli się z Wami skontaktować.',
  errSend: 'Nie udało się wysłać konfiguracji. Spróbujcie ponownie za chwilę.',
  errNetwork: 'Brak połączenia z serwerem. Sprawdźcie połączenie i spróbujcie ponownie.',

  thanks: 'Dziękujemy!',
  received: 'Otrzymaliśmy wybraną konfigurację.',
  willContact: 'Skontaktujemy się z Wami, aby omówić szczegóły i zaplanować kolejne kroki.',
  sentScope: 'Przesłany zakres',
  backToOffer: 'Wróć do oferty',

  scope: {
    hours: (h) => `${h} h`,
    perHour: 'godz.',
    rate: (price) => `${price} netto / godz.`,
    presetsTitle: 'Rekomendowany zakres',
    presetsHint: 'Gotowe zakresy ustawiają czas i elementy strategii — każdy możecie dowolnie zmienić.',
    sliderTitle: 'Czas strategiczny',
    sliderHint: 'Więcej czasu to szerszy zakres pracy i więcej elementów strategii.',
    selectedTime: 'Wybrany czas',
    estimatedCost: 'Szacowany koszt',
    tasksTitle: 'Co przygotujemy?',
    tasksHint: 'Zaznaczcie elementy, na których mamy się skupić — szacowany czas pracy i koszt przeliczą się automatycznie.',
    summaryTitle: 'Twój zakres strategiczny',
    areas: 'Wybrane obszary',
    workTime: 'Czas pracy',
    cost: 'Koszt',
    extraTime: 'Dodatkowy czas',
    remaining: 'Pozostały czas',
    add: 'Dodaj wybrany zakres do oferty',
    update: 'Zaktualizuj zakres w ofercie',
    added: 'Zakres jest w Twojej ofercie',
    empty: 'Ustawcie czas na suwaku lub zaznaczcie elementy strategii.',
    inspiration: 'Przykładowy kierunek:',
    edit: 'Edytuj zakres',
    details: 'Zakres pracy',
    hoursTimesRate: (h, r) => `${h} h × ${r}`,
    toastAdded: 'Dodano zakres strategii do oferty',
    toastUpdated: 'Zaktualizowano zakres strategii',
  },

  email: {
    greeting: (name) => `Dzień dobry ${name},`,
    scope: 'Wybrany zakres',
    oneTimeSum: 'Suma usług jednorazowych',
    monthly: 'Usługa miesięczna',
    perMonthLong: 'netto / miesiąc',
    regards: 'Z pozdrowieniami,',
    preparedBy: (agency) => `Propozycja współpracy przygotowana przez ${agency}`,
  },
  server: {
    invalid: 'Nieprawidłowe dane formularza.',
    noServices: 'Wybierz co najmniej jedną usługę.',
    unavailable: 'Wysyłka jest chwilowo niedostępna. Spróbujcie ponownie później.',
    sendFailed: 'Nie udało się wysłać konfiguracji. Spróbujcie ponownie za chwilę.',
  },
}

const en: UiStrings = {
  net: 'net',
  perMonth: 'net / month',
  perMonthShort: 'net / mo.',
  from: 'from',
  stage: 'Stage',
  modules: (n) => (n === 1 ? 'module' : 'modules'),

  skipToConfigurator: 'Skip to configurator',
  backToTop: 'back to top',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  language: 'Language',
  sections: 'Proposal sections',
  close: 'Close',

  preparedFor: 'Prepared for',
  preparedBy: 'Prepared by',
  allPricesNet: 'All prices are net.',
  proposalSummary: 'Proposal summary',
  seeStage: 'See stage',
  estimatedBudget: 'Estimated budget:',
  whatsIncluded: "What's included?",
  addedToOffer: 'Added to offer',
  remove: 'Remove',
  removeFromOffer: (name) => `Remove from offer: ${name}`,
  selectedVariant: 'Selected option',

  total: 'Total',
  setInOffer: 'The set is in your offer',
  alreadyInOffer: '(already in your offer)',

  yourOffer: 'Your offer',
  selectedScope: 'Selected scope of cooperation',
  variant: 'Option',
  change: 'change',
  emptyTitle: 'No modules selected yet.',
  emptyText: 'Add elements of the proposal — the scope and net total will update automatically.',
  netTotal: 'Net total',
  oneTimeServices: 'One-time services',
  pricesAreNet: 'All prices are net (excl. VAT).',
  sendOffer: 'Send selected offer',
  noModulesYet: 'No modules selected yet',
  addAtLeastOne: 'Add at least one module to send the offer.',
  howItWorks: 'How it works',
  preparedByFooter: 'Proposal prepared by',

  toastAdded: 'Added to offer',
  toastRemoved: 'Removed from offer',
  toastSetAdded: 'Recommended set added',
  toastVariantChanged: 'Option changed',

  lastStep: 'Last step',
  formTitle: 'Send us your selected scope of cooperation',
  scopeCount: (n) => `Selected scope: ${n} ${en.modules(n)}`,
  fieldName: 'Full name',
  fieldCompany: 'Company',
  fieldEmail: 'Email',
  fieldPhone: 'Phone',
  fieldMessage: 'Additional message',
  messagePlaceholder: 'If you would like to change or add anything to the scope, write it here.',
  consent: 'I agree to be contacted regarding the submitted offer configuration.',
  requiredFields: '* required fields',
  sending: 'Sending…',
  scopeKept: 'Your selected scope has been kept.',
  errName: 'Please enter your full name.',
  errEmailEmpty: 'Please enter your email address.',
  errEmail: 'Please enter a valid email address.',
  errConsent: 'Please tick the consent box so we can contact you.',
  errSend: 'The configuration could not be sent. Please try again in a moment.',
  errNetwork: 'No connection to the server. Please check your connection and try again.',

  thanks: 'Thank you!',
  received: 'We have received your configuration.',
  willContact: 'We will get in touch to discuss the details and plan the next steps.',
  sentScope: 'Submitted scope',
  backToOffer: 'Back to offer',

  scope: {
    hours: (h) => `${h} h`,
    perHour: 'h',
    rate: (price) => `${price} net / hour`,
    presetsTitle: 'Recommended scope',
    presetsHint: 'Ready-made scopes set the time and strategy elements — you can adjust any of them.',
    sliderTitle: 'Strategic time',
    sliderHint: 'More time means a broader scope of work and more strategy elements.',
    selectedTime: 'Selected time',
    estimatedCost: 'Estimated cost',
    tasksTitle: 'What will we prepare?',
    tasksHint: 'Select the elements we should focus on — the estimated working time and cost update automatically.',
    summaryTitle: 'Your strategic scope',
    areas: 'Selected areas',
    workTime: 'Working time',
    cost: 'Cost',
    extraTime: 'Additional time',
    remaining: 'Remaining time',
    add: 'Add the selected scope to the offer',
    update: 'Update the scope in your offer',
    added: 'This scope is in your offer',
    empty: 'Set the time with the slider or select strategy elements.',
    inspiration: 'Example direction:',
    edit: 'Edit scope',
    details: 'Scope of work',
    hoursTimesRate: (h, r) => `${h} h × ${r}`,
    toastAdded: 'Strategy scope added to offer',
    toastUpdated: 'Strategy scope updated',
  },

  email: {
    greeting: (name) => `Hello ${name},`,
    scope: 'Selected scope',
    oneTimeSum: 'One-time services total',
    monthly: 'Monthly service',
    perMonthLong: 'net / month',
    regards: 'Kind regards,',
    preparedBy: (agency) => `Proposal prepared by ${agency}`,
  },
  server: {
    invalid: 'Invalid form data.',
    noServices: 'Please select at least one service.',
    unavailable: 'Sending is temporarily unavailable. Please try again later.',
    sendFailed: 'The configuration could not be sent. Please try again in a moment.',
  },
}

const ru: UiStrings = {
  net: 'нетто',
  perMonth: 'нетто / месяц',
  perMonthShort: 'нетто / мес.',
  from: 'от',
  stage: 'Этап',
  modules: (n) => slavicPlural(n, 'модуль', 'модуля', 'модулей'),

  skipToConfigurator: 'Перейти к конфигуратору',
  backToTop: 'в начало страницы',
  openMenu: 'Открыть меню',
  closeMenu: 'Закрыть меню',
  language: 'Язык',
  sections: 'Разделы предложения',
  close: 'Закрыть',

  preparedFor: 'Подготовлено для',
  preparedBy: 'Подготовил',
  allPricesNet: 'Все цены указаны нетто.',
  proposalSummary: 'Кратко о предложении',
  seeStage: 'Смотреть этап',
  estimatedBudget: 'Ориентировочный бюджет:',
  whatsIncluded: 'Что входит?',
  addedToOffer: 'Добавлено в оферту',
  remove: 'Удалить',
  removeFromOffer: (name) => `Удалить из оферты: ${name}`,
  selectedVariant: 'Выбранный вариант',

  total: 'Итого',
  setInOffer: 'Набор уже в вашей оферте',
  alreadyInOffer: '(уже в вашей оферте)',

  yourOffer: 'Ваша оферта',
  selectedScope: 'Выбранный объём сотрудничества',
  variant: 'Вариант',
  change: 'изменить',
  emptyTitle: 'Пока не выбрано ни одного модуля.',
  emptyText: 'Добавляйте элементы предложения — объём и сумма нетто обновятся автоматически.',
  netTotal: 'Сумма нетто',
  oneTimeServices: 'Разовые услуги',
  pricesAreNet: 'Все цены указаны нетто (без НДС).',
  sendOffer: 'Отправить выбранную оферту',
  noModulesYet: 'Модули ещё не выбраны',
  addAtLeastOne: 'Добавьте хотя бы один модуль, чтобы отправить оферту.',
  howItWorks: 'Как это работает',
  preparedByFooter: 'Предложение подготовлено',

  toastAdded: 'Добавлено в оферту',
  toastRemoved: 'Удалено из оферты',
  toastSetAdded: 'Рекомендуемый набор добавлен',
  toastVariantChanged: 'Вариант изменён',

  lastStep: 'Последний шаг',
  formTitle: 'Отправьте нам выбранный объём сотрудничества',
  scopeCount: (n) => `Выбранный объём: ${n} ${ru.modules(n)}`,
  fieldName: 'Имя и фамилия',
  fieldCompany: 'Компания',
  fieldEmail: 'Email',
  fieldPhone: 'Телефон',
  fieldMessage: 'Дополнительное сообщение',
  messagePlaceholder: 'Если хотите что-то изменить или добавить к объёму работ, напишите здесь.',
  consent: 'Я согласен(на) на связь по поводу отправленной конфигурации оферты.',
  requiredFields: '* обязательные поля',
  sending: 'Отправка…',
  scopeKept: 'Выбранный объём сохранён.',
  errName: 'Укажите имя и фамилию.',
  errEmailEmpty: 'Укажите адрес email.',
  errEmail: 'Укажите корректный адрес email.',
  errConsent: 'Отметьте согласие, чтобы мы могли с вами связаться.',
  errSend: 'Не удалось отправить конфигурацию. Попробуйте ещё раз через минуту.',
  errNetwork: 'Нет соединения с сервером. Проверьте подключение и попробуйте снова.',

  thanks: 'Спасибо!',
  received: 'Мы получили выбранную конфигурацию.',
  willContact: 'Мы свяжемся с вами, чтобы обсудить детали и спланировать следующие шаги.',
  sentScope: 'Отправленный объём',
  backToOffer: 'Вернуться к оферте',

  scope: {
    hours: (h) => `${h} ч`,
    perHour: 'ч',
    rate: (price) => `${price} нетто / час`,
    presetsTitle: 'Рекомендуемый объём',
    presetsHint: 'Готовые варианты задают время и элементы стратегии — любой из них можно изменить.',
    sliderTitle: 'Стратегическое время',
    sliderHint: 'Больше времени — шире объём работ и больше элементов стратегии.',
    selectedTime: 'Выбранное время',
    estimatedCost: 'Ориентировочная стоимость',
    tasksTitle: 'Что мы подготовим?',
    tasksHint: 'Отметьте элементы, на которых нам стоит сосредоточиться, — время работы и стоимость пересчитаются автоматически.',
    summaryTitle: 'Ваш стратегический объём',
    areas: 'Выбранные области',
    workTime: 'Время работы',
    cost: 'Стоимость',
    extraTime: 'Дополнительное время',
    remaining: 'Оставшееся время',
    add: 'Добавить выбранный объём в оферту',
    update: 'Обновить объём в оферте',
    added: 'Этот объём уже в вашей оферте',
    empty: 'Задайте время ползунком или отметьте элементы стратегии.',
    inspiration: 'Пример направления:',
    edit: 'Изменить объём',
    details: 'Объём работ',
    hoursTimesRate: (h, r) => `${h} ч × ${r}`,
    toastAdded: 'Объём стратегии добавлен в оферту',
    toastUpdated: 'Объём стратегии обновлён',
  },

  email: {
    greeting: (name) => `Здравствуйте, ${name}!`,
    scope: 'Выбранный объём',
    oneTimeSum: 'Сумма разовых услуг',
    monthly: 'Ежемесячная услуга',
    perMonthLong: 'нетто / месяц',
    regards: 'С уважением,',
    preparedBy: (agency) => `Предложение подготовлено ${agency}`,
  },
  server: {
    invalid: 'Некорректные данные формы.',
    noServices: 'Выберите хотя бы одну услугу.',
    unavailable: 'Отправка временно недоступна. Попробуйте позже.',
    sendFailed: 'Не удалось отправить конфигурацию. Попробуйте ещё раз через минуту.',
  },
}

export const UI: Record<Lang, UiStrings> = { pl, en, ru }
