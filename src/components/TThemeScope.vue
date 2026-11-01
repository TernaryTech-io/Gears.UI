<script setup lang="ts">
// Tabler's theme settings for part of a page: what's inside takes the theme's accent color, font,
// base grays, corner radius and light or dark mode, whatever the page around it uses. For previews
// of an application's theme. A custom accent (#rrggbb) is set as the primary color directly.
import { computed } from 'vue'
import { useColorMode } from '../composables/useColorMode'
import { isCustomAccent } from '../theme'
import type { ThemeSettings } from '../types'

const props = defineProps<{ theme: ThemeSettings }>()
const { resolved } = useColorMode()

const custom = computed(() => isCustomAccent(props.theme.accent))
</script>

<template>
  <div class="t-theme-scope" :data-bs-theme="theme.mode ?? resolved" :data-bs-theme-base="theme.base"
    :data-bs-theme-font="theme.font" :data-bs-theme-radius="theme.radius"
    :data-bs-theme-primary="custom ? undefined : theme.accent" :style="custom ? { '--tblr-primary': theme.accent } : undefined">
    <slot />
  </div>
</template>
