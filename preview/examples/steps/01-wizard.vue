<!-- The New project wizard's progress. Steps already done can be clicked to go back. -->
<script setup lang="ts">
import { ref } from 'vue'

const step = ref(1)
const items = [
  { title: 'Details', description: 'Name and namespace' },
  { title: 'Data source', description: 'Where the data lives' },
  { title: 'Members', description: 'Who works on it' },
  { title: 'Review' }
]
</script>

<template>
  <div class="vstack gap-4">
    <TSteps v-model="step" :items="items" />
    <div class="d-flex justify-content-between">
      <TButton color="neutral" variant="ghost" icon="arrow-left" label="Back" :disabled="step === 0" @click="step--" />
      <TButton :label="step === items.length - 1 ? 'Create project' : 'Next'" :trailing-icon="step === items.length - 1 ? undefined : 'arrow-right'"
        @click="step = Math.min(items.length - 1, step + 1)" />
    </div>
  </div>
</template>
