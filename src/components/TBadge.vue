<script setup lang="ts">
// A short status label. `soft` (tinted, the default) suits most statuses; `solid` draws the eye.
import { computed } from 'vue'
import TIcon from './TIcon.vue'
import { toTabler, type Color } from '../types'

const props = withDefaults(defineProps<{
  label?: string | number
  color?: Color
  variant?: 'soft' | 'solid' | 'outline'
  icon?: string
}>(), { color: 'primary', variant: 'soft' })

const classes = computed(() => {
  const c = toTabler(props.color)
  return ['badge', {
    soft: `bg-${c}-lt`,
    solid: `bg-${c} text-${c}-fg`,
    outline: `badge-outline text-${c}`
  }[props.variant]]
})
</script>

<template>
  <span :class="classes">
    <TIcon v-if="icon" :name="icon" class="me-1" />
    <slot>{{ label }}</slot>
  </span>
</template>
