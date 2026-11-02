<script setup lang="ts">
// A theme's corner radius, from 0 (square corners) to 2.5 (Tabler's extra large), as tiles showing
// a button-sized shape with each one's base radius.
import TRadioGroup from './TRadioGroup.vue'
import { themeRadii, themeRadiusSizes } from '../theme'
import type { ThemeRadius } from '../types'

defineProps<{ disabled?: boolean; legend?: string }>()

const model = defineModel<ThemeRadius | null | undefined>()
// Drawn at its real size, so the tile shows the corner a button or a field gets.
const radius = (value: ThemeRadius) => themeRadiusSizes[value]
</script>

<template>
  <TRadioGroup v-model="model" :items="themeRadii" variant="tiles" :disabled="disabled" :legend="legend">
    <template #preview="{ item }">
      <span class="t-theme-radius" :style="{ borderRadius: radius(item.value as ThemeRadius) }" />
    </template>
  </TRadioGroup>
</template>
