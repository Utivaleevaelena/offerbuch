import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from './Icon'

/**
 * Natywny <dialog> — zapewnia pułapkę fokusu, obsługę Esc i semantykę modala.
 * Na telefonie wyświetlany jako wysuwana od dołu szuflada.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  children,
  variant = 'modal',
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
  variant?: 'modal' | 'drawer'
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }
    if (!open) document.documentElement.style.overflow = ''
  }, [open])

  useEffect(() => () => void (document.documentElement.style.overflow = ''), [])

  const shape =
    variant === 'drawer'
      ? 'mt-auto mb-0 max-h-[88dvh] w-full max-w-none rounded-t-[1.5rem]'
      : 'mt-auto mb-0 h-[100dvh] max-h-[100dvh] w-full max-w-none sm:m-auto sm:h-auto sm:max-h-[92dvh] sm:max-w-2xl sm:rounded-[1.5rem]'

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        // Kliknięcie w tło zamyka okno.
        if (e.target === ref.current) onClose()
      }}
      className={`animate-fade-up overflow-hidden bg-ivory p-0 text-graphite shadow-lift backdrop:bg-transparent ${shape}`}
    >
      <div className={`relative flex flex-col overflow-y-auto overscroll-contain ${variant === 'drawer' ? 'max-h-[88dvh]' : 'h-full sm:max-h-[92dvh]'}`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full border border-line bg-white text-navy-900 transition-colors hover:bg-ivory-deep"
          aria-label="Zamknij"
        >
          <Icon name="close" size={18} />
        </button>
        {children}
      </div>
    </dialog>
  )
}
