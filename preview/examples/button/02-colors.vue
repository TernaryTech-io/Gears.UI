<!-- Every variant comes in every color. Neutral solid is Tabler's plain button: the card color with a border. -->
<script setup lang="ts">
import type { Color } from '@ternarytech-io/gears-ui'

const colors: Color[] = ['primary', 'neutral', 'success', 'warning', 'error', 'info']
const variants = ['solid', 'soft', 'outline', 'ghost'] as const
</script>

<template>
  <div class="vstack gap-2">
    <div v-for="variant in variants" :key="variant" class="btn-list">
      <TButton v-for="color in colors" :key="color" :color="color" :variant="variant" :label="color" class="text-capitalize" />
    </div>
  </div>
</template>
