<script setup lang="ts">
// A theme's font, as tiles showing "Aa" in each typeface. `fonts` limits the choices; Comic is left
// out unless asked for.
import { computed } from 'vue'
import TRadioGroup from './TRadioGroup.vue'
import { themeFonts } from '../theme'
import type { ThemeFont } from '../types'

const props = withDefaults(defineProps<{ fonts?: ThemeFont[]; disabled?: boolean; legend?: string }>(),
  { fonts: () => ['sans-serif', 'serif', 'monospace'] })

const model = defineModel<ThemeFont | null | undefined>()
const items = computed(() => themeFonts.filter(f => props.fonts.includes(f.value)))
const family = (font: ThemeFont) => `var(--tblr-font-${font})`
</script>

<template>
  <TRadioGroup v-model="model" :items="items" variant="tiles" :disabled="disabled" :legend="legend">
    <template #preview="{ item }">
      <span class="t-theme-font" :style="{ fontFamily: family(item.value as ThemeFont) }">Aa</span>
    </template>
  </TRadioGroup>
</template>
