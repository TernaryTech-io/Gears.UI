<script setup lang="ts">
// A button, or a link that looks like one when given `to` (a route) or `href`. An icon with no
// label makes a square icon button; give it an aria-label.
import { computed, useSlots } from 'vue'
import { RouterLink } from 'vue-router'
import TIcon from './TIcon.vue'
import { toTabler, type Color, type Size, type Target } from '../types'

const props = withDefaults(defineProps<{
  label?: string
  icon?: string
  trailingIcon?: string
  color?: Color
  variant?: 'solid' | 'outline' | 'ghost' | 'soft' | 'link'
  size?: Size
  loading?: boolean
  disabled?: boolean
  block?: boolean
  square?: boolean
  to?: Target
  href?: string
  target?: string
  type?: 'button' | 'submit' | 'reset'
}>(), { color: 'primary', variant: 'solid', size: 'md', type: 'button' })

const slots = useSlots()

const look = computed(() => {
  if (props.variant === 'link') return 'btn-link'
  // Tabler's plain `btn` is the neutral solid button: the surface color with a border.
  if (props.variant === 'solid') return props.color === 'neutral' ? '' : `btn-${toTabler(props.color)}`
  const look = `btn-${props.variant}-${toTabler(props.color)}`
  return props.variant === 'soft' ? `btn-soft ${look}` : look
})

const classes = computed(() => ['btn', look.value, {
  'btn-xs': props.size === 'xs',
  'btn-sm': props.size === 'sm',
  'btn-lg': props.size === 'lg',
  'btn-icon': props.square || (props.icon && !props.label && !slots.default),
  'w-100': props.block,
  'btn-loading': props.loading,
  disabled: props.disabled && (props.to || props.href)
}])

const tag = computed(() => props.to && !props.disabled ? RouterLink : props.href ? 'a' : 'button')
const attrs = computed(() => {
  if (tag.value === RouterLink) return { to: props.to }
  if (tag.value === 'a') return { href: props.disabled ? undefined : props.href, target: props.target, 'aria-disabled': props.disabled || undefined }
  return { type: props.type, disabled: props.disabled || props.loading }
})
</script>

<template>
  <component :is="tag" v-bind="attrs" :class="classes">
    <TIcon v-if="icon" :name="icon" />
    <slot>{{ label }}</slot>
    <TIcon v-if="trailingIcon" :name="trailingIcon" class="icon-end" />
  </component>
</template>
