<script setup lang="ts">
// A theme's base: the grays behind every surface, border and muted text. Each tile shows five of
// the base's shades, lightest to darkest.
import TRadioGroup from './TRadioGroup.vue'
import { themeBases } from '../theme'
import type { ThemeBase } from '../types'

defineProps<{ disabled?: boolean; legend?: string }>()

const model = defineModel<ThemeBase | null | undefined>()
const shades = [100, 300, 500, 700, 900]
</script>

<template>
  <TRadioGroup v-model="model" :items="themeBases" variant="tiles" :disabled="disabled" :legend="legend">
    <template #preview="{ item }">
      <span class="t-theme-swatches" :data-bs-theme-base="item.value">
        <span v-for="shade in shades" :key="shade" :style="{ background: `var(--tblr-gray-${shade})` }" />
      </span>
    </template>
  </TRadioGroup>
</template>
