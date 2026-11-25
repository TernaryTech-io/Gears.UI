<script setup lang="ts">
// One level of a TContextMenu: its items in groups split by dividers, at a point on the screen
// (kept inside the window), with the keyboard: arrows move, Enter and Space choose, Right opens a
// submenu, Left and Escape close this level. A submenu is another panel, beside its item.
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import TIcon from '../TIcon.vue'
import { toTabler, type ContextMenuItem } from '../../types'

defineOptions({ name: 'ContextMenuPanel' })

// `backX`: for a submenu, where its item starts, to open to the left of it when there's no room on the right.
const props = defineProps<{ items: ContextMenuItem[] | ContextMenuItem[][]; x: number; y: number; level: number; label?: string; backX?: number }>()
const emit = defineEmits<{ choose: [item: ContextMenuItem, event: Event]; close: [all: boolean] }>()

const groups = computed(() => (Array.isArray(props.items[0]) ? props.items : [props.items]) as ContextMenuItem[][])
// Every row in order, for the keyboard: choosable items only.
const rows = computed(() => groups.value.flat().filter(i => i.type !== 'label'))
const panel = ref<HTMLElement>()
const place = ref({ left: props.x, top: props.y })
const active = ref(-1)
const sub = ref<{ item: ContextMenuItem; x: number; y: number; backX: number } | null>(null)

// Inside the window: a menu that would go off the right or the bottom opens the other way.
async function fit() {
  await nextTick()
  const el = panel.value
  if (!el) return
  const { width, height } = el.getBoundingClientRect()
  const margin = 4
  let left = props.x
  let top = props.y
  if (left + width > window.innerWidth - margin) left = props.backX !== undefined ? props.backX - width : window.innerWidth - width - margin
  if (top + height > window.innerHeight - margin) top = Math.max(margin, window.innerHeight - height - margin)
  place.value = { left: Math.max(margin, left), top: Math.max(margin, top) }
}
onMounted(async () => {
  await fit()
  panel.value?.focus()
  move(1)
})
watch(() => [props.x, props.y], fit)

function rowEl(index: number) {
  return panel.value?.querySelectorAll<HTMLElement>('[data-row]')[index]
}
function move(by: number) {
  const count = rows.value.length
  if (!count) return
  let next = active.value
  for (let step = 0; step < count; step++) {
    next = (next + by + count) % count
    if (!rows.value[next]!.disabled) break
  }
  active.value = next
  rowEl(next)?.focus()
}
function openSub(item: ContextMenuItem, index: number) {
  const el = rowEl(index)
  if (!el || !item.children?.length) return
  const rect = el.getBoundingClientRect()
  sub.value = { item, x: rect.right - 2, y: rect.top - 4, backX: rect.left + 2 }
}
function choose(item: ContextMenuItem, event: Event) {
  if (item.disabled) return
  if (item.children?.length) {
    openSub(item, rows.value.indexOf(item))
    return
  }
  emit('choose', item, event)
}
function key(event: KeyboardEvent) {
  const item = rows.value[active.value]
  switch (event.key) {
    case 'ArrowDown': move(1); break
    case 'ArrowUp': move(-1); break
    case 'Home': active.value = -1; move(1); break
    case 'End': active.value = rows.value.length; move(-1); break
    case 'ArrowRight':
      if (item?.children?.length && !item.disabled) openSub(item, active.value)
      break
    case 'ArrowLeft':
      if (props.level > 0) emit('close', false)
      break
    case 'Enter':
    case ' ':
      if (item) choose(item, event)
      break
    case 'Escape':
      emit('close', props.level === 0)
      break
    case 'Tab':
      emit('close', true)
      break
    default:
      return
  }
  event.preventDefault()
  event.stopPropagation()
}
function hover(item: ContextMenuItem, index: number) {
  active.value = index
  rowEl(index)?.focus()
  if (item.children?.length && !item.disabled) openSub(item, index)
  else sub.value = null
}
function subClosed(all: boolean) {
  const back = sub.value ? rows.value.indexOf(sub.value.item) : -1
  sub.value = null
  if (all) emit('close', true)
  else if (back >= 0) rowEl(back)?.focus()
}
</script>

<template>
  <div ref="panel" class="t-context-menu" role="menu" tabindex="-1" :aria-label="label"
    :style="{ position: 'fixed', left: `${place.left}px`, top: `${place.top}px` }" @keydown="key" @contextmenu.prevent>
    <template v-for="(group, g) in groups" :key="g">
      <div v-if="g > 0 && group.length" class="dropdown-divider" />
      <template v-for="(item, i) in group" :key="`${g}-${i}`">
        <div v-if="item.type === 'label'" class="dropdown-header d-block">
          <div class="text-body fw-medium text-truncate">{{ item.label }}</div>
          <div v-if="item.description" class="text-secondary text-truncate fw-normal">{{ item.description }}</div>
        </div>
        <button v-else type="button" data-row role="menuitem" :aria-disabled="item.disabled || undefined" :aria-haspopup="item.children?.length ? 'menu' : undefined"
          :aria-expanded="item.children?.length ? sub?.item === item : undefined" tabindex="-1"
          :class="['dropdown-item', { disabled: item.disabled, active: sub?.item === item }, item.color && !item.disabled && `text-${toTabler(item.color)}`]"
          @click="choose(item, $event)" @mouseenter="hover(item, rows.indexOf(item))">
          <TIcon v-if="item.icon" :name="item.icon" class="dropdown-item-icon" />
          <span class="min-w-0 flex-fill">
            <span class="d-block text-truncate">{{ item.label }}</span>
            <span v-if="item.disabled && item.reason" class="d-block small text-secondary text-truncate">{{ item.reason }}</span>
            <span v-else-if="item.description" class="d-block small text-secondary text-truncate">{{ item.description }}</span>
          </span>
          <kbd v-if="item.kbd" class="t-context-menu-kbd ms-3">{{ item.kbd }}</kbd>
          <TIcon v-if="item.children?.length" name="chevron-right" class="ms-2" />
          <TIcon v-else-if="item.trailingIcon" :name="item.trailingIcon" class="ms-auto ps-2" />
        </button>
      </template>
    </template>
  </div>
  <ContextMenuPanel v-if="sub" :items="sub.item.children!" :x="sub.x" :y="sub.y" :back-x="sub.backX" :level="level + 1" :label="sub.item.label"
    @choose="(item, event) => emit('choose', item, event)" @close="subClosed" />
</template>

<style scoped>
/* A dropdown menu's look, without Bootstrap's .dropdown-menu, whose keyboard handler expects a toggle. */
.t-context-menu {
  min-width: 12rem; max-width: 22rem; z-index: 1090; margin: 0; padding: .25rem 0;
  font-size: .875rem; color: var(--tblr-body-color); background: var(--tblr-bg-surface);
  border: var(--tblr-border-width) solid var(--tblr-border-color-translucent, var(--tblr-border-color));
  border-radius: var(--tblr-border-radius); box-shadow: var(--tblr-box-shadow-dropdown, 0 16px 24px 2px rgba(0, 0, 0, .07));
}
.t-context-menu:focus { outline: none; }
.t-context-menu .dropdown-item { display: flex; align-items: center; width: 100%; }
.t-context-menu .dropdown-item.disabled { pointer-events: auto; cursor: default; opacity: .55; }
.t-context-menu-kbd { font-size: .6875rem; padding: .0625rem .3rem; color: var(--tblr-secondary); background: transparent; border: 1px solid var(--tblr-border-color); box-shadow: none; }
</style>
