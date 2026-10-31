<script setup lang="ts">
// An empty state: nothing here yet, why, and the action that fills it.
import TIcon from './TIcon.vue'

defineProps<{ icon?: string; title: string; description?: string }>()
</script>

<template>
  <div class="empty">
    <div v-if="icon" class="empty-icon">
      <TIcon :name="icon" />
    </div>
    <p class="empty-title">{{ title }}</p>
    <p v-if="description || $slots.description" class="empty-subtitle text-secondary">
      <slot name="description">{{ description }}</slot>
    </p>
    <div v-if="$slots.default" class="empty-action btn-list justify-content-center">
      <slot />
    </div>
  </div>
</template>
