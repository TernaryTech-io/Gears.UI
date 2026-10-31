<!-- One handle for a number; two for a range when the model is [from, to]. -->
<script setup lang="ts">
import { ref } from 'vue'

const pageSize = ref(25)
const price = ref<[number, number]>([20, 80])
const opacity = ref(0.6)
</script>

<template>
  <div class="vstack gap-4" style="max-width: 32rem">
    <TFormField label="Rows per page" :hint="String(pageSize)">
      <TRangeSlider v-model="pageSize" :min="5" :max="100" :step="5" label="Rows per page" />
    </TFormField>
    <TFormField label="Price" :hint="`$${price[0]} – $${price[1]}`">
      <TRangeSlider v-model="price" :max="200" tooltips label="Price" />
    </TFormField>
    <TFormField label="Opacity" :hint="String(opacity)">
      <TRangeSlider v-model="opacity" :max="1" :step="0.1" label="Opacity" />
    </TFormField>
  </div>
</template>
