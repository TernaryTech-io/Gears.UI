<!-- The Studio's CodePanel on Gears UI, against mock data: the C# the model generates, read-only, with the files in the panel. -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { PanelListItem } from '@ternarytech-io/gears-ui'
import { api, errorText } from '../../studio/mock'

const files = ref<{ path: string; content: string }[] | null>(null)
const selected = ref('')
const error = ref('')
const file = computed(() => files.value?.find(f => f.path === selected.value))
const items = computed<PanelListItem[]>(() => (files.value ?? []).map(f => ({ value: f.path, label: f.path, icon: 'file-code' })))

onMounted(async () => {
  try {
    files.value = await api.code()
    selected.value = files.value[0]?.path ?? ''
  } catch (e) {
    error.value = errorText(e, 'The code could not be loaded.')
  }
})
</script>

<template>
  <div class="preview-frame" style="height: 36rem">
    <TSectionLayout title="Code">
      <template #panel>
        <TPanelList v-model="selected" heading="Models/Generated" :items="items" />
      </template>

      <TAlert v-if="error" color="error" :title="error" class="mb-0" />
      <TCard v-else-if="files && !files.length">
        <TEmpty icon="file-code" title="No code yet" description="Saving the model generates the code." />
      </TCard>
      <TCard v-else-if="files" flush class="flex-fill mb-0 d-flex flex-column" style="min-height: 0">
        <template #header>
          <div class="d-flex align-items-center justify-content-between gap-2 w-100">
            <h3 class="card-title font-monospace small text-truncate">{{ file?.path }}</h3>
            <span class="small text-secondary">Read-only · edit through <code>gears clone</code></span>
          </div>
        </template>
        <TCodeEditor :model-value="file?.content ?? ''" language="csharp" read-only flush label="Generated code" class="flex-fill" />
      </TCard>
      <TCard v-else class="flex-fill">
        <TSkeleton :lines="8" />
      </TCard>
    </TSectionLayout>
  </div>
</template>
