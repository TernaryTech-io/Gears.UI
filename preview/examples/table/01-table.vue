<!-- Sortable columns sort here; `{key}-cell` slots draw cells. -->
<script setup lang="ts">
import type { TableColumn } from '@gears/ui'

interface Model { id: number; name: string; category: string; fields: number; rows: number; built: boolean }

const rows: Model[] = [
  { id: 1, name: 'Product', category: 'Catalog', fields: 6, rows: 1240, built: true },
  { id: 2, name: 'Customer', category: 'Customers', fields: 8, rows: 312, built: true },
  { id: 3, name: 'Order', category: 'Orders', fields: 5, rows: 5821, built: true },
  { id: 4, name: 'OrderLine', category: 'Orders', fields: 4, rows: 14002, built: false }
]

const columns: TableColumn<Model>[] = [
  { key: 'name', label: 'Model', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'fields', label: 'Fields', align: 'end', sortable: true },
  { key: 'rows', label: 'Rows', align: 'end', sortable: true, value: row => row.rows.toLocaleString() },
  { key: 'built', label: 'Status' },
  { key: 'actions', label: '', width: '1%' }
]
</script>

<template>
  <TCard flush>
    <TTable card :columns="columns" :rows="rows" :sort="{ key: 'name', direction: 'asc' }">
      <template #name-cell="{ row }">
        <div class="d-flex align-items-center gap-2"><TIcon name="box" class="text-secondary" /> <strong>{{ row.name }}</strong></div>
      </template>
      <template #built-cell="{ row }">
        <TBadge :color="row.built ? 'success' : 'warning'" :label="row.built ? 'Built' : 'Changed'" />
      </template>
      <template #actions-cell>
        <TButton icon="dots-vertical" size="sm" color="neutral" variant="ghost" aria-label="More" />
      </template>
    </TTable>
  </TCard>
</template>
