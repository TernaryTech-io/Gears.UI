<!-- `vertical` stacks the panes; `storageKey` remembers the size in this browser. The query builder uses this. -->
<script setup lang="ts">
import { ref } from 'vue'

const size = ref<number>()
</script>

<template>
  <div class="preview-frame" style="height: 22rem">
    <TSplitter v-model:size="size" orientation="vertical" storage-key="preview-stacked" :default-size="40" :min-start="20" :min-end="20" class="p-2">
      <template #start>
        <TCard title="Query" class="flex-fill mb-0"><span class="text-secondary">{{ Math.round(size ?? 0) }}% of the height</span></TCard>
      </template>
      <template #end>
        <TCard title="Results" class="flex-fill mb-0"><TSkeleton :lines="2" /></TCard>
      </template>
    </TSplitter>
  </div>
</template>
