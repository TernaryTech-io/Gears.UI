<script setup lang="ts">
// Where an application's navigation goes: down the left side or across the top. Each tile is a
// sketch of the page.
import TRadioGroup from './TRadioGroup.vue'
import { themeNavs } from '../theme'
import type { ThemeNav } from '../types'

defineProps<{ disabled?: boolean; legend?: string }>()

const model = defineModel<ThemeNav | null | undefined>()
</script>

<template>
  <TRadioGroup v-model="model" :items="themeNavs" variant="tiles" tile-width="8rem" :disabled="disabled" :legend="legend">
    <template #preview="{ item }">
      <span :class="['t-sketch', item.value === 'top' ? 't-sketch-top' : 't-sketch-left']">
        <span class="t-sketch-nav" />
        <span class="t-sketch-page"><span /><span /><span /></span>
      </span>
    </template>
  </TRadioGroup>
</template>
