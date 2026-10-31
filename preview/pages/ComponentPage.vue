<script setup lang="ts">
// One component page: its examples, each live with its source under it.
import { computed, reactive } from 'vue'
import { examples, pages } from '../registry'

const props = defineProps<{ slug: string }>()

const page = computed(() => pages.find(p => p.slug === props.slug))
const list = computed(() => examples(props.slug))
const shown = reactive(new Set<number>())

const toggle = (i: number) => shown.has(i) ? shown.delete(i) : shown.add(i)
</script>

<template>
  <TPage v-if="page" :pretitle="page.group" :title="page.name" :description="page.description">
    <template #actions>
      <TBadge v-for="name in page.components" :key="name" color="neutral" class="font-monospace">&lt;{{ name }}&gt;</TBadge>
    </template>

    <div class="vstack gap-4">
      <div v-for="(example, i) in list" :key="example.title" class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">{{ example.title }}</h3>
            <p v-if="example.description" class="card-subtitle mb-0">{{ example.description }}</p>
          </div>
          <div class="card-actions">
            <TButton size="sm" color="neutral" variant="ghost" :icon="shown.has(i) ? 'code-off' : 'code'"
              :label="shown.has(i) ? 'Hide code' : 'Show code'" @click="toggle(i)" />
          </div>
        </div>
        <div class="preview-demo">
          <component :is="example.component" />
        </div>
        <pre v-if="shown.has(i)" class="preview-code">{{ example.source }}</pre>
      </div>
      <TEmpty v-if="!list.length" icon="flask" title="No examples yet" />
    </div>
  </TPage>
</template>
