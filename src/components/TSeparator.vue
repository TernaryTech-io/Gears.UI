<script setup lang="ts">
// A line between things: across (with an optional label at the start, center or end), or upright
// inside a row. Its color is the border color unless given (a named color such as 'primary', one
// of Tabler's, or any CSS color), with a style (solid, dashed, dotted) and a thickness in pixels.
// `spacing` 'none' drops the space above and below.
import { computed } from 'vue'
import { toTabler, type Color } from '../types'

const props = withDefaults(defineProps<{
  label?: string
  orientation?: 'horizontal' | 'vertical'
  position?: 'start' | 'center' | 'end'
  color?: Color | string
  variant?: 'solid' | 'dashed' | 'dotted'
  thickness?: number
  spacing?: 'normal' | 'none'
}>(), { orientation: 'horizontal', position: 'center', variant: 'solid', thickness: 1, spacing: 'normal' })

const named = new Set(['primary', 'neutral', 'success', 'warning', 'error', 'info'])
const tabler = new Set(['blue', 'azure', 'indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'lime', 'green', 'teal', 'cyan', 'secondary', 'muted'])
const line = computed(() => {
  const c = props.color
  const color = !c ? 'var(--tblr-border-color)' : named.has(c) ? `var(--tblr-${toTabler(c as Color)})` : tabler.has(c) ? `var(--tblr-${c})` : c
  return { '--t-separator-color': color, '--t-separator-style': props.variant, '--t-separator-width': `${Math.max(1, Math.min(props.thickness, 12))}px` }
})
</script>

<template>
  <div v-if="orientation === 'vertical'" class="t-separator t-separator-vertical" role="separator" aria-orientation="vertical" :style="line" />
  <div v-else-if="label" :class="['t-separator hr-text', { 'hr-text-start': position === 'start', 'hr-text-end': position === 'end', 't-separator-flush': spacing === 'none' }]"
    role="separator" :style="line"><span>{{ label }}</span></div>
  <hr v-else :class="['t-separator', spacing === 'none' ? 'my-0' : 'my-3']" :style="line">
</template>

<style scoped>
hr.t-separator { border: 0; border-top: var(--t-separator-width) var(--t-separator-style) var(--t-separator-color); opacity: 1; }
.t-separator.hr-text::before, .t-separator.hr-text::after {
  height: 0; background: none; border-top: var(--t-separator-width) var(--t-separator-style) var(--t-separator-color);
}
.t-separator-flush { margin: 0.5rem 0; }
.t-separator-vertical { align-self: stretch; width: 0; min-height: 1em; border-inline-start: var(--t-separator-width) var(--t-separator-style) var(--t-separator-color); }
</style>
