<!-- A corner, or the middle of the top or bottom: each toast's `position`, or the TToaster's for all of them. -->
<script setup lang="ts">
import { useToast, type ToastPosition } from '@ternarytech-io/gears-ui'

const toast = useToast()
const positions: ToastPosition[] = ['top-start', 'top-center', 'top-end', 'bottom-start', 'bottom-center', 'bottom-end']
</script>

<template>
  <div class="btn-list">
    <TButton v-for="p in positions" :key="p" variant="outline" color="neutral" :label="p"
      @click="toast.add({ title: `At ${p}`, icon: 'layout', position: p, duration: 3000 })" />
  </div>
</template>
