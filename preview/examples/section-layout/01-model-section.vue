<!-- The Model section: categories and models in the panel, the designer in the work area. The panel hides to give the work area the whole width. -->
<script setup lang="ts">
import { ref } from 'vue'

const category = ref('Catalog')
const model = ref('Product')
const models: Record<string, string[]> = { Catalog: ['Product', 'Brand'], Customers: ['Customer'], Orders: ['Order', 'OrderLine'] }
</script>

<template>
  <div class="preview-frame" style="height: 26rem">
    <TSectionLayout title="Model">
      <template #panel-actions>
        <TButton icon="plus" size="sm" color="neutral" variant="ghost" aria-label="New model" />
      </template>
      <template #panel-header>
        <div class="p-2 border-bottom">
          <TSelect v-model="category" :items="Object.keys(models)" size="sm" aria-label="Category" />
        </div>
      </template>
      <template #panel>
        <div class="list-group list-group-flush">
          <a v-for="m in models[category]" :key="m" href="#" :class="['list-group-item list-group-item-action d-flex align-items-center gap-2', { active: m === model }]"
            @click.prevent="model = m"><TIcon name="box" /> {{ m }}</a>
        </div>
      </template>
      <TCard :title="model" :subtitle="category" class="flex-fill">
        <TSkeleton :lines="5" />
      </TCard>
    </TSectionLayout>
  </div>
</template>
