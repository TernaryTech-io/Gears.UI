<!-- Groups split by dividers; headings, links, actions, and a destructive item in red. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { DropdownItem } from '@ternarytech-io/gears-ui'

const last = ref('')
const pick = (label: string) => () => { last.value = label }

const items: DropdownItem[][] = [
  [{ type: 'label', label: 'Product' }],
  [
    { label: 'Edit', icon: 'pencil', onSelect: pick('Edit') },
    { label: 'Duplicate', icon: 'copy', onSelect: pick('Duplicate') },
    { label: 'Move to category…', icon: 'folder', description: 'Its data stays in the old table', onSelect: pick('Move') }
  ],
  [{ label: 'Delete', icon: 'trash', color: 'error', onSelect: pick('Delete') }]
]
</script>

<template>
  <div class="d-flex align-items-center gap-3">
    <TDropdown :items="items" label="Actions" />
    <TDropdown :items="items" align="end">
      <TButton icon="dots-vertical" color="neutral" variant="ghost" aria-label="More" />
    </TDropdown>
    <span v-if="last" class="text-secondary">Chose: {{ last }}</span>
  </div>
</template>
