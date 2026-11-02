<script setup lang="ts">
// Tabler's datagrid: labels and their values, for detail panels and summaries, in a grid that fits
// as many columns as there's room for. `horizontal` puts each label beside its value; `cols` fixes
// the columns (1 to 4); `itemWidth`, `titleWidth` and `gap` set Tabler's datagrid variables. The
// pairs come from `items` (a slot named by an item's `key` draws its value; `copy` adds a copy
// button; an empty value is a dash) or from TDataGridItem children. It's a description list, so
// screen readers keep each label with its value.
import { computed } from 'vue'
import TDataGridItem from './TDataGridItem.vue'
import type { DataGridItem } from '../types'

const props = defineProps<{
  items?: DataGridItem[]
  horizontal?: boolean
  cols?: 1 | 2 | 3 | 4
  // The narrowest a column gets (Tabler's default is 15rem); lower fits more short values in a row.
  itemWidth?: string
  // The label's width when `horizontal` (Tabler's default is 10rem).
  titleWidth?: string
  // Between items, across and down (Tabler's default is 1.5rem).
  gap?: string
}>()

const style = computed(() => ({
  '--tblr-datagrid-item-width': props.itemWidth,
  '--tblr-datagrid-title-width': props.titleWidth,
  '--tblr-datagrid-padding': props.gap
}))
</script>

<template>
  <dl :class="['datagrid mb-0', { 'datagrid-horizontal': horizontal }, cols && `datagrid-cols-${cols}`]" :style="style">
    <template v-for="(item, i) in items ?? []" :key="item.key ?? `${i}-${item.label}`">
      <TDataGridItem v-if="item.key && $slots[item.key]" :label="item.label" :copy="item.copy">
        <slot :name="item.key" :item="item" />
      </TDataGridItem>
      <TDataGridItem v-else :label="item.label" :value="item.value" :copy="item.copy" />
    </template>
    <slot />
  </dl>
</template>
