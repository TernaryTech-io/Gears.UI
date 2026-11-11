<!-- Four presets (neutral, success, warning, error), or a custom look: any icon and any color (`accent`). A clickable toast runs `onClick`; `onClose` runs however it closes. -->
<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@ternarytech-io/gears-ui'

const toast = useToast()
const closed = ref(0)
const custom = () => toast.add({ title: 'Release day!', description: 'Version 2.0 is out.', icon: 'confetti', accent: '#ae3ec9', onClose: () => closed.value++ })
const clickable = () => toast.add({
  title: 'New message', description: 'Click to open it.', icon: 'mail', color: 'primary', onClick: () => toast.add({ title: 'Opened.', duration: 2000 })
})
</script>

<template>
  <div class="vstack gap-2 align-items-start">
    <div class="btn-list">
      <TButton color="neutral" variant="soft" label="Neutral" @click="toast.add({ title: 'Synced.', color: 'neutral', icon: 'info-circle' })" />
      <TButton color="success" variant="soft" label="Success" @click="toast.add({ title: 'Ticket saved.', color: 'success', icon: 'circle-check' })" />
      <TButton color="warning" variant="soft" label="Warning"
        @click="toast.add({ title: 'Almost full.', description: '9 of 10 seats taken.', color: 'warning', icon: 'alert-triangle' })" />
      <TButton color="error" variant="soft" label="Error"
        @click="toast.add({ title: 'Not saved.', description: 'The server did not answer.', color: 'error', icon: 'alert-circle' })" />
      <TButton variant="outline" color="neutral" icon="confetti" label="Custom" @click="custom" />
      <TButton variant="outline" color="neutral" label="Clickable" @click="clickable" />
    </div>
    <div class="small text-secondary">Custom toasts closed: {{ closed }}</div>
  </div>
</template>
