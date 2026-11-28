<!-- Files opened over the page, one at a time: previous and next (or the arrow keys), Download, Share and close (or Escape). Share opens the `panel` slot beside the file, for the host's own sharing; Escape closes it first. Each kind's library loads the first time it's shown. -->
<script setup lang="ts">
import { ref } from 'vue'
import type { ViewerFile } from '@ternarytech-io/gears-ui'

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
const panel = ref(false)
const shared = ref('')
</script>

<template>
  <div class="vstack gap-2">
    <div class="list-group">
      <button v-for="(file, i) in files" :key="file.name" type="button" class="list-group-item list-group-item-action" @click="shown = i">{{ file.name }}</button>
    </div>
    <div v-if="shared" class="small text-secondary">Share asked for {{ shared }}.</div>
    <TFileViewer v-model="shown" v-model:panel="panel" :files="files" :share="f => f.name !== 'archive.zip'" @share="f => shared = f.name">
      <template #panel="{ file, close }">
        <div class="p-3 vstack gap-3">
          <div class="d-flex align-items-center"><h3 class="mb-0">Share {{ file.name }}</h3>
            <button type="button" class="btn-close ms-auto" aria-label="Close sharing" @click="close" /></div>
          <p class="text-secondary mb-0">The host's own sharing goes here: who can open the link, when it expires, and the links there are.</p>
        </div>
      </template>
    </TFileViewer>
  </div>
</template>
