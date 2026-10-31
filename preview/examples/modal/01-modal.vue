<!-- v-model:open shows and hides it. The footer slot gets `close`. -->
<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const name = ref('')
</script>

<template>
  <TButton icon="plus" label="New category" @click="open = true" />
  <TModal v-model:open="open" title="New category" description="Categories group related models.">
    <TFormField label="Name" required>
      <TInput v-model="name" placeholder="Catalog" autofocus />
    </TFormField>
    <template #footer="{ close }">
      <TButton color="neutral" variant="ghost" label="Cancel" @click="close" />
      <TButton label="Create" :disabled="!name" @click="close" />
    </template>
  </TModal>
</template>
