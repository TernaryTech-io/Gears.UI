<script setup lang="ts">
// A page with one centered card and the brand above it: sign-in, setup, a password change.
defineProps<{ title: string; subtitle?: string; brand?: string; logo?: string; wide?: boolean }>()
</script>

<template>
  <div class="page page-center">
    <div :class="['container py-4', wide ? 'container-narrow' : 'container-tight']">
      <div v-if="brand || logo || $slots.brand" class="text-center mb-4">
        <slot name="brand">
          <span class="d-inline-flex align-items-center gap-2">
            <img v-if="logo" :src="logo" alt="" width="36" height="36">
            <span v-if="brand" class="h2 mb-0">{{ brand }}</span>
          </span>
        </slot>
      </div>
      <slot name="above" />
      <div class="card card-md">
        <div class="card-body">
          <h1 class="h2 mb-1">{{ title }}</h1>
          <p v-if="subtitle" class="text-secondary mb-0">{{ subtitle }}</p>
          <div class="mt-4">
            <slot />
          </div>
        </div>
      </div>
      <div v-if="$slots.footer" class="text-center text-secondary mt-3">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
