<!-- Any language Monaco knows; switching it keeps the text. -->
<script setup lang="ts">
import { ref } from 'vue'

const language = ref('json')
const samples: Record<string, string> = {
  json: '{\n  "find": "Orders_Order",\n  "filter": { "Paid": false },\n  "sort": { "Placed": -1 }\n}',
  sql: 'SELECT COUNT(*) FROM "Orders_Order" WHERE "Paid" = 0',
  csharp: 'var unpaid = db.Orders.Where(o => !o.Paid).Count();'
}
const text = ref(samples.json)
const choose = (value?: string) => { language.value = value ?? 'json'; text.value = samples[language.value] }
</script>

<template>
  <div class="vstack gap-2">
    <TTabs :model-value="language" variant="segmented" size="sm" :items="[{ label: 'JSON', value: 'json' }, { label: 'SQL', value: 'sql' }, { label: 'C#', value: 'csharp' }]"
      @update:model-value="choose" />
    <TCodeEditor v-model="text" :language="language" style="height: 9rem" />
  </div>
</template>
