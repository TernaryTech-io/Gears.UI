<!-- An editable editor with completions (type “Pro” or “SEL”). Ctrl+Enter emits `run`. Monaco loads the first time an editor is shown. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { CodeCompletion } from '@gears/ui'

const sql = ref('SELECT "Name", "Price"\nFROM "Catalog_Product"\nWHERE "Stock" < 10\nORDER BY "Name"')
const ran = ref('')
const completions: CodeCompletion[] = [
  { label: 'Product', kind: 'table', detail: 'Catalog' },
  { label: 'Customer', kind: 'table', detail: 'Customers' },
  { label: 'Price', kind: 'field', detail: 'Decimal' },
  { label: 'Stock', kind: 'field', detail: 'Integer' },
  ...['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'LIMIT'].map(k => ({ label: k, kind: 'keyword' as const }))
]
</script>

<template>
  <div class="vstack gap-2">
    <TCodeEditor v-model="sql" language="sql" :completions="completions" label="Query" style="height: 12rem"
      @run="ran = new Date().toLocaleTimeString()" />
    <div class="small text-secondary">{{ ran ? `Ctrl+Enter at ${ran}` : 'Press Ctrl+Enter in the editor.' }}</div>
  </div>
</template>
