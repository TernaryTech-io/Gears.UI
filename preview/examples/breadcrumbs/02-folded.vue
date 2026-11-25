<!-- A deep path with `max`: the first and last steps stay, the middle ones fold into a menu. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { BreadcrumbItem } from '@ternarytech-io/gears-ui'

const chose = ref('')
const items: BreadcrumbItem[] = ['Share', 'Projects', '2026', 'North', 'Plans', 'Site', 'Revision 4']
  .map(label => ({ label, icon: label === 'Share' ? 'server-2' : undefined, onSelect: () => { chose.value = label } }))
</script>

<template>
  <div class="vstack gap-2">
    <TBreadcrumbs :items="items" :max="4" />
    <span v-if="chose" class="small text-secondary">Went to {{ chose }}</span>
  </div>
</template>
