<script setup lang="ts">
// A tree that opens and closes, such as folders: v-model:selected is the chosen node's id, and
// v-model:expanded the open ones'. A node's children are its `children`, or, the first time it
// opens, what `load` gives (a node with neither is openable until loaded; `leaf` says it has
// none). It follows the ARIA tree pattern: Up and Down move, Right opens or goes in, Left closes or
// goes up, Home and End, Enter or Space chooses, and typing a letter jumps to the next node it
// starts. Nodes can take drops (`droppable` says which, for a dragover) and be dragged
// (`draggable`), for moving things into folders. The `label` slot draws a row's text, `actions`
// its trailing buttons. `reload(id)` reads a node's children again; `reveal(ids)` opens a path.
import { computed, nextTick, reactive, ref } from 'vue'
import TIcon from './TIcon.vue'
import TSpinner from './TSpinner.vue'
import type { TreeNode } from '../types'

const props = withDefaults(defineProps<{
  nodes: TreeNode[]
  load?: (node: TreeNode) => Promise<TreeNode[]>
  /** Whether a drag over a node may drop there. */
  droppable?: (node: TreeNode, event: DragEvent) => boolean
  /** Whether a node can be dragged. */
  draggable?: (node: TreeNode) => boolean
  size?: 'sm' | 'md'
  /** The tree's accessible name. */
  label?: string
}>(), { size: 'md', label: 'Tree' })

const selected = defineModel<string | null>('selected', { default: null })
const expanded = defineModel<string[]>('expanded', { default: () => [] })
const emit = defineEmits<{
  select: [node: TreeNode]
  open: [node: TreeNode]
  drop: [drop: { node: TreeNode; event: DragEvent }]
  dragstart: [drag: { node: TreeNode; event: DragEvent }]
}>()
defineSlots<{ label?(scope: { node: TreeNode; depth: number }): unknown; actions?(scope: { node: TreeNode; depth: number }): unknown }>()

// Children loaded (by id), loading, or failed.
const loaded = reactive(new Map<string, TreeNode[]>())
const loading = reactive(new Set<string>())
const failed = reactive(new Map<string, string>())
const focused = ref<string | null>(null)
const over = ref<string | null>(null)
const root = ref<HTMLElement>()

const childrenOf = (node: TreeNode) => node.children ?? loaded.get(node.id)
// Openable unless it's a leaf or was given no children; one loaded empty stays openable, and shows Empty.
const openable = (node: TreeNode) => node.leaf !== true && !(node.children && node.children.length === 0)
const isOpen = (node: TreeNode) => expanded.value.includes(node.id)

interface Row { node: TreeNode; depth: number; parent: TreeNode | null }
// The nodes shown, in order: each open node's children under it.
const rows = computed(() => {
  const list: Row[] = []
  const walk = (nodes: TreeNode[], depth: number, parent: TreeNode | null) => {
    for (const node of nodes) {
      list.push({ node, depth, parent })
      const children = childrenOf(node)
      if (isOpen(node) && children) walk(children, depth + 1, node)
    }
  }
  walk(props.nodes, 1, null)
  return list
})
const tabStop = computed(() => focused.value ?? selected.value ?? rows.value[0]?.node.id ?? null)

async function fetch(node: TreeNode, again = false) {
  if (!props.load || node.children || (!again && loaded.has(node.id)) || loading.has(node.id)) return
  loading.add(node.id)
  failed.delete(node.id)
  try {
    loaded.set(node.id, await props.load(node))
  } catch (e) {
    failed.set(node.id, e instanceof Error ? e.message : 'It couldn\'t be read.')
  } finally {
    loading.delete(node.id)
  }
}
async function openNode(node: TreeNode) {
  if (isOpen(node) || !openable(node)) return
  expanded.value = [...expanded.value, node.id]
  emit('open', node)
  await fetch(node)
}
function closeNode(node: TreeNode) {
  expanded.value = expanded.value.filter(id => id !== node.id)
}
function toggle(node: TreeNode) {
  if (isOpen(node)) closeNode(node)
  else void openNode(node)
}
function choose(node: TreeNode) {
  if (node.disabled) return
  selected.value = node.id
  focus(node.id)
  emit('select', node)
}
async function focus(id: string) {
  focused.value = id
  await nextTick()
  root.value?.querySelector<HTMLElement>(`[data-node="${CSS.escape(id)}"]`)?.focus()
}

/** Reads a node's children again (after one is added, renamed or moved); its own id, or the top for none. */
async function reload(id?: string) {
  if (!id) return
  const row = rows.value.find(r => r.node.id === id)
  if (row) await fetch(row.node, true)
  else loaded.delete(id)
}
/** Opens each node of a path, top first, loading as it goes, and chooses the last. */
async function reveal(ids: string[]) {
  for (const [i, id] of ids.entries()) {
    const row = rows.value.find(r => r.node.id === id)
    if (!row) return
    if (i < ids.length - 1) await openNode(row.node)
    else choose(row.node)
  }
}
defineExpose({ reload, reveal })

function key(event: KeyboardEvent, row: Row) {
  const index = rows.value.indexOf(row)
  const at = (i: number) => rows.value[Math.max(0, Math.min(rows.value.length - 1, i))]!
  switch (event.key) {
    case 'ArrowDown': void focus(at(index + 1).node.id); break
    case 'ArrowUp': void focus(at(index - 1).node.id); break
    case 'Home': void focus(at(0).node.id); break
    case 'End': void focus(at(rows.value.length - 1).node.id); break
    case 'ArrowRight':
      if (!isOpen(row.node) && openable(row.node)) void openNode(row.node)
      else if (childrenOf(row.node)?.[0]) void focus(childrenOf(row.node)![0]!.id)
      break
    case 'ArrowLeft':
      if (isOpen(row.node)) closeNode(row.node)
      else if (row.parent) void focus(row.parent.id)
      break
    case 'Enter':
    case ' ':
      choose(row.node)
      break
    default:
      // Typing a letter: the next node whose label starts with it.
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const letter = event.key.toLowerCase()
        const after = [...rows.value.slice(index + 1), ...rows.value.slice(0, index + 1)]
        const next = after.find(r => r.node.label.toLowerCase().startsWith(letter))
        if (next) void focus(next.node.id)
        break
      }
      return
  }
  event.preventDefault()
}

function dragOver(event: DragEvent, node: TreeNode) {
  if (!props.droppable?.(node, event)) return
  event.preventDefault()
  over.value = node.id
}
function dropped(event: DragEvent, node: TreeNode) {
  over.value = null
  if (!props.droppable?.(node, event)) return
  event.preventDefault()
  emit('drop', { node, event })
}
function dragStart(event: DragEvent, node: TreeNode) {
  emit('dragstart', { node, event })
}
</script>

<template>
  <div ref="root" :class="['t-tree', `t-tree-${size}`]" role="tree" :aria-label="label">
    <template v-for="row in rows" :key="row.node.id">
      <div :data-node="row.node.id" role="treeitem" :aria-level="row.depth" :aria-expanded="openable(row.node) ? isOpen(row.node) : undefined"
        :aria-selected="selected === row.node.id" :aria-disabled="row.node.disabled || undefined" :tabindex="tabStop === row.node.id ? 0 : -1"
        :draggable="draggable?.(row.node) || undefined"
        :class="['t-tree-row', { selected: selected === row.node.id, over: over === row.node.id, disabled: row.node.disabled }]"
        :style="{ paddingInlineStart: `${(row.depth - 1) * 1.125 + 0.25}rem` }"
        @click="choose(row.node)" @keydown="key($event, row)" @focus="focused = row.node.id"
        @dragover="dragOver($event, row.node)" @dragleave="over = over === row.node.id ? null : over" @drop="dropped($event, row.node)"
        @dragstart="dragStart($event, row.node)">
        <button v-if="openable(row.node)" type="button" class="t-tree-toggle" tabindex="-1" :aria-label="isOpen(row.node) ? 'Close' : 'Open'" @click.stop="toggle(row.node)">
          <TSpinner v-if="loading.has(row.node.id)" size="sm" />
          <TIcon v-else :name="isOpen(row.node) ? 'chevron-down' : 'chevron-right'" />
        </button>
        <span v-else class="t-tree-toggle" aria-hidden="true" />
        <TIcon v-if="row.node.icon" :name="isOpen(row.node) && row.node.openIcon ? row.node.openIcon : row.node.icon" class="t-tree-icon" />
        <span class="t-tree-label">
          <slot name="label" :node="row.node" :depth="row.depth">{{ row.node.label }}</slot>
        </span>
        <span v-if="$slots.actions" class="t-tree-actions" @click.stop><slot name="actions" :node="row.node" :depth="row.depth" /></span>
      </div>
      <div v-if="failed.has(row.node.id) && isOpen(row.node)" class="t-tree-problem" :style="{ paddingInlineStart: `${row.depth * 1.125 + 0.5}rem` }">
        {{ failed.get(row.node.id) }}
        <button type="button" class="btn btn-link btn-sm p-0 ms-1" @click="fetch(row.node, true)">Try again</button>
      </div>
      <div v-else-if="isOpen(row.node) && childrenOf(row.node)?.length === 0" class="t-tree-empty" :style="{ paddingInlineStart: `${row.depth * 1.125 + 1.25}rem` }">
        Empty
      </div>
    </template>
  </div>
</template>

<style scoped>
.t-tree { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.t-tree-sm { font-size: .8125rem; }
.t-tree-row {
  display: flex; align-items: center; gap: .25rem; min-height: 1.875rem; padding-inline-end: .25rem;
  border-radius: var(--tblr-border-radius, 4px); cursor: pointer; user-select: none; min-width: 0;
}
.t-tree-sm .t-tree-row { min-height: 1.625rem; }
.t-tree-row:hover { background: var(--tblr-bg-surface-secondary); }
.t-tree-row:focus-visible { outline: 2px solid var(--tblr-primary); outline-offset: -2px; }
.t-tree-row.selected { background: var(--tblr-primary-lt); color: var(--tblr-primary); }
.t-tree-row.over { box-shadow: inset 0 0 0 2px var(--tblr-primary); background: var(--tblr-primary-lt); }
.t-tree-row.disabled { opacity: .55; cursor: default; }
.t-tree-toggle { display: inline-flex; align-items: center; justify-content: center; width: 1.25rem; height: 1.25rem; flex: none; padding: 0; border: 0; background: none; color: var(--tblr-secondary); border-radius: 3px; }
button.t-tree-toggle:hover { background: var(--tblr-bg-surface-tertiary, rgba(0, 0, 0, .06)); }
.t-tree-icon { flex: none; color: var(--tblr-secondary); }
.t-tree-row.selected .t-tree-icon { color: inherit; }
.t-tree-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.t-tree-actions { display: inline-flex; gap: .125rem; opacity: 0; }
.t-tree-row:hover .t-tree-actions, .t-tree-row:focus-within .t-tree-actions, .t-tree-row.selected .t-tree-actions { opacity: 1; }
.t-tree-problem { font-size: .8125rem; color: var(--tblr-danger); padding-block: .125rem; }
.t-tree-empty { font-size: .8125rem; color: var(--tblr-secondary); padding-block: .125rem; }
</style>
