<!-- With `editable`, columns marked `editable` change in place: click anywhere in a cell, then Enter or click away to keep it, Esc to drop it. Each change emits `edit` for the page to save. `selectable` rows show how many are chosen, and the bulk actions, in the footer, so the table stays put. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { EditableTableColumn, TableEdit } from '@ternarytech-io/gears-ui'

interface Product { id: number; name: string; price: number; stock: number; active: boolean }
const rows = ref<Product[]>([
  { id: 1, name: 'Green Tea', price: 12.5, stock: 40, active: true },
  { id: 2, name: 'Iced Tea', price: 9, stock: 0, active: false },
  { id: 3, name: 'Coffee', price: 4.25, stock: 120, active: true },
  { id: 4, name: 'Mug', price: 15, stock: 18, active: true }
])
const columns: EditableTableColumn<Product>[] = [
  { key: 'name', label: 'Name', editable: true },
  { key: 'price', label: 'Price', type: 'number', editable: true },
  { key: 'stock', label: 'Stock', type: 'number', editable: true },
  { key: 'active', label: 'Active', type: 'boolean', editable: true }
]
const selected = ref<(string | number)[]>([])
const last = ref('')

function save({ row, key, value }: TableEdit<Product>) {
  Object.assign(row, { [key]: value })
  last.value = `${row.name}: ${key} is now ${value}`
}
function remove() {
  rows.value = rows.value.filter(r => !selected.value.includes(r.id))
  selected.value = []
}
</script>

<template>
  <TEditableTable v-model:selected="selected" title="Products" :columns="columns" :rows="rows" :page-size="0" editable selectable @edit="save">
    <template #bulk-actions>
      <TButton size="xs" color="error" variant="ghost" icon="trash" label="Delete" @click="remove" />
    </template>
  </TEditableTable>
  <p class="small text-secondary mt-2 mb-0">{{ last || 'Click a name, price, stock or active cell to change it.' }}</p>
</template>
