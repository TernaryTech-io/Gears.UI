<!-- Loading and empty states, and clickable rows. -->
<script setup lang="ts">
import { ref } from 'vue'

const state = ref<'rows' | 'loading' | 'empty'>('rows')
const chosen = ref('')
const rows = [{ id: 1, name: 'Jordan Diaz', role: 'Owner' }, { id: 2, name: 'Alex Brown', role: 'Developer' }]
</script>

<template>
  <div class="vstack gap-3">
    <TTabs v-model="state" variant="pills" :items="[{ label: 'Rows', value: 'rows' }, { label: 'Loading', value: 'loading' }, { label: 'Empty', value: 'empty' }]" />
    <TCard flush>
      <TTable card clickable :loading="state === 'loading'" :rows="state === 'rows' ? rows : []"
        :columns="[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]" empty="No members yet."
        @select="row => chosen = row.name" />
    </TCard>
    <span v-if="chosen" class="text-secondary">Clicked: {{ chosen }}</span>
  </div>
</template>
