<!-- The Studio's QueryPanel on Gears UI, against mock data: saved queries in the panel; the builder (model, columns, filter, sort, and the SQL it makes) or the editor above the results, with a handle between them. Try "Edit as SQL", Ctrl+Enter in the editor, and saving. -->
<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { CodeCompletion, DropdownItem, PanelListItem, SelectItem, TabItem } from '@ternarytech-io/gears-ui'
import {
  api, environmentKinds, errorText,
  type EnvironmentKind, type FilterGroup, type QueryModel, type QueryResult, type QuerySchema, type SavedQuery, type Translation
} from '../../studio/mock'
import FilterGroupEditor from '../../studio/FilterGroupEditor.vue'
import QueryResults from '../../studio/QueryResults.vue'

const modes: TabItem[] = [
  { label: 'Builder', value: 'builder', icon: 'filter' },
  { label: 'Editor', value: 'editor', icon: 'code' }
]
const mode = ref('builder')
const environment = ref<EnvironmentKind>('Development')
const schema = ref<QuerySchema | null>(null)
const sourceName = ref<string | undefined>()
const columns = ref<string[]>([])
const filter = ref<FilterGroup>({ kind: 'group', logic: 'And', children: [] })
const sort = ref<{ field: string; descending: boolean }[]>([])
const pageSize = ref(25)
const page = ref(1)
const translation = ref<Translation | null>(null)
const translateError = ref('')
const result = ref<QueryResult | null>(null)
const error = ref('')
const busy = ref(false)
const raw = ref('')
const allowWrites = ref(false)
const maximized = ref(false)

const source = computed(() => schema.value?.sources.find(s => s.name === sourceName.value))
const dialectNames: Record<string, string> = {
  PostgreSql: 'PostgreSQL', SqlServer: 'SQL Server', MySql: 'MySQL', Sqlite: 'SQLite', MongoDb: 'MongoDB', LiteDb: 'LiteDB'
}
const dialect = computed(() => dialectNames[schema.value?.dialect ?? ''] ?? schema.value?.dialect ?? '')
// Models, listed under their categories.
const sourceItems = computed<SelectItem<string>[]>(() =>
  (schema.value?.sources ?? []).map(s => ({ label: s.name, value: s.name, group: s.category })))
const fieldItems = computed(() => source.value?.fields.map(f => f.name) ?? [])
const query = computed<QueryModel | null>(() => sourceName.value ? {
  source: sourceName.value,
  columns: columns.value,
  filter: filter.value,
  sort: sort.value.filter(s => s.field),
  skip: (page.value - 1) * pageSize.value,
  take: pageSize.value
} : null)

// Suggestions for the editor: the models and fields (by name; stored names can differ after renames).
const completions = computed<CodeCompletion[]>(() => [
  ...(schema.value?.sources ?? []).map(s => ({ label: s.name, kind: 'table' as const, detail: s.category })),
  ...(source.value?.fields ?? []).map(f => ({ label: f.name, kind: 'field' as const, detail: f.type })),
  ...['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'LIMIT', 'COUNT(*)'].map(k => ({ label: k, kind: 'keyword' as const }))
])

async function loadSchema() {
  error.value = ''
  try {
    const previous = sourceName.value
    schema.value = await api.querySchema(environment.value)
    sourceName.value = schema.value.sources.find(s => s.name === previous)?.name ?? schema.value.sources[0]?.name
  } catch (e) {
    schema.value = null
    error.value = errorText(e, 'The models could not be loaded.')
  }
}
onMounted(() => {
  loadSchema()
  loadSaved()
})
watch(environment, () => {
  allowWrites.value = false
  result.value = null
  loadSchema()
})

// A new model starts a new query (unless a saved query is being opened).
let opening = false
watch(sourceName, () => {
  if (opening) return
  columns.value = []
  filter.value = { kind: 'group', logic: 'And', children: [] }
  sort.value = []
  page.value = 1
  result.value = null
})

// The native query follows the builder as it changes.
let timer: ReturnType<typeof setTimeout> | undefined
watch(query, value => {
  clearTimeout(timer)
  if (!value) return
  timer = setTimeout(async () => {
    try {
      translation.value = await api.translateQuery(value)
      translateError.value = ''
    } catch (e) {
      translateError.value = errorText(e, 'The query could not be translated.')
    }
  }, 300)
}, { deep: true, immediate: true })

async function run() {
  if (!query.value) return
  error.value = ''
  busy.value = true
  try {
    const response = await api.runQuery(query.value)
    translation.value = response.query
    result.value = response.result
  } catch (e) {
    error.value = errorText(e, 'The query failed.')
  } finally {
    busy.value = false
  }
}

async function runRaw() {
  error.value = ''
  busy.value = true
  try {
    result.value = await api.rawQuery(raw.value, allowWrites.value)
  } catch (e) {
    error.value = errorText(e, 'The query failed.')
  } finally {
    busy.value = false
  }
}

function setPage(value: number) {
  page.value = value
  run()
}

// Opens the editor with the builder's query in the provider's language.
function editTranslation() {
  if (translation.value) raw.value = translation.value.text
  result.value = null
  mode.value = 'editor'
}

// ---- Saved queries ----
const saved = ref<SavedQuery[]>([])
const current = ref<SavedQuery | null>(null)
const queryName = ref('Untitled query')
const savedSearch = ref('')
const saving = ref(false)

const matching = computed(() => saved.value.filter(q => q.name.toLowerCase().includes(savedSearch.value.trim().toLowerCase())))
const listItem = (q: SavedQuery): PanelListItem => ({
  value: q.id, label: q.name, icon: q.mode === 'Editor' ? 'code' : 'filter',
  trailing: q.environment !== 'Development' ? q.environment.slice(0, 4) : undefined,
  title: q.shared && !q.mine ? `By ${q.ownerName}` : undefined
})
const privateQueries = computed(() => matching.value.filter(q => !q.shared).map(listItem))
const sharedQueries = computed(() => matching.value.filter(q => q.shared).map(listItem))
const canSave = computed(() => mode.value === 'builder' ? !!sourceName.value : raw.value.trim().length > 0)

async function loadSaved() {
  try {
    saved.value = await api.savedQueries()
  } catch (e) {
    error.value = errorText(e, 'Saved queries could not be loaded.')
  }
}

// Starts a new, unsaved query.
function newQuery() {
  current.value = null
  queryName.value = 'Untitled query'
  raw.value = ''
  columns.value = []
  filter.value = { kind: 'group', logic: 'And', children: [] }
  sort.value = []
  page.value = 1
  result.value = null
}

async function openQuery(id: string) {
  const q = saved.value.find(s => s.id === id)
  if (!q) return
  current.value = q
  queryName.value = q.name
  result.value = null
  page.value = 1
  if (environment.value !== q.environment) {
    environment.value = q.environment
    await loadSchema()
  }
  if (q.mode === 'Editor') {
    mode.value = 'editor'
    raw.value = q.definition
    return
  }
  mode.value = 'builder'
  try {
    const definition = JSON.parse(q.definition) as Partial<QueryModel>
    opening = true
    sourceName.value = definition.source
    columns.value = definition.columns ?? []
    filter.value = definition.filter ?? { kind: 'group', logic: 'And', children: [] }
    sort.value = definition.sort ?? []
    pageSize.value = definition.take ?? 25
    await nextTick()
  } catch {
    error.value = `${q.name} couldn't be read.`
  } finally {
    opening = false
  }
}

// Saves the query: over the open one when it's yours to change, else as a new one.
async function saveQuery(asNew = false, shared?: boolean) {
  if (!canSave.value) return
  saving.value = true
  error.value = ''
  const input = {
    name: queryName.value.trim() || 'Untitled query',
    shared: shared ?? current.value?.shared ?? false,
    mode: mode.value === 'editor' ? 'Editor' as const : 'Builder' as const,
    environment: environment.value,
    definition: mode.value === 'editor' ? raw.value : JSON.stringify({ source: sourceName.value, columns: columns.value, filter: filter.value, sort: sort.value, take: pageSize.value })
  }
  try {
    current.value = current.value && current.value.canEdit && !asNew
      ? await api.updateQuery(current.value.id, input)
      : await api.createQuery(asNew && current.value ? { ...input, name: `${input.name} (copy)`, shared: false } : input)
    queryName.value = current.value.name
    await loadSaved()
  } catch (e) {
    error.value = errorText(e, 'The query could not be saved.')
  } finally {
    saving.value = false
  }
}

async function deleteQuery(q: SavedQuery) {
  if (!confirm(`Delete ${q.name}?`)) return
  try {
    await api.deleteQuery(q.id)
    if (current.value?.id === q.id) newQuery()
    await loadSaved()
  } catch (e) {
    error.value = errorText(e, 'The query could not be deleted.')
  }
}

const saveMenu = computed<DropdownItem[][]>(() => [[
  { label: 'Save as a copy', icon: 'copy-plus', disabled: !current.value || !canSave.value, onSelect: () => saveQuery(true) },
  {
    label: current.value?.shared ? 'Make it private' : 'Share with the project', icon: current.value?.shared ? 'lock' : 'users',
    disabled: !current.value?.canEdit, onSelect: () => saveQuery(false, !current.value?.shared)
  }
], [
  { label: 'Delete', icon: 'trash', color: 'error', disabled: !current.value?.canEdit, onSelect: () => current.value && deleteQuery(current.value) }
]])

function addSort() {
  const used = new Set(sort.value.map(s => s.field))
  const fields = source.value?.fields ?? []
  const next = fields.find(f => f.name !== 'Id' && !used.has(f.name)) ?? fields.find(f => !used.has(f.name))
  sort.value.push({ field: next?.name ?? '', descending: false })
}
</script>

<template>
  <div class="preview-frame" style="height: 52rem">
    <TSectionLayout title="Query builder">
      <template #panel-header>
        <div class="d-flex flex-column gap-2 p-3 border-bottom">
          <TButton block size="sm" color="neutral" icon="plus" label="New query" @click="newQuery" />
          <TInput v-model="savedSearch" icon="search" size="sm" placeholder="Search queries…" aria-label="Search queries" />
        </div>
      </template>
      <template #panel>
        <TPanelList :model-value="current?.id" heading="Private" :items="privateQueries" empty="Queries you save show here."
          @update:model-value="id => id && openQuery(id)" />
        <TPanelList :model-value="current?.id" heading="Shared" :items="sharedQueries" empty="Share a query to show it to the whole project."
          @update:model-value="id => id && openQuery(id)" />
      </template>

      <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 flex-shrink-0">
        <div class="d-flex align-items-center gap-3 flex-fill" style="min-width: 0">
          <TTabs v-model="mode" :items="modes" variant="segmented" size="sm" />
          <TInput v-model="queryName" size="sm" class="form-control-flush fw-medium" style="max-width: 18rem" aria-label="Query name" />
          <TBadge v-if="current?.shared" color="neutral" icon="users" label="Shared" />
        </div>
        <div class="d-flex align-items-center gap-2 small text-secondary">
          <TSelect v-model="environment" :items="environmentKinds" size="sm" style="width: 9rem" aria-label="Environment" />
          <span class="d-none d-xl-inline text-nowrap">database<template v-if="schema"> · {{ dialect }}</template></span>
          <TFieldGroup size="sm">
            <TButton size="sm" color="neutral" icon="device-floppy" label="Save" :loading="saving" :disabled="!canSave" @click="saveQuery()" />
            <TDropdown :items="saveMenu" align="end">
              <TButton size="sm" color="neutral" icon="chevron-down" aria-label="More save options" />
            </TDropdown>
          </TFieldGroup>
        </div>
      </div>

      <TAlert v-if="error" color="error" :title="error" dismissible class="mb-0 flex-shrink-0" @close="error = ''" />
      <TAlert v-if="schema && !schema.sources.length" color="info" class="mb-0 flex-shrink-0"
        :title="environment === 'Development' ? 'No models yet' : `Nothing in ${environment} yet`"
        :description="environment === 'Development' ? 'Design and save a model on the Model tab, then query its data here.' : `Promote to ${environment} on the Environments tab, then query its data here.`" />

      <QueryResults v-if="schema?.sources.length && maximized" v-model:maximized="maximized" :result="result" :paged="mode === 'builder'"
        :page="page" :page-size="pageSize" @update:page="setPage" />
      <TSplitter v-else-if="schema?.sources.length" orientation="vertical" storage-key="gears-query" :default-size="45" :min-start="20" :min-end="15">
        <template #start>
          <!-- Builder: the query's parts across the top, with the translation beside them -->
          <TCard v-if="mode === 'builder'" flush class="flex-fill mb-0 d-flex flex-column" style="min-height: 0">
            <template #header>
              <div class="d-flex flex-wrap align-items-end gap-3 w-100">
                <TFormField label="Model" style="width: 13rem">
                  <TSelect v-model="sourceName" :items="sourceItems" size="sm" />
                </TFormField>
                <TFormField label="Columns" class="flex-fill" style="min-width: 13rem">
                  <TSelectMenu v-model="columns" :items="fieldItems" multiple placeholder="All columns" size="sm" />
                </TFormField>
                <TFormField label="Rows per page">
                  <TSelect v-model="pageSize" :items="[10, 25, 50, 100, 250]" size="sm" style="width: 6rem" @update:model-value="page = 1" />
                </TFormField>
                <TButton size="sm" icon="player-play" label="Run" :loading="busy" @click="page = 1; run()" />
              </div>
            </template>

            <div class="card-body studio-query-grid">
              <div v-if="source" style="min-width: 0">
                <div class="fw-medium small mb-2">Filter</div>
                <FilterGroupEditor :group="filter" :fields="source.fields" />
              </div>

              <div style="min-width: 0">
                <div class="fw-medium small mb-2">Sort</div>
                <div class="d-flex flex-column gap-1">
                  <div v-for="(s, i) in sort" :key="i" class="d-flex align-items-center gap-1">
                    <TSelect v-model="s.field" :items="fieldItems" size="sm" class="flex-fill" aria-label="Sort field" />
                    <TTooltip :text="s.descending ? 'Descending' : 'Ascending'">
                      <TButton size="sm" color="neutral" variant="outline" :icon="s.descending ? 'sort-descending' : 'sort-ascending'"
                        :aria-label="s.descending ? 'Descending' : 'Ascending'" @click="s.descending = !s.descending" />
                    </TTooltip>
                    <TButton size="sm" color="neutral" variant="ghost" icon="x" aria-label="Remove sort" @click="sort.splice(i, 1)" />
                  </div>
                  <div><TButton size="xs" color="neutral" variant="ghost" icon="plus" label="Sort by" @click="addSort" /></div>
                </div>
              </div>

              <div class="d-flex flex-column gap-2" style="min-width: 0; min-height: 12rem">
                <div class="d-flex align-items-center justify-content-between gap-2">
                  <TTooltip text="What runs on the database. Values show inline; the server sends them as parameters.">
                    <span class="fw-medium small">{{ dialect }} query</span>
                  </TTooltip>
                  <TButton size="xs" color="neutral" variant="outline" icon="code" :disabled="!translation"
                    :label="`Edit as ${schema.language === 'json' ? 'JSON' : 'SQL'}`" @click="editTranslation" />
                </div>
                <TAlert v-if="translateError" color="warning" :title="translateError" class="mb-0" />
                <TAlert v-for="w in translation?.warnings ?? []" :key="w" color="info" :description="w" class="mb-0" />
                <TCodeEditor :model-value="translation?.text ?? ''" :language="translation?.language ?? schema.language" read-only
                  :line-numbers="false" label="Translated query" class="flex-fill" />
              </div>
            </div>
          </TCard>

          <!-- Editor: the query in the provider's language replaces the builder -->
          <TCard v-else flush class="flex-fill mb-0 d-flex flex-column" style="min-height: 0">
            <template #header>
              <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                <span class="small text-secondary">
                  {{ schema.language === 'json' ? 'A MongoDB command document, such as find or aggregate.' : `${dialect} SQL.` }}
                  Ctrl+Enter runs it.
                </span>
                <div class="d-flex align-items-center gap-3">
                  <TSwitch v-if="schema.canWrite && environment === 'Development'" v-model="allowWrites" label="Allow changes" class="mb-0" />
                  <span v-else-if="environment !== 'Development'" class="small text-secondary">Read-only. {{ environment }} changes through its app.</span>
                  <span v-else class="small text-secondary">Read-only. Only project owners can change data.</span>
                  <TButton size="sm" icon="player-play" label="Run" :loading="busy" :disabled="!raw.trim()" @click="runRaw" />
                </div>
              </div>
            </template>
            <TCodeEditor v-model="raw" :language="schema.language" :completions="completions" label="Query" flush class="flex-fill" @run="runRaw" />
          </TCard>
        </template>

        <template #end>
          <QueryResults v-model:maximized="maximized" :result="result" :paged="mode === 'builder'" :page="page" :page-size="pageSize" @update:page="setPage" />
        </template>
      </TSplitter>
    </TSectionLayout>
  </div>
</template>
