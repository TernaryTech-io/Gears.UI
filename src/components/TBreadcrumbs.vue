<script setup lang="ts">
// A trail of where you are: each step a link (`to`, `href`) or an action (`onSelect`), the last
// one plain text (aria-current). With `max` and more steps than that, the middle ones fold into a
// "…" menu, so a deep path keeps its first and last steps in view.
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import TIcon from './TIcon.vue'
import TDropdown from './TDropdown.vue'
import type { BreadcrumbItem, DropdownItem } from '../types'

const props = withDefaults(defineProps<{
  items: BreadcrumbItem[]
  /** The most steps shown before the middle ones fold into a menu; 0 for no limit. */
  max?: number
  /** The icon between steps. */
  separator?: string
  size?: 'sm' | 'md'
}>(), { max: 0, separator: 'chevron-right', size: 'md' })

const emit = defineEmits<{ select: [item: BreadcrumbItem, index: number] }>()

// The first step, the folded ones, and the last (max - 1) steps.
const shown = computed(() => {
  const items = props.items
  if (!props.max || items.length <= props.max || props.max < 2) return { head: items, folded: [] as BreadcrumbItem[], tail: [] as BreadcrumbItem[] }
  const tail = Math.max(1, props.max - 1)
  return { head: items.slice(0, 1), folded: items.slice(1, items.length - tail), tail: items.slice(items.length - tail) }
})
const foldedItems = computed<DropdownItem[]>(() => shown.value.folded.map((item, i) => ({
  label: item.label, icon: item.icon, onSelect: (event: Event) => choose(item, i + 1, event)
})))

function indexOf(item: BreadcrumbItem) {
  return props.items.indexOf(item)
}
function isLast(item: BreadcrumbItem) {
  return indexOf(item) === props.items.length - 1
}
function choose(item: BreadcrumbItem, index: number, event: Event) {
  item.onSelect?.(event)
  emit('select', item, index)
}
function tag(item: BreadcrumbItem) {
  return item.to ? RouterLink : item.href ? 'a' : 'button'
}
function attrs(item: BreadcrumbItem) {
  return item.to ? { to: item.to } : item.href ? { href: item.href } : { type: 'button' }
}
</script>

<template>
  <nav aria-label="Breadcrumbs" :class="['t-breadcrumbs', `t-breadcrumbs-${size}`]">
    <ol class="t-breadcrumbs-list">
      <template v-for="(item, i) in shown.head" :key="`h${i}`">
        <li class="t-breadcrumbs-item">
          <span v-if="isLast(item)" class="t-breadcrumbs-current" aria-current="page">
            <TIcon v-if="item.icon" :name="item.icon" />{{ item.label }}
          </span>
          <component :is="tag(item)" v-else v-bind="attrs(item)" class="t-breadcrumbs-link" @click="choose(item, indexOf(item), $event)">
            <TIcon v-if="item.icon" :name="item.icon" />{{ item.label }}
          </component>
        </li>
        <li v-if="!isLast(item)" class="t-breadcrumbs-separator" aria-hidden="true"><TIcon :name="separator" /></li>
      </template>
      <template v-if="shown.folded.length">
        <li class="t-breadcrumbs-item">
          <TDropdown :items="foldedItems">
            <button type="button" class="t-breadcrumbs-link" :aria-label="`${shown.folded.length} more steps`">…</button>
          </TDropdown>
        </li>
        <li class="t-breadcrumbs-separator" aria-hidden="true"><TIcon :name="separator" /></li>
      </template>
      <template v-for="(item, i) in shown.tail" :key="`t${i}`">
        <li class="t-breadcrumbs-item">
          <span v-if="isLast(item)" class="t-breadcrumbs-current" aria-current="page">
            <TIcon v-if="item.icon" :name="item.icon" />{{ item.label }}
          </span>
          <component :is="tag(item)" v-else v-bind="attrs(item)" class="t-breadcrumbs-link" @click="choose(item, indexOf(item), $event)">
            <TIcon v-if="item.icon" :name="item.icon" />{{ item.label }}
          </component>
        </li>
        <li v-if="!isLast(item)" class="t-breadcrumbs-separator" aria-hidden="true"><TIcon :name="separator" /></li>
      </template>
    </ol>
  </nav>
</template>

<style scoped>
.t-breadcrumbs-list { display: flex; flex-wrap: wrap; align-items: center; gap: .25rem; list-style: none; margin: 0; padding: 0; min-width: 0; }
.t-breadcrumbs-sm { font-size: .8125rem; }
.t-breadcrumbs-item { display: inline-flex; align-items: center; min-width: 0; }
.t-breadcrumbs-link, .t-breadcrumbs-current { display: inline-flex; align-items: center; gap: .25rem; max-width: 16rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.t-breadcrumbs-link {
  background: none; border: 0; padding: .125rem .25rem; border-radius: var(--tblr-border-radius-sm, 4px);
  color: var(--tblr-secondary); text-decoration: none; cursor: pointer;
}
.t-breadcrumbs-link:hover, .t-breadcrumbs-link:focus-visible { color: var(--tblr-body-color); background: var(--tblr-bg-surface-secondary); }
.t-breadcrumbs-current { padding: .125rem .25rem; color: var(--tblr-body-color); font-weight: var(--tblr-font-weight-medium, 500); }
.t-breadcrumbs-separator { display: inline-flex; color: var(--tblr-secondary); opacity: .6; font-size: .75em; }
</style>
