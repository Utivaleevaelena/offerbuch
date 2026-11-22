export interface NoteInfo {
  name: string
  freq: number
  /** hue used for the neon colour of this row */
  hue: number
}

/** Index 0 = C4 … index 7 = C5 */
export const NOTES: readonly NoteInfo[] = [
  { name: 'C4', freq: 261.63, hue: 278 },
  { name: 'D4', freq: 293.66, hue: 264 },
  { name: 'E4', freq: 329.63, hue: 246 },
  { name: 'F4', freq: 349.23, hue: 222 },
  { name: 'G4', freq: 392.0, hue: 200 },
  { name: 'A4', freq: 440.0, hue: 184 },
  { name: 'B4', freq: 493.88, hue: 318 },
  { name: 'C5', freq: 523.25, hue: 336 },
]

export const noteIndex = (name: string): number => NOTES.findIndex((n) => n.name === name)
