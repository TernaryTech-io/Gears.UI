<!-- `inline` shows the calendar in place, here with week numbers and weeks starting on Monday. -->
<script setup lang="ts">
import { ref } from 'vue'

const day = ref<string | null>('2026-11-14')
</script>

<template>
  <div class="d-flex flex-wrap align-items-start gap-4">
    <TDatePicker v-model="day" inline week-numbers :first-weekday="1" />
    <div>
      <div class="subheader">Chosen</div>
      <div class="h2">{{ day ?? '—' }}</div>
    </div>
  </div>
</template>
