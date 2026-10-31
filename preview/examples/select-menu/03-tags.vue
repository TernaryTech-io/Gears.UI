<!-- TInputTags: Enter or a comma adds a value; Backspace in the empty box removes the last. -->
<script setup lang="ts">
import { ref } from 'vue'

const cities = ref(['Denver', 'Austin'])
</script>

<template>
  <div style="max-width: 28rem">
    <TFormField label="City is any of" :description="JSON.stringify(cities)">
      <TInputTags v-model="cities" placeholder="Type, then Enter" />
    </TFormField>
  </div>
</template>
