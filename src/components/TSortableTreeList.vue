<script setup lang="ts">
// One level of a TSortableTree: its items, each with a list for its children under it (empty
// ones open up while something is dragged, to drop into). Not used on its own.
import { inject, onBeforeUnmount, onMounted, ref, watch, type FunctionalComponent } from 'vue'
import type Sortable from 'sortablejs'
import { treeKey, type TreeItemScope } from './sortableTree'

defineOptions({ name: 'TSortableTreeList' })

const props = defineProps<{ items: object[]; parent: object | null; depth: number }>()
const tree = inject(treeKey)!

const list = ref<HTMLElement>()
let sortable: Sortable | null = null

// An item's height: 1, plus its deepest child's.
const heightOf = (item: object): number => 1 + Math.max(0, ...tree.childrenOf(item).map(heightOf))

const Row: FunctionalComponent<TreeItemScope<object>> = scope => tree.render(scope)

onMounted(async () => {
  const SortableClass = (await import('sortablejs')).default
  if (!list.value) return
  sortable = new SortableClass(list.value, {
    group: tree.group,
    animation: 150,
    draggable: '.t-tree-node',
    handle: tree.handle ? '.sortable-handle' : undefined,
    disabled: tree.disabled,
    // SortableJS's own dragging (not the browser's): the same in every browser and on touch screens.
    forceFallback: true,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    onStart: () => { tree.dragging.value = true },
    // A drop may not take the item's deepest child past the tree's depth.
    onMove: event => Number(event.to.dataset.depth) - 1 + Number(event.dragged.dataset.height) <= tree.maxDepth,
    onEnd: ({ oldIndex, newIndex, item, from, to }) => {
      tree.dragging.value = false
      if (oldIndex == null || newIndex == null || (from === to && oldIndex === newIndex)) return
      // SortableJS moved the element; put it back and let Vue move it, so the lists stay right.
      to.removeChild(item)
      from.insertBefore(item, from.children[oldIndex] ?? null)
      tree.move(from.dataset.parent ?? '', oldIndex, to.dataset.parent ?? '', newIndex)
    }
  })
})

watch(() => tree.disabled, disabled => sortable?.option('disabled', !!disabled))
onBeforeUnmount(() => sortable?.destroy())
</script>

<template>
  <div ref="list" :class="['t-tree-list', { 't-tree-children': depth > 1, 't-tree-empty': !items.length }]"
    :data-parent="parent ? tree.keyOf(parent) : ''" :data-depth="depth">
    <div v-for="item in items" :key="tree.keyOf(item)" class="t-tree-node" :data-height="heightOf(item)">
      <Row :item="item" :depth="depth" :parent="parent" />
      <TSortableTreeList v-if="depth < tree.maxDepth" :items="tree.childrenOf(item)" :parent="item" :depth="depth + 1" />
    </div>
  </div>
</template>
