<!-- The Studio's app output: lines with times and levels. Scrolling up stops following; the switch turns it back on. -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { LogLine } from '@gears/ui'

const lines = ref<LogLine[]>([])
const follow = ref(true)
const samples: Omit<LogLine, 'id' | 'time'>[] = [
  { text: '--- App started (Development) ---', level: 'highlight' },
  { text: 'info: Now listening on: http://localhost:5301' },
  { text: 'info: GET /api/catalog/product 200 12ms' },
  { text: 'warn: Slow query on Order (840ms)', level: 'warning' },
  { text: 'fail: Product 1042: Version is not valid JSON', level: 'error' },
  { text: 'info: POST /api/orders/order 201 31ms' }
]
let id = 0
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    const sample = samples[id % samples.length]
    lines.value = [...lines.value, { ...sample, id: id++, time: new Date().toLocaleTimeString() }].slice(-200)
  }, 900)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="vstack gap-2">
    <div class="d-flex align-items-center justify-content-end gap-2">
      <TSwitch v-model="follow" label="Follow" class="mb-0 me-2" />
      <TButton size="sm" color="neutral" variant="ghost" icon="eraser" label="Clear view" @click="lines = []" />
    </div>
    <TLogView v-model:follow="follow" :lines="lines" max-height="14rem" empty="No output yet. It appears here while the app runs." />
  </div>
</template>
