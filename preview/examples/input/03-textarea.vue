<!-- `autoresize` grows the textarea with its text. -->
<script setup lang="ts">
import { ref } from 'vue'

const notes = ref('Products have a name, a price and a stock count.\nOrders belong to a customer.')
</script>

<template>
  <TFormField label="Description" :hint="`${notes.length} characters`">
    <TTextarea v-model="notes" autoresize :rows="2" />
  </TFormField>
</template>
