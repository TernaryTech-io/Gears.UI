<script setup lang="ts">
// A chart, drawn by Apache ECharts: a line, area, bar (across), column (up), pie or donut.
// `series` are named lists of numbers along `categories` (a pie or donut uses the first series,
// one slice per category). Colors come from the theme (the accent first), or `colors` (named
// colors such as 'success', or any CSS color); they follow light and dark mode and a TThemeScope
// around the chart. `format` writes values on the axis and in tooltips; `options` (ECharts
// options) is merged over everything for whatever else ECharts does, arrays (such as `series`)
// replaced. ECharts loads on first use; the chart is SVG unless `renderer` is 'canvas' (better
// for many thousands of points), and follows its box's size.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { EChartsOption } from 'echarts'
import type { EChartsType } from 'echarts/core'
import { loadECharts } from '../plugins/charts'
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
  options?: EChartsOption
  renderer?: 'svg' | 'canvas'
  // Vue makes a missing boolean false; undefined keeps the legend's default.
}>(), { type: 'line', categories: () => [], height: 240, label: 'Chart', legend: undefined, renderer: 'svg' })

const emit = defineEmits<{ 'point-click': [point: { series: number; index: number; category: string | number | undefined }] }>()

const el = ref<HTMLElement>()
let chart: EChartsType | null = null

// Tabler's chart colors after the accent: its named colors, in an order that keeps neighbors apart.
const palette = ['primary', 'green', 'orange', 'purple', 'cyan', 'pink', 'yellow', 'red', 'teal', 'indigo']
const named = new Set(['primary', 'neutral', 'success', 'warning', 'error', 'info'])

const round = computed(() => props.type === 'pie' || props.type === 'donut')
const bars = computed(() => props.type === 'bar' || props.type === 'column')
const cssHeight = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height))

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

// ECharts reads hex, rgb() and hsl() colors (to lighten one on hover), and Tabler's theme colors
// can come back as oklch(…); painting one pixel gives any color as rgb().
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

function option(): EChartsOption {
  const count = round.value ? props.categories.length : props.series.length
  const colors = Array.from({ length: Math.max(count, 1) }, (_, i) =>
    resolve(cssColor((round.value ? undefined : props.series[i]?.color) ?? props.colors?.[i] ?? palette[i % palette.length]!)))
  const text = resolve('var(--tblr-secondary)')
  const body = resolve('var(--tblr-body-color)')
  const border = resolve('var(--tblr-border-color)')
  const surface = resolve('var(--tblr-bg-surface)')
  const font = el.value ? getComputedStyle(el.value).fontFamily : 'inherit'
  const format = props.format
  const formatter = format ? (value: unknown) => (value == null || value === '' ? '' : format(Number(value))) : undefined
  const spark = props.sparkline ?? false
  const legend = !spark && (props.legend ?? (round.value || props.series.length > 1))

  const valueAxis = {
    type: 'value' as const,
    show: !spark,
    axisLabel: { color: text, formatter: formatter as never, hideOverlap: true },
    splitLine: { lineStyle: { color: border, type: 'dashed' as const } },
    axisLine: { show: false },
    axisTick: { show: false }
  }
  const categoryAxis = {
    type: 'category' as const,
    show: !spark,
    data: props.categories.map(String),
    boundaryGap: bars.value,
    // Bars across list their first category on top, as a table would.
    inverse: props.type === 'bar',
    axisLabel: { color: text, hideOverlap: true },
    axisLine: { lineStyle: { color: border } },
    axisTick: { show: false }
  }
  const series = round.value
    ? [{
        type: 'pie' as const,
        name: props.series[0]?.name,
        radius: props.type === 'donut' ? ['55%', '78%'] : [0, '78%'],
        center: ['50%', legend ? '44%' : '50%'],
        data: props.categories.map((c, i) => ({ name: String(c), value: props.series[0]?.data[i] ?? 0 })),
        label: { show: false },
        itemStyle: { borderColor: surface, borderWidth: 2 },
        emphasis: { scaleSize: 4 }
      }]
    : props.series.map(s => bars.value
      ? {
          type: 'bar' as const, name: s.name, data: s.data, stack: props.stacked ? 'total' : undefined,
          barMaxWidth: 32, itemStyle: { borderRadius: props.type === 'bar' ? [0, 2, 2, 0] : [2, 2, 0, 0] }
        }
      : {
          type: 'line' as const, name: s.name, data: s.data, stack: props.stacked ? 'total' : undefined,
          // Smooth, without overshooting a point (a curve never dips below a value it doesn't reach).
          smooth: 0.35, smoothMonotone: 'x' as const, showSymbol: false, symbolSize: 6, lineStyle: { width: 2 }, connectNulls: false,
          areaStyle: props.type === 'area' ? { opacity: 0.16 } : undefined
        })

  const base: EChartsOption = {
    color: colors,
    backgroundColor: 'transparent',
    animation: false,
    textStyle: { fontFamily: font, color: text },
    grid: spark
      ? { left: 0, right: 0, top: 2, bottom: 2 }
      : { left: 4, right: 12, top: 12, bottom: legend ? 36 : 4, containLabel: true },
    tooltip: {
      trigger: round.value ? 'item' : 'axis',
      confine: true,
      valueFormatter: formatter as never,
      backgroundColor: surface,
      borderColor: border,
      textStyle: { color: body, fontFamily: font, fontSize: 12 },
      extraCssText: 'box-shadow: var(--tblr-box-shadow-dropdown); border-radius: var(--tblr-border-radius);',
      axisPointer: bars.value
        ? { type: 'shadow', shadowStyle: { color: border, opacity: 0.35 } }
        : { type: 'line', lineStyle: { color: border } }
    },
    legend: {
      show: legend, bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8, itemGap: 16,
      textStyle: { color: text, fontFamily: font }
    },
    xAxis: round.value ? undefined : props.type === 'bar' ? valueAxis : categoryAxis,
    yAxis: round.value ? undefined : props.type === 'bar' ? categoryAxis : valueAxis,
    series
  }
  return defined(merge(base, props.options ?? {}))
}

/** Without keys set to undefined (ECharts takes some of them as values, over its defaults). */
function defined<T>(value: T): T {
  if (Array.isArray(value)) return value.map(defined) as T
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

const redraw = () => chart?.setOption(option(), { notMerge: true })

// The theme can change around the chart: light and dark, or a theme scope's accent and grays.
let observer: MutationObserver | null = null
function watchTheme() {
  observer = new MutationObserver(redraw)
  const themedAncestors = new Set<Element>([document.documentElement])
  for (let node = el.value?.parentElement; node; node = node.parentElement)
    if ([...node.attributes].some(a => a.name.startsWith('data-bs-theme') || a.name === 'data-t-density')) themedAncestors.add(node)
  for (const node of themedAncestors) observer.observe(node, { attributes: true, attributeFilter: ['data-bs-theme', 'data-bs-theme-primary', 'data-bs-theme-base', 'style', 'class'] })
}
// It follows its box's size.
let sized: ResizeObserver | null = null

let unmounted = false
onMounted(async () => {
  const echarts = await loadECharts()
  if (!el.value || unmounted) return
  chart = echarts.init(el.value, null, { renderer: props.renderer })
  chart.on('click', params => {
    const index = params.dataIndex ?? 0
    emit('point-click', { series: params.seriesIndex ?? 0, index, category: props.categories[index] })
  })
  redraw()
  watchTheme()
  sized = new ResizeObserver(() => chart?.resize())
  sized.observe(el.value)
})
watch(() => [props.type, props.series, props.categories, props.stacked, props.legend, props.colors, props.options, props.sparkline, props.format],
  redraw, { deep: true })
onBeforeUnmount(() => {
  unmounted = true
  observer?.disconnect()
  sized?.disconnect()
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div ref="el" class="t-chart" role="img" :aria-label="label" :style="{ height: cssHeight }" />
</template>
