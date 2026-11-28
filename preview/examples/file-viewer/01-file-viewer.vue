<!-- Files opened over the page, one at a time: previous and next (or the arrow keys), Download, Share (the host's own dialog) and close (or Escape). Each kind's library loads the first time it's shown. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ViewerFile } from '@ternarytech-io/gears-ui/plugins'

const files: ViewerFile[] = [
  { name: 'Sample.pdf', src: '/sample.pdf', size: 13264 },
  { name: 'expense-report.docx', src: '/viewer/expense-report.docx', size: 2354 },
  { name: 'expenses.xlsx', src: '/viewer/expenses.xlsx', size: 9141 },
  { name: 'expenses.csv', src: '/viewer/expenses.csv', size: 2493 },
  { name: 'README.md', src: '/viewer/README.md', size: 720 },
  { name: 'settings.json', src: '/viewer/settings.json', size: 167 },
  { name: 'gears-logo.png', src: '/gears-logo.png' },
  { name: 'archive.zip', src: '/missing.zip', size: 4_200_000 }
]
const shown = ref<number | null>(null)
const shared = ref('')
</script>

<template>
  <div class="vstack gap-2">
    <div class="list-group">
      <button v-for="(file, i) in files" :key="file.name" type="button" class="list-group-item list-group-item-action" @click="shown = i">{{ file.name }}</button>
    </div>
    <div v-if="shared" class="small text-secondary">Share asked for {{ shared }}.</div>
    <TFileViewer v-model="shown" :files="files" share @share="f => shared = f.name" />
  </div>
</template>
