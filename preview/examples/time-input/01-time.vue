<!-- A time of day, typed or picked from a list at `step` minutes. The model is always 24-hour "HH:mm" ("HH:mm:ss" with `seconds`), however it's shown. -->
<script setup lang="ts">
import { ref } from 'vue'

const start = ref<string | null>('09:30')
const meeting = ref<string | null>('14:00')
const precise = ref<string | null>('07:15:30')
</script>

<template>
  <div class="row g-3">
    <div class="col-md-4">
      <TFormField label="Start (24 hours)" :description="`Value: ${start}`">
        <TTimeInput v-model="start" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="Meeting (12 hours, every 15 minutes)" :description="`Value: ${meeting}`">
        <TTimeInput v-model="meeting" hour12 :step="15" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="With seconds, typed only" :description="`Value: ${precise}`">
        <TTimeInput v-model="precise" seconds :step="null" />
      </TFormField>
    </div>
  </div>
</template>
