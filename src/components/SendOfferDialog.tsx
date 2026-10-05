import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useI18n } from '../i18n/I18nContext'
import type { UiStrings } from '../i18n/ui'
import { summarize, type OfferSummary } from '../lib/summary'
import { useOffer } from '../state/OfferContext'
import { Dialog } from './Dialog'
import { Icon } from './Icon'
import { SummaryLines, Totals } from './OfferSummary'

interface FormState {
  name: string
  company: string
  email: string
  phone: string
  message: string
  consent: boolean
  website: string // pole-pułapka (honeypot)
}

type Errors = Partial<Record<'name' | 'email' | 'consent', string>>

const EMPTY: FormState = { name: '', company: '', email: '', phone: '', message: '', consent: false, website: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(form: FormState, t: UiStrings): Errors {
  const errors: Errors = {}
  if (!form.name.trim()) errors.name = t.errName
  if (!form.email.trim()) errors.email = t.errEmailEmpty
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = t.errEmail
  if (!form.consent) errors.consent = t.errConsent
  return errors
}

export function SendOfferDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { selected, summary } = useOffer()
  const { lang, proposal, t } = useI18n()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [serverError, setServerError] = useState('')
  const [sent, setSent] = useState<OfferSummary | null>(null)
  const titleId = useId()
  const formRef = useRef<HTMLFormElement>(null)

  // Po zamknięciu okna sukcesu wracamy do formularza przy kolejnym otwarciu.
  useEffect(() => {
    if (!open && sent) {
      setSent(null)
      setForm(EMPTY)
    }
  }, [open, sent])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validate(form, t)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus('sending')
    setServerError('')
    try {
      const res = await fetch('/api/send-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: {
            name: form.name,
            company: form.company,
            email: form.email,
            phone: form.phone,
            message: form.message,
          },
          consent: form.consent,
          selectedIds: selected,
          lang,
          website: form.website,
        }),
      })
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || t.errSend)
      }
      setSent(summarize(selected, proposal))
      setStatus('idle')
    } catch (err) {
      // Wybór usług pozostaje nienaruszony — można spróbować ponownie.
      setStatus('error')
      setServerError(
        err instanceof TypeError
          ? t.errNetwork
          : (err as Error).message,
      )
    }
  }

  return (
    <Dialog open={open} onClose={onClose} labelledBy={titleId}>
      {sent ? (
        <SuccessView titleId={titleId} summary={sent} onBack={onClose} />
      ) : (
        <div className="p-6 pt-16 sm:p-10">
          <p className="eyebrow">{t.lastStep}</p>
          <h2 id={titleId} className="mt-3 pr-8 text-[2rem] sm:text-[2.3rem]">
            {t.formTitle}
          </h2>

          <details className="group mt-6 rounded-2xl border border-line bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-navy-900 [&::-webkit-details-marker]:hidden">
              <span>
                {t.scopeCount(summary.items.length)}
              </span>
              <Icon name="chevronDown" size={16} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="border-t border-line px-4 pb-4">
              <SummaryLines summary={summary} />
              <div className="border-t border-line pt-4">
                <Totals summary={summary} />
              </div>
            </div>
          </details>

          <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t.fieldName} required error={errors.name}>
                {(props) => (
                  <input
                    {...props}
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                  />
                )}
              </Field>
              <Field label={t.fieldCompany}>
                {(props) => (
                  <input
                    {...props}
                    name="company"
                    autoComplete="organization"
                    value={form.company}
                    onChange={(e) => set('company', e.target.value)}
                  />
                )}
              </Field>
              <Field label={t.fieldEmail} required error={errors.email}>
                {(props) => (
                  <input
                    {...props}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                )}
              </Field>
              <Field label={t.fieldPhone}>
                {(props) => (
                  <input
                    {...props}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                )}
              </Field>
            </div>
            <Field label={t.fieldMessage}>
              {(props) => (
                <textarea
                  {...props}
                  name="message"
                  rows={4}
                  placeholder={t.messagePlaceholder}
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                />
              )}
            </Field>

            {/* Honeypot — niewidoczne dla ludzi */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Strona www
                <input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
              </label>
            </div>

            <div>
              <label className="flex cursor-pointer gap-3 text-[0.95rem] text-graphite">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={(e) => set('consent', e.target.checked)}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? 'consent-error' : undefined}
                  className="mt-1 size-5 shrink-0 cursor-pointer accent-navy-900"
                />
                <span>
                  {t.consent}{' '}
                  <span className="text-gold-ink" aria-hidden="true">
                    *
                  </span>
                </span>
              </label>
              {errors.consent && (
                <p id="consent-error" className="mt-2 pl-8 text-sm text-[#a0524a]">
                  {errors.consent}
                </p>
              )}
            </div>

            {status === 'error' && (
              <div role="alert" className="flex gap-3 rounded-xl border border-[#e3c4bf] bg-[#fbf1ef] p-4 text-sm text-[#7d3a32]">
                <Icon name="info" size={18} className="mt-0.5 shrink-0" />
                <span>
                  {serverError} {t.scopeKept}
                </span>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-ink-muted">{t.requiredFields}</p>
              <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === 'sending' || summary.items.length === 0}>
                {status === 'sending' ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" aria-hidden="true" />
                    {t.sending}
                  </>
                ) : (
                  <>
                    <Icon name="send" size={18} />
                    {t.sendOffer}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </Dialog>
  )
}

interface FieldRenderProps {
  id: string
  className: string
  required?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  children: (props: FieldRenderProps) => React.ReactNode
}) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-900">
        {label}
        {required && (
          <span className="text-gold-ink" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children({
        id,
        className: `field ${error ? '!border-[#c4877e]' : ''}`,
        required,
        'aria-invalid': !!error || undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-[#a0524a]">
          {error}
        </p>
      )}
    </div>
  )
}

function SuccessView({ titleId, summary, onBack }: { titleId: string; summary: OfferSummary; onBack: () => void }) {
  const { t } = useI18n()
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => headingRef.current?.focus(), [])
  return (
    <div className="animate-fade-up p-6 pt-16 sm:p-10">
      <span className="grid size-14 place-items-center rounded-full bg-gold-soft text-gold-ink">
        <Icon name="check" size={28} />
      </span>
      <h2 id={titleId} ref={headingRef} tabIndex={-1} className="mt-6 text-[2.4rem] outline-none">
        {t.thanks}
      </h2>
      <p className="mt-3 text-lg text-navy-900">{t.received}</p>
      <p className="mt-2 text-ink-muted">{t.willContact}</p>

      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        <p className="text-xs font-bold tracking-[0.18em] text-ink-muted uppercase">{t.sentScope}</p>
        <SummaryLines summary={summary} />
        <div className="border-t border-line pt-4">
          <Totals summary={summary} />
        </div>
      </div>

      <button type="button" onClick={onBack} className="btn-primary mt-8 w-full sm:w-auto">
        {t.backToOffer}
      </button>
    </div>
  )
}
