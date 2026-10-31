<script setup lang="ts">
// Controls joined into one: an input with a button, or with fixed text in a
// `<span class="input-group-text">`.
defineProps<{ size?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <div :class="['input-group', size && size !== 'md' && `input-group-${size}`]">
    <slot />
  </div>
</template>
