<script setup lang="ts" generic="Row extends Record<string, any>">
// An editable table: TTable with a toolbar (a title, search, and actions), pages, and per-column kinds
// (text, number, date, yes/no) that decide how cells are written and aligned. `selectable` rows
// show how many are chosen and the `bulk-actions` slot in the footer, so the table doesn't move.
// `truncate` cuts a column's long values to one line (the whole value on hover). When `editable`, a
// column marked `editable` is changed in place: click anywhere in the cell, then Enter (or leave
// it) to keep the change, Esc to drop it; each change emits `edit` for the caller to save. By
// default the table searches, sorts and pages
// the rows it has; `manual` leaves that to the caller (the rows are one page of `total`), who
// watches v-model:search, v-model:sort and v-model:page.
import { computed, nextTick, ref, watch } from 'vue'
import TButton from './TButton.vue'
import TCard from './TCard.vue'
import TCheckbox from './TCheckbox.vue'
import TInput from './TInput.vue'
import TPagination from './TPagination.vue'
import TTable from './TTable.vue'
import type { EditableTableColumn, TableEdit, TableColumn, TableSort } from '../types'

const props = withDefaults(defineProps<{
  columns: EditableTableColumn<Row>[]
  rows: Row[]
  rowKey?: string | ((row: Row) => string | number)
  title?: string
  subtitle?: string
  searchable?: boolean
  // Rows per page; 0 shows them all.
  pageSize?: number
  selectable?: boolean
  editable?: boolean
  manual?: boolean
  // The rows there are, for `manual` grids.
  total?: number
  loading?: boolean
  empty?: string
  striped?: boolean
  // Rows can be clicked; each click emits `select`.
  clickable?: boolean
}>(), { rowKey: 'id', searchable: true, pageSize: 25, empty: 'Nothing to show.' })

const emit = defineEmits<{ edit: [edit: TableEdit<Row>]; select: [row: Row] }>()
const search = defineModel<string>('search', { default: '' })
const sort = defineModel<TableSort | null>('sort', { default: null })
const page = defineModel<number>('page', { default: 1 })
const selected = defineModel<(string | number)[]>('selected', { default: () => [] })

const value = (row: Row, column: EditableTableColumn<Row>) => column.value ? column.value(row) : row[column.key]
const keyOf = (row: Row) => typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey]

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 })
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })
const dateTimeFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })
/** A cell as text: the column's format, else by its kind. */
function text(row: Row, column: EditableTableColumn<Row>): string {
  const v = value(row, column)
  if (column.format) return column.format(v, row)
  if (v == null || v === '') return '—'
  switch (column.type) {
    case 'number': return typeof v === 'number' || (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) ? numberFormat.format(Number(v)) : String(v)
    case 'boolean': return v ? 'Yes' : 'No'
    case 'date': {
      const d = v instanceof Date ? v : new Date(String(v))
      if (Number.isNaN(d.getTime())) return String(v)
      // A date alone (2026-11-01) has no time to show.
      return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? dateFormat.format(d) : dateTimeFormat.format(d)
    }
    default: return typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)
  }
}

// TTable's columns: numbers to the right, sortable unless said otherwise.
const tableColumns = computed<TableColumn<Row>[]>(() => props.columns.map(c => ({
  ...c, align: c.align ?? (c.type === 'number' ? 'end' : undefined), sortable: c.sortable ?? true
})))

// ---- Search, sort and pages (unless manual) ----
const matching = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (props.manual || !term) return props.rows
  return props.rows.filter(row => props.columns.some(c => text(row, c).toLowerCase().includes(term)))
})
const sorted = computed(() => {
  const by = sort.value
  const column = by && props.columns.find(c => c.key === by.key)
  if (props.manual || !by || !column) return matching.value
  const factor = by.direction === 'asc' ? 1 : -1
  return [...matching.value].sort((a, b) => {
    const x = value(a, column) as any
    const y = value(b, column) as any
    if (x == null) return y == null ? 0 : 1
    if (y == null) return -1
    const numeric = column.type === 'number' || (typeof x === 'number' && typeof y === 'number')
    return (numeric ? Number(x) - Number(y) : String(x).localeCompare(String(y), undefined, { numeric: true })) * factor
  })
})
const count = computed(() => props.manual ? props.total ?? props.rows.length : sorted.value.length)
const shown = computed(() => {
  if (props.manual || !props.pageSize) return sorted.value
  const start = (page.value - 1) * props.pageSize
  return sorted.value.slice(start, start + props.pageSize)
})
// A new search starts at the first page; a page past the end moves back.
watch(search, () => { page.value = 1 })
watch(count, total => {
  const last = Math.max(1, Math.ceil(total / (props.pageSize || total || 1)))
  if (page.value > last) page.value = last
})
const range = computed(() => {
  if (!count.value) return ''
  if (!props.pageSize) return `${count.value} row${count.value === 1 ? '' : 's'}`
  const from = (page.value - 1) * props.pageSize + 1
  return `${from}–${Math.min(from + props.pageSize - 1, count.value)} of ${count.value}`
})

// ---- Editing in place ----
const editing = ref<{ key: string | number; column: string } | null>(null)
const draft = ref<string | boolean>('')
const editor = ref<{ $el?: HTMLElement } | null>(null)
const canEdit = (column: EditableTableColumn<Row>) => !!(props.editable && column.editable)

async function startEdit(row: Row, column: EditableTableColumn<Row>) {
  if (!canEdit(column)) return
  const v = value(row, column)
  draft.value = column.type === 'boolean' ? !!v : v == null ? '' : column.type === 'date' ? String(v).slice(0, 10) : String(v)
  editing.value = { key: keyOf(row), column: column.key }
  await nextTick()
  editor.value?.$el?.querySelector?.('input')?.focus()
}
const isEditing = (row: Row, column: EditableTableColumn<Row>) => editing.value?.key === keyOf(row) && editing.value?.column === column.key

function commit(row: Row, column: EditableTableColumn<Row>) {
  if (!isEditing(row, column)) return
  editing.value = null
  const before = value(row, column)
  const raw = draft.value
  const next = column.type === 'number' ? (raw === '' ? null : Number(raw)) : column.type === 'boolean' ? raw === true : raw === '' ? null : raw
  if (column.type === 'number' && next !== null && !Number.isFinite(next)) return
  if (next === before || (next == null && (before == null || before === ''))) return
  emit('edit', { row, key: column.key, value: next })
}
function cancel() { editing.value = null }

const inputType = (column: EditableTableColumn<Row>) => column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'
</script>

<template>
  <TCard flush class="t-editable-table mb-0">
    <template v-if="title || searchable || $slots.actions" #header>
      <div class="d-flex flex-wrap align-items-center gap-2 w-100">
        <div v-if="title" class="me-auto min-w-0">
          <h3 class="card-title text-truncate">{{ title }}</h3>
          <div v-if="subtitle" class="card-subtitle small text-secondary mb-0">{{ subtitle }}</div>
        </div>
        <TInput v-if="searchable" v-model="search" icon="search" size="sm" placeholder="Search…" aria-label="Search the rows"
          :class="['t-editable-table-search', { 'ms-auto': !title }]" />
        <slot name="actions" />
      </div>
    </template>

    <TTable v-model:sort="sort" v-model:selected="selected" :columns="tableColumns" :rows="shown" :row-key="rowKey" :loading="loading"
      :empty="search && rows.length ? 'No rows match the search.' : empty" card :striped="striped" :selectable="selectable" :clickable="clickable"
      manual-sort :cell-clickable="(row, column) => canEdit(column as EditableTableColumn<Row>) && !isEditing(row, column as EditableTableColumn<Row>)"
      @select="row => emit('select', row)" @cell-click="(row, column) => startEdit(row, column as EditableTableColumn<Row>)">
      <template #cell="{ row, column }">
        <slot :name="`${column.key}-cell`" :row="row" :value="value(row, column as EditableTableColumn<Row>)">
          <div v-if="isEditing(row, column as EditableTableColumn<Row>)" class="t-editable-table-editor" @click.stop>
            <TCheckbox v-if="(column as EditableTableColumn<Row>).type === 'boolean'" ref="editor" v-model="draft as boolean" class="mb-0"
              :label="column.label ?? column.key" @update:model-value="commit(row, column as EditableTableColumn<Row>)" />
            <TInput v-else ref="editor" v-model="draft as string" size="sm" :type="inputType(column as EditableTableColumn<Row>)" :aria-label="column.label ?? column.key"
              @keydown.enter.prevent="commit(row, column as EditableTableColumn<Row>)" @keydown.esc.prevent="cancel"
              @blur="commit(row, column as EditableTableColumn<Row>)" />
          </div>
          <span v-else-if="canEdit(column as EditableTableColumn<Row>)" role="button" tabindex="0" class="t-editable-table-editable"
            :class="{ 'text-truncate d-inline-block align-middle': (column as EditableTableColumn<Row>).truncate }"
            :style="(column as EditableTableColumn<Row>).truncate ? { maxWidth: (column as EditableTableColumn<Row>).truncate } : undefined"
            :title="`${text(row, column as EditableTableColumn<Row>)} (click to edit)`"
            @keydown.enter.prevent="startEdit(row, column as EditableTableColumn<Row>)">
            {{ text(row, column as EditableTableColumn<Row>) }}
          </span>
          <span v-else-if="(column as EditableTableColumn<Row>).truncate" class="text-truncate d-inline-block align-middle"
            :style="{ maxWidth: (column as EditableTableColumn<Row>).truncate }" :title="text(row, column as EditableTableColumn<Row>)">
            {{ text(row, column as EditableTableColumn<Row>) }}
          </span>
          <template v-else>{{ text(row, column as EditableTableColumn<Row>) }}</template>
        </slot>
      </template>
      <template v-if="$slots.empty" #empty><slot name="empty" /></template>
    </TTable>

    <!-- The selection and pages; with selectable rows it's always there, so choosing rows moves nothing. -->
    <template v-if="selectable || (pageSize && count > 0)" #footer>
      <div class="d-flex flex-wrap align-items-center gap-2 t-editable-table-footer">
        <template v-if="selectable && selected.length">
          <span class="small fw-medium">{{ selected.length }} selected</span>
          <TButton size="xs" color="neutral" variant="ghost" label="Clear" @click="selected = []" />
          <slot name="bulk-actions" :selected="selected" />
        </template>
        <span v-else class="small text-secondary">{{ range || (selectable ? 'Select rows for more actions.' : '') }}</span>
        <TPagination v-if="pageSize && count > pageSize" v-model:page="page" :total="count" :items-per-page="pageSize" size="sm" class="ms-auto" />
      </div>
    </template>
  </TCard>
</template>
