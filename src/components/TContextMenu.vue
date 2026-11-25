<script setup lang="ts">
// A menu where you right-click, or press the Menu key or Shift+F10 on something focused: the
// default slot is the area it belongs to. Items are a dropdown's (groups split by dividers,
// `label` headings) with a shortcut to show (`kbd`), submenus (`children`) and, for a disabled
// item, why (`reason`). `items` can be a function of the event, so a list's rows each get their
// own menu (find the row from `event.target`); an empty list opens nothing. The menu is drawn on
// the body, at the pointer (or the focused element), kept inside the window; arrows, Enter and
// Escape work it, and focus goes back where it was when it closes. `open(x, y, items?)` opens it
// from code, such as a "…" button.
import { onBeforeUnmount, ref } from 'vue'
import ContextMenuPanel from './internal/ContextMenuPanel.vue'
import type { ContextMenuItem } from '../types'

// The area takes the attributes (class, style), not the menu drawn on the body.
defineOptions({ inheritAttrs: false })

type Items = ContextMenuItem[] | ContextMenuItem[][]

const props = withDefaults(defineProps<{
  items: Items | ((event: MouseEvent | KeyboardEvent) => Items)
  disabled?: boolean
  /** The area's element. */
  as?: string
  /** The menu's accessible name. */
  label?: string
}>(), { as: 'div', label: 'Actions' })

const emit = defineEmits<{ select: [item: ContextMenuItem, event: Event]; 'update:open': [open: boolean] }>()

const shown = ref<{ items: Items; x: number; y: number } | null>(null)
let returnTo: HTMLElement | null = null

const isEmpty = (items: Items) => (Array.isArray(items[0]) ? (items as ContextMenuItem[][]).every(g => g.length === 0) : items.length === 0)

/** Opens the menu at a point on the screen, with these items (or the menu's own). */
function open(x: number, y: number, items?: Items, event?: MouseEvent | KeyboardEvent) {
  const list = items ?? (typeof props.items === 'function' ? props.items(event ?? new MouseEvent('contextmenu')) : props.items)
  if (props.disabled || isEmpty(list)) return false
  returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null
  shown.value = { items: list, x, y }
  emit('update:open', true)
  document.addEventListener('pointerdown', outside, true)
  window.addEventListener('blur', close)
  window.addEventListener('resize', close)
  document.addEventListener('scroll', close, true)
  return true
}

/** Closes the menu, putting focus back where it was. */
function close() {
  if (!shown.value) return
  shown.value = null
  emit('update:open', false)
  document.removeEventListener('pointerdown', outside, true)
  window.removeEventListener('blur', close)
  window.removeEventListener('resize', close)
  document.removeEventListener('scroll', close, true)
  returnTo?.focus?.()
  returnTo = null
}
defineExpose({ open, close })

function outside(event: Event) {
  if (!(event.target instanceof Element) || !event.target.closest('.t-context-menu')) close()
}
function itemsFor(event: MouseEvent | KeyboardEvent): Items {
  return typeof props.items === 'function' ? props.items(event) : props.items
}
function onContextMenu(event: MouseEvent) {
  if (props.disabled) return
  const items = itemsFor(event)
  if (isEmpty(items)) return
  event.preventDefault()
  close()
  open(event.clientX, event.clientY, items, event)
}
function onKey(event: KeyboardEvent) {
  if (props.disabled || !(event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey))) return
  const items = itemsFor(event)
  if (isEmpty(items)) return
  event.preventDefault()
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  close()
  open(rect.left + Math.min(24, rect.width / 2), rect.top + Math.min(rect.height, 28), items, event)
}
function choose(item: ContextMenuItem, event: Event) {
  close()
  item.onSelect?.(event)
  emit('select', item, event)
}
onBeforeUnmount(close)
</script>

<template>
  <component :is="as" v-bind="$attrs" class="t-context-menu-area" @contextmenu="onContextMenu" @keydown="onKey">
    <slot />
  </component>
  <Teleport to="body">
    <ContextMenuPanel v-if="shown" :items="shown.items" :x="shown.x" :y="shown.y" :level="0" :label="label" @choose="choose" @close="close" />
  </Teleport>
</template>
