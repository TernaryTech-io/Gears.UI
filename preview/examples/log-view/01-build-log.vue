<!-- The Studio's build log, rebuilt on TLogView: a status line, then the log, following the end while it runs. -->
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

const steps = ['Restoring packages…', 'Generating code for 4 models', 'Compiling OnlineShop.Data', '  OnlineShop.Data -> bin/OnlineShop.Data.dll',
  'Updating the Development database', '  Applied 1 migration: AddProductSku', 'Starting the app on port 5301', 'Build succeeded.']
const log = ref('')
const status = ref<'Queued' | 'Running' | 'Succeeded'>('Queued')
let timer: ReturnType<typeof setInterval> | undefined

function run() {
  clearInterval(timer)
  log.value = ''
  status.value = 'Running'
  let i = 0
  timer = setInterval(() => {
    log.value += (log.value ? '\n' : '') + steps[i++]
    if (i === steps.length) { clearInterval(timer); status.value = 'Succeeded' }
  }, 500)
}

const color = computed(() => ({ Queued: 'neutral', Running: 'info', Succeeded: 'success' } as const)[status.value])
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="vstack gap-3">
    <div class="d-flex flex-wrap align-items-center gap-2">
      <strong>Build #42</strong>
      <TBadge :color="color" :label="status" />
      <TSpinner v-if="status === 'Running'" size="sm" show-label label="Working; this takes a little while…" />
      <code v-else class="small text-secondary">a1f9c03e2b</code>
      <TButton class="ms-auto" size="sm" icon="player-play" label="Run" :disabled="status === 'Running'" @click="run" />
    </div>
    <TLogView :text="log" max-height="12rem" empty="Waiting for output…" />
  </div>
</template>
