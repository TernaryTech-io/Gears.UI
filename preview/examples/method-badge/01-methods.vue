<!-- Each method has its own color; the name is always shown, so the color only helps. Soft is the default. -->
<script setup lang="ts">
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']
</script>

<template>
  <div class="vstack gap-2">
    <div v-for="variant in (['soft', 'solid', 'outline'] as const)" :key="variant" class="d-flex flex-wrap gap-2">
      <TMethodBadge v-for="method in methods" :key="method" :method="method" :variant="variant" />
    </div>
  </div>
</template>
