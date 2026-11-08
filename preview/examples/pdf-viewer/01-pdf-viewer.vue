<!-- A PDF drawn by PDF.js: pages, zoom (fit width, fit page or a percent), download and open in a new tab. `v-model:page` is the page shown. -->
<script setup lang="ts">
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <div class="vstack gap-2">
    <TPdfViewer v-model:page="page" src="/sample.pdf" file-name="Sample.pdf" :height="520" label="Sample document" />
    <div class="small text-secondary">On page {{ page }}.</div>
  </div>
</template>
