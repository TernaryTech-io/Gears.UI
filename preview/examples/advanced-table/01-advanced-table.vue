<!-- The filter icon at the right of a heading filters the rows the table has: pick a comparison and type a value. Filters combine, stay when closed (the icon turns blue), and Escape or × clears one. Numbers compare as numbers, dates as dates. -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableColumn, TableFilter } from '@ternarytech-io/gears-ui'

interface Order { id: number; number: string; customer: string; placed: string; items: number; total: number; status: string }

const customers = ['Ada Park', 'Ben Ortiz', 'Cleo Ng', 'Dev Rao', 'Eli Moss']
const statuses = ['Placed', 'Packed', 'Shipped', 'Delivered']
const rows: Order[] = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  number: `SO-${1040 + i}`,
  customer: customers[(i * 3) % customers.length],
  placed: `2026-10-${String(5 + i * 2).padStart(2, '0')}`,
  items: (i * 7) % 9 + 1,
  total: Math.round(((i * 37) % 400 + 12.5) * 100) / 100,
  status: statuses[(i * 5) % statuses.length]
}))

const columns: TableColumn<Order>[] = [
  { key: 'number', label: 'Order', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'placed', label: 'Placed', sortable: true },
  { key: 'items', label: 'Items', align: 'end', sortable: true },
  { key: 'total', label: 'Total', align: 'end', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: '', width: '1%' }
]

const filters = ref<Record<string, TableFilter>>({ total: { operator: 'atLeast', value: '100' } })
const selected = ref<(string | number)[]>([])
const table = ref<{ clearFilters: () => void; shown: Order[] }>()
const active = computed(() => Object.values(filters.value).filter(f => f.value.trim()).length)
const statusColor: Record<string, 'neutral' | 'info' | 'warning' | 'success'> = { Placed: 'neutral', Packed: 'info', Shipped: 'warning', Delivered: 'success' }
</script>

<template>
  <TCard flush>
    <template #header>
      <div class="min-w-0">
        <h3 class="card-title">Orders</h3>
        <p class="card-subtitle mb-0">{{ table?.shown.length ?? rows.length }} of {{ rows.length }} shown<template v-if="selected.length"> · {{ selected.length }} selected</template></p>
      </div>
    </template>
    <template #actions>
      <TButton v-if="active" size="sm" color="neutral" variant="ghost" icon="filter-off" :label="`Clear ${active} filter${active === 1 ? '' : 's'}`"
        @click="table?.clearFilters()" />
    </template>
    <TAdvancedTable ref="table" v-model:filters="filters" v-model:selected="selected" card selectable :columns="columns" :rows="rows">
      <template #total-cell="{ row }">{{ row.total.toFixed(2) }}</template>
      <template #status-cell="{ row }">
        <TBadge :color="statusColor[row.status]" :label="row.status" />
      </template>
      <template #actions-cell>
        <TButton icon="dots-vertical" size="sm" color="neutral" variant="ghost" aria-label="More" />
      </template>
    </TAdvancedTable>
  </TCard>
</template>
