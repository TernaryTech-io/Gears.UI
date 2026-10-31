<script setup lang="ts">
// Switches between the light and dark themes.
import TButton from './TButton.vue'
import TTooltip from './TTooltip.vue'
import { useColorMode } from '../composables/useColorMode'

const { isDark, toggle } = useColorMode()
</script>

<template>
  <TTooltip :text="isDark ? 'Light theme' : 'Dark theme'">
    <TButton :icon="isDark ? 'sun' : 'moon'" color="neutral" variant="ghost" :aria-label="isDark ? 'Use the light theme' : 'Use the dark theme'" @click="toggle" />
  </TTooltip>
</template>
