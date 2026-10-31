<!-- `select` lets people pick countries (v-model:selected); `markers` and `lines` show places and routes. `zoom` adds zooming and dragging. -->
<script setup lang="ts">
import { ref } from 'vue'

const regions = ref<string[]>(['US', 'DE'])
const markers = [
  { name: 'Denver', lat: 39.74, lng: -104.99 },
  { name: 'Frankfurt', lat: 50.11, lng: 8.68 },
  { name: 'Tokyo', lat: 35.68, lng: 139.69 }
]
const lines = [{ from: 'Denver', to: 'Frankfurt' }, { from: 'Frankfurt', to: 'Tokyo' }]
</script>

<template>
  <div class="row g-3">
    <div class="col-lg-8">
      <TVectorMap v-model:selected="regions" select="multiple" :markers="markers" :lines="lines" zoom label="Regions" />
    </div>
    <div class="col-lg-4">
      <div class="subheader mb-2">Selected regions</div>
      <div class="d-flex flex-wrap gap-1">
        <TBadge v-for="code in regions" :key="code" :label="code" />
        <span v-if="!regions.length" class="text-secondary">Click countries to select them.</span>
      </div>
    </div>
  </div>
</template>
