<script setup lang="ts" generic="T extends object">
// A tree whose items can be dragged into a new order, and into or out of each other, with
// SortableJS: a menu of pages and sub-pages, say. v-model is the top level; each item keeps its
// children in `childrenKey` ("children"). The `item` slot draws an item's row (it gets the item,
// its depth from 1, and its parent). `maxDepth` limits how deep the tree goes (2: items and their
// children); a drop that would go deeper is refused. With `handle`, rows drag only by an element
// with the `sortable-handle` class. `move` reports each move. SortableJS loads on first use.
import { provide, ref, useId } from 'vue'
import TSortableTreeList from './TSortableTreeList.vue'
import { treeKey, type TreeContext } from './sortableTree'

const props = withDefaults(defineProps<{
  itemKey: string | ((item: T) => string | number)
  childrenKey?: string
  maxDepth?: number
  handle?: boolean
  disabled?: boolean
}>(), { childrenKey: 'children', maxDepth: 2 })

const model = defineModel<T[]>({ default: () => [] })
const emit = defineEmits<{ move: [move: { item: T; from: { parent: T | null; index: number }; to: { parent: T | null; index: number } }] }>()
const slots = defineSlots<{ item?(scope: { item: T; depth: number; parent: T | null }): unknown }>()
const dragging = ref(false)

const keyOf = (item: T) => String(typeof props.itemKey === 'function' ? props.itemKey(item) : (item as Record<string, unknown>)[props.itemKey])
const childrenOf = (item: T): T[] => ((item as Record<string, unknown>)[props.childrenKey] as T[] | undefined) ?? []

function find(key: string, items: T[] = model.value): T | null {
  for (const item of items) {
    if (keyOf(item) === key) return item
    const found = find(key, childrenOf(item))
    if (found) return found
  }
  return null
}

// The list a parent's children are in, made when it has none yet.
function listOf(parent: T | null): T[] {
  if (!parent) return model.value
  const record = parent as Record<string, unknown>
  if (!Array.isArray(record[props.childrenKey])) record[props.childrenKey] = []
  return record[props.childrenKey] as T[]
}

function move(fromKey: string, oldIndex: number, toKey: string, newIndex: number) {
  const from = fromKey ? find(fromKey) : null
  const to = toKey ? find(toKey) : null
  const [item] = listOf(from).splice(oldIndex, 1)
  if (!item) return
  listOf(to).splice(newIndex, 0, item)
  model.value = [...model.value]
  emit('move', { item, from: { parent: from, index: oldIndex }, to: { parent: to, index: newIndex } })
}

const context: TreeContext<T> = {
  group: useId(),
  get handle() { return props.handle },
  get disabled() { return props.disabled },
  get maxDepth() { return props.maxDepth },
  dragging,
  keyOf,
  childrenOf,
  move,
  render: scope => slots.item?.(scope as { item: T; depth: number; parent: T | null }) as ReturnType<TreeContext<T>['render']>
}
provide(treeKey, context as unknown as TreeContext<object>)
</script>

<template>
  <div :class="['t-tree', { 't-tree-dragging': dragging, 't-sortable-handles': handle }]">
    <TSortableTreeList :items="model" :parent="null" :depth="1" />
  </div>
</template>
