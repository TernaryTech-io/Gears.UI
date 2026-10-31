// The color theme: light, dark or the system's. Tabler reads `data-bs-theme` on <html>; the choice
// is remembered in localStorage (the browser may refuse, so that's best effort).
import { computed, ref, watchEffect } from 'vue'

export type ColorMode = 'light' | 'dark' | 'system'

const storageKey = 'gears-color-mode'
const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

function stored(): ColorMode {
  try {
    const value = localStorage.getItem(storageKey)
    if (value === 'light' || value === 'dark' || value === 'system') return value
  } catch { /* storage blocked */ }
  return 'system'
}

const preference = ref<ColorMode>(stored())
const systemDark = ref(media?.matches ?? false)
media?.addEventListener('change', e => { systemDark.value = e.matches })

const resolved = computed<'light' | 'dark'>(() =>
  preference.value === 'system' ? (systemDark.value ? 'dark' : 'light') : preference.value)

let applied = false

export function useColorMode() {
  if (!applied && typeof document !== 'undefined') {
    applied = true
    watchEffect(() => {
      document.documentElement.setAttribute('data-bs-theme', resolved.value)
      try { localStorage.setItem(storageKey, preference.value) } catch { /* storage blocked */ }
    })
  }
  return {
    preference,
    resolved,
    isDark: computed(() => resolved.value === 'dark'),
    toggle: () => { preference.value = resolved.value === 'dark' ? 'light' : 'dark' }
  }
}
