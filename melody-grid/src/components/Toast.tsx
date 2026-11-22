export function Toast({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      {message && (
        <div key={message} className="fade-up rounded-full border border-white/15 bg-[#1b1d2a]/95 px-5 py-2.5 text-sm font-medium shadow-[0_10px_40px_-8px_rgba(168,85,247,0.6)] backdrop-blur">
          {message}
        </div>
      )}
    </div>
  )
}
