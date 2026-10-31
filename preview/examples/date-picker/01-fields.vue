<!-- A date, a range (from and to), and several dates. The model keeps `YYYY-MM-DD`; `format` changes only what the field shows. -->
<script setup lang="ts">
import { ref } from 'vue'

const due = ref<string | null>('2026-11-14')
const range = ref<string[]>(['2026-11-02', '2026-11-06'])
const holidays = ref<string[]>([])
</script>

<template>
  <div class="row g-3">
    <div class="col-md-4">
      <TFormField label="Due date" :description="`Value: ${due}`">
        <TDatePicker v-model="due" format="DD.MM.YYYY" placeholder="Pick a date" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="Sprint" :description="JSON.stringify(range)">
        <TDatePicker v-model="range" mode="range" :months="2" placeholder="From – to" />
      </TFormField>
    </div>
    <div class="col-md-4">
      <TFormField label="Days off" :description="holidays.length ? `${holidays.length} chosen` : 'None yet'">
        <TDatePicker v-model="holidays" mode="multiple" min="2026-11-01" placeholder="Pick days" />
      </TFormField>
    </div>
  </div>
</template>
