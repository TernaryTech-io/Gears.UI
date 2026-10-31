<!-- `selectable` adds a checkbox to each row, and one in the header for all of them; v-model:selected holds the chosen rows' keys. Clicking a row checks it too. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn } from '@gears/ui'

interface Member { id: number; name: string; email: string; role: string }

const rows: Member[] = [
  { id: 1, name: 'Ada Park', email: 'ada@example.com', role: 'Owner' },
  { id: 2, name: 'Ben Ortiz', email: 'ben@example.com', role: 'Builder' },
  { id: 3, name: 'Cleo Ng', email: 'cleo@example.com', role: 'Editor' },
  { id: 4, name: 'Dev Rao', email: 'dev@example.com', role: 'Viewer' }
]
const columns: TableColumn<Member>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role', sortable: true }
]
const selected = ref<(string | number)[]>([2])
</script>

<template>
  <TCard flush>
    <template #header>
      <h3 class="card-title">Members</h3>
    </template>
    <template #actions>
      <span class="small text-secondary">{{ selected.length }} selected</span>
      <TButton size="sm" color="error" variant="ghost" icon="user-minus" label="Remove" :disabled="!selected.length" />
    </template>
    <TTable v-model:selected="selected" card selectable :columns="columns" :rows="rows" />
  </TCard>
</template>
