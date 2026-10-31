<!-- `variant="cards"` shows each choice as a box, for choices that need their description. -->
<script setup lang="ts">
import { ref } from 'vue'

const provider = ref('PgSql')
const providers = [
  { label: 'PostgreSQL (recommended)', value: 'PgSql', description: 'Relations between records, and schema migrations.' },
  { label: 'SQLite', value: 'SqlLite', description: 'Relations between records, and schema migrations.' },
  { label: 'MongoDB', value: 'MongoDb', description: 'References between records (no joins or cascade delete); owned values.' },
  { label: 'LiteDB', value: 'LiteDb', description: 'Owned values only: no relations between records.' }
]
</script>

<template>
  <TRadioGroup v-model="provider" :items="providers" variant="cards" legend="Database" />
  <div class="small text-secondary mt-2">Value: {{ provider }}</div>
</template>
