<!-- `multiple` picks several; the menu stays open while you choose. -->
<script setup lang="ts">
import { ref } from 'vue'

const columns = ref<string[]>(['Name', 'Price'])
</script>

<template>
  <div style="max-width: 24rem">
    <TFormField label="Columns" :description="columns.length ? JSON.stringify(columns) : 'All columns'">
      <TSelectMenu v-model="columns" :items="['Id', 'Name', 'Sku', 'Price', 'Stock', 'Active', 'Added']" multiple placeholder="All columns" />
    </TFormField>
  </div>
</template>
