<script setup lang="ts" generic="Row extends Record<string, any>">
// A table of rows. Columns name a key, a label and how to align; a `{key}-cell` slot draws a cell
// (it gets the row and value), `{key}-header` a heading, and the `cell` slot any cell without its
// own slot. Sortable columns sort the rows here, unless `manualSort` leaves it to the caller (who
// watches v-model:sort). `card` fits it into a flush TCard; `sticky` keeps the header in view while
// the table scrolls in its container.
import { computed } from 'vue'
import TSpinner from './TSpinner.vue'
import type { TableColumn, TableSort } from '../types'

const props = withDefaults(defineProps<{
  columns: TableColumn<Row>[]
  rows: Row[]
  rowKey?: string | ((row: Row) => string | number)
  loading?: boolean
  empty?: string
  card?: boolean
  striped?: boolean
  hover?: boolean
  // Rows can be clicked; each click emits `select`.
  clickable?: boolean
  manualSort?: boolean
  sticky?: boolean
}>(), { rowKey: 'id', empty: 'Nothing to show.' })

const emit = defineEmits<{ select: [row: Row] }>()
const sort = defineModel<TableSort | null>('sort', { default: null })

const cell = (row: Row, column: TableColumn<Row>) => column.value ? column.value(row) : row[column.key]
const key = (row: Row, index: number) => typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey] ?? index
const align = (column: TableColumn<Row>) => column.align === 'end' ? 'text-end' : column.align === 'center' ? 'text-center' : undefined

const sorted = computed(() => {
  const by = sort.value
  const column = by && props.columns.find(c => c.key === by.key)
  if (!by || !column || props.manualSort) return props.rows
  const factor = by.direction === 'asc' ? 1 : -1
  return [...props.rows].sort((a, b) => {
    const x = cell(a, column) as any
    const y = cell(b, column) as any
    if (x == null) return y == null ? 0 : 1
    if (y == null) return -1
    return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })) * factor
  })
})

function toggleSort(column: TableColumn<Row>) {
  const current = sort.value?.key === column.key ? sort.value.direction : null
  sort.value = current === 'asc' ? { key: column.key, direction: 'desc' } : current === 'desc' ? null : { key: column.key, direction: 'asc' }
}

function format(value: unknown) {
  if (value == null || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}
</script>

<template>
  <div :class="sticky ? 't-table-sticky' : 'table-responsive'">
    <table :class="['table table-vcenter mb-0', { 'card-table': card, 'table-striped': striped, 'table-hover': hover || clickable }]">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="align(column)" :style="column.width ? { width: column.width } : undefined"
            :aria-sort="sort?.key === column.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined">
            <slot :name="`${column.key}-header`" :column="column">
              <button v-if="column.sortable" type="button" :class="['table-sort', { asc: sort?.key === column.key && sort.direction === 'asc', desc: sort?.key === column.key && sort.direction === 'desc' }]"
                @click="toggleSort(column)">{{ column.label ?? column.key }}</button>
              <template v-else>{{ column.label ?? column.key }}</template>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading && !rows.length">
          <td :colspan="columns.length" class="text-center py-4"><TSpinner size="sm" show-label /></td>
        </tr>
        <tr v-else-if="!rows.length">
          <td :colspan="columns.length" class="text-center text-secondary py-4"><slot name="empty">{{ empty }}</slot></td>
        </tr>
        <tr v-for="(row, index) in sorted" v-else :key="key(row, index)" :class="{ 'cursor-pointer': clickable }"
          @click="clickable && emit('select', row)">
          <td v-for="column in columns" :key="column.key" :class="align(column)">
            <slot :name="`${column.key}-cell`" :row="row" :value="cell(row, column)">
              <slot name="cell" :row="row" :column="column" :value="cell(row, column)">{{ format(cell(row, column)) }}</slot>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
