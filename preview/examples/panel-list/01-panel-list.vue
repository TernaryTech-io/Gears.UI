<!-- Compact choices for a section's side panel, with a heading, icons and a tag at the end. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { PanelListItem } from '@ternarytech-io/gears-ui'

const chosen = ref('q1')
const mine: PanelListItem[] = [
  { value: 'q1', label: 'Low stock', icon: 'filter' },
  { value: 'q2', label: 'Top customers this month', icon: 'code' },
  { value: 'q3', label: 'Customers by city', icon: 'code', trailing: 'Prod' }
]
</script>

<template>
  <div class="preview-frame" style="width: 16rem; background: var(--tblr-bg-surface)">
    <TPanelList v-model="chosen" heading="Private" :items="mine" />
    <TPanelList heading="Shared" :items="[]" empty="Share a query to show it to the whole project." />
  </div>
</template>
