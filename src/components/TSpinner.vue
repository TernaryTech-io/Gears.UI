<script setup lang="ts">
// Something is loading. `label` is read by screen readers, and shown when `showLabel` is set.
import { toTabler, type Color } from '../types'

withDefaults(defineProps<{ size?: 'sm' | 'md'; color?: Color; label?: string; showLabel?: boolean }>(),
  { size: 'md', label: 'Loading…' })
</script>

<template>
  <span class="d-inline-flex align-items-center gap-2" role="status">
    <span :class="['spinner-border', size === 'sm' && 'spinner-border-sm', color && `text-${toTabler(color)}`]" aria-hidden="true" />
    <span :class="showLabel ? 'text-secondary' : 'visually-hidden'">{{ label }}</span>
  </span>
</template>
