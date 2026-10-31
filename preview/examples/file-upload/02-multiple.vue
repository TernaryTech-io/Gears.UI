<!-- `multiple` collects several; each can be removed. -->
<script setup lang="ts">
import { ref } from 'vue'

const files = ref<File[]>([])
</script>

<template>
  <div style="max-width: 32rem">
    <TFormField label="Attachments" :description="`${files.length} chosen`">
      <TFileUpload v-model="files" multiple icon="paperclip" label="Drop files or click to add them" />
    </TFormField>
  </div>
</template>
