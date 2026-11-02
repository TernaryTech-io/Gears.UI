<script setup lang="ts">
// A chart, as Tabler draws them with ApexCharts: a line, area, bar (across), column (up), pie or
// donut. `series` are named lists of numbers along `categories` (a pie or donut uses the first
// series, one slice per category). Colors come from the theme (the accent first), or `colors`
// (named colors such as 'success', or any CSS color); they follow light and dark mode and a
// TThemeScope around the chart. `format` writes values in the axis and tooltips; `options` is
// merged over everything for whatever else ApexCharts does. ApexCharts loads on first use.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type ApexCharts from 'apexcharts'
import type { ApexOptions } from 'apexcharts'
import { loadApexCharts } from '../plugins/charts'
import type { ChartSeries, ChartType, Color } from '../types'
import { toTabler } from '../types'

const props = withDefaults(defineProps<{
  type?: ChartType
  series: ChartSeries[]
  categories?: (string | number)[]
  height?: number | string
  stacked?: boolean
  // Shown by default with more than one series, and for pies and donuts.
  legend?: boolean
  colors?: (Color | string)[]
  format?: (value: number) => string
  // No axes, grid or legend: a small chart inside a card or a stat.
  sparkline?: boolean
  label?: string
  options?: ApexOptions
  // Vue makes a missing boolean false; undefined keeps the legend's default.
}>(), { type: 'line', categories: () => [], height: 240, label: 'Chart', legend: undefined })

const emit = defineEmits<{ 'point-click': [point: { series: number; index: number; category: string | number | undefined }] }>()

const el = ref<HTMLElement>()
let chart: ApexCharts | null = null

// Tabler's chart colors after the accent: its named colors, in an order that keeps neighbors apart.
const palette = ['primary', 'green', 'orange', 'purple', 'cyan', 'pink', 'yellow', 'red', 'teal', 'indigo']
const named = new Set(['primary', 'neutral', 'success', 'warning', 'error', 'info'])

const round = computed(() => props.type === 'pie' || props.type === 'donut')

/** A CSS color as the browser resolves it here, inside any theme scope: `var(--tblr-primary)` → rgb(…). */
function resolve(color: string): string {
  if (!el.value) return color
  const probe = document.createElement('span')
  probe.style.display = 'none'
  probe.style.color = color
  el.value.appendChild(probe)
  const value = getComputedStyle(probe).color
  probe.remove()
  return value ? rgb(value) : color
}

// ApexCharts makes fills see-through only for hex and rgb() colors, and Tabler's theme colors can
// come back as oklch(…); painting one pixel gives any color as rgb().
let pixel: CanvasRenderingContext2D | null = null
function rgb(color: string): string {
  if (/^(rgb|#)/i.test(color)) return color
  pixel ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  if (!pixel) return color
  pixel.clearRect(0, 0, 1, 1)
  pixel.fillStyle = color
  pixel.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data
  return a === 255 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${Math.round(a / 255 * 100) / 100})`
}
const cssColor = (color: string) => named.has(color) ? `var(--tblr-${toTabler(color as Color)})`
  : /^[a-z]+$/.test(color) && palette.includes(color) ? `var(--tblr-${color})` : color

function themed(): ApexOptions {
  const count = round.value ? props.categories.length : props.series.length
  const colors = Array.from({ length: Math.max(count, 1) }, (_, i) =>
    resolve(cssColor(props.series[i]?.color ?? props.colors?.[i] ?? palette[i % palette.length])))
  const text = resolve('var(--tblr-secondary)')
  const border = resolve('var(--tblr-border-color)')
  return {
    colors,
    chart: { foreColor: text, background: 'transparent' },
    grid: { borderColor: border },
    stroke: { colors: round.value ? [resolve('var(--tblr-bg-surface)')] : undefined },
    theme: { mode: el.value?.closest('[data-bs-theme]')?.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light' }
  }
}

function options(): ApexOptions {
  const apexType = props.type === 'column' ? 'bar' : props.type
  const formatter = props.format ? (value: number) => (value == null ? '' : props.format!(value)) : undefined
  const base: ApexOptions = {
    chart: {
      type: apexType,
      height: props.height,
      fontFamily: 'inherit',
      parentHeightOffset: 0,
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: false },
      stacked: props.stacked,
      sparkline: { enabled: props.sparkline ?? false },
      events: {
        dataPointSelection: (_event, _chart, config) => {
          if (config) emit('point-click', { series: config.seriesIndex, index: config.dataPointIndex, category: props.categories[config.dataPointIndex] })
        }
      }
    },
    series: round.value
      ? (props.series[0]?.data ?? []).map(v => v ?? 0)
      : props.series.map(s => ({ name: s.name, data: s.data })),
    labels: round.value ? props.categories.map(String) : undefined,
    xaxis: round.value ? undefined : {
      categories: props.categories,
      tooltip: { enabled: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { formatter: props.type === 'bar' ? formatter as never : undefined }
    },
    yaxis: round.value ? undefined : { labels: { formatter: props.type === 'bar' ? undefined : formatter, padding: 4 } },
    plotOptions: {
      bar: { horizontal: props.type === 'bar', columnWidth: '50%', barHeight: '60%', borderRadius: 2 },
      pie: { donut: { size: '70%' } }
    },
    dataLabels: { enabled: false },
    fill: { opacity: props.type === 'area' ? 0.16 : 1, type: 'solid' },
    stroke: { width: props.type === 'line' || props.type === 'area' ? 2 : round.value ? 2 : 0, curve: 'smooth', lineCap: 'round' },
    // Bars across need room for their labels on the left.
    grid: { strokeDashArray: 4, padding: { top: -16, right: 0, left: props.type === 'bar' ? 8 : -4, bottom: -4 } },
    legend: {
      show: props.legend ?? (round.value || props.series.length > 1),
      position: 'bottom',
      offsetY: 8,
      markers: { size: 6, shape: 'circle', strokeWidth: 0 },
      itemMargin: { horizontal: 8, vertical: 4 }
    },
    tooltip: { theme: 'dark', y: { formatter } },
    noData: { text: 'No data' }
  }
  return defined(merge(merge(base, themed()), props.options ?? {}))
}

/** Without keys set to undefined: ApexCharts takes them as values, over its defaults (labels: undefined breaks it). */
function defined<T>(value: T): T {
  if (!isObject(value)) return value
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined).map(([k, v]) => [k, defined(v)])) as T
}

/** Objects merged deeply; arrays and values replaced. */
function merge<T>(target: T, source: unknown): T {
  if (!isObject(target) || !isObject(source)) return (source === undefined ? target : source) as T
  const result: Record<string, unknown> = { ...target }
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue
    result[key] = isObject(value) && isObject(result[key]) ? merge(result[key], value) : value
  }
  return result as T
}
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && typeof value !== 'function'
}

// The theme can change around the chart: light and dark, or a theme scope's accent and grays.
let observer: MutationObserver | null = null
function watchTheme() {
  observer = new MutationObserver(() => chart?.updateOptions(options(), true))
  const themedAncestors = new Set<Element>([document.documentElement])
  for (let node = el.value?.parentElement; node; node = node.parentElement)
    if ([...node.attributes].some(a => a.name.startsWith('data-bs-theme') || a.name === 'data-t-density')) themedAncestors.add(node)
  for (const node of themedAncestors) observer.observe(node, { attributes: true, attributeFilter: ['data-bs-theme', 'data-bs-theme-primary', 'data-bs-theme-base', 'style', 'class'] })
}

onMounted(async () => {
  const ApexCharts = await loadApexCharts()
  if (!el.value) return
  chart = new ApexCharts(el.value, options())
  await chart.render()
  watchTheme()
})
watch(() => [props.type, props.series, props.categories, props.stacked, props.legend, props.colors, props.height, props.options, props.sparkline],
  () => chart?.updateOptions(options(), true), { deep: true })
onBeforeUnmount(() => {
  observer?.disconnect()
  chart?.destroy()
  chart = null
})
</script>

<template>
  <div ref="el" class="t-chart" role="img" :aria-label="label" />
</template>
