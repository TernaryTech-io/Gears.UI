<script setup lang="ts" generic="T">
// A select with a search box, for long lists, and for picking several (`multiple`, where the model
// is an array). Items are values or { label, value, group } objects; grouped items are listed
// under their group's name.
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Dropdown } from '@tabler/core'
import TIcon from './TIcon.vue'
import { useField } from '../composables/useField'
import type { SelectItem } from '../types'

const props = withDefaults(defineProps<{
  items: (T | SelectItem<T>)[]
  multiple?: boolean
  placeholder?: string
  searchable?: boolean
  searchPlaceholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  invalid?: boolean
  id?: string
}>(), { searchable: true, searchPlaceholder: 'Search…', size: 'md' })

const model = defineModel<T | T[] | null | undefined>()
const field = useField(props)

const toggle = ref<HTMLButtonElement>()
const search = ref<HTMLInputElement>()
const list = ref<HTMLElement>()
const panel = ref<HTMLElement>()
const query = ref('')
let dropdown: Dropdown | null = null

const isItem = (item: unknown): item is SelectItem<T> =>
  typeof item === 'object' && item !== null && 'label' in item && 'value' in item
const options = computed<SelectItem<T>[]>(() =>
  props.items.map(item => isItem(item) ? item : { label: String(item), value: item as T }))

const chosen = computed<T[]>(() => props.multiple ? (Array.isArray(model.value) ? model.value : []) : model.value == null ? [] : [model.value as T])
const isChosen = (option: SelectItem<T>) => chosen.value.includes(option.value)

const summary = computed(() => {
  const labels = options.value.filter(isChosen).map(o => o.label)
  if (!labels.length) return ''
  return labels.length > 2 ? `${labels.slice(0, 2).join(', ')} +${labels.length - 2}` : labels.join(', ')
})

// The matching options, in their groups (ungrouped options have an empty group name).
const groups = computed(() => {
  const term = query.value.trim().toLowerCase()
  const result: { name: string; options: SelectItem<T>[] }[] = []
  for (const option of options.value) {
    if (term && !option.label.toLowerCase().includes(term)) continue
    const name = option.group ?? ''
    let group = result.find(g => g.name === name)
    if (!group) result.push(group = { name, options: [] })
    group.options.push(option)
  }
  return result
})

function pick(option: SelectItem<T>) {
  if (!props.multiple) {
    model.value = option.value
    return
  }
  model.value = isChosen(option) ? chosen.value.filter(v => v !== option.value) : [...chosen.value, option.value]
}

function firstItem() {
  list.value?.querySelector<HTMLElement>('.dropdown-item')?.focus()
}

onMounted(() => {
  dropdown = new Dropdown(toggle.value!, {
    autoClose: props.multiple ? 'outside' : true,
    popperConfig: (config: object) => ({ ...config, strategy: 'fixed' })
  })
  // The menu is as wide as the select (it's positioned against the window, so 100% won't do).
  toggle.value!.addEventListener('show.bs.dropdown', () => {
    if (panel.value) panel.value.style.width = `${toggle.value!.offsetWidth}px`
  })
  toggle.value!.addEventListener('shown.bs.dropdown', () => nextTick(() => search.value?.focus()))
  toggle.value!.addEventListener('hidden.bs.dropdown', () => { query.value = '' })
})
onBeforeUnmount(() => dropdown?.dispose())
</script>

<template>
  <div class="dropdown t-select-menu">
    <button :id="field.id.value" ref="toggle" type="button" :disabled="disabled" data-bs-toggle="dropdown" aria-haspopup="listbox"
      :aria-describedby="field.describedBy.value" :aria-invalid="field.invalid.value || undefined"
      :class="['form-select text-start text-truncate', size !== 'md' && `form-select-${size}`, { 'is-invalid': field.invalid.value }]">
      <span v-if="summary">{{ summary }}</span>
      <span v-else class="text-secondary">{{ placeholder ?? '' }}&nbsp;</span>
    </button>
    <div ref="panel" class="dropdown-menu p-0 t-select-menu-panel" role="listbox" :aria-multiselectable="multiple || undefined">
      <div v-if="searchable" class="p-2 border-bottom">
        <input ref="search" v-model="query" type="search" class="form-control form-control-sm" :placeholder="searchPlaceholder"
          aria-label="Search the options" @keydown.down.prevent="firstItem">
      </div>
      <div ref="list" class="t-select-menu-items">
        <template v-for="group in groups" :key="group.name">
          <h6 v-if="group.name" class="dropdown-header">{{ group.name }}</h6>
          <button v-for="(option, i) in group.options" :key="i" type="button" role="option" :aria-selected="isChosen(option)"
            :disabled="option.disabled" :class="['dropdown-item', { active: !multiple && isChosen(option) }]" @click="pick(option)">
            <input v-if="multiple" type="checkbox" class="form-check-input m-0 me-2 pe-none" tabindex="-1" :checked="isChosen(option)" aria-hidden="true">
            <span class="min-w-0">
              <span class="d-block text-truncate">{{ option.label }}</span>
              <span v-if="option.description" class="d-block small text-secondary text-truncate">{{ option.description }}</span>
            </span>
            <TIcon v-if="!multiple && isChosen(option)" name="check" class="ms-auto ps-2" />
          </button>
        </template>
        <div v-if="!groups.length" class="dropdown-item-text text-secondary small">No matches</div>
      </div>
      <div v-if="multiple && chosen.length" class="border-top p-1">
        <button type="button" class="dropdown-item small text-secondary" @click="model = []">Clear the selection</button>
      </div>
    </div>
  </div>
</template>
