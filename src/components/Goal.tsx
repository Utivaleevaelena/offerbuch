import { useI18n } from '../i18n/I18nContext'
import { stageNumber } from '../lib/offer'
import { Icon } from './Icon'
import { ProcessFlow } from './ui'

export function Goal() {
  const { proposal, t } = useI18n()
  const { goal, roadmap, stages: STAGES } = proposal
  const [first, ...rest] = goal.paragraphs
  return (
    <>
      <section id="cel" aria-labelledby="cel-title" className="bg-navy-900 text-ivory">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="eyebrow !text-gold-light">{goal.eyebrow}</p>
              <h2 id="cel-title" className="mt-5 text-[2.2rem] !text-ivory sm:text-5xl">
                {goal.title}
              </h2>
            </div>
            <div className="space-y-5 text-[1.05rem] text-ivory/80 sm:text-lg">
              {first && <p>{first}</p>}
              {goal.quote && (
                <p className="border-l-2 border-gold pl-5 font-serif text-2xl leading-snug text-ivory sm:text-[1.7rem]">
                  {goal.quote}
                </p>
              )}
              {rest.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {goal.process.length > 0 && (
            <div className="mt-16 border-t border-white/10 pt-10">
              <ProcessFlow tone="dark" label={goal.eyebrow} steps={goal.process} />
            </div>
          )}
        </div>
      </section>

      <section id="etapy" aria-labelledby="etapy-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">{roadmap.eyebrow}</p>
          <h2 id="etapy-title" className="mt-4 text-[2.2rem] sm:text-5xl">
            {roadmap.title}
          </h2>
          <p className="mt-4 text-[1.05rem] text-ink-muted">{roadmap.intro}</p>
        </div>
        <ol
          className={`mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 ${
            STAGES.length >= 5 ? 'lg:grid-cols-5' : STAGES.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
          }`}
        >
          {STAGES.map((s) => (
            <li key={s.id} className="bg-white">
              <a href={`#${s.anchor}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-ivory">
                <span className="font-serif text-4xl text-gold">{String(stageNumber(s.id)).padStart(2, '0')}</span>
                <span className="mt-4 font-serif text-[1.4rem] leading-tight text-navy-900">{s.label}</span>
                <span className="mt-2 flex-1 text-sm text-ink-muted">{s.roadmapLine}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 group-hover:text-gold-ink">
                  {t.seeStage}
                  <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
