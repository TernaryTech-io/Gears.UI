// The choices an application's theme offers, with their labels: Tabler's theme settings
// (tabler-themes.css) in the order its own theme settings list them, then layout.
import type { SelectItem, ThemeBase, ThemeContainer, ThemeDensity, ThemeFont, ThemeNav, ThemeRadius } from './types'

export const themeAccents = [
  'blue', 'azure', 'indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'lime', 'green', 'teal', 'cyan'
] as const

export const themeFonts: SelectItem<ThemeFont>[] = [
  { label: 'Sans-serif', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
  { label: 'Comic', value: 'comic' }
]

export const themeBases: SelectItem<ThemeBase>[] = [
  { label: 'Slate', value: 'slate' },
  { label: 'Gray', value: 'gray' },
  { label: 'Zinc', value: 'zinc' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Stone', value: 'stone' },
  { label: 'Mist', value: 'mist' }
]

export const themeRadii: SelectItem<ThemeRadius>[] = ['0', '0.5', '1', '1.5', '2'].map(r => ({ label: r, value: r as ThemeRadius }))

// Layout choices (not Tabler theme settings; TThemeScope and TAppLayout apply them).
export const themeNavs: SelectItem<ThemeNav>[] = [
  { label: 'Left', value: 'left' },
  { label: 'Top', value: 'top' }
]

export const themeDensities: SelectItem<ThemeDensity>[] = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' }
]

export const themeContainers: SelectItem<ThemeContainer>[] = [
  { label: 'Boxed', value: 'boxed' },
  { label: 'Fluid', value: 'fluid' }
]

/** Whether an accent is a custom color (#rrggbb) rather than one of Tabler's named colors. */
export const isCustomAccent = (accent: string | undefined) => !!accent && accent.startsWith('#')
