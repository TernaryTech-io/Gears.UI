// What TSortableTree shares with its lists (TSortableTreeList), one per level.
import type { InjectionKey, Ref, VNode } from 'vue'

export interface TreeItemScope<T> { item: T; depth: number; parent: T | null }

export interface TreeContext<T> {
  // The SortableJS group: items move between this tree's lists, and no other's.
  group: string
  handle?: boolean
  disabled?: boolean
  maxDepth: number
  dragging: Ref<boolean>
  keyOf(item: T): string
  childrenOf(item: T): T[]
  move(fromKey: string, oldIndex: number, toKey: string, newIndex: number): void
  render(scope: TreeItemScope<T>): VNode[] | undefined
}

export const treeKey: InjectionKey<TreeContext<object>> = Symbol('t-sortable-tree')
