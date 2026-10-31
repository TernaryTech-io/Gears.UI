<script setup lang="ts">
// A person or thing as a picture, or as initials (or an icon) on a tint when there's no picture.
import { computed } from 'vue'
import TIcon from './TIcon.vue'
import { toTabler, type Color } from '../types'

const props = withDefaults(defineProps<{
  text?: string
  src?: string
  icon?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: Color
  shape?: 'circle' | 'square'
}>(), { size: 'md', color: 'primary', shape: 'circle' })

const classes = computed(() => ['avatar', props.size !== 'md' && `avatar-${props.size}`,
  !props.src && `bg-${toTabler(props.color)}-lt`, props.shape === 'circle' && 'rounded-circle'])
</script>

<template>
  <span :class="classes" :style="src ? { backgroundImage: `url(${src})` } : undefined" :role="alt ? 'img' : undefined" :aria-label="alt">
    <template v-if="!src">
      <TIcon v-if="icon" :name="icon" />
      <slot v-else>{{ text }}</slot>
    </template>
  </span>
</template>
