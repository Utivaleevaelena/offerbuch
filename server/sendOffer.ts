/**
 * Obsługa wysyłki konfiguracji oferty.
 *
 * Działa po stronie serwera (Vercel Function: api/send-offer.ts,
 * w trybie dev: middleware Vite). Klucz API i adres administratora
 * są czytane wyłącznie ze zmiennych środowiskowych — nigdy nie trafiają
 * do kodu frontendu.
 *
 * Ceny NIE są przyjmowane od klienta — serwer przelicza je na podstawie
 * identyfikatorów usług i wspólnego pliku konfiguracyjnego oferty.
 */
import { formatPLN, sanitizeSelection, stageLabel, summarize, type OfferSummary } from '../src/lib/summary.js'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'
const ADMIN_SUBJECT = 'Nowa konfiguracja oferty — Gawin & Wojnowska'
const CLIENT_SUBJECT = 'Dziękujemy — otrzymaliśmy wybrany zakres współpracy'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface Contact {
  name: string
  company: string
  email: string
  phone: string
  message: string
}

interface ParsedPayload {
  contact: Contact
  selectedIds: string[]
}

class ValidationError extends Error {}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function parsePayload(body: unknown): ParsedPayload {
  if (!body || typeof body !== 'object') throw new ValidationError('Nieprawidłowe dane formularza.')
  const data = body as Record<string, unknown>
  const raw = (data.contact ?? {}) as Record<string, unknown>

  const contact: Contact = {
    name: str(raw.name, 120),
    company: str(raw.company, 160),
    email: str(raw.email, 160),
    phone: str(raw.phone, 40),
    message: str(raw.message, 3000),
  }

  if (!contact.name) throw new ValidationError('Podaj imię i nazwisko.')
  if (!EMAIL_RE.test(contact.email)) throw new ValidationError('Podaj poprawny adres email.')
  if (data.consent !== true) throw new ValidationError('Zgoda na kontakt jest wymagana.')

  const selectedIds = sanitizeSelection(data.selectedIds)
  if (selectedIds.length === 0) throw new ValidationError('Wybierz co najmniej jedną usługę.')

  return { contact, selectedIds }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Zamienia twarde spacje na zwykłe — czytelniej w klientach poczty tekstowej. */
const plain = (value: string) => value.replace(/ /g, ' ')

function timestamp(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'long',
    timeStyle: 'medium',
    timeZone: 'Europe/Warsaw',
  }).format(date)
}

// ───────────────────────── treść emaili ─────────────────────────

function scopeText(summary: OfferSummary): string {
  const lines: string[] = []
  if (summary.oneTimeItems.length) {
    for (const s of summary.oneTimeItems) lines.push(`${s.summaryTitle} — ${plain(formatPLN(s.priceNet))} netto`)
    lines.push('', 'SUMA USŁUG JEDNORAZOWYCH:', `${plain(formatPLN(summary.oneTimeTotal))} netto`)
  }
  if (summary.monthlyItems.length) {
    if (lines.length) lines.push('')
    lines.push('USŁUGA MIESIĘCZNA:', '')
    for (const s of summary.monthlyItems) lines.push(s.summaryTitle, `${plain(formatPLN(s.priceNet))} netto / miesiąc`)
  }
  lines.push('', 'Podane ceny są cenami netto.')
  return lines.join('\n')
}

function adminText(contact: Contact, summary: OfferSummary, ids: string[], sentAt: Date): string {
  return [
    'NOWA KONFIGURACJA OFERTY',
    '',
    'Dane klienta:',
    '',
    `Imię i nazwisko: ${contact.name}`,
    `Firma: ${contact.company || '—'}`,
    `Email: ${contact.email}`,
    `Telefon: ${contact.phone || '—'}`,
    `Wiadomość: ${contact.message || '—'}`,
    '',
    'WYBRANY ZAKRES:',
    '',
    scopeText(summary),
    '',
    '────────────',
    `Data przesłania: ${plain(timestamp(sentAt))} (${sentAt.toISOString()})`,
    `ID wybranych usług: ${ids.join(', ')}`,
  ].join('\n')
}

function clientText(contact: Contact, summary: OfferSummary): string {
  return [
    `Dzień dobry ${contact.name},`,
    '',
    'Dziękujemy za przesłanie konfiguracji.',
    '',
    'Otrzymaliśmy wybrany przez Was zakres współpracy i skontaktujemy się, aby potwierdzić szczegóły oraz ustalić kolejne kroki.',
    '',
    'WYBRANY ZAKRES:',
    '',
    scopeText(summary),
    '',
    'Z pozdrowieniami,',
    'PiXEL EXPERTS TEAM',
  ].join('\n')
}

const C = {
  navy: '#13233a',
  ink: '#22252a',
  muted: '#585c63',
  gold: '#7a5f2e',
  line: '#e4dccd',
  ivory: '#faf7f1',
}

function scopeHtml(summary: OfferSummary): string {
  const row = (label: string, sub: string, price: string) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${C.line};">
        <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${C.gold};">${escapeHtml(sub)}</div>
        <div style="font-size:15px;color:${C.ink};font-weight:600;">${escapeHtml(label)}</div>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid ${C.line};text-align:right;white-space:nowrap;font-size:15px;color:${C.ink};">${escapeHtml(price)}</td>
    </tr>`

  let html = ''
  if (summary.oneTimeItems.length) {
    html += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${summary.oneTimeItems
      .map((s) => row(s.summaryTitle, stageLabel(s), `${formatPLN(s.priceNet)} netto`))
      .join('')}
      <tr>
        <td style="padding:16px 0 4px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${C.muted};">Suma usług jednorazowych</td>
        <td style="padding:16px 0 4px;text-align:right;font-size:20px;color:${C.navy};font-weight:700;white-space:nowrap;">${formatPLN(summary.oneTimeTotal)} netto</td>
      </tr>
    </table>`
  }
  if (summary.monthlyItems.length) {
    html += `<div style="margin-top:20px;padding:16px;border:1px solid ${C.line};border-radius:12px;background:${C.ivory};">
      <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${C.muted};">Usługa miesięczna</div>
      ${summary.monthlyItems
        .map(
          (s) => `<div style="margin-top:6px;font-size:15px;color:${C.ink};font-weight:600;">${escapeHtml(s.summaryTitle)}</div>
        <div style="font-size:20px;color:${C.navy};font-weight:700;">${formatPLN(s.priceNet)} netto / miesiąc</div>`,
        )
        .join('')}
    </div>`
  }
  html += `<p style="margin:16px 0 0;font-size:12px;color:${C.muted};">Podane ceny są cenami netto.</p>`
  return html
}

function layout(title: string, body: string): string {
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:24px 12px;background:${C.ivory};font-family:Arial,Helvetica,sans-serif;color:${C.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${C.line};border-radius:16px;">
      <tr><td style="padding:24px 28px;background:${C.navy};border-radius:16px 16px 0 0;">
        <div style="font-family:Georgia,serif;font-size:20px;letter-spacing:.08em;color:#faf7f1;">GAWIN &amp; WOJNOWSKA</div>
        <div style="font-size:10px;letter-spacing:.24em;color:#d6c193;margin-top:4px;">KSIĘGOWOŚĆ • FINANSE • ROZWÓJ</div>
      </td></tr>
      <tr><td style="padding:28px;">${body}</td></tr>
      <tr><td style="padding:16px 28px;border-top:1px solid ${C.line};font-size:12px;color:${C.muted};">Propozycja współpracy przygotowana przez PiXEL EXPERTS TEAM</td></tr>
    </table>
  </td></tr></table>
</body></html>`
}

function adminHtml(contact: Contact, summary: OfferSummary, ids: string[], sentAt: Date): string {
  const field = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:${C.muted};font-size:13px;vertical-align:top;white-space:nowrap;">${label}</td>
     <td style="padding:6px 0;font-size:14px;color:${C.ink};white-space:pre-wrap;">${escapeHtml(value || '—')}</td></tr>`
  return layout(
    ADMIN_SUBJECT,
    `<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-weight:normal;font-size:24px;color:${C.navy};">Nowa konfiguracja oferty</h1>
     <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${C.gold};margin-bottom:8px;">Dane klienta</div>
     <table role="presentation" cellpadding="0" cellspacing="0">
       ${field('Imię i nazwisko:', contact.name)}
       ${field('Firma:', contact.company)}
       ${field('Email:', contact.email)}
       ${field('Telefon:', contact.phone)}
       ${field('Wiadomość:', contact.message)}
     </table>
     <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${C.gold};margin:28px 0 4px;">Wybrany zakres</div>
     ${scopeHtml(summary)}
     <p style="margin:24px 0 0;font-size:12px;color:${C.muted};line-height:1.6;">
       Data przesłania: ${escapeHtml(timestamp(sentAt))} (${sentAt.toISOString()})<br>
       ID wybranych usług: <code>${escapeHtml(ids.join(', '))}</code>
     </p>`,
  )
}

function clientHtml(contact: Contact, summary: OfferSummary): string {
  return layout(
    CLIENT_SUBJECT,
    `<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:normal;font-size:24px;color:${C.navy};">Dziękujemy za przesłanie konfiguracji.</h1>
     <p style="margin:0 0 8px;font-size:15px;line-height:1.6;">Dzień dobry ${escapeHtml(contact.name)},</p>
     <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">Otrzymaliśmy wybrany przez Was zakres współpracy i skontaktujemy się, aby potwierdzić szczegóły oraz ustalić kolejne kroki.</p>
     <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${C.gold};margin-bottom:4px;">Wybrany zakres</div>
     ${scopeHtml(summary)}
     <p style="margin:28px 0 0;font-size:15px;line-height:1.6;">Z pozdrowieniami,<br><strong>PiXEL EXPERTS TEAM</strong></p>`,
  )
}

// ───────────────────────── wysyłka ─────────────────────────

interface EmailMessage {
  to: string
  subject: string
  text: string
  html: string
  replyTo?: string
}

async function sendEmail(apiKey: string, from: string, msg: EmailMessage): Promise<void> {
  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
      html: msg.html,
      ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    }),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`)
  }
}

export async function handleSendOffer(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'Metoda niedozwolona.' })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json(400, { ok: false, error: 'Nieprawidłowe dane formularza.' })
  }

  // Pole-pułapka na boty: ludzie go nie widzą, więc powinno być puste.
  if (body && typeof body === 'object' && str((body as Record<string, unknown>).website, 200)) {
    return json(200, { ok: true, confirmationSent: false })
  }

  let payload: ParsedPayload
  try {
    payload = parsePayload(body)
  } catch (err) {
    if (err instanceof ValidationError) return json(422, { ok: false, error: err.message })
    throw err
  }

  const { contact, selectedIds } = payload
  const summary = summarize(selectedIds)
  const sentAt = new Date()

  const admin: EmailMessage = {
    to: process.env.ADMIN_EMAIL ?? '',
    subject: ADMIN_SUBJECT,
    text: adminText(contact, summary, selectedIds, sentAt),
    html: adminHtml(contact, summary, selectedIds, sentAt),
    replyTo: contact.email,
  }
  const client: EmailMessage = {
    to: contact.email,
    subject: CLIENT_SUBJECT,
    text: clientText(contact, summary),
    html: clientHtml(contact, summary),
    replyTo: process.env.ADMIN_EMAIL,
  }

  if (process.env.EMAIL_DRY_RUN === 'true') {
    console.info(`\n[EMAIL_DRY_RUN] → ${admin.to || '(ADMIN_EMAIL)'}\n${admin.subject}\n\n${admin.text}\n`)
    console.info(`[EMAIL_DRY_RUN] → ${client.to}\n${client.subject}\n\n${client.text}\n`)
    return json(200, { ok: true, confirmationSent: true, dryRun: true })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM
  if (!apiKey || !from || !admin.to) {
    console.error('Brak konfiguracji: RESEND_API_KEY, EMAIL_FROM lub ADMIN_EMAIL.')
    return json(500, { ok: false, error: 'Wysyłka jest chwilowo niedostępna. Spróbujcie ponownie później.' })
  }

  try {
    await sendEmail(apiKey, from, admin)
  } catch (err) {
    console.error('Nie udało się wysłać emaila do administratora:', err)
    return json(502, { ok: false, error: 'Nie udało się wysłać konfiguracji. Spróbujcie ponownie za chwilę.' })
  }

  // Potwierdzenie dla klienta jest dodatkiem — jego błąd nie unieważnia zgłoszenia.
  let confirmationSent = true
  try {
    await sendEmail(apiKey, from, client)
  } catch (err) {
    confirmationSent = false
    console.error('Nie udało się wysłać potwierdzenia do klienta:', err)
  }

  return json(200, { ok: true, confirmationSent })
}
