<!-- A folder's path: each step goes back to it; the last is where you are. -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BreadcrumbItem } from '@ternarytech-io/gears-ui'

const path = ref(['Contracts', '2026', 'Acme'])
const items = computed<BreadcrumbItem[]>(() => [
  { label: 'App files', icon: 'database', onSelect: () => { path.value = [] } },
  ...path.value.map((name, i) => ({ label: name, onSelect: () => { path.value = path.value.slice(0, i + 1) } }))
])
</script>

<template>
  <div class="vstack gap-3">
    <TBreadcrumbs :items="items" />
    <TBreadcrumbs :items="items" size="sm" separator="slash" />
    <div><TButton size="sm" variant="ghost" color="neutral" label="Back to Acme" @click="path = ['Contracts', '2026', 'Acme']" /></div>
  </div>
</template>
