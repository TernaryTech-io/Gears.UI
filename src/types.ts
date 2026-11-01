// Shared prop types. Colors and sizes use the same names as Nuxt UI, so code moving from it keeps
// its props; `toTabler` maps a color to the name Tabler's classes use.

export type Color = 'primary' | 'neutral' | 'success' | 'warning' | 'error' | 'info'
export type Size = 'xs' | 'sm' | 'md' | 'lg'

const tablerColors: Record<Color, string> = {
  primary: 'primary',
  neutral: 'secondary',
  success: 'success',
  warning: 'warning',
  error: 'danger',
  info: 'info'
}

export function toTabler(color: Color): string {
  return tablerColors[color]
}

// A route location for RouterLink, or a plain URL.
export type Target = string | Record<string, unknown>

export interface DropdownItem {
  label?: string
  description?: string
  icon?: string
  trailingIcon?: string
  // `label` items are headings; they can't be chosen.
  type?: 'item' | 'label'
  color?: Color
  to?: Target
  href?: string
  disabled?: boolean
  onSelect?: (event: Event) => void
}

export interface NavItem {
  label: string
  icon?: string
  to?: Target
  // Active only on this exact route, not on routes under it.
  exact?: boolean
  badge?: string | { label: string; color?: Color }
  children?: NavItem[]
  defaultOpen?: boolean
}

export interface SelectItem<T = unknown> {
  label: string
  value: T
  description?: string
  disabled?: boolean
  // Items with the same group are listed together under it.
  group?: string
}

// An item of TAdvancedSelect: an icon or avatar initials can show beside the label.
export interface AdvancedSelectItem<T = unknown> extends SelectItem<T> {
  icon?: string
  avatar?: string
}

export interface TabItem {
  label: string
  value: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

export interface TableColumn<Row = Record<string, unknown>> {
  key: string
  label?: string
  align?: 'start' | 'center' | 'end'
  width?: string
  sortable?: boolean
  // TAdvancedTable: whether the column has a filter (on unless false; columns without a label have none).
  filterable?: boolean
  // Shown when the cell has no slot; defaults to `row[key]`.
  value?: (row: Row) => unknown
}

export interface TableSort {
  key: string
  direction: 'asc' | 'desc'
}

// How a TAdvancedTable column filter compares a cell with its value.
export type TableFilterOperator = 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'atLeast' | 'atMost'

export interface TableFilter {
  operator: TableFilterOperator
  value: string
}

export interface StepItem {
  title: string
  description?: string
}

export interface LogLine {
  id?: string | number
  time?: string
  text: string
  level?: 'error' | 'warning' | 'highlight' | 'muted'
}

// A suggestion a TCodeEditor offers while typing.
export interface CodeCompletion {
  label: string
  kind?: 'keyword' | 'table' | 'field' | 'function' | 'value' | 'snippet'
  // What's inserted; the label when omitted.
  insertText?: string
  detail?: string
}

export interface PanelListItem<T = string> {
  value: T
  label: string
  icon?: string
  // Small text at the item's end, such as a count or a tag.
  trailing?: string
  title?: string
  // Shown in red: something in it needs fixing.
  invalid?: boolean
}

// An item of TCommandPalette: a page to go to (`to`) or an action (`onSelect`).
export interface CommandItem {
  label: string
  icon?: string
  // Shown after the label, smaller; searched too (a project's namespace, a page's section).
  suffix?: string
  // More words that find the item without being shown.
  keywords?: string[]
  to?: Target
  onSelect?: () => void
}

export interface CommandGroup {
  id: string
  label?: string
  items: CommandItem[]
}

// An application's theme, as Tabler's theme settings (the data-bs-theme-* attributes) take it.
export type ThemeFont = 'sans-serif' | 'serif' | 'monospace' | 'comic'
export type ThemeBase = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'mist'
export type ThemeRadius = '0' | '0.5' | '1' | '1.5' | '2'
// Tabler's named colors, or a custom color as #rrggbb.
export type ThemeAccent = 'blue' | 'azure' | 'indigo' | 'purple' | 'pink' | 'red' | 'orange' | 'yellow' | 'lime' | 'green' | 'teal' | 'cyan' | (string & {})

// An application's layout: where its navigation goes and how it behaves, how much room things
// get, and whether the page sits in a box.
export type ThemeNav = 'left' | 'top'
export type ThemeDensity = 'compact' | 'comfortable' | 'spacious'
export type ThemeContainer = 'boxed' | 'fluid'

export interface ThemeSettings {
  accent?: ThemeAccent
  font?: ThemeFont
  base?: ThemeBase
  radius?: ThemeRadius
  // Light or dark; unset follows the surrounding page.
  mode?: 'light' | 'dark'
  // Padding and gaps (TThemeScope applies it).
  density?: ThemeDensity
  // The rest is layout (TAppLayout applies it).
  nav?: ThemeNav
  // Left navigation: whether it folds to icons.
  navFoldable?: boolean
  // Top navigation: whether it stays at the top while the page scrolls, and whether it floats
  // apart from the page's edges.
  navSticky?: boolean
  navFloating?: boolean
  container?: ThemeContainer
}
