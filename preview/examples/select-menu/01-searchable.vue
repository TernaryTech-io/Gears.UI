<!-- A search box over a long list; grouped items show under their group. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { SelectItem } from '@ternarytech-io/gears-ui'

const model = ref<string | null>('Product')
const items: SelectItem<string>[] = [
  { label: 'Product', value: 'Product', group: 'Catalog' },
  { label: 'Brand', value: 'Brand', group: 'Catalog' },
  { label: 'Customer', value: 'Customer', group: 'Customers' },
  { label: 'Address', value: 'Address', group: 'Customers' },
  { label: 'Order', value: 'Order', group: 'Orders' },
  { label: 'OrderLine', value: 'OrderLine', group: 'Orders' },
  { label: 'Invoice', value: 'Invoice', group: 'Orders', description: 'Not built yet', disabled: true }
]
</script>

<template>
  <div class="row g-3">
    <div class="col-md-5">
      <TFormField label="Model" :description="`Value: ${model}`">
        <TSelectMenu v-model="model" :items="items" placeholder="Choose a model" />
      </TFormField>
    </div>
    <div class="col-md-5">
      <TFormField label="The same list in a native select" description="TSelect groups items too.">
        <TSelect v-model="model" :items="items" />
      </TFormField>
    </div>
  </div>
</template>
