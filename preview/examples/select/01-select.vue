<!-- Items are values or { label, value } objects. Values keep their type: a number stays a number. -->
<script setup lang="ts">
import { ref } from 'vue'

const provider = ref('SQLite')
const role = ref<number | null>(2)
const roles = [
  { label: 'Owner', value: 1 },
  { label: 'Developer', value: 2 },
  { label: 'Viewer', value: 3 },
  { label: 'Billing (soon)', value: 4, disabled: true }
]
const empty = ref<string | null>(null)
</script>

<template>
  <div class="row g-3">
    <div class="col-md-4">
      <TFormField label="Data source" :description="`Value: ${provider}`">
        <TSelect v-model="provider" :items="['SQLite', 'PostgreSQL', 'SQL Server', 'MySQL', 'MongoDB', 'LiteDB']" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="Role" :description="`Value: ${role} (${typeof role})`">
        <TSelect v-model="role" :items="roles" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="Category" :error="empty ? undefined : 'Choose a category.'">
        <TSelect v-model="empty" :items="['Catalog', 'Customers', 'Orders']" placeholder="Choose…" />
      </TFormField>
    </div>
  </div>
</template>
