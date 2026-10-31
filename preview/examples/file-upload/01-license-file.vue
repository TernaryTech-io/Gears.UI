<!-- One file, read in the page: the Studio's license step. Files that don't match `accept` are left out. -->
<script setup lang="ts">
import { ref, watch } from 'vue'

const file = ref<File | null>(null)
const text = ref('')
const rejected = ref('')

watch(file, async value => {
  text.value = value ? await value.text() : ''
})
</script>

<template>
  <div class="vstack gap-2" style="max-width: 32rem">
    <TFileUpload v-model="file" accept=".ternary-license,.txt" label="Drop the license file here" description="A .ternary-license or .txt file"
      @rejected="files => rejected = `${files.map(f => f.name).join(', ')} isn't a license file.`" />
    <TAlert v-if="rejected" color="warning" :description="rejected" dismissible class="mb-0" @close="rejected = ''" />
    <TTextarea v-model="text" placeholder="…or paste the license here" :rows="3" class="font-monospace small" aria-label="License text" />
  </div>
</template>
