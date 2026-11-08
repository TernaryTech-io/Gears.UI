<!-- Always shown: click, or use the arrow keys and Space. With `multiple`, choose several; `searchable` adds a search. -->
<script setup lang="ts">
import { ref } from 'vue'

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']
const one = ref<string | null>('Cherry')
const several = ref<string[]>(['red', 'blue'])
const colors = [
  { label: 'Red', value: 'red', description: 'Warm' }, { label: 'Green', value: 'green' }, { label: 'Blue', value: 'blue', description: 'Cool' },
  { label: 'Purple', value: 'purple' }, { label: 'Orange', value: 'orange', disabled: true }
]
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TFormField label="One fruit" :description="`v-model: ${one}`">
        <TListBox v-model="one" :items="fruits" searchable />
      </TFormField>
    </div>
    <div class="col-md-6">
      <TFormField label="Colors" :description="`v-model: ${several.join(', ')}`">
        <TListBox v-model="several" :items="colors" multiple />
      </TFormField>
    </div>
  </div>
</template>
