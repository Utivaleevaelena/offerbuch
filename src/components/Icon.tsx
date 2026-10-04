import type { SVGProps } from 'react'

/** Minimalistyczne ikony liniowe (stroke 1.5). */
const PATHS = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6L6 18',
  chevronDown: 'M6 9l6 6 6-6',
  chevronUp: 'M6 15l6-6 6 6',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  trash: 'M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5',
  menu: 'M4 7h16M4 12h16M4 17h16',
  send: 'M4 12l16-8-6 16-2.5-6.5L4 12zM11.5 13.5L20 4',
  database: 'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
  flame: 'M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.4 3.8-7.8.4 1.8 1.4 3 2.7 3.6 0-2.8 1-5.4 3.4-7.6.3 3.5 4.1 6 4.1 11.1 0 4-2.9 6.9-7.5 6.9z',
  shield: 'M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6L12 3zM8.5 12l2.5 2.5 4.5-5',
  pen: 'M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  rocket: 'M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2M9 15l-3-3c1.5-4 5-9 13-9 0 8-5 11.5-9 13l-3-3zM15 9.5a1 1 0 100-2 1 1 0 000 2z',
  inbox: 'M3 13h5l1.5 3h5L16 13h5M5.5 5h13L21 13v6H3v-6l2.5-8z',
  compass: 'M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5 5-2z',
  camera: 'M4 8h3.5L9 5.5h6L16.5 8H20v11H4V8zM12 16.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
  monitor: 'M3 5h18v11H3V5zM9 20h6M12 16v4',
  mail: 'M3 6h18v12H3V6zM3 7l9 6.5L21 7',
  palette: 'M12 3a9 9 0 000 18c1.4 0 2-1 1.5-2.2-.6-1.4.3-2.8 1.8-2.8H18a3 3 0 003-3c0-5.5-4-10-9-10zM7.5 11.5h.01M10 7.5h.01M15 7.5h.01',
  info: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v5M12 8h.01',
  target: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11a1 1 0 100 2 1 1 0 000-2z',
  users: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20c.6-3.5 3.2-5.5 6.5-5.5s5.9 2 6.5 5.5M16 4.5a3.5 3.5 0 010 6.5M18 14.8c2 .7 3.2 2.4 3.5 5.2',
  document: 'M6 3h8l4 4v14H6V3zM14 3v4h4M9 12h6M9 16h6',
} as const

export type IconName = keyof typeof PATHS

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
