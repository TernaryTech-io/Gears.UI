<!-- Without a `url`, files are only collected: v-model holds the accepted ones for a form to send. -->
<script setup lang="ts">
import { ref } from 'vue'

const files = ref<File[]>([])
</script>

<template>
  <div class="vstack gap-2">
    <TDropzone v-model="files" accept="image/*,.pdf,.csv" :max-filesize="5" hint="Images, PDF or CSV, up to 5 MB" />
    <div class="d-flex align-items-center justify-content-between">
      <span class="text-secondary small">{{ files.length ? files.map(f => f.name).join(', ') : 'No files yet' }}</span>
      <TButton v-if="files.length" size="sm" color="neutral" variant="ghost" icon="trash" label="Clear" @click="files = []" />
    </div>
  </div>
</template>
