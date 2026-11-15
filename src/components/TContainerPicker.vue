<script setup lang="ts">
// How wide an application's page runs: default (the content capped and centered, the navigation at
// the edge), fluid (the full width) or boxed (the whole page in a centered box, the background
// around it). Each tile is a sketch of the page.
import TRadioGroup from './TRadioGroup.vue'
import { themeContainers } from '../theme'
import type { ThemeContainer } from '../types'

defineProps<{ disabled?: boolean; legend?: string }>()

const model = defineModel<ThemeContainer | null | undefined>()
</script>

<template>
  <TRadioGroup v-model="model" :items="themeContainers" variant="tiles" tile-width="8rem" :disabled="disabled" :legend="legend">
    <template #preview="{ item }">
      <span :class="['t-sketch t-sketch-left', { 't-sketch-boxed': item.value === 'boxed', 't-sketch-default': item.value === 'default' }]">
        <span class="t-sketch-nav" />
        <span class="t-sketch-page"><span /><span /><span /></span>
      </span>
    </template>
  </TRadioGroup>
</template>
