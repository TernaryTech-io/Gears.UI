<!-- Fixed text and buttons joined to an input. -->
<script setup lang="ts">
import { ref } from 'vue'

const slug = ref('online-shop')
const token = 'gears_pat_8f2c…e41a'
</script>

<template>
  <div class="vstack gap-3" style="max-width: 32rem">
    <TFieldGroup>
      <span class="input-group-text">https://apps.example.com/</span>
      <TInput v-model="slug" aria-label="Address" />
    </TFieldGroup>
    <TFieldGroup>
      <TInput :model-value="token" readonly aria-label="Token" class="font-monospace" />
      <TButton color="neutral" icon="copy" label="Copy" />
    </TFieldGroup>
    <TFieldGroup size="sm">
      <TInput placeholder="Filter rows…" aria-label="Filter" />
      <TButton icon="filter" label="Apply" size="sm" />
    </TFieldGroup>
  </div>
</template>
