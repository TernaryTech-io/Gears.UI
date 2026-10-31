// The command palette's open state, shared: TSearchButton opens it, TCommandPalette shows it, and
// Ctrl+K (⌘K on a Mac) toggles it from anywhere.
import { ref } from 'vue'

const open = ref(false)

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

export function useCommandPalette() {
  return { open, toggle: () => { open.value = !open.value } }
}
