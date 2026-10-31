<script setup lang="ts">
// Opens the TCommandPalette: a field-like button with the shortcut at its end, or with `collapsed`,
// a square icon button (for narrow top bars).
import TButton from './TButton.vue'
import TIcon from './TIcon.vue'
import { isMac, useCommandPalette } from '../composables/useCommandPalette'

withDefaults(defineProps<{ label?: string; collapsed?: boolean }>(), { label: 'Search…' })

const { open } = useCommandPalette()
</script>

<template>
  <TButton v-if="collapsed" icon="search" color="neutral" variant="ghost" :aria-label="label" @click="open = true" />
  <button v-else type="button" class="t-search-button" aria-haspopup="dialog" @click="open = true">
    <TIcon name="search" class="text-secondary" />
    <span class="text-secondary text-truncate">{{ label }}</span>
    <kbd class="ms-auto">{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
  </button>
</template>
