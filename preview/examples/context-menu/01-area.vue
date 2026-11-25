<!-- Right-click the area, or focus it and press the Menu key or Shift+F10: shortcuts, a submenu, and a disabled item that says why. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ContextMenuItem } from '@ternarytech-io/gears-ui'

const last = ref('')
const pick = (label: string) => () => { last.value = label }
const items: ContextMenuItem[][] = [
  [
    { label: 'Open', icon: 'external-link', kbd: 'Enter', onSelect: pick('Open') },
    { label: 'Download', icon: 'download', onSelect: pick('Download') }
  ],
  [
    { label: 'Rename', icon: 'pencil', kbd: 'F2', onSelect: pick('Rename') },
    {
      label: 'Set file type', icon: 'file-description', children: [
        { label: 'Contract', onSelect: pick('Contract') },
        { label: 'Invoice', onSelect: pick('Invoice') },
        { label: 'Unclassified', onSelect: pick('Unclassified') }
      ]
    },
    { label: 'Move to…', icon: 'folder-share', disabled: true, reason: 'The storage is read-only' }
  ],
  [{ label: 'Delete', icon: 'trash', color: 'error', kbd: 'Del', onSelect: pick('Delete') }]
]
</script>

<template>
  <div class="vstack gap-2">
    <TContextMenu :items="items" class="border border-dashed rounded p-4 text-center text-secondary" tabindex="0">
      Right-click here
    </TContextMenu>
    <span v-if="last" class="small text-secondary">Chose: {{ last }}</span>
  </div>
</template>
