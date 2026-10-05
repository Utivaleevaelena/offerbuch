/**
 * Logika konfiguratora zakresu pracy (usługi rozliczane według czasu).
 * Wspólna dla interfejsu i serwera — serwer przelicza cenę sam, nie ufa przeglądarce.
 */
import { PROPOSAL } from '../content/proposal.js'
import type {
  Proposal,
  ResolvedScope,
  ScopeConfigurator,
  ScopePreset,
  ScopeSelection,
  ScopeTask,
  Service,
} from '../content/types.js'

/** Zaokrągla do najbliższej wielokrotności kroku (np. 0,5 h). */
export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step
}

export function getConfigurator(serviceId: string, p: Proposal = PROPOSAL): ScopeConfigurator | undefined {
  return p.stages.find((s) => s.configurator?.serviceId === serviceId)?.configurator
}

export function sumHours(tasks: ScopeTask[]): number {
  return tasks.reduce((sum, t) => sum + t.hours, 0)
}

/** Elementy w kolejności priorytetu (kolejność z konfiguracji). */
export function tasksById(cfg: ScopeConfigurator, ids: string[]): ScopeTask[] {
  return cfg.tasks.filter((t) => ids.includes(t.id))
}

/**
 * Suwak → elementy: wybiera pełne elementy w kolejności priorytetu, dopóki mieszczą się w czasie.
 * Pierwszy element, który się nie mieści, kończy wybór — reszta czasu to „czas dodatkowy”.
 */
export function selectionForHours(cfg: ScopeConfigurator, hours: number): ScopeSelection {
  const taskIds: string[] = []
  let used = 0
  for (const task of cfg.tasks) {
    if (used + task.hours > hours + 1e-9) break
    used += task.hours
    taskIds.push(task.id)
  }
  return { hours, taskIds }
}

/** Elementy → suwak: czas = suma wybranych elementów. */
export function selectionForTasks(cfg: ScopeConfigurator, taskIds: string[]): ScopeSelection {
  const ordered = tasksById(cfg, taskIds)
  return { hours: sumHours(ordered), taskIds: ordered.map((t) => t.id) }
}

export function selectionForPreset(preset: ScopePreset): ScopeSelection {
  return { hours: preset.hours, taskIds: [...preset.taskIds] }
}

/** Pełny zakres (wszystkie elementy) — używany np. w rekomendowanym zestawie. */
export function fullSelection(cfg: ScopeConfigurator): ScopeSelection {
  return { hours: cfg.defaultHours, taskIds: cfg.tasks.map((t) => t.id) }
}

/** Gotowy zakres odpowiadający dokładnie temu wyborowi (jeśli jest). */
export function matchingPreset(cfg: ScopeConfigurator, sel: ScopeSelection): ScopePreset | undefined {
  return cfg.presets.find(
    (p) =>
      p.hours === sel.hours &&
      p.taskIds.length === sel.taskIds.length &&
      p.taskIds.every((id) => sel.taskIds.includes(id)),
  )
}

/** Walidacja zakresu z przeglądarki / localStorage. Zwraca null, gdy zakres jest pusty. */
export function sanitizeScope(cfg: ScopeConfigurator, raw: unknown): ScopeSelection | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>
  const ids = Array.isArray(data.taskIds) ? data.taskIds.filter((id): id is string => typeof id === 'string') : []
  const tasks = tasksById(cfg, ids)
  const minHours = sumHours(tasks)
  const hoursRaw = typeof data.hours === 'number' && Number.isFinite(data.hours) ? data.hours : minHours
  const hours = Math.min(cfg.maxHours, Math.max(minHours, roundToStep(hoursRaw, cfg.step)))
  if (hours <= 0) return null
  return { hours, taskIds: tasks.map((t) => t.id) }
}

/** Zakres z policzonym czasem dodatkowym — do podsumowania i emaila. */
export function resolveScope(cfg: ScopeConfigurator, sel: ScopeSelection, rateNet: number): ResolvedScope {
  const tasks = tasksById(cfg, sel.taskIds)
  const extraHours = Math.max(0, roundToStep(sel.hours - sumHours(tasks), cfg.step))
  const preset = matchingPreset(cfg, sel)
  return {
    hours: sel.hours,
    rateNet,
    tasks,
    extraHours,
    extraLabel: preset?.remainderLabel ?? cfg.extraLabel,
  }
}

/** Usługa z ceną wynikającą z wybranego zakresu (dla `hourly`). */
export function withScope(service: Service, sel: ScopeSelection | undefined, p: Proposal = PROPOSAL): Service {
  if (service.billing !== 'hourly') return service
  const cfg = getConfigurator(service.id, p)
  const rate = service.hourlyRateNet ?? 0
  if (!cfg) return service
  const selection = sel ?? fullSelection(cfg)
  return { ...service, priceNet: selection.hours * rate, scope: resolveScope(cfg, selection, rate) }
}

/** Rekomendacje zależności dla danego elementu (gdy brakuje elementów bazowych). */
export function ruleMessages(cfg: ScopeConfigurator, taskId: string, selectedIds: string[]): string[] {
  return cfg.rules
    .filter((r) => r.when === taskId && r.requires.some((req) => !selectedIds.includes(req)))
    .map((r) => r.message)
}

/** Format godzin: 7,5 (pl/ru) lub 7.5 (en). */
export function formatHours(hours: number, lang: string): string {
  const n = Number.isInteger(hours) ? String(hours) : hours.toFixed(1)
  return lang === 'en' ? n : n.replace('.', ',')
}
