<!-- Wrap anything; the tooltip shows on hover and keyboard focus. Text can change while it's shown. -->
<script setup lang="ts">
import { ref } from 'vue'

const copied = ref(false)
function copy() {
  copied.value = true
  setTimeout(() => { copied.value = false }, 1500)
}
</script>

<template>
  <div class="btn-list">
    <TTooltip text="On top">
      <TButton color="neutral" label="Top" />
    </TTooltip>
    <TTooltip text="Underneath" placement="bottom">
      <TButton color="neutral" label="Bottom" />
    </TTooltip>
    <TTooltip text="To the right" placement="end">
      <TButton color="neutral" label="End" />
    </TTooltip>
    <TTooltip :text="copied ? 'Copied' : 'Copy the connection string'">
      <TButton icon="copy" color="neutral" variant="outline" aria-label="Copy" @click="copy" />
    </TTooltip>
  </div>
</template>
