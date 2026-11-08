<script setup lang="ts">
// A rating, from 1 to `max`, as a row of stars (or hearts, or circles): click one to choose it,
// click the chosen one again to clear it (with `clearable`). Pointing previews; the arrow keys,
// Home and End change it, as a radio group. Drawn with SVG, so nothing is loaded. v-model is the
// rating, or null for none.
import { computed, ref } from 'vue'
import { useField } from '../composables/useField'

const props = withDefaults(defineProps<{
  max?: number
  shape?: 'star' | 'heart' | 'circle'
  // A Tabler color name (yellow, red, primary, …) or a CSS color.
  color?: string
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  disabled?: boolean
  clearable?: boolean
  // The group's accessible name.
  label?: string
  id?: string
}>(), { max: 5, shape: 'star', color: 'yellow', size: 'md', clearable: true, label: 'Rating' })

const model = defineModel<number | null | undefined>()
const field = useField(props)
const hover = ref<number | null>(null)
const shown = computed(() => hover.value ?? model.value ?? 0)
const items = computed(() => Array.from({ length: Math.max(1, Math.min(20, Math.round(props.max))) }, (_, i) => i + 1))
const locked = computed(() => props.readonly || props.disabled)
const fill = computed(() => (/^[a-z]+$/.test(props.color) ? `var(--tblr-${props.color})` : props.color))

const paths: Record<string, string> = {
  star: 'M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z',
  heart: 'M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572',
  circle: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0'
}

function choose(value: number) {
  if (locked.value) return
  model.value = props.clearable && model.value === value ? null : value
}
function key(event: KeyboardEvent) {
  if (locked.value) return
  const current = model.value ?? 0
  const next = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? current + 1
    : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? current - 1
      : event.key === 'Home' ? 1 : event.key === 'End' ? items.value.length : null
  if (next === null) return
  event.preventDefault()
  model.value = Math.max(props.clearable ? 0 : 1, Math.min(items.value.length, next)) || null
  ;(event.currentTarget as HTMLElement).querySelector<HTMLElement>(`[data-value="${model.value ?? 1}"]`)?.focus()
}
</script>

<template>
  <div :id="field.id.value" :class="['t-rating', `t-rating-${size}`, { 't-rating-locked': locked }]" role="radiogroup" :aria-label="label"
    :aria-readonly="readonly || undefined" :aria-disabled="disabled || undefined" :aria-describedby="field.describedBy.value"
    :style="{ '--t-rating-color': fill }" @keydown="key" @pointerleave="hover = null">
    <button v-for="value in items" :key="value" type="button" role="radio" class="t-rating-item" :data-value="value"
      :aria-checked="model === value" :aria-label="`${value} of ${items.length}`" :tabindex="(model ?? 1) === value ? 0 : -1" :disabled="disabled"
      @click="choose(value)" @pointerenter="!locked && (hover = value)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path :d="paths[shape] ?? paths.star" :class="{ on: value <= shown }" /></svg>
    </button>
  </div>
</template>

<style scoped>
.t-rating { display: inline-flex; gap: 0.125rem; }
.t-rating-item { display: grid; place-items: center; padding: 0; border: 0; background: none; line-height: 0; cursor: pointer; border-radius: var(--tblr-border-radius-sm); }
.t-rating-locked .t-rating-item { cursor: default; }
.t-rating-item:disabled { opacity: 0.6; }
.t-rating-item:focus-visible { outline: 2px solid var(--tblr-primary); outline-offset: 1px; }
.t-rating svg { width: 1.5rem; height: 1.5rem; }
.t-rating-sm svg { width: 1.125rem; height: 1.125rem; }
.t-rating-lg svg { width: 2rem; height: 2rem; }
.t-rating path { fill: none; stroke: var(--tblr-border-color-dark, var(--tblr-secondary)); stroke-width: 1.5; stroke-linejoin: round; transition: fill 0.1s, stroke 0.1s; }
.t-rating path.on { fill: var(--t-rating-color); stroke: var(--t-rating-color); }
</style>
