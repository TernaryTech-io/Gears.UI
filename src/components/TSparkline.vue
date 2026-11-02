<script setup lang="ts">
// A tiny chart in a line of text or a stat card: Tabler's sparkline (an inline SVG, no library), as
// a line, bars, or a circle for one percentage. It takes the text color, so a color names it.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Sparkline } from '@tabler/core'
import { toTabler, type Color } from '../types'

const props = withDefaults(defineProps<{
  values: number[]
  type?: 'line' | 'bar' | 'circle'
  color?: Color
  width?: number
  height?: number
  // Mark the last, highest or lowest value with a dot.
  spot?: 'none' | 'last' | 'max' | 'min'
  label?: string
}>(), { type: 'line', color: 'primary', width: 64, height: 24, spot: 'none' })

const el = ref<HTMLElement>()
let sparkline: InstanceType<typeof Sparkline> | null = null

onMounted(() => {
  sparkline = new Sparkline(el.value!, {
    type: props.type, values: props.values, width: props.width, height: props.height,
    spot: props.spot, fill: props.type === 'line' ? 'auto' : 'none', animation: 0, label: false
  })
})
watch(() => props.values, values => sparkline?.update(values), { deep: true })
onBeforeUnmount(() => sparkline?.dispose())
</script>

<template>
  <span ref="el" :class="['sparkline', `text-${toTabler(color)}`]" role="img" :aria-label="label ?? `Trend: ${values.join(', ')}`" />
</template>
