<script setup lang="ts">
// A card: an optional header (title, subtitle, actions on the right), the body and a footer.
// `flush` drops the body's padding, for a table or list that runs to the card's edges.
import { toTabler, type Color } from '../types'

defineProps<{
  title?: string
  subtitle?: string
  flush?: boolean
  size?: 'sm' | 'md' | 'lg'
  // A colored line along the top.
  status?: Color
}>()
</script>

<template>
  <div :class="['card', size && `card-${size}`]">
    <div v-if="status" :class="['card-status-top', `bg-${toTabler(status)}`]" />
    <div v-if="title || $slots.header || $slots.actions" class="card-header">
      <slot name="header">
        <div class="min-w-0">
          <h3 class="card-title">{{ title }}</h3>
          <p v-if="subtitle" class="card-subtitle mb-0">{{ subtitle }}</p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="card-actions btn-list">
        <slot name="actions" />
      </div>
    </div>
    <template v-if="$slots.default">
      <slot v-if="flush" />
      <div v-else class="card-body">
        <slot />
      </div>
    </template>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
