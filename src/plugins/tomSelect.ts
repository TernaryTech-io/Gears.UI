// Loads Tom Select, the first time a TAdvancedSelect is shown.
import { once } from './once'

export const loadTomSelect = once(async () => (await import('tom-select')).default)
