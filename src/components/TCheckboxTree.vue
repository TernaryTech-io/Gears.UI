<script setup lang="ts" generic="T">
// Checkboxes in a tree: a parent is checked when all its children are, partly checked (dash) when
// some are, and checking it checks them all. Parents fold and open with their arrow (`collapsible`,
// all open at first unless `collapsed`). v-model is the checked leaves' values.
import { computed, shallowRef } from 'vue'
import TIcon from './TIcon.vue'
import type { TreeItem } from '../types'

const props = withDefaults(defineProps<{
  items: TreeItem<T>[]
  collapsible?: boolean
  collapsed?: boolean
  disabled?: boolean
  // The tree's accessible name.
  label?: string
}>(), { collapsible: true, collapsed: false })

const model = defineModel<T[]>({ default: () => [] })
// The parents folded, by value.
const folded = shallowRef(new Set<T>())
if (props.collapsed) {
  const walk = (items: TreeItem<T>[]) => items.forEach(i => { if (i.children?.length) { folded.value.add(i.value); walk(i.children) } })
  walk(props.items)
}

const checked = computed(() => new Set(model.value))
const leaves = (item: TreeItem<T>): T[] => (item.children?.length ? item.children.flatMap(leaves) : [item.value])
function state(item: TreeItem<T>): 'on' | 'off' | 'some' {
  const all = leaves(item)
  const on = all.filter(v => checked.value.has(v)).length
  return on === 0 ? 'off' : on === all.length ? 'on' : 'some'
}
function toggle(item: TreeItem<T>) {
  if (props.disabled || item.disabled) return
  const all = leaves(item)
  const next = new Set(model.value)
  if (state(item) === 'on') all.forEach(v => next.delete(v))
  else all.forEach(v => next.add(v))
  model.value = [...next]
}
function fold(item: TreeItem<T>) {
  const next = new Set(folded.value)
  if (next.has(item.value)) next.delete(item.value)
  else next.add(item.value)
  folded.value = next
}
// Rows to show, with their depth: what's under a folded parent is left out.
const rows = computed(() => {
  const out: { item: TreeItem<T>; depth: number }[] = []
  const walk = (items: TreeItem<T>[], depth: number) => items.forEach(item => {
    out.push({ item, depth })
    if (item.children?.length && !(props.collapsible && folded.value.has(item.value))) walk(item.children, depth + 1)
  })
  walk(props.items, 0)
  return out
})
</script>

<template>
  <div class="t-checkbox-tree" role="group" :aria-label="label">
    <div v-for="{ item, depth } in rows" :key="String(item.value)" class="t-checkbox-tree-row" :style="{ paddingInlineStart: `${depth * 1.25}rem` }">
      <button v-if="collapsible && item.children?.length" type="button" class="t-checkbox-tree-fold" :aria-expanded="!folded.has(item.value)"
        :aria-label="`${folded.has(item.value) ? 'Open' : 'Fold'} ${item.label}`" @click="fold(item)">
        <TIcon :name="folded.has(item.value) ? 'chevron-right' : 'chevron-down'" />
      </button>
      <span v-else-if="collapsible" class="t-checkbox-tree-fold" aria-hidden="true" />
      <label class="form-check mb-0">
        <input type="checkbox" class="form-check-input" :checked="state(item) === 'on'" :indeterminate.prop="state(item) === 'some'"
          :aria-checked="state(item) === 'some' ? 'mixed' : state(item) === 'on'" :disabled="disabled || item.disabled" @change="toggle(item)">
        <span class="form-check-label">{{ item.label }}</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.t-checkbox-tree { display: flex; flex-direction: column; gap: 0.25rem; }
.t-checkbox-tree-row { display: flex; align-items: center; gap: 0.25rem; }
.t-checkbox-tree-row .form-check { min-height: 0; }
.t-checkbox-tree-fold { display: grid; place-items: center; flex-shrink: 0; width: 1.25rem; height: 1.25rem; padding: 0; border: 0; background: none; color: var(--tblr-secondary); }
button.t-checkbox-tree-fold:hover { color: var(--tblr-body-color); }
</style>
