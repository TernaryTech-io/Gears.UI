<!-- The tiles under the theme pickers: TRadioGroup with variant="tiles" and a preview slot, for any choice you judge by eye. -->
<script setup lang="ts">
import { ref } from 'vue'

const layout = ref('left')
const layouts = [
  { label: 'Left', value: 'left' },
  { label: 'Top', value: 'top' },
  { label: 'None', value: 'none' }
]
</script>

<template>
  <TRadioGroup v-model="layout" :items="layouts" variant="tiles" legend="Navigation" tile-width="8rem">
    <template #preview="{ item }">
      <span class="d-flex gap-1 p-2 w-100 h-100" :class="item.value === 'top' ? 'flex-column' : ''">
        <span v-if="item.value !== 'none'" class="bg-secondary rounded-1" :style="item.value === 'top' ? 'height: .5rem' : 'width: .75rem'" />
        <span class="flex-fill border rounded-1" />
      </span>
    </template>
  </TRadioGroup>
</template>
