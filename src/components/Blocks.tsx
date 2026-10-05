import type { Block } from '../content/types'
import { Icon } from './Icon'
import { ProcessFlow } from './ui'

/** Renderuje bloki treści etapu zdefiniowane w src/content/proposal.ts. */
export function Blocks({ blocks, inCard = false }: { blocks: Block[]; inCard?: boolean }) {
  return (
    <div className={inCard ? 'mt-8 space-y-6' : 'mb-14 space-y-10'}>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  )
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'highlight':
      return (
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold-soft/80 to-ivory p-6 sm:p-8">
          <p className="eyebrow flex items-center gap-2">
            {block.icon && <Icon name={block.icon} size={16} />}
            {block.eyebrow}
          </p>
          <blockquote className="mt-4 font-serif text-[1.65rem] leading-snug text-navy-900 sm:text-[2rem]">{block.quote}</blockquote>
          {block.text && <p className="mt-4 max-w-2xl text-graphite">{block.text}</p>}
          {block.flow && (
            <div className="mt-6">
              <ProcessFlow tone="soft" size="sm" label={block.flowLabel ?? block.eyebrow} steps={block.flow} />
            </div>
          )}
        </div>
      )

    case 'process':
      return (
        <div className="rounded-2xl bg-navy-900 p-6 sm:p-8">
          <p className="mb-5 text-xs font-semibold tracking-[0.22em] text-gold-light uppercase">{block.label}</p>
          <ProcessFlow tone="dark" size="sm" label={block.label} steps={block.steps} />
        </div>
      )

    case 'chips':
      return (
        <div className="grid gap-5 md:grid-cols-2">
          {block.groups.map((group) => (
            <div key={group.title} className="card p-6">
              <h3 className="flex items-center gap-2.5 font-sans text-base font-semibold text-navy-900">
                <Icon name={group.icon} size={20} className="text-gold" />
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-full border border-line bg-ivory px-3 py-1.5 text-sm text-graphite">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )

    case 'features':
      return (
        <div>
          {block.title && <h3 className="mb-6 text-[1.9rem]">{block.title}</h3>}
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {block.items.map((item) => (
              <li key={item.title} className="flex gap-4 rounded-xl border border-line bg-white p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft text-gold-ink">
                  <Icon name={item.icon} size={19} />
                </span>
                <span>
                  <span className="block font-semibold text-navy-900">{item.title}</span>
                  <span className="block text-sm text-ink-muted">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'notes':
      return (
        <div className="grid gap-3 not-first:-mt-5 md:grid-cols-2">
          {block.items.map((note, i) => (
            <p key={i} className="flex gap-3 rounded-xl bg-white/70 p-4 text-sm text-ink-muted ring-1 ring-line">
              <Icon name={note.icon} size={18} className="mt-0.5 shrink-0 text-gold" />
              <span>
                {note.title && <strong className="font-semibold text-navy-900">{note.title} </strong>}
                {note.text}
              </span>
            </p>
          ))}
        </div>
      )

    case 'media':
      return (
        <ul className="grid grid-cols-3 gap-3 text-center" aria-label={block.label}>
          {block.items.map((m) => (
            <li key={m.label} className="rounded-xl border border-line bg-ivory/70 px-2 py-4">
              <Icon name={m.icon} size={22} className="mx-auto text-gold" />
              <span className="mt-2 block text-[0.8rem] leading-tight font-semibold text-navy-900">{m.label}</span>
            </li>
          ))}
        </ul>
      )

    case 'note':
      return (
        <p className="flex gap-3 rounded-xl bg-ivory p-4 text-sm text-ink-muted">
          <Icon name={block.icon ?? 'info'} size={18} className="mt-0.5 shrink-0 text-gold" />
          <span>
            {block.lines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </span>
        </p>
      )

    case 'compare':
      return (
        <aside className="relative overflow-hidden rounded-[1.75rem] border border-gold/40 bg-gradient-to-br from-gold-soft via-ivory to-white p-7 sm:p-10">
          <p className="eyebrow">{block.eyebrow}</p>
          <h3 className="mt-3 text-[2rem] sm:text-[2.4rem]">{block.title}</h3>
          {block.badge && (
            <p className="mt-5 inline-block rounded-xl bg-navy-900 px-5 py-3 text-sm font-semibold tracking-[0.12em] text-ivory uppercase sm:text-base">
              {block.badge}
            </p>
          )}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white/80 p-5">
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-ink-muted uppercase">
                <Icon name="close" size={16} className="text-[#a0524a]" />
                {block.dont.label}
              </p>
              <p className="mt-3 font-serif text-xl text-ink-muted line-through decoration-[#a0524a]/50">{block.dont.text}</p>
            </div>
            <div className="rounded-2xl border border-gold/40 bg-white p-5 shadow-soft">
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-gold-ink uppercase">
                <Icon name="check" size={16} />
                {block.do.label}
              </p>
              <p className="mt-3 font-serif text-xl leading-snug text-navy-900">{block.do.text}</p>
            </div>
          </div>
          {block.conclusion && (
            <p className="mt-6 border-l-2 border-gold pl-5 text-graphite">
              {block.conclusion.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </p>
          )}
        </aside>
      )
  }
}
