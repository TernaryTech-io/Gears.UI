<script setup lang="ts">
// Whether an application's page sits in a box, centered on wide screens with the background
// around it, or fills the width. Each tile is a sketch of the page.
import TRadioGroup from './TRadioGroup.vue'
import { themeContainers } from '../theme'
import type { ThemeContainer } from '../types'

defineProps<{ disabled?: boolean; legend?: string }>()

const model = defineModel<ThemeContainer | null | undefined>()
</script>

<template>
  <TRadioGroup v-model="model" :items="themeContainers" variant="tiles" tile-width="8rem" :disabled="disabled" :legend="legend">
    <template #preview="{ item }">
      <span :class="['t-sketch t-sketch-left', { 't-sketch-boxed': item.value === 'boxed' }]">
        <span class="t-sketch-nav" />
        <span class="t-sketch-page"><span /><span /><span /></span>
      </span>
    </template>
  </TRadioGroup>
</template>
