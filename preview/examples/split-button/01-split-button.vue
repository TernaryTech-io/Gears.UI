<!-- A main action, with the others in a menu: groups split by dividers, icons, one off, one in the error color. `click` is the main action; `select` the item chosen. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { DropdownItem } from '@ternarytech-io/gears-ui'

const did = ref('nothing yet')
const items: DropdownItem[][] = [
  [{ label: 'Save as draft', icon: 'file-pencil' }, { label: 'Save and close', icon: 'door-exit' }, { label: 'Schedule…', icon: 'clock', disabled: true }],
  [{ label: 'Discard changes', icon: 'trash', color: 'error' }]
]
</script>

<template>
  <div class="vstack gap-3 align-items-start">
    <TSplitButton label="Save" icon="device-floppy" :items="items" @click="did = 'Save'" @select="item => (did = item.label ?? '')" />
    <div class="d-flex flex-wrap gap-2">
      <TSplitButton label="Deploy" :items="[{ label: 'To Staging' }, { label: 'To Production' }]" color="success" variant="soft" size="sm"
        @click="did = 'Deploy'" @select="item => (did = item.label ?? '')" />
      <TSplitButton label="Export" icon="download" :items="[{ label: 'CSV' }, { label: 'Excel' }]" color="neutral" variant="outline"
        @click="did = 'Export'" @select="item => (did = `Export ${item.label}`)" />
      <TSplitButton label="Archive" :items="[{ label: 'Archive all' }]" disabled />
    </div>
    <TSplitButton label="Full width" :items="[{ label: 'Another' }]" block />
    <div class="small text-secondary">Did: <code>{{ did }}</code></div>
  </div>
</template>
