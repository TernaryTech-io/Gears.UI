<!-- `min` and `max` limit the list; a typed time outside them shows as invalid. -->
<script setup lang="ts">
import { ref } from 'vue'

const opening = ref<string | null>('08:00')
</script>

<template>
  <div class="row g-3">
    <div class="col-md-4">
      <TFormField label="Office hours, 08:00 to 18:00" :description="`Value: ${opening}`">
        <TTimeInput v-model="opening" min="08:00" max="18:00" :step="60" hour12 size="sm" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="Disabled">
        <TTimeInput model-value="12:00" disabled />
      </TFormField>
    </div>
  </div>
</template>
