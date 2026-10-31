<script setup lang="ts">
// The query builder's results: a table of any columns (rows become objects keyed by position),
// what it took, paging for builder queries, and a button to fill the section with them.
import { computed } from 'vue'
import type { TableColumn } from '@gears/ui'
import type { QueryResult } from './mock'

const props = defineProps<{ result: QueryResult | null; paged: boolean; page: number; pageSize: number; maximized: boolean }>()
const emit = defineEmits<{ 'update:page': [page: number]; 'update:maximized': [maximized: boolean] }>()

const columns = computed<TableColumn[]>(() => (props.result?.columns ?? []).map((c, i) => ({ key: `c${i}`, label: c.name })))
const rows = computed(() => (props.result?.rows ?? []).map((r, index) => ({ index, ...Object.fromEntries(r.map((v, i) => [`c${i}`, v])) })))

const text = (value: unknown) => typeof value === 'object' ? JSON.stringify(value) : String(value)
</script>

<template>
  <TCard flush class="flex-fill mb-0 d-flex flex-column" style="min-height: 0">
    <template #header>
      <h3 class="card-title">Results</h3>
    </template>
    <template #actions>
      <span v-if="result" class="small text-secondary">
        <template v-if="result.affected !== null">{{ result.affected }} changed · </template>
        <template v-if="result.total !== null">{{ result.total }} matching · </template>
        <template v-else>{{ result.rows.length }} rows{{ result.truncated ? ' (more not shown)' : '' }} · </template>
        {{ result.milliseconds }} ms
      </span>
      <TTooltip :text="maximized ? 'Restore' : 'Fill the section'">
        <TButton size="sm" color="neutral" variant="ghost" :icon="maximized ? 'minimize' : 'maximize'"
          :aria-label="maximized ? 'Restore the results' : 'Fill the section with the results'" @click="emit('update:maximized', !maximized)" />
      </TTooltip>
    </template>

    <TTable v-if="result" card sticky row-key="index" :columns="columns" :rows="rows" class="flex-fill"
      :empty="result.affected !== null ? 'The query changed data and returned no rows.' : 'No rows match.'">
      <template #cell="{ value }">
        <span v-if="value === null || value === undefined" class="text-secondary fst-italic">null</span>
        <span v-else-if="typeof value === 'boolean'" :class="value ? 'text-success' : 'text-secondary'">{{ value }}</span>
        <span v-else class="d-block text-truncate" style="max-width: 20rem" :title="text(value)">{{ text(value) }}</span>
      </template>
    </TTable>
    <TEmpty v-else icon="table" title="Run a query" description="Results show here." class="flex-fill" />

    <template v-if="paged && result?.total" #footer>
      <div class="d-flex justify-content-end">
        <TPagination :page="page" :items-per-page="pageSize" :total="result.total" size="sm" @update:page="emit('update:page', $event)" />
      </div>
    </template>
  </TCard>
</template>
