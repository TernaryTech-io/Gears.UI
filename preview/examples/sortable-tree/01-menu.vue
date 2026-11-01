<!-- A menu of pages and sub-pages: drag a page by its handle to reorder it, or into another page's sub-pages. Empty sub-page slots open while you drag. Two levels deep at most, so a page with sub-pages stays at the top. -->
<script setup lang="ts">
import { ref } from 'vue'

interface Page { name: string; icon: string; children: Page[] }
const menu = ref<Page[]>([
  { name: 'Dashboard', icon: 'home', children: [] },
  { name: 'Orders', icon: 'receipt', children: [{ name: 'Open orders', icon: 'list', children: [] }, { name: 'Returns', icon: 'arrow-back-up', children: [] }] },
  { name: 'Customers', icon: 'users', children: [] },
  { name: 'Settings', icon: 'settings', children: [] }
])
</script>

<template>
  <TSortableTree v-model="menu" item-key="name" handle style="max-width: 28rem">
    <template #item="{ item }">
      <div class="d-flex align-items-center gap-2 border rounded px-2 py-2 mb-1 bg-surface">
        <TIcon name="grip-vertical" class="sortable-handle text-secondary" style="cursor: grab" />
        <TIcon :name="item.icon" class="text-secondary" />
        <span class="fw-medium">{{ item.name }}</span>
      </div>
    </template>
  </TSortableTree>
</template>
