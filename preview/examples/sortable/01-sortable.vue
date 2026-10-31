<!-- Drag the handles to reorder; v-model follows. Here, a view's columns in a card's list group. -->
<script setup lang="ts">
import { ref } from 'vue'

const columns = ref([
  { id: 'name', label: 'Name', type: 'Text' },
  { id: 'sku', label: 'SKU', type: 'Text' },
  { id: 'price', label: 'Price', type: 'Decimal' },
  { id: 'stock', label: 'Stock', type: 'Integer' },
  { id: 'active', label: 'Active', type: 'Boolean' }
])
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TCard title="Columns" flush>
        <TSortable v-model="columns" item-key="id" handle tag="div" class="list-group list-group-flush" item-class="list-group-item d-flex align-items-center gap-2">
          <template #item="{ item, index }">
            <TIcon name="grip-vertical" class="sortable-handle text-secondary" />
            <span class="text-secondary small" style="width: 1.25rem">{{ index + 1 }}</span>
            <span class="flex-fill">{{ item.label }}</span>
            <TBadge color="neutral" :label="item.type" />
          </template>
        </TSortable>
      </TCard>
    </div>
    <div class="col-md-6">
      <div class="subheader mb-2">Order</div>
      <code>{{ columns.map(c => c.id).join(', ') }}</code>
    </div>
  </div>
</template>
