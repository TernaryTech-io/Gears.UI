<!-- Sizes from sm to full width. -->
<script setup lang="ts">
import { ref } from 'vue'

const size = ref<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md')
const open = ref(false)
const show = (s: typeof size.value) => { size.value = s; open.value = true }
</script>

<template>
  <div class="btn-list">
    <TButton v-for="s in (['sm', 'md', 'lg', 'xl', 'full'] as const)" :key="s" color="neutral" :label="s" @click="show(s)" />
  </div>
  <TModal v-model:open="open" :size="size" :title="`A ${size} modal`">
    <TSkeleton :lines="4" />
  </TModal>
</template>
