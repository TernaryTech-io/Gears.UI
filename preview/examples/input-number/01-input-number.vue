<!-- Minus and plus step within `min` and `max` (hold to repeat); so do the arrow keys, Home and End. The model is a number, or null when empty. -->
<script setup lang="ts">
import { ref } from 'vue'

const pageSize = ref<number | null>(25)
const order = ref<number | null>(3)
const price = ref<number | null>(19.5)
const empty = ref<number | null>(null)
</script>

<template>
  <div class="row g-3">
    <div class="col-md-3">
      <TFormField label="Rows per page" :description="`1 to 1000 · ${JSON.stringify(pageSize)}`">
        <TInputNumber v-model="pageSize" :min="1" :max="1000" />
      </TFormField>
    </div>
    <div class="col-md-3">
      <TFormField label="Order" :description="JSON.stringify(order)">
        <TInputNumber v-model="order" :min="0" size="sm" />
      </TFormField>
    </div>
    <div class="col-md-3">
      <TFormField label="Price" :description="`Steps of 0.5 · ${JSON.stringify(price)}`">
        <TInputNumber v-model="price" :min="0" :step="0.5" />
      </TFormField>
    </div>
    <div class="col-md-3">
      <TFormField label="Empty, then disabled" :description="JSON.stringify(empty)">
        <div class="vstack gap-2">
          <TInputNumber v-model="empty" placeholder="None" />
          <TInputNumber :model-value="5" disabled />
        </div>
      </TFormField>
    </div>
  </div>
</template>
