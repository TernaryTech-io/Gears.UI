<!-- A destructive confirmation. While it works, it can't be dismissed. -->
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const deleting = ref(false)

function remove() {
  deleting.value = true
  setTimeout(() => { deleting.value = false; open.value = false }, 1500)
}
</script>

<template>
  <TButton color="error" variant="soft" icon="trash" label="Delete project" @click="open = true" />
  <TModal v-model:open="open" size="sm" :dismissible="!deleting" title="Delete Online Shop?">
    <p class="mb-0">The project, its environments and their data are deleted. This can't be undone.</p>
    <template #footer="{ close }">
      <TButton color="neutral" variant="ghost" label="Cancel" :disabled="deleting" @click="close" />
      <TButton color="error" label="Delete" :loading="deleting" @click="remove" />
    </template>
  </TModal>
</template>
