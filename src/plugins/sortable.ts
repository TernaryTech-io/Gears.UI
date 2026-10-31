// Loads SortableJS and Tabler's sortable, the first time a TSortable is shown.
import { globals, once } from './once'

export const loadSortable = once(async () => {
  globals.Sortable = (await import('sortablejs')).default
  return (await import('@tabler/core')).Sortable
})
