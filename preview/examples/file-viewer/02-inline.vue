<!-- `inline` shows the viewer in its box, always open: for a page that shows one file, such as a shared link. -->
<script setup lang="ts">
import type { ViewerFile } from '@ternarytech-io/gears-ui/plugins'

const files: ViewerFile[] = [
  { name: 'expenses.xlsx', src: '/viewer/expenses.xlsx', size: 9141 },
  { name: 'README.md', src: '/viewer/README.md', size: 720, download: false }
]
</script>

<template>
  <TFileViewer :files="files" inline :height="420" />
</template>
