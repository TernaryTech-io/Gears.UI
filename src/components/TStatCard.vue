<script setup lang="ts">
// A figure on an overview page: label, value, a line under it, and an icon in a tinted square. A
// `trend` (the change, in percent) shows beside the value, green when it's good: up, unless
// `trendGood` is 'down' (costs, errors). `sparkline` draws the recent values under it.
import { computed } from 'vue'
import TIcon from './TIcon.vue'
import TSparkline from './TSparkline.vue'
import { toTabler, type Color } from '../types'

const props = withDefaults(defineProps<{
  label: string
  value: string | number
  detail?: string
  icon?: string
  color?: Color
  trend?: number | null
  trendLabel?: string
  trendGood?: 'up' | 'down'
  sparkline?: number[]
  sparklineType?: 'line' | 'bar'
}>(), { color: 'primary', trendGood: 'up', sparklineType: 'line' })

const trendText = computed(() => props.trend == null ? '' : `${Math.abs(Math.round(props.trend * 10) / 10)}%`)
const trendClass = computed(() => {
  if (props.trend == null || props.trend === 0) return 'text-secondary'
  return (props.trend > 0) === (props.trendGood === 'up') ? 'text-success' : 'text-danger'
})
const trendIcon = computed(() => !props.trend ? 'minus' : props.trend > 0 ? 'trending-up' : 'trending-down')
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex align-items-start justify-content-between gap-3">
        <div class="min-w-0">
          <div class="subheader">{{ label }}</div>
          <div class="d-flex align-items-baseline gap-2 mt-2">
            <div class="h1 mb-0">{{ value }}</div>
            <span v-if="trend != null" :class="['d-inline-flex align-items-center gap-1 lh-1 small fw-medium', trendClass]"
              :title="trendLabel">
              {{ trendText }}<TIcon :name="trendIcon" />
            </span>
          </div>
          <div v-if="detail || trendLabel || $slots.detail" class="text-secondary small mt-1">
            <slot name="detail">{{ detail ?? trendLabel }}</slot>
          </div>
        </div>
        <div v-if="icon" :class="['t-stat-icon', `bg-${toTabler(color)}-lt`]">
          <TIcon :name="icon" />
        </div>
      </div>
      <TSparkline v-if="sparkline?.length" :values="sparkline" :type="sparklineType" :color="color" :width="240" :height="36"
        class="t-stat-sparkline mt-3" :label="`${label}: recent values`" />
    </div>
  </div>
</template>
