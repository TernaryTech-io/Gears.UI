<!-- Buttons joined in a row: each a label and/or an icon, with a tooltip; one can be off. `click` names the button. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ButtonGroupItem } from '@ternarytech-io/gears-ui'

const clicked = ref('nothing yet')
const actions: ButtonGroupItem[] = [
  { value: 'approve', label: 'Approve', icon: 'check' },
  { value: 'hold', label: 'Hold', icon: 'player-pause' },
  { value: 'reject', label: 'Reject', icon: 'x', color: 'error' }
]
const formatting: ButtonGroupItem[] = [
  { value: 'bold', icon: 'bold', tooltip: 'Bold' },
  { value: 'italic', icon: 'italic', tooltip: 'Italic' },
  { value: 'underline', icon: 'underline', tooltip: 'Underline', disabled: true }
]
</script>

<template>
  <div class="vstack gap-3 align-items-start">
    <TButtonGroup :items="actions" label="Ticket actions" @click="item => (clicked = item.value ?? '')" />
    <TButtonGroup :items="formatting" variant="outline" size="sm" label="Formatting" @click="item => (clicked = item.value ?? '')" />
    <div class="small text-secondary">Clicked: <code>{{ clicked }}</code></div>
  </div>
</template>
