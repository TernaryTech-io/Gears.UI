<script setup lang="ts">
// A message on the page: what happened and, if needed, what to do. The icon follows the color
// unless one is given; `important` fills the alert with its color.
import { computed } from 'vue'
import TIcon from './TIcon.vue'
import { toTabler, type Color } from '../types'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  color?: Color
  variant?: 'soft' | 'important'
  // An icon name; null for none. Without one, the color's own icon.
  icon?: string | null
  dismissible?: boolean
}>(), { color: 'info', variant: 'soft' })

const emit = defineEmits<{ close: [] }>()

const defaultIcons: Record<Color, string> = {
  primary: 'info-circle', neutral: 'info-circle', info: 'info-circle',
  success: 'circle-check', warning: 'alert-triangle', error: 'alert-circle'
}
const glyph = computed(() => props.icon === null ? null : props.icon ?? defaultIcons[props.color])
</script>

<template>
  <div :class="['alert', `alert-${toTabler(color)}`, { 'alert-important': variant === 'important', 'alert-dismissible': dismissible }]" role="alert">
    <TIcon v-if="glyph" :name="glyph" class="alert-icon" />
    <div>
      <h4 v-if="title" class="alert-heading">{{ title }}</h4>
      <div v-if="description || $slots.default" class="alert-description">
        <slot>{{ description }}</slot>
      </div>
      <div v-if="$slots.actions" class="btn-list mt-2">
        <slot name="actions" />
      </div>
    </div>
    <button v-if="dismissible" type="button" class="btn-close" aria-label="Close" @click="emit('close')" />
  </div>
</template>
