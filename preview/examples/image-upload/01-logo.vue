<!-- A square logo, 128×128 to 768×768. Images that don't fit are refused, with the reason. -->
<script setup lang="ts">
import { ref } from 'vue'

const logo = ref<File | string | null>(null)
const refused = ref('')
</script>

<template>
  <TFormField label="Logo" description="Shown in the app's navigation.">
    <TImageUpload v-model="logo" square :min-size="128" :max-size="768" @rejected="reason => refused = reason" />
  </TFormField>
  <p v-if="refused" class="small text-secondary mt-2 mb-0">Last refused: {{ refused }}</p>
</template>
