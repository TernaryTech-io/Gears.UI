<script setup lang="ts">
// A work section, Supabase-style: a secondary panel on the left (what the section works on:
// categories and models, saved queries, files) and a large work area. The panel can be hidden to
// give the work area the whole width. Use it in a `flush` TPage.
import { ref } from 'vue'
import TButton from './TButton.vue'
import TTooltip from './TTooltip.vue'

defineProps<{ title: string }>()
const open = ref(true)
</script>

<template>
  <div class="t-section">
    <aside v-if="open" class="t-section-panel" :aria-label="title">
      <div class="t-section-panel-header">
        <h2 class="h3 mb-0 text-truncate">{{ title }}</h2>
        <div class="d-flex align-items-center">
          <slot name="panel-actions" />
          <TTooltip text="Hide the panel">
            <TButton icon="layout-sidebar-left-collapse" size="sm" color="neutral" variant="ghost" aria-label="Hide the panel" @click="open = false" />
          </TTooltip>
        </div>
      </div>
      <slot name="panel-header" />
      <div class="flex-fill overflow-auto" style="min-height: 0">
        <slot name="panel" />
      </div>
    </aside>
    <div class="t-section-work">
      <div v-if="!open" class="d-none d-md-block">
        <TButton icon="layout-sidebar-left-expand" size="sm" color="neutral" variant="ghost" :label="title" @click="open = true" />
      </div>
      <slot />
    </div>
  </div>
</template>
