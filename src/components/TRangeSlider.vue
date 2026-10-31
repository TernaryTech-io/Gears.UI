<script setup lang="ts">
// Tabler's range slider (noUiSlider): one handle for a number, or two for a range when v-model is
// [from, to]. Values snap to `step`; `tooltips` shows each handle's value above it. noUiSlider
// loads on first use.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { API } from 'nouislider'
import { loadSlider } from '../plugins'

const props = withDefaults(defineProps<{
  min?: number
  max?: number
  step?: number
  tooltips?: boolean
  disabled?: boolean
  label?: string
}>(), { min: 0, max: 100, step: 1 })

const model = defineModel<number | [number, number] | null | undefined>()
const el = ref<HTMLElement>()
let slider: API | null = null

// As many decimals as the step has, so 0.1 steps show 0.3, not 0.30000000000000004.
const decimals = computed(() => (String(props.step).split('.')[1] ?? '').length)
const format = { to: (value: number) => Number(value.toFixed(decimals.value)), from: (value: string) => Number(value) }

const isRange = () => Array.isArray(model.value)
const values = () => isRange() ? [...(model.value as [number, number])] : [model.value as number ?? props.min]
const same = (a: number[], b: number[]) => a.length === b.length && a.every((v, i) => v === b[i])

onMounted(async () => {
  const noUiSlider = await loadSlider()
  if (!el.value) return
  const start = values()
  slider = noUiSlider.create(el.value, {
    start,
    connect: start.length === 2 ? true : 'lower',
    step: props.step,
    range: { min: props.min, max: props.max },
    tooltips: props.tooltips ? start.map(() => format) : false,
    format,
    handleAttributes: start.map((_, i) => ({ 'aria-label': `${props.label ?? 'Value'}${start.length === 2 ? (i ? ' to' : ' from') : ''}` }))
  })
  if (props.disabled) slider.disable()
  slider.on('update', (raw: (string | number)[]) => {
    const next = raw.map(Number)
    if (same(next, values())) return
    model.value = isRange() ? [next[0], next[1]] : next[0]
  })
})

watch(model, () => {
  if (!slider) return
  const current = ([] as (string | number)[]).concat(slider.get() as string | number | (string | number)[]).map(Number)
  if (!same(current, values())) slider.set(values())
}, { deep: true })
watch(() => [props.min, props.max, props.step], () => slider?.updateOptions({ range: { min: props.min, max: props.max }, step: props.step }, true))
watch(() => props.disabled, disabled => disabled ? slider?.disable() : slider?.enable())
onBeforeUnmount(() => slider?.destroy())
</script>

<template>
  <div ref="el" :class="['t-range-slider', { 't-range-slider-tooltips': tooltips }]" />
</template>
