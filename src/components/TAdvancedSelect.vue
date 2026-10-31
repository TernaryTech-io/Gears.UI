<script setup lang="ts" generic="T">
// Tabler's advanced select (Tom Select): type to filter, pick one or several (`multiple`, shown as
// removable chips), and with `create`, add values that aren't in the list. Items are values or
// { label, value, description, icon, avatar } objects; an icon or avatar initials show beside the
// label. Values keep their type; created values are strings. Tom Select loads on first use.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type TomSelect from 'tom-select'
import { useField } from '../composables/useField'
import { loadTomSelect } from '../plugins'
import type { AdvancedSelectItem } from '../types'

const props = withDefaults(defineProps<{
  items: (T | AdvancedSelectItem<T>)[]
  multiple?: boolean
  // Allow values that aren't in the list.
  create?: boolean
  maxItems?: number
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  invalid?: boolean
  id?: string
}>(), { size: 'md' })

const model = defineModel<T | string | (T | string)[] | null | undefined>()
const field = useField(props)
const select = ref<HTMLSelectElement>()
let tom: TomSelect | null = null
let syncing = false

const isItem = (item: unknown): item is AdvancedSelectItem<T> =>
  typeof item === 'object' && item !== null && 'label' in item && 'value' in item
const options = computed<AdvancedSelectItem<T>[]>(() =>
  props.items.map(item => isItem(item) ? item : { label: String(item), value: item as T }))

// Tom Select works with string keys: an item's position, or "+" and the text of a created value.
const keyOf = (value: unknown) => {
  const index = options.value.findIndex(o => o.value === value)
  return index >= 0 ? String(index) : value == null ? null : `+${value}`
}
const valueOf = (key: string): T | string => key.startsWith('+') ? key.slice(1) : options.value[Number(key)].value

const keys = () => {
  const value = model.value
  const list = props.multiple ? (Array.isArray(value) ? value : []) : value == null ? [] : [value]
  return list.map(keyOf).filter((k): k is string => k !== null)
}

const tomOptions = () => options.value.map((o, i) => ({
  key: String(i), label: o.label, description: o.description ?? '', icon: o.icon ?? '', avatar: o.avatar ?? '', disabled: !!o.disabled, optgroup: o.group
}))

function escape(text: string) {
  return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
function render(data: { label: string; description?: string; icon?: string; avatar?: string }, withDescription: boolean) {
  const lead = data.icon ? `<i class="ti ti-${escape(data.icon)} icon me-2 text-secondary"></i>`
    : data.avatar ? `<span class="avatar avatar-xs rounded-circle bg-primary-lt me-2">${escape(data.avatar)}</span>` : ''
  const description = withDescription && data.description ? `<div class="small text-secondary">${escape(data.description)}</div>` : ''
  return `<div class="d-flex align-items-center">${lead}<div>${escape(data.label)}${description}</div></div>`
}

onMounted(async () => {
  const TomSelectClass = await loadTomSelect()
  if (!select.value) return
  const groups = [...new Set(options.value.map(o => o.group).filter(Boolean))] as string[]
  tom = new TomSelectClass(select.value, {
    valueField: 'key',
    labelField: 'label',
    searchField: ['label', 'description'],
    options: tomOptions(),
    optgroups: groups.map(g => ({ value: g, label: g })),
    optgroupField: 'optgroup',
    items: keys(),
    maxItems: props.multiple ? (props.maxItems ?? null) : 1,
    // Tom Select's typings expect a callback form; returning the new option works too.
    create: props.create ? ((input: string) => ({ key: `+${input}`, label: input })) as never : false,
    placeholder: props.placeholder,
    copyClassesToDropdown: false,
    dropdownParent: 'body',
    plugins: props.multiple ? ['remove_button'] : [],
    render: {
      option: (data: never) => render(data, true),
      item: (data: never) => render(data, false),
      option_create: (data: { input: string }) => `<div class="create">Add <strong>${escape(data.input)}</strong>…</div>`,
      no_results: () => '<div class="no-results">No matches</div>'
    }
  })
  if (props.disabled) tom.disable()
  tom.on('change', () => {
    if (syncing || !tom) return
    const value = tom.getValue()
    const list = (Array.isArray(value) ? value : value ? [value] : []).map(valueOf)
    model.value = props.multiple ? list : list[0] ?? null
  })
})

// Changes from outside: new items, a new value, enabled or not.
watch(options, async () => {
  if (!tom) return
  syncing = true
  tom.clearOptions()
  tom.addOptions(tomOptions())
  tom.setValue(keys(), true)
  syncing = false
}, { deep: true })
watch(model, () => {
  if (!tom) return
  const current = tom.getValue()
  const next = keys()
  if (JSON.stringify(Array.isArray(current) ? current : current ? [current] : []) === JSON.stringify(next)) return
  syncing = true
  for (const key of next) if (key.startsWith('+') && !tom.options[key]) tom.addOption({ key, label: key.slice(1) })
  tom.setValue(next, true)
  syncing = false
}, { deep: true })
watch(() => props.disabled, disabled => nextTick(() => disabled ? tom?.disable() : tom?.enable()))

onBeforeUnmount(() => tom?.destroy())
</script>

<template>
  <!-- Tom Select hides the select and adds its own control beside it, inside this wrapper. -->
  <div class="t-advanced-select">
    <select :id="field.id.value" ref="select" :multiple="multiple" :placeholder="placeholder" :aria-describedby="field.describedBy.value"
      :class="['form-select', size !== 'md' && `form-select-${size}`, { 'is-invalid': field.invalid.value }]" />
  </div>
</template>
