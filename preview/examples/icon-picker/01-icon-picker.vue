<!-- Every Tabler icon, by name: open the field, search ("arrow up" finds arrow-big-up), and choose. -->
<script setup lang="ts">
import { ref } from 'vue'

const icon = ref<string | null>('mail')
const empty = ref<string | null>(null)
</script>

<template>
  <div class="row g-3">
    <div class="col-md-6">
      <TFormField label="Icon" :description="icon ? `v-model: ${icon}` : 'No icon'">
        <TIconPicker v-model="icon" />
      </TFormField>
    </div>
    <div class="col-md-6">
      <TFormField label="Small, nothing chosen yet">
        <TIconPicker v-model="empty" size="sm" placeholder="None" />
      </TFormField>
    </div>
    <div class="col-12">
      <TInput :icon="icon ?? undefined" placeholder="An input with the chosen icon" />
    </div>
  </div>
</template>
