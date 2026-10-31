<!-- Far pages fold into “…”. -->
<script setup lang="ts">
import { computed, ref } from 'vue'

const page = ref(4)
const total = 245
const from = computed(() => (page.value - 1) * 10 + 1)
const to = computed(() => Math.min(total, page.value * 10))
</script>

<template>
  <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
    <span class="text-secondary">Showing {{ from }}–{{ to }} of {{ total }}</span>
    <TPagination v-model:page="page" :total="total" />
  </div>
</template>
