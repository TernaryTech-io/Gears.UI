<script setup lang="ts">
// One label and its value in a TDataGrid. The value is `value`, or the slot for anything else (a
// status, a badge, avatars, a progress bar, a field); empty, it's written as a dash so it doesn't
// look missing. `copy` adds a button that copies the value.
import { computed } from 'vue'
import TCopyButton from './TCopyButton.vue'

const props = defineProps<{ label: string; value?: string | number | boolean | null; copy?: boolean }>()

const text = computed(() => props.value == null || props.value === '' ? '' : typeof props.value === 'boolean' ? (props.value ? 'Yes' : 'No') : String(props.value))
</script>

<template>
  <div class="datagrid-item">
    <dt class="datagrid-title">{{ label }}</dt>
    <dd :class="['datagrid-content mb-0', { 'd-flex align-items-center gap-2': copy }]">
      <slot v-if="$slots.default" />
      <template v-else-if="copy && text"><code class="text-break">{{ text }}</code></template>
      <template v-else>{{ text || '–' }}</template>
      <TCopyButton v-if="copy && text" :text="text" icon-only size="sm" variant="ghost" :label="`Copy the ${label.toLowerCase()}`" />
    </dd>
  </div>
</template>
