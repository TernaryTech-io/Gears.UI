<!-- Pills for switching views; `card` fits tabs into a card's header, with the content in its body. -->
<script setup lang="ts">
import { ref } from 'vue'

const view = ref('grid')
const env = ref('development')
const envs = [
  { label: 'Development', value: 'development' },
  { label: 'Staging', value: 'staging' },
  { label: 'Production', value: 'production' }
]
</script>

<template>
  <div class="vstack gap-4">
    <TTabs v-model="view" variant="pills" :items="[{ label: 'Grid', value: 'grid', icon: 'layout-grid' }, { label: 'List', value: 'list', icon: 'list' }]" />
    <TCard>
      <template #header>
        <TTabs v-model="env" card :items="envs" />
      </template>
      <p class="mb-0">The <strong>{{ env }}</strong> environment's database and app.</p>
    </TCard>
  </div>
</template>
