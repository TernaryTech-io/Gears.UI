<script setup lang="ts">
// How much room an application's content gets: padding inside cards, tables, buttons and fields,
// and the gaps between them. Each tile shows rows at that spacing.
import TRadioGroup from './TRadioGroup.vue'
import { themeDensities } from '../theme'
import type { ThemeDensity } from '../types'

defineProps<{ disabled?: boolean; legend?: string }>()

const model = defineModel<ThemeDensity | null | undefined>()
</script>

<template>
  <TRadioGroup v-model="model" :items="themeDensities" variant="tiles" tile-width="8rem" :disabled="disabled" :legend="legend">
    <template #preview="{ item }">
      <span :class="['t-sketch-rows', `t-sketch-${item.value}`]"><span /><span /><span /><span /></span>
    </template>
  </TRadioGroup>
</template>
