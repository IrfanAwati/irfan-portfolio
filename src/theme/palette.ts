import { createContext, useContext } from 'react'

/**
 * Colours for canvas + inline SVG (which can't read CSS custom properties in
 * presentation attributes). Keep in sync with the tokens in index.css.
 */
export type Theme = 'dark' | 'light'

export type Palette = {
  bg: string
  bg2: string
  bg3: string
  ink: string
  ink2: string
  ink3: string
  line: string
  line2: string
  signal: string
  amber: string
  blue: string
  /** rgb triplets for canvas alpha blending */
  rgb: { ink: number[]; signal: number[]; amber: number[] }
}

export const palettes: Record<Theme, Palette> = {
  dark: {
    bg: '#07080a',
    bg2: '#0c0e11',
    bg3: '#12151a',
    ink: '#ece8e1',
    ink2: '#aeaaa2',
    ink3: '#8a877f',
    line: 'rgba(236,232,225,.09)',
    line2: 'rgba(236,232,225,.16)',
    signal: '#5cf2a8',
    amber: '#ffb547',
    blue: '#9fb7ff',
    rgb: { ink: [236, 232, 225], signal: [92, 242, 168], amber: [255, 181, 71] },
  },
  light: {
    bg: '#f5f3ef',
    bg2: '#ece9e3',
    bg3: '#ffffff',
    ink: '#121417',
    ink2: '#474a4f',
    ink3: '#6a6c70',
    line: 'rgba(18,20,23,.1)',
    line2: 'rgba(18,20,23,.2)',
    signal: '#087a4b',
    amber: '#a85d06',
    blue: '#3d5bd9',
    rgb: { ink: [18, 20, 23], signal: [8, 150, 92], amber: [200, 115, 10] },
  },
}

export const ThemeContext = createContext<{ theme: Theme; palette: Palette; toggle: () => void }>({
  theme: 'dark',
  palette: palettes.dark,
  toggle: () => {},
})

export const useTheme = () => useContext(ThemeContext)
