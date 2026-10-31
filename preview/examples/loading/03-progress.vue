<!-- With a value it shows how far along; without one, ongoing work of unknown length. -->
<script setup lang="ts">
import { ref } from 'vue'

const value = ref(40)
</script>

<template>
  <div class="vstack gap-3">
    <TProgress :value="value" label="Upload" />
    <input v-model.number="value" type="range" class="form-range" min="0" max="100" aria-label="Value">
    <TProgress :value="3" :max="5" color="success" size="sm" label="Seats" />
    <TProgress color="info" size="sm" label="Building" />
  </div>
</template>
