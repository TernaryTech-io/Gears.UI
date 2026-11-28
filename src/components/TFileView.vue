<script setup lang="ts">
// One file, shown in its box: images, audio and video by the browser; PDFs by TPdfViewer; Word by
// docx-preview; Excel by ExcelJS, a sheet at a time; Markdown by markdown-it (no HTML from the
// file); CSV as a table; text and code as text. Each library loads the first time it's needed. A
// file with no way to show it, or larger than its kind reads into the page, offers its download.
// TFileViewer puts it in a frame with a toolbar; use this alone to show a file inside a page.
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import TCodeBlock from './TCodeBlock.vue'
import TIcon from './TIcon.vue'
import TPdfViewer from './TPdfViewer.vue'
import TSpinner from './TSpinner.vue'
import {
  codeLanguageOf, loadDocxPreview, loadExcelJs, loadMarkdown, parseCsv, readFile, sizeText, viewerColumns, viewerIcon, viewerKind,
  sheetCellText, ViewerReadError, viewerLimits, viewerRows, type ViewerCell, type ViewerFile, type ViewerSheet
} from '../plugins/viewers'

const props = withDefaults(defineProps<{ file: ViewerFile; height?: number | string }>(), { height: '100%' })
const emit = defineEmits<{ load: []; error: [message: string] }>()

const kind = computed(() => viewerKind(props.file))
const limit = computed(() => viewerLimits[kind.value])
const tooLarge = computed(() => limit.value != null && props.file.size != null && props.file.size > limit.value)
const cssHeight = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height))
const downloadHref = computed(() => (props.file.download === false ? null : props.file.download ?? props.file.src))

const loading = ref(false)
const problem = ref('')
const text = ref('')
const html = ref('')
const table = shallowRef<{ rows: string[][]; more: boolean } | null>(null)
const sheets = shallowRef<ViewerSheet[]>([])
const sheet = ref(0)
const docx = ref<HTMLElement>()
const docxStyles = ref<HTMLElement>()
const docxBox = ref<HTMLElement>()
// A Word page is drawn at its own width; in a narrower box it's zoomed to fit.
const docxZoom = ref(1)
function fitDocx() {
  const page = docx.value?.querySelector<HTMLElement>('section.t-docx')
  const box = docxBox.value
  if (!page || !box || !box.clientWidth) return
  docxZoom.value = Math.min(1, (box.clientWidth - 24) / page.offsetWidth)
}
const resized = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fitDocx)
watch(docxBox, (box, old) => { if (old) resized?.unobserve(old); if (box) resized?.observe(box) })
onBeforeUnmount(() => resized?.disconnect())
const tooLargeRead = ref(false)

// Each file is read once; a newer file (or a close) drops an older read's result.
let reading = 0
async function show() {
  const at = ++reading
  problem.value = ''
  text.value = ''
  html.value = ''
  table.value = null
  sheets.value = []
  sheet.value = 0
  tooLargeRead.value = false
  if (docx.value) docx.value.innerHTML = ''
  if (docxStyles.value) docxStyles.value.innerHTML = ''
  if (['image', 'video', 'audio', 'pdf', 'none'].includes(kind.value) || tooLarge.value) return
  loading.value = true
  try {
    const blob = await readFile(props.file)
    if (at !== reading) return
    if (limit.value != null && blob.size > limit.value) { tooLargeRead.value = true; return }
    switch (kind.value) {
      case 'text': text.value = await blob.text(); break
      case 'markdown': html.value = (await loadMarkdown()).render(await blob.text()); break
      case 'csv': table.value = parseCsv(await blob.text(), props.file.name); break
      case 'xlsx': sheets.value = await readSheets(await blob.arrayBuffer()); break
      case 'docx': {
        const { renderAsync } = await loadDocxPreview()
        if (at !== reading) return
        loading.value = false
        await nextTick()
        await renderAsync(blob, docx.value!, docxStyles.value!, { className: 't-docx', inWrapper: true, ignoreLastRenderedPageBreak: true, useBase64URL: true })
        fitDocx()
        break
      }
    }
    if (at === reading) emit('load')
  } catch (e) {
    if (at !== reading) return
    problem.value = e instanceof ViewerReadError ? e.message : `${props.file.name} couldn't be shown.`
    emit('error', e instanceof Error ? e.message : problem.value)
  } finally {
    if (at === reading) loading.value = false
  }
}
watch(() => props.file, show, { immediate: true })

async function readSheets(buffer: ArrayBuffer): Promise<ViewerSheet[]> {
  const ExcelJS = await loadExcelJs()
  const book = new ExcelJS.Workbook()
  await book.xlsx.load(buffer)
  return book.worksheets.filter(s => s.state !== 'hidden' && s.state !== 'veryHidden').map(s => {
    const columns = Math.min(s.columnCount, viewerColumns)
    const rows: ViewerCell[][] = []
    const last = Math.min(s.rowCount, viewerRows)
    for (let r = 1; r <= last; r++) {
      const row = s.getRow(r)
      rows.push(Array.from({ length: columns }, (_, c) => {
        const cell = row.getCell(c + 1)
        return sheetCellText(cell.value, cell.numFmt)
      }))
    }
    return { name: s.name, rows, more: s.rowCount > viewerRows || s.columnCount > viewerColumns }
  })
}
/** A sheet's column letters: A … Z, AA …. */
function columnName(index: number) {
  let name = ''
  for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + ((n - 1) % 26)) + name
  return name
}

const shownSheet = computed(() => sheets.value[sheet.value])
const mediaFailed = () => { problem.value = `${props.file.name} couldn't be played here.`; emit('error', problem.value) }
const imageFailed = () => { problem.value = `${props.file.name} couldn't be shown.`; emit('error', problem.value) }
</script>

<template>
  <div class="t-file-view" :data-kind="kind" :style="{ height: cssHeight }">
    <!-- Nothing to show it with, too large, or failed: the download. -->
    <div v-if="kind === 'none' || tooLarge || tooLargeRead || problem" class="t-file-view-card">
      <div class="t-file-view-card-body">
        <TIcon :name="problem ? 'alert-triangle' : viewerIcon(kind)" class="t-file-view-card-icon" />
        <div class="fw-medium text-break">{{ file.name }}</div>
        <div class="text-secondary small">
          <template v-if="problem">{{ problem }}</template>
          <template v-else-if="tooLarge || tooLargeRead">It's too large to show here{{ file.size != null ? ` (${sizeText(file.size)})` : '' }}.</template>
          <template v-else>There's no preview for this kind of file{{ file.size != null ? ` (${sizeText(file.size)})` : '' }}.</template>
        </div>
        <a v-if="downloadHref" :href="downloadHref" :download="file.name" class="btn btn-primary mt-2"><TIcon name="download" class="me-2" />Download</a>
      </div>
    </div>

    <div v-else-if="loading" class="t-file-view-loading"><TSpinner label="Loading the file" /></div>

    <div v-else-if="kind === 'image'" class="t-file-view-image">
      <img :src="file.src" :alt="file.name" @load="emit('load')" @error="imageFailed">
    </div>

    <div v-else-if="kind === 'video'" class="t-file-view-media">
      <video :src="file.src" controls preload="metadata" :aria-label="file.name" @loadedmetadata="emit('load')" @error="mediaFailed" />
    </div>

    <div v-else-if="kind === 'audio'" class="t-file-view-media">
      <div class="t-file-view-audio">
        <TIcon name="music" class="t-file-view-card-icon" />
        <div class="fw-medium text-break mb-2">{{ file.name }}</div>
        <audio :src="file.src" controls preload="metadata" :aria-label="file.name" @loadedmetadata="emit('load')" @error="mediaFailed" />
      </div>
    </div>

    <TPdfViewer v-else-if="kind === 'pdf'" :src="file.src" :file-name="file.name" :download="false" height="100%" :label="file.name"
      class="t-file-view-pdf" @load="emit('load')" @error="m => emit('error', m)" />

    <div v-else-if="kind === 'text'" class="t-file-view-scroll">
      <TCodeBlock :code="text" :language="codeLanguageOf(file.name)" :label="file.name" :wrap="false" class="t-file-view-code" />
    </div>

    <div v-else-if="kind === 'markdown'" class="t-file-view-scroll">
      <!-- markdown-it, with the file's own HTML turned off. -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <article class="markdown t-file-view-markdown" v-html="html" />
    </div>

    <div v-else-if="kind === 'csv' && table" class="t-file-view-scroll">
      <table class="table table-sm table-bordered table-striped t-file-view-table mb-0">
        <thead v-if="table.rows.length"><tr><th v-for="(cell, c) in table.rows[0]" :key="c">{{ cell }}</th></tr></thead>
        <tbody><tr v-for="(row, r) in table.rows.slice(1)" :key="r"><td v-for="(cell, c) in row" :key="c">{{ cell }}</td></tr></tbody>
      </table>
      <div v-if="table.more" class="t-file-view-more">The first {{ table.rows.length.toLocaleString() }} rows are shown. Download it for the rest.</div>
    </div>

    <div v-else-if="kind === 'xlsx'" class="t-file-view-sheets">
      <div class="t-file-view-scroll">
        <table v-if="shownSheet" class="table table-sm table-bordered t-file-view-table t-file-view-grid mb-0">
          <thead><tr><th class="t-file-view-corner" /><th v-for="(_, c) in shownSheet.rows[0] ?? []" :key="c">{{ columnName(c) }}</th></tr></thead>
          <tbody><tr v-for="(row, r) in shownSheet.rows" :key="r"><th scope="row">{{ r + 1 }}</th><td v-for="(cell, c) in row" :key="c" :class="{ 'text-end': cell.number }">{{ cell.text }}</td></tr></tbody>
        </table>
        <div v-if="shownSheet?.more" class="t-file-view-more">Only the first {{ viewerRows.toLocaleString() }} rows and {{ viewerColumns }} columns are shown. Download it for the rest.</div>
        <div v-if="!sheets.length" class="t-file-view-more">This workbook has no sheets to show.</div>
      </div>
      <div v-if="sheets.length > 1" class="t-file-view-tabs" role="tablist" aria-label="Sheets">
        <button v-for="(s, i) in sheets" :key="s.name" type="button" role="tab" :aria-selected="i === sheet" :class="['t-file-view-tab', { active: i === sheet }]"
          @click="sheet = i">{{ s.name }}</button>
      </div>
    </div>

    <div v-show="kind === 'docx' && !loading && !problem" ref="docxBox" class="t-file-view-scroll t-file-view-docx">
      <div ref="docxStyles" />
      <div ref="docx" :style="docxZoom < 1 ? { zoom: docxZoom } : undefined" />
    </div>
  </div>
</template>

<style scoped>
.t-file-view { position: relative; display: flex; flex-direction: column; min-height: 12rem; overflow: hidden; background: var(--tblr-bg-surface-secondary); }
.t-file-view > * { flex: 1 1 auto; min-height: 0; }
.t-file-view-card, .t-file-view-loading, .t-file-view-media { display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.t-file-view-card-body, .t-file-view-audio { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; max-width: 28rem; text-align: center; }
.t-file-view-card-icon { font-size: 3rem; color: var(--tblr-secondary); margin-bottom: 0.5rem; }
.t-file-view-image { display: flex; align-items: center; justify-content: center; padding: 1rem; overflow: auto; }
.t-file-view-image img { max-width: 100%; max-height: 100%; object-fit: contain; background: repeating-conic-gradient(rgba(127, 127, 127, 0.12) 0 25%, transparent 0 50%) 0 0 / 16px 16px; }
.t-file-view-media video { max-width: 100%; max-height: 100%; background: #000; }
.t-file-view-audio audio { width: min(28rem, 80vw); }
.t-file-view-scroll { overflow: auto; overscroll-behavior: contain; }
.t-file-view-code { min-height: 100%; border-radius: 0; }
.t-file-view-markdown { max-width: 52rem; margin: 0 auto; padding: 2rem 1.5rem; background: var(--tblr-bg-surface); min-height: 100%; }
/* Separate borders (none between): sticky cells in a collapsed-border table let the rows under them show through in Chrome. */
.t-file-view-table { background: var(--tblr-bg-surface); width: max-content; min-width: 100%; font-size: 0.8125rem; border-collapse: separate; border-spacing: 0; }
.t-file-view-table th, .t-file-view-table td { border-width: 0 1px 1px 0; border-style: solid; border-color: var(--tblr-border-color); }
.t-file-view-table th, .t-file-view-table td { white-space: pre; max-width: 32rem; overflow: hidden; text-overflow: ellipsis; }
/* Tabler's tertiary surface is a see-through tint: laid over the solid surface, so rows scrolled under the sticky header and row numbers don't show through. */
.t-file-view-table thead th, .t-file-view-grid tbody th {
  background-color: var(--tblr-bg-surface); background-image: linear-gradient(var(--tblr-bg-surface-tertiary), var(--tblr-bg-surface-tertiary));
}
.t-file-view-table thead th { position: sticky; top: 0; z-index: 2; box-shadow: inset 0 -1px 0 var(--tblr-border-color); }
.t-file-view-grid tbody th { position: sticky; left: 0; z-index: 1; color: var(--tblr-secondary); font-weight: 400; text-align: right; }
.t-file-view-grid thead th { color: var(--tblr-secondary); font-weight: 400; text-align: center; text-transform: none; }
.t-file-view-corner { left: 0; z-index: 3 !important; }
.t-file-view-more { padding: 0.75rem 1rem; color: var(--tblr-secondary); font-size: 0.875rem; }
.t-file-view-sheets { display: flex; flex-direction: column; }
.t-file-view-sheets > .t-file-view-scroll { flex: 1 1 auto; min-height: 0; }
.t-file-view-tabs { display: flex; gap: 0.125rem; overflow-x: auto; padding: 0 0.5rem; border-top: 1px solid var(--tblr-border-color); background: var(--tblr-bg-surface); flex: none; }
.t-file-view-tab { border: 0; background: none; padding: 0.375rem 0.75rem; font-size: 0.8125rem; color: var(--tblr-secondary); border-top: 2px solid transparent; white-space: nowrap; }
.t-file-view-tab.active { color: var(--tblr-body-color); border-top-color: var(--tblr-primary); }
.t-file-view-pdf { flex: 1 1 auto; border: 0; border-radius: 0; box-shadow: none; }
.t-file-view-docx :deep(.t-docx-wrapper) { background: transparent; padding: 1.5rem 0.75rem; align-items: safe center; }
.t-file-view-docx :deep(.t-docx-wrapper > section.t-docx) { box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15); margin-bottom: 1.5rem; }
</style>
