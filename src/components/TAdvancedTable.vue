<script setup lang="ts" generic="Row extends Record<string, any>">
// A TTable whose columns filter the rows it has (not a new query): a filter icon at the right of
// each heading opens a comparison (is, is not, contains, greater than, …) and a value under it.
// Filters combine (every one must match); a column keeps its filter when closed, and its icon shows
// it. v-model:filters holds them by column key. Everything else (sorting, selectable rows, cell
// and header slots, card, sticky) is TTable's.
import { computed, ref, useSlots } from 'vue'
import TButton from './TButton.vue'
import TInput from './TInput.vue'
import TSelect from './TSelect.vue'
import TTable from './TTable.vue'
import type { TableColumn, TableFilter, TableFilterOperator } from '../types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  columns: TableColumn<Row>[]
  rows: Row[]
  empty?: string
}>(), { empty: 'Nothing to show.' })

const filters = defineModel<Record<string, TableFilter>>('filters', { default: () => ({}) })
const slots = useSlots()

const operators: { label: string; value: TableFilterOperator }[] = [
  { label: 'Is', value: 'equals' },
  { label: 'Is not', value: 'notEquals' },
  { label: 'Contains', value: 'contains' },
  { label: 'Greater than', value: 'greaterThan' },
  { label: 'Less than', value: 'lessThan' },
  { label: 'At least', value: 'atLeast' },
  { label: 'At most', value: 'atMost' }
]

// Columns whose filter is open in the heading.
const open = ref(new Set<string>())

const filterable = (column: TableColumn<Row>) => column.filterable !== false && (column.label ?? column.key) !== ''
const cell = (row: Row, column: TableColumn<Row>) => column.value ? column.value(row) : row[column.key]
const active = (key: string) => !!filters.value[key]?.value.trim()
const activeCount = computed(() => Object.keys(filters.value).filter(active).length)

function toggle(column: TableColumn<Row>) {
  const next = new Set(open.value)
  if (next.has(column.key)) next.delete(column.key)
  else {
    next.add(column.key)
    if (!filters.value[column.key]) filters.value = { ...filters.value, [column.key]: { operator: 'contains', value: '' } }
  }
  open.value = next
}
function set(key: string, change: Partial<TableFilter>) {
  filters.value = { ...filters.value, [key]: { ...(filters.value[key] ?? { operator: 'contains', value: '' }), ...change } }
}
function clear(key: string) {
  const { [key]: _, ...rest } = filters.value
  filters.value = rest
  const next = new Set(open.value)
  next.delete(key)
  open.value = next
}
function clearAll() {
  filters.value = {}
  open.value = new Set()
}

// Text compares without case; numbers as numbers and dates as dates when both sides are one.
function matches(value: unknown, filter: TableFilter) {
  const term = filter.value.trim()
  if (!term) return true
  if (value == null || value === '') return filter.operator === 'notEquals'
  const text = typeof value === 'boolean' ? (value ? 'yes' : 'no') : value instanceof Date ? value.toISOString() : String(value)
  const a = text.toLowerCase()
  const b = term.toLowerCase()
  let order: number
  const x = typeof value === 'number' ? value : Number(text)
  const y = Number(term)
  if (Number.isFinite(x) && Number.isFinite(y) && text.trim() !== '') order = x - y
  else if ((value instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(text)) && Number.isFinite(Date.parse(term))) order = Date.parse(text) - Date.parse(term)
  else order = a.localeCompare(b, undefined, { numeric: true })
  switch (filter.operator) {
    case 'equals': return order === 0 || a === b
    case 'notEquals': return !(order === 0 || a === b)
    case 'contains': return a.includes(b)
    case 'greaterThan': return order > 0
    case 'lessThan': return order < 0
    case 'atLeast': return order >= 0
    case 'atMost': return order <= 0
  }
}

const shown = computed(() => {
  const applied = props.columns.filter(c => active(c.key)).map(c => ({ column: c, filter: filters.value[c.key] }))
  return applied.length ? props.rows.filter(row => applied.every(({ column, filter }) => matches(cell(row, column), filter))) : props.rows
})
const emptyText = computed(() => props.rows.length && activeCount.value ? 'No rows match the filters.' : props.empty)

// TTable's slots, passed on; headings are drawn here, around a `{key}-header` slot when given.
const passed = computed(() => Object.keys(slots).filter(name => !name.endsWith('-header')))

defineExpose({ clearFilters: clearAll, shown })
</script>

<template>
  <TTable v-bind="$attrs" :columns="columns" :rows="shown" :empty="emptyText">
    <template v-for="column in columns" :key="column.key" #[`${column.key}-header`]="{ sort, toggleSort }">
      <div class="t-table-heading">
        <span class="t-table-heading-label">
          <slot :name="`${column.key}-header`" :column="column">
            <button v-if="column.sortable" type="button" :class="['table-sort', sort]" @click="toggleSort">{{ column.label ?? column.key }}</button>
            <template v-else>{{ column.label ?? column.key }}</template>
          </slot>
        </span>
        <TButton v-if="filterable(column)" size="xs" :color="active(column.key) ? 'primary' : 'neutral'" variant="ghost" square
          :icon="active(column.key) ? 'filter-check' : 'filter'" :aria-label="`Filter by ${column.label ?? column.key}`"
          :aria-expanded="open.has(column.key)" class="t-table-filter-toggle" @click="toggle(column)" />
      </div>
      <div v-if="filterable(column) && open.has(column.key)" class="t-table-filter">
        <TSelect :model-value="filters[column.key]?.operator ?? 'contains'" :items="operators" size="sm" :aria-label="`How to compare ${column.label ?? column.key}`"
          @update:model-value="v => v && set(column.key, { operator: v })" />
        <TInput :model-value="filters[column.key]?.value ?? ''" size="sm" placeholder="Value" autofocus :aria-label="`Filter value for ${column.label ?? column.key}`"
          @update:model-value="v => set(column.key, { value: String(v ?? '') })" @keydown.esc="clear(column.key)" />
        <TButton size="xs" color="neutral" variant="ghost" square icon="x" :aria-label="`Clear the ${column.label ?? column.key} filter`" @click="clear(column.key)" />
      </div>
    </template>
    <template v-for="name in passed" :key="name" #[name]="scope">
      <slot :name="name" v-bind="scope ?? {}" />
    </template>
  </TTable>
</template>
