<script setup lang="ts">
// A PDF, drawn by PDF.js (loaded on first use): its pages one under another, each drawn when it
// scrolls into view, at a zoom that fits the width (default), fits a whole page, or a percent.
// The toolbar has the page (v-model:page; typing one goes there), previous and next, zoom, and
// download and open in a new tab. A PDF that can't be read says so, with a link to download it.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist'
import { loadPdfJs } from '../plugins/pdf'
import TIcon from './TIcon.vue'

export type PdfZoom = 'width' | 'page' | number

const props = withDefaults(defineProps<{
  src: string
  // Fit the width, fit a page, or a percent (100 is the PDF's own size).
  zoom?: PdfZoom
  toolbar?: boolean
  download?: boolean
  // The downloaded file's name; by default the address's last part.
  fileName?: string
  height?: number | string
  label?: string
}>(), { zoom: 'width', toolbar: true, download: true, height: 480, label: 'PDF document' })

const page = defineModel<number>('page', { default: 1 })
const emit = defineEmits<{ load: [info: { pages: number }]; error: [message: string] }>()

const scroller = ref<HTMLElement>()
const doc = shallowRef<PDFDocumentProxy | null>(null)
const pages = shallowRef<PDFPageProxy[]>([])
const loading = ref(true)
const problem = ref('')
const zoom = ref<PdfZoom>(props.zoom)
const scale = ref(1)
watch(() => props.zoom, z => { zoom.value = z })

const cssHeight = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height))
const name = computed(() => props.fileName || decodeURIComponent(props.src.split(/[?#]/)[0]!.split('/').pop() || 'document.pdf'))
const count = computed(() => pages.value.length)

// ---- Loading ----
let loadingTask: { destroy: () => Promise<void> } | null = null
async function open() {
  close()
  loading.value = true
  problem.value = ''
  try {
    const pdfjs = await loadPdfJs()
    const task = pdfjs.getDocument({ url: props.src })
    loadingTask = task
    const opened = await task.promise
    doc.value = opened
    pages.value = await Promise.all(Array.from({ length: opened.numPages }, (_, i) => opened.getPage(i + 1)))
    fit()
    loading.value = false
    emit('load', { pages: opened.numPages })
    await nextTick()
    observe()
    if (page.value > 1) goTo(page.value)
  } catch (e) {
    loading.value = false
    problem.value = e instanceof Error && /password/i.test(e.message) ? 'This PDF needs a password.' : 'This PDF couldn\'t be shown.'
    emit('error', e instanceof Error ? e.message : problem.value)
  }
}
function close() {
  for (const task of tasks.values()) task.cancel()
  tasks.clear()
  drawn.clear()
  observer?.disconnect()
  void loadingTask?.destroy()
  loadingTask = null
  doc.value = null
  pages.value = []
}

// ---- Zoom ----
const sizes = computed(() => pages.value.map(p => p.getViewport({ scale: scale.value })))
/** The zoom as a scale: a fit works it out from the box and the first page. */
function fit() {
  const first = pages.value[0]
  const box = scroller.value
  if (!first || !box) return
  const natural = first.getViewport({ scale: 1 })
  const width = (box.clientWidth - 32) / natural.width
  const whole = Math.min(width, (box.clientHeight - 32) / natural.height)
  scale.value = Math.max(0.1, zoom.value === 'width' ? width : zoom.value === 'page' ? whole : zoom.value / 100)
}
watch(zoom, () => { fit(); redraw() })
const steps = [50, 75, 100, 125, 150, 200, 300]
function zoomBy(direction: 1 | -1) {
  const now = Math.round(scale.value * 100)
  const next = direction > 0 ? steps.find(s => s > now) ?? 400 : [...steps].reverse().find(s => s < now) ?? 25
  zoom.value = next
}
const zoomItems = [{ label: 'Fit width', value: 'width' }, { label: 'Fit page', value: 'page' }, ...steps.map(s => ({ label: `${s}%`, value: String(s) }))]
const zoomChoice = computed({
  get: () => (typeof zoom.value === 'number' ? String(zoom.value) : zoom.value),
  set: (v: string) => { zoom.value = v === 'width' || v === 'page' ? v : Number(v) }
})
const zoomShown = computed(() => (typeof zoom.value === 'number' || !zoomItems.some(z => z.value === zoomChoice.value) ? `${Math.round(scale.value * 100)}%` : ''))

// ---- Drawing pages as they come into view ----
const canvases = ref<HTMLCanvasElement[]>([])
const tasks = new Map<number, RenderTask>()
const drawn = new Map<number, number>()
let observer: IntersectionObserver | null = null
function observe() {
  observer?.disconnect()
  observer = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) void draw(Number((e.target as HTMLElement).dataset.page))
  }, { root: scroller.value, rootMargin: '400px 0px' })
  scroller.value?.querySelectorAll('.t-pdf-page').forEach(el => observer!.observe(el))
}
async function draw(index: number) {
  const p = pages.value[index]
  const canvas = canvases.value[index]
  if (!p || !canvas || drawn.get(index) === scale.value) return
  tasks.get(index)?.cancel()
  const ratio = window.devicePixelRatio || 1
  const viewport = p.getViewport({ scale: scale.value * ratio })
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  const task = p.render({ canvas, viewport })
  tasks.set(index, task)
  try {
    await task.promise
    drawn.set(index, scale.value)
  } catch {
    // Cancelled by a newer drawing.
  } finally {
    if (tasks.get(index) === task) tasks.delete(index)
  }
}
function redraw() {
  drawn.clear()
  void nextTick(() => observe())
}

// ---- Pages ----
function goTo(n: number) {
  const target = Math.min(Math.max(1, Math.round(n) || 1), Math.max(1, count.value))
  page.value = target
  const el = scroller.value?.querySelector<HTMLElement>(`[data-page="${target - 1}"]`)
  if (el && scroller.value) scroller.value.scrollTop = el.offsetTop - 12
}
// The page shown is the one nearest the top as it scrolls.
function scrolled() {
  const box = scroller.value
  if (!box) return
  const els = [...box.querySelectorAll<HTMLElement>('.t-pdf-page')]
  const top = box.scrollTop + box.clientHeight * 0.25
  let current = 1
  for (const el of els) if (el.offsetTop <= top) current = Number(el.dataset.page) + 1
  if (current !== page.value) page.value = current
}
const typed = ref('')
watch(page, p => { typed.value = String(p) }, { immediate: true })
watch(page, p => {
  const box = scroller.value
  const el = box?.querySelector<HTMLElement>(`[data-page="${p - 1}"]`)
  if (!box || !el) return
  // Changed from outside (not by scrolling): go there.
  if (el.offsetTop > box.scrollTop + box.clientHeight * 0.25 || el.offsetTop + el.offsetHeight < box.scrollTop) box.scrollTop = el.offsetTop - 12
})

function downloadFile() {
  const a = document.createElement('a')
  a.href = props.src
  a.download = name.value
  document.body.appendChild(a)
  a.click()
  a.remove()
}

let sized: ResizeObserver | null = null
onMounted(() => {
  void open()
  sized = new ResizeObserver(() => {
    if (zoom.value === 'width' || zoom.value === 'page') {
      const before = scale.value
      fit()
      if (Math.abs(before - scale.value) > 0.01) redraw()
    }
  })
  if (scroller.value) sized.observe(scroller.value)
})
watch(() => props.src, () => void open())
onBeforeUnmount(() => {
  sized?.disconnect()
  close()
})

defineExpose({ setPage: goTo, download: downloadFile })
</script>

<template>
  <div class="t-pdf card" :style="{ height: cssHeight }" role="document" :aria-label="label">
    <div v-if="toolbar" class="t-pdf-toolbar">
      <button type="button" class="btn btn-sm btn-ghost-secondary btn-icon" :disabled="page <= 1 || !count" aria-label="Previous page" @click="goTo(page - 1)">
        <TIcon name="chevron-up" />
      </button>
      <button type="button" class="btn btn-sm btn-ghost-secondary btn-icon" :disabled="page >= count || !count" aria-label="Next page" @click="goTo(page + 1)">
        <TIcon name="chevron-down" />
      </button>
      <label class="t-pdf-page-number">
        <input v-model="typed" class="form-control form-control-sm" inputmode="numeric" aria-label="Page" :disabled="!count"
          @keydown.enter="goTo(Number(typed))" @blur="goTo(Number(typed))">
        <span class="text-secondary small text-nowrap">of {{ count || '…' }}</span>
      </label>
      <span class="ms-auto" />
      <button type="button" class="btn btn-sm btn-ghost-secondary btn-icon" :disabled="!count" aria-label="Zoom out" @click="zoomBy(-1)"><TIcon name="zoom-out" /></button>
      <select v-model="zoomChoice" class="form-select form-select-sm t-pdf-zoom" aria-label="Zoom" :disabled="!count">
        <option v-if="zoomShown" :value="zoomChoice" hidden>{{ zoomShown }}</option>
        <option v-for="z in zoomItems" :key="z.value" :value="z.value">{{ z.label }}</option>
      </select>
      <button type="button" class="btn btn-sm btn-ghost-secondary btn-icon" :disabled="!count" aria-label="Zoom in" @click="zoomBy(1)"><TIcon name="zoom-in" /></button>
      <template v-if="download">
        <button type="button" class="btn btn-sm btn-ghost-secondary btn-icon" aria-label="Download" title="Download" @click="downloadFile"><TIcon name="download" /></button>
        <a class="btn btn-sm btn-ghost-secondary btn-icon" :href="src" target="_blank" rel="noopener" aria-label="Open in a new tab" title="Open in a new tab">
          <TIcon name="external-link" />
        </a>
      </template>
    </div>
    <div ref="scroller" class="t-pdf-pages" @scroll.passive="scrolled">
      <div v-if="loading" class="t-pdf-note"><span class="spinner-border spinner-border-sm" role="status" /> Loading the PDF…</div>
      <div v-else-if="problem" class="t-pdf-note flex-column">
        <TIcon name="file-alert" class="text-secondary" />
        <span>{{ problem }}</span>
        <a v-if="download" :href="src" :download="name">Download it</a>
      </div>
      <template v-else>
        <div v-for="(size, i) in sizes" :key="i" class="t-pdf-page" :data-page="i" :style="{ width: `${size.width}px`, height: `${size.height}px` }">
          <canvas :ref="el => { canvases[i] = el as HTMLCanvasElement }" :style="{ width: `${size.width}px`, height: `${size.height}px` }"
            :aria-label="`Page ${i + 1}`" role="img" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.t-pdf { display: flex; flex-direction: column; overflow: hidden; margin: 0; container-type: inline-size; }
/* A narrow viewer drops its zoom choice, then its zoom buttons, so the page and download stay. */
@container (max-width: 440px) { .t-pdf-zoom { display: none; } }
@container (max-width: 340px) { .t-pdf-toolbar button[aria-label^="Zoom"] { display: none; } }
.t-pdf-toolbar { display: flex; align-items: center; gap: 0.25rem; padding: 0.375rem 0.5rem; border-bottom: 1px solid var(--tblr-border-color); }
.t-pdf-page-number { display: inline-flex; align-items: center; gap: 0.375rem; margin: 0 0 0 0.25rem; }
.t-pdf-page-number input { width: 3.25rem; text-align: center; }
.t-pdf-zoom { width: 7rem; }
.t-pdf-pages { position: relative; flex: 1; min-height: 0; overflow: auto; padding: 16px; background: var(--tblr-bg-surface-secondary); }
.t-pdf-page { margin: 0 auto 12px; background: #fff; box-shadow: var(--tblr-box-shadow-card, 0 1px 3px rgba(0, 0, 0, 0.15)); }
.t-pdf-page canvas { display: block; }
.t-pdf-note { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: var(--tblr-secondary); font-size: 0.875rem; }
</style>
