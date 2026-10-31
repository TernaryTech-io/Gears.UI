<script setup lang="ts" generic="T">
// A compact list of things to choose from, for a section's side panel (TSectionLayout): files,
// saved queries, models. An optional heading above; v-model is the chosen item's value.
import TIcon from './TIcon.vue'
import type { PanelListItem } from '../types'

defineProps<{ items: PanelListItem<T>[]; heading?: string; empty?: string }>()

const model = defineModel<T>()
const emit = defineEmits<{ select: [item: PanelListItem<T>] }>()

function choose(item: PanelListItem<T>) {
  model.value = item.value
  emit('select', item)
}
</script>

<template>
  <div class="t-panel-list">
    <div v-if="heading" class="t-panel-list-heading">{{ heading }}</div>
    <p v-if="!items.length && empty" class="t-panel-list-empty">{{ empty }}</p>
    <button v-for="(item, i) in items" :key="i" type="button" :title="item.title"
      :class="['t-panel-list-item', { active: item.value === model }]" :aria-current="item.value === model || undefined" @click="choose(item)">
      <TIcon v-if="item.icon" :name="item.icon" class="t-panel-list-icon" />
      <span class="text-truncate flex-fill">{{ item.label }}</span>
      <span v-if="item.trailing" class="t-panel-list-trailing">{{ item.trailing }}</span>
    </button>
  </div>
</template>
