<script setup lang="ts">
// A world map with Tabler's vector map: countries shaded by `values` (a number per ISO code, such
// as { US: 120, DE: 80 }), places as `markers`, `lines` between markers, a `legend` for the scale,
// and selecting countries (`select`, with v-model:selected). `zoom` adds zoom buttons and dragging.
// The map and its data load on first use.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type VectorMap from '@tabler/core/dist/types/src/vector-map'
import type { VectorMapLine, VectorMapMarker, VectorMapTooltipItem } from '@tabler/core/dist/types/src/vector-map'
import { loadVectorMap } from '../plugins'

const props = withDefaults(defineProps<{
  values?: Record<string, number>
  min?: number
  max?: number
  // Two to five colors for the scale, low to high.
  colors?: string[]
  markers?: VectorMapMarker[]
  lines?: VectorMapLine[]
  tooltip?: boolean | ((item: VectorMapTooltipItem) => string)
  legend?: boolean | ((value: number) => string)
  select?: 'none' | 'single' | 'multiple'
  zoom?: boolean
  label?: string
  height?: string
}>(), { values: () => ({}), colors: () => [], markers: () => [], lines: () => [], tooltip: true, legend: false, select: 'none', label: 'World map', height: '20rem' })

const selected = defineModel<string[]>('selected', { default: () => [] })
const emit = defineEmits<{ 'region-click': [code: string] }>()

const el = ref<HTMLElement>()
let map: VectorMap | null = null

async function create() {
  const VectorMapClass = await loadVectorMap()
  if (!el.value) return
  map?.dispose()
  el.value.replaceChildren()
  map = new VectorMapClass(el.value, {
    values: props.values,
    min: props.min ?? null,
    max: props.max ?? null,
    colors: props.colors,
    markers: props.markers,
    lines: props.lines,
    tooltip: props.tooltip,
    legend: props.legend,
    select: props.select,
    selected: selected.value,
    zoom: props.zoom,
    label: props.label
  })
}

onMounted(() => {
  create()
  el.value!.addEventListener('selected.bs.vector-map', event => {
    selected.value = [...((event as Event & { selected: string[] }).selected ?? [])]
  })
  el.value!.addEventListener('regionclick.bs.vector-map', event => {
    emit('region-click', (event as Event & { code: string }).code)
  })
})

watch(() => props.values, values => map?.update(values), { deep: true })
watch(() => [props.min, props.max, props.colors, props.markers, props.lines, props.tooltip, props.legend, props.select, props.zoom, props.label], create, { deep: true })
watch(selected, codes => {
  if (map && JSON.stringify(map.getSelected()) !== JSON.stringify(codes)) map.setSelected(codes)
})
onBeforeUnmount(() => map?.dispose())
</script>

<template>
  <div ref="el" class="vector-map" :style="{ height }" />
</template>
