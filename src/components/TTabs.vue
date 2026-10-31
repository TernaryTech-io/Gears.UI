<script setup lang="ts">
// Tabs, bound with v-model to the chosen item's value (the first item's when unset). Each tab's
// content goes in a slot named after its value; the default slot gets the chosen item. `segmented`
// is a compact switch between modes (it usually has no content slots); `card` fits the tabs into a
// TCard's header slot.
import { computed } from 'vue'
import TIcon from './TIcon.vue'
import type { TabItem } from '../types'

const props = withDefaults(defineProps<{
  items: TabItem[]
  variant?: 'tabs' | 'pills' | 'segmented'
  size?: 'sm' | 'md'
  card?: boolean
}>(), { variant: 'tabs', size: 'md' })

const model = defineModel<string>()
const current = computed(() => model.value ?? props.items[0]?.value)
const item = computed(() => props.items.find(i => i.value === current.value))
</script>

<template>
  <div>
    <nav :class="['nav', `nav-${variant}`, { 'card-header-tabs': card, 'nav-segmented-sm': variant === 'segmented' && size === 'sm' }]" role="tablist">
      <button v-for="tab in items" :key="tab.value" type="button" role="tab" :class="['nav-link', { active: tab.value === current }]"
        :aria-selected="tab.value === current" :disabled="tab.disabled" @click="model = tab.value">
        <TIcon v-if="tab.icon" :name="tab.icon" :class="variant === 'segmented' ? 'me-1' : 'me-2'" />
        {{ tab.label }}
        <span v-if="tab.badge != null" class="badge bg-secondary-lt ms-2">{{ tab.badge }}</span>
      </button>
    </nav>
    <div v-if="item && ($slots[item.value] || $slots.default)" class="pt-3" role="tabpanel">
      <slot :name="item.value" :item="item">
        <slot :item="item" />
      </slot>
    </div>
  </div>
</template>
