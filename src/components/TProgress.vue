<script setup lang="ts">
// How far along something is. Without a value it shows ongoing work of unknown length.
import { computed } from 'vue'
import { toTabler, type Color } from '../types'

const props = withDefaults(defineProps<{ value?: number | null; max?: number; color?: Color; size?: 'sm' | 'md'; label?: string }>(),
  { max: 100, color: 'primary', size: 'md' })

const percent = computed(() => props.value == null ? null : Math.min(100, Math.max(0, props.value / props.max * 100)))
</script>

<template>
  <div :class="['progress', size === 'sm' && 'progress-sm']" role="progressbar" :aria-label="label"
    aria-valuemin="0" :aria-valuemax="max" :aria-valuenow="value ?? undefined">
    <div v-if="percent == null" :class="['progress-bar progress-bar-indeterminate', `bg-${toTabler(color)}`]" />
    <div v-else :class="['progress-bar', `bg-${toTabler(color)}`]" :style="{ width: percent + '%' }" />
  </div>
</template>
