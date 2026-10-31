<!-- Soft is the default and suits most statuses; solid draws the eye; outline is the quietest. -->
<script setup lang="ts">
import type { Color } from '@gears/ui'

const colors: Color[] = ['primary', 'neutral', 'success', 'warning', 'error', 'info']
</script>

<template>
  <div class="vstack gap-2">
    <div v-for="variant in (['soft', 'solid', 'outline'] as const)" :key="variant" class="d-flex flex-wrap gap-2">
      <TBadge v-for="color in colors" :key="color" :color="color" :variant="variant" :label="color" />
    </div>
  </div>
</template>
