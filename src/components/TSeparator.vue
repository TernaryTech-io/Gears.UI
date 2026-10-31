<script setup lang="ts">
// A dividing line, with an optional label in the middle; `vertical` separates items in a row.
defineProps<{ label?: string; orientation?: 'horizontal' | 'vertical' }>()
</script>

<template>
  <div v-if="orientation === 'vertical'" class="vr" role="separator" aria-orientation="vertical" />
  <div v-else-if="label" class="hr-text" role="separator">{{ label }}</div>
  <hr v-else class="my-3">
</template>
