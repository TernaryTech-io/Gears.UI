<script setup lang="ts" generic="Row extends Record<string, any>">
// A table of rows. Columns name a key, a label and how to align; a `{key}-cell` slot draws a cell
// (it gets the row and value), `{key}-header` a heading, and the `cell` slot any cell without its
// own slot. Sortable columns sort the rows here, unless `manualSort` leaves it to the caller (who
// watches v-model:sort); a `{key}-header` slot gets the column's sort and `toggleSort` to draw its
// own sort button. `selectable` adds a checkbox to each row (Tabler's table-selectable) and one in
// the header for every row; v-model:selected holds the chosen rows' keys. `card` fits it into a
// flush TCard; `sticky` keeps the header in view while the table scrolls in its container.
// `cellClickable` names cells that take a click of their own: the whole cell emits `cell-click`,
// instead of the row's click or check.
import { computed, ref, watchEffect } from 'vue'
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
  // A checkbox on each row; clicking a row (unless it's `clickable`) checks it too.
  selectable?: boolean
  manualSort?: boolean
  sticky?: boolean
  cellClickable?: (row: Row, column: TableColumn<Row>) => boolean
}>(), { rowKey: 'id', empty: 'Nothing to show.' })

const emit = defineEmits<{ select: [row: Row]; 'cell-click': [row: Row, column: TableColumn<Row>] }>()
const sort = defineModel<TableSort | null>('sort', { default: null })
const selected = defineModel<(string | number)[]>('selected', { default: () => [] })

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

function sortOf(column: TableColumn<Row>) {
  return sort.value?.key === column.key ? sort.value.direction : null
}

function toggleSort(column: TableColumn<Row>) {
  const current = sort.value?.key === column.key ? sort.value.direction : null
  sort.value = current === 'asc' ? { key: column.key, direction: 'desc' } : current === 'desc' ? null : { key: column.key, direction: 'asc' }
}

// ---- Selection ----
const keys = computed(() => sorted.value.map((row, index) => key(row, index)))
const isChecked = (row: Row, index: number) => selected.value.includes(key(row, index))
const allChecked = computed(() => keys.value.length > 0 && keys.value.every(k => selected.value.includes(k)))
const someChecked = computed(() => !allChecked.value && keys.value.some(k => selected.value.includes(k)))
const allBox = ref<HTMLInputElement>()
watchEffect(() => { if (allBox.value) allBox.value.indeterminate = someChecked.value })

function check(row: Row, index: number) {
  const k = key(row, index)
  selected.value = selected.value.includes(k) ? selected.value.filter(x => x !== k) : [...selected.value, k]
}
// The header's box checks every row shown, or unchecks them (keeping rows not shown).
function checkAll() {
  selected.value = allChecked.value
    ? selected.value.filter(k => !keys.value.includes(k))
    : [...new Set([...selected.value, ...keys.value])]
}
function clickRow(row: Row, index: number) {
  if (props.clickable) emit('select', row)
  else if (props.selectable) check(row, index)
}

const span = computed(() => props.columns.length + (props.selectable ? 1 : 0))

function format(value: unknown) {
  if (value == null || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}
</script>

<template>
  <div :class="sticky ? 't-table-sticky' : 'table-responsive'">
    <table :class="['table table-vcenter mb-0', { 'card-table': card, 'table-striped': striped, 'table-hover': hover || clickable, 'table-selectable': selectable }]">
      <thead>
        <tr>
          <th v-if="selectable" class="w-1">
            <input ref="allBox" type="checkbox" class="form-check-input m-0 align-middle" :checked="allChecked" :disabled="!keys.length"
              aria-label="Select every row" @change="checkAll">
          </th>
          <th v-for="column in columns" :key="column.key" :class="align(column)" :style="column.width ? { width: column.width } : undefined"
            :aria-sort="sort?.key === column.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined">
            <slot :name="`${column.key}-header`" :column="column" :sort="sortOf(column)" :toggle-sort="() => toggleSort(column)">
              <button v-if="column.sortable" type="button" :class="['table-sort', { asc: sort?.key === column.key && sort.direction === 'asc', desc: sort?.key === column.key && sort.direction === 'desc' }]"
                @click="toggleSort(column)">{{ column.label ?? column.key }}</button>
              <template v-else>{{ column.label ?? column.key }}</template>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading && !rows.length">
          <td :colspan="span" class="text-center py-4"><TSpinner size="sm" show-label /></td>
        </tr>
        <tr v-else-if="!rows.length">
          <td :colspan="span" class="text-center text-secondary py-4"><slot name="empty">{{ empty }}</slot></td>
        </tr>
        <tr v-for="(row, index) in sorted" v-else :key="key(row, index)"
          :class="{ 'cursor-pointer': clickable || selectable, 'table-active': selectable && isChecked(row, index) }" @click="clickRow(row, index)">
          <td v-if="selectable" @click.stop>
            <input type="checkbox" class="form-check-input m-0 align-middle table-selectable-check" :checked="isChecked(row, index)"
              aria-label="Select the row" @change="check(row, index)">
          </td>
          <td v-for="column in columns" :key="column.key" :class="[align(column), { 't-cell-clickable': cellClickable?.(row, column) }]"
            @click="event => { if (cellClickable?.(row, column)) { event.stopPropagation(); emit('cell-click', row, column) } }">
            <slot :name="`${column.key}-cell`" :row="row" :value="cell(row, column)">
              <slot name="cell" :row="row" :column="column" :value="cell(row, column)">{{ format(cell(row, column)) }}</slot>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
