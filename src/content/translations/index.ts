/**
 * Zarejestrowane tłumaczenia oferty. Usuń język z tej listy, aby zniknął z przełącznika.
 * Polski (proposal.ts) jest zawsze dostępny jako wersja bazowa.
 */
import type { Lang } from '../../i18n/ui.js'
import type { ProposalTranslation } from '../localize.js'
import { en } from './en.js'
import { ru } from './ru.js'

export const TRANSLATIONS: Partial<Record<Lang, ProposalTranslation>> = { en, ru }
