<script setup lang="ts">
// A theme's accent color: Tabler's named colors as swatches (its color input). With `custom`, a
// last swatch picks any color (#rrggbb) with the browser's color picker; it shows the custom color
// while one is chosen. The `custom` slot goes after the swatches, for another picker.
import { computed, useId } from 'vue'
import TIcon from './TIcon.vue'
import { isCustomAccent, themeAccents } from '../theme'
import type { ThemeAccent } from '../types'

defineProps<{ custom?: boolean; disabled?: boolean; legend?: string }>()

const model = defineModel<ThemeAccent | null | undefined>()
const name = useId()
const customColor = computed(() => isCustomAccent(model.value ?? undefined) ? model.value! : null)
const label = (color: string) => color[0].toUpperCase() + color.slice(1)
</script>

<template>
  <div role="radiogroup" :aria-label="legend ?? 'Accent color'">
    <div v-if="legend" class="form-label">{{ legend }}</div>
    <div class="t-accent-swatches align-items-center">
      <label v-for="color in themeAccents" :key="color" class="form-colorinput" :title="label(color)">
        <input type="radio" :name="name" :value="color" class="form-colorinput-input" :checked="model === color" :disabled="disabled"
          :aria-label="label(color)" @change="model = color">
        <span :class="['form-colorinput-color', `bg-${color}`]" />
      </label>
      <label v-if="custom" :class="['form-colorinput t-accent-custom', { active: customColor }]" :title="customColor ? `Custom: ${customColor}` : 'Custom color'">
        <input type="color" class="t-accent-custom-input" :value="customColor ?? '#3673d1'" :disabled="disabled" aria-label="Custom color"
          @input="model = ($event.target as HTMLInputElement).value">
        <span class="form-colorinput-color d-flex align-items-center justify-content-center" :style="customColor ? { background: customColor } : undefined">
          <TIcon :name="customColor ? 'check' : 'color-picker'" :class="customColor ? 'text-white' : 'text-secondary'" />
        </span>
      </label>
      <label v-else-if="customColor" class="form-colorinput" :title="customColor">
        <input type="radio" :name="name" class="form-colorinput-input" checked :disabled="disabled" :aria-label="`Custom: ${customColor}`">
        <span class="form-colorinput-color" :style="{ background: customColor }" />
      </label>
      <slot name="custom" />
    </div>
  </div>
</template>
