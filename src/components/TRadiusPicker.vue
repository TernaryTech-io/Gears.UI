<script setup lang="ts">
// A theme's corner radius, Tabler's scale from 0 (square corners) to 2 (round), as tiles showing a
// shape drawn with each.
import TRadioGroup from './TRadioGroup.vue'
import { themeRadii } from '../theme'
import type { ThemeRadius } from '../types'

defineProps<{ disabled?: boolean; legend?: string }>()

const model = defineModel<ThemeRadius | null | undefined>()
// At 2 the shape is a circle.
const radius = (scale: ThemeRadius) => `calc(1.125rem * ${scale} / 2)`
</script>

<template>
  <TRadioGroup v-model="model" :items="themeRadii" variant="tiles" :disabled="disabled" :legend="legend">
    <template #preview="{ item }">
      <span class="t-theme-radius" :style="{ borderRadius: radius(item.value as ThemeRadius) }" />
    </template>
  </TRadioGroup>
</template>
