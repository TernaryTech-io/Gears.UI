<!-- `useToast().add({ title, description, color, icon })` shows a notice in the corner; it closes by itself after 5 seconds. The app's frame has one TToaster. -->
<script setup lang="ts">
import { useToast } from '@gears/ui'

const toast = useToast()
</script>

<template>
  <div class="btn-list">
    <TButton color="success" variant="soft" icon="check" label="Saved" @click="toast.add({ title: 'Product saved.', color: 'success', icon: 'check' })" />
    <TButton color="error" variant="soft" icon="alert-circle" label="Failed"
      @click="toast.add({ title: 'The record could not be deleted.', description: 'Another record still refers to it.', color: 'error', icon: 'alert-circle' })" />
    <TButton color="neutral" variant="soft" icon="player-stop" label="Neutral" @click="toast.add({ title: 'Stopped the Development app.', color: 'neutral', icon: 'player-stop' })" />
    <TButton color="neutral" variant="outline" label="Stays until closed" @click="toast.add({ title: 'Promoted to Production.', color: 'success', icon: 'rocket', duration: 0 })" />
  </div>
</template>
