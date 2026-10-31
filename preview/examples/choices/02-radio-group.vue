<!-- One choice from a few, all visible. -->
<script setup lang="ts">
import { ref } from 'vue'

const kind = ref('Development')
const delete_ = ref<'keep' | 'drop'>('keep')
</script>

<template>
  <div class="row g-4">
    <div class="col-md-6">
      <TRadioGroup v-model="kind" legend="Environment" :items="['Development', 'Staging', 'Production']" orientation="horizontal" />
      <div class="text-secondary small">Value: {{ kind }}</div>
    </div>
    <div class="col-md-6">
      <TRadioGroup v-model="delete_" legend="When the model is deleted" :items="[
        { label: 'Keep the table', value: 'keep', description: 'The data stays; you can remove it later.' },
        { label: 'Drop the table', value: 'drop', description: 'The data is deleted with the model.' }
      ]" />
    </div>
  </div>
</template>
