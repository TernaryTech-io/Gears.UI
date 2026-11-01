// The choices Tabler's theme settings offer (tabler-themes.css), with their labels, in the order its
// own theme settings list them.
import type { SelectItem, ThemeBase, ThemeFont, ThemeRadius } from './types'

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

/** Whether an accent is a custom color (#rrggbb) rather than one of Tabler's named colors. */
export const isCustomAccent = (accent: string | undefined) => !!accent && accent.startsWith('#')
