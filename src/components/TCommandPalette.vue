<script setup lang="ts">
// Search over pages and things, opened with Ctrl+K (⌘K on a Mac) or a TSearchButton: type to
// filter the groups' items by label, suffix and keywords; arrow keys move, Enter opens. An item
// goes to its `to` or runs its `onSelect`. Put one in the app's frame. v-model:open is optional
// (the state is shared with TSearchButton); watch it to load items when it opens.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import TIcon from './TIcon.vue'
import TModal from './TModal.vue'
import { useCommandPalette } from '../composables/useCommandPalette'
import type { CommandGroup, CommandItem } from '../types'

const props = withDefaults(defineProps<{
  groups: CommandGroup[]
  placeholder?: string
  empty?: string
  // Toggle it with Ctrl+K / ⌘K.
  shortcut?: boolean
}>(), { placeholder: 'Search…', empty: 'No matches', shortcut: true })

const model = defineModel<boolean>('open', { default: false })
const { open, toggle } = useCommandPalette()
const router = useRouter()

const query = ref('')
const active = ref(0)
const input = ref<HTMLInputElement>()
const list = ref<HTMLElement>()

// The model and the shared state follow each other.
watch(open, value => { model.value = value })
watch(model, value => { open.value = value })

const matches = (item: CommandItem, term: string) =>
  [item.label, item.suffix ?? '', ...(item.keywords ?? [])].some(text => text.toLowerCase().includes(term))

const shown = computed(() => {
  const term = query.value.trim().toLowerCase()
  return props.groups
    .map(group => ({ ...group, items: term ? group.items.filter(item => matches(item, term)) : group.items }))
    .filter(group => group.items.length)
})
const flat = computed(() => shown.value.flatMap(group => group.items))

watch(query, () => { active.value = 0 })
watch(open, value => { if (!value) query.value = '' })

function move(by: number) {
  if (!flat.value.length) return
  active.value = (active.value + by + flat.value.length) % flat.value.length
  nextTick(() => list.value?.querySelector('.active')?.scrollIntoView({ block: 'nearest' }))
}

function choose(item: CommandItem | undefined) {
  if (!item) return
  open.value = false
  if (item.onSelect) item.onSelect()
  else if (item.to) router.push(item.to as never)
}

function key(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') { event.preventDefault(); move(1) }
  else if (event.key === 'ArrowUp') { event.preventDefault(); move(-1) }
  else if (event.key === 'Enter') { event.preventDefault(); choose(flat.value[active.value]) }
}

function shortcutKey(event: KeyboardEvent) {
  if (props.shortcut && event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey) {
    event.preventDefault()
    toggle()
  }
}
onMounted(() => window.addEventListener('keydown', shortcutKey))
onBeforeUnmount(() => window.removeEventListener('keydown', shortcutKey))

// Where each item sits in the flat list, for the highlight.
const indexOf = (item: CommandItem) => flat.value.indexOf(item)
</script>

<template>
  <TModal v-model:open="open" position="top" size="lg" @after-enter="input?.focus()">
    <div class="t-command">
      <div class="input-icon">
        <span class="input-icon-addon"><TIcon name="search" /></span>
        <input ref="input" v-model="query" type="search" class="form-control form-control-lg border-0 shadow-none" :placeholder="placeholder"
          role="combobox" aria-expanded="true" aria-controls="t-command-list" aria-autocomplete="list" :aria-label="placeholder" @keydown="key">
      </div>
      <div id="t-command-list" ref="list" class="t-command-list" role="listbox">
        <template v-for="group in shown" :key="group.id">
          <div v-if="group.label" class="t-command-group">{{ group.label }}</div>
          <button v-for="item in group.items" :key="`${group.id}-${item.label}-${item.suffix ?? ''}`" type="button" role="option"
            :aria-selected="indexOf(item) === active" :class="['t-command-item', { active: indexOf(item) === active }]"
            @click="choose(item)" @mousemove="active = indexOf(item)">
            <TIcon v-if="item.icon" :name="item.icon" class="text-secondary" />
            <span class="text-truncate">{{ item.label }}</span>
            <span v-if="item.suffix" class="small text-secondary text-truncate">{{ item.suffix }}</span>
            <TIcon v-if="indexOf(item) === active" name="corner-down-left" class="ms-auto text-secondary" />
          </button>
        </template>
        <p v-if="!flat.length" class="text-secondary text-center py-4 mb-0">{{ empty }}</p>
      </div>
      <div class="t-command-footer">
        <span><kbd>↑</kbd> <kbd>↓</kbd> to move</span>
        <span><kbd>Enter</kbd> to open</span>
        <span><kbd>Esc</kbd> to close</span>
      </div>
    </div>
  </TModal>
</template>
