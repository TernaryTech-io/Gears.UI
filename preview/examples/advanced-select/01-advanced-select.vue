<!-- Type to filter; descriptions are searched too. Icons or avatar initials show beside the labels. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { AdvancedSelectItem } from '@gears/ui'

const owner = ref<number | null>(2)
const people: AdvancedSelectItem<number>[] = [
  { label: 'Jordan Diaz', value: 1, avatar: 'JD', description: 'Owner' },
  { label: 'Alex Brown', value: 2, avatar: 'AB', description: 'Developer' },
  { label: 'Casey Dunn', value: 3, avatar: 'CD', description: 'Viewer' },
  { label: 'Morgan Lee', value: 4, avatar: 'ML', description: 'Developer' }
]
const kind = ref<string | null>('Text')
const kinds: AdvancedSelectItem<string>[] = [
  { label: 'Text', value: 'Text', icon: 'letter-case', group: 'Values' },
  { label: 'Number', value: 'Number', icon: '123', group: 'Values' },
  { label: 'Date', value: 'Date', icon: 'calendar', group: 'Values' },
  { label: 'Yes / no', value: 'Boolean', icon: 'toggle-left', group: 'Values' },
  { label: 'Has one', value: 'HasOne', icon: 'link', group: 'Relations' },
  { label: 'Has many', value: 'HasMany', icon: 'list-tree', group: 'Relations' }
]
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TFormField label="Owner" :description="`Value: ${owner} (${typeof owner})`">
        <TAdvancedSelect v-model="owner" :items="people" placeholder="Choose a person" />
      </TFormField>
    </div>
    <div class="col-md-6">
      <TFormField label="Property kind" :description="`Value: ${kind}`">
        <TAdvancedSelect v-model="kind" :items="kinds" />
      </TFormField>
    </div>
  </div>
</template>
