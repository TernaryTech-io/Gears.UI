<!-- One width, so a column of them keeps the paths beside them in line. -->
<script setup lang="ts">
const endpoints = [
  { method: 'GET', path: '/online-shop/product', summary: 'List products' },
  { method: 'POST', path: '/online-shop/product', summary: 'Add a product' },
  { method: 'GET', path: '/online-shop/product/{key}', summary: 'Get a product' },
  { method: 'PUT', path: '/online-shop/product/{key}', summary: 'Change a product' },
  { method: 'DELETE', path: '/online-shop/product/{key}', summary: 'Delete a product' }
]
</script>

<template>
  <TCard flush>
    <div class="list-group list-group-flush">
      <div v-for="e in endpoints" :key="e.method + e.path" class="list-group-item d-flex align-items-center gap-3 flex-wrap">
        <TMethodBadge :method="e.method" />
        <code class="text-reset">{{ e.path }}</code>
        <span class="text-secondary small ms-auto">{{ e.summary }}</span>
      </div>
    </div>
  </TCard>
</template>
