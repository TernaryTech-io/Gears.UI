<!-- Checking a parent checks its children; a parent with some children checked is partly checked. v-model is the checked leaves. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { TreeItem } from '@ternarytech-io/gears-ui'

const items: TreeItem[] = [
  { label: 'Fruit', value: 'fruit', children: [{ label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' }, { label: 'Cherry', value: 'cherry' }] },
  { label: 'Vegetables', value: 'vegetables', children: [
    { label: 'Leaves', value: 'leaves', children: [{ label: 'Kale', value: 'kale' }, { label: 'Spinach', value: 'spinach' }] },
    { label: 'Carrot', value: 'carrot' }
  ] },
  { label: 'Bread', value: 'bread' }
]
const checked = ref<string[]>(['apple', 'kale'])
</script>

<template>
  <TFormField label="Shopping" :description="`v-model: ${checked.join(', ') || 'nothing'}`">
    <TCheckboxTree v-model="checked" :items="items" label="Shopping" />
  </TFormField>
</template>
