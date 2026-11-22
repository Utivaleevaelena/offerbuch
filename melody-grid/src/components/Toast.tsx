export function Toast({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      {message && (
        <div key={message} className="fade-up rounded-full border border-[#f6d3e0] bg-white/95 text-[#6b2f4a] px-5 py-2.5 text-sm font-medium shadow-[0_10px_30px_-8px_rgba(224,112,154,0.6)] backdrop-blur">
          {message}
        </div>
      )}
    </div>
  )
}
