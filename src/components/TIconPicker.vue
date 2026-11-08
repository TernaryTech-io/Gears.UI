<script setup lang="ts">
// Chooses one of Tabler's icons, by name: a field showing the chosen icon that opens a panel with
// a search and a grid of every icon (generated from @tabler/icons-webfont; the list loads the first
// time the panel opens). v-model is the icon's name, such as "mail", or null for none.
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import TIcon from './TIcon.vue'
import { useField } from '../composables/useField'

const props = withDefaults(defineProps<{
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  // Offer "No icon".
  clearable?: boolean
  // How many matching icons the grid shows at once.
  limit?: number
  id?: string
}>(), { placeholder: 'Choose an icon', size: 'md', clearable: true, limit: 160 })

const model = defineModel<string | null | undefined>()
const field = useField(props)
const root = ref<HTMLElement>()
const search = ref<HTMLInputElement>()
const open = ref(false)
const query = ref('')
const icons = shallowRef<readonly string[]>([])

async function show() {
  if (props.disabled) return
  open.value = true
  query.value = ''
  if (!icons.value.length) icons.value = (await import('../data/tablerIcons')).tablerIcons
  await nextTick()
  search.value?.focus()
}
function close() {
  open.value = false
}
function choose(name: string | null) {
  model.value = name
  close()
}

// Matches: the name itself, then names starting with the search, then names containing it; words
// in the search can come in any order ("arrow up" finds arrow-big-up).
const matches = computed(() => {
  const words = query.value.trim().toLowerCase().split(/[\s-]+/).filter(Boolean)
  if (!words.length) return icons.value
  const term = words.join('-')
  const found = icons.value.filter(name => words.every(w => name.includes(w)))
  const rank = (name: string) => (name === term ? 0 : name.startsWith(term) ? 1 : name.includes(term) ? 2 : 3)
  return [...found].sort((a, b) => rank(a) - rank(b) || a.length - b.length || a.localeCompare(b))
})
const shown = computed(() => matches.value.slice(0, props.limit))

// A click outside, or Esc, closes it.
function outside(event: PointerEvent) {
  if (root.value && !root.value.contains(event.target as Node)) close()
}
watch(open, value => {
  if (value) document.addEventListener('pointerdown', outside, true)
  else document.removeEventListener('pointerdown', outside, true)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside, true))
</script>

<template>
  <div ref="root" class="t-icon-picker" @keydown.esc.stop="close">
    <button :id="field.id.value" type="button" :class="['form-control t-icon-picker-field', size !== 'md' && `form-control-${size}`, { 'is-invalid': field.invalid.value }]"
      :disabled="disabled" :aria-expanded="open" aria-haspopup="dialog" :aria-describedby="field.describedBy.value" @click="open ? close() : show()">
      <TIcon v-if="model" :name="model" />
      <span :class="['text-truncate', { 'text-secondary': !model }]">{{ model || placeholder }}</span>
      <TIcon name="chevron-down" class="ms-auto text-secondary" />
    </button>

    <div v-if="open" class="t-icon-picker-panel dropdown-menu show" role="dialog" aria-label="Icons">
      <div class="p-2 border-bottom">
        <input ref="search" v-model="query" type="search" class="form-control form-control-sm" placeholder="Search icons" aria-label="Search icons">
      </div>
      <div class="t-icon-picker-grid" role="listbox" :aria-label="`${matches.length} icons`">
        <button v-for="name in shown" :key="name" type="button" role="option" :aria-selected="name === model" :title="name" :aria-label="name"
          :class="['t-icon-picker-icon', { active: name === model }]" @click="choose(name)">
          <TIcon :name="name" />
        </button>
        <p v-if="icons.length && !matches.length" class="t-icon-picker-note">No icons match.</p>
        <p v-else-if="!icons.length" class="t-icon-picker-note">Loading…</p>
      </div>
      <div class="d-flex align-items-center gap-2 px-2 py-1 border-top small text-secondary">
        <span v-if="matches.length > shown.length">{{ shown.length }} of {{ matches.length.toLocaleString() }}: search to narrow them.</span>
        <span v-else>{{ matches.length.toLocaleString() }} {{ matches.length === 1 ? 'icon' : 'icons' }}</span>
        <button v-if="clearable && model" type="button" class="btn btn-sm btn-ghost-secondary ms-auto" @click="choose(null)">No icon</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.t-icon-picker { position: relative; }
.t-icon-picker-field { display: flex; align-items: center; gap: 0.5rem; text-align: start; }
.t-icon-picker-panel { position: absolute; inset-inline-start: 0; top: calc(100% + 0.25rem); z-index: 1060; width: min(20rem, 90vw); padding: 0; }
.t-icon-picker-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(2.25rem, 1fr)); gap: 0.125rem; max-height: 16rem; overflow-y: auto; padding: 0.5rem; }
.t-icon-picker-icon {
  display: grid; place-items: center; aspect-ratio: 1; padding: 0; font-size: 1.25rem; border: 0; border-radius: var(--tblr-border-radius);
  background: none; color: var(--tblr-body-color);
}
.t-icon-picker-icon:hover, .t-icon-picker-icon:focus-visible { background: var(--tblr-bg-surface-secondary); }
.t-icon-picker-icon.active { background: var(--tblr-primary); color: var(--tblr-primary-fg, #fff); }
.t-icon-picker-note { grid-column: 1 / -1; margin: 0.5rem; color: var(--tblr-secondary); font-size: 0.8125rem; }
</style>
