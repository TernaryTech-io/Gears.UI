<!-- Each tab's content goes in a slot named after its value. -->
<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('fields')
const items = [
  { label: 'Fields', value: 'fields', icon: 'list', badge: 6 },
  { label: 'Relations', value: 'relations', icon: 'link' },
  { label: 'Code', value: 'code', icon: 'code' },
  { label: 'Indexes', value: 'indexes', disabled: true }
]
</script>

<template>
  <TTabs v-model="tab" :items="items">
    <template #fields><p class="mb-0">Name, Price, Stock, Sku, Description, Active.</p></template>
    <template #relations><p class="mb-0">Product has many OrderLines.</p></template>
    <template #code><code>public class Product : DbModel { … }</code></template>
  </TTabs>
</template>
