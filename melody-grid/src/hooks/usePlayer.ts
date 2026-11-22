import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AudioEngine } from '../audio/AudioEngine'
import { Sequencer } from '../audio/Sequencer'
import type { PlaybackSettings } from '../lib/types'

export type Status = 'stopped' | 'playing' | 'paused'

export function usePlayer(engine: AudioEngine, settings: PlaybackSettings) {
  const [status, setStatus] = useState<Status>('stopped')
  const [step, setStep] = useState<number | null>(null)
  const settingsRef = useRef(settings)
  const statusRef = useRef<Status>('stopped')
  const resumeRef = useRef(0)

  useEffect(() => {
    settingsRef.current = settings
  })

  const setStatusBoth = useCallback((s: Status) => {
    statusRef.current = s
    setStatus(s)
  }, [])

  const sequencer = useMemo(
    () =>
      new Sequencer(engine, () => settingsRef.current, {
        onStep: setStep,
        onEnded: () => {
          statusRef.current = 'stopped'
          setStatus('stopped')
          setStep(null)
          resumeRef.current = 0
        },
      }),
    [engine],
  )

  useEffect(() => () => sequencer.dispose(), [sequencer])

  /** returns false if there is nothing to play */
  const play = useCallback((): boolean => {
    if (statusRef.current === 'playing') return true
    const s = settingsRef.current
    if (s.mode === 'free' && s.free.length === 0) return false
    const from = statusRef.current === 'paused' ? resumeRef.current : 0
    sequencer.start(from)
    setStatusBoth('playing')
    return true
  }, [sequencer, setStatusBoth])

  const pause = useCallback(() => {
    if (statusRef.current !== 'playing') return
    resumeRef.current = sequencer.pause()
    setStatusBoth('paused')
  }, [sequencer, setStatusBoth])

  const stop = useCallback(() => {
    sequencer.stop()
    resumeRef.current = 0
    setStatusBoth('stopped')
  }, [sequencer, setStatusBoth])

  const toggle = useCallback((): boolean => {
    if (statusRef.current === 'playing') {
      pause()
      return true
    }
    return play()
  }, [pause, play])

  return { status, step, play, pause, stop, toggle }
}
