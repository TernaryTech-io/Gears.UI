<script setup lang="ts" generic="T">
// A list whose items can be dragged into a new order, with Tabler's sortable (SortableJS). v-model
// is the array; the `item` slot draws each item. With `handle`, items drag only by an element with
// the `sortable-handle` class (drawn in the slot). `tag` and `itemTag` choose the elements, such as
// "div" and "div" (the default) or "ul" and "li". SortableJS loads on first use.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Sortable } from '@tabler/core'
import { loadSortable } from '../plugins'

const props = withDefaults(defineProps<{
  itemKey?: string | ((item: T) => string | number)
  tag?: string
  itemTag?: string
  itemClass?: string
  handle?: boolean
  disabled?: boolean
  animation?: number
}>(), { tag: 'div', itemTag: 'div', animation: 150 })

const model = defineModel<T[]>({ default: () => [] })
const emit = defineEmits<{ sort: [move: { from: number; to: number }] }>()

const list = ref<HTMLElement>()
let sortable: Sortable | null = null

const keyOf = (item: T, index: number) => typeof props.itemKey === 'function' ? props.itemKey(item)
  : props.itemKey ? (item as Record<string, string | number>)[props.itemKey] : index

type SortEvent = { oldIndex?: number; newIndex?: number; item: HTMLElement; from: HTMLElement }

onMounted(async () => {
  const SortableClass = await loadSortable()
  if (!list.value) return
  sortable = new SortableClass(list.value, {
    animation: props.animation,
    handle: props.handle ? '.sortable-handle' : undefined,
    disabled: props.disabled,
    onEnd: ({ oldIndex, newIndex, item, from }: SortEvent) => {
      if (oldIndex == null || newIndex == null || oldIndex === newIndex) return
      // SortableJS moved the element; put it back and let Vue move it, so its list stays right.
      from.removeChild(item)
      from.insertBefore(item, from.children[oldIndex] ?? null)
      const next = [...model.value]
      next.splice(newIndex, 0, ...next.splice(oldIndex, 1))
      model.value = next
      emit('sort', { from: oldIndex, to: newIndex })
    }
  })
})

watch(() => props.disabled, disabled => (sortable as unknown as { sortable?: { option(name: string, value: unknown): void } } | null)?.sortable?.option('disabled', disabled))
onBeforeUnmount(() => sortable?.dispose())
</script>

<template>
  <component :is="tag" ref="list" :class="['t-sortable', { 't-sortable-handles': handle }]">
    <component :is="itemTag" v-for="(item, index) in model" :key="keyOf(item, index)" :class="itemClass">
      <slot name="item" :item="item" :index="index" />
    </component>
  </component>
</template>
