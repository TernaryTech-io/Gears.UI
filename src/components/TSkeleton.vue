<script setup lang="ts">
// Grey lines where content will appear once it loads.
withDefaults(defineProps<{ lines?: number; avatar?: boolean }>(), { lines: 3 })

// Lines vary in length, as text does; the last is the shortest.
const widths = ['col-12', 'col-10', 'col-11', 'col-8', 'col-9']
</script>

<template>
  <div class="placeholder-glow d-flex gap-3" aria-hidden="true">
    <span v-if="avatar" class="avatar placeholder rounded-circle flex-shrink-0" />
    <div class="flex-fill">
      <div v-for="i in lines" :key="i"
        :class="['placeholder d-block', i === lines && lines > 1 ? 'col-6' : widths[(i - 1) % widths.length], { 'mb-2': i < lines }]" />
    </div>
  </div>
</template>
