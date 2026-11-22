import { gridFromSteps } from './grid'
import type { Grid, PresetId } from './types'

export interface Demo {
  id: string
  name: string
  bpm: number
  preset: PresetId
  grid: () => Grid
}

export const DEMOS: Demo[] = [
  {
    id: 'neon-arp',
    name: 'Neon Arp',
    bpm: 124,
    preset: 'synth',
    grid: () =>
      gridFromSteps([
        'C4 G4', 'E4', 'G4', 'E4',
        'E4 C5', 'A4', 'C5', 'A4',
        'F4 C5', 'A4', 'C5', 'A4',
        'D4 B4', 'G4', 'B4', 'G4',
      ]),
  },
  {
    id: 'twinkle',
    name: 'Twinkle Star',
    bpm: 104,
    preset: 'piano',
    grid: () =>
      gridFromSteps([
        'C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', '',
        'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4', '',
      ]),
  },
  {
    id: 'bell-garden',
    name: 'Bell Garden',
    bpm: 88,
    preset: 'bell',
    grid: () =>
      gridFromSteps([
        'C5', '', 'G4', '', 'E4', '', 'G4', 'A4',
        'D4', '', 'A4', '', 'F4', '', 'E4 C5', '',
      ]),
  },
  {
    id: 'quest',
    name: '8-Bit Quest',
    bpm: 150,
    preset: 'retro',
    grid: () =>
      gridFromSteps([
        'C4', 'E4', 'G4', 'C5', '', 'G4', 'E4', 'G4',
        'F4', 'A4', 'C5', 'A4', 'G4', '', 'E4 D4', 'C4',
      ]),
  },
  {
    id: 'chord-pulse',
    name: 'Chord Pulse',
    bpm: 108,
    preset: 'piano',
    grid: () =>
      gridFromSteps([
        'C4 E4 G4', '', 'G4', '', 'F4 A4 C5', '', 'A4', '',
        'E4 G4 B4', '', 'G4', '', 'D4 F4 A4', 'F4', 'A4', 'D4 G4 B4',
      ]),
  },
]
