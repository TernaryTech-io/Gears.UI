<script setup lang="ts">
// A figure on an overview page: label, value, a line under it, and an icon in a tinted square.
import TIcon from './TIcon.vue'
import { toTabler, type Color } from '../types'

withDefaults(defineProps<{ label: string; value: string | number; detail?: string; icon: string; color?: Color }>(), { color: 'primary' })
</script>

<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex align-items-start justify-content-between gap-3">
        <div class="min-w-0">
          <div class="subheader">{{ label }}</div>
          <div class="h1 mb-0 mt-2">{{ value }}</div>
          <div v-if="detail || $slots.detail" class="text-secondary small mt-1">
            <slot name="detail">{{ detail }}</slot>
          </div>
        </div>
        <div :class="['t-stat-icon', `bg-${toTabler(color)}-lt`]">
          <TIcon :name="icon" />
        </div>
      </div>
    </div>
  </div>
</template>
