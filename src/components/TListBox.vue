<script setup lang="ts" generic="T">
// A list of choices that's always shown (not a dropdown), to choose one or, with `multiple`,
// several; `searchable` adds a search above it. It's a listbox for assistive technology: the arrow
// keys, Home and End move through it, Space or Enter chooses. v-model is the chosen value (null for
// none), or with `multiple` the chosen values.
import { computed, ref, useId } from 'vue'
import TIcon from './TIcon.vue'
import { useField } from '../composables/useField'
import type { SelectItem } from '../types'

const props = withDefaults(defineProps<{
  items: (T | SelectItem<T>)[]
  multiple?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  // The list's tallest (CSS); it scrolls past that. `none` lets it fill the box it's in (give the
  // TListBox a height, or put it in a flex column).
  height?: string
  disabled?: boolean
  invalid?: boolean
  // The list's accessible name, when no label points at it.
  label?: string
  id?: string
}>(), { searchPlaceholder: 'Search…', height: '12rem' })

const model = defineModel<T | T[] | null | undefined>()
const field = useField(props)
const listId = useId()
const query = ref('')
const active = ref(0)
const list = ref<HTMLElement>()

const options = computed(() => props.items.map(item => (item !== null && typeof item === 'object' && 'value' in (item as object) && 'label' in (item as object)
  ? item as SelectItem<T>
  : { label: String(item), value: item as T })))
const shown = computed(() => {
  const term = query.value.trim().toLowerCase()
  return term ? options.value.filter(o => o.label.toLowerCase().includes(term) || (o.description ?? '').toLowerCase().includes(term)) : options.value
})
const chosen = (value: T) => props.multiple ? Array.isArray(model.value) && model.value.includes(value) : model.value === value

function choose(option: SelectItem<T>) {
  if (props.disabled || option.disabled) return
  if (!props.multiple) {
    model.value = option.value
    return
  }
  const current = Array.isArray(model.value) ? model.value : []
  model.value = current.includes(option.value) ? current.filter(v => v !== option.value) : [...current, option.value]
}
function key(event: KeyboardEvent) {
  const last = shown.value.length - 1
  if (last < 0) return
  const moves: Record<string, number> = { ArrowDown: active.value + 1, ArrowUp: active.value - 1, Home: 0, End: last }
  if (event.key in moves) {
    event.preventDefault()
    active.value = Math.max(0, Math.min(last, moves[event.key]!))
    list.value?.querySelector<HTMLElement>(`[data-index="${active.value}"]`)?.scrollIntoView({ block: 'nearest' })
  } else if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    choose(shown.value[active.value]!)
  }
}
</script>

<template>
  <div :class="['t-list-box', { 'is-invalid': invalid || field.invalid.value, disabled }]">
    <div v-if="searchable" class="t-list-box-search">
      <input v-model="query" type="search" class="form-control form-control-sm" :placeholder="searchPlaceholder" :aria-label="searchPlaceholder"
        :aria-controls="listId" :disabled="disabled" @input="active = 0">
    </div>
    <div :id="field.id.value === listId ? listId : field.id.value" ref="list" class="t-list-box-list" role="listbox" :tabindex="disabled ? -1 : 0"
      :aria-multiselectable="multiple || undefined" :aria-disabled="disabled || undefined" :aria-label="label"
      :aria-activedescendant="shown.length ? `${listId}-${active}` : undefined" :aria-describedby="field.describedBy.value" :style="{ maxHeight: height }"
      @keydown="key">
      <div v-for="(option, index) in shown" :id="`${listId}-${index}`" :key="index" :data-index="index" role="option"
        :aria-selected="chosen(option.value)" :aria-disabled="option.disabled || undefined"
        :class="['t-list-box-item', { selected: chosen(option.value), active: index === active, disabled: option.disabled }]"
        @click="active = index; choose(option)">
        <span v-if="multiple" class="t-list-box-check" aria-hidden="true"><TIcon v-if="chosen(option.value)" name="check" /></span>
        <span class="min-w-0">
          <span class="d-block text-truncate">{{ option.label }}</span>
          <span v-if="option.description" class="d-block small text-secondary text-truncate">{{ option.description }}</span>
        </span>
        <TIcon v-if="!multiple && chosen(option.value)" name="check" class="ms-auto text-primary" />
      </div>
      <p v-if="!shown.length" class="t-list-box-empty">{{ query ? 'Nothing matches.' : 'Nothing to choose.' }}</p>
    </div>
  </div>
</template>

<style scoped>
.t-list-box { display: flex; flex-direction: column; min-height: 0; border: var(--tblr-border-width) solid var(--tblr-border-color); border-radius: var(--tblr-border-radius); background: var(--tblr-bg-forms, var(--tblr-bg-surface)); overflow: hidden; }
.t-list-box.is-invalid { border-color: var(--tblr-danger); }
.t-list-box.disabled { opacity: 0.65; }
.t-list-box-search { padding: 0.375rem; border-bottom: var(--tblr-border-width) solid var(--tblr-border-color); }
.t-list-box-list { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 0.25rem; outline: none; }
.t-list-box-list:focus-visible { box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--tblr-primary) 40%, transparent); }
.t-list-box-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.375rem 0.5rem; border-radius: var(--tblr-border-radius-sm); cursor: pointer; user-select: none; }
.t-list-box-item:hover { background: var(--tblr-bg-surface-secondary); }
.t-list-box-list:focus-visible .t-list-box-item.active { background: var(--tblr-bg-surface-secondary); outline: 1px solid var(--tblr-border-color); }
.t-list-box-item.selected { background: color-mix(in srgb, var(--tblr-primary) 12%, transparent); }
.t-list-box-item.disabled { opacity: 0.5; cursor: default; }
.t-list-box-check {
  display: grid; place-items: center; flex-shrink: 0; width: 1rem; height: 1rem; font-size: 0.75rem;
  border: var(--tblr-border-width) solid var(--tblr-border-color-dark, var(--tblr-border-color)); border-radius: var(--tblr-border-radius-sm);
}
.t-list-box-check :deep(.icon) { width: auto; height: auto; font-size: 0.75rem; line-height: 1; vertical-align: 0; }
.selected > .t-list-box-check { background: var(--tblr-primary); border-color: var(--tblr-primary); color: var(--tblr-primary-fg, #fff); }
.t-list-box-empty { margin: 0.5rem; color: var(--tblr-secondary); font-size: 0.8125rem; }
</style>
