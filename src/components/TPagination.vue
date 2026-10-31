<script setup lang="ts">
// Page numbers for a long list, bound with v-model:page (from 1). Far pages fold into "…".
import { computed } from 'vue'
import TIcon from './TIcon.vue'

const props = withDefaults(defineProps<{ total: number; itemsPerPage?: number; siblings?: number; size?: 'sm' | 'md' }>(),
  { itemsPerPage: 10, siblings: 1, size: 'md' })

const page = defineModel<number>('page', { default: 1 })
const count = computed(() => Math.max(1, Math.ceil(props.total / props.itemsPerPage)))

const pages = computed<(number | '…')[]>(() => {
  const last = count.value
  const from = Math.max(2, page.value - props.siblings)
  const to = Math.min(last - 1, page.value + props.siblings)
  const result: (number | '…')[] = [1]
  if (from > 2) result.push('…')
  for (let p = from; p <= to; p++) result.push(p)
  if (to < last - 1) result.push('…')
  if (last > 1) result.push(last)
  return result
})

const go = (p: number) => { page.value = Math.min(count.value, Math.max(1, p)) }
</script>

<template>
  <ul :class="['pagination m-0', size === 'sm' && 'pagination-sm']">
    <li :class="['page-item', { disabled: page <= 1 }]">
      <button type="button" class="page-link" aria-label="Previous page" :disabled="page <= 1" @click="go(page - 1)">
        <TIcon name="chevron-left" />
      </button>
    </li>
    <li v-for="(p, i) in pages" :key="i" :class="['page-item', { active: p === page, disabled: p === '…' }]">
      <span v-if="p === '…'" class="page-link">…</span>
      <button v-else type="button" class="page-link" :aria-current="p === page ? 'page' : undefined" @click="go(p)">{{ p }}</button>
    </li>
    <li :class="['page-item', { disabled: page >= count }]">
      <button type="button" class="page-link" aria-label="Next page" :disabled="page >= count" @click="go(page + 1)">
        <TIcon name="chevron-right" />
      </button>
    </li>
  </ul>
</template>
